using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class WebServiceCreationStatusInfo
    {
        public Guid ActivityId { get; set; }

        public WebServiceCreationStatus Status { get; set; }

        public string WebServiceGroupId { get; set; }

        public string EndpointId { get; set; }
    }
}
