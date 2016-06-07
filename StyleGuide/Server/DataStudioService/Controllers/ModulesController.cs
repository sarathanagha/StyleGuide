using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Data.Managers;
using Microsoft.DataStudio.Services.Data.Models.Contracts;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Microsoft.DataStudio.Services.Controllers
{
    // Disabling this so that a non-authenticated client can call the diagnostics api to submit logs
    //[Authorize]
    public sealed class ModulesController : SolutionControllerBase
    {
        public ModulesController(ILogger logger) : base(logger)
        {
        }

        [HttpGet]
        [ResponseType(typeof(IEnumerable<ModuleInfo>))]
        public async Task<IHttpActionResult> GetAvailableModules(Guid subscriptionId)
        {
            var result = await new ModulesManager().ListAvailableModulesAsync(subscriptionId);

            if(result != null)
            {
                logger.Write(System.Diagnostics.TraceEventType.Verbose, "HttpGet GetAvalableModules: Retrieved all the available modules for subscriptionId: {0}", subscriptionId);
                return this.Ok(result);
            }
            else
            {
                logger.Write(System.Diagnostics.TraceEventType.Verbose, "HttpGet GetAvalableModules: Get all the available modules returned null for subscriptionId: {0}", subscriptionId);
                return this.NotFound();
            }                        
        }
    }
}
