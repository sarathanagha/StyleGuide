using Microsoft.DataStudio.Diagnostics;
using Microsoft.WindowsAzure.Management.Storage;
using Microsoft.WindowsAzure.Management.Storage.Models;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.AzureResources.AzureStorage
{
    public static class AzureStorageHelper 
    {
        private static Uri managementEndPoint = AzureConstants.AzureMgmtCoreBaseUri;
     
        /// <summary>
        /// Gets existing Azure Storage Accounts under a subscription
        /// </summary>
        /// <param name="subscriptionCredential"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public static async Task<IEnumerable<StorageAccount>> GetStorageAccountsAsync(Azure.SubscriptionCloudCredentials subscriptionCredential, ILogger logger)
        {
            logger.Write(TraceEventType.Verbose, "Getting All Storage Accounts");

            IEnumerable<StorageAccount> storageAccounts = new List<StorageAccount>();
           
            try
            {
                StorageManagementClient storageClient = new StorageManagementClient(subscriptionCredential, AzureStorageHelper.managementEndPoint);
                
                StorageAccountListResponse response = await storageClient.StorageAccounts.ListAsync();
                storageAccounts = response.StorageAccounts.ToList();
                
            }
            catch (Exception ex)
            {
                logger.Write(TraceEventType.Error, string.Format(CultureInfo.InvariantCulture, "Error getting Storage Accounts - {0}", ex));
            }

            logger.Write(TraceEventType.Verbose, "End Getting All Storage Accounts");
            return storageAccounts;
        }

        /// <summary>
        /// Gets a file from a blob
        /// </summary>
        /// <param name="connectionString"></param>
        /// <param name="fullPath"></param>
        /// <returns></returns>
        public static async Task<string> GetFile(string connectionString, string fullPath)
        {
            string[] path = fullPath.Split(new char[] { '\\', '/' });
            string containerPath = path[0];
            string blobPath = string.Join("\\", path, 1, path.Length - 1);
            CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(connectionString);
            CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient(); 
            
            CloudBlobContainer container = blobClient.GetContainerReference(containerPath);

            if (!await container.ExistsAsync())
            {
                throw new ApplicationException(string.Format(CultureInfo.InvariantCulture, 
                    "Couldn't retrieve file {0} from storage account {1}. Container doesn't exist", fullPath, cloudStorageAccount.BlobEndpoint));
            }

            // Retrieve reference to a blob .
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobPath);
            if (! await blockBlob.ExistsAsync())
            {
                throw new ApplicationException(string.Format(CultureInfo.InvariantCulture,
                       "Couldn't retrieve file {0} from storage account {1}. File doesn't exist", fullPath, cloudStorageAccount.Credentials.AccountName));
            }

            string text;
            using (var memoryStream = new MemoryStream())
            {
                await blockBlob.DownloadToStreamAsync(memoryStream);
                text = System.Text.Encoding.UTF8.GetString(memoryStream.ToArray());
            }

            return text;
        }
    }
}
