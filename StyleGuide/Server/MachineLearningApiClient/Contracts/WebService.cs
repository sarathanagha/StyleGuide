using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class WebService
    {
        public string Name { get; set; }

        public string ApiLocation { get; set; }

        public string HelpLocation { get; set; }

        public string ExperimentLocation { get; set; }

        public DateTime CreationTime { get; set; }

        public string WorkspaceId { get; set; }

        public string WebServiceId { get; set; }

        public string PrimaryKey { get; set; }

        public string SecondaryKey { get; set; }
    }
}
