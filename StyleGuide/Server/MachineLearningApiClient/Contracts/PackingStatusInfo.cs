using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class PackingStatusInfo
    {
        public string Location { get; set; }

        public int ItemsComplete { get; set; }

        public int ItemsPending { get; set; }

        public PackageStatus Status { get; set; }

        public Guid ActivityId { get; set; }
    }
}
