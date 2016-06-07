using System;

namespace Microsoft.DataStudio.Diagnostics
{
    public enum ApiService
    {
        MachineLearning
    }

    public interface IApiCallsLogger
    {
        void LogApiCallStart(ApiService apiService, string requestUri, Guid subscriptionId, string apiVersion);

        void LogApiCallEnd(ApiService apiService, string requestUri, Guid subscriptionid, Guid correlationId, string apiVersion, int httpStatusCode, string responseHeaders, long elapsedMilliseconds);

        void LogApiCallError(ApiService apiService, string requestUri, Guid subscriptionId, Guid correlationId, string apiVersion, int httpStatusCode, string responseHeaders, string responseText);
    }
}
