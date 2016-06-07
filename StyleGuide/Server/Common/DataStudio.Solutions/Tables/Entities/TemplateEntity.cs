using Microsoft.WindowsAzure.Storage.Table;

namespace Microsoft.DataStudio.Solutions.Tables.Entities
{
    public class TemplateEntity : TableEntity
    {
        public string DeploymentTemplateLink {get; set;}
        public string DeploymentParameters {get; set;}
        public string ResourcesTopology {get; set;}
    }
}