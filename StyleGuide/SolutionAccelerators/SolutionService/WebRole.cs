using System;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.CortanaAnalytics.SolutionAccelerators.Shared;
using System.Threading;
using Microsoft.Azure;
using System.Threading.Tasks;
using Microsoft.ServiceBus.Messaging;
using System.Diagnostics;

namespace Microsoft.CortanaAnalytics.SolutionAccelerators.SolutionRole
{
    public class WebRole : RoleEntryPoint
    {
        private QueueManager queueManager;
        private TopicManager topicManager;
        private bool keepRunning = true;
        private string subscriptionName;

        public override bool OnStart()
        {
            var connectionString = CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

            // Perform QueueManager initialization and creation
            var queueName = CloudConfigurationManager.GetSetting("QueueName");
            this.queueManager = new QueueManager(queueName, connectionString);
            this.queueManager.Start().Wait();

            // Perform TopicManager initialization and creation
            var topicName = CloudConfigurationManager.GetSetting("TopicName");
            this.topicManager = new TopicManager(topicName, connectionString);
            this.topicManager.Start().Wait();

            // Create an empty subscription to get all the messages in the topic
            // This process really needs to be even driven
            this.subscriptionName = "All";
            this.topicManager.CreateSubscriptionAsync(this.subscriptionName, new SqlFilter("MessageNumber != NULL")).Wait();

            return base.OnStart();
        }

        public override void Run()
        {
            while (this.keepRunning)
            {
                // Send messages in batch
                this.queueManager.SendMessagesAsync().Wait();

                this.topicManager.ReceiveMessages(this.ProcessMessageTask, this.subscriptionName);
                Thread.Sleep(10000);
            }
        }

        private async Task ProcessMessageTask(BrokeredMessage message)
        {
            try
            {
                if (!this.IsValidMessage(message))
                {
                    // Send the message to the Dead Letter queue for further analysis.
                    await message.DeadLetterAsync("Invalid message", "The message Id is invalid");
                    Trace.WriteLine("Invalid Message. Sending to Dead Letter queue");
                }

                // Simulate message processing.
                await Task.Delay(TimeSpan.FromSeconds(2)).ConfigureAwait(false);

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
