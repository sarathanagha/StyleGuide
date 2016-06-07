using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Tracing;

namespace Microsoft.DataStudio.Diagnostics
{
    [EventSource(Name = "Microsoft-Atlas-UxServiceTraces", Guid = "E9672BFA-9592-4C1E-AC3D-42FE25F4F0DC")]
    public class UxServiceTracingEventSource : ServiceTracingEventSource
    {
        public UxServiceTracingEventSource()
        {
        }

        public static UxServiceTracingEventSource Log
        {
            get
            {
                return EventSources.UxServiceTracingEventSource;
            }
        }

        // I wanted to keep the below code shared in the base class (ServiceTracingEventSource)
        // But there's a limitation with EventSource impl that the actual event source class needs to specify the Events too
        // Hence, I'm leaving them here

        # region trace logging methods
        [Event(1, Level = EventLevel.Critical, Version = 1)]
        public void LogCritical(string componentId, string message, string machineName, DateTime timeStamp, string additionalProperties)
        {
            base.MyWriteEvent(1, componentId, message, machineName, timeStamp, additionalProperties);
        }

        [Event(2, Level = EventLevel.Error, Version = 1)]
        public void LogError(string componentId, string message, string machineName, DateTime timeStamp, string additionalProperties)
        {
            base.MyWriteEvent(2, componentId, message, machineName, timeStamp, additionalProperties);
        }

        [Event(3, Level = EventLevel.Warning, Version = 1)]
        public void LogWarning(string componentId, string message, string machineName, DateTime timeStamp, string additionalProperties)
        {
            base.MyWriteEvent(3, componentId, message, machineName, timeStamp, additionalProperties);
        }

        [Event(4, Level = EventLevel.Informational, Opcode = EventOpcode.Info, Version = 1)]
        public void LogInformation(string componentId, string message, string machineName, DateTime timeStamp, string additionalProperties)
        {
            base.MyWriteEvent(4, componentId, message, machineName, timeStamp, additionalProperties);
        }

        [Event(5, Level = EventLevel.Verbose, Opcode = EventOpcode.Info, Version = 1)]
        public void LogVerbose(string componentId, string message, string machineName, DateTime timeStamp, string additionalProperties)
        {
            base.MyWriteEvent(5, componentId, message, machineName, timeStamp, additionalProperties);
        }
        #endregion

        [NonEvent]
        public override void WriteLog(TraceEventType eventType, string componentId, string message, string machineName, DateTime timeStamp, string additionalProperties)
        {
            MdsUtilities.MakeMdsCompatible(ref componentId);
            MdsUtilities.MakeMdsCompatible(ref message);
            MdsUtilities.MakeMdsCompatible(ref machineName);
            MdsUtilities.MakeMdsCompatible(ref additionalProperties);

            LoggingMethod logMethod = null;
            switch (eventType)
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

            logMethod(componentId, message, machineName, timeStamp, additionalProperties);
        }
    }
}