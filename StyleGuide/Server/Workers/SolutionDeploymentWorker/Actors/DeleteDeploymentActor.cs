using Microsoft.Azure;
using Microsoft.Azure.Management.Resources;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.MachineLearning;
using Microsoft.DataStudio.SolutionDeploymentWorker.MachineLearning;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Solutions.Tables.Entities;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using mdsm = Microsoft.DataStudio.Solutions.Model;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Actors
{
    public class DeleteDeploymentActor : DeploymentActor
    {
        private readonly IApiCallsLogger apiCallsLogger;

        public DeleteDeploymentActor(CloudTableClient tableClient, CloudQueueClient queueClient, ILogger logger)
            : base(tableClient, queueClient, logger)
        {
            this.apiCallsLogger = new ApiCallsLogger();
        }

        protected override async Task ExecuteAsyncImpl(QueueMessage queueMessage)
        {
            try
            {
                var message = (DeleteQueueMessage)queueMessage;
                if (message.Type != DeleteQueueMessageType.DeleteDeploymentMessage)
                {
                    throw new Exception("QueueMessageType must be DeleteDeploymentMessage!");
                }
                
                var deleteDeploymentMessage = JsonConvert.DeserializeObject<DeleteDeploymentMessage>(message.Body);

                // Turns out deleting the resource group doesn't delete the ML workspace that we created as part of deployment, so delete them here
                bool fMLDeletionSucceeded = await FDeleteMLWorkspacesAsync(deleteDeploymentMessage);

                bool fResourceGroupDeletionSucceeded = await DeleteResourceGroupAsync(deleteDeploymentMessage, fMLDeletionSucceeded);

                await MarkSolutionStatusAsync(deleteDeploymentMessage, fResourceGroupDeletionSucceeded, fMLDeletionSucceeded);
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, "DeleteDeploymentActor: Exception while processing DeleteDeploymentMessage: {0}", ex);
            }
        }

        private async Task<bool> FDeleteMLWorkspacesAsync(DeleteDeploymentMessage message)
        {
            bool fOverallDeleteSucceeded = true;

            try
            {
                var mlClient = new MLApiClient(
                    CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.WindowsManagementUri"),
                    CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.AzuremlManagementUri"),
                    CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.StudioApiUri"),
                    message.ResourceManagerToken,
                    Guid.Parse(message.SubscriptionId),
                    this.logger,
                    this.apiCallsLogger);

                var solution = await this.GetSolutionAsync(message.SubscriptionId, message.SolutionId);

                var solutionResources = JsonConvert.DeserializeObject<List<SolutionResource>>(solution.Resources);
                foreach (var solutionResource in solutionResources)
                {
                    if (solutionResource.ResourceType.Equals(MLDeploymentStatusUpdater.s_mlResourceType))
                    {
                        // This is an ML workspace to be deleted

                        var statusUpdater = new MLDeploymentStatusUpdater(
                            message.SubscriptionId,
                            message.SolutionId,
                            solution.ResourceGroupName,
                            solutionResource.OperationId,
                            this);

                        string workspaceId = solutionResource.ResourceId;
                        if (string.IsNullOrEmpty(workspaceId))
                        {
                            throw new Exception("Invalid value for workspaceId within the SolutionResource!");
                        }

                        await statusUpdater.BeginWorkspaceDeletionAsync(workspaceId);

                        bool fDeleteSucceeded = await FDeleteMLWorkspaceAsync(workspaceId, mlClient);

                        if (!fDeleteSucceeded) // Mark the overall status failed if one of the operations fail
                        {
                            fOverallDeleteSucceeded = false;
                        }

                        await statusUpdater.EndWorkspaceDeletionAsync(workspaceId, fDeleteSucceeded);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, "DeleteDeploymentActor: Caught exception while deleting ML workspaces: {0}", ex);
                fOverallDeleteSucceeded = false;
            }

            return fOverallDeleteSucceeded;
        }

        private async Task<bool> FDeleteMLWorkspaceAsync(string workspaceId, MLApiClient client)
        {
            bool fDeleteSucceeded = false;

            try
            {
                await client.DeleteWorkspaceIfExistsAsync(workspaceId);
                fDeleteSucceeded = true;
            }
            catch (WebException ex)
            {
                HttpWebResponse errorResponse = (HttpWebResponse)ex.Response;
                if (errorResponse == null)
                {
                    logger.Write(TraceEventType.Error, "HttpWebResponse is unexpectedly NULL for this WebException: {0}", ex);
                }
                else
                {
                    logger.Write(TraceEventType.Error, "DeleteDeploymentActor: Caught HTTP exception while attempting to delete ML workspace, WorkspaceId: {0} StatusCode: {1}, ResponseText: {2}",
                        workspaceId,
                        errorResponse.StatusCode,
                        new StreamReader(errorResponse.GetResponseStream()).ReadToEnd());
                }
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, "DeleteDeploymentActor: Caught exception while attempting to delete ML workspace, WorkspaceId: {0}, exception: {1}",
                    workspaceId,
                    ex);
            }

            return fDeleteSucceeded;
        }

        private async Task<bool> DeleteResourceGroupAsync(DeleteDeploymentMessage message, bool fMLDeletionSucceeded)
        {
            try
            {
                var solution = await this.GetSolutionAsync(message.SubscriptionId, message.SolutionId);

                var resourceGroupName = solution.ResourceGroupName;

                var client = await this.GetClientAsync(message.SubscriptionId, message.ResourceManagerToken);

                // check if the resource group exists
                var existsResult = await client.ResourceGroups.CheckExistenceAsync(resourceGroupName);
                AzureOperationResponse response = null;

                if (existsResult.Exists) // Delete the resource group if it exists
                {
                    response = await client.ResourceGroups.DeleteAsync(solution.ResourceGroupName);
                }
                else
                {
                    logger.Write(TraceEventType.Warning, "DeleteDeploymentActor: Looks like ResourceGroup: {0} doesn't exist, was it deleted manually?", solution.ResourceGroupName);
                }

                return (!existsResult.Exists || response.StatusCode == HttpStatusCode.OK);
            }
            catch(Exception ex)
            {
                logger.Write(TraceEventType.Error, "DeleteDeploymentActor: Exception while deleting resource group, subscriptionId:{0}, solutionId:{1}, ex:{2}",
                    message.SubscriptionId,
                    message.SolutionId,
                    ex);
                return false;
            }
        }

        private async Task MarkSolutionStatusAsync(DeleteDeploymentMessage message, bool fResourceGroupDeletionSucceeded, bool fMLDeletionSucceeded)
        {
            try
            {
                bool fBothSucceeded = (fResourceGroupDeletionSucceeded && fMLDeletionSucceeded);

                string statusMessage = (fBothSucceeded ? "Successfully deleted solution: " : "Failed to delete solution: ");
                mdsm.ProvisioningState provisioningState = (fBothSucceeded ? ProvisioningState.Deleted : ProvisioningState.DeleteFailed);
                mdsm.ProvisioningState resourceState = (fResourceGroupDeletionSucceeded ? ProvisioningState.Deleted : ProvisioningState.DeleteFailed);
                
                var solution = await this.GetSolutionAsync(message.SubscriptionId, message.SolutionId);

                await UpdateSolutionEntity(solution,
                    resourceState,
                    provisioningState,
                    statusMessage);
            }
            catch(Exception ex)
            {
                logger.Write(TraceEventType.Error, "DeleteDeploymentActor: Exception while marking solution status, subscriptionId:{0}, solutionId:{1}, ex:{2}",
                    message.SubscriptionId,
                    message.SolutionId,
                    ex);
            }
        }

        private async Task UpdateSolutionEntity(SolutionEntity solution, mdsm.ProvisioningState resourceState, mdsm.ProvisioningState provisioningState, string message)
        {
            var updatedEntity = new SolutionEntity
            {
                PartitionKey = solution.PartitionKey,
                RowKey = solution.RowKey,
                // [TODO][parvezp]: Should this be protected for optimal concurrency?
                ETag = "*"
            };

            logger.Write(TraceEventType.Information, "DeleteDeploymentActor: Attempting to update solution entity with status message: {0}", message);
            
            SolutionProvisioningData newSolutionprovisioning = new SolutionProvisioningData();
            newSolutionprovisioning.ProvisioningState = provisioningState.ToString();
            newSolutionprovisioning.Message = message + updatedEntity.RowKey;

            // if provision state indicate delete finished, clean resources
            if (provisioningState == ProvisioningState.Deleted)
            {
                updatedEntity.Resources = "[]";
            }
            else
            {
                var resources = JsonConvert.DeserializeObject<List<SolutionResource>>(solution.Resources);
                if (resources != null)
                {
                    // Update status for individual resource to deleting
                    foreach (var resource in resources)
                    {
                        if (resource.ResourceType.Equals(MLDeploymentStatusUpdater.s_mlResourceType))
                        {
                            // Let's not touch the ML resources here for now..
                            // We might need to do some refactor, so this kind of code block doesn't exist
                            continue;
                        }

                        resource.ProvisioningState = resourceState.ToString();
                        resource.State = resourceState;
                    }
                }
                updatedEntity.Resources = JsonConvert.SerializeObject(resources);
            }
            
            updatedEntity.Provisioning = JsonConvert.SerializeObject(newSolutionprovisioning);

            //Update the provisioning status to deleted after successfully deleting the Resources Group
            TableOperation mergeOperation = TableOperation.Merge(updatedEntity);
            await this.solutionTable.ExecuteAsync(mergeOperation);
        }
    }
}
