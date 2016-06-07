using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class AddOrUpdateProjectRequest
    {
        public AddOrUpdateProjectRequest()
        {
            this.Experiments = new List<ProjectExperiment>();
        }

        public IList<ProjectExperiment> Experiments { get; set; }
    }
}
