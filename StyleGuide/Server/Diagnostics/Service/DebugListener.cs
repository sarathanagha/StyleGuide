using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Microsoft.DataStudio.Diagnostics
{
    // TODO rskumar: Just need this for spitting traces to VS output window, how do I conditionally compile?
    class DebugListener : BaseListener
    {
        public DebugListener(SourceLevels level)
            : base(level)
        {
        }

        protected override void WriteImpl(TraceEventType eventType, ComponentID componentId, string message, DateTime timeStamp, string properties)
        {
            // let's ignore timeStamp for this

            string debugLogMessage = eventType.ToString() + ": " + componentId + ":: "
                + message + " " + properties;
            Debug.WriteLine(debugLogMessage);
        }
    }
}
