using System;
using System.Globalization;
using System.Web.Http;
using System.Web.Http.Controllers;
using Microsoft.DataStudio.Hub.Authorization.Contracts;

namespace Microsoft.DataStudio.Hub.Authorization.Runtime
{
    public sealed class HubAuthorizeAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            base.OnAuthorization(actionContext);

            if (!actionContext.RequestContext.Principal.Identity.IsAuthenticated)
            {
                // TODO rskumar: this method seems to be called even if IsAuthenticated is false,
                // though later the caller gets a 401 before the ApiController method is invoked.
                // Hence this check, but figure out why later..
                return;
            }

            var initializer = actionContext.ControllerContext.Controller as IAuthContextInitializer;
            if (initializer == null)
            {
                throw new ArgumentException(string.Format(CultureInfo.InvariantCulture, "Controller is not '{0}'", typeof(IAuthContextInitializer).Name), "actionContext");
            }

            initializer.Initialize(actionContext);
        }
    }
}
