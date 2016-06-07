using System;
using System.Globalization;
using System.IO;
using System.Net;

namespace Microsoft.DataStudio.WebExtensions
{
    public static class WebExceptionUtils
    {
        public static string ParseDetails(this WebException ex)
        {
            HttpWebResponse errorResponse = (HttpWebResponse)ex.Response;
            if (errorResponse == null)
                return string.Empty;

            return string.Format(CultureInfo.InvariantCulture,
                "[request:{0}, responseCode:{1}, correlationId:{2}, responseText:{3}]",
                (errorResponse.ResponseUri != null ? errorResponse.ResponseUri.ToString() : string.Empty),
                (int)errorResponse.StatusCode,
                errorResponse.GetCorrelationId(),
                new StreamReader(errorResponse.GetResponseStream()).ReadToEnd());
        }
    }
}
