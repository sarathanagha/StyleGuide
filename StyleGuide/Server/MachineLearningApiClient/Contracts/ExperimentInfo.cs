using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class ExperimentInfo
    {
        public string ExperimentId { get; set; }

        public string RunId { get; set; }

        public string ParentExperimentId { get; set; }

        public string OriginalExperimentDocumentationLink { get; set; }

        public string Summary { get; set; }

        public string Description { get; set; }

        public string Creator { get; set; }

        public string Category { get; set; }
    }
}
