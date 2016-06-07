using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.WebRole.Common.ExceptionHandling;
using Microsoft.DataStudio.WebRole.Common.Handlers;
using Microsoft.DataStudio.WebRole.Common.Unity;
using Microsoft.Practices.Unity;
using System.Web;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Mvc;
using System.Web.Routing;

namespace Microsoft.DataStudio.Services
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            var container = UnityBootstrapper.Initialize(ComponentID.DataStudioService);
            var logger = container.Resolve<ILogger>();

            // Log all incoming requests and responses
            GlobalConfiguration.Configuration.MessageHandlers.Add(
                new RequestLoggingHandler(logger)
                );

            // Log unhandled exceptions while handling api requests
            GlobalConfiguration.Configuration.Services.Add(
                typeof(IExceptionLogger),
                new UnhandledExceptionLogger(logger));
        }
    }
}
