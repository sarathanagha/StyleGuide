using System;
using System.Diagnostics;
using System.Web.Http;
using System.Web.Http.Controllers;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Hub.Authorization.Contracts;
using Microsoft.DataStudio.Hub.Authorization.Runtime;
using Microsoft.DataStudio.WebRole.Common.Controllers;
using Newtonsoft.Json;

namespace Microsoft.DataStudio.Hub.WebRole.Controllers
{
    [HubAuthorize]
    public abstract class HubControllerBase : ControllerBase, IAuthContextInitializer
    {
        protected IAuthenticatedUser mAuthenticatedUser = null;

        public HubControllerBase(ILogger logger) : base(logger)
        {
        }

        public void Initialize(HttpActionContext actionContext)
        {
            var identity = actionContext.RequestContext.Principal.Identity;
            try
            {
                mAuthenticatedUser = new AuthenticatedUser(identity);
            }
            catch(Exception ex)
            {
                this.logger.Write(TraceEventType.Error, "Failed to create an instance of AuthenticatedUser from this user, name:{0}, authenticationType:{1}, exception:{2}",
                    identity.Name,
                    identity.AuthenticationType,
                    ex);
                throw;
            }

            Trace.TraceInformation("User properties: {0}", JsonConvert.SerializeObject(mAuthenticatedUser));
        }
    }
}