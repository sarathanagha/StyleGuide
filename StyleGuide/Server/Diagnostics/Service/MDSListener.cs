using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;

namespace Microsoft.DataStudio.Diagnostics
{
    class MDSListener : BaseListener
    {
        private readonly ServiceTracingEventSource mEventSource;

        public MDSListener(SourceLevels level, ServiceTracingEventSource eventSource)
            : base(level)
        {
            mEventSource = eventSource;
        }

        protected override void WriteImpl(TraceEventType eventType, ComponentID componentId, string message, DateTime timeStamp, string additionalProperties)
        {
            mEventSource.WriteLog(eventType, componentId.ToString(), message, Environment.MachineName, timeStamp, additionalProperties);
        }
    }
}
