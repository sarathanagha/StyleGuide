using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.WebRole.Common.Handlers;
using Microsoft.DataStudio.WebRole.Common.Unity;
using Microsoft.Practices.Unity;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Microsoft.DataStudio.UxService
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);

            var container = UnityBootstrapper.Initialize(ComponentID.UxService);
            var logger = container.Resolve<ILogger>();
            GlobalConfiguration.Configuration.MessageHandlers.Add(
                new RequestLoggingHandler(logger)
                );
        }
    }
}
