using Microsoft.DataStudio.Diagnostics;
using Microsoft.WindowsAzure.Management.HDInsight;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.AzureResources.HDInsight
{
    public static class HDInsightHelper
    {
        private static Uri managementEndPoint = AzureConstants.AzureMgmtCoreCommonUri;
        
        /// <summary>
        /// Get existing HDInsight clusters under a subscription
        /// </summary>
        /// <param name="subscriptionId"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public static async Task<IEnumerable<ClusterDetails>> GetClustersAsync(Guid subscriptionId, string token, ILogger logger)
        {
            logger.Write(TraceEventType.Verbose, "Getting All HDInsight clusters");

           IEnumerable<ClusterDetails> clusters = new List<ClusterDetails>();

            try
            {
                IHDInsightSubscriptionCredentials hdinsightCredential = new HDInsightAccessTokenCredential(subscriptionId, token, HDInsightHelper.managementEndPoint);
                IHDInsightClient client = HDInsightClient.Connect(hdinsightCredential);

                //TODO: pacodel added small hack cause somehow not having this is creating a deadlock
                await Task.Run(async () => clusters = await client.ListClustersAsync());
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, string.Format(CultureInfo.InvariantCulture, "Error getting HDiInsight clusters - {0}", ex));
            }
            logger.Write(TraceEventType.Verbose, "End Getting All HDInsight clusters");
            return clusters;
        }
    }
}
