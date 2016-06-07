using Microsoft.DataStudio.Services.MachineLearning.Contracts;
using Microsoft.DataStudio.SolutionDeploymentWorker.Models;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Tables.Entities;
using Microsoft.DataStudio.Solutions.Validators;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.MachineLearning
{
    class MLDeploymentStatusUpdater
    {
        private enum DeploymentStatusCode
        {
            OK,
            ERROR
        }

        public static string s_mlResourceType = "Microsoft.MachineLearning/workspaces";

        private static string s_beginDeploymentStatusMessage = "Beginning ML deployment";
        private static string s_createdWorkspaceStatusMessage = "Created ML workspace";
        private static string s_copiedExperimentsStatusMessage = "Copied training and scoring experiments to target workspace";
        private static string s_createdProjectStatusMessage = "Created project of training and scoring experiments in the target workspace";
        private static string s_publishedWebServiceStatusMessage = "Successfully created a web service from the scoring experiment";
        private static string s_beginWorkspaceDeletionStatusMessage = "Attempting to delete ML workspace";
        private static string s_workspaceDeletionSuccessfulStatusMessage = "Successfully deleted ML workspace";
        private static string s_workspaceDeletionFailedStatusMessage = "Failed to delete ML workspace, was it already deleted?";

        private string mSubscriptionId = null;
        private string mSolutionId = null;
        private string mResourceGroupName = null;
        private ISolutionTable mSolutionTable = null;
        private string mOperationId = null;        

        public MLDeploymentStatusUpdater(string subscriptionId, string solutionId, string resourceGroupName, string resourceOperationId, ISolutionTable solutionTable)
        {
            mSubscriptionId = subscriptionId;
            mSolutionId = solutionId;
            mResourceGroupName = resourceGroupName;
            mSolutionTable = solutionTable;
            mOperationId = resourceOperationId;
        }

        public async Task CreateMLResourceOverwriteIfExistsAsync()
        {
            var solutionEntity = await GetSolutionEntityAsync();
            var solutionResources = GetSolutionResources(solutionEntity);

            var mlResource = GetMLResource(solutionResources);
            if (mlResource != null)
            {
                //TODO rskumar: Is this expected in the real-world case? Should I throw an exception here instead?
                solutionResources.Remove(mlResource);
            }

            // Create a new ML resource
            mlResource = new SolutionResource
            {
                ResourceId = null, // Populate with WorkspaceId when available
                ResourceName = null, // Populate with WorkspaceName when available
                ResourceType = s_mlResourceType,
                ResourceNamespace = s_mlResourceType.Split('/')[0],
                ProvisioningState = ProvisioningState.InProgress.ToString(),
                State = ProvisioningState.InProgress,
                StatusCode = DeploymentStatusCode.OK.ToString(),
                StatusMessage = s_beginDeploymentStatusMessage,
                OperationId = mOperationId
            };

            // Append this to the list of resources
            solutionResources.Add(mlResource);

            // Now update the solution table
            await UpdateDeploymentStatusInternalAsync(solutionEntity, solutionResources);
        }

        public async Task WorkspaceCreatedAsync(Workspace workspace)
        {
            var solutionEntity = await GetSolutionEntityAsync();
            var solutionResources = GetSolutionResources(solutionEntity);

            var mlResource = GetMLResource(solutionResources);
            Validate.NotNull(mlResource, "ML resource not found in the solution entity");

            // Update the resource
            mlResource.ResourceId = workspace.Id;
            mlResource.ResourceUrl = workspace.EditorLink;
            mlResource.ResourceName = workspace.Name;
            mlResource.StatusMessage = s_createdWorkspaceStatusMessage;

            // Now update the entity
            await UpdateDeploymentStatusInternalAsync(solutionEntity, solutionResources);
        }

        public async Task BeginWorkspaceDeletionAsync(string workspaceId)
        {
            await UpdateMLResourceAsync(s_beginWorkspaceDeletionStatusMessage, ProvisioningState.Deleting);
        }

        public async Task EndWorkspaceDeletionAsync(string workspaceId, bool fSucceeded)
        {
            if (fSucceeded)
            {
                await UpdateMLResourceAsync(s_workspaceDeletionSuccessfulStatusMessage, ProvisioningState.Deleted);
            }
            else
            {
                await UpdateMLResourceAsync(s_workspaceDeletionFailedStatusMessage, ProvisioningState.DeleteFailed);
            }
        }

        public async Task CopiedExperimentsAsync(string trainingExperimentId, string scoringExperimentId)
        {
            await UpdateMLResourceAsync(s_copiedExperimentsStatusMessage);
        }

        public async Task ProjectCreatedAsync(Project project)
        {
            await UpdateMLResourceAsync(s_createdProjectStatusMessage);
        }

        public async Task PublishedWebServiceAsync(WebService webService)
        {
            await UpdateMLResourceAsync(s_publishedWebServiceStatusMessage, ProvisioningState.Succeeded);
        }

        public async Task OnDeploymentFailureAsync(string errorMessage)
        {
            await UpdateMLResourceAsync(errorMessage, ProvisioningState.Failed);
        }

        private async Task<SolutionEntity> GetSolutionEntityAsync()
        {
            var solutionEntity = await mSolutionTable.GetSolutionAsync(mSubscriptionId, mSolutionId);
            Validate.NotNull(solutionEntity, "Solution entity isn't expected to be null since _part1 deployment should've completed");
            return solutionEntity;
        }

        private List<SolutionResource> GetSolutionResources(SolutionEntity entity)
        {
            var solutionResources = JsonConvert.DeserializeObject<List<SolutionResource>>(entity.Resources);
            Validate.NotNull(solutionResources, "Solution resources aren't expected to be null since _part1 deployment should've completed");
            return solutionResources;
        }

        private SolutionResource GetMLResource(List<SolutionResource> solutionResources)
        {
            return solutionResources.Find(sr => sr.OperationId.Equals(mOperationId));
        }

        private async Task UpdateMLResourceAsync(string statusMessage)
        {
            var solutionEntity = await GetSolutionEntityAsync();
            var solutionResources = GetSolutionResources(solutionEntity);

            var mlResource = GetMLResource(solutionResources);
            Validate.NotNull(mlResource, "ML resource not found in the solution entity");

            // Update the resource
            mlResource.StatusMessage = statusMessage;

            // Now update the entity
            await UpdateDeploymentStatusInternalAsync(solutionEntity, solutionResources);
        }

        private async Task UpdateMLResourceAsync(string statusMessage, ProvisioningState state)
        {
            var solutionEntity = await GetSolutionEntityAsync();
            var solutionResources = GetSolutionResources(solutionEntity);

            var mlResource = GetMLResource(solutionResources);
            Validate.NotNull(mlResource, "ML resource not found in the solution entity");

            // Update the resource
            mlResource.State = state;
            mlResource.ProvisioningState = state.ToString();
            mlResource.StatusCode = ((state == ProvisioningState.Failed) ? (DeploymentStatusCode.ERROR.ToString()) : (DeploymentStatusCode.OK.ToString()));
            mlResource.StatusMessage = statusMessage;

            // Now update the entity
            await UpdateDeploymentStatusInternalAsync(solutionEntity, solutionResources);
        }

        private async Task UpdateDeploymentStatusInternalAsync(SolutionEntity solutionEntity, List<SolutionResource> solutionResources)
        {
            var provisioningData = JsonConvert.DeserializeObject<SolutionProvisioningData>(solutionEntity.Provisioning);
            await mSolutionTable.UpdateSolutionStatusAsync(mSubscriptionId, mSolutionId, mResourceGroupName, solutionResources, provisioningData);
        }

        public async Task UpdateMLResourceAsync(MachineLearningResource mlResource)
        {
            var solutionEntity = await GetSolutionEntityAsync();
            solutionEntity.MachineLearningResource = JsonConvert.SerializeObject(mlResource);
            await mSolutionTable.UpdateSolutionStatusAsync(solutionEntity);
        }
    }
}
