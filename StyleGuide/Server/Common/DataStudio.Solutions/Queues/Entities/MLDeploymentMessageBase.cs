using System;

namespace Microsoft.DataStudio.Solutions.Queues.Entities
{
    public class MLDeploymentMessageBase : IDeploymentMessage
    {
        public string OperationId { get; set; }

        public string ResourceGroupName { get; set; }

        public string TrainingExperimentPackageLocation { get; set; }

        public string ScoringExperimentPackageLocation { get; set; }

        public string TrainingCommunityUri { get; set; }

        public string ScoringCommunityUri { get; set; }
    }
}
