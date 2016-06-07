using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace Microsoft.CortanaAnalytics.SolutionRole.DataSource
{
    public static class AzureClientManager
    {
        private static string storageAccount;
        private static CloudStorageAccount azureStorageAccount;

        public static void InitConfig()
        {
            // TODO: [chrisriz] Change this to trigger from configuration and deployment automation.
            storageAccount = "DefaultEndpointsProtocol=https;AccountName=caslnacc;AccountKey=cG37wxN7L9EHA4DXwj5tgSAbcTukykzgkwbXBWGnyIrAOGR64r6+sGu72p8U4PB8OCwbry0ObUOurR06aJsypA==";
            azureStorageAccount = CloudStorageAccount.Parse(storageAccount);
        }

        public static CloudBlobClient GetBlobClient()
        {
            return azureStorageAccount.CreateCloudBlobClient();
        }
    }
}