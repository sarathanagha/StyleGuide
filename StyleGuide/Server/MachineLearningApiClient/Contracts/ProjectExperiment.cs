using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class ProjectExperiment
    {
        public string ExperimentId { get; set; }

        public ExperimentRole Role { get; set; }

        public ExperimentSummary Experiment { get; set; }
    }
}
