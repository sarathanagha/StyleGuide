using Microsoft.Azure.Management.Resources.Models;
using Microsoft.DataStudio.SolutionAccelerators.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Microsoft.DataStudio.Services.Controllers
{
    public class DeploymentController : ApiController
    {
        [HttpGet]
        [Route("api/solutions/deployment/{resourceGroup}/{subscriptionId}/{deploymentName}")]
        public async Task<DeploymentGetResult> Get([FromUri] string resourceGroup, [FromUri] string subscriptionId, [FromUri] string deploymentName)
        {
            var headers = base.Request.Headers;
            var prov = new Provision(subscriptionId, headers.GetValues("token").First());
            return await prov.GetDeploymentAsync(resourceGroup, deploymentName);
        }
    }
}