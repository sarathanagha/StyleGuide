using Microsoft.Azure.Management.Resources.Models;
using System;
using System.Threading.Tasks;

namespace Microsoft.CortanaAnalytics.SolutionAccelerators.Shared
{
    interface IProvision
    {
        /// <summary>
        /// Submits a deployment request for the ARM Template
        /// </summary>
        /// <param name="subscriptionId">The subscription identifier.</param>
        /// <param name="resourceGroup">The resource group name.</param>
        /// <param name="json">Json object that contains the Template and Parameters</param>
        /// <param name="token">The token for authorization</param>
        /// <returns>DeploymentResult</returns>
        DeploymentResult DeployTemplate(string subscriptionId, string resourceGroup, Json json, string token);

        /// <summary>
        /// Monitor the progress of the deplyment operations for submitted ARM template
        /// </summary>
        /// <param name="subscriptionId">The subscription identifier.</param>
        /// <param name="resourceGroup">The resource group name.</param>
        /// <param name="correlationId">The guid that was generated calling DeployTemplate</param>
        /// <param name="token">The token for authorization</param>
        /// <returns>DeploymentResult</returns>
        Task<DeploymentOperationsGetResult[]> DeploymentStatusAsync(string subscriptionId, string resourceGroup, Guid correlationId, string token);
    }
}
