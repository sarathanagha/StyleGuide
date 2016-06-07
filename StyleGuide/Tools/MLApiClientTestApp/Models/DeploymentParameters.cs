using System;
using System.Collections.Generic;

namespace MLApiClientTestApp.Models
{
    public class DeploymentParameters
    {
        public string ResourceManagerToken { get; set; }

        public Guid SubscriptionId { get; set; }

        public string StorageAccountName { get; set; }

        public string StorageAccountKey { get; set; }

        public string Location { get; set; }

        public string UserEmail { get; set; }

        public string UserPuid { get; set; }

        public string TrainingExperimentPackageLocation { get; set; }

        public string TrainingExperimentCommunityUri { get; set; }

        public string ScoringExperimentPackageLocation { get; set; }

        public string ScoringExperimentCommunityUri { get; set; }
    }
}
