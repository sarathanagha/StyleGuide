using Microsoft.Azure;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.WindowsAzure.Management.Sql;
using Microsoft.WindowsAzure.Management.Sql.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.AzureResources.AzureSql
{
    public static class SqlAzureHelper
    {
        private static Uri managementEndPoint = AzureConstants.AzureMgmtCoreCommonUri;
        
        /// <summary>
        /// Gets existing Azure Sql Servers and its Databeses under a subscription
        /// </summary>
        /// <param name="subscriptionCloudCredentials"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public static async Task<Dictionary<Server, IEnumerable<Database>>> GetServersAsync(SubscriptionCloudCredentials subscriptionCloudCredentials, ILogger logger)
        {
            logger.Write(TraceEventType.Verbose, "Getting All Sql Azure Servers");

            Dictionary<Server, IEnumerable<Database>> serverLookUp = new Dictionary<Server, IEnumerable<Database>>();
          
            try
            {
                SqlManagementClient client = new SqlManagementClient(subscriptionCloudCredentials, SqlAzureHelper.managementEndPoint);

                ServerListResponse response = await client.Servers.ListAsync();
                IEnumerable<Server> servers = response.Servers;

                foreach (Server server in servers)
                {
                    if (!serverLookUp.ContainsKey(server))
                    {
                        serverLookUp.Add(server, await SqlAzureHelper.GetDatabases(server.Name, subscriptionCloudCredentials, logger));
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, string.Format(CultureInfo.InvariantCulture, "Error getting Servers - {0}", ex));
            }

            logger.Write(TraceEventType.Verbose, "End Getting All Sql Azure Servers");

            return serverLookUp;
        }

        public static async Task<IEnumerable<Database>> GetDatabases(string serverName, SubscriptionCloudCredentials subscriptionCloudCredentials, ILogger logger)
        {
            logger.Write(TraceEventType.Verbose, string.Format(CultureInfo.InvariantCulture, "Getting All Sql Azure Databases for server: {0}", serverName));

            const string masterdb = "master";
            List<Database> databaseList = new List<Database>();
            try
            {
                SqlManagementClient client = new SqlManagementClient(subscriptionCloudCredentials, SqlAzureHelper.managementEndPoint);
                DatabaseListResponse dbs = await client.Databases.ListAsync(serverName);
                foreach (Database db in dbs.Databases)
                {
                    // Removing master database from the list
                    if (!db.Name.Equals(masterdb, StringComparison.OrdinalIgnoreCase))
                    {
                        databaseList.Add(db);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, string.Format(CultureInfo.InvariantCulture, "Error getting Databases for server {0} - {1}", serverName, ex));
            }

            logger.Write(TraceEventType.Verbose, string.Format(CultureInfo.InvariantCulture, "End Getting All Sql Azure Databases for server: {0}", serverName));

            return databaseList;
        }
    }
}
