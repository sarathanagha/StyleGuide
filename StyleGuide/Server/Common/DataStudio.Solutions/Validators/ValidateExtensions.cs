using System.Diagnostics;
using Microsoft.DataStudio.Solutions.Queues.Entities;

namespace Microsoft.DataStudio.Solutions.Validators
{
    public static class ValidateExtensions
    {
        [DebuggerStepThrough]
        public static void Validate(this CreateDeploymentMessage message)
        {
            ThrowIf.NullOrEmpty(message.SubscriptionId, "message.SubscriptionId");
            ThrowIf.NullOrEmpty(message.SubscriptionId, "message.SolutionId");
            ThrowIf.NullOrEmpty(message.DeploymentTemplateId, "message.DeploymentTemplateId");
            ThrowIf.NullOrEmpty(message.ResourceManagerToken, "message.ResourceManagerToken");
        }

        [DebuggerStepThrough]
        public static void Validate(this UpdateDeploymentStatusMessage message)
        {
            ThrowIf.NullOrEmpty(message.SubscriptionId, "message.SubscriptionId");
            ThrowIf.NullOrEmpty(message.SolutionId, "message.SolutionId");
            ThrowIf.NullOrEmpty(message.ResourceManagerToken, "message.ResourceManagerToken");
            ThrowIf.NullOrEmpty(message.ResourceGroupName, "message.ResourceGroupName");
        }
    }
}