using Microsoft.Azure;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Models;
using Microsoft.DataStudio.Services.Security;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Solutions.Tables;
using Microsoft.DataStudio.Solutions.Tables.Entities;
using Microsoft.DataStudio.WebRole.Common.Controllers;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using mdsm = Microsoft.DataStudio.Solutions.Model;

namespace Microsoft.DataStudio.Services.Controllers
{
    // Disabling this so that a non-authenticated client can call the diagnostics api to submit logs
    //[Authorize]
    public abstract class SolutionControllerBase : ControllerBase
    {
        protected CloudQueueClient queueClient;

        public SolutionControllerBase(ILogger logger) : base(logger)
        {
            string connectionString = CloudConfigurationManager.GetSetting("Microsoft.TableStorage.ConnectionString");
            var storageAccount = CloudStorageAccount.Parse(connectionString);
            logger.Write(TraceEventType.Verbose, "SolutionController ctor: Storage account reference created");

            queueClient = storageAccount.CreateCloudQueueClient();
            logger.Write(TraceEventType.Verbose, "SolutionController ctor: Queue client created");
        }

        public async Task CheckAccessLevel(string subscriptionId, AccessLevel expectedlevel)
        {
            var actualLevel = await GetAccessToSubscriptionAsync(subscriptionId);
            if((actualLevel & expectedlevel) != expectedlevel)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }
        }

        // Since we aren't behind ARM yet as an RP, we need to do this to make sure that users attempting to access solutions within a subscription actually have access to that subscription
        // TODO: Add logs so that they go into ExternalApiCalls
        protected async Task<AccessLevel> GetAccessToSubscriptionAsync(string subscriptionId)
        {
            AccessLevel level = AccessLevel.None;
            try
            {
                string requestUri = CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.AzureResourceManagementUri")
                    + "subscriptions/" + subscriptionId
                    + "/providers/Microsoft.Authorization/permissions"
                    + "?api-version=" + CloudConfigurationManager.GetSetting("Microsoft.ApiVersions.AzureResourceManagementApiVersion");

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
                request.Method = "GET";
                request.Accept = "application/json";
                request.Headers.Add("Authorization", "Bearer " + GetToken());

                var respStr = (await request.GetResponseAsync()).GetResponseStream();
                var rdr = new StreamReader(respStr);
                var response = await rdr.ReadToEndAsync();
                var permisions = JsonConvert.DeserializeObject<Permissions>(response);
                if (permisions != null)
                {
                    var value = permisions.Value != null && permisions.Value.Count > 0 ? permisions.Value[0] : null;
                    if (value != null && value.Actions != null)
                    {
                        level = value.Actions.Exists(a => (a == "*" || 0 == string.Compare(a, "write", true))) == true ? AccessLevel.ReadWrite
                            : value.Actions.Exists(a => (0 == string.Compare(a, "read", true))) == true ? AccessLevel.Read
                            : AccessLevel.None;
                    }

                    if(level == AccessLevel.None)
                    {
                        logger.Write(TraceEventType.Information, "An user attempted to access solutions in a subscription for which there is no read/write access, subscriptionId:{0}", subscriptionId);
                    }
                }
            }
            catch (WebException ex)
            {
                HttpWebResponse errorResponse = (HttpWebResponse)ex.Response;
                string responseText = new StreamReader(errorResponse.GetResponseStream()).ReadToEnd();
                dynamic obj = JsonConvert.DeserializeObject(responseText);
                string errorMessage = (string)obj.error.message;

                logger.Write(TraceEventType.Warning, "Exception while trying to get access level for an user, subscriptionId:{0}, armResponseCode:{1}, armErrorMessage:{2}",
                    subscriptionId,
                    errorResponse.StatusCode.ToString(),
                    errorMessage);
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Warning, "Exception while trying to get access level for an user, subscriptionId:{0}, error message:{1}",
                    subscriptionId,
                    ex);
            }

            return level;
        }

        protected async Task<List<string>> GetSubscriptionsForCurrentTenant()
        {
            List<string> subscriptionIds = new List<string>();
            try
            {
                string requestUri = CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.AzureResourceManagementUri")
                    + "subscriptions"
                    + "?api-version=" + CloudConfigurationManager.GetSetting("Microsoft.ApiVersions.AzureResourceManagementApiVersion");

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUri);
                request.Method = "GET";
                request.Accept = "application/json";
                request.Headers.Add("Authorization", "Bearer " + GetToken());

                var respStr = (await request.GetResponseAsync()).GetResponseStream();
                var rdr = new StreamReader(respStr);
                var response = await rdr.ReadToEndAsync();
                var subscriptions = JsonConvert.DeserializeObject<Subscriptions>(response);
                if (subscriptions != null)
                {
                    if(subscriptions.Value != null)
                    {
                        foreach(var subscription in subscriptions.Value)
                        {
                            subscriptionIds.Add(subscription.SubscriptionId);
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                HttpWebResponse errorResponse = (HttpWebResponse)ex.Response;
                string responseText = new StreamReader(errorResponse.GetResponseStream()).ReadToEnd();
                dynamic obj = JsonConvert.DeserializeObject(responseText);
                string errorMessage = (string)obj.error.message;

                logger.Write(TraceEventType.Warning, "Exception while trying to get list of subscriptions an user, armResponseCode:{0}, armErrorMessage:{1}",
                    errorResponse.StatusCode.ToString(),
                    errorMessage);
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Warning, "Exception while trying to get list of subscriptions an user, error message:{0}",
                    ex);
            }

            return subscriptionIds;
        }

        protected string GetToken()
        {
            return Request.Headers.Authorization.Parameter;
        }

        protected async Task<IHttpActionResult> PostMessageToQueue(string subscriptionId, SolutionDeployParameters parameters, string queueName, DeploymentType deploymentType = DeploymentType.ARM)
        {
            string userToken = GetToken();

            SolutionEntity solutionEntity = null;
            if (!Debugger.IsAttached && await SolutionExists(parameters.SolutionId, subscriptionId))
            {
                if (deploymentType == DeploymentType.WorkFlow || parameters.Properties == null)
                {
                    logger.Write(TraceEventType.Information, "HttpPost Deployment: Solution with name {0} already exists", parameters.SolutionId);
                    return BadRequest(string.Format("The solution by the name: {0} already exists for this subscription", parameters.SolutionId));
                }
                else 
                {
                    var solutionTableStorage = GetSolutionTableStorage(subscriptionId);
                    solutionEntity = await solutionTableStorage.GetAsync(parameters.SolutionId);
                }
            }

            // TODO [agoyal] think about resource group naming convention.
            var resourceGroupName = parameters.SolutionId + "_ResourceGroup";
            Guid activityId = LogHelpers.GetCurrentActivityId();
            var deploymentName =  activityId.ToString();
            if(deploymentType == DeploymentType.ARM && !string.IsNullOrEmpty(parameters.DeploymentName) )
            {
                deploymentName = parameters.DeploymentName;
            }

            // Create a initial Provisioning data so that the first start received by client is not null
            var provisioningData = new SolutionProvisioningData
            {
                Message = "Received the deployment request",
                ProvisioningState = mdsm.ProvisioningState.InProgress.ToString(),
                DeploymentName = deploymentName
            };

            var serializedProvisioning = JsonConvert.SerializeObject(provisioningData);

            if (solutionEntity == null)
            {
                string templateId = string.Empty;
                if(parameters.TemplateId != null)
                {
                    templateId = parameters.TemplateId.Split('_')[0];
                }

                solutionEntity = new SolutionEntity
                {
                    PartitionKey = subscriptionId,
                    RowKey = parameters.SolutionId,
                    Resources = "[]",
                    Provisioning = serializedProvisioning,
                    ResourceGroupName = resourceGroupName,
                    TemplateId = templateId,
                    MachineLearningResource = ""
                };
            }
            else
            {
                solutionEntity.Provisioning = serializedProvisioning;
            }

            // TODO [agoyal] Adding to the queue and updating the table should be transactional.
            var solutionTable = GetSolutionTableStorage(subscriptionId);
            await solutionTable.InsertOrUpdateAsync(solutionEntity);

            logger.Write(TraceEventType.Verbose, "HttpPost Deployment: Updated the solution table with partitionkey: {0}, rowkey: {1}, subscriptionId: {2}", solutionEntity.PartitionKey, solutionEntity.RowKey, subscriptionId);

            // If we are deploying based on DeploymentProperties then adjust the parameters to be part of those properties
            if (parameters.Properties != null && deploymentType == DeploymentType.WorkFlow)
            {
                Dictionary<string, Parameter<string>> deployParameters = new Dictionary<string, Parameter<string>>();

                // These are required parameters that all the workflow templates will need and can't be provided by author or the templates
                deployParameters.Add("token", new Parameter<string>
                {
                    Value = userToken
                });

                deployParameters.Add("subscriptionId", new Parameter<string>
                {
                    Value = subscriptionId
                });

                //deployParameters.Add("deploymentName", new Parameter<string>
                //{
                //    Value = activityId.ToString()
                //});

                deployParameters.Add("resourceGroupName", new Parameter<string>
                {
                    Value = resourceGroupName
                });

                deployParameters.Add("solutionId", new Parameter<string>
                {
                    Value = parameters.SolutionId
                });

                deployParameters.Add("userPuid", new Parameter<string>
                {
                    Value = parameters.UserPuid
                });

                deployParameters.Add("userEmail", new Parameter<string>
                {
                    Value = parameters.UserEmail
                });

                //Copy the parameters passed in by the client to list of parameters that authors of templates
                //might have provided to create a complete list of parameters that will be used during deployment
                if (parameters.TemplateParameters != null)
                {
                    var templateParams = JsonConvert.DeserializeObject<Dictionary<string, Parameter<string>>>(parameters.TemplateParameters);

                    foreach (var key in templateParams.Keys)
                    {
                        var value = templateParams[key];
                        // Should we not overwrite these values if provided by the client?
                        if (deployParameters.ContainsKey(key))
                        {
                            var oldValue = deployParameters[key];
                            logger.Write(TraceEventType.Warning, "Overwriting the parameter name: {0} with default value {1} to value from template parameters {2}", key, oldValue, value);
                            deployParameters[key] = value;
                        }
                        else
                        {
                            deployParameters.Add(key, value);
                        }
                    }
                }

                parameters.Properties.Parameters = JsonConvert.SerializeObject(deployParameters, new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });  
            }

            var createDeploymentMessage = new CreateDeploymentMessage
            {
                SubscriptionId = subscriptionId,
                SolutionId = parameters.SolutionId,
                UserEmail = parameters.UserEmail,
                UserPuid = parameters.UserPuid,
                ResourceManagerToken = await new SecurityHelper().Encrypt(userToken),
                ResourceGroupName = resourceGroupName,
                DeploymentName = deploymentName, // TODO rskumar: Should we instead add a DeploymentId field and give the DeploymentName field a more meaningful value?
                DeploymentTemplateId = parameters.TemplateId,
                Properties = parameters.Properties,
                DeploymentParameters = await new SecurityHelper().EncryptPassword(parameters.TemplateParameters),
                Type = deploymentType
            };

            var queue = queueClient.GetQueueReference(CloudConfigurationManager.GetSetting(queueName));
            await QueueRequest(queue, createDeploymentMessage);

            return this.Ok(SolutionFromSolutionEntity(solutionEntity));
        }

        protected async Task<bool> SolutionExists(string solutionId, string subscriptionId)
        {
            List<Solution> solutions = await GetSolutions(subscriptionId) as List<Solution>;
            if (solutions.Find(s => s.RowKey == solutionId) == null)
            {
                return false;
            }
            return true;
        }

        // TODO [agoyal] extract to factory and track lifecycle.
        protected static SolutionTableManager GetSolutionTableStorage(string subscriptionId)
        {
            return new SolutionTableManager(subscriptionId, CloudConfigurationManager.GetSetting("Microsoft.TableStorage.ConnectionString"));
        }

        protected static TemplateTableManager GetTemplatesTableStorage()
        {
            return new TemplateTableManager(CloudConfigurationManager.GetSetting("Microsoft.TableStorage.ConnectionString"));
        }

        protected async Task<IEnumerable<Solution>> GetSolutions(string subscriptionId)
        {
            var solutionTableStorage = GetSolutionTableStorage(subscriptionId);

            IEnumerable<SolutionEntity> solutionEntities = await solutionTableStorage.GetAsync();
            List<Solution> solutions = new List<Solution>();
            foreach (var solutionEntity in solutionEntities)
            {
                if (solutionEntity.Provisioning != null)
                {
                    var provisioningData = JsonConvert.DeserializeObject<SolutionProvisioningData>(solutionEntity.Provisioning);
                    if (provisioningData.ProvisioningState != mdsm.ProvisioningState.Deleted.ToString())
                    {
                        solutions.Add(SolutionFromSolutionEntity(solutionEntity));
                    }
                }
                else
                {
                    solutions.Add(SolutionFromSolutionEntity(solutionEntity));
                }
            }
            return solutions;
        }

        protected async Task QueueRequest(CloudQueue queue, CreateDeploymentMessage message)
        {
            var queueMessage = new CreateQueueMessage
            {
                TracingActivityId = LogHelpers.GetCurrentActivityId(),
                Type = CreateQueueMessageType.CreateDeploymentMessage,
                Body = JsonConvert.SerializeObject(message)
            };

            logger.Write(TraceEventType.Verbose, "Queuing the request to queue: {0} for message type: {1}", queue.Name, queueMessage.Type.ToString());
            await QueueRequest(queue, queueMessage);
        }

        protected async Task QueueRequest(CloudQueue queue, DeleteDeploymentMessage message)
        {
            var queueMessage = new DeleteQueueMessage
            {
                TracingActivityId = LogHelpers.GetCurrentActivityId(),
                Type = DeleteQueueMessageType.DeleteDeploymentMessage,
                Body = JsonConvert.SerializeObject(message)
            };

            logger.Write(TraceEventType.Verbose, "Queuing the request to queue: {0} for message type: {1} and message: {2}", queue.Name, queueMessage.Type.ToString(), queueMessage.Body);
            await QueueRequest(queue, queueMessage);
        }

        protected async Task QueueRequest(CloudQueue queue, QueueMessage message)
        {
            var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(message));
            await queue.AddMessageAsync(cloudMessage);
        }

        protected static Solution SolutionFromSolutionEntity(SolutionEntity solutionEntity)
        {
            // In order to preserver exisiting solutions from deserializing a null, setting the new parameter to empty string at creation time
            if(solutionEntity.MachineLearningResource == null)
            {
                solutionEntity.MachineLearningResource = string.Empty;
            }

            return new Solution
            {
                TemplatedId = solutionEntity.TemplateId,
                ResourceGroupName = solutionEntity.ResourceGroupName,
                Resources = JsonConvert.DeserializeObject<List<SolutionResource>>(solutionEntity.Resources),
                Provisioning = JsonConvert.DeserializeObject<SolutionProvisioningData>(solutionEntity.Provisioning),
                MLResource = JsonConvert.DeserializeObject<MachineLearningResource>(solutionEntity.MachineLearningResource),
                ExeLinks = solutionEntity.ExeLinks,
                RowKey = solutionEntity.RowKey,
                ETag = solutionEntity.ETag,
                PartitionKey = solutionEntity.PartitionKey
            };
        }
    }
}