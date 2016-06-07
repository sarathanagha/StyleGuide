using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.DataStudio.Diagnostics;

namespace Microsoft.DataStudio.WebRole.Common.Controllers
{
    public abstract class ControllerBase : ApiController
    {
        protected readonly ILogger logger;

        public ControllerBase(ILogger logger)
        {
            this.logger = logger;
        }

        private void ThrowBadRequest(string paramName)
        {
            throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, string.Format("Parameter {0} is invalid", paramName)));
        }

        protected string UserAgent
        {
            get { return this.ControllerContext.Request.Headers.UserAgent.ToString(); }
        }

        protected void CheckNotNull<T>(T arg, string paramName)
        {
            if (arg == null)
            {
                ThrowBadRequest(paramName);
            }
        }

        protected void CheckNotNullOrEmpty(string param, string paramName)
        {
            if (string.IsNullOrEmpty(param))
            {
                ThrowBadRequest(paramName);
            }
        }
    }
}