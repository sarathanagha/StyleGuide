using System;
using System.Net;

namespace Microsoft.DataStudio.WebExtensions
{
    public static class HttpWebResponseExtensions
    {
        public static Guid GetCorrelationId(this HttpWebResponse response)
        {
            string clientRequestId = response.GetResponseHeader("x-ms-client-request-id"); // studioapi requests seem to set this
            if (!string.IsNullOrEmpty(clientRequestId))
                return Guid.Parse(clientRequestId);

            string requestId = response.GetResponseHeader("x-ms-request-id"); // For management.azureml.net
            if (!string.IsNullOrEmpty(requestId))
                return Guid.Parse(requestId);

            return Guid.Empty;
        }
    }
}
