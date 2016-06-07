using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class WebServiceGroup
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime CreationTime { get; set; }

        public string WorkspaceId { get; set; }

        public string DefaultEndpointName { get; set; }

        public int? EndpointCount { get; set; }
    }
}
