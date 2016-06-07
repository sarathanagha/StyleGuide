using System;

namespace Microsoft.DataStudio.Diagnostics
{
    public static class EventSources
    {
        public static ClientUXTracingEventSource ClientUXTracingEventSource { get; private set; }

        public static ClientUXUsageEventSource ClientUXUsageEventSource { get; private set; }

        public static ApiServiceTracingEventSource ApiServiceTracingEventSource { get; private set; }

        public static UxServiceTracingEventSource UxServiceTracingEventSource { get; private set; }

        public static ExternalApiCallsEventSource ExternalApiCallsEventSource { get; private set; }

        public static RestApiCallsEventSource RestApiCallsEventSource { get; private set; }

        static EventSources()
        {
            ClientUXTracingEventSource = new ClientUXTracingEventSource();
            ClientUXUsageEventSource = new ClientUXUsageEventSource();
            ApiServiceTracingEventSource = new ApiServiceTracingEventSource();
            UxServiceTracingEventSource = new UxServiceTracingEventSource();
            ExternalApiCallsEventSource = new ExternalApiCallsEventSource();
            RestApiCallsEventSource = new RestApiCallsEventSource();
        }
    }
}
