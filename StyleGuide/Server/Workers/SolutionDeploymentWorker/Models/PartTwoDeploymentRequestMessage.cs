using System;
using System.Collections.Generic;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Services.MachineLearning.Contracts;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Models
{
    public class PartTwoDeploymentRequestMessage : UpdateDeploymentStatusMessage
    {
        public string MLWebServiceBatchLocation { get; set; }

        public string MLWebServicePrimaryKey { get; set; }

        public Dictionary<string, string> ExeLinks { get; set; }
    }
}
