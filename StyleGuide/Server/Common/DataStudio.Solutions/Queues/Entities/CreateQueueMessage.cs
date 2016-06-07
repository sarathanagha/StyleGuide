using System;

namespace Microsoft.DataStudio.Solutions.Queues.Entities
{
    public enum CreateQueueMessageType
    {
        // TODO: We should consider breaking this into multipe steps (e.g. CreateResourceGroup, SubmitDeploymentRequest etc.) so it scales
        CreateDeploymentMessage,
    }

    public class CreateQueueMessage : QueueMessage
    {
        public CreateQueueMessageType Type { get; set; }

        public string Body { get; set; }
    }
}
