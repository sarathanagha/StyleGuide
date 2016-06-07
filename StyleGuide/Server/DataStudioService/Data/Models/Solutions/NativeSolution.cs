using Microsoft.WindowsAzure.Storage.Blob;

namespace Microsoft.DataStudio.Services.Data.Models.Solutions
{
    internal class NativeSolution : Solution
    {
        public CloudBlobContainer Container { get; set; }
        public string BlobName { get; set; }
    }
}