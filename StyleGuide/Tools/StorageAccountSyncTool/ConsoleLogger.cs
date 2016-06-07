using System;
using System.Diagnostics;
using System.Globalization;

namespace StorageAccountSyncTool
{
    public class ConsoleLogger : ILogger
    {
        private readonly SourceSwitch mSourceSwitch;

        public ConsoleLogger(SourceLevels level)
        {
            mSourceSwitch = new SourceSwitch(string.Empty) { Level = level };
        }

        public void Write(TraceEventType logLevel, string message)
        {
            this.Write(logLevel, message, null);
        }

        public void Write(TraceEventType logLevel, string format, params object[] args)
        {
            if (!mSourceSwitch.ShouldTrace(logLevel))
                return;

            string message = string.Empty;

            if(args == null || args.Length == 0)
            {
                message = format;
            }
            else
            {
                message = string.Format(CultureInfo.InvariantCulture, format, args);
            }

            Console.WriteLine(message);
        }
    }
}
