using System;

namespace Microsoft.DataStudio.Solutions.Queues.Entities
{
    public enum MLQueueMessageType
    {
        None,

        BeginDeploymentRequest, // Body is MLBeginDeploymentMessage

        WorkspaceCreationStatusPoll, // Body is MLDeploymentMessage

        TrainingExperimentUnpackRequest, // Body is MLDeploymentMessage
        TrainingExperimentUnpackStatusPoll, // Body is ActivityIdMessage

        ScoringExperimentUnpackRequest, // Body is MLDeploymentMessage
        ScoringExperimentUnpackStatusPoll, // Body is ActivityIdMessage

        CreateProjectRequest, // Body is MLDeploymentMessage

        WebServiceCreationRequest, // Body is MLDeploymentMessage
        WebServiceCreationStatusPoll // Body is ActivityIdMessage
    }

    public class MLQueueMessage : QueueMessage
    {
        public MLQueueMessageType Type { get; set; }

        public string Body { get; set; }
    }
}
