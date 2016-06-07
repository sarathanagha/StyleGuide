namespace Microsoft.DataStudio.Solutions.Queues.Entities
{
    public class UpdateDeploymentStatusMessage : CreateDeploymentMessage
    {
        public string DeploymentTemplateLink;
        public string DeploymentOutputs;
        public bool DeploymentComplete;
    }
}
