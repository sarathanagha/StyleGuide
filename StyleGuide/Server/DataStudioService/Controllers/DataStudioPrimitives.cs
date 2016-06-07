using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Data.Models.Contracts;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace Microsoft.DataStudio.Services.Controllers
{
    public sealed class DataStudioArtifactsController : SolutionControllerBase
    {
        public DataStudioArtifactsController(ILogger logger)
            : base(logger)
        {
        }
        [HttpGet]
        [Route("api/Subscriptions/{subscriptionId}/Modules/ADF/Primitives")]
        [ResponseType(typeof(IEnumerable<Resource>))]
        public async Task<IHttpActionResult> Get(Guid subscriptionId)
        {
            // todo: Get the artifacts from manager class by using extension specific web services
            IEnumerable<Resource> artifacts = await GetResourceAsync(subscriptionId);

            logger.Write(System.Diagnostics.TraceEventType.Verbose, "HttpGet DataStudioArtifactsController: Retrieved all the available artifacts for subscriptionId: {0}", subscriptionId);
            return this.Ok(artifacts);
        }

        // todo: When we fetch from manager this method should go away.
        public Task<IEnumerable<Resource>> GetResourceAsync(Guid subscriptionId)
        {
            //todo: this is temp implementation, it will be converted to more generic way of fetching from Blob and Eventually a facade to get primitives from all modules.
            CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("Microsoft.BlobStorage.ConnectionString"));
            CloudBlobClient blobClient = cloudStorageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference("adfresources");

            if (!container.Exists())
            {
                throw new ApplicationException(string.Format(CultureInfo.InvariantCulture,
                    "Couldn't retrieve file {0} from storage account {1}. Container doesn't exist", "adfresources", cloudStorageAccount.BlobEndpoint));
            }

            // Retrieve reference to a blob named "photo1.jpg".
            CloudBlockBlob blockBlob = container.GetBlockBlobReference("adfresource.json");
            if (!blockBlob.Exists())
            {
                throw new ApplicationException(string.Format(CultureInfo.InvariantCulture,
                       "Couldn't retrieve file {0} from storage account {1}. File doesn't exist", "adfresource.json", cloudStorageAccount.BlobEndpoint));
            }

            var resources = JsonConvert.DeserializeObject<IEnumerable<Resource>>(blockBlob.DownloadText());
             return Task.FromResult(resources);
        }
    }
}
