using System.Collections.Generic;
namespace Microsoft.DataStudio.Solutions.Model
{
    public class SolutionResource
    {
        public string ResourceId;
        public string ResourceUrl;

        public string ResourceName;
        public string ResourceType;
        public string ResourceNamespace;

        public string ProvisioningState;
        public ProvisioningState State;
        public ProvisioningState CombinedState;

        public string StatusCode;
        public string StatusMessage;
        public string OperationId;

        public List<SolutionResource> Dependencies;

        public SolutionResource()
        {
        }

        public SolutionResource(SolutionResource solnResource)
        {
            this.ResourceId = solnResource.ResourceId;
            this.ResourceUrl = solnResource.ResourceUrl;
            this.ResourceName = solnResource.ResourceName;
            this.ResourceType = solnResource.ResourceType;
            this.ResourceNamespace = solnResource.ResourceNamespace;
            this.ProvisioningState = solnResource.ProvisioningState;
            this.State = solnResource.State;
            this.CombinedState = solnResource.CombinedState;
            this.StatusCode = solnResource.StatusCode;
            this.StatusMessage = solnResource.StatusMessage;
            this.OperationId = solnResource.OperationId;
        }
    }
}
