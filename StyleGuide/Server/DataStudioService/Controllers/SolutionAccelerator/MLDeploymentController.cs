using Microsoft.Azure;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Data.Models.Solutions;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Solutions.Tables.Entities;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using mdsm = Microsoft.DataStudio.Solutions.Model;

namespace Microsoft.DataStudio.Services.Controllers.SolutionAccelerator
{
    [Authorize]
    public class MLDeploymentController : SolutionControllerBase
    {
        private readonly CloudQueue mlQueue = null;
        public MLDeploymentController(ILogger logger)
            : base(logger)
        {
            this.mlQueue = queueClient.GetQueueReference(CloudConfigurationManager.GetSetting("Microsoft.QueueNames.MLDeploymentRequests"));
        }

        [HttpPost]
        [ResponseType(typeof(Solution))]
        [Route("api/{subscriptionId}/machinelearning")]
        public async Task<IHttpActionResult> Post([FromUri] string subscriptionId, [FromBody] MLBeginDeploymentMessage parameters)
        {
            ThrowIf.NullOrEmpty(parameters.StorageAccountName, "StorageAccountName");
            ThrowIf.NullOrEmpty(parameters.ResourceGroupName, "ResourceGroupName");
            ThrowIf.NullOrEmpty(parameters.ScoringExperimentPackageLocation, "ScoringExperimentPackageLocation");
            ThrowIf.NullOrEmpty(parameters.UserEmail, "UserEmail");
            ThrowIf.NullOrEmpty(parameters.UserPuid, "UserPuid");
            if(string.IsNullOrEmpty(parameters.StorageAccountKey) && string.IsNullOrEmpty(parameters.StorageConnectionString))
            {
                throw new ArgumentException("Either storageAccountKey or storageConnectionString must be present");
            }            

            
            if(!string.IsNullOrEmpty(parameters.StorageConnectionString))
            {
                var connectionString = parameters.StorageConnectionString;
                var values = connectionString.Split(';');
                parameters.StorageAccountKey = values[2].Substring(values[2].IndexOf('=') + 1);
            }
            

            Guid operationId = Guid.NewGuid(); // available to the client as SolutionResource.OperationId
            var trainingExperiment = parameters.TrainingExperimentPackageLocation;
            var scoringExperiment = parameters.ScoringExperimentPackageLocation;
            logger.Write(TraceEventType.Information, "PostDeploymentActor: Scheduling ML deployment parameters, subscriptionId: {0}, solutionId: {1}, trainingExperimentPackageLocation: {2}, scoringExperimentPackageLocation: {3}",
                parameters.SubscriptionId,
                parameters.SolutionId,
                trainingExperiment,
                scoringExperiment);

            var deploymentParams = new MLBeginDeploymentMessage
            {
                OperationId = operationId.ToString(),
                SolutionId = parameters.SolutionId,
                SubscriptionId = subscriptionId,
                ResourceManagerToken = GetToken(),
                ResourceGroupName = parameters.ResourceGroupName,
                StorageAccountName = parameters.StorageAccountName,
                StorageAccountKey = parameters.StorageAccountKey,
                UserEmail = parameters.UserEmail,
                UserPuid = parameters.UserPuid,
                Location = CloudConfigurationManager.GetSetting("Microsoft.MachineLearning.WorkspaceLocation"),
                TrainingExperimentPackageLocation = trainingExperiment,
                TrainingCommunityUri = parameters.TrainingCommunityUri,
                ScoringExperimentPackageLocation = scoringExperiment,
                ScoringCommunityUri = parameters.ScoringCommunityUri,
                Type = DeploymentType.WorkFlow
            };

            var mlQueueMessage = new MLQueueMessage
            {
                TracingActivityId = LogHelpers.GetCurrentActivityId(),
                Type = MLQueueMessageType.BeginDeploymentRequest,
                Body = JsonConvert.SerializeObject(deploymentParams)
            };

            var solutionTableStorage = GetSolutionTableStorage(subscriptionId);
            var solutionEntity = await solutionTableStorage.GetAsync(parameters.SolutionId);

            var mlResource = new MachineLearningResource
            {
                ProvisioningState = ProvisioningState.InProgress.ToString()
            };

            var provisioningData = new SolutionProvisioningData
            {
                Message = "Received the machine learning deployment request",
                ProvisioningState = mdsm.ProvisioningState.InProgress.ToString(),
                DeploymentName = ""
            };
            var serializedProvisioning = JsonConvert.SerializeObject(provisioningData);

            if(solutionEntity == null)
            {
                // Create a initial Provisioning data so that the first start received by client is not null
                solutionEntity = new SolutionEntity
                {
                    PartitionKey = subscriptionId,
                    RowKey = parameters.SolutionId,
                    Resources = "[]",
                    ResourceGroupName = parameters.ResourceGroupName,
                    TemplateId = "",
                };
            }

            solutionEntity.Provisioning = serializedProvisioning;
            solutionEntity.MachineLearningResource = JsonConvert.SerializeObject(mlResource);
            await solutionTableStorage.InsertOrUpdateAsync(solutionEntity);
            
            var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(mlQueueMessage));
            await this.mlQueue.AddMessageAsync(cloudMessage);
            return Ok(SolutionFromSolutionEntity(solutionEntity));
        }

        [HttpGet]
        [ResponseType(typeof(Solution))]
        [Route("api/{subscriptionId}/{solutionId}/machinelearning")]
        public async Task<IHttpActionResult> Get([FromUri] string subscriptionId, [FromUri] string solutionId)
        {
            var solutionTableStorage = GetSolutionTableStorage(subscriptionId);
            var solutionEntity = await solutionTableStorage.GetAsync(solutionId);

            return Ok(SolutionFromSolutionEntity(solutionEntity));
        }
    }
}