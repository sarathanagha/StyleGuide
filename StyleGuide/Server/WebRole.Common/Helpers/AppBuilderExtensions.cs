using System;
using System.IdentityModel.Tokens;
using System.Configuration;
using Microsoft.Azure;
using Microsoft.Owin.Security.ActiveDirectory;
using Owin;

namespace Microsoft.DataStudio.WebRole.Common.Helpers
{
    public static class AppBuilderExtensions
    {
        public static void EnableAADTokenValidation(this IAppBuilder app, string audience, string tenantId, string loginEndpoint, string federationMetadataVersion)
        {
            app.UseWindowsAzureActiveDirectoryBearerAuthentication(
                new WindowsAzureActiveDirectoryBearerAuthenticationOptions
                {
                    AuthenticationMode = Owin.Security.AuthenticationMode.Active,
                    TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidAudience = audience,
                        ValidateAudience = true,
                        ValidateIssuer = false
                    },
                    Tenant = tenantId,
                    MetadataAddress = loginEndpoint + tenantId + "/federationmetadata/" + federationMetadataVersion + "/federationmetadata.xml"
                });
        }
    }
}
