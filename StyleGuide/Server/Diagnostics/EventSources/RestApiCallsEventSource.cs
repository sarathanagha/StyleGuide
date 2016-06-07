using System;
using System.Diagnostics.Tracing;

namespace Microsoft.DataStudio.Diagnostics
{
    [EventSource(Name = "Microsoft-Atlas-RESTApiCalls", Guid = "D7D0EC18-E63C-498D-9E39-7538DA43FAD4")]
    public class RestApiCallsEventSource : AtlasBaseEventSource
    {
        public RestApiCallsEventSource()
        {
        }

        public static RestApiCallsEventSource Log
        {
            get
            {
                return EventSources.RestApiCallsEventSource;
            }
        }

        [Event(1, Version = 1)]
        public void LogRestApiCallStart(
            string requestUri,
            string requestHeaders,
            Guid correlationId,
            string userAgent)
        {
            MdsUtilities.MakeMdsCompatible(ref requestUri);
            MdsUtilities.MakeMdsCompatible(ref requestHeaders);
            MdsUtilities.MakeMdsCompatible(ref userAgent);

            base.MyWriteEvent(1, requestUri, requestHeaders, correlationId, userAgent);
        }

        [Event(2, Version = 1)]
        public void LogRestApiCallEnd(
            string requestUri,
            int httpStatusCode,
            string responseHeaders,
            Guid correlationId,
            long elapsedMilliseconds)
        {
            MdsUtilities.MakeMdsCompatible(ref requestUri);
            MdsUtilities.MakeMdsCompatible(ref responseHeaders);

            base.MyWriteEvent(2, requestUri, httpStatusCode, responseHeaders, correlationId, elapsedMilliseconds);
        }
    }
}
