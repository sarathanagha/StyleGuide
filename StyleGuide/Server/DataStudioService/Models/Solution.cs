namespace Microsoft.DataStudio.Services.Models
{
    using Microsoft.DataStudio.Solutions.Model;
    using Microsoft.DataStudio.Solutions.Tables.Entities;
    using Microsoft.WindowsAzure.Storage.Table;
    using Newtonsoft.Json;
    using System.Collections.Generic;
    using System.ComponentModel;

    public class Solution : TableEntity
    {
        public string TemplatedId { get; set; }
        public string ResourceGroupName { get; set; } // ResourceGroup associated with this Solution

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<SolutionResource> Resources { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public SolutionProvisioningData Provisioning { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ExeLinks { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public MachineLearningResource MLResource { get; set; }
    }
}