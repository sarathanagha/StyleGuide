using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Microsoft.DataStudio.Diagnostics
{
    public interface ILogger
    {
        void Write(TraceEventType logLevel, string message);

        void Write(TraceEventType logLevel, string format, params object[] args);

        void Write(TraceEventType logLevel, IDictionary<string, string> additionalProperties, string format, params object[] args);

        void Write(TraceEventType logLevel, DateTime timeStamp, IDictionary<string, string> additionalProperties, string format, params object[] args);
    }
}
