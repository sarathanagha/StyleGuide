using System;
using System.Collections.Generic;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Services.MachineLearning.Contracts;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Models
{
    public class MLDeploymentCompleteMessage : IDeploymentMessage
    {
        public string MLWebServiceApiLocation { get; set; }

        public string MLWebServiceBatchLocation { get; set; }

        public string MLWebServicePrimaryKey { get; set; }
    }
}
