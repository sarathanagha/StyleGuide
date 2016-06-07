using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;

namespace Microsoft.DataStudio.Diagnostics.ClientUX
{
    public sealed class MDSLogger : ILogger
    {
        private SourceSwitch mSourceSwitch = null;

        public MDSLogger(SourceLevels level)
        {
            mSourceSwitch = new SourceSwitch(string.Empty) { Level = level };
        }

        public void WriteLogEvent(TraceEventType eventType, string moduleName, string loggerName, string category, DateTime clientTimeStamp, string clientSessionId, string correlationId, string clientRequestId, Guid subscriptionId, string resourceGroupName, string resourceName, string resourceProvider, string userPuid, string userAgent, IDictionary<string, string> properties, string format, params object[] args)
        {
            if (!mSourceSwitch.ShouldTrace(eventType))
                return;

            string message = LogHelpers.FormatAndHtmlEncode(format, args);

            ClientUXTracingEventSource.Log.WriteLog(
                eventType,
                message,
                Environment.MachineName,
                clientTimeStamp,
                moduleName,
                loggerName,
                category,
                clientSessionId,
                correlationId,
                clientRequestId,
                subscriptionId,
                resourceGroupName,
                resourceName,
                resourceProvider,
                userPuid,
                userAgent,
                LogHelpers.ToString(properties));
        }

        public void WriteUsageEvent(string eventType, string eventName, IDictionary<string, string> additionalUsageData, string moduleName, string loggerName, string category, DateTime clientTimeStamp, string clientSessionId, string userPuid, Guid subscriptionId, string userAgent)
        {
            if (!mSourceSwitch.ShouldTrace(TraceEventType.Information)) // Keeping the usage events at this level so that there's a way to ignore them by changing the config..
                return;

            ClientUXUsageEventSource.Log.WriteUsage(
                eventType,
                eventName,
                LogHelpers.ToString(additionalUsageData),
                moduleName,
                loggerName,
                category,
                clientTimeStamp,
                clientSessionId,
                userPuid,
                subscriptionId,
                userAgent);
        }
    }
}