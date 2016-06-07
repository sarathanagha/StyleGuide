using Microsoft.Azure;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Security;
using Microsoft.DataStudio.SolutionDeploymentWorker.MachineLearning;
using Microsoft.DataStudio.SolutionDeploymentWorker.Models;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Actors
{
    public class PostDeploymentActor : DeploymentActor
    {
        private readonly CloudQueue createQueue = null;
        private readonly CloudQueue mlQueue = null;

        private delegate Task TMessageHandler<TMessage>(TMessage message);
        private const int IdleSleepInterval = 1000; // 1 sec

        public PostDeploymentActor(CloudTableClient tableClient, CloudQueueClient queueClient, ILogger logger)
            : base(tableClient, queueClient, logger)
        {
            this.createQueue = queueClient.GetQueueReference(CloudConfigurationManager.GetSetting("Microsoft.QueueNames.CreateDeployment"));
            this.mlQueue = queueClient.GetQueueReference(CloudConfigurationManager.GetSetting("Microsoft.QueueNames.MLDeploymentRequests"));
        }

        protected override async Task ExecuteAsyncImpl(QueueMessage queueMessage)
        {
            var message = (UpdateQueueMessage)queueMessage;

            try
            {
                await HandleMessageAsync(message);
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, "PostDeploymentActor: Exception while processing message Type: {0}, error: {1}",
                    message.Type.ToString(), ex);
            }
        }

        private async Task HandleMessageAsync(UpdateQueueMessage queueMessage)
        {
            switch (queueMessage.Type)
            {
                case UpdateQueueMessageType.PartOneDeploymentComplete:
                    await HandleMessageAsync<UpdateDeploymentStatusMessage>(queueMessage, HandleMessageAsync);
                    break;

                case UpdateQueueMessageType.MLDeploymentComplete:
                    await HandleMessageAsync<MLDeploymentCompleteMessage>(queueMessage, HandleMessageAsync);
                    break;

                case UpdateQueueMessageType.PartTwoDeploymentRequest:
                    await HandleMessageAsync<PartTwoDeploymentRequestMessage>(queueMessage, HandleMessageAsync);
                    break;

                default:
                    throw new Exception("Unsupported UpdateQueueMessage.Type");
            }
        }

        private async Task HandleMessageAsync<TMessage>(UpdateQueueMessage queueMessage, TMessageHandler<TMessage> handler)
            where TMessage : IDeploymentMessage
        {
            TMessage message = default(TMessage);

            Exception exception = null;

            try
            {
                message = JsonConvert.DeserializeObject<TMessage>(queueMessage.Body);
                await handler(message);
            }
            catch (Exception ex)
            {
                exception = ex;
            }

            if (exception != null)
            {
                logger.Write(TraceEventType.Error, "PostDeploymentActor: Exception while processing message Type: {0}, exceptionMessage: {1} exceptionStackTrace : {2}",
                    queueMessage.Type.ToString(), exception);

                if (message != null)
                    await this.OnDeploymentFailureAsync(message.SubscriptionId, message.SolutionId, exception);
            }
        }

        public async Task HandleMessageAsync(UpdateDeploymentStatusMessage message)
        {
            var outputs = JsonConvert.DeserializeObject<DeploymentOutputs>(message.DeploymentOutputs);

            var config = await DoIntermediateDeploymentWorkAsync(message, outputs);

            if (outputs.MLExperiments == null)
            {
                var linkMap = await ExecuteDataGenerator(config);
                await SchedulePartTwoDeploymentMessageAsync(new PartTwoDeploymentRequestMessage
                {
                    DeploymentName = message.DeploymentName,
                    DeploymentOutputs = message.DeploymentOutputs,
                    DeploymentParameters = message.DeploymentParameters,
                    DeploymentTemplateId = message.DeploymentTemplateId,
                    DeploymentTemplateLink = message.DeploymentTemplateLink,
                    ExeLinks = linkMap,
                    ResourceGroupName = message.ResourceGroupName,
                    ResourceManagerToken = message.ResourceManagerToken,
                    SolutionId = message.SolutionId,
                    SubscriptionId = message.SubscriptionId,
                    UserEmail = message.UserEmail
                });
            }
            else
            {
                await SaveIntermediateDeploymentStateAsync(message, config);

                await ScheduleMLDeploymentMessageAsync(message);
            }
        }

        public async Task HandleMessageAsync(MLDeploymentCompleteMessage message)
        {
            var solutionEntity = await GetSolutionAsync(message.SubscriptionId, message.SolutionId);

            var intermediateDeploymentState = JsonConvert.DeserializeObject<IntermediateDeploymentState>(solutionEntity.IntermediateDeploymentState);

            var dataGenConfig = intermediateDeploymentState.DataGenConfig;

            dataGenConfig.MLServiceLocation = message.MLWebServiceApiLocation;
            dataGenConfig.MLEndpointKey = message.MLWebServicePrimaryKey;

            var updateMessage = intermediateDeploymentState.UpdateMessage;
            var linkMap = await ExecuteDataGenerator(dataGenConfig);

            await SchedulePartTwoDeploymentMessageAsync(new PartTwoDeploymentRequestMessage
            {
                DeploymentName = updateMessage.DeploymentName,
                DeploymentOutputs = updateMessage.DeploymentOutputs,
                DeploymentParameters = updateMessage.DeploymentParameters,
                DeploymentTemplateId = updateMessage.DeploymentTemplateId,
                DeploymentTemplateLink = updateMessage.DeploymentTemplateLink,
                ExeLinks = linkMap,
                MLWebServiceBatchLocation = message.MLWebServiceBatchLocation,
                MLWebServicePrimaryKey = message.MLWebServicePrimaryKey,
                ResourceGroupName = updateMessage.ResourceGroupName,
                ResourceManagerToken = message.ResourceManagerToken,
                SolutionId = message.SolutionId,
                SubscriptionId = message.SubscriptionId,
                UserEmail = message.UserEmail,
                UserPuid = message.UserPuid
            });
        }

        private async Task<Dictionary<string, string>> ExecuteDataGenerator(Configuration dataGenConfig)
        {
            var dataGenBundles = new DataGenBundleActor(this.logger);
            Dictionary<string, string> linkMap = new Dictionary<string, string>();
            if (dataGenConfig.Generators != null)
            {
                foreach (var app in dataGenConfig.Generators.GeneratorNames)
                {
                    
                    linkMap[app.Name] = await dataGenBundles.GenerateZipAndGetSASTokenizedUrl(app, dataGenConfig);
                }
            }
            return linkMap;
        }

        public async Task HandleMessageAsync(PartTwoDeploymentRequestMessage message)
        {
            if (message.DeploymentParameters != null)
            {
                var deployParams = JsonConvert.DeserializeObject<DeploymentParameter>(message.DeploymentParameters);
                if (!string.IsNullOrEmpty(message.MLWebServiceBatchLocation))
                {
                    deployParams.mLEndpointBatchLocation = new Parameter<string>
                    {
                        Value = message.MLWebServiceBatchLocation
                    };
                }
                if (!string.IsNullOrEmpty(message.MLWebServicePrimaryKey))
                {
                    deployParams.mLEndpointKey = new Parameter<string>
                    {
                        Value = message.MLWebServicePrimaryKey
                    };
                }
                
                var now = DateTime.UtcNow;
                // Create the time which is rounded off to 1st of the current month
                DateTime endTime = new DateTime(now.Year, now.Month, 1);

                deployParams.startTime = new Parameter<string>
                {
                    // For the datafacotry we need set the start time one year from now.
                    Value = endTime.AddYears(-1).ToString("yyyy-MM-ddTHH:mm:ssZ")
                };
                deployParams.endTime = new Parameter<string>
                {
                    Value = endTime.ToString("yyyy-MM-ddTHH:mm:ssZ")
                };
                // TODO (jariek): These are temporary until we have a way to
                // custom define the start and end times for a template.
                now = now.AddMinutes(now.Minute * -1);
                // now = now.AddHours(1);
                now = now.AddSeconds(now.Second * -1);
                now = now.AddMilliseconds(now.Millisecond * -1);

                deployParams.nowTime = new Parameter<string>
                {
                    Value = now.ToString("yyyy-MM-ddTHH:mm:ssZ")
                };
                deployParams.nowPlusTenYearsTime = new Parameter<string>
                {
                    Value = now.AddYears(10).ToString("yyyy-MM-ddTHH:mm:ssZ")
                };

                message.DeploymentParameters = JsonConvert.SerializeObject(deployParams, new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
            }

            await UpdateProvisioningStatusAndClearIntermediateDeploymentStateAsync(message, "Uploaded data to the storage account", message.ExeLinks);

            var newDeploymentId = message.DeploymentTemplateId.Replace("_part1", "_part2");

            // Create Part 2 of the SolutionAccelerator deployment and submit it to the queue.

            var createDeploymentMessage = new CreateDeploymentMessage
            {
                SubscriptionId = message.SubscriptionId,
                SolutionId = message.SolutionId,
                UserEmail = message.UserEmail,
                UserPuid = message.UserPuid,
                ResourceManagerToken = message.ResourceManagerToken,
                ResourceGroupName = message.ResourceGroupName,
                DeploymentName = message.DeploymentName,
                DeploymentTemplateId = newDeploymentId,
                DeploymentParameters = message.DeploymentParameters,
            };

            logger.Write(TraceEventType.Information, "PostDeploymentActor: Scheduling second part of ARM template deployment, subscriptionId: {0}, solutionId: {1}, deploymentTemplateId: {2}",
                message.SubscriptionId,
                message.SolutionId,
                newDeploymentId);

            var createQueueMessage = new CreateQueueMessage
            {
                TracingActivityId = LogHelpers.GetCurrentActivityId(),
                Type = CreateQueueMessageType.CreateDeploymentMessage,
                Body = JsonConvert.SerializeObject(createDeploymentMessage)
            };

            var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(createQueueMessage));
            await this.createQueue.AddMessageAsync(cloudMessage);
        }

        private async Task UpdateProvisioningStatusAndClearIntermediateDeploymentStateAsync(PartTwoDeploymentRequestMessage message, string newProvisioningStatus, Dictionary<string, string> linkMap)
        {
            var solutionEntity = await GetSolutionAsync(message.SubscriptionId, message.SolutionId);
            var solutionProvisioning = JsonConvert.DeserializeObject<SolutionProvisioningData>(solutionEntity.Provisioning);

            solutionProvisioning.Message = newProvisioningStatus;

            await this.UpdateSolutionStatusAsync(message.SubscriptionId,
                message.SolutionId,
                message.ResourceGroupName,
                solutionEntity.Resources,
                JsonConvert.SerializeObject(solutionProvisioning),
                string.Empty /*IntermediateDeploymentState*/,
                JsonConvert.SerializeObject(linkMap));
        }

        private async Task SaveIntermediateDeploymentStateAsync(UpdateDeploymentStatusMessage updateMessage, Configuration dataGenConfig)
        {
            var solutionEntity = await GetSolutionAsync(updateMessage.SubscriptionId, updateMessage.SolutionId);

            var intermediateDeploymentState = new IntermediateDeploymentState
            {
                UpdateMessage = updateMessage,
                DataGenConfig = dataGenConfig
            };

            await UpdateSolutionStatusAsync(updateMessage.SubscriptionId,
                updateMessage.SolutionId,
                updateMessage.ResourceGroupName,
                solutionEntity.Resources,
                solutionEntity.Provisioning,
                JsonConvert.SerializeObject(intermediateDeploymentState),
                null);
        }

        private async Task SchedulePartTwoDeploymentMessageAsync(PartTwoDeploymentRequestMessage message)
        {
            logger.Write(TraceEventType.Information, "PostDeploymentActor: Scheduling Part Two deployment message, subscriptionId: {0}, solutionId: {1}",
                message.SubscriptionId, message.SolutionId);

            var queueMessage = new UpdateQueueMessage
            {
                TracingActivityId = LogHelpers.GetCurrentActivityId(),
                Type = UpdateQueueMessageType.PartTwoDeploymentRequest,
                Body = JsonConvert.SerializeObject(message)
            };

            var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(queueMessage));
            await this.updateQueue.AddMessageAsync(cloudMessage);
        }

        private async Task ScheduleMLDeploymentMessageAsync(UpdateDeploymentStatusMessage message)
        {
            var outputs = JsonConvert.DeserializeObject<DeploymentOutputs>(message.DeploymentOutputs);

            ThrowIf.Null(outputs.StorageAccountName, "outputs.StorageAccountName");
            ThrowIf.Null(outputs.StorageAccountConnectionString, "outputs.StorageAccountConnectionString");

            var connectionString = outputs.StorageAccountConnectionString.Value;
            var values = connectionString.Split(';');
            var storageAccountKey = values[2].Substring(values[2].IndexOf('=') + 1);

            Guid operationId = Guid.NewGuid(); // available to the client as SolutionResource.OperationId
            var mlLinks = outputs.MLExperiments.Value;
            var trainingExperiment = mlLinks.TrainingExperiment;
            var scoringExperiment = mlLinks.ScoringExperiment;
            logger.Write(TraceEventType.Information, "PostDeploymentActor: Scheduling ML deployment message, subscriptionId: {0}, solutionId: {1}, trainingExperimentPackageLocation: {2}, scoringExperimentPackageLocation: {3}",
                message.SubscriptionId,
                message.SolutionId,
                trainingExperiment,
                scoringExperiment);

            var deploymentParams = new MLBeginDeploymentMessage
            {
                OperationId = operationId.ToString(),
                SolutionId = message.SolutionId,
                SubscriptionId = message.SubscriptionId,
                ResourceManagerToken = message.ResourceManagerToken,
                ResourceGroupName = message.ResourceGroupName,
                StorageAccountName = outputs.StorageAccountName.Value,
                StorageAccountKey = storageAccountKey,
                UserEmail = message.UserEmail,
                UserPuid = message.UserPuid,
                Location = CloudConfigurationManager.GetSetting("Microsoft.MachineLearning.WorkspaceLocation"),
                TrainingExperimentPackageLocation = trainingExperiment,
                TrainingCommunityUri = mlLinks.TrainingCommunityUri,
                ScoringExperimentPackageLocation = scoringExperiment,
                ScoringCommunityUri = mlLinks.ScoringCommunityUri
            };

            var mlQueueMessage = new MLQueueMessage
            {
                TracingActivityId = LogHelpers.GetCurrentActivityId(),
                Type = MLQueueMessageType.BeginDeploymentRequest,
                Body = JsonConvert.SerializeObject(deploymentParams)
            };

            var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(mlQueueMessage));
            await this.mlQueue.AddMessageAsync(cloudMessage);
        }

        private async Task<Configuration> DoIntermediateDeploymentWorkAsync(UpdateDeploymentStatusMessage updateMessage, DeploymentOutputs outputs)
        {
            var ingestEventHubName = outputs.IngestEventHubName != null ? outputs.IngestEventHubName.Value : "";
            var publishEventHubName = outputs.PublishEventHubName != null ? outputs.PublishEventHubName.Value : "";
            var eventHubName = outputs.EventHubName != null ? outputs.EventHubName.Value : "";
            var eventHubConnString = outputs.EventHubConnectionString != null ? outputs.EventHubConnectionString.Value : "";
            string storageConnString = string.Empty;

            if (outputs.StorageAccountConnectionString != null)
            {
                storageConnString = outputs.StorageAccountConnectionString.Value;
                // Create a blob storage container if doesn't exists
                var blobClient = CloudStorageAccount.Parse(storageConnString).CreateCloudBlobClient();
                var connectionString = CloudConfigurationManager.GetSetting("Microsoft.TableStorage.ConnectionString");
                // [parvezp] Hack because currently when using local dev storage the copy step fails with 404
                // I have asked the Storage team why this is happening and will remove this hack once have a 
                // real solution in place
                if(connectionString.Contains("UseDevelopmentStorage=true"))
                {
                    connectionString = CloudConfigurationManager.GetSetting("Microsoft.BlobStorage.ConnectionString");
                }

                var sourceStorageAccount = CloudStorageAccount.Parse(connectionString);

                //ScripContainer is required
                if (outputs.ScriptContainerName != null && !string.IsNullOrEmpty(outputs.ScriptContainerName.Value))
                {
                    var containerName = outputs.ScriptContainerName.Value;

                    CloudBlobContainer destinationContainer = await CreateContainerAsync(blobClient, containerName);
                    var sourceContainer = sourceStorageAccount.CreateCloudBlobClient().GetContainerReference(containerName);
                    bool sourceContainerExists = await sourceContainer.ExistsAsync();

                    if (sourceContainerExists)
                    {
                        var sourceBlobs = sourceContainer.ListBlobs(null, true);

                        foreach (var src in sourceBlobs)
                        {
                            var srcBlob = src as CloudBlob;

                            // Create appropriate destination blob type to match the source blob
                            CloudBlob destBlob;
                            if (srcBlob.Properties.BlobType == BlobType.BlockBlob)
                            {
                                destBlob = destinationContainer.GetBlockBlobReference(srcBlob.Name);
                            }
                            else
                            {
                                destBlob = destinationContainer.GetPageBlobReference(srcBlob.Name);
                            }

                            try
                            {
                                await destBlob.StartCopyAsync(new Uri(srcBlob.Uri.AbsoluteUri));
                                if (destBlob.Name.Contains(outputs.SqlScript.Value))
                                {
                                    await RunSqlScript(updateMessage, outputs, srcBlob.Uri.AbsoluteUri.ToString());
                                }
                            }
                            catch (Exception ex)
                            {
                                logger.Write(TraceEventType.Error, "PostDeploymentActor: Exception copying blob {0}: {1}", srcBlob.Uri.AbsoluteUri, ex);
                                throw; // re-throwing so that we can catch the exception and top-level and stop monitoring the deployment 
                            }
                        }
                    }
                    else
                    {
                        throw new Exception(string.Format("PostDeploymentActor: source container with name: {0} doesn't exists", containerName));
                    }
                }
                else
                {
                    throw new Exception("PostDeploymentActor: ScriptContianer name is required");
                }

                // DataContainer is optional
                if (outputs.DataContainerName != null && !string.IsNullOrEmpty(outputs.DataContainerName.Value))
                {
                    await CreateContainerAsync(blobClient, outputs.DataContainerName.Value);
                }
            }

            return new Configuration
            {
                IngestEventHubName = ingestEventHubName,
                PublishEventHubName = publishEventHubName,
                EventHubName = eventHubName,
                EventHubConnectionString = eventHubConnString,
                StorageAccountConnectionString = storageConnString,
                Generators = outputs.DataGenerator != null ? outputs.DataGenerator.Value : null
            };
        }

        private async Task<CloudBlobContainer> CreateContainerAsync(CloudBlobClient blobClient, string containerName)
        {
            CloudBlobContainer destinationContainer = blobClient.GetContainerReference(containerName);
            await destinationContainer.CreateIfNotExistsAsync();
            await destinationContainer.SetPermissionsAsync(new BlobContainerPermissions
            {
                PublicAccess = BlobContainerPublicAccessType.Off
            });

            return destinationContainer;
        }

        private async Task RunSqlScript(UpdateDeploymentStatusMessage updateMessage, DeploymentOutputs outputs, string scriptUrl)
        {
            try
            {
                HttpWebRequest dbScriptRequest = (HttpWebRequest)WebRequest.Create(scriptUrl);
                var respStr = (await dbScriptRequest.GetResponseAsync()).GetResponseStream();
                var rdr = new StreamReader(respStr);
                var sqlScript = await rdr.ReadToEndAsync();
                var scripts = sqlScript.Split(new string[] { "GO", "go", "Go", "gO" }, StringSplitOptions.RemoveEmptyEntries);

                if (scripts.Length == 0)
                {
                    throw new Exception(string.Format("The sql script file with name: {0} is empty", scriptUrl));
                }

                // Decrypt the password just before creating a sql connection to run the script
                var parameters = JsonConvert.DeserializeObject<DeploymentParameter>(await new SecurityHelper().DecryptPassword(updateMessage.DeploymentParameters));

                var connectionBuilder = CreateConnectionStringBuilder(parameters.sqlServerName.Value, outputs.DatabaseName.Value, parameters.sqlServerUserName.Value, parameters.sqlServerPassword.Value);
                
                logger.Write(TraceEventType.Information, "PostDeploymentActor: Attempting to run sql script, serverName: {0}, databaseName: {1}",
                    parameters.sqlServerName.Value, outputs.DatabaseName.Value);

                using (var connection = new SqlConnection(connectionBuilder.ConnectionString))
                {
                    await connection.OpenAsync();
                    foreach (var script in scripts)
                    {
                        using (var command = new SqlCommand(script, connection))
                        {
                            await command.ExecuteNonQueryAsync();
                        }
                    }
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, "SqlError: {0}", ex.ToString());
                throw; // re-throwing so that we can catch the exception and top-level and stop monitoring the deployment 
            }
        }

        private static SqlConnectionStringBuilder CreateConnectionStringBuilder(string server, string database, string username, string password)
        {
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.DataSource = server + CloudConfigurationManager.GetSetting("Microsoft.SqlServer.Import.Suffix");
            builder.InitialCatalog = database;
            builder.UserID = username;
            builder.Password = password;
            builder.TrustServerCertificate = false; //TODO: [parvezp] Do we need to make this true in future?
            builder.Encrypt = true;
            return builder;
        }

    }
}
