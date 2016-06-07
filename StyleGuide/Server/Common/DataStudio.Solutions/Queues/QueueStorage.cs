using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json;

namespace Microsoft.DataStudio.Solutions.Queues
{
    public class QueueStorage<T> where T : QueueEntity
    {
        private readonly CloudQueue cloudQueue;

        public int MessageCount
        {
            get { return cloudQueue.ApproximateMessageCount ?? 0; }
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="queueName">The name of the queue to be managed</param>
        /// <param name="storageConnectionString">The connection string pointing to the storage account (this can be local or hosted in Windows Azure</param>
        public QueueStorage(string queueName, string storageConnectionString)
            :this(queueName, CloudStorageAccount.Parse(storageConnectionString))
        {

        }

        public QueueStorage(string queueName, CloudStorageAccount cloudStorageAccount)
        {
            Validate.QueueName(queueName, "queueName");
            ThrowIf.Null(cloudStorageAccount, "cloudStorageAccount");

            var cloudQueueClient = cloudStorageAccount.CreateCloudQueueClient();
            cloudQueue = cloudQueueClient.GetQueueReference(queueName);
            cloudQueue.CreateIfNotExists();
        }

        /// <summary>
        /// Creates a new queue message with the given content and adds it to the queue
        /// </summary>
        /// <param name="message">The message to send to the queue.</param>
        public async Task AddAsync(T message)
        {
            ThrowIf.Null(message, "message");

            var jsonMessage = JsonConvert.SerializeObject(message);
            var cloudQueueMessage = new CloudQueueMessage(jsonMessage);

            await cloudQueue.AddMessageAsync(cloudQueueMessage);
        }

        public async Task<CloudQueueMessage> PeekAsync()
        {
            return await cloudQueue.PeekMessageAsync();
        }

        public Task<T> GetAsync()
        {
            return this.GetAsync(CancellationToken.None);
        }

        public async Task<T> GetAsync(CancellationToken cancellationToken)
        {
            var message = await cloudQueue.GetMessageAsync(cancellationToken);
            if (message == null)
            {
                return null;
            }

            var result = JsonConvert.DeserializeObject<T>(message.AsString);
            result.MessageId = message.Id;
            result.PopReceipt = message.PopReceipt;

            return result;
        }

        public async Task DeleteAsync(T entity)
        {
            ThrowIf.Null(entity, "entity");

            await cloudQueue.DeleteMessageAsync(entity.MessageId, entity.PopReceipt);
        }

        public async Task ClearAsync()
        {
            await cloudQueue.ClearAsync();
        }
    }
}