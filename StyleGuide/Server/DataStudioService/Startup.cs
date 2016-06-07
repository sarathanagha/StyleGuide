using System;
using Microsoft.Azure;
using Microsoft.DataStudio.WebRole.Common.Helpers;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Microsoft.DataStudio.Services.Startup))]

namespace Microsoft.DataStudio.Services
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.EnableAADTokenValidation(
                CloudConfigurationManager.GetSetting("Microsoft.DataStudio.Services.Audience"),
                CloudConfigurationManager.GetSetting("Microsoft.DataStudio.Services.Tenant"),
                "https://login.windows.net/", "2007-06" // TODO: Provide these values from config
                );
        }
    }
}
