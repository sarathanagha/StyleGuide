using System;
using System.Net.Http.Headers;

namespace Microsoft.DataStudio.WebExtensions
{
    public static class HttpResponseHeadersExtensions
    {
        public static void SetServerRequestId(this HttpResponseHeaders headers, Guid serverRequestId)
        {
            headers.Remove(WebConstants.HeaderServerRequestId);
            headers.Add(WebConstants.HeaderServerRequestId, serverRequestId.ToString());
        }
    }
}