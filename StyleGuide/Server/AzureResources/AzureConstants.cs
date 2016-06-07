using System;

namespace Microsoft.DataStudio.AzureResources
{
    public class AzureConstants
    {
        //TODO: pacodel get this from config files
        public const string AzureMgmtUrl = "https://management.azure.com/";
        public static Uri AzureMgmtUri = new Uri(AzureMgmtUrl);

        public const string AzureMgmtCoreBaseUrl = "https://management.core.windows.net/";
        public static Uri AzureMgmtCoreBaseUri = new Uri(AzureMgmtCoreBaseUrl);

        public const string AzureMgmtCoreCommonUrl = "https://management.core.windows.net:8443/";
        public static Uri AzureMgmtCoreCommonUri = new Uri(AzureMgmtCoreCommonUrl);

        public const string DefaultAzureMgmtApiVersion = "2015-01-01";

        public const int MaxAzureResourceThreads = 50;
    }
}
