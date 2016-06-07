using System;
using System.Diagnostics;

namespace Microsoft.DataStudio.Diagnostics
{
    public abstract class ServiceTracingEventSource : AtlasBaseEventSource
    {
        protected ServiceTracingEventSource()
        {
        }

        protected delegate void LoggingMethod(string componentId, string message, string machineName, DateTime timeStamp, string additionalProperties);

        public abstract void WriteLog(TraceEventType eventType, string componentId, string message, string machineName, DateTime timeStamp, string additionalProperties);
    }
}