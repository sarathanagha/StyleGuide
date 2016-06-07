using System;
namespace Microsoft.DataStudio.Solutions.Model
{    
    [Flags] 
    public enum ProvisioningState
    {
        None = 1,
        InProgress = 2,
        Succeeded = 4,
        Failed = 8,
        Deleting = 16,
        Deleted = 32,
        DeleteFailed = 64
    }
}
