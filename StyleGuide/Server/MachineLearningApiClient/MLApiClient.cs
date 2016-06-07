using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.MachineLearning.Contracts;
using Microsoft.DataStudio.Services.Security;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.DataStudio.WebExtensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.Services.MachineLearning
{
    public class MLApiClient
    {
        private enum HttpMethod
        {
            GET,
            PUT,
            POST,
            DELETE
        }

        private enum ApiType
        {
            StudioApi,
            WindowsManagementApi,
            AzuremlManagementApi
        }

        // These are strings frequently used in REST api requests
        private static string c_apiWorkspaces = "api/workspaces/";
        private static string c_cloudservicesWorkspaces = "/cloudservices/mycloudservice1/resources/machinelearning/~/workspaces/";

        private ILogger mLogger = null;
        private IApiCallsLogger mApiCallsLogger = null;
        private string mWindowsManagementUri = null;
        private string mAzuremlManagementUri = null;
        private string mStudioApiUri = null;
        private string mUserAccessTokenEncrypted = null;
        private Guid mSubscriptionId;

        public MLApiClient(string windowsManagementUri, string azuremlManagementUri, string studioApiUri, string userAccessToken, Guid subscriptionId, ILogger logger, IApiCallsLogger apiCallsLogger)
        {
            mWindowsManagementUri = windowsManagementUri;
            mAzuremlManagementUri = azuremlManagementUri;
            mStudioApiUri = studioApiUri;
            mUserAccessTokenEncrypted = userAccessToken;
            mSubscriptionId = subscriptionId;
            mLogger = logger;
            mApiCallsLogger = apiCallsLogger;

            Log(TraceEventType.Verbose, "MLApiClient constructor, WindowsManagementUri:{0}, AzuremlManagementUri:{1}, StudioApiUri:{2}, SubscriptionId:{3}",
                mWindowsManagementUri,
                mAzuremlManagementUri,
                mStudioApiUri,
                mSubscriptionId.ToString());
        }

        public async Task<IList<Workspace>> ListWorkspacesAsync()
        {
            string requestUri = mSubscriptionId.ToString() + c_cloudservicesWorkspaces;

            LogInformation("Attempting to list workspaces for subscription:{0}", mSubscriptionId.ToString());

            HttpWebRequest request = await CreateWindowsManagementApiWebRequestAsync(requestUri, HttpMethod.GET);

            return await GetWebResponseAsync<IList<Workspace>>(request);
        }

        public async Task<bool> FWorkspaceExistsAsync(string workspaceId)
        {
            bool fWorkspaceExists = false;

            foreach (var workspace in await ListWorkspacesAsync())
            {
                if (workspace.Id == workspaceId && workspace.WorkspaceState != WorkspaceStatus.Deleted)
                {
                    fWorkspaceExists = true;
                    break;
                }
            }

            return fWorkspaceExists;
        }

        public async Task<Workspace> GetWorkspaceAsync(string workspaceId)
        {
            string requestUri = mSubscriptionId.ToString() + c_cloudservicesWorkspaces + workspaceId;

            LogInformation("Attempting to list workspace info, workspaceId:{0}", workspaceId);

            HttpWebRequest request = await CreateWindowsManagementApiWebRequestAsync(requestUri, HttpMethod.GET);

            return await GetWebResponseAsync<Workspace>(request);
        }

        public async Task<Workspace> CreateWorkspaceAsync(CreateWorkspaceRequest message)
        {
            string requestUri = mSubscriptionId.ToString() + c_cloudservicesWorkspaces
                + Guid.NewGuid().ToString() + "/";

            LogInformation("Attempting to create a workspace with name={0}", message.Name);

            HttpWebRequest request = await CreateWindowsManagementApiWebRequestAsync(requestUri, HttpMethod.PUT, message);

            return await GetWebResponseAsync<Workspace>(request);
        }

        public async Task DeleteWorkspaceAsync(string workspaceId)
        {
            string requestUri = mSubscriptionId.ToString() + c_cloudservicesWorkspaces + workspaceId + "/";

            LogInformation("Attempting to delete the workspace with id={0}", workspaceId);

            HttpWebRequest request = await CreateWindowsManagementApiWebRequestAsync(requestUri, HttpMethod.DELETE);

            await GetWebResponseAsync<object>(request);

            LogInformation("Successfully deleted the workspace with id={0}", workspaceId);
        }

        public async Task DeleteWorkspaceIfExistsAsync(string workspaceId)
        {
            if (!await FWorkspaceExistsAsync(workspaceId))
            {
                LogInformation("Workspace with id:{0} doesn't exist, skipping DELETE attempt", workspaceId);
                return;
            }

            await DeleteWorkspaceAsync(workspaceId);
        }

        public async Task<Workspace> CreateWorkspaceIfNotExistsAsync(CreateWorkspaceRequest message)
        {
            var workspaces = await ListWorkspacesAsync();

            foreach (var workspace in workspaces)
            {
                if (workspace.Name.Equals(message.Name))
                    return workspace;
            }

            return await CreateWorkspaceAsync(message);
        }

        public async Task<IList<ExperimentSummary>> ListExperimentsAsync(Workspace workspace)
        {
            ThrowIfWorkspaceIsNotEnabled(workspace);

            LogInformation("Attempting to list experiments for workspace, workspaceId:{0}", workspace.Id);

            string requestUri = c_apiWorkspaces + workspace.Id + "/experiments";

            var request = await CreateStudioApiWebRequestAsync(requestUri, HttpMethod.GET, workspace.AuthorizationToken.PrimaryToken);

            return await GetWebResponseAsync<IList<ExperimentSummary>>(request);
        }

        public async Task<ExperimentInfo> GetExperimentAsync(string experimentId)
        {
            var workspace = await GetWorkspaceAsync(WorkspaceIdFromExperimentId(experimentId));
            return await GetExperimentAsync(workspace, experimentId);
        }

        public async Task<ExperimentInfo> GetExperimentAsync(Workspace workspace, string experimentId)
        {
            ThrowIfWorkspaceIsNotEnabled(workspace);

            LogInformation("Attempting to get experiment info, experimentId:{0}", experimentId);

            string requestUri = c_apiWorkspaces + workspace.Id + "/experiments/" + experimentId;

            var request = await CreateStudioApiWebRequestAsync(requestUri, HttpMethod.GET, workspace.AuthorizationToken.PrimaryToken);

            return await GetWebResponseAsync<ExperimentInfo>(request);
        }

        public async Task<Project> CreateProjectAsync(string trainingExperimentId, string scoringExperimentId)
        {
            string workspaceId = WorkspaceIdFromExperimentId(trainingExperimentId);

            if (!workspaceId.Equals(WorkspaceIdFromExperimentId(scoringExperimentId)))
            {
                throw new Exception("Training and scoring experiments should belong to the same workspace");
            }

            var workspace = await GetWorkspaceAsync(workspaceId);
            ThrowIfWorkspaceIsNotEnabled(workspace);

            IList<ExperimentSummary> experimentSummaryList = await ListExperimentsAsync(workspace);

            ExperimentSummary trainingExperimentSummary = null;
            ExperimentSummary scoringExperimentSummary = null;

            foreach (ExperimentSummary experimentSummary in experimentSummaryList)
            {
                if (experimentSummary.ExperimentId.Equals(trainingExperimentId))
                {
                    trainingExperimentSummary = experimentSummary;
                }
                else if (experimentSummary.ExperimentId.Equals(scoringExperimentId))
                {
                    scoringExperimentSummary = experimentSummary;
                }
            }

            Validate.NotNull(trainingExperimentSummary, "Unable to get an ExperimentSummary for training experiment");
            Validate.NotNull(scoringExperimentSummary, "Unable to get an ExperimentSummary for scoring experiment");

            var createProjectRequest = new AddOrUpdateProjectRequest();

            createProjectRequest.Experiments.Add(new ProjectExperiment
            {
                ExperimentId = trainingExperimentId,
                Role = ExperimentRole.Training,
                Experiment = trainingExperimentSummary
            });

            createProjectRequest.Experiments.Add(new ProjectExperiment
            {
                ExperimentId = scoringExperimentId,
                Role = ExperimentRole.Scoring,
                Experiment = scoringExperimentSummary
            });

            string requestUri = c_apiWorkspaces + workspaceId + "/projects";

            LogInformation("Attempting to create project with trainingExperimentId: {0}, scoringExperimentId: {1}", trainingExperimentId, scoringExperimentId);

            HttpWebRequest request = await CreateStudioApiWebRequestAsync(requestUri, HttpMethod.POST, workspace.AuthorizationToken.PrimaryToken, createProjectRequest);

            var newProject = await GetWebResponseAsync<Project>(request);

            LogInformation("Created project successfully with trainingExperimentId: {0}, scoringExperimentId: {1}, resultant ProjectID={2}",
                trainingExperimentId, scoringExperimentId, newProject.ProjectId);

            return newProject;
        }

        public async Task<PackingStatusInfo> PackExperimentAsync(string experimentId)
        {
            string workspaceId = WorkspaceIdFromExperimentId(experimentId);

            var workspace = await GetWorkspaceAsync(workspaceId);
            ThrowIfWorkspaceIsNotEnabled(workspace);

            LogInformation("Attempting to pack experiment, Id:{0}", experimentId);

            string requestUri = c_apiWorkspaces + workspace.Id
                + "/packages?api-version=2.0&experimentId="
                + experimentId + "&clearCredentials=true&includeAuthorId=false";

            HttpWebRequest request = await CreateStudioApiWebRequestAsync(requestUri, HttpMethod.POST, workspace.AuthorizationToken.PrimaryToken);

            return await GetWebResponseAsync<PackingStatusInfo>(request);
        }

        public async Task<PackingStatusInfo> GetExperimentPackStatusAsync(Guid activityId, Workspace workspace)
        {
            string pollRequestUri = c_apiWorkspaces + workspace.Id
                + "/packages?packageActivityId=" + activityId.ToString();

            HttpWebRequest pollRequest = await CreateStudioApiWebRequestAsync(pollRequestUri, HttpMethod.GET,
                workspace.AuthorizationToken.PrimaryToken);

            return await GetWebResponseAsync<PackingStatusInfo>(pollRequest);
        }

        public async Task<UnpackingStatusInfo> UnpackExperimentAsync(string packageUri, string communityUri, Workspace workspace)
        {
            string requestUri = c_apiWorkspaces + workspace.Id
                + "/packages?api-version=2.0&packageUri=" + WebUtility.UrlEncode(packageUri);
                
            if(!string.IsNullOrEmpty(communityUri))
            {
                requestUri += "&communityUri=" + WebUtility.UrlDecode(communityUri);
            }

            LogInformation("Attempting to unpack experiment, PackageLocation:{0}, target WorkspaceId:{1}", packageUri, workspace.Id);

            HttpWebRequest request = await CreateStudioApiWebRequestAsync(requestUri, HttpMethod.PUT, workspace.AuthorizationToken.PrimaryToken);

            return await GetWebResponseAsync<UnpackingStatusInfo>(request);
        }

        public async Task<UnpackingStatusInfo> GetExperimentUnpackStatusAsync(Guid activityId, Workspace workspace)
        {
            string pollRequestUri = c_apiWorkspaces + workspace.Id
                + "/packages?unpackActivityId=" + activityId.ToString();

            HttpWebRequest pollRequest = await CreateStudioApiWebRequestAsync(pollRequestUri, HttpMethod.GET,
                workspace.AuthorizationToken.PrimaryToken);

            return await GetWebResponseAsync<UnpackingStatusInfo>(pollRequest);
        }

        public async Task<WebServiceCreationStatusInfo> CreateWebServiceAsync(string scoringExperimentId, Workspace workspace)
        {
            string requestUri = c_apiWorkspaces + workspace.Id
                 + "/experiments/" + scoringExperimentId + "/webservice";

            LogInformation("Attempting to create a web service, workspaceId:{0}, scoringExperimentId:{1}", workspace.Id, scoringExperimentId);

            HttpWebRequest request = await CreateStudioApiWebRequestAsync(requestUri, HttpMethod.POST, workspace.AuthorizationToken.PrimaryToken);

            return await GetWebResponseAsync<WebServiceCreationStatusInfo>(request);
        }

        public async Task<WebServiceCreationStatusInfo> GetWebServiceCreationStatusAsync(Guid activityId, Workspace workspace)
        {
            string pollRequestUri = c_apiWorkspaces + workspace.Id
                + "/experiments/" + activityId.ToString() + "/webservice";

            HttpWebRequest pollRequest = await CreateStudioApiWebRequestAsync(pollRequestUri, HttpMethod.GET,
                workspace.AuthorizationToken.PrimaryToken);

            return await GetWebResponseAsync<WebServiceCreationStatusInfo>(pollRequest);
        }

        public async Task<WebService> GetWebServiceAsync(string webServiceGroupId, string endpointId, Workspace workspace)
        {
            ThrowIf.NullOrEmpty(webServiceGroupId, "webServiceGroupdId");
            ThrowIf.NullOrEmpty(endpointId, "endpointId");

            string requestUri = "workspaces/" + workspace.Id + "/webservices/" + webServiceGroupId;

            LogInformation("Attempting to retreive web service details, workspaceId:{0}, webServiceGroupdId:{1}, endpointId:{2}",
                workspace.Id, webServiceGroupId, endpointId);

            HttpWebRequest request = await CreateAzuremlManagementApiWebRequestAsync(requestUri, HttpMethod.GET, workspace.AuthorizationToken.PrimaryToken);

            var webServiceGroup = await GetWebResponseAsync<WebServiceGroup>(request);

            if (string.IsNullOrEmpty(webServiceGroup.DefaultEndpointName))
            {
                throw new Exception("DefaultEndpointName isn't available in the WebServiceGroup object!");
            }

            string endpointName = webServiceGroup.DefaultEndpointName;

            LogInformation("Successfully retreived web service details, workspaceId:{0}, webServiceGroupdId:{1}, webServiceGroupName:{2}, endpointCount:{3}. Now attempting to retreive endpoint details, endpointName:{4}",
                workspace.Id, webServiceGroupId, webServiceGroup.Name, webServiceGroup.EndpointCount, endpointName);

            requestUri = requestUri + "/endpoints/" + endpointName;

            request = await CreateAzuremlManagementApiWebRequestAsync(requestUri, HttpMethod.GET, workspace.AuthorizationToken.PrimaryToken);

            var webService = await GetWebResponseAsync<WebService>(request);

            if (!webService.ApiLocation.EndsWith(endpointId))
            {
                Log(TraceEventType.Error,
                    "Hmm, the EndpointId returned by studioapi request isn't part of WebService.ApiLocation returned by webservice management api, WorkspaceId:{0}, WebServiceGroupId:{1}, WebServiceGroupName:{2}, EndpointId:{3}, EndpointName:{4}, ApiLocation:{5}",
                    workspace.Id,
                    webServiceGroupId,
                    webServiceGroup.Name,
                    endpointId,
                    endpointName,
                    webService.ApiLocation); // Let the alert come out and we'll investigate..
            }

            return webService;
        }

        private async Task<HttpWebRequest> CreateWindowsManagementApiWebRequestAsync(string uri, HttpMethod method, object data = null)
        {
            return await CreateWebRequestAsync(mWindowsManagementUri + uri, method, ApiType.WindowsManagementApi, await new SecurityHelper().Decrypt(mUserAccessTokenEncrypted), data);
        }

        private async Task<HttpWebRequest> CreateAzuremlManagementApiWebRequestAsync(string uri, HttpMethod method, string workspaceToken, object data = null)
        {
            return await CreateWebRequestAsync(mAzuremlManagementUri + uri, method, ApiType.AzuremlManagementApi, workspaceToken, data);
        }

        private async Task<HttpWebRequest> CreateStudioApiWebRequestAsync(string uri, HttpMethod method, string workspaceToken, object data = null)
        {
            return await CreateWebRequestAsync(mStudioApiUri + uri, method, ApiType.StudioApi, workspaceToken, data);
        }

        private async Task<HttpWebRequest> CreateWebRequestAsync(string uri, HttpMethod method, ApiType type, string authToken, object data = null)
        {
            if (!FHttpMethodCanSendData(method) && data != null)
            {
                throw new Exception("Only POST/PUT requests can send data!");
            }

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);

            request.Method = method.ToString();
            request.Accept = "application/json";

            switch (type)
            {
                case ApiType.StudioApi:
                    request.Headers.Add("x-ms-metaanalytics-authorizationtoken", authToken);
                    break;

                case ApiType.WindowsManagementApi:
                    request.Headers.Add("x-ms-version", "2014-10-01");
                    goto case ApiType.AzuremlManagementApi;

                case ApiType.AzuremlManagementApi:
                    request.Headers.Add("Authorization", "Bearer " + authToken);
                    break;

                default:
                    throw new Exception("Unsupported ApiType!");
            }

            if (data != null)
            {
                byte[] payload = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data));

                request.ContentType = "application/json; charset=utf-8";
                request.ContentLength = payload.Length;

                Stream requestStream = await request.GetRequestStreamAsync();
                await requestStream.WriteAsync(payload, 0, payload.Length);
                requestStream.Close();
            }
            else if (FHttpMethodCanSendData(method))
            {
                request.ContentLength = 0; // ContentLength header is required for POST/PUT requests
            }

            return request;
        }

        private async Task<T> GetWebResponseAsync<T>(HttpWebRequest request)
        {
            string requestUri = request.RequestUri.ToString();
            string fullRequest = request.Method + " " + requestUri;

            try
            {
                mApiCallsLogger.LogApiCallStart(
                    ApiService.MachineLearning,
                    fullRequest,
                    mSubscriptionId,
                    null);

                Stopwatch stopWatch = Stopwatch.StartNew();
                HttpWebResponse response = (HttpWebResponse)await request.GetResponseAsync();
                stopWatch.Stop();

                mApiCallsLogger.LogApiCallEnd(
                    ApiService.MachineLearning,
                    fullRequest,
                    mSubscriptionId,
                    response.GetCorrelationId(),
                    null,
                    (int)response.StatusCode,
                    response.Headers.ToString(),
                    stopWatch.ElapsedMilliseconds
                    );

                StreamReader reader = new StreamReader(response.GetResponseStream());
                string responseText = await reader.ReadToEndAsync();
                return JsonConvert.DeserializeObject<T>(responseText);
            }
            catch (WebException ex)
            {
                HttpWebResponse errorResponse = (HttpWebResponse)ex.Response;
                if (errorResponse != null)
                {
                    mApiCallsLogger.LogApiCallError(
                        ApiService.MachineLearning,
                        fullRequest,
                        mSubscriptionId,
                        errorResponse.GetCorrelationId(),
                        null,
                        (int)errorResponse.StatusCode,
                        errorResponse.Headers.ToString(),
                        new StreamReader(errorResponse.GetResponseStream()).ReadToEnd()
                        );
                }

                // TODO rskumar: I should throw an MLApiException instance here. Do it in a subsequent change.
                throw;
            }
        }

        private static bool FHttpMethodCanSendData(HttpMethod method)
        {
            return (method == HttpMethod.POST || method == HttpMethod.PUT); // Only POST/PUT requests can send data
        }

        public static string WorkspaceIdFromExperimentId(string experimentId)
        {
            int workspaceIndex = experimentId.IndexOf('.');
            if (workspaceIndex == -1)
            {
                throw new Exception("Unable to get workspaceId. Invalid experimentId?");
            }

            return experimentId.Substring(0, workspaceIndex);
        }

        private static void ThrowIfWorkspaceIsNotEnabled(Workspace workspace)
        {
            if (workspace.WorkspaceState != WorkspaceStatus.Enabled)
            {
                throw new Exception(String.Format("Workspace doesn't seem to enabled yet? workspaceId={0}, workspaceState={1}", 
                    workspace.Id, workspace.WorkspaceState));
            }

            if (workspace.AuthorizationToken == null)
            {
                throw new Exception(String.Format("Workspace with id={0} has a null AuthorizationToken. Is it really enabled?", workspace.Id));
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void LogInformation(string format, params object[] args)
        {
            this.Log(TraceEventType.Information, format, args);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void Log(TraceEventType eventType, string format, params object[] args)
        {
            mLogger.Write(eventType, "MachineLearningRestApiClient: " + format, args);
        }
    }
}
