using Microsoft.Azure.Management.DataLake.Store.Models;
using Microsoft.DataStudio.AzureResources.AzureDataLake;
using Microsoft.DataStudio.AzureResources.AzureSql;
using Microsoft.DataStudio.AzureResources.AzureStorage;
using Microsoft.DataStudio.AzureResources.HDInsight;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.WindowsAzure.Management.HDInsight;
using Microsoft.WindowsAzure.Management.Sql.Models;
using Microsoft.WindowsAzure.Management.Storage.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.AzureResources
{
    /// <summary>
    /// This class returns a list of Azure Resources providing the subscription and the token
    /// </summary>
    public class AzureResourcesHelper
    {
        public AzureResourcesHelper(string subscriptionId, string token, ILogger logger)
        {
            this.SubscriptionId = subscriptionId;
            this.Token = token;
            this.Credentials = new Azure.TokenCloudCredentials(subscriptionId, token);
            this.Logger = logger;
        }

        private string SubscriptionId;

        private string Token;

        public Azure.TokenCloudCredentials Credentials { get; private set; }

        private ILogger Logger; 


        public async Task<IEnumerable<StorageAccount>> GetStorageAccountsAsync()
        {
            return await AzureStorageHelper.GetStorageAccountsAsync(this.Credentials, this.Logger);
        }

        public async Task<IEnumerable<ClusterDetails>> GetHDInsightClustersAsync()
        {
            return await HDInsightHelper.GetClustersAsync(Guid.Parse(this.SubscriptionId), this.Token, this.Logger);
        }

        public async Task<IEnumerable<DataLakeStoreAccount>> GetDataLakeStoreAccountsAsync()
        {
            return await AzureDataLakeHelper.GetAccountsFromAzureInternalAsync(this.Credentials, this.Logger);
        }

        public async Task<Dictionary<Server, IEnumerable<Database>>> GetSqlServersAsync()
        {
            return await SqlAzureHelper.GetServersAsync(this.Credentials, this.Logger);
        }
    }
}
