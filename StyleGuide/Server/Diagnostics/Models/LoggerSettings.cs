using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Microsoft.DataStudio.Diagnostics
{
    public enum ComponentID // consumers of diagnostics
    {
        DataStudioService,
        SolutionDeploymentWorker,
        UxService,
        HubService,
        UxMonitoringService,
    }

    public class LoggerSettings
    {
        public ComponentID ComponentId { get; set; }

        public SourceLevels SourceLevels { get; set; }

        public bool EnableMdsTracing { get; set; }
    }
}
