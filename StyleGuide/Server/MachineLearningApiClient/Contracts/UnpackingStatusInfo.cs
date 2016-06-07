using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class UnpackingStatusInfo
    {
        public Guid ActivityId { get; set; }

        public PackageStatus Status { get; set; }

        public string ExperimentId { get; set; }
    }
}
