using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Microsoft.DataStudio.Diagnostics
{
    public static class LoggerFactory
    {
        public static ILogger CreateServiceLogger(LoggerSettings settings)
        {
            return new ServiceLogger(settings);
        }

        public static ClientUX.ILogger CreateClientUXLogger(SourceLevels level)
        {
            return new ClientUX.MDSLogger(level);
        }
    }
}