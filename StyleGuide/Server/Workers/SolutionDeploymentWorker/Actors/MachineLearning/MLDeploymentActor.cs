using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Runtime.CompilerServices;
using System.Runtime.ExceptionServices;
using System.Threading.Tasks;
using Microsoft.Azure;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Solutions.Tables.Entities;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.DataStudio.SolutionDeploymentWorker.MachineLearning;
using Microsoft.DataStudio.SolutionDeploymentWorker.Models;
using Microsoft.DataStudio.Services.MachineLearning;
using Microsoft.DataStudio.Services.MachineLearning.Contracts;
using Microsoft.DataStudio.WebExtensions;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Actors
{
    public class MLDeploymentActor : DeploymentActor
    {
        private enum MLApiSource
        {
            SolutionAccelerator
        }

        private static TimeSpan c_workspaceCreationPollDelay = TimeSpan.FromMilliseconds(500); // 0.5 sec
        private static TimeSpan c_packingServicePollDelay = TimeSpan.FromMilliseconds(5000); // 5 sec
        private static TimeSpan c_webServiceCreationPollDelay = TimeSpan.FromMilliseconds(10000); // 10 sec

        private static UInt32 c_maxOperationRetryCount = UInt32.Parse(CloudConfigurationManager.GetSetting("Microsoft.MachineLearning.MaxRetryAttempts"));

        private string mWindowsManagementUri = null;
        private string mStudioApiUri = null;
        private string mAzuremlManagementUri = null;
        private CloudQueue mQueue = null;
        private IApiCallsLogger mApiCallsLogger = null;

        private delegate Task TMessageHandler<TMessage>(TMessage message, MLQueueMessage queueMessage);
        private delegate Task TMessageHandlerEx<TMessage>(TMessage message, bool fTraining, MLQueueMessage queueMessage);

        public MLDeploymentActor(CloudTableClient tableClient, CloudQueueClient queueClient, ILogger logger)
            : base(tableClient, queueClient, logger)
        {
            mWindowsManagementUri = CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.WindowsManagementUri");
            mAzuremlManagementUri = CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.AzuremlManagementUri");
            mStudioApiUri = CloudConfigurationManager.GetSetting("Microsoft.UriEndpoints.StudioApiUri");
            mQueue = queueClient.GetQueueReference(CloudConfigurationManager.GetSetting("Microsoft.QueueNames.MLDeploymentRequests"));
            mApiCallsLogger = new ApiCallsLogger();
        }

        protected override async Task ExecuteAsyncImpl(QueueMessage queueMessage)
        {
            var message = (MLQueueMessage)queueMessage;

            try
            {
                await ProcessQueueMessageAsync(message);
            }
            catch (Exception ex)
            {
                LogError("Failed to process ML queue message, Type: {0}, error: {1}",
                    message.Type, ex);
            }
        }

        private async Task ProcessQueueMessageAsync(MLQueueMessage queueMessage)
        {
            switch (queueMessage.Type)
            {
                case MLQueueMessageType.BeginDeploymentRequest:
                    await HandleMessageAsync<MLBeginDeploymentMessage>(queueMessage, HandleDeploymentRequestAsync);
                    break;

                case MLQueueMessageType.WorkspaceCreationStatusPoll:
                    await HandleMessageAsync<MLDeploymentMessage>(queueMessage, HandleWorkspaceCreationStatusPollMessageAsync);
                    break;

                case MLQueueMessageType.TrainingExperimentUnpackRequest:
                    await HandleMessageExAsync<MLDeploymentMessage>(queueMessage, true /*fTrainingExperiment*/, HandleExperimentUnpackMessageAsync);
                    break;

                case MLQueueMessageType.TrainingExperimentUnpackStatusPoll:
                    await HandleMessageExAsync<ActivityIdMessage>(queueMessage, true /*fTrainingExperiment*/, HandleExperimentUnpackStatusPollMessageAsync);
                    break;

                case MLQueueMessageType.ScoringExperimentUnpackRequest:
                    await HandleMessageExAsync<MLDeploymentMessage>(queueMessage, false /*fScoringExperiment*/, HandleExperimentUnpackMessageAsync);
                    break;

                case MLQueueMessageType.ScoringExperimentUnpackStatusPoll:
                    await HandleMessageExAsync<ActivityIdMessage>(queueMessage, false /*fScoringExperiment*/, HandleExperimentUnpackStatusPollMessageAsync);
                    break;

                case MLQueueMessageType.CreateProjectRequest:
                    await HandleMessageAsync<MLDeploymentMessage>(queueMessage, HandleCreateProjectMessageAsync);
                    break;

                case MLQueueMessageType.WebServiceCreationRequest:
                    await HandleMessageAsync<MLDeploymentMessage>(queueMessage, HandleCreateWebServiceMessageAsync);
                    break;

                case MLQueueMessageType.WebServiceCreationStatusPoll:
                    await HandleMessageAsync<ActivityIdMessage>(queueMessage, HandleWebServiceCreationStatusPollMessageAsync);
                    break;

                default:
                    NotReached();
                    break;
            }
        }

        private async Task HandleMessageAsync<TMessage>(MLQueueMessage queueMessage, TMessageHandler<TMessage> handler)
            where TMessage : MLDeploymentMessageBase
        {
            TMessage message = default(TMessage);

            Exception exception = null;

            try
            {
                message = JsonConvert.DeserializeObject<TMessage>(queueMessage.Body);
                await handler(message, queueMessage);
            }
            catch (WebException ex)
            {
                exception = ex;
            }
            catch (Exception ex)
            {
                exception = ex;
            }

            await CheckExceptionAndFailDeploymentAsync(exception, queueMessage.Type, message);
        }

        private async Task HandleMessageExAsync<TMessage>(MLQueueMessage queueMessage, bool fTraining, TMessageHandlerEx<TMessage> handler)
            where TMessage : MLDeploymentMessageBase
        {
            TMessage message = default(TMessage);

            Exception exception = null;

            try
            {
                message = JsonConvert.DeserializeObject<TMessage>(queueMessage.Body);
                await handler(message, fTraining, queueMessage);
            }
            catch (WebException ex)
            {
                exception = ex;
            }
            catch (Exception ex)
            {
                exception = ex;
            }

            await CheckExceptionAndFailDeploymentAsync(exception, queueMessage.Type, message);
        }

        private async Task CheckExceptionAndFailDeploymentAsync(Exception exception, MLQueueMessageType type, MLDeploymentMessageBase message)
        {
            if (exception == null) // No need to do anything
                return;

            if (exception is WebException)
            {
                String exceptionMessage=((WebException)exception).ParseDetails();
                await MarkMLDeploymentFailedAsync(exceptionMessage, type, message);
                LogError("Exception while processing ML queue message, Type: {0}, error details: {1}", type, exceptionMessage);
            }
            else
            {
                await MarkMLDeploymentFailedAsync(exception.Message, type, message);
                LogError("Exception while processing ML queue message, Type: {0}, error details: {1}", type, exception.Message);
            }


            if (message != null)
                await this.OnDeploymentFailureAsync(message.SubscriptionId, message.SolutionId, exception);
        }

        private async Task MarkMLDeploymentFailedAsync(string exceptionMessage, MLQueueMessageType type, MLDeploymentMessageBase message)
        {
            try
            {
                var statusUpdater = new MLDeploymentStatusUpdater(
                    message.SubscriptionId,
                    message.SolutionId,
                    message.ResourceGroupName,
                    message.OperationId,
                    this);

                await statusUpdater.OnDeploymentFailureAsync(exceptionMessage);
            }
            catch (Exception ex)
            {
                this.LogError("Further failure while trying to mark ML deployment as failed: {0}", ex);
            }
        }

        private bool IsMLApiExceptionRetriable(Exception ex)
        {
            if (!(ex is WebException))
                return false;

            var exWeb = ex as WebException;

            HttpWebResponse errorResponse = (HttpWebResponse)exWeb.Response;
            if (errorResponse == null)
                return false;

            return (errorResponse.StatusCode >= HttpStatusCode.InternalServerError);
        }

        private string ParseExceptionDetails(Exception ex)
        {
            if (ex is WebException)
                return (ex as WebException).ParseDetails();

            return ex.Message;
        }

        private async Task<T> ExecuteRetriableOperationAsync<T>(Func<Task<T>> action, MLQueueMessageType messageType, MLDeploymentMessage message, MLQueueMessageType retryMessageType, MLDeploymentMessage retryMessage)
        {
            T retVal = default(T);

            ExceptionDispatchInfo capturedException = null;
            try
            {
                retVal = await action();
            }
            catch (Exception ex)
            {
                capturedException = ExceptionDispatchInfo.Capture(ex);
            }

            if (capturedException != null)
            {
                var ex = capturedException.SourceException;

                if (IsMLApiExceptionRetriable(ex) && message.RetryCount < c_maxOperationRetryCount)
                {
                    retryMessage.RetryCount = message.RetryCount + 1;

                    Log(TraceEventType.Warning, "Encountered exception during {0} operation to target workspace:{1}, attempting a retry, RetryMessageType:{2}, RetryCount:{3}, exception details:{4}, stacktrace:{5}",
                        messageType.ToString(),
                        message.Workspace.Id,
                        retryMessageType.ToString(),
                        retryMessage.RetryCount,
                        ParseExceptionDetails(ex),
                        ex.StackTrace);

                    await PushMessageToQueueAsync(retryMessageType, retryMessage);

                    throw new RetryRequestedException();
                }
                else
                {
                    LogError("Failed during {0} operation to target workspace:{1}, RetryCount:{2}, exception details:{3}, stacktrace:{4}",
                        messageType.ToString(),
                        message.Workspace.Id,
                        message.RetryCount,
                        ParseExceptionDetails(ex),
                        ex.StackTrace);

                    capturedException.Throw();
                }
            }

            return retVal;
        }

        private async Task HandleDeploymentRequestAsync(MLBeginDeploymentMessage deploymentParams, MLQueueMessage queueMessage)
        {
            var statusUpdater = new MLDeploymentStatusUpdater(
                deploymentParams.SubscriptionId.ToString(),
                deploymentParams.SolutionId,
                deploymentParams.ResourceGroupName,
                deploymentParams.OperationId,
                this);

            await statusUpdater.CreateMLResourceOverwriteIfExistsAsync();

            // TODO rskumar: Check if this is sufficient or if we should create a new workspace everytime
            // Also, we have decided to delete the workspace on Delete deployment (work yet pending), that might cause some interesting problems too..
            string newWorkspaceName = deploymentParams.SolutionId + "_workspace";

            var client = GetMLClient(
                Guid.Parse(deploymentParams.SubscriptionId),
                deploymentParams.ResourceManagerToken
            );

            var newWorkspace = await client.CreateWorkspaceIfNotExistsAsync(new CreateWorkspaceRequest
            {
                Name = newWorkspaceName,
                StorageAccountName = deploymentParams.StorageAccountName,
                StorageAccountKey = deploymentParams.StorageAccountKey,
                Location = deploymentParams.Location,
                OwnerId = deploymentParams.UserEmail,
                OwnerPrincipalId = deploymentParams.UserPuid,
                ImmediateActivation = true, // We want the workspace auth token to be available immediately
                Source = MLApiSource.SolutionAccelerator.ToString()
            });

            LogInformation("Successfully issued CreateWorkspace request, NewWorkspaceName={0}, WorkspaceId:{1}, WorkspaceStatus:{2}, queuing message for next step",
                newWorkspaceName,
                newWorkspace.Id,
                newWorkspace.WorkspaceState.ToString());

            var newMessage = new MLDeploymentMessage
            {
                SubscriptionId = deploymentParams.SubscriptionId.ToString(),
                ResourceManagerToken = deploymentParams.ResourceManagerToken,
                ResourceGroupName = deploymentParams.ResourceGroupName,
                OperationId = deploymentParams.OperationId,
                SolutionId = deploymentParams.SolutionId,
                UserEmail = deploymentParams.UserEmail,
                UserPuid = deploymentParams.UserPuid,
                ScoringExperimentPackageLocation = deploymentParams.ScoringExperimentPackageLocation,
                ScoringCommunityUri = deploymentParams.ScoringCommunityUri,
                TrainingExperimentPackageLocation = deploymentParams.TrainingExperimentPackageLocation,
                TrainingCommunityUri = deploymentParams.TrainingCommunityUri,
                Workspace = newWorkspace,
                FinalTrainingExperimentId = null,
                FinalScoringExperimentId = null,
                Type = deploymentParams.Type,
                RetryCount = 0
            };

            await PushMessageToQueueAsync(MLQueueMessageType.WorkspaceCreationStatusPoll, newMessage);
        }

        private async Task HandleWorkspaceCreationStatusPollMessageAsync(MLDeploymentMessage message, MLQueueMessage queueMessage)
        {
            var client = GetMLClient(message);

            var workspace = await client.GetWorkspaceAsync(message.Workspace.Id);

            switch (workspace.WorkspaceState)
            {
                case WorkspaceStatus.Registered:
                    {
                        LogInformation("WorkspaceStatus is still Registered for WorkspaceId: {0}, scheduling a poll again",
                            workspace.Id);

                        await PushMessageToQueueAsync(queueMessage, c_workspaceCreationPollDelay);
                    }
                    break;

                case WorkspaceStatus.Enabled:
                    {
                        LogInformation("WorkspaceStatus is now Enabled for WorkspaceId: {0}, now queuing a message for training experiment unpack",
                            workspace.Id);

                        var statusUpdater = GetMLStatusUpdater(message);
                        await statusUpdater.WorkspaceCreatedAsync(message.Workspace);

                        message.Workspace = workspace; // update Workspace in the message object and queue it for next step

                        MLQueueMessageType nextMessageType = MLQueueMessageType.None;

                        if (string.IsNullOrEmpty(message.TrainingExperimentPackageLocation))
                        {
                            this.LogInformation("Looks like training experiment isn't available, so will skip to unpacking scoring experiment");
                            nextMessageType = MLQueueMessageType.ScoringExperimentUnpackRequest;
                        }
                        else
                        {
                            nextMessageType = MLQueueMessageType.TrainingExperimentUnpackRequest;
                        }

                        await PushMessageToQueueAsync(nextMessageType, message);
                    }
                    break;

                default:
                    throw new Exception("Invalid WorkspaceStatus!");
            }
        }

        private async Task HandleExperimentUnpackMessageAsync(MLDeploymentMessage message, bool fTraining, MLQueueMessage queueMessage)
        {
            var client = GetMLClient(message);

            string packageUri = fTraining ?
                message.TrainingExperimentPackageLocation :
                message.ScoringExperimentPackageLocation;

            string communityUri = fTraining ?
                message.TrainingCommunityUri :
                message.ScoringCommunityUri;

            ThrowIf.NullOrEmpty(packageUri, "packageUri");

            UnpackingStatusInfo unpackStatusInfo = null;

            try
            {
                unpackStatusInfo = await ExecuteRetriableOperationAsync<UnpackingStatusInfo>(async () =>
                    {
                        return await client.UnpackExperimentAsync(packageUri, communityUri, message.Workspace);
                    },
                    messageType: queueMessage.Type,
                    message: message,
                    retryMessageType: queueMessage.Type,
                    retryMessage: message);
            }
            catch(RetryRequestedException)
            {
                return;
            }
            
            LogInformation("Received UnpackStatus: {0} after attempting to unpack experiment PackageUri: {1} to target WorkspaceId: {2}, ActivityID: {3}. Queuing another message to poll for status",
                unpackStatusInfo.Status.ToString(),
                packageUri,
                message.Workspace.Id,
                unpackStatusInfo.ActivityId);

            var newPollMessage = new ActivityIdMessage
            {
                ActivityId = unpackStatusInfo.ActivityId,
                SubscriptionId = message.SubscriptionId,
                ResourceManagerToken = message.ResourceManagerToken,
                ResourceGroupName = message.ResourceGroupName,
                OperationId = message.OperationId,
                UserEmail = message.UserEmail,
                UserPuid = message.UserPuid,
                SolutionId = message.SolutionId,
                ScoringExperimentPackageLocation = message.ScoringExperimentPackageLocation,
                ScoringCommunityUri = message.ScoringCommunityUri,
                TrainingExperimentPackageLocation = message.TrainingExperimentPackageLocation,
                TrainingCommunityUri = message.TrainingCommunityUri,
                Workspace = message.Workspace,
                FinalTrainingExperimentId = message.FinalTrainingExperimentId,
                FinalScoringExperimentId = message.FinalScoringExperimentId,
                Type = message.Type,
                RetryCount = message.RetryCount
            };

            var newQueueMessageType = fTraining ?
                MLQueueMessageType.TrainingExperimentUnpackStatusPoll :
                MLQueueMessageType.ScoringExperimentUnpackStatusPoll;

            await PushMessageToQueueAsync(newQueueMessageType, newPollMessage);
        }

        private async Task HandleExperimentUnpackStatusPollMessageAsync(ActivityIdMessage message, bool fTraining, MLQueueMessage queueMessage)
        {
            var client = GetMLClient(message);

            string experimentType = fTraining ? "training" : "scoring";

            UnpackingStatusInfo unpackStatusInfo = null;

            try
            {
                unpackStatusInfo = await ExecuteRetriableOperationAsync<UnpackingStatusInfo>(async () =>
                    {
                        return await client.GetExperimentUnpackStatusAsync(message.ActivityId, message.Workspace);
                    },
                    messageType: queueMessage.Type,
                    message: message,
                    retryMessageType: (fTraining ? MLQueueMessageType.TrainingExperimentUnpackRequest : MLQueueMessageType.ScoringExperimentUnpackRequest),
                    retryMessage: MLDeploymentMessage.Clone(message));
            }
            catch(RetryRequestedException)
            {
                return;
            }

            if (unpackStatusInfo == null || unpackStatusInfo.Status == PackageStatus.Pending) // We sometimes get no response for a poll request, so a NULL value for response is okay here.
            {
                LogInformation("UnpackStatus still Pending/unavailable for {0} experiment, ActivityId: {1}, WorkspaceId: {2}, queuing another message",
                    experimentType,
                    message.ActivityId,
                    message.Workspace.Id);

                await PushMessageToQueueAsync(queueMessage, c_packingServicePollDelay);

                return;
            }

            if (unpackStatusInfo.Status != PackageStatus.Complete)
            {
                throw new Exception("Unknown value for UnpackStatus!");
            }

            string finalExperimentId = unpackStatusInfo.ExperimentId;

            LogInformation("UnpackStatus is Complete for {0} experiment, final ExperimentId: {1}, target WorkspaceId: {2}, ActivityId: {3}",
                experimentType,
                finalExperimentId,
                message.Workspace.Id,
                unpackStatusInfo.ActivityId);

            MLQueueMessageType newMessageType = MLQueueMessageType.None;

            MLDeploymentMessage newMessage = (MLDeploymentMessage)message;

            newMessage.RetryCount = 0;

            if (fTraining)
            {
                LogInformation("Queuing a message for ScoringExperiment unpack operation");

                newMessageType = MLQueueMessageType.ScoringExperimentUnpackRequest;
                newMessage.FinalTrainingExperimentId = finalExperimentId;
            }
            else
            {
                LogInformation("Queuing a message for CreateProject operation");

                var statusUpdater = GetMLStatusUpdater(message);
                await statusUpdater.CopiedExperimentsAsync(message.FinalTrainingExperimentId, finalExperimentId);

                newMessage.FinalScoringExperimentId = finalExperimentId;

                if (string.IsNullOrEmpty(message.FinalTrainingExperimentId))
                {
                    LogInformation("Skipping CreateProject step since TrainingExperiment doesn't seem to be available");
                    newMessageType = MLQueueMessageType.WebServiceCreationRequest;
                }
                else
                {
                    newMessageType = MLQueueMessageType.CreateProjectRequest;
                    newMessage.FinalTrainingExperimentId = message.FinalTrainingExperimentId;
                }
            }

            await PushMessageToQueueAsync(newMessageType, newMessage);
        }

        private async Task HandleCreateProjectMessageAsync(MLDeploymentMessage message, MLQueueMessage queueMessage)
        {
            var client = GetMLClient(message);

            ThrowIf.NullOrEmpty(message.FinalTrainingExperimentId, "message.FinalTrainingExperimentId");
            ThrowIf.NullOrEmpty(message.FinalScoringExperimentId, "message.FinalScoringExperimentId");

            var project = await client.CreateProjectAsync(
                message.FinalTrainingExperimentId,
                message.FinalScoringExperimentId);

            var statusUpdater = GetMLStatusUpdater(message);
            await statusUpdater.ProjectCreatedAsync(project);

            queueMessage.Type = MLQueueMessageType.WebServiceCreationRequest;
            await PushMessageToQueueAsync(queueMessage);
        }

        private async Task HandleCreateWebServiceMessageAsync(MLDeploymentMessage message, MLQueueMessage queueMessage)
        {
            var client = GetMLClient(message);

            ThrowIf.NullOrEmpty(message.FinalScoringExperimentId, "message.FinalScoringExperimentId");

            WebServiceCreationStatusInfo statusInfo = null;

            try
            {
                statusInfo = await ExecuteRetriableOperationAsync<WebServiceCreationStatusInfo>(async () =>
                    {
                        return await client.CreateWebServiceAsync(message.FinalScoringExperimentId, message.Workspace);
                    },
                    messageType: queueMessage.Type,
                    message: message,
                    retryMessageType: queueMessage.Type,
                    retryMessage: message);
            }
            catch (RetryRequestedException)
            {
                return;
            }

            Guid activityId = statusInfo.ActivityId;

            LogInformation("Web service creation started in WorkspaceId: {0}, with ScoringExperimentId: {1}, ActivityId: {2}, queuing a message to poll status",
                message.Workspace.Id,
                message.FinalScoringExperimentId,
                activityId.ToString());

            var newMessage = new ActivityIdMessage
            {
                ActivityId = activityId,
                SubscriptionId = message.SubscriptionId,
                ResourceManagerToken = message.ResourceManagerToken,
                ResourceGroupName = message.ResourceGroupName,
                OperationId = message.OperationId,
                UserEmail = message.UserEmail,
                UserPuid = message.UserPuid,
                SolutionId = message.SolutionId,
                ScoringExperimentPackageLocation = message.ScoringExperimentPackageLocation,
                ScoringCommunityUri = message.ScoringCommunityUri,
                TrainingExperimentPackageLocation = message.TrainingExperimentPackageLocation,
                TrainingCommunityUri = message.TrainingCommunityUri,
                FinalTrainingExperimentId = message.FinalTrainingExperimentId,
                FinalScoringExperimentId = message.FinalScoringExperimentId,
                Workspace = message.Workspace,
                Type = message.Type,
                RetryCount = message.RetryCount
            };

            await PushMessageToQueueAsync(MLQueueMessageType.WebServiceCreationStatusPoll, newMessage);
        }

        private async Task HandleWebServiceCreationStatusPollMessageAsync(ActivityIdMessage message, MLQueueMessage queueMessage)
        {
            var client = GetMLClient(message);

            WebServiceCreationStatusInfo statusInfo = null;

            try
            {
                statusInfo = await ExecuteRetriableOperationAsync<WebServiceCreationStatusInfo>(async () =>
                    {
                        return await client.GetWebServiceCreationStatusAsync(message.ActivityId, message.Workspace);
                    },
                    messageType: queueMessage.Type,
                    message: message,
                    retryMessageType: MLQueueMessageType.WebServiceCreationRequest,
                    retryMessage: MLDeploymentMessage.Clone(message));
            }
            catch (RetryRequestedException)
            {
                return;
            }

            if (statusInfo == null || statusInfo.Status == WebServiceCreationStatus.Pending) // We sometimes get no response for a poll request, so a NULL value for response is okay here.
            {
                LogInformation("WebServiceCreationStatus still Pending, ActivityId: {0}, WorkspaceId: {1}, queuing another message",
                    message.ActivityId,
                    message.Workspace.Id);

                await PushMessageToQueueAsync(queueMessage, c_webServiceCreationPollDelay);

                return;
            }

            var statusUpdater = GetMLStatusUpdater(message);

            if (statusInfo.Status == WebServiceCreationStatus.Failed)
            {
                String logMessage = String.Format("WebServiceCreation failed, WorkspaceId: {0}, Scoring experiment id: {1}, ActivityId: {2}",
                   message.Workspace.Id,
                   message.FinalScoringExperimentId,
                   message.ActivityId);

                LogError(logMessage);

                await statusUpdater.OnDeploymentFailureAsync("WebServiceCreation failed");

                throw new Exception(logMessage);
            }

            if (statusInfo.Status != WebServiceCreationStatus.Completed)
            {
                throw new Exception("Unexpected state for WebServiceCreationStatus");
            }

            var webService = await client.GetWebServiceAsync(statusInfo.WebServiceGroupId, statusInfo.EndpointId, message.Workspace);

            await statusUpdater.PublishedWebServiceAsync(webService);

            LogInformation("ML Deployment complete, TargetWorkspaceId: {0}, WebService details - Name: {1}, Location: {2}, scheduling an MLDeploymentComplete message",
                message.Workspace.Id,
                webService.Name,
                webService.ApiLocation);

            await ScheduleMLDeploymentCompleteMessage(message, webService);
        }

        private async Task ScheduleMLDeploymentCompleteMessage(IDeploymentMessage message, WebService webService)
        {
            this.LogInformation("Scheduling ML deployment complete message, subscriptionId: {0}, solutionId: {1}", message.SubscriptionId, message.SolutionId);

            if (message.Type == DeploymentType.WorkFlow)
            {
                var mlResource = new MachineLearningResource
                {
                    ProvisioningState = ProvisioningState.Succeeded.ToString(),
                    MLWebServiceApiLocation = webService.ApiLocation,
                    MLWebServiceBatchLocation = webService.ApiLocation + "/jobs",
                    MLWebServicePrimaryKey = webService.PrimaryKey
                };
                var statusUpdater = GetMLStatusUpdater((MLDeploymentMessage)message);
                await statusUpdater.UpdateMLResourceAsync(mlResource);
            }
            else
            {
                var postDeploymentMessage = new MLDeploymentCompleteMessage
                {
                    SubscriptionId = message.SubscriptionId,
                    SolutionId = message.SolutionId,
                    ResourceManagerToken = message.ResourceManagerToken,
                    UserEmail = message.UserEmail,
                    UserPuid = message.UserPuid,
                    MLWebServiceApiLocation = webService.ApiLocation,
                    MLWebServiceBatchLocation = webService.ApiLocation + "/jobs",
                    MLWebServicePrimaryKey = webService.PrimaryKey
                };

                var updateQueueMessage = new UpdateQueueMessage
                {
                    TracingActivityId = LogHelpers.GetCurrentActivityId(),
                    Type = UpdateQueueMessageType.MLDeploymentComplete,
                    Body = JsonConvert.SerializeObject(postDeploymentMessage)
                };

                var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(updateQueueMessage));
                await this.updateQueue.AddMessageAsync(cloudMessage);
            }
        }

        private MLQueueMessage NewMLQueueMessage(MLQueueMessageType messageType, MLDeploymentMessage messageBody)
        {
            return new MLQueueMessage
            {
                TracingActivityId = LogHelpers.GetCurrentActivityId(),
                Type = messageType,
                Body = JsonConvert.SerializeObject(messageBody)
            };
        }

        private async Task PushMessageToQueueAsync(MLQueueMessageType messageType, MLDeploymentMessage messageBody)
        {
            var mlQueueMessage = NewMLQueueMessage(messageType, messageBody);
            await PushMessageToQueueAsync(mlQueueMessage);
        }

        private async Task PushMessageToQueueAsync(MLQueueMessage message)
        {
            var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(message));
            await mQueue.AddMessageAsync(cloudMessage);
        }

        private async Task PushMessageToQueueAsync(MLQueueMessage message, TimeSpan initialVisibilityDelay)
        {
            var cloudMessage = new CloudQueueMessage(JsonConvert.SerializeObject(message));
            await mQueue.AddMessageAsync(cloudMessage,
                null /*timeToLive*/,
                initialVisibilityDelay,
                null /*options*/,
                null /*operationContext*/);
        }

        private MLDeploymentStatusUpdater GetMLStatusUpdater(MLDeploymentMessage message)
        {
            return new MLDeploymentStatusUpdater(message.SubscriptionId,
                message.SolutionId,
                message.ResourceGroupName,
                message.OperationId,
                this);
        }

        private MLApiClient GetMLClient(MLDeploymentMessage message)
        {
            return GetMLClient(Guid.Parse(message.SubscriptionId),
                message.ResourceManagerToken);
        }

        private MLApiClient GetMLClient(Guid subscriptionId, string userAccessToken)
        {
            return new MLApiClient(mWindowsManagementUri,
                mAzuremlManagementUri,
                mStudioApiUri,
                userAccessToken,
                subscriptionId,
                logger,
                mApiCallsLogger);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void LogInformation(string format, params object[] args)
        {
            this.Log(TraceEventType.Information, format, args);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void LogError(string format, params object[] args)
        {
            this.Log(TraceEventType.Error, format, args);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void Log(TraceEventType eventType, string format, params object[] args)
        {
            this.logger.Write(eventType, "MLDeploymentActor: " + format, args);
        }

        private void NotReached()
        {
            throw new Exception("This code path isn't expected to be reached!");
        }
    }
}
