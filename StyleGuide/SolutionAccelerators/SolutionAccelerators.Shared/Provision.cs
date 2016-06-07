using Microsoft.Azure;
using Microsoft.Azure.Management.Resources;
using Microsoft.Azure.Management.Resources.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.CortanaAnalytics.SolutionAccelerators.Shared
{
    public class Provision : IProvision
    {
        public Provision()
        {
        }

        public DeploymentResult DeployTemplate(string subscriptionId, string resourceGroup, Json json, string token)
        {
            DeploymentProperties properties = new DeploymentProperties
            {
                Mode = Microsoft.Azure.Management.Resources.Models.DeploymentMode.Incremental,
                Template = json.Content,
                Parameters = json.Parameters,
            };

            Guid correlationId = Guid.NewGuid();
            
            TokenCloudCredentials credential = new TokenCloudCredentials(subscriptionId, token);

            ResourceManagementClient client = new ResourceManagementClient(credential);

            DeploymentOperationsCreateResult result = null;
            try
            {
                result = client.Deployments.CreateOrUpdate(resourceGroup, correlationId.ToString(), properties);
            } catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return new DeploymentResult(result, correlationId);
        }

        public async Task<DeploymentOperationsGetResult[]> DeploymentStatusAsync(string subscriptionId, string resourceGroup, Guid correlationId, string token)
        {
            TokenCloudCredentials credential = new TokenCloudCredentials(subscriptionId, token);

            ResourceManagementClient client = new ResourceManagementClient(credential);

            DeploymentOperationsListParameters listParams = new DeploymentOperationsListParameters();
            string deploymentName = correlationId.ToString();
            var operationList = client.DeploymentOperations.List(resourceGroup, deploymentName, listParams);

            List<Task<DeploymentOperationsGetResult>> operationResults = new List<Task<DeploymentOperationsGetResult>>();
            foreach (var operation in operationList.Operations)
            {
                operationResults.Add(client.DeploymentOperations.GetAsync(resourceGroup, deploymentName, operation.OperationId));
            }
            return await Task.WhenAll(operationResults);
        }
    }
}
