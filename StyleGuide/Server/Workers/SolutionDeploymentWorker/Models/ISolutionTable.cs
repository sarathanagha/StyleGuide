using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Tables;
using Microsoft.DataStudio.Solutions.Tables.Entities;

namespace Microsoft.DataStudio.SolutionDeploymentWorker.Models
{
    interface ISolutionTable
    {
        Task<SolutionEntity> GetSolutionAsync(string subscriptionId, string solutionId);

        Task UpdateSolutionStatusAsync(string subscriptionId, string solutionId, string resourceGroupName,
            List<SolutionResource> updatedResources, SolutionProvisioningData updatedProvisioning, Dictionary<string, string> linkMap = null);
        Task UpdateSolutionStatusAsync(SolutionEntity entity);
    }
}
