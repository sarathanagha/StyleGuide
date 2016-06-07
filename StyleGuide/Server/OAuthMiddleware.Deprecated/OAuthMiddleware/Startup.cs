using Owin;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.Owin;
[assembly: OwinStartup(typeof(Microsoft.DataStudio.OAuthMiddleware.Startup))]

namespace Microsoft.DataStudio.OAuthMiddleware
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var routes = RouteTable.Routes;
            //routes.MapRoute(
            //    name: "Default",
            //    url: "Account/SignOut",
            //    defaults: new { controller = "Account", action = "SignOut", id = UrlParameter.Optional }
            //);
            routes.MapRoute(
               name: "Configuration",
               url: "config",
               defaults: new { controller = "Account", action = "GetConfiguration", env = UrlParameter.Optional }
           );

            //ConfigureAuth(app);
        }
    }
}
