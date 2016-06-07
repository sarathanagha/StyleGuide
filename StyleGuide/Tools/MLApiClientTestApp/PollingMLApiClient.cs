using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.MachineLearning.Contracts;
using MLApiClientTestApp.Models;

namespace Microsoft.DataStudio.Services.MachineLearning
{
    public class PollingMLApiClient
    {
        private MLApiClient mClient = null;
        private ITestLogger mLogger = null;

        private static int c_workspaceCreationPollDelay = 1000; // 1 sec
        private static int c_packingServicePollDelay = (4 * c_workspaceCreationPollDelay); // 4 sec
        private static int c_webServiceCreationPollDelay = (2 * c_packingServicePollDelay); // 8 sec

        private readonly CancellationTokenSource mPollingCancellationTokenSource = new CancellationTokenSource();

        public PollingMLApiClient(string windowsManagementUri, string azuremlManagementUri, string studioApiUri, string userAccessToken, Guid subscriptionId, ITestLogger logger, IApiCallsLogger apiCallsLogger)
        {
            mLogger = logger;
            mClient = new MLApiClient(windowsManagementUri, azuremlManagementUri, studioApiUri, userAccessToken, subscriptionId, mLogger, apiCallsLogger);
        }

        public async Task<IList<Workspace>> ListWorkspacesAsync()
        {
            return await mClient.ListWorkspacesAsync();
        }

        public async Task<bool> FWorkspaceExistsAsync(string workspaceId)
        {
            return await mClient.FWorkspaceExistsAsync(workspaceId);
        }

        public async Task<Workspace> GetWorkspaceAsync(string workspaceId)
        {
            return await mClient.GetWorkspaceAsync(workspaceId);
        }

        public async Task<Workspace> CreateWorkspaceAsync(CreateWorkspaceRequest message)
        {
            var workspace = await mClient.CreateWorkspaceAsync(message);

            if (workspace.WorkspaceState == WorkspaceStatus.Enabled)
            {
                ValidateNotNull(workspace.AuthorizationToken, "Unexpected NULL value for AuthorizationToken though WorkspaceState is Enabled");

                LogInformation("Received response with WorkspaceState=Enabled, returning new workspace info, workspaceId:{0}", workspace.Id);

                return workspace;
            }

            if (workspace.WorkspaceState == WorkspaceStatus.Registered)
            {
                // We need to poll till the workspace auth token is ready

                LogInformation("Received response with WorkspaceState=Registered, polling for Enabled state, workspaceId:{0}", workspace.Id);

                // TODO rskumar: Refactor out this polling part to a helper class, it's currently duplicated at about 4 places in this class..
                return await Task.Run(async () =>
                {
                    Workspace newWorkspaceInfo = null;

                    while (!mPollingCancellationTokenSource.IsCancellationRequested)
                    {
                        newWorkspaceInfo = await this.GetWorkspaceAsync(workspace.Id);

                        if (newWorkspaceInfo.WorkspaceState == WorkspaceStatus.Enabled)
                        {
                            ValidateNotNull(newWorkspaceInfo.AuthorizationToken, "Unexpected NULL value for AuthorizationToken though WorkspaceState is Enabled");
                            LogInformation("WorkspaceStatus is now Enabled, workspaceId: {0}", newWorkspaceInfo.Id);
                            break;
                        }
                        else if (newWorkspaceInfo.WorkspaceState == WorkspaceStatus.Registered)
                        {
                            LogInformation("WorkspaceStatus is still Registered, will wait for {0}ms", c_workspaceCreationPollDelay);
                            await Task.Delay(c_workspaceCreationPollDelay);
                        }
                        else
                        {
                            throw new Exception("Unexpected WorkspaceState after creating a new workspace");
                        }
                    }

                    return newWorkspaceInfo;
                });
            }
            else
            {
                throw new Exception("Unexpected WorkspaceState after creating a new workspace");
            }
        }

        public async Task<Workspace> CreateWorkspaceIfNotExistsAsync(CreateWorkspaceRequest message)
        {
            return await mClient.CreateWorkspaceIfNotExistsAsync(message);
        }

        public async Task DeleteWorkspaceAsync(string workspaceId)
        {
            await mClient.DeleteWorkspaceAsync(workspaceId);
        }

        public async Task DeleteWorkspaceIfExistsAsync(string workspaceId)
        {
            await mClient.DeleteWorkspaceIfExistsAsync(workspaceId);
        }

        public async Task<IList<ExperimentSummary>> ListExperimentsAsync(Workspace workspace)
        {
            return await mClient.ListExperimentsAsync(workspace);
        }

        public async Task<ExperimentInfo> GetExperimentAsync(string experimentId)
        {
            return await mClient.GetExperimentAsync(experimentId);
        }

        public async Task<ExperimentInfo> GetExperimentAsync(Workspace workspace, string experimentId)
        {
            return await mClient.GetExperimentAsync(workspace, experimentId);
        }

        public async Task<Project> CreateProjectAsync(string trainingExperimentId, string scoringExperimentId)
        {
            return await mClient.CreateProjectAsync(trainingExperimentId, scoringExperimentId);
        }

        public async Task<string> PackExperimentAsync(string experimentId)
        {
            var packStatusInfo = await mClient.PackExperimentAsync(experimentId);
            ValidateNotNull(packStatusInfo, "Unexpected NULL response for PackingStatusInfo after POST request to pack");

            var workspace = await mClient.GetWorkspaceAsync(MLApiClient.WorkspaceIdFromExperimentId(experimentId));

            if (packStatusInfo.Status == PackageStatus.Complete)
            {
                LogInformation("PackageStatus is Complete. Final packed location: {0}", packStatusInfo.Location);
                return packStatusInfo.Location;
            }

            if (packStatusInfo.Status == PackageStatus.Pending)
            {
                // Poll by using the activity id till the Location is available

                Guid activityId = packStatusInfo.ActivityId;

                LogInformation("Received response with PackageStatus=Pending, polling for Completed state, ActivityId: {0}", activityId);

                return await Task.Run(async () =>
                {
                    string finalExperimentPackageLocation = null;

                    while (!mPollingCancellationTokenSource.IsCancellationRequested)
                    {
                        LogInformation("Making a poll request for pack status, activityId:{0}", activityId);

                        var pollStatusInfo = await mClient.GetExperimentPackStatusAsync(activityId, workspace);

                        if (pollStatusInfo == null || pollStatusInfo.Status == PackageStatus.Pending) // We sometimes get no response data for the poll request, so a NULL pollStatusInfo is okay here..
                        {
                            LogInformation("PackageStatus is still Pending, will wait for {0}ms", c_packingServicePollDelay);
                            await Task.Delay(c_packingServicePollDelay);
                        }
                        else if (pollStatusInfo.Status == PackageStatus.Complete)
                        {
                            LogInformation("PackageStatus is now Complete. Final packed location: {0}", pollStatusInfo.Location);
                            finalExperimentPackageLocation = pollStatusInfo.Location;
                            break;
                        }
                        else
                        {
                            throw new Exception("Unexpected PackageStatus while attempting to pack experiment");
                        }
                    }

                    return finalExperimentPackageLocation;
                });
            }
            else
            {
                throw new Exception("Unexpected PackageStatus while attempting to pack experiment");
            }
        }

        public async Task<string> UnpackExperimentAsync(string packageUri, string communityUri, Workspace workspace)
        {
            var unpackStatusInfo = await mClient.UnpackExperimentAsync(packageUri, communityUri, workspace);
            ValidateNotNull(unpackStatusInfo, "Unexpected NULL response for UnpackingStatusInfo after PUT request to unpack");

            if (unpackStatusInfo.Status == PackageStatus.Complete)
            {
                LogInformation("UnpackStatus is Complete, final experiment id:{0}", unpackStatusInfo.ExperimentId);
                return unpackStatusInfo.ExperimentId;
            }

            if (unpackStatusInfo.Status == PackageStatus.Pending)
            {
                // Poll by using the activity id till the experiment Id is available

                Guid activityId = unpackStatusInfo.ActivityId;

                LogInformation("Received response with UnpackStatus=Pending, polling for Completed state. ActivityId: {0}", activityId);

                return await Task.Run(async () =>
                {
                    string finalExperimentId = null;

                    while (!mPollingCancellationTokenSource.IsCancellationRequested)
                    {
                        LogInformation("Making a poll request for unpack status, activityId:{0}", activityId);

                        var pollStatusInfo = await mClient.GetExperimentUnpackStatusAsync(activityId, workspace);

                        if (pollStatusInfo == null || pollStatusInfo.Status == PackageStatus.Pending) // We sometimes get no response data for the poll request, so a NULL pollStatusInfo is okay here..
                        {
                            LogInformation("UnpackStatus is still Pending, will wait for {0}ms", c_packingServicePollDelay);
                            await Task.Delay(c_packingServicePollDelay);
                        }
                        else if (pollStatusInfo.Status == PackageStatus.Complete)
                        {
                            LogInformation("UnpackStatus is now Complete, Final experiment Id:{0}", pollStatusInfo.ExperimentId);
                            finalExperimentId = pollStatusInfo.ExperimentId;
                            break;
                        }
                        else
                        {
                            throw new Exception("Unexpected PackageStatus while attempting to unpack experiment");
                        }
                    }

                    return finalExperimentId;
                });
            }
            else
            {
                throw new Exception("Unexpected PackageStatus while attempting to unpack experiment");
            }
        }

        public async Task<WebService> CreateWebServiceAsync(string scoringExperimentId, Workspace workspace)
        {
            var creationStatusInfo = await mClient.CreateWebServiceAsync(scoringExperimentId, workspace);
            ValidateNotNull(creationStatusInfo, "Unexpected NULL response for WebServiceCreationStatusInfo after web service creation request");

            if (creationStatusInfo.Status == WebServiceCreationStatus.Completed)
            {
                LogInformation("WebServiceCreationStatus is Completed. WebServiceEndpointId: {0}", creationStatusInfo.WebServiceGroupId);
                return await mClient.GetWebServiceAsync(creationStatusInfo.WebServiceGroupId, creationStatusInfo.EndpointId, workspace);
            }

            if (creationStatusInfo.Status == WebServiceCreationStatus.Pending)
            {
                // Poll by using the activity id till the experiment Id is available

                Guid activityId = creationStatusInfo.ActivityId;

                LogInformation("Received response with WebServiceCreationStatus=Pending, polling for Completed state. ActivityId: {0}", activityId);

                return await Task.Run(async () =>
                {
                    WebServiceCreationStatusInfo finalInfo = null;

                    while (!mPollingCancellationTokenSource.IsCancellationRequested)
                    {
                        LogInformation("Attempting to get WebServiceCreationStatusInfo for create web service operation, activityId:{0}", activityId);

                        var pollStatusInfo = await mClient.GetWebServiceCreationStatusAsync(activityId, workspace);

                        if (pollStatusInfo == null || pollStatusInfo.Status == WebServiceCreationStatus.Pending) // We sometimes get no response data for the poll request, so a NULL pollStatusInfo is okay here..
                        {
                            LogInformation("WebServiceCreationStatus is still Pending. Will wait for {0}ms", c_webServiceCreationPollDelay);
                            await Task.Delay(c_webServiceCreationPollDelay);
                        }
                        else if (pollStatusInfo.Status == WebServiceCreationStatus.Completed)
                        {
                            LogInformation("WebServiceCreationStatus is now Completed. WebServiceEndpointId: {0}", pollStatusInfo.WebServiceGroupId);
                            finalInfo = pollStatusInfo;
                            break;
                        }
                        else if (pollStatusInfo.Status == WebServiceCreationStatus.Failed)
                        {
                            throw new Exception("Web service creation failed"); //TODO rskumar: Log...
                        }
                        else
                        {
                            throw new Exception("Unexpected WebServiceCreationStatus while attempting to deploy web service");
                        }
                    }

                    return await mClient.GetWebServiceAsync(finalInfo.WebServiceGroupId, finalInfo.EndpointId, workspace);
                });
            }
            else
            {
                throw new Exception("Unexpected WebServiceCreationStatus after attempting to deploy web service!");
            }
        }

        private void ValidateNotNull(object obj, string message)
        {
            if (obj == null)
            {
                throw new Exception(message);
            }
        }

        private void LogInformation(string format, params object[] args)
        {
            mLogger.Write(TraceEventType.Information, "PollingMLApiClient: " + format, args);
        }
    }
}
