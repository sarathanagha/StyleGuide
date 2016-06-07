using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.Solutions.Queues.Entities
{
    public class IDeploymentMessage
    {
        public string SubscriptionId;
        public string SolutionId;

        public string UserEmail;
        public string UserPuid;
        public string ResourceManagerToken;
        public DeploymentType Type;
    }
}
