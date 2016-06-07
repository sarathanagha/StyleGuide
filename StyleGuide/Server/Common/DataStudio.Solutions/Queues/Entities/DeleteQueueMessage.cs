using System;

namespace Microsoft.DataStudio.Solutions.Queues.Entities
{
    public enum DeleteQueueMessageType
    {
        // TODO: We should break delete deployment operation into multiple steps so that it's scalable
        DeleteDeploymentMessage,
    }

    public class DeleteQueueMessage : QueueMessage
    {
        public DeleteQueueMessageType Type { get; set; }

        public string Body { get; set; }
    }
}
