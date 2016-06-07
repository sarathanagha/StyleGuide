using System;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Hub.Authorization.Runtime;

namespace Microsoft.DataStudio.Hub.WebRole.Controllers
{
    [HubAuthorize]
    public class SolutionsProxyController : HubControllerBase
    {
        public SolutionsProxyController(ILogger logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("api/solutions")]
        public IHttpActionResult ListAllSolutions()
        {
            return this.StatusCode(HttpStatusCode.NotImplemented);
        }

        [HttpGet]
        [Route("api/solutions/{solutionId}")]
        public IHttpActionResult GetSolution([FromUri]string solutionId)
        {
            return this.StatusCode(HttpStatusCode.NotImplemented);
        }

        [HttpPut]
        [Route("api/solutions")]
        public IHttpActionResult CreateSolution([FromBody]string solutionName)
        {
            this.CheckNotNullOrEmpty(solutionName, "solutionName");
            return this.StatusCode(HttpStatusCode.NotImplemented);
        }

        [HttpPost]
        [Route("api/solutions/{solutionId}")]
        public IHttpActionResult UpdateSolution([FromUri]string solutionId)
        {
            return this.StatusCode(HttpStatusCode.NotImplemented);
        }

        [HttpDelete]
        [Route("api/solutions/{solutionId}")]
        public IHttpActionResult DeleteSolution([FromUri]string solutionId)
        {
            return this.StatusCode(HttpStatusCode.NotImplemented);
        }
    }
}