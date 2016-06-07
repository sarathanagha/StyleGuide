using Microsoft.Azure.Management.Resources.Models;
namespace Microsoft.DataStudio.Solutions.Queues.Entities
{
    public class CreateDeploymentMessage : IDeploymentMessage
    {
        public string ResourceGroupName;
        public string DeploymentName;
        public string DeploymentTemplateId;
        public string DeploymentParameters;
        public DeploymentProperties Properties;
    }
}
