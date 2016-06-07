using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.Azure;
using Microsoft.DataStudio.WebExtensions;

namespace Microsoft.DataStudio.Hub.WebRole
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            
            // Enable CORS for allowed origins
            config.EnableCors(
                CloudConfigurationManager.GetSetting("Microsoft.Cors.AllowedOrigins"),
                Boolean.Parse(CloudConfigurationManager.GetSetting("Microsoft.Cors.ShouldAllowHttpOrigins"))
                );

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
