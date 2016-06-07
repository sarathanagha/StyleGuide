using Microsoft.Azure.Management.Resources.Models;
using System;

namespace Microsoft.CortanaAnalytics.SolutionAccelerators.Shared
{
    public class DeploymentResult
    {
        readonly DeploymentOperationsCreateResult operationResult;
        readonly Guid correlationId;
        public DeploymentResult(DeploymentOperationsCreateResult operationResult, Guid correlationId)
        {
            this.operationResult = operationResult;
            this.correlationId = correlationId;
        }

        public DeploymentOperationsCreateResult OperationResult 
        { 
            get
            {
                return operationResult;
            }
        }

        public Guid CorrelationId
        {
            get
            {
                return correlationId;
            }
        }
    }
}
