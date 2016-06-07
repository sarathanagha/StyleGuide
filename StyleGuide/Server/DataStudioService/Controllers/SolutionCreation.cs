using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Data.Managers;
using Microsoft.DataStudio.Services.Data.Models.Contracts;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Microsoft.DataStudio.Services.Controllers
{
    /// <summary>
    /// Service that will return the title and required fields to create a solution of type of the selected module
    /// </summary>
    public sealed class SolutionCreationController : SolutionControllerBase
    {
        public SolutionCreationController(ILogger logger)
            : base(logger)
        {
        }

        [HttpGet]
        [Route("api/Subscriptions/{subscriptionId}/Modules/{moduleId}/Create")]
        [ResponseType(typeof(SolutionCreationInfo))]
        public async Task<IHttpActionResult> Get(Guid subscriptionId, string moduleId)
        {
            try
            {
                SolutionCreationInfo result = await new SolutionCreationManager().GetSolutionCreationFieldsAsync(subscriptionId, moduleId);

                if (result != null)
                {
                    logger.Write(System.Diagnostics.TraceEventType.Verbose, "HttpGet SolutionCreationController: Retrieved all fields for subscriptionId: {0} and module {1}", subscriptionId, moduleId);
                    return this.Ok(result);
                }
                else
                {

                    logger.Write(System.Diagnostics.TraceEventType.Verbose, "HttpGet SolutionCreationController: Retrieved null for subscriptionId: {0} and module {1}", subscriptionId, moduleId);
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
