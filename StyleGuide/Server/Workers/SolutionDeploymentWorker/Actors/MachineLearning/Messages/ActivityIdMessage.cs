using System;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.MachineLearning
{
    class ActivityIdMessage : MLDeploymentMessage
    {
        public Guid ActivityId { get; set; }
    }
}
