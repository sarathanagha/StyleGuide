using Microsoft.Azure;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Microsoft.DataStudio.OAuthMiddleware.Models
{
    /// <summary>
    /// Configuration class to expose the configs for service metadata
    /// </summary>
    public class ServiceConfiguration
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public EnvironmentType EnvironmentType { get; set; }
        public string Version { get; set; }
        public string TokenServiceEndpoint { get; set; }
        public string DataServiceEndpoint { get; set; }
        public string GalleryEndpoint { get; set; }

        /// <summary>
        /// Static instance for exposing the metadata
        /// </summary>
        /// <returns></returns>
        public static string Default()
        {
            var config = new ServiceConfiguration();
            config.DataServiceEndpoint = CloudConfigurationManager.GetSetting("DataServiceEndpoint");
            var value = CloudConfigurationManager.GetSetting("EnvironmentType");
            config.EnvironmentType = string.IsNullOrEmpty(value) ? EnvironmentType.UNKNOWN : (EnvironmentType)Enum.Parse(typeof(EnvironmentType), CloudConfigurationManager.GetSetting("EnvironmentType"));
            config.TokenServiceEndpoint = CloudConfigurationManager.GetSetting("TokenServiceEndpoint");
            config.GalleryEndpoint = CloudConfigurationManager.GetSetting("GalleryEndpoint");
            return JsonConvert.SerializeObject(config);
        }

    }

    public enum EnvironmentType
    {
        PROD, TEST, INT, DEV, UNKNOWN
    }
}