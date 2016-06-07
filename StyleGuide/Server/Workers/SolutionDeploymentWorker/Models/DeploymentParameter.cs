using Microsoft.DataStudio.Solutions.Model;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Models
{
    public class DeploymentParameter
    {
        public Parameter<string> storageAccountName;
        public Parameter<string> namespaceName;
        public Parameter<string> ingestEventHubName;
        public Parameter<string> publishEventHubName;
        public Parameter<string> dataFactoryName;
        public Parameter<string> sqlServerName;
        public Parameter<string> sqlServerPassword;
        public Parameter<string> sqlServerUserName;
        public Parameter<string> streamingJobName;
        public Parameter<string> mLEndpointBatchLocation;
        public Parameter<string> mLEndpointKey;
        public Parameter<string> startTime;
        public Parameter<string> endTime;
        // TODO (jariek): These are temorary, until we can get some way
        // of allowing ARM templates to specify desired start and end
        // times as outputs (e.g. "2015-12-01", "[Now]" "[Now] + 1y"
        public Parameter<string> nowTime;
        public Parameter<string> nowPlusTenYearsTime;
    }
}
