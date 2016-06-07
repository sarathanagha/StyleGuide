using System;
using System.Diagnostics;
using System.Threading;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.CortanaAnalytics.SolutionAccelerators.Shared;
using System.Threading.Tasks;
using Microsoft.Azure;

namespace Microsoft.CortanaAnalytics.SolutionAccelerators.ProvisionRole
{
    public class WorkerRole : RoleEntryPoint
    {
        private QueueManager queueManager;
        private TopicManager topicManager;
        private ManualResetEvent completedEvent = new ManualResetEvent(false);

        public override void Run()
        {
            // Start listening for messages on the queue.
            this.queueManager.ReceiveMessages(this.ProcessMessage);

            this.completedEvent.WaitOne();
        }

        public override bool OnStart()
        {
            var queueName = CloudConfigurationManager.GetSetting("QueueName");
            var connectionString = CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

            this.queueManager = new QueueManager(queueName, connectionString);
            this.queueManager.Start().Wait();

            // Perform TopicManager initialization and creation
            var topicName = CloudConfigurationManager.GetSetting("TopicName");
            this.topicManager = new TopicManager(topicName, connectionString);
            this.topicManager.Start().Wait();

            return base.OnStart();
        }

        public override void OnStop()
        {
            this.queueManager.Stop(TimeSpan.FromSeconds(30)).Wait();
            this.completedEvent.Set();

            base.OnStop();
        }

        private async Task ProcessMessage(BrokeredMessage message)
        {
            try
            {
                if (!this.IsValidMessage(message))
                {
                    // Send the message to the Dead Letter queue for further analysis.
                    await message.DeadLetterAsync("Invalid message", "The message Id is invalid");
                    Trace.WriteLine("Invalid Message. Sending to Dead Letter queue");
                }

                // Send a dummy message to the topic
                this.topicManager.SendMessageAsync(message).Wait();

                Trace.WriteLine("Consumer " + RoleEnvironment.CurrentRoleInstance.Id + " : Message processed successfully: " + message.MessageId);

                // Complete the message.
                await message.CompleteAsync();
            }
            catch (Exception ex)
            {
                // Abandon the message when appropriate.  If the message reaches the MaxDeliveryCount limit, it will be automatically deadlettered.
                message.Abandon();
                Trace.TraceError("An error has occurred while processing the message: " + ex.Message);
            }
        }

        private bool IsValidMessage(BrokeredMessage message)
        {
            // Simulate message validation.
            return !string.IsNullOrWhiteSpace(message.MessageId);
        }
    }
}
