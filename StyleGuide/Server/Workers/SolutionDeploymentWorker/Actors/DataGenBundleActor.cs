using System;
using System.IO;
using System.IO.Compression;
using System.Collections.Generic;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Auth;
using System.Threading.Tasks;
using Microsoft.DataStudio.SolutionDeploymentWorker.Models;
using Microsoft.Azure;
using System.Net;
using System.Diagnostics;
using Microsoft.DataStudio.Diagnostics;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Actors
{
    public class DataGenBundleActor
    {
        private readonly ILogger logger;
        public DataGenBundleActor(ILogger logger)
        {
            this.logger = logger;
        }

        private async Task ExtractDataGeneratorFromZip(string zipFile, string extractPath)
        {
            HttpWebRequest zipRequest = (HttpWebRequest)WebRequest.Create(zipFile);
            using (var respZip = (await zipRequest.GetResponseAsync()).GetResponseStream())
            using (var archive = new ZipArchive(respZip, ZipArchiveMode.Read, false))
                archive.ExtractToDirectory(extractPath);
        }

        private void UpdateConfigFile(string configFilePath, Configuration updateConfig)
        {
            var configFileContents = File.ReadAllText(configFilePath);
            configFileContents = configFileContents.Replace("[IngestEventHubName]", updateConfig.IngestEventHubName);
            configFileContents = configFileContents.Replace("[PublishEventHubName]", updateConfig.PublishEventHubName);
            configFileContents = configFileContents.Replace("[EventHubName]", updateConfig.EventHubName);
            configFileContents = configFileContents.Replace("[MLServiceLocaton]", updateConfig.MLServiceLocation);
            configFileContents = configFileContents.Replace("[MLEndpointKey]", updateConfig.MLEndpointKey);
            configFileContents = configFileContents.Replace("[StorageAccountConnectionString]", updateConfig.StorageAccountConnectionString);
            configFileContents = configFileContents.Replace("[EventHubConnectionString]", updateConfig.EventHubConnectionString);

            File.WriteAllText(configFilePath, configFileContents);
        }

        private async Task<string> ZipDataGenerator(string requestId, Generator generator, Configuration updateConfig)
        {
            var connectionString = CloudConfigurationManager.GetSetting("Microsoft.TableStorage.ConnectionString");
            // [parvezp] Hack because currently when using local dev storage the copy step fails with 404
            // I have asked the Storage team why this is happening and will remove this hack once have a 
            // real solution in place
            if (connectionString.Contains("UseDevelopmentStorage=true"))
            {
                connectionString = CloudConfigurationManager.GetSetting("Microsoft.BlobStorage.ConnectionString");
            }

            var sourceStorageAccount = CloudStorageAccount.Parse(connectionString);

            var sourceContainer = sourceStorageAccount.CreateCloudBlobClient().GetContainerReference(updateConfig.Generators.ContainerName);
            bool sourceContainerExists = await sourceContainer.ExistsAsync();

            var extractPath = string.Empty;
            var configName = string.Empty;

            if (!sourceContainerExists)
            {
                throw new Exception(string.Format("DataGenbundleActor: Source container: {0} doesn't exist", sourceContainer.Name));
            }
            else
            {
                try
                {
                    var generatorLink = await sourceContainer.GetBlobReferenceFromServerAsync(generator.Name + ".zip");
                    var currentPath = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase);
                    var extractRoot = Path.Combine(currentPath, "DataGenerators");
                    Directory.CreateDirectory("DataGenerators");

                    extractPath = Path.Combine("DataGenerators", requestId);

                    await ExtractDataGeneratorFromZip(generatorLink.Uri.AbsoluteUri, extractPath);

                    configName = string.IsNullOrEmpty(generator.Config) ? generator.Name : generator.Config;
                    var configFilePath = Path.Combine(extractPath, generator.Name, configName + ".exe.config");
                    if (!File.Exists(configFilePath))
                    {
                        foreach (var subdir in Directory.GetDirectories(Path.Combine(extractPath, generator.Name)))
                        {
                            string testPath = Path.Combine(subdir, configName + ".exe.config");
                            if (File.Exists(testPath))
                            {
                                configFilePath = testPath;
                                break;
                            }
                        }
                    }

                    UpdateConfigFile(configFilePath, updateConfig);

                    ZipFile.CreateFromDirectory(extractPath, requestId + ".zip");
                    return new Uri(Path.Combine(currentPath, requestId + ".zip")).LocalPath;
                } 
                catch (Exception ex)
                {
                    logger.Write(TraceEventType.Error, "Exception: {0} while updating the config for {1}", ex.Message, configName);
                    throw;
                }
                finally
                {
                    Directory.Delete(extractPath, true);
                }                
            }
        }

        private byte[] GetBytesFromGeneratedZip(string base64ZipFileName)
        {
            return File.ReadAllBytes(base64ZipFileName);
        }

        private async Task<string> WriteToBlob(byte[] payload, string name, CloudBlobContainer container)
        {
            var permissions = new BlobContainerPermissions();
            permissions.PublicAccess = BlobContainerPublicAccessType.Blob;
            container.SetPermissions(permissions);
            var blockBlob = container.GetBlockBlobReference(name);
            await blockBlob.UploadFromByteArrayAsync(payload, 0, payload.Length);
            var sasToken = blockBlob.GetSharedAccessSignature(new SharedAccessBlobPolicy()
            {
                Permissions = SharedAccessBlobPermissions.Read,
                SharedAccessStartTime = DateTime.UtcNow,
                //Only creating shared access token with validity of 1 month.
                //These URLs are going to accessed to download zip files with exe
                //Once the download is complete end-user won't really have a need for this
                //URL. Should the validity of this sas token be further reduced?
                SharedAccessExpiryTime = DateTime.UtcNow.AddMonths(1)
            });

            return blockBlob.Uri.ToString() + sasToken;
        }

        public async Task<string> GenerateZipAndGetSASTokenizedUrl(Generator generator, Configuration updateConfig)
        {
            var blobClient = CloudStorageAccount.Parse(updateConfig.StorageAccountConnectionString).CreateCloudBlobClient();
            var destinationContainer = blobClient.GetContainerReference(updateConfig.Generators.ContainerName);
            var pathToZip = await ZipDataGenerator(Guid.NewGuid().ToString(), generator, updateConfig);
            var url = await WriteToBlob(GetBytesFromGeneratedZip(pathToZip), generator.Name + ".zip", destinationContainer);
            File.Delete(pathToZip);
            this.logger.Write(TraceEventType.Information, "DataGenBundleActor: Created container {0} in storage and copied zip file from {1} to user blob storage", 
                              updateConfig.Generators.ContainerName, pathToZip);
            return url;
        }
    }
}
