using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class Workspace
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public Guid SubscriptionId { get; set; }

        public string Region { get; set; }

        public string OwnerId { get; set; }

        public string StorageAccountName { get; set; }

        public WorkspaceStatus WorkspaceState { get; set; }

        public string EditorLink { get; set; }

        public ResourceAuthorizationToken AuthorizationToken { get; set; }
    }
}
