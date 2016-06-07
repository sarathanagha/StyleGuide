using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Models
{
    public class Configuration
    {
        public string IngestEventHubName;
        public string PublishEventHubName;
        public string EventHubName;
        public string EventHubConnectionString;
        public string StorageAccountConnectionString;
        public DataGenerator Generators;
        public string MLServiceLocation;
        public string MLEndpointKey;
    }
}
