using Microsoft.Azure.Management.Resources.Models;
namespace Microsoft.DataStudio.Services.Models
{
    public class SolutionDeployParameters
    {
        public string DeploymentName { get; set; }
        public string SolutionId { get; set; }

        public string TemplateId { get; set; }

        public string TemplateParameters { get; set; }

        public string UserEmail { get; set; }

        public string UserPuid { get; set; }

        public string ResourceGroupName { get; set; }

        public DeploymentProperties Properties { get; set; }
    }
}