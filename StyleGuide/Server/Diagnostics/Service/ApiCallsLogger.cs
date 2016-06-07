using System;
using System.Runtime.CompilerServices;

namespace Microsoft.DataStudio.Diagnostics
{
    // This is just a helper class that delegates calls to ExternalApiCallsEventSource
    public class ApiCallsLogger : IApiCallsLogger
    {
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void LogApiCallStart(ApiService apiService, string requestUri, Guid subscriptionId, string apiVersion)
        {
            ExternalApiCallsEventSource.Log.LogApiCallStart(
                apiService.ToString(),
                requestUri,
                subscriptionId,
                apiVersion);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void LogApiCallEnd(ApiService apiService, string requestUri, Guid subscriptionid, Guid correlationId, string apiVersion, int httpStatusCode, string responseHeaders, long elapsedMilliseconds)
        {
            ExternalApiCallsEventSource.Log.LogApiCallEnd(
                apiService.ToString(),
                requestUri,
                subscriptionid,
                correlationId,
                apiVersion,
                httpStatusCode,
                responseHeaders,
                elapsedMilliseconds);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void LogApiCallError(ApiService apiService, string requestUri, Guid subscriptionId, Guid correlationId, string apiVersion, int httpStatusCode, string responseHeaders, string responseText)
        {
            ExternalApiCallsEventSource.Log.LogApiCallError(
                apiService.ToString(),
                requestUri,
                subscriptionId,
                correlationId,
                apiVersion,
                httpStatusCode,
                responseHeaders,
                responseText);
        }
    }
}
