using System;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;

namespace StorageAccountSyncTool
{
    public class StorageAccountManager
    {
        private static string s_acceleratorsContainerName = "accelerators";

        private readonly CloudStorageAccount mStorageAccount;
        private readonly ILogger mLogger;
        private bool mUserChoseAll = false;

        public StorageAccountManager(string storageAccountName, string storageAccountKey, ILogger logger)
        {
            mLogger = logger;

            mStorageAccount = new CloudStorageAccount(new StorageCredentials(storageAccountName, storageAccountKey), true /*useHttps*/);
            LogVerbose("CloudStorageAccount created");
        }

        public async Task SyncTemplatesFromDirectoryAsync(string templatesDir)
        {
            WriteEmptyLine();
            LogInformation("Syncing ARM templates from directory: \"{0}\" to storage account: {1}", templatesDir, mStorageAccount.Credentials.AccountName);

            var blobClient = mStorageAccount.CreateCloudBlobClient();

            var directoryInfo = new DirectoryInfo(@templatesDir);
            foreach (var subDirectoryInfo in  directoryInfo.GetDirectories())
            {
                WriteEmptyLine();

                string containerName = subDirectoryInfo.Name.ToLower();
                await UploadDirectoryAsync(blobClient, containerName, subDirectoryInfo.FullName, string.Empty);
            }
        }

        //public async void SyncWithStorageAccountAsync(string sourceAccountName, string sourceAccountKey)
        //{
        //    // Scenario: User can supply the source storage account info on the commandline and we'll do these tasks to bring the dest storage acc in sync with source
        //    // 1) Copy blobs
        //    // 2) Create any queues missing in the destination storage account
        //    // 3) Copy template table entries
        //    //
        //    // TODO rskumar: I can take a look at this later based on priority
        //    // The current solution seems to be sufficient for the current problem and I've other high pri things to do at the moment
        //    //
        //}

        private async Task UploadDirectoryAsync(CloudBlobClient blobClient, string containerName, string sourceDirPath, string prefix)
        {
            LogVerbose("UploadDirectoryAsync containerName: {0}, sourceDirPath: {1}, prefix: {2}", containerName, sourceDirPath, prefix);

            var blobContainer = await EnsureContainerExistsAsync(blobClient, containerName);

            var directoryInfo = new DirectoryInfo(@sourceDirPath);

            foreach (var fileInfo in directoryInfo.GetFiles())
            {
                string blobName = fileInfo.Name;

                if (string.IsNullOrEmpty(prefix) && IsAcceleratorBlob(blobName, containerName))
                {
                    await UploadAcceleratorAsync(blobClient, blobName, fileInfo.FullName);
                    LogVerbose("Skipping {0} since we pushed them to {1} container", blobName, s_acceleratorsContainerName);
                    continue;
                }

                if (!string.IsNullOrEmpty(prefix))
                {
                    blobName = prefix + "/" + blobName;
                }

                await this.UploadBlockBlobAsync(blobContainer, blobName, fileInfo.FullName);
            }

            var subDirectories = directoryInfo.GetDirectories();
            foreach (var subDirectoryInfo in subDirectories)
            {
                var prefixNew = subDirectoryInfo.Name;
                if (!string.IsNullOrEmpty(prefix))
                {
                    prefixNew = prefix + "/" + prefixNew;
                }

                // Recursive call
                await this.UploadDirectoryAsync(blobClient, containerName, subDirectoryInfo.FullName, prefixNew);
            }
        }

        private bool IsAcceleratorBlob(string blobName, string containerName)
        {
            return (blobName.Equals(containerName + "_part1.json", StringComparison.OrdinalIgnoreCase)
                    || blobName.Equals(containerName + "_part2.json", StringComparison.OrdinalIgnoreCase));
        }

        private async Task UploadAcceleratorAsync(CloudBlobClient blobClient, string blobName, string filePath)
        {
            LogVerbose("UploadAcceleratorAsync blobName: {0}, filePath: \"{1}\"", blobName, filePath);

            var blobContainer = await EnsureContainerExistsAsync(blobClient, s_acceleratorsContainerName);

            await UploadBlockBlobAsync(blobContainer, blobName, filePath);
        }

        private async Task<CloudBlobContainer> EnsureContainerExistsAsync(CloudBlobClient blobClient, string containerName)
        {
            LogVerbose("EnsureContainerExistsAsync containerName: {0}", containerName);

            var blobContainer = blobClient.GetContainerReference(containerName);

            if (await blobContainer.ExistsAsync())
            {
                LogVerbose("Blob container {0} already exists, not creating a new one", containerName);
            }
            else
            {
                LogInformation("Creating blob container: {0}", containerName);
                await blobContainer.CreateAsync();

                LogInformation("Setting permissions for blob container {0} to BlobContainerPublicAccessType.Blob", containerName);
                await blobContainer.SetPermissionsAsync(new BlobContainerPermissions
                {
                    PublicAccess = BlobContainerPublicAccessType.Blob
                });
            }

            return blobContainer;
        }

        private async Task<CloudBlockBlob> UploadBlockBlobAsync(CloudBlobContainer blobContainer, string blobName, string filePath)
        {
            LogVerbose("UploadBlockBlobAsync blobName: {0}, filePath: \"{1}\"", blobName, filePath);

            var blockBlob = blobContainer.GetBlockBlobReference(blobName);

            if (await blockBlob.ExistsAsync())
            {
                bool fOverwrite = GetUserConfirmation(string.Format("Blob {0} already exists, overwrite?", blobName));

                if (!fOverwrite)
                {
                    LogInformation("Skipped uploading blob {0}", blobName);
                    return blockBlob;
                }
            }

            await blockBlob.UploadFromFileAsync(filePath, FileMode.OpenOrCreate);
            LogInformation("Uploaded {0} to container {1}", blobName, blobContainer.Name);

            return blockBlob;
        }

        private bool GetUserConfirmation(string message)
        {
            if (mUserChoseAll)
                return true;

            while (true)
            {
                Console.Write(message + " (Yes/No/All) ");

                var userInput = Console.ReadKey().KeyChar;
                Console.WriteLine(); //let the cursor go to the next line...

                switch (userInput)
                {
                    case 'Y':
                    case 'y':
                        return true;

                    case 'N':
                    case 'n':
                        return false;

                    case 'A':
                    case 'a':
                        mUserChoseAll = true;
                        return true;

                    default:
                        break;
                }
            }

            throw new Exception("Not reached");
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void WriteEmptyLine()
        {
            this.LogInformation(string.Empty);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void LogInformation(string format, params object[] args)
        {
            this.Log(TraceEventType.Information, format, args);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void LogVerbose(string format, params object[] args)
        {
            this.Log(TraceEventType.Verbose, format, args);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void Log(TraceEventType eventType, string format, params object[] args)
        {
            mLogger.Write(eventType, format, args);
        }
    }
}
