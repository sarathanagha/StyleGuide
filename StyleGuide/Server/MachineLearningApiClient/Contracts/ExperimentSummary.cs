using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class ExperimentSummary
    {
        public string ExperimentId { get; set; }

        public string Description { get; set; }

        public string Etag { get; set; }

        public string Creator { get; set; }

        public bool IsArchived { get; set; }

        public string JobId { get; set; }

        public string VersionId { get; set; }

        public string RunId { get; set; }

        public string OriginalExperimentDocumentationLink { get; set; }

        public string Summary { get; set; }

        public string Category { get; set; }

        public IList<string> Tags { get; set; }
    }
}
