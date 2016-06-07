using Microsoft.Azure.Management.Resources;
using Microsoft.Azure.Management.Resources.Models;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Security;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Solutions.Tables.Entities;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using ProvisioningState = Microsoft.DataStudio.Solutions.Model.ProvisioningState;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Actors
{
    public class CreateDeploymentActor : DeploymentActor
    {
        public CreateDeploymentActor(CloudTableClient tableClient, CloudQueueClient queueClient, ILogger logger)
            : base(tableClient, queueClient, logger)
        {
        }

        protected override async Task ExecuteAsyncImpl(QueueMessage queueMessage)
        {
            try
            {
                var message = (CreateQueueMessage)queueMessage;
                if (message.Type != CreateQueueMessageType.CreateDeploymentMessage)
                {
                    throw new Exception("CreateQueueMessageType must be CreateDeploymentMessage!");
                }

                var createDeploymentMessage = JsonConvert.DeserializeObject<CreateDeploymentMessage>(message.Body);
                await ExecuteAsyncInternal(createDeploymentMessage);
            }
            catch(Exception ex)
            {
                logger.Write(TraceEventType.Error, "CreateDeploymentActor: Exception while processing CreateDeploymentMessage: {0}", ex);
            }
        }

        private async Task ExecuteAsyncInternal(CreateDeploymentMessage message)
        {
            // Retrieving solution
            var solution = await this.GetSolutionAsync(message.SubscriptionId, message.SolutionId);

            if (solution == null)
            {
                // Solution not found, give up
                logger.Write(TraceEventType.Warning, "CreateDeploymentActor: Solution '{0}/{1}' not found, giving up.",
                    message.SubscriptionId, message.SolutionId);
                return;
            }

            Exception exception = null;

            List<SolutionResource> solutionResources = new List<SolutionResource>();
            SolutionProvisioningData solutionProvisioning = new SolutionProvisioningData();

            try
            {
                // Retrieving template
                if (solution.Resources != null)
                {
                    solutionResources = JsonConvert.DeserializeObject<List<SolutionResource>>(solution.Resources);
                }
                if(solution.Provisioning != null)
                {
                    solutionProvisioning = JsonConvert.DeserializeObject<SolutionProvisioningData>(solution.Provisioning);
                }

                // reset the previous message for a new deployment
                solutionProvisioning.Message = string.Empty;

                TemplateEntity template = null;
                if (message.DeploymentTemplateId != null)
                {
                    template = await this.GetTemplateAsync(message.DeploymentTemplateId);

                    if (template == null && message.Properties == null)
                    {
                        // Template not found, set solution status to failed
                        logger.Write(TraceEventType.Warning, "CreateDeploymentActor: Template '{0}' not found. Provison of solution '{1}/{2}' failed.",
                            message.DeploymentTemplateId, message.SubscriptionId, message.SolutionId);

                        solutionProvisioning.ProvisioningState = ProvisioningState.Failed.ToString();
                        solutionProvisioning.Message = string.Format("Solution template '{0}' not found.", message.DeploymentTemplateId);

                        await this.UpdateSolutionStatusAsync(message.SubscriptionId, message.SolutionId, message.ResourceGroupName, solutionResources, solutionProvisioning);
                        return;
                    }
                }

                ThrowIf.NullOrEmpty(message.DeploymentName, "message.DeploymentName");
                var deploymentName = message.DeploymentName;

                // Decrypt the password just before sending it to the CreateDeployment API
                message.DeploymentParameters = await new SecurityHelper().DecryptPassword(message.DeploymentParameters);
                // Deploying the solution
                var deployment = await CreateDeploymentAsync(message.SubscriptionId, message.ResourceManagerToken,
                    message.ResourceGroupName, deploymentName, message.Properties, template, message.DeploymentParameters);

                // The security helper will encrypt only the sql password.
                // Re-encryp the password since we are going to put the parameters on the UpdateQueue
                var encryptedPassword = await new SecurityHelper().EncryptPassword(message.DeploymentParameters);

                // Update solution status
                solutionProvisioning.ProvisioningState = SolutionProvisioningState(deployment.Properties.ProvisioningState).ToString();
                solutionProvisioning.DeploymentName = deploymentName;
                await this.UpdateSolutionStatusAsync(message.SubscriptionId, message.SolutionId, message.ResourceGroupName, solutionResources, solutionProvisioning);

                // Schedule update message
                var updateMessage = new UpdateDeploymentStatusMessage
                {
                    SubscriptionId = message.SubscriptionId,
                    SolutionId = message.SolutionId,
                    UserEmail = message.UserEmail,
                    UserPuid = message.UserPuid,
                    ResourceManagerToken = message.ResourceManagerToken,
                    ResourceGroupName = message.ResourceGroupName,
                    DeploymentName = deployment.Name,
                    DeploymentParameters = encryptedPassword,
                    DeploymentTemplateId = message.DeploymentTemplateId,
                    Type = message.Type
                };

                if(template == null)
                {
                    updateMessage.DeploymentTemplateLink = "";
                }

                await this.PushMessageToUpdateQueueAsync(updateMessage, TimeSpan.FromSeconds(1));
            }
            catch (Exception ex)
            {
                exception = ex;
            }

            if (exception != null && message != null)
            {
                logger.Write(TraceEventType.Warning, "CreateDeploymentActor: {0}. Provison of solution '{1}/{2}' failed.",
                    exception, message.SubscriptionId, message.SolutionId);

                await this.OnDeploymentFailureAsync(message.SubscriptionId, message.SolutionId, exception);
            }
        }

        private async Task<Deployment> CreateDeploymentAsync(string subscriptionId, string token,
            string resourceGroupName, string deploymentName, DeploymentProperties deploymentproperties, TemplateEntity template, string parameters)
        {
            DeploymentProperties properties = deploymentproperties;
            var templateLink = string.Empty;
            if (deploymentproperties != null)
            {
                templateLink = properties.TemplateLink.Uri.ToString();
            }
            else
            {
                templateLink = template.DeploymentTemplateLink;
                properties = new DeploymentProperties
                {
                    Mode = DeploymentMode.Incremental,
                    TemplateLink = new TemplateLink(new Uri(templateLink)),
                };
                if (!string.IsNullOrEmpty(parameters))
                {
                    properties.Parameters = parameters;
                }
            }

            var client = await this.GetClientAsync(subscriptionId, token);
            var existsResult = await client.ResourceGroups.CheckExistenceAsync(resourceGroupName);

            //Only creates one if not already there
            if (!existsResult.Exists)
            {
                logger.Write(TraceEventType.Information, "CreateDeploymentActor: ResourceGroup:{0} doesn't exist, attempting to create a new one", resourceGroupName);

                BasicResourceGroup resourceParams = new BasicResourceGroup()
                {
                    //TODO [parvezp] Make this a parameter
                    Location = "WestUS"
                };
                await client.ResourceGroups.CreateOrUpdateAsync(resourceGroupName, resourceParams);
            }
            else
            {
                logger.Write(TraceEventType.Information, "CreateDeploymentActor: ResourceGroup:{0} already exists, not creating a new one for this deployment", resourceGroupName);
            }

            logger.Write(TraceEventType.Information, "CreateDeploymentActor: Beginning ARM template deployment, subscriptionId:{0}, deploymentName:{1}, templatelink:{2}",
                subscriptionId, deploymentName, templateLink);

            DeploymentOperationsCreateResult result = null;
            try
            {
                result = await client.Deployments.CreateOrUpdateAsync(resourceGroupName, deploymentName, properties);
            }
            catch(Exception ex)
            {
                logger.Write(TraceEventType.Warning, "CreateDeploymentActor: Create ARM template deployment failed: subscriptionId:{0}, deploymentName:{1}, templatelink:{2}, Exception: {3}",
                subscriptionId, deploymentName, templateLink, ex);
                throw;
            }
            return result.Deployment;
        }
    }
}
