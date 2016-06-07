using Microsoft.Azure;
using Microsoft.Azure.Management.Resources;
using Microsoft.Azure.Management.Resources.Models;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;

namespace Microsoft.CortanaAnalytics.SolutionAccelerators.Tools.PartnersValidationApp
{
    public static class ResourceExplorer
    {
        public async static Task<ResourceListResult> ListAllResources(string token)
        {
            var creds = new TokenCloudCredentials(ConfigurationManager.AppSettings["subscriptionId"], token);
            ResourceListResult resourceGroupResult = null;
            using (var test = new ResourceManagementClient(creds))
            {
                resourceGroupResult = await test.Resources.ListAsync(

                    new ResourceListParameters
                    {
                    }, CancellationToken.None);
            }
            return resourceGroupResult;
        }
    }
}
