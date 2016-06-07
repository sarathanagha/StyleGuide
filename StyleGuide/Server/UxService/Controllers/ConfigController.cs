using System;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.UxService.Contracts;
using Microsoft.DataStudio.WebRole.Common.Controllers;

namespace Microsoft.DataStudio.UxService.Controllers
{
    // We don't want to do this extra AuthN work for a call that just returns the environment configuration. If this is needed later, uncomment the below line.
    // [Authorize]
    public class ConfigController : UxControllerBase
    {
        public ConfigController(ILogger logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("api/config")]
        [ResponseType(typeof(ServiceConfiguration))]
        public IHttpActionResult Get()
        {
            return this.Ok(ServiceConfiguration.Default());
        }
    }
}