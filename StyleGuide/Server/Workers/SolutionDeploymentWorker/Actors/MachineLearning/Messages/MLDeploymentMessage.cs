using System;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Services.MachineLearning.Contracts;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.MachineLearning
{
    class MLDeploymentMessage : MLDeploymentMessageBase // This class has stuff that's incrementally populated and passed on to next message as ML deployment progresses
    {
        public static MLDeploymentMessage Clone(MLDeploymentMessage other)
        {
            return new MLDeploymentMessage
            {
                SubscriptionId = other.SubscriptionId,
                ResourceManagerToken = other.ResourceManagerToken,
                ResourceGroupName = other.ResourceGroupName,
                OperationId = other.OperationId,
                SolutionId = other.SolutionId,
                UserEmail = other.UserEmail,
                UserPuid = other.UserPuid,
                ScoringExperimentPackageLocation = other.ScoringExperimentPackageLocation,
                ScoringCommunityUri = other.ScoringCommunityUri,
                TrainingExperimentPackageLocation = other.TrainingExperimentPackageLocation,
                TrainingCommunityUri = other.TrainingCommunityUri,
                Workspace = other.Workspace,
                FinalTrainingExperimentId = other.FinalTrainingExperimentId,
                FinalScoringExperimentId = other.FinalScoringExperimentId,
                Type = other.Type,
                RetryCount = other.RetryCount
            };
        }

        public Workspace Workspace { get; set; }

        public string FinalTrainingExperimentId { get; set; }

        public string FinalScoringExperimentId { get; set; }

        public UInt32 RetryCount { get; set; }
    }
}
