using System;
using Microsoft.Azure;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Microsoft.DataStudio.UxService.Contracts
{
    public class ServiceConfiguration
    {
        public string EnvironmentType { get; set; }

        public string DataServiceEndpoint { get; set; }

        public string GalleryEndpoint { get; set; }

        public string ADCEndpoint { get; set; }

        public static ServiceConfiguration Default()
        {
            return new ServiceConfiguration
            {
                EnvironmentType = CloudConfigurationManager.GetSetting("EnvironmentType"),
                DataServiceEndpoint = CloudConfigurationManager.GetSetting("DataServiceEndpoint"),
                GalleryEndpoint = CloudConfigurationManager.GetSetting("GalleryEndpoint"),
                ADCEndpoint = CloudConfigurationManager.GetSetting("ADCEndpoint")
            };
        }
    }
}