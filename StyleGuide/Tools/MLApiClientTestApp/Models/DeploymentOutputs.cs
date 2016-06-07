using System;
using System.Collections.Generic;
using Microsoft.DataStudio.Services.MachineLearning.Contracts;

namespace MLApiClientTestApp.Models
{
    public class DeploymentOutputs
    {
        public Workspace NewWorkspace { get; set; }

        public WebService DeployedWebService { get; set; }
    }
}
