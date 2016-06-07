using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.Practices.Unity;
using Microsoft.DataStudio.WebRole.Common.Handlers;
using Microsoft.DataStudio.WebRole.Common.Unity;

namespace Microsoft.DataStudio.Hub.WebRole
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            var container = UnityBootstrapper.Initialize(ComponentID.HubService);
            var logger = container.Resolve<ILogger>();
            GlobalConfiguration.Configuration.MessageHandlers.Add(
                new RequestLoggingHandler(logger)
                );
        }
    }
}
