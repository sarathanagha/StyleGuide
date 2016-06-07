using Microsoft.DataStudio.Solutions.Model;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Models
{
    public class DeploymentOutputs
    {
        public Parameter<string> StorageAccountName;
        public Parameter<string> StorageAccountConnectionString;
        public Parameter<string> EventHubName;
        public Parameter<string> EventHubConnectionString;
        public Parameter<string> IngestEventHubName;
        public Parameter<string> PublishEventHubName;
        public Parameter<string> DatabaseName;
        public Parameter<string> DataContainerName;
        public Parameter<string> ScriptContainerName;
        public Parameter<string> SqlScript;
        public Parameter<DataGenerator> DataGenerator;
        public Parameter<MLExperimentLinks> MLExperiments;
        public Parameter<string> WorkFlowName;
    }
}
