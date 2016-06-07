using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Tracing;

namespace Microsoft.DataStudio.Diagnostics
{
    [EventSource(Name = "Microsoft-Atlas-ClientUXUsage", Guid = "93F442FC-C280-409B-B8B7-9D7792E0E7E2")]
    public class ClientUXUsageEventSource : AtlasBaseEventSource
    {
        public ClientUXUsageEventSource()
        {
        }

        public static ClientUXUsageEventSource Log
        {
            get
            {
                return EventSources.ClientUXUsageEventSource;
            }
        }

        [Event(1, Version = 1)]
        public void LogUsage(string eventType, string eventName, string eventData, DateTime clientTimeStamp, string moduleName, string loggerName, string category, string clientSessionId, string userPuid, Guid subscriptionId, string userAgent)
        {
            base.MyWriteEvent(1, eventType, eventName, eventData, clientTimeStamp, moduleName, loggerName, category, clientSessionId, userPuid, subscriptionId, userAgent);
        }

        [NonEvent]
        public void WriteUsage(string eventType, string eventName, string eventData, string moduleName, string loggerName, string category, DateTime clientTimeStamp, string clientSessionId, string userPuid, Guid subscriptionId, string userAgent)
        {
            MdsUtilities.MakeMdsCompatible(ref eventType);
            MdsUtilities.MakeMdsCompatible(ref eventName);
            MdsUtilities.MakeMdsCompatible(ref eventData);
            MdsUtilities.MakeMdsCompatible(ref clientTimeStamp);
            MdsUtilities.MakeMdsCompatible(ref moduleName);
            MdsUtilities.MakeMdsCompatible(ref loggerName);
            MdsUtilities.MakeMdsCompatible(ref category);
            MdsUtilities.MakeMdsCompatible(ref clientSessionId);
            MdsUtilities.MakeMdsCompatible(ref userPuid);
            MdsUtilities.MakeMdsCompatible(ref userAgent);

            this.LogUsage(eventType, eventName, eventData, clientTimeStamp, moduleName, loggerName, category, clientSessionId, userPuid, subscriptionId, userAgent);
        }
    }
}