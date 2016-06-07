using System;
using System.Diagnostics;

namespace StorageAccountSyncTool
{
    public interface ILogger
    {
        void Write(TraceEventType logLevel, string message);

        void Write(TraceEventType logLevel, string format, params object[] args);
    }
}
