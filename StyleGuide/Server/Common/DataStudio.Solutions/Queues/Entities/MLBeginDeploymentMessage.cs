using System;

namespace Microsoft.DataStudio.Solutions.Queues.Entities
{
    public class MLBeginDeploymentMessage : MLDeploymentMessageBase
    {        
        public string StorageAccountName { get; set; }

        public string StorageAccountKey { get; set; }

        public string StorageConnectionString { get; set; }

        public string Location { get; set; }
    }
}
