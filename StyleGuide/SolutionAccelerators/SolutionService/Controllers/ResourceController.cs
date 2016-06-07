using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Routing;
using System.Collections.Generic;

using Microsoft.Azure;
using Microsoft.Azure.Management.Resources;
using Microsoft.Azure.Management.Resources.Models;
using Microsoft.CortanaAnalytics.Models;

using CAResource = Microsoft.CortanaAnalytics.Models.Resource;

namespace Microsoft.CortanaAnalytics.ResourceService.Controllers
{
    public class ResourceController : ODataController
    {
        /// <summary>
        /// Gets the resources.
        /// </summary>
        /// <param name="token">The token.</param>
        /// <param name="subscriptionId">The subscription identifier.</param>
        /// <param name="solutionName">Name of the solution.</param>
        /// <returns></returns>
        [HttpPost]
        [EnableQuery]
        public IHttpActionResult GetSolutionResources(ODataActionParameters parameters)
        {
            var subscriptionId = parameters["SubscriptionId"] as string;
            var token = parameters["Token"] as string;
            var solutionName = parameters["SolutionName"] as string;

            var creds = new TokenCloudCredentials(subscriptionId, token);
            var resourceManagementClient = new ResourceManagementClient(creds);
            ResourceListResult resourceListResult = resourceManagementClient.Resources.List(new ResourceListParameters());

            List<CAResource> resourceList = new List<CAResource>();

            foreach (var d in resourceListResult.Resources)
            {
                resourceList.Add(new CAResource() { Name = d.Name, Id = d.Id, Location = d.Location, Type = d.Type });
            }

            return Ok(resourceList);
        }
    }
}