using Microsoft.WindowsAzure.Storage.Table;

namespace Microsoft.DataStudio.Solutions.Tables.Entities
{
    public class SolutionEntity : TableEntity
    {
        public string TemplateId { get; set; }
        public string ResourceGroupName { get; set; } // ResourceGroup associated with this Solution

        public string Resources { get; set; } // Array of SolutionResource

        public string Provisioning { get; set; } // SolutionProvisioningData

        public string ExeLinks { get; set; }

        public string IntermediateDeploymentState { get; set; } // instance of IntermediateDeploymentState
        
        public string MachineLearningResource { get; set; }
    }
}
