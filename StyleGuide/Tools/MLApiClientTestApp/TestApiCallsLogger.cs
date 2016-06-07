using System;
using System.Collections.Generic;
using System.Diagnostics;
using MLApiClientTestApp.Models;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.MachineLearning;

namespace MLApiClientTestApp
{
    class TestApiCallsLogger : IApiCallsLogger
    {
        private ITestLogger mLogger = null;

        public TestApiCallsLogger(ITestLogger logger)
        {
            mLogger = logger;
        }

        public void LogApiCallStart(ApiService apiService, string requestUri, Guid subscriptionId, string apiVersion)
        {
            mLogger.Write(TraceEventType.Information, "HTTP Request: {0}", requestUri);
        }

        public void LogApiCallEnd(ApiService apiService, string requestUri, Guid subscriptionid, Guid correlationId, string apiVersion, int httpStatusCode, string responseHeaders, long elapsedMilliseconds)
        {
            mLogger.Write(TraceEventType.Information, "HTTP Response: {0}, StatusCode: {1}, TimeElapsed: {2}, CorrelationId: {3}",
                requestUri,
                httpStatusCode,
                elapsedMilliseconds,
                correlationId.ToString());
        }

        public void LogApiCallError(ApiService apiService, string requestUri, Guid subscriptionId, Guid correlationId, string apiVersion, int httpStatusCode, string responseHeaders, string responseText)
        {
            mLogger.Write(TraceEventType.Error, "HTTP Error: {0}, StatusCode: {1}, CorrelationId: {2}, ErrorText: {3}",
                requestUri,
                httpStatusCode,
                correlationId.ToString(),
                responseText);
        }
    }
}
