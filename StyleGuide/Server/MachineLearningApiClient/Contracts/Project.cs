using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class Project
    {
        public Project()
        {
            this.Experiments = new List<ProjectExperiment>();
        }

        public string ProjectId { get; set; }

        public IList<ProjectExperiment> Experiments { get; set; }
    }
}
