using Microsoft.Azure;
using Microsoft.Azure.Management.Resources;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Security;
using Microsoft.DataStudio.SolutionDeploymentWorker.Models;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Solutions.Tables;
using Microsoft.DataStudio.Solutions.Tables.Entities;
using Microsoft.DataStudio.WebExtensions;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Actors
{
    public abstract class DeploymentActor : ISolutionTable
    {
        protected readonly CloudTable solutionTable;
        protected readonly CloudQueue updateQueue;
        protected readonly CloudTable templateTable;
        protected readonly ILogger logger;

        protected DeploymentActor(CloudTableClient tableClient, CloudQueueClient queueClient, ILogger logger)
        {
            this.solutionTable = tableClient.GetTableReference(TableNames.Solutions);
            this.updateQueue = queueClient.GetQueueReference(CloudConfigurationManager.GetSetting("Microsoft.QueueNames.UpdateDeploymentStatus"));
            this.templateTable = tableClient.GetTableReference(TableNames.Templates);
            this.logger = logger;
        }

        // All deployment actors must implement this method
        protected abstract Task ExecuteAsyncImpl(QueueMessage message);

        public async Task ExecuteAsync(QueueMessage message)
        {
            using (new ActivityIdScope(message.TracingActivityId))
            {
                try
                {
                    var stopwatch = Stopwatch.StartNew();
                    await this.ExecuteAsyncImpl(message);
                    stopwatch.Stop();

                    this.logger.Write(TraceEventType.Verbose, "Finished processing queue message, ElapsedMilliseconds: {0}", stopwatch.ElapsedMilliseconds);
                }
                catch(Exception ex)
                {
                    this.logger.Write(TraceEventType.Error, "Failed to process queue message: {0}", ex);
                }
            }
        }
        protected async Task<ResourceManagementClient> GetClientAsync(string subscriptionId, string token)
        {
            var credentials = new TokenCloudCredentials(subscriptionId, await new SecurityHelper().Decrypt(token));
            return new ResourceManagementClient(credentials);
        }

        public async Task UpdateSolutionStatusAsync(string subscriptionId, string solutionId, string resourceGroupName,
            List<SolutionResource> updatedResources, SolutionProvisioningData updatedProvisioning, Dictionary<string, string> linkMap = null)
        {
            var solutionEntity = await GetSolutionAsync(subscriptionId, solutionId);

            var solutionResources = JsonConvert.SerializeObject(updatedResources);
            var solutionProvisioning = JsonConvert.SerializeObject(updatedProvisioning);
            var exeLinks = solutionEntity.ExeLinks;

            if (linkMap != null && linkMap.Count > 0)
            {
                exeLinks = JsonConvert.SerializeObject(linkMap);
            }

            await UpdateSolutionStatusAsync(subscriptionId, solutionId, resourceGroupName, solutionResources, solutionProvisioning,
                solutionEntity.IntermediateDeploymentState, exeLinks);
        }

        protected async Task UpdateSolutionStatusAsync(string subscriptionId, string solutionId, string resourceGroupName,
            string solutionResources, string solutionProvisioning, string intermediateDeploymentState, string linkMap)
        {
            var updatedEntity = new SolutionEntity
            {
                PartitionKey = subscriptionId,
                RowKey = solutionId,
                ResourceGroupName = resourceGroupName,
                Resources = solutionResources,
                Provisioning = solutionProvisioning,
                IntermediateDeploymentState = intermediateDeploymentState,
                ExeLinks = linkMap,
                // [TODO][parvezp]: Should this be protected for optimal concurrency?
                ETag = "*"
            };

            logger.Write(TraceEventType.Verbose, "DeploymentActor: Attempting to update solution status, subscriptionId:{0}, solutionId:{1}, resourceGroupName:{2}, solutionResources:{3}, solutionProvisioning:{4}, intermediateDeploymentState:{5}, linkMap:{6}",
                subscriptionId,
                solutionId,
                resourceGroupName,
                solutionResources,
                solutionProvisioning,
                intermediateDeploymentState,
                linkMap);

            try
            {
                TableOperation mergeOperation = TableOperation.Merge(updatedEntity);
                await this.solutionTable.ExecuteAsync(mergeOperation);
            }
            catch(StorageException se)
            {
                logger.Write(TraceEventType.Error, "DeploymentActor: Failed to update the storage table {0}", se.RequestInformation.ExtendedErrorInformation.ErrorMessage);
                throw;
            }
        }

        public async Task UpdateSolutionStatusAsync(SolutionEntity entity)
        {
            try
            {
                TableOperation mergeOperation = TableOperation.Merge(entity);
                await this.solutionTable.ExecuteAsync(mergeOperation);
            }
            catch (StorageException se)
            {
                logger.Write(TraceEventType.Error, "DeploymentActor: Failed to update the storage table {0}", se.RequestInformation.ExtendedErrorInformation.ErrorMessage);
                throw;
            }
        }

        public async Task<SolutionEntity> GetSolutionAsync(string subscriptionId, string solutionId)
        {
            var result = await this.solutionTable.ExecuteAsync(TableOperation.Retrieve<SolutionEntity>(subscriptionId, solutionId));
            return (SolutionEntity)result.Result;
        }

        protected async Task<TemplateEntity> GetTemplateAsync(string templateId)
        {
            var result = await this.templateTable.ExecuteAsync(TableOperation.Retrieve<TemplateEntity>("Templates", templateId));
            return (TemplateEntity)result.Result;
        }

        protected async Task CreateUpdateMessage(UpdateDeploymentStatusMessage message, bool deploymentComplete = false)
        {
            // Schedule update message
            var updateMessage = new UpdateDeploymentStatusMessage
            {
                SubscriptionId = message.SubscriptionId,
                SolutionId = message.SolutionId,
                UserEmail = message.UserEmail,
                UserPuid = message.UserPuid,
                ResourceManagerToken = message.ResourceManagerToken,
                ResourceGroupName = message.ResourceGroupName,
                DeploymentName = message.DeploymentName,
                DeploymentTemplateLink = message.DeploymentTemplateLink,
                DeploymentParameters = message.DeploymentParameters,
                DeploymentTemplateId = message.DeploymentTemplateId,
                Type = message.Type,
                DeploymentComplete = deploymentComplete
            };

            // TODO: [agoyal] Use exponential delays?
            await this.PushMessageToUpdateQueueAsync(updateMessage, TimeSpan.FromSeconds(2));
        }

        protected async Task PushMessageToUpdateQueueAsync(UpdateDeploymentStatusMessage message, TimeSpan delay)
        {
            var queueMessage = new UpdateQueueMessage
            {
                TracingActivityId = LogHelpers.GetCurrentActivityId(),
                Type = UpdateQueueMessageType.UpdateDeploymentStatusMessage,
                Body = JsonConvert.SerializeObject(message)
            };

            var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(queueMessage));
            await this.updateQueue.AddMessageAsync(cloudMessage,
                null /*timeToLive*/,
                delay,
                null /*options*/,
                null /*operationContext*/);
        }

        public static ProvisioningState SolutionProvisioningState(string provisioningState)
        {
            switch (provisioningState)
            {
                case "Accepted":
                case "Running":
                    return ProvisioningState.InProgress;
                case "Ready":
                case "Succeeded":
                    return ProvisioningState.Succeeded;

                case "Failed":
                    return ProvisioningState.Failed;

                default:
                    return ProvisioningState.None;
            }
        }

        protected async Task OnDeploymentFailureAsync(string subscriptionId, string solutionId, Exception exception)
        {
            try
            {
                var solution = await GetSolutionAsync(subscriptionId, solutionId);

                if (solution == null || solution.Provisioning == null)
                {
                    logger.Write(TraceEventType.Error, "DeploymentActor: Unable to access SolutionProvisioning object after deployment failure. Cannot update solution table.");
                    return;
                }

                var solutionProvisioning = JsonConvert.DeserializeObject<SolutionProvisioningData>(solution.Provisioning);

                solutionProvisioning.ProvisioningState = ProvisioningState.Failed.ToString();
                if (exception is WebException)
                    solutionProvisioning.Message = ((WebException)exception).ParseDetails();
                else
                    solutionProvisioning.Message = exception.Message;
                

                await this.UpdateSolutionStatusAsync(subscriptionId, solutionId, solution.ResourceGroupName, solution.Resources,
                    JsonConvert.SerializeObject(solutionProvisioning), solution.IntermediateDeploymentState, solution.ExeLinks);
            }
            catch(Exception ex)
            {
                logger.Write(TraceEventType.Error, "Exception while trying to update solution table on deployment failure: {0}", ex);
            }
        }
    }
}
