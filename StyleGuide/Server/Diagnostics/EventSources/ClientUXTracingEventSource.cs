using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Tracing;

namespace Microsoft.DataStudio.Diagnostics
{
    [EventSource(Name = "Microsoft-Atlas-ClientUXTraces", Guid = "88888888-F2CD-42F0-8B18-84E2ACDB5038")]
    public class ClientUXTracingEventSource : AtlasBaseEventSource
    {
        public ClientUXTracingEventSource()
        {
        }

        public static ClientUXTracingEventSource Log
        {
            get
            {
                return EventSources.ClientUXTracingEventSource;
            }
        }

        private delegate void LoggingMethod(string message, string machineName, DateTime clientTimeStamp, string moduleName, string loggerName, string category, string clientSessionId, string correlationId, string clientRequestId, Guid subscriptionId, string resourceGroupName, string resourceName, string resourceProvider, string userPuid, string userAgent, string additionalProperties);

        # region trace logging methods
        [Event(1, Level = EventLevel.Critical, Version = 1)]
        public void LogCritical(string message, string machineName, DateTime clientTimeStamp, string moduleName, string loggerName, string category, string clientSessionId, string correlationId, string clientRequestId, Guid subscriptionId, string resourceGroupName, string resourceName, string resourceProvider, string userPuid, string userAgent, string additionalProperties)
        {
            base.MyWriteEvent(1, message, machineName, clientTimeStamp, moduleName, loggerName, category, clientSessionId, correlationId, clientRequestId, subscriptionId, resourceGroupName, resourceName, resourceProvider, userPuid, userAgent, additionalProperties);
        }

        [Event(2, Level = EventLevel.Error, Version = 1)]
        public void LogError(string message, string machineName, DateTime clientTimeStamp, string moduleName, string loggerName, string category, string clientSessionId, string correlationId, string clientRequestId, Guid subscriptionId, string resourceGroupName, string resourceName, string resourceProvider, string userPuid, string userAgent, string additionalProperties)
        {
            base.MyWriteEvent(2, message, machineName, clientTimeStamp, moduleName, loggerName, category, clientSessionId, correlationId, clientRequestId, subscriptionId, resourceGroupName, resourceName, resourceProvider, userPuid, userAgent, additionalProperties);
        }

        [Event(3, Level = EventLevel.Warning, Version = 1)]
        public void LogWarning(string message, string machineName, DateTime clientTimeStamp, string moduleName, string loggerName, string category, string clientSessionId, string correlationId, string clientRequestId, Guid subscriptionId, string resourceGroupName, string resourceName, string resourceProvider, string userPuid, string userAgent, string additionalProperties)
        {
            base.MyWriteEvent(3, message, machineName, clientTimeStamp, moduleName, loggerName, category, clientSessionId, correlationId, clientRequestId, subscriptionId, resourceGroupName, resourceName, resourceProvider, userPuid, userAgent, additionalProperties);
        }

        [Event(4, Level = EventLevel.Informational, Opcode = EventOpcode.Info, Version = 1)]
        public void LogInformation(string message, string machineName, DateTime clientTimeStamp, string moduleName, string loggerName, string category, string clientSessionId, string correlationId, string clientRequestId, Guid subscriptionId, string resourceGroupName, string resourceName, string resourceProvider, string userPuid, string userAgent, string additionalProperties)
        {
            base.MyWriteEvent(4, message, machineName, clientTimeStamp, moduleName, loggerName, category, clientSessionId, correlationId, clientRequestId, subscriptionId, resourceGroupName, resourceName, resourceProvider, userPuid, userAgent, additionalProperties);
        }

        [Event(5, Level = EventLevel.Verbose, Opcode = EventOpcode.Info, Version = 1)]
        public void LogVerbose(string message, string machineName, DateTime clientTimeStamp, string moduleName, string loggerName, string category, string clientSessionId, string correlationId, string clientRequestId, Guid subscriptionId, string resourceGroupName, string resourceName, string resourceProvider, string userPuid, string userAgent, string additionalProperties)
        {
            base.MyWriteEvent(5, message, machineName, clientTimeStamp, moduleName, loggerName, category, clientSessionId, correlationId, clientRequestId, subscriptionId, resourceGroupName, resourceName, resourceProvider, userPuid, userAgent, additionalProperties);
        }
        #endregion

        [NonEvent]
        public void WriteLog(TraceEventType eventType, string message, string machineName, DateTime clientTimeStamp, string moduleName, string loggerName, string category, string clientSessionId, string correlationId, string clientRequestId, Guid subscriptionId, string resourceGroupName, string resourceName, string resourceProvider, string userPuid, string userAgent, string additionalProperties)
        {
            MdsUtilities.MakeMdsCompatible(ref message);
            MdsUtilities.MakeMdsCompatible(ref machineName);
            MdsUtilities.MakeMdsCompatible(ref clientTimeStamp);
            MdsUtilities.MakeMdsCompatible(ref moduleName);
            MdsUtilities.MakeMdsCompatible(ref loggerName);
            MdsUtilities.MakeMdsCompatible(ref category);
            MdsUtilities.MakeMdsCompatible(ref clientSessionId);
            MdsUtilities.MakeMdsCompatible(ref correlationId);
            MdsUtilities.MakeMdsCompatible(ref clientRequestId);
            MdsUtilities.MakeMdsCompatible(ref resourceGroupName);
            MdsUtilities.MakeMdsCompatible(ref resourceName);
            MdsUtilities.MakeMdsCompatible(ref resourceProvider);
            MdsUtilities.MakeMdsCompatible(ref userPuid);
            MdsUtilities.MakeMdsCompatible(ref userAgent);
            MdsUtilities.MakeMdsCompatible(ref additionalProperties);

            LoggingMethod logMethod = null;
            switch(eventType)
            {
                case TraceEventType.Critical:
                    logMethod = LogCritical;
                    break;
                case TraceEventType.Error:
                    logMethod = LogError;
                    break;
                case TraceEventType.Warning:
                    logMethod = LogWarning;
                    break;
                case TraceEventType.Verbose:
                    logMethod = LogVerbose;
                    break;
                default:
                    logMethod = LogInformation;
                    break;
            }

            logMethod(message, machineName, clientTimeStamp, moduleName, loggerName, category, clientSessionId, correlationId, clientRequestId, subscriptionId, resourceGroupName, resourceName, resourceProvider, userPuid, userAgent, additionalProperties);
        }
    }
}