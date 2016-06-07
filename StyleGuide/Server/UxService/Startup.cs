using System;
using Microsoft.Azure;
using Microsoft.DataStudio.WebRole.Common.Helpers;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Microsoft.DataStudio.UxService.Startup))]

namespace Microsoft.DataStudio.UxService
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.EnableAADTokenValidation(
                CloudConfigurationManager.GetSetting("Microsoft.DataStudio.Services.Audience"),
                CloudConfigurationManager.GetSetting("Microsoft.DataStudio.Services.Tenant"),
                CloudConfigurationManager.GetSetting("Microsoft.DataStudio.Services.LoginEndpoint"),
                CloudConfigurationManager.GetSetting("Microsoft.DataStudio.Services.FederationMetadataVersion")
                );
        }
    }
}
