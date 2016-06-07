using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Microsoft.DataStudio.Diagnostics
{
    interface ILogListener
    {
        void Write(TraceEventType eventType, ComponentID componentId, DateTime timeStamp, IDictionary<string, string> properties, string format, params object[] args);
    }
}
