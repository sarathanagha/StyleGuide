using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Microsoft.DataStudio.Diagnostics
{
    public class ServiceLogger : ILogger
    {
        private IList<ILogListener> mLogListeners = null;
        private LoggerSettings mSettings = null;

        public ServiceLogger(LoggerSettings settings)
        {
            mSettings = settings;
            mLogListeners = new List<ILogListener>();

            if (mSettings.EnableMdsTracing)
            {
                ServiceTracingEventSource eventSource = null;
                switch (mSettings.ComponentId)
                {
                    case ComponentID.DataStudioService:
                    case ComponentID.SolutionDeploymentWorker:
                        eventSource = ApiServiceTracingEventSource.Log;
                        break;
                    case ComponentID.UxService:
                        eventSource = UxServiceTracingEventSource.Log;
                        break;
                    default:
                        throw new Exception("Unsupported ComponentId!");
                }

                mLogListeners.Add(new MDSListener(settings.SourceLevels, eventSource));
            }

            // TODO rskumar: I want this only for debug tracing. Figure out how to conditionally compile..
            mLogListeners.Add(new DebugListener(mSettings.SourceLevels));
        }

        public void Write(TraceEventType logLevel, string message)
        {
            this.Write(logLevel, message, null);
        }

        public void Write(TraceEventType eventType, string format, params object[] args)
        {
            this.Write(eventType, null, format, args);
        }

        public void Write(TraceEventType eventType, IDictionary<string, string> additionalProperties, string format, params object[] args)
        {
            this.Write(eventType, DateTime.UtcNow, additionalProperties, format, args);
        }

        public void Write(TraceEventType eventType, DateTime timeStamp, IDictionary<string, string> properties, string format, params object[] args)
        {
            foreach (var listener in mLogListeners)
            {
                listener.Write(eventType, mSettings.ComponentId, timeStamp, properties, format, args);
            }
        }
    }
}
