using System.Collections.Generic;

namespace Microsoft.DataStudio.Solutions.Model
{
    public class SolutionProvisioningData
    {
        public string Message;
        public string ProvisioningState;
        public string DeploymentName;
        public List<ProvisioningOperation> Operations;
        public Dictionary<string, Parameter<object>> Outputs;
    }
}
