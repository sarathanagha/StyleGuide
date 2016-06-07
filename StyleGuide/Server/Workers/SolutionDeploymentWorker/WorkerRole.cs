using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Security;
using Microsoft.DataStudio.SolutionDeploymentWorker.Actors;
using Microsoft.DataStudio.SolutionDeploymentWorker.MachineLearning;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.Practices.Unity;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace Microsoft.DataStudio.SolutionDeploymentWorker
{
    public class WorkerRole : RoleEntryPoint
    {
        private const int IdleSleepInterval = 1000; // 1 sec

        private delegate Task QueueMessageHandler(IUnityContainer container, CloudQueueMessage message);

        private static IDictionary<string, QueueMessageHandler> s_queueMessageHandlers
            = new Dictionary<string, QueueMessageHandler>
            {
                { "Microsoft.QueueNames.CreateDeployment", TQueueMessageHandler<CreateDeploymentActor, CreateQueueMessage> },
                { "Microsoft.QueueNames.UpdateDeploymentStatus", UpdateDeploymentQueueMessageHandler },
                { "Microsoft.QueueNames.MLDeploymentRequests", TQueueMessageHandler<MLDeploymentActor, MLQueueMessage> },
                { "Microsoft.QueueNames.DeleteDeployment", TQueueMessageHandler<DeleteDeploymentActor, DeleteQueueMessage> },
            };

        private static string[] tableNames = new string[]{"solutions", "templates"};

        // By default, messages on the queue are visible to other instances after a default timeout period of 30s
        // The queue service expects that the client processing the message finishes and deletes the message within this timeout period
        // If the message isn't deleted by the handling instance within this period (which might be because it went down/got rebooted etc.), then the queue service design allows it to be picked by other instances
        // We spend more time in the DeleteQueue, hence increasing the default timeout here. There's a task to improve the DeleteQueue performance so we can scale
        private static TimeSpan c_queueMessageVisibilityTimeout = TimeSpan.FromMinutes(10);

        private readonly CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
        private readonly ManualResetEvent runCompleteEvent = new ManualResetEvent(false);
        private ILogger mLogger = null;
        private IUnityContainer mContainer = null;

        public override bool OnStart()
        {
            try
            {
                mLogger = LoggerFactory.CreateServiceLogger(new LoggerSettings
                {
                    ComponentId = ComponentID.SolutionDeploymentWorker,
                    EnableMdsTracing = Boolean.Parse(CloudConfigurationManager.GetSetting("Microsoft.Diagnostics.EnableMdsTracing")),
                    SourceLevels = (SourceLevels)Enum.Parse(typeof(SourceLevels), CloudConfigurationManager.GetSetting("Microsoft.Diagnostics.LogLevel"))
                });
            }
            catch(Exception ex)
            {
                Trace.TraceError("Failed to create Logger object in SolutionDeploymentWorker: {0}", ex);
                return false;
            }

            try
            {
                mLogger.Write(TraceEventType.Information, "SolutionDeploymentWorker is starting");

                // Set the maximum number of concurrent connections
                ServicePointManager.DefaultConnectionLimit = 12;

                // For information on handling configuration changes
                // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.

                if (!base.OnStart())
                    return false;

                mContainer = Initialize(mLogger);

                mLogger.Write(TraceEventType.Information, "SolutionDeploymentWorker has been started");

                return true;
            }
            catch(Exception ex)
            {
                mLogger.Write(TraceEventType.Critical, "Failed to start SolutionDeploymentWorker: {0}", ex);
                return false;
            }
        }

        public override void OnStop()
        {
            mLogger.Write(TraceEventType.Information, "SolutionDeploymentWorker is stopping");

            this.cancellationTokenSource.Cancel();
            this.runCompleteEvent.WaitOne();

            base.OnStop();

            mLogger.Write(TraceEventType.Information, "SolutionDeploymentWorker has stopped");
        }

        public override void Run()
        {
            try
            {
                // Starting processing of queues
                var queueTasks = new List<Task>();
                foreach (var handler in s_queueMessageHandlers)
                {
                    queueTasks.Add(ProcessQueueMessagesAsync(
                        this.mContainer,
                        this.cancellationTokenSource.Token,
                        this.mLogger,
                        CloudConfigurationManager.GetSetting(handler.Key),
                        handler.Value));
                }

                Task.WaitAll(queueTasks.ToArray());
            }
            finally
            {
                this.runCompleteEvent.Set();
            }
        }

        private static IUnityContainer Initialize(ILogger logger)
        {
            logger.Write(TraceEventType.Information, "Initializing SolutionDeploymentWorker role");

            var container = new UnityContainer();

            // Storage account
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("Microsoft.TableStorage.ConnectionString"));
            SetupStorageAccount(storageAccount);
            container.RegisterInstance<CloudStorageAccount>(storageAccount);

            // Storage clients
            container.RegisterType<CloudQueueClient>(new InjectionFactory(c => c.Resolve<CloudStorageAccount>().CreateCloudQueueClient()));
            container.RegisterType<CloudTableClient>(new InjectionFactory(c => c.Resolve<CloudStorageAccount>().CreateCloudTableClient()));
            container.RegisterType<ILogger>(new InjectionFactory(c => logger));

            // Actors
            container.RegisterType<CreateDeploymentActor>(new ContainerControlledLifetimeManager());
            container.RegisterType<UpdateDeploymentStatusActor>(new ContainerControlledLifetimeManager());
            container.RegisterType<PostDeploymentActor>(new ContainerControlledLifetimeManager());
            container.RegisterType<MLDeploymentActor>(new ContainerControlledLifetimeManager());
            container.RegisterType<DeleteDeploymentActor>(new ContainerControlledLifetimeManager());

            return container;
        }

        private static void SetupStorageAccount(CloudStorageAccount storageAccount)
        {
            var queueClient = storageAccount.CreateCloudQueueClient();

            foreach (var handler in s_queueMessageHandlers)
            {
                var queueName = CloudConfigurationManager.GetSetting(handler.Key);
                var queue = queueClient.GetQueueReference(queueName);
                // Create the queue if it doesn't exists
                queue.CreateIfNotExists();
            }

            var tableClient = storageAccount.CreateCloudTableClient();
            foreach(string tableName in tableNames)
            {
                var table = tableClient.GetTableReference(tableName);
                table.CreateIfNotExists();
            }
        }

        private static async Task ProcessQueueMessagesAsync(IUnityContainer container, CancellationToken cancellationToken, ILogger logger, string queueName, QueueMessageHandler handler)
        {
            logger.Write(TraceEventType.Information, "Initializing queue '{0}'...", queueName);
            var queue = container.Resolve<CloudQueueClient>().GetQueueReference(queueName);

            logger.Write(TraceEventType.Information, "Listening queue '{0}'...", queueName);
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    var message = await queue.GetMessageAsync(c_queueMessageVisibilityTimeout,
                        null, /* QueueRequestOptions */
                        null, /* OperationContext */
                        cancellationToken);

                    if (message == null)
                    {
                        await Task.Delay(IdleSleepInterval, cancellationToken);
                        continue;
                    }

                    if (message.DequeueCount > 1)
                    {
                        logger.Write(TraceEventType.Warning, "Possible QueueMessageTimeoutExceeded event: A queue message might've taken longer than VisibilityTimeout period of {0} minutes, " +
                            "this could mean either the original instance took longer to process or that it went down, please review, " +
                            "DequeueCount:{1}, MessageString:{2}",
                            c_queueMessageVisibilityTimeout.Minutes,
                            message.DequeueCount,
                            message.AsString);
                    }

                    try
                    {
                        await handler(container, message);
                    }
                    finally
                    {
                        queue.DeleteMessage(message);
                    }
                }
                catch (TaskCanceledException ex)
                {
                    // Stop requested
                    logger.Write(TraceEventType.Warning, "TaskCanceledException while processing queue '{0}': {1}", queueName, ex);
                }
                catch (Exception ex)
                {
                    logger.Write(TraceEventType.Error, "Error in processing queue '{0}': {1}", queueName, ex);
                }
            }
        }

        private static async Task TQueueMessageHandler<TDeploymentActor, TQueueMessage>(IUnityContainer container, CloudQueueMessage message)
            where TDeploymentActor: DeploymentActor
            where TQueueMessage: QueueMessage
        {
            var queueMessage = JsonConvert.DeserializeObject<TQueueMessage>(message.AsString);
            await container.Resolve<TDeploymentActor>().ExecuteAsync(queueMessage);
        }

        private static async Task UpdateDeploymentQueueMessageHandler(IUnityContainer container, CloudQueueMessage message)
        {
            var queueMessage = JsonConvert.DeserializeObject<UpdateQueueMessage>(message.AsString);

            if (queueMessage.Type == UpdateQueueMessageType.UpdateDeploymentStatusMessage)
            {
                await container.Resolve<UpdateDeploymentStatusActor>().ExecuteAsync(queueMessage);
            }
            else
            {
                await container.Resolve<PostDeploymentActor>().ExecuteAsync(queueMessage);
            }
        }
    }
}
