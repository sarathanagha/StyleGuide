using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class CreateWorkspaceRequest
    {
        public string Name { get; set; }

        public string Location { get; set; }

        public string StorageAccountName { get; set; }

        public string StorageAccountKey { get; set; }

        public string OwnerId { get; set; }

        public string OwnerPrincipalId { get; set; }

        public bool ImmediateActivation { get; set; }

        public string Source { get; set; }
    }
}
