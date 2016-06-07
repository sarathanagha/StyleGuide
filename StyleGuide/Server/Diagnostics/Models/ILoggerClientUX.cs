using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Microsoft.DataStudio.Diagnostics.ClientUX
{
    public interface ILogger
    {
        void WriteLogEvent(TraceEventType logLevel, string moduleName, string loggerName, string category, DateTime clientTimeStamp, string clientSessionId, string correlationId, string clientRequestId, Guid subscriptionId, string resourceGroupName, string resourceName, string resourceProvider, string userPuid, string userAgent, IDictionary<string, string> additionalProperties, string format, params object[] args);

        void WriteUsageEvent(string eventType, string eventName, IDictionary<string, string> additionalUsageData, string moduleName, string loggerName, string category, DateTime clientTimeStamp, string clientSessionId, string userPuid, Guid subscriptionId, string userAgent);
    }
}