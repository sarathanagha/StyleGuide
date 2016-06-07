using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;

namespace Microsoft.DataStudio.Diagnostics
{
    public abstract class BaseListener : ILogListener
    {
        private SourceSwitch mSourceSwitch = null;

        public BaseListener(SourceLevels level)
        {
            mSourceSwitch = new SourceSwitch(string.Empty) { Level = level };
        }

        protected abstract void WriteImpl(TraceEventType eventType, ComponentID componentId, string message, DateTime timeStamp, string additionalProperties);

        public void Write(TraceEventType eventType, ComponentID componentId, DateTime timeStamp, IDictionary<string, string> properties, string format, params object[] args)
        {
            if (!mSourceSwitch.ShouldTrace(eventType))
                return;

            string message = LogHelpers.FormatAndHtmlEncode(format, args);

            this.WriteImpl(eventType, componentId, message, timeStamp, LogHelpers.ToString(properties));
        }
    }
}