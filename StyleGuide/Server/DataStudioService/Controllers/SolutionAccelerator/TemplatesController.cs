using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Solutions.Tables.Entities;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Microsoft.DataStudio.Services.Controllers.SolutionAccelerator
{
    [Authorize]
    public class TemplatesController: SolutionControllerBase
    {
        public TemplatesController(ILogger logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("api/{subscriptionId}/templates")]
        public async Task<IEnumerable<TemplateEntity>> Get([FromUri]string subscriptionId)
        {
            var templateTableStorage = GetTemplatesTableStorage();
            logger.Write(TraceEventType.Verbose, "HttpGet Templates: Getting the templates for subscriptionId: {0}", subscriptionId);
            IEnumerable<TemplateEntity> templates = await templateTableStorage.GetAsync();

            logger.Write(TraceEventType.Verbose, "HttpGet Templates: Got the templates successfully for subscriptionId: {0}", subscriptionId);

            return templates;
        }

        [HttpGet]
        [ResponseType(typeof(TemplateEntity))]
        [Route("api/{subscriptionId}/templates/{templateId}")]
        public async Task<IHttpActionResult> Get([FromUri]string subscriptionId, [FromUri]string solutionId)
        {
            var templateTableStorage = GetTemplatesTableStorage();

            TemplateEntity template = await templateTableStorage.GetAsync(solutionId);

            if(template != null)
            {
                logger.Write(TraceEventType.Verbose, "HttpGet Templates: Getting the template succeeded for subscriptionId: {0} and solutionId: {1}", subscriptionId, solutionId);
                return (IHttpActionResult)this.Ok(template);
            }
            else
            {
                logger.Write(TraceEventType.Verbose, "HttpGet Templates: Getting the template failed for subscriptionId: {0} and solutionId: {1}", subscriptionId, solutionId);
                return this.NotFound();
            }                
        }
    }
}