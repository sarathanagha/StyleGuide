using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Data.Managers;
using Microsoft.DataStudio.Services.Data.Models.Contracts;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Microsoft.DataStudio.Services.Controllers
{
    [Authorize]
    public sealed class DataStudioAzureResourcesController : SolutionControllerBase
    {
        public DataStudioAzureResourcesController(ILogger logger)
            : base(logger)
        {
        }

        [HttpGet]
        [Route("api/subscriptions/{subscriptionId}/resources")]
        [ResponseType(typeof(IEnumerable<Resource>))]
        public async Task<IHttpActionResult> Get(string subscriptionId)
        {
            try
            {
                var result = await new AzureResourcesManager(subscriptionId, this.GetToken(), this.logger).GetAzureResourcesAsync();

                if (result != null)
                {
                    logger.Write(System.Diagnostics.TraceEventType.Verbose, "HttpGet DataStudioToolboxController: Retrieved all toolbox items for subscriptionId: {0}", subscriptionId);
                    return this.Ok(result);
                }
                else
                {
                    logger.Write(System.Diagnostics.TraceEventType.Verbose, "HttpGet DataStudioToolboxController: Retrieved null for subscriptionId: {0}", subscriptionId);
                    return this.NotFound();
                }
            }
            catch (Exception ex)
            {
                return this.InternalServerError(ex);
            }
        }
    }
}
