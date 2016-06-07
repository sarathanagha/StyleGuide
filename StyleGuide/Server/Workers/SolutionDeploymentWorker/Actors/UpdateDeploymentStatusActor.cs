using Microsoft.Azure;
using Microsoft.Azure.Management.Resources;
using Microsoft.Azure.Management.Resources.Models;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.SolutionDeploymentWorker.Models;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ProvisioningState = Microsoft.DataStudio.Solutions.Model.ProvisioningState;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Actors
{
    public class UpdateDeploymentStatusActor : DeploymentActor
    {
        private readonly CloudQueue createQueue;
        private readonly string windowsManagementEndpointUrl;
        private readonly string oldWindowsManagerEndpointUrl;
        private readonly string eventHubUrlSuffix = "ServiceBusExtension/Namespace/{0}_{1}/QuickStart";

        public UpdateDeploymentStatusActor(CloudTableClient tableClient, CloudQueueClient queueClient, ILogger logger)
            : base(tableClient, queueClient, logger)
        {
            this.createQueue = queueClient.GetQueueReference(CloudConfigurationManager.GetSetting("Microsoft.QueueNames.CreateDeployment"));

            //TODO: [parvezp] This endpoint URL won't work for resources that are viewable through portal.azure.com
            windowsManagementEndpointUrl = CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.ResourceManagementUri");
            oldWindowsManagerEndpointUrl = CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.OldResourceManagementUri");
        }

        protected override async Task ExecuteAsyncImpl(QueueMessage queueMessage)
        {
            try
            {
                var message = (UpdateQueueMessage)queueMessage;
                if (message.Type != UpdateQueueMessageType.UpdateDeploymentStatusMessage)
                {
                    throw new Exception("UpdateQueueMessageType must be UpdateDeploymentStatusMessage!");
                }

                var updateDeploymentStatusMessage = JsonConvert.DeserializeObject<UpdateDeploymentStatusMessage>(message.Body);
                await ExecuteAsyncInternal(updateDeploymentStatusMessage);
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, "UpdateDeploymentStatusActor: Exception while processing UpdateDeploymentStatusMessage: {0}", ex);
            }
        }

        private async Task ExecuteAsyncInternal(UpdateDeploymentStatusMessage message)
        {
            // Retrieving solution
            var solution = await this.GetSolutionAsync(message.SubscriptionId, message.SolutionId);

            if (solution == null)
            {
                // Solution not found, give up
                logger.Write(TraceEventType.Warning, "UpdateDeploymentStatusActor: Solution '{0}/{1}' not found, giving up.",
                    message.SubscriptionId, message.SolutionId);
                return;
            }

            Exception exception = null;

            List<SolutionResource> solutionResources = new List<SolutionResource>();
            SolutionProvisioningData solutionProvisioning = new SolutionProvisioningData();

            try
            {
                // Retrieving existing provisioning status from solution
                solutionResources = JsonConvert.DeserializeObject<List<SolutionResource>>(solution.Resources);
                solutionProvisioning = JsonConvert.DeserializeObject<SolutionProvisioningData>(solution.Provisioning);

                // Retrieving current deployment status from Azure Resource Manager
                var deployment = await GetDeploymentAsync(message.SubscriptionId, message.ResourceManagerToken, message.ResourceGroupName, message.DeploymentName);

                if (deployment == null)
                {
                    // Template not found, set solution status to failed
                    logger.Write(TraceEventType.Warning, "UpdateDeploymentStatusActor: Deployment '{0}/{1}' not found. Provison of solution '{2}/{3}' failed.",
                        message.ResourceGroupName, message.DeploymentName, message.SubscriptionId, message.SolutionId);

                    solutionProvisioning.ProvisioningState = ProvisioningState.Failed.ToString();
                    solutionProvisioning.Message = string.Format("Deployment '{0}/{1}' not found.", message.ResourceGroupName, message.DeploymentName);

                    await this.UpdateSolutionStatusAsync(message.SubscriptionId, message.SolutionId, message.ResourceGroupName, solutionResources, solutionProvisioning);
                    return;
                }

                if(message.DeploymentComplete)
                {
                    ProvisioningState state = await CheckWorkFlowRunStatus(message, deployment);
                    solutionProvisioning.ProvisioningState = state.ToString();
                    await this.UpdateSolutionStatusAsync(message.SubscriptionId, message.SolutionId, message.ResourceGroupName, solutionResources, solutionProvisioning);
                    return;
                }

                var deploymentOperations = await GetDeploymentOperationsAsync(message.SubscriptionId, message.ResourceManagerToken, message.ResourceGroupName, message.DeploymentName);

                ProvisioningState operationsProvisioningState = ProvisioningState.InProgress;
                int nOperationsSuceeded = 0;
                // Updating resources statuses
                foreach (var operation in deploymentOperations)
                {
                    
                    var properties = operation.Properties;
                    var targetResources = properties.TargetResource;
                    var resourceType = targetResources.ResourceType;
                    var resourceDepth = resourceType.Split('/');

                    ProvisioningState operationProvisioningState = SolutionProvisioningState(properties.ProvisioningState);
                    var solnResource = new SolutionResource
                    {
                        ResourceId = String.Empty, //Making the ResourceId empty as except ML we don't really need it. ML uses it for saving the WorkSpaceId which is later used in deleting the ML workspace
                        ResourceName = targetResources.ResourceName,
                        ResourceType = targetResources.ResourceType,
                        ResourceNamespace = resourceDepth[0],
                        // TODO 5901190 (sbian): temporary fix for E2E break so client will get the string "InProgress", will do proper fix immediately
                        //ProvisioningState = properties.ProvisioningState,
                        ProvisioningState = (properties.ProvisioningState == "Running") ? "InProgress" : properties.ProvisioningState,
                        State = operationProvisioningState,
                        StatusCode = properties.StatusCode,
                        StatusMessage = properties.StatusMessage,
                        OperationId = operation.OperationId
                    };

                    if(resourceType.Equals("Microsoft.EventHub/namespaces"))
                    {
                        solnResource.ResourceUrl = oldWindowsManagerEndpointUrl + string.Format(eventHubUrlSuffix, solnResource.ResourceName, message.SubscriptionId);
                    }
                    else
                    {
                        solnResource.ResourceUrl = windowsManagementEndpointUrl + targetResources.Id;
                    }

                    // If the resourceType name has 3 classes that means it is a dependent resource of the
                    // corresponding main resource
                    if (resourceDepth.Length != 0)
                    {
                        SolutionResource resource = solutionResources.Find(sr => sr.ResourceNamespace.Equals(solnResource.ResourceNamespace, StringComparison.CurrentCultureIgnoreCase));
                        if (resource != null)
                        {
                            if (resource.ResourceUrl.Equals(solnResource.ResourceUrl, StringComparison.CurrentCultureIgnoreCase))
                            {
                                resource.ProvisioningState = solnResource.ProvisioningState;
                                resource.State = solnResource.State;
                                resource.StatusCode = solnResource.StatusCode;
                                resource.StatusMessage = solnResource.StatusMessage;
                            }

                            var dependencies = resource.Dependencies;
                            if (dependencies != null)
                            {
                                var dependenctResource = dependencies.Find(sr => sr.ResourceName.Equals(solnResource.ResourceName, StringComparison.CurrentCultureIgnoreCase));
                                if (dependenctResource != null)
                                {
                                    dependenctResource.ProvisioningState = solnResource.ProvisioningState;
                                    dependenctResource.State = solnResource.State;
                                    dependenctResource.StatusCode = solnResource.StatusCode;
                                    dependenctResource.StatusMessage = solnResource.StatusMessage;
                                }
                                else
                                {
                                    // This is hack to allow the resources to be saved in the table storage since they are exceeding the size limit
                                    // A better fix would be save the URL prefix only once at top level and apply some append logic on the client side
                                    if (!solnResource.ResourceType.ToLower().Contains("linkedservices"))
                                    {
                                        solnResource.ResourceUrl = string.Empty;
                                    }
                                    dependencies.Add(solnResource);
                                }
                                resource.CombinedState = resource.CombinedState | solnResource.State;
                            }                            
                        }
                        else
                        {
                            solnResource.Dependencies = new List<SolutionResource>();
                            // Create a copy of this resource and it as a dependency object
                            // We are trying to create top-level object that represents a
                            // particular namespace and then add every resource that belongs to
                            // that namespace as dependency.
                            solnResource.Dependencies.Add(new SolutionResource(solnResource));
                            solutionResources.Add(solnResource);
                        }
                    }
                    else
                    {
                        //If we got here that means that ResourceType doesn't match correct namespace requirements. Should never happen.
                        throw new Exception("Unexpected ResourceType encountered while parsing the Deployment operation results");
                    }

                    if(operationProvisioningState == ProvisioningState.Failed)
                    {
                        // Mark the operations enum as failed since we don't want to process any more messages
                        operationsProvisioningState = ProvisioningState.Failed;
                    }
                    if(operationProvisioningState == ProvisioningState.Succeeded)
                    {
                        nOperationsSuceeded++;
                    }
                }

                ProvisioningState resourcesProvisioningState = ProvisioningState.None;
                foreach(var resource in solutionResources)
                {
                    if (resource.State != ProvisioningState.Failed)
                    {
                        if ((resource.CombinedState & ProvisioningState.Failed) != 0)
                        {
                            resource.State = resourcesProvisioningState = ProvisioningState.Failed;
                            resource.ProvisioningState = ProvisioningState.Failed.ToString();
                            var failedResource = resource.Dependencies.Find(d => d.State == ProvisioningState.Failed);
                            if(failedResource != null)
                            {
                                resource.StatusMessage = failedResource.StatusMessage;
                                logger.Write(TraceEventType.Warning, "Failed deployment for ResourceUrl: {0} and OperationId: {1} with message: {2} and status code: {3}", failedResource.ResourceUrl, failedResource.OperationId, failedResource.StatusMessage, failedResource.StatusCode);
                            }
                        }
                        else if ((resource.CombinedState & ProvisioningState.InProgress) != 0)
                        {
                            resource.State = ProvisioningState.InProgress;
                            resource.ProvisioningState = ProvisioningState.InProgress.ToString();
                        }
                        resource.CombinedState = 0;
                    }
                }

                if (nOperationsSuceeded != 0 && nOperationsSuceeded == deploymentOperations.Count)
                {
                    operationsProvisioningState = ProvisioningState.Succeeded;
                }

                // Updating list of provisioning operations
                solutionProvisioning.Operations = deploymentOperations.Select(o => new ProvisioningOperation
                {
                    OperationId = o.OperationId,
                    State = SolutionProvisioningState(o.Properties.ProvisioningState),
                    // TODO 5901190 (sbian): temporary e2e fix so client gets consistent "InProgress" string instead of "Running", will do proper refactor
                    //ProvisioningState = o.Properties.ProvisioningState,
                    ProvisioningState = (o.Properties.ProvisioningState == "Running") ? "InProgress" : o.Properties.ProvisioningState,
                    StatusMessage = o.Properties.StatusMessage,
                    StatusCode = o.Properties.StatusCode
                }).ToList();
                
                // We need to check if any of the resources failed or not. Because sometimes the deployment state still is InProgress for failed resources
                // Just forcing the provisioning state to failed if any if the resources had a failure. So that overall state is accurate
                if (operationsProvisioningState == ProvisioningState.Failed || resourcesProvisioningState == ProvisioningState.Failed)
                {
                    solutionProvisioning.ProvisioningState = ProvisioningState.Failed.ToString();
                }
                else
                {
                    string provisioningState = deployment.Properties.ProvisioningState;
                    solutionProvisioning.ProvisioningState = SolutionProvisioningState(provisioningState).ToString();
                }
                solutionProvisioning.DeploymentName = message.DeploymentName;
                if (deployment.Properties.Outputs != null)
                {
                    var values = JsonConvert.DeserializeObject<Dictionary<string, Parameter<object>>>(deployment.Properties.Outputs);
                    if (solutionProvisioning.Outputs == null)
                    {
                        solutionProvisioning.Outputs = values;
                    }
                    else
                    {
                        foreach (KeyValuePair<string, Parameter<object>> item in values)
                        {
                            solutionProvisioning.Outputs[item.Key] = item.Value;
                        }
                    }

                }
                
                // The deployment on occasion can be still be in running state even when overall operationsProvisioning state is Failed
                // Hence adding explicit check that we are never queuing another update message if any of the operations have failed.
                if ((DeploymentInProgress(deployment) || operationsProvisioningState == ProvisioningState.InProgress) && operationsProvisioningState != ProvisioningState.Failed)
                {
                    await CreateUpdateMessage(message);
                }
                else if (DeploymentCompleted(deployment) && operationsProvisioningState == ProvisioningState.Succeeded)
                {
                    var templateId = message.DeploymentTemplateId;
                    if (!string.IsNullOrEmpty(templateId) && templateId.ToLower().Contains("_part1"))
                    {
                        // Mark the state as Running since we are beginning the Post processing after Part 1 is deployed
                        solutionProvisioning.ProvisioningState = ProvisioningState.InProgress.ToString();
                        solutionProvisioning.Message = "Uploading data to the storage account";

                        var template = await this.GetTemplateAsync(message.DeploymentTemplateId);

                        await SchedulePartOneDeploymentCompleteMessage(new UpdateDeploymentStatusMessage
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
                            DeploymentOutputs = deployment.Properties.Outputs,
                            DeploymentTemplateId = message.DeploymentTemplateId
                        });
                    }
                    else if(message.Type == DeploymentType.WorkFlow)
                    {
                        ProvisioningState state = await CheckWorkFlowRunStatus(message, deployment);
                        solutionProvisioning.ProvisioningState = state.ToString();
                    }
                    else
                    {
                        logger.Write(TraceEventType.Information, "Succesfully deployed the template {0} for solution {1}", message.DeploymentTemplateId, message.SolutionId);
                    }
                }
                await this.UpdateSolutionStatusAsync(message.SubscriptionId, message.SolutionId, message.ResourceGroupName, solutionResources, solutionProvisioning);
            }
            catch (Exception ex)
            {
                exception = ex;
            }

            if (exception != null && message != null)
            {
                logger.Write(TraceEventType.Warning, "UpdateDeploymentStatusActor: {0}. Provison of solution '{1}/{2}' failed.",
                    exception, message.SubscriptionId, message.SolutionId);

                await this.OnDeploymentFailureAsync(message.SubscriptionId, message.SolutionId, exception);
            }
        }

        private async Task<ProvisioningState> CheckWorkFlowRunStatus(UpdateDeploymentStatusMessage message, Deployment deployment)
        {            
            var deploymentOutputs = JsonConvert.DeserializeObject<DeploymentOutputs>(deployment.Properties.Outputs);
            string requestRunUri = CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.AzureResourceManagementUri")
            + "subscriptions/" + message.SubscriptionId + "/"
            + "resourceGroups/" + message.ResourceGroupName + "/"
            + "providers/Microsoft.Logic/workflows/" + deploymentOutputs.WorkFlowName.Value + "/runs"
            + "?api-version=" + CloudConfigurationManager.GetSetting("Microsoft.ApiVersions.WorkFlow")
            + "&$filter=status eq 'Running'";

            HttpWebRequest runRequest = (HttpWebRequest)WebRequest.Create(requestRunUri);
            runRequest.Method = "GET";
            runRequest.ContentType = "application/json";
            runRequest.Headers.Add("Authorization", "Bearer " + message.ResourceManagerToken);

            var respStr = (await runRequest.GetResponseAsync()).GetResponseStream();
            var rdr = new StreamReader(respStr);
            var responseString = await rdr.ReadToEndAsync();
            WorkflowRunResponse response = JsonConvert.DeserializeObject<WorkflowRunResponse>(responseString);
            ProvisioningState state = ProvisioningState.InProgress;
            if (response.Value.Count > 0)
            {
                await CreateUpdateMessage(message, true);
            }
            else
            {
                requestRunUri = requestRunUri.Replace("Running", "Failed");
                runRequest = (HttpWebRequest)WebRequest.Create(requestRunUri);
                runRequest.Method = "GET";
                runRequest.ContentType = "application/json";
                runRequest.Headers.Add("Authorization", "Bearer " + message.ResourceManagerToken);
                respStr = (await runRequest.GetResponseAsync()).GetResponseStream();
                rdr = new StreamReader(respStr);
                responseString = await rdr.ReadToEndAsync();
                response = JsonConvert.DeserializeObject<WorkflowRunResponse>(responseString);
                if (response.Value.Count > 0)
                {
                    logger.Write(TraceEventType.Warning, "LogicApp run failed for workflow: {0}", deploymentOutputs.WorkFlowName.Value);
                    state = ProvisioningState.Failed;
                }
                else
                {
                    state = ProvisioningState.Succeeded;
                }
            }

            return state;
        }

        private async Task SchedulePartOneDeploymentCompleteMessage(UpdateDeploymentStatusMessage message)
        {
            logger.Write(TraceEventType.Information, "UpdateDeploymentStatusActor: Scheduling Part One deployment complete message, subscriptionId: {0}, solutionId: {1}",
                message.SubscriptionId, message.SolutionId);

            var queueMessage = new UpdateQueueMessage
            {
                TracingActivityId = LogHelpers.GetCurrentActivityId(),
                Type = UpdateQueueMessageType.PartOneDeploymentComplete,
                Body = JsonConvert.SerializeObject(message)
            };

            var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(queueMessage));
            await this.updateQueue.AddMessageAsync(cloudMessage);
        }

        private async Task<Deployment> GetDeploymentAsync(string subscriptionId, string token,
            string resourceGroupName, string deploymentName)
        {
            var managementClient = await this.GetClientAsync(subscriptionId, token);
            var result = await managementClient.Deployments.GetAsync(resourceGroupName, deploymentName);
            return result.Deployment;
        }

        private async Task<IList<DeploymentOperation>> GetDeploymentOperationsAsync(string subscriptionId, string token,
            string resourceGroupName, string deploymentName)
        {
            var managementClient = await this.GetClientAsync(subscriptionId, token);
            var result = await managementClient.DeploymentOperations.ListAsync(resourceGroupName, deploymentName, null);
            return result.Operations;
        }

        private static bool DeploymentInProgress(Deployment deployment)
        {
            return deployment.Properties.ProvisioningState != "Succeeded" && deployment.Properties.ProvisioningState != "Failed";
        }

        private static bool DeploymentCompleted(Deployment deployment)
        {
            return deployment.Properties.ProvisioningState == "Succeeded";
        }
        private static bool DeploymentFailed(Deployment deployment)
        {
            return deployment.Properties.ProvisioningState == "Failed";
        }
    }
}
