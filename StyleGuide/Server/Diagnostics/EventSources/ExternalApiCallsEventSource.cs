using System;
using System.Diagnostics.Tracing;

namespace Microsoft.DataStudio.Diagnostics
{
    [EventSource(Name = "Microsoft-Atlas-ExternalApiCalls", Guid = "7888F11B-3899-4BBB-9020-27D9490E15C6")]
    public class ExternalApiCallsEventSource : AtlasBaseEventSource
    {
        public ExternalApiCallsEventSource()
        {
        }

        public static ExternalApiCallsEventSource Log
        {
            get
            {
                return EventSources.ExternalApiCallsEventSource;
            }
        }

        [Event(1, Version = 1)]
        public void LogApiCallStart(
            string apiService,
            string requestUri,
            Guid subscriptionId,
            string apiVersion)
        {
            MdsUtilities.MakeMdsCompatible(ref requestUri);
            MdsUtilities.MakeMdsCompatible(ref apiVersion);

            base.MyWriteEvent(1, apiService, requestUri, subscriptionId, apiVersion);
        }

        [Event(2, Version = 1)]
        public void LogApiCallEnd(
            string apiService,
            string requestUri,
            Guid subscriptionid,
            Guid correlationId,
            string apiVersion,
            int httpStatusCode,
            string responseHeaders,
            long elapsedMilliseconds)
        {
            MdsUtilities.MakeMdsCompatible(ref requestUri);
            MdsUtilities.MakeMdsCompatible(ref apiVersion);
            MdsUtilities.MakeMdsCompatible(ref responseHeaders);

            base.MyWriteEvent(2, apiService, requestUri, subscriptionid, correlationId, apiVersion, httpStatusCode, responseHeaders, elapsedMilliseconds);
        }

        [Event(3, Version = 1)]
        public void LogApiCallError(
            string apiService,
            string requestUri,
            Guid subscriptionId,
            Guid correlationId,
            string apiVersion,
            int httpStatusCode,
            string responseHeaders,
            string responseText)
        {
            MdsUtilities.MakeMdsCompatible(ref requestUri);
            MdsUtilities.MakeMdsCompatible(ref apiVersion);
            MdsUtilities.MakeMdsCompatible(ref responseHeaders);
            MdsUtilities.MakeMdsCompatible(ref responseText);

            base.MyWriteEvent(3, apiService, requestUri, subscriptionId, correlationId, apiVersion, httpStatusCode, responseHeaders, responseText);
        }
    }
}
