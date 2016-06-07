using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Microsoft.CortanaAnalytics.SolutionAccelerators.Shared
{
    public class TopicManager
    {
        private readonly string topicName;
        private readonly string connectionString;
        private readonly NamespaceManager manager;
        private TopicClient client;
        private ManualResetEvent pauseProcessingEvent;

        public TopicManager(string topicName, string connectionString)
        {
            this.topicName = topicName;
            this.connectionString = connectionString;
            manager = NamespaceManager.CreateFromConnectionString(this.connectionString);
            this.pauseProcessingEvent = new ManualResetEvent(true);
        }

        public async Task SendMessageAsync(BrokeredMessage message)
        {
            BrokeredMessage topicMessage = new BrokeredMessage();
            topicMessage.MessageId = Guid.NewGuid().ToString();
            topicMessage.SessionId = "My session Id";
            topicMessage.Properties["MessageNumber"] = message.MessageId;

            await client.SendAsync(topicMessage);
        }

        public void ReceiveMessages(Func<BrokeredMessage, Task> processMessageTask, string subscriptionName)
        {
            SubscriptionClient subClient = SubscriptionClient.CreateFromConnectionString(connectionString, topicName, subscriptionName);
            // Setup the options for the message pump.
            var options = new OnMessageOptions();

            // When AutoComplete is disabled, you have to manually complete/abandon the messages and handle errors, if any.
            options.AutoComplete = false;
            options.MaxConcurrentCalls = 10;
            options.ExceptionReceived += this.OptionsOnExceptionReceived;

            // Use of Service Bus OnMessage message pump. The OnMessage method must be called once, otherwise an exception will occur.
            subClient.OnMessageAsync(
                async (msg) =>
                {
                    // Will block the current thread if Stop is called.
                    this.pauseProcessingEvent.WaitOne();

                    // Execute processing task here
                    await processMessageTask(msg);
                },
                options);
        }

        public async Task Start()
        {
            // Check queue existence.
            if (!manager.TopicExists(this.topicName))
            {
                try
                {
                    var topicDescription = new TopicDescription(topicName);
                    //
                    // [parvezp] TODO : Set the topic description properties
                    //

                    await manager.CreateTopicAsync(topicDescription);
                }
                catch (MessagingEntityAlreadyExistsException)
                {
                    Trace.TraceWarning(
                        "MessagingEntityAlreadyExistsException Creating Queue - Queue likely already exists for path: {0}", this.topicName);
                }
                catch (MessagingException ex)
                {
                    var webException = ex.InnerException as WebException;
                    if (webException != null)
                    {
                        var response = webException.Response as HttpWebResponse;

                        // It's likely the conflicting operation being performed by the service bus is another queue create operation
                        // If we don't have a web response with status code 'Conflict' it's another exception
                        if (response == null || response.StatusCode != HttpStatusCode.Conflict)
                        {
                            throw;
                        }

                        Trace.TraceWarning("MessagingException HttpStatusCode.Conflict - Queue likely already exists or is being created or deleted for path: {0}", this.topicName);
                    }
                }
            }

            // Create the queue client. By default, the PeekLock method is used.
            client = TopicClient.CreateFromConnectionString(connectionString, topicName);
        }

        public async Task CreateSubscriptionAsync(string filterName, Filter filter)
        {
            if(manager.SubscriptionExists(topicName, filterName))
            {
                manager.DeleteSubscription(topicName, filterName);
            }
            await manager.CreateSubscriptionAsync(topicName, filterName, filter);
        }

        public async Task Stop(TimeSpan waitTime)
        {
            // Pause the processing threads
            this.pauseProcessingEvent.Reset();

            // There is no clean approach to wait for the threads to complete processing.
            // We simply stop any new processing, wait for existing thread to complete, then close the message pump and then return
            Thread.Sleep(waitTime);

            await this.client.CloseAsync();
        }

        private void OptionsOnExceptionReceived(object sender, ExceptionReceivedEventArgs exceptionReceivedEventArgs)
        {
            var exceptionMessage = "null";
            if (exceptionReceivedEventArgs != null && exceptionReceivedEventArgs.Exception != null)
            {
                exceptionMessage = exceptionReceivedEventArgs.Exception.Message;
                Trace.TraceError("Exception in QueueClient.ExceptionReceived: {0}", exceptionMessage);
            }
        }
    }
}
