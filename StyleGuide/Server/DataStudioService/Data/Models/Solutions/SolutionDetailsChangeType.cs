using System;

namespace Microsoft.DataStudio.Services.Data.Models.Solutions
{
    // This is done as flags as on modifications there can be multiple types of
    // change. This allows us to overload what changes are happening and have 
    // discrete data so that we will eventually be able to corresponding text
    // in different languages in the future.
    [Flags]
    public enum SolutionDetailsChangeType
    {
        Created = 0,
        ModifiedAddedAzureResource = 2,
        ModifiedChangedDiagramLayout = 4,
        RemovedAzureResourceFromSolution = 8,
        DeletedSolution = 16
    }
}