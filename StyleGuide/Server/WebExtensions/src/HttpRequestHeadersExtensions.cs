using System;
using System.Linq;
using System.Text;
using System.Net.Http.Headers;

namespace Microsoft.DataStudio.WebExtensions
{
    public static class HttpRequestHeadersExtensions
    {
        public static string ToStringWithoutPII(this HttpRequestHeaders headers)
        {
            var requestHeadersText = new StringBuilder();
            foreach (var header in headers)
            {
                if (!header.Key.Equals("Authorization"))
                {
                    requestHeadersText.Append(header.Key + ": " + string.Join(" ", header.Value.ToArray()) + Environment.NewLine);
                }
            }

            return requestHeadersText.ToString();
        }
    }
}
