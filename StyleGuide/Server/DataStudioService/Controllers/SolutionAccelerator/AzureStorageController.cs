using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Models;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Microsoft.DataStudio.Services.Controllers.SolutionAccelerator
{    
    [Authorize]
    public class AzureStorageController : SolutionControllerBase
    {
        public AzureStorageController(ILogger logger)
            : base(logger)
        {
        }

        [HttpPost]
        [Route("api/{subscriptionId}/createcontainer")]
        public async Task<IHttpActionResult> Post([FromUri] string subscriptionId, [FromBody] CreateContainerParameters parameters)
        {
            var stopwatch = Stopwatch.StartNew();
            await CheckAccessLevel(subscriptionId, AccessLevel.ReadWrite);

            var containerName = parameters.ContainerName;
            ThrowIf.NullOrEmpty(containerName, "parameters.ContainerName");
            ThrowIf.NullOrEmpty(parameters.DestinationContainerConnectionString, "parameters.DestinationContainerConnectionString");

            // Create a blob storage container if doesn't exists
            var blobClient = CloudStorageAccount.Parse(parameters.DestinationContainerConnectionString).CreateCloudBlobClient();
            CloudBlobContainer destinationContainer = await CreateContainerAsync(blobClient, containerName);

            if (parameters.Copy)
            {
                ThrowIf.NullOrEmpty(parameters.SourceContainerSasUri, "parameters.SourceContainerConnectionString");
                CloudBlobContainer sourceContainer = new CloudBlobContainer(new Uri(parameters.SourceContainerSasUri));
                List<IListBlobItem> sourceBlobs = null;
                try
                {
                    sourceBlobs = sourceContainer.ListBlobs(null, true).ToList<IListBlobItem>();
                }
                catch (Exception ex)
                {
                    string message = string.Format("AzureStorageController: Exception: {0} source container with name: {1} doesn't have permissions to list blobs or the SAS has expired", ex, containerName);
                    return BadRequest(message);
                }

                if (sourceBlobs.Count == 0)
                {
                    string message = string.Format("AzureStorageController: source container with name: {0} doesn't exists or there are no blobs in it", containerName);
                    logger.Write(TraceEventType.Warning, message);
                    return BadRequest(message);
                }

                foreach (var src in sourceBlobs)
                {
                    var srcBlob = src as CloudBlob;

                    // Create appropriate destination blob type to match the source blob
                    CloudBlob destBlob;
                    if (srcBlob.Properties.BlobType == BlobType.BlockBlob)
                    {
                        destBlob = destinationContainer.GetBlockBlobReference(srcBlob.Name);
                    }
                    else
                    {
                        destBlob = destinationContainer.GetPageBlobReference(srcBlob.Name);
                    }

                    try
                    {
                        await destBlob.StartCopyAsync(new Uri(srcBlob.Uri.AbsoluteUri));
                    }
                    catch (StorageException ex)
                    {
                        logger.Write(TraceEventType.Error, "AzureStorageController: Exception copying blob {0}: {1}", srcBlob.Uri.AbsoluteUri, ex.RequestInformation.ExtendedErrorInformation.ErrorMessage);
                        return InternalServerError(ex);
                    }
                }
            }

            stopwatch.Stop();
            this.logger.Write(TraceEventType.Verbose, "AzureStorageController: Finished processing create container request, ElapsedMilliseconds: {0}", stopwatch.ElapsedMilliseconds);        
            return Ok();
        }

        private async Task<CloudBlobContainer> CreateContainerAsync(CloudBlobClient blobClient, string containerName)
        {
            CloudBlobContainer destinationContainer = blobClient.GetContainerReference(containerName);
            await destinationContainer.CreateIfNotExistsAsync();
            await destinationContainer.SetPermissionsAsync(new BlobContainerPermissions
            {
                PublicAccess = BlobContainerPublicAccessType.Off
            });

            return destinationContainer;
        }
    }
}