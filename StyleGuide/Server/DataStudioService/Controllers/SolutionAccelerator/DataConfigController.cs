using Microsoft.Azure;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Xml;

namespace Microsoft.DataStudio.Services.Controllers.SolutionAccelerator
{
    public class DataConfigController : SolutionControllerBase
    {
        public DataConfigController(ILogger logger)
            : base(logger)
        {
        }

        [HttpPost]
        [ResponseType(typeof(string))]
        [Route("api/{subscriptionId}/dataconfig")]
        public async Task<IHttpActionResult> Post([FromUri] string subscriptionId, [FromBody] DataGeneratorConfig parameters)
        {
            ThrowIf.Null(parameters, "dataconfig can't have null parameters");
            ThrowIf.NullOrEmpty(parameters.ZipFileUrl, "URL can't be empty");
            ThrowIf.NullOrEmpty(parameters.ConfigName, "Config file name can't be empty");

            var pathToZip = await ZipDataGeneratorAsync(parameters);
            var url = await WriteToBlobAsync(GetBytesFromGeneratedZip(pathToZip), parameters.GeneratorName + ".zip", parameters.ContainerName, parameters.ConnectionString);
            File.Delete(pathToZip);
            this.logger.Write(TraceEventType.Information, "DataConfigController: Created container {0} in storage and copied zip file from {1} to user blob storage",
                              parameters.ContainerName, pathToZip);

            return Ok(url);
        }

        private async Task ExtractDataGeneratorFromZipAsync(string zipFile, string extractPath)
        {
            HttpWebRequest zipRequest = (HttpWebRequest)WebRequest.Create(zipFile);
            using (var respZip = (await zipRequest.GetResponseAsync()).GetResponseStream())
            using (var archive = new ZipArchive(respZip, ZipArchiveMode.Read, false))
                archive.ExtractToDirectory(extractPath);
        }

        private void UpdateConfigFile(string configFilePath, Dictionary<string, string> parameters)
        {            
            var configFileContents = File.ReadAllText(configFilePath);
            foreach (KeyValuePair<string, string> parameter in parameters)
            {
                configFileContents = configFileContents.Replace(parameter.Key, parameter.Value);
            }

            File.WriteAllText(configFilePath, configFileContents);
        }

        private async Task<string> ZipDataGeneratorAsync(DataGeneratorConfig config)
        {
            var extractPath = string.Empty;
            var configName = string.Empty;
            var requestId = Guid.NewGuid().ToString();
            try
            {
                var currentPath = new Uri(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().CodeBase)).LocalPath;
                Directory.SetCurrentDirectory(currentPath);
                Directory.CreateDirectory("DataGenerators");

                extractPath = Path.Combine("DataGenerators", requestId);

                await ExtractDataGeneratorFromZipAsync(config.ZipFileUrl, extractPath);

                var configFilePath = Path.Combine(extractPath, config.ConfigName);
                if (!File.Exists(configFilePath))
                {
                    foreach (var subdir in Directory.GetDirectories(Path.Combine(extractPath)))
                    {
                        string testPath = Path.Combine(subdir, config.ConfigName);
                        if (File.Exists(testPath))
                        {
                            configFilePath = testPath;
                            break;
                        }
                    }
                }

                UpdateConfigFile(configFilePath, config.Parameters);

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

        private async Task<string> WriteToBlobAsync(byte[] payload, string generatorName, string containerName, string connectionString)
        {
            var blobClient = CloudStorageAccount.Parse(connectionString).CreateCloudBlobClient();
            var destinationContainer = blobClient.GetContainerReference(containerName);
            await destinationContainer.CreateIfNotExistsAsync();

            var permissions = new BlobContainerPermissions();
            permissions.PublicAccess = BlobContainerPublicAccessType.Blob;
            destinationContainer.SetPermissions(permissions);
            var blockBlob = destinationContainer.GetBlockBlobReference(generatorName);
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

        private byte[] GetBytesFromGeneratedZip(string base64ZipFileName)
        {
            return File.ReadAllBytes(base64ZipFileName);
        }
    }
}