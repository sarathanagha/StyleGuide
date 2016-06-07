using System;
using System.Collections.Generic;
using Microsoft.DataStudio.Solutions.Queues.Entities;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Models
{
    class IntermediateDeploymentState
    {
        public UpdateDeploymentStatusMessage UpdateMessage { get; set; }

        public Configuration DataGenConfig { get; set; }
    }
}
