using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public enum WorkspaceStatus
    {
        Registered,
        Unregistered,

        Enabled,
        Disabled,

        Updated,
        Migrated,
        Deleted
    }
}
