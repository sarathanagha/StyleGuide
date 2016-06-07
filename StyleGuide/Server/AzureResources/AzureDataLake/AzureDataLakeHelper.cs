using Microsoft.Azure;
using Microsoft.Azure.Management.DataLake.Store;
using Microsoft.Azure.Management.DataLake.Store.Models;
using Microsoft.DataStudio.Diagnostics;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.AzureResources.AzureDataLake
{
    public static class AzureDataLakeHelper 
    {
        
        #region Get

        /// <summary>
        /// Gets existing DataLake store accounts under a subscription
        /// </summary>
        /// <param name="subscriptionCloudCredentials"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public static async Task<IEnumerable<DataLakeStoreAccount>> GetAccountsFromAzureInternalAsync(SubscriptionCloudCredentials subscriptionCloudCredentials, ILogger logger)
        {
            logger.Write(TraceEventType.Verbose, "Getting All DataLakeStore accounts");
            IEnumerable<DataLakeStoreAccount> subscriptionDataLakeAccounts = new List<DataLakeStoreAccount>();
            try
            {
                DataLakeStoreManagementClient dataLakeManagmentClient = new DataLakeStoreManagementClient(subscriptionCloudCredentials);

                DataLakeStoreAccountListResponse response = await dataLakeManagmentClient.DataLakeStoreAccount.ListAsync(null, null);
                subscriptionDataLakeAccounts = response.Value;
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, string.Format(CultureInfo.InvariantCulture, "Error getting Data Lake Accounts - {0}", ex));
            }
            logger.Write(TraceEventType.Verbose, "End Getting All DataLakeStore accounts");

            return subscriptionDataLakeAccounts;
        }

        #endregion
    }
}
