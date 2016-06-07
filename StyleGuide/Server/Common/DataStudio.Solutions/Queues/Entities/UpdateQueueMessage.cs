using System;

namespace Microsoft.DataStudio.Solutions.Queues.Entities
{
    public enum UpdateQueueMessageType
    {
        UpdateDeploymentStatusMessage, // Body is UpdateDeploymentStatusMessage
        PartOneDeploymentComplete, // Body is PartOneDeploymentCompleteMessage
        MLDeploymentComplete, // Body is MLDeploymentCompleteMessage
        PartTwoDeploymentRequest // Body is PartTwoDeploymentRequestMessage
    }

    public class UpdateQueueMessage : QueueMessage
    {
        public UpdateQueueMessageType Type { get; set; }

        public string Body { get; set; }
    }
}
