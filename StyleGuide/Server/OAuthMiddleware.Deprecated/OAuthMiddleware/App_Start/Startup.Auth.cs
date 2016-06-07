using Owin;
using System;
using System.Configuration;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using AuthenticationContext = Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext;
using Claim = System.Security.Claims.Claim;
using Microsoft.DataStudio.OAuthMiddleware.AuthorizationServiceProvider;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Owin;
using Microsoft.Owin.Extensions;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security.OpenIdConnect;
using System.Web;
using Microsoft.IdentityModel.Protocols;
using Microsoft.Owin.Security.Infrastructure;
using Microsoft.Owin.Logging;
using System.Linq;
using System.Collections.Generic;
using System.Net.Http.Headers;
using Diagnostics = Microsoft.DataStudio.Diagnostics;
using System.Diagnostics;
using Microsoft.Azure;

namespace Microsoft.DataStudio.OAuthMiddleware
{
    public partial class Startup
    {
        private static readonly string ClientId = CloudConfigurationManager.GetSetting("ida:ClientId");
        private static readonly string AADInstance = CloudConfigurationManager.GetSetting("ida:AADInstance");
        private static readonly List<string> IdpWhiteList = CloudConfigurationManager.GetSetting("ida:IdpWhiteList").Split(';').ToList();
        private static readonly string TenantId = CloudConfigurationManager.GetSetting("ida:TenantId");
        private static readonly string CommonTenantId = CloudConfigurationManager.GetSetting("ida:CommonTenantId");
        private static readonly string Authority = string.Format(AADInstance, CommonTenantId);
        private static readonly string RedirectUrl = CloudConfigurationManager.GetSetting("ida:RedirectUri");
        private static readonly string PostLogoutRedirectUri = CloudConfigurationManager.GetSetting("ida:PostLogoutRedirectUri");
        private static readonly string AuthenticationErrorRedirectUrlSegment = CloudConfigurationManager.GetSetting("ida:AuthErrorUrl");
        private static ConcurrentDictionary<string, TokenCacheItem> _tokenCache = new ConcurrentDictionary<string, TokenCacheItem>();
        private static readonly string resourceKey = CloudConfigurationManager.GetSetting("ida:ResourceName");
        Diagnostics.ILogger logger = Diagnostics.LoggerFactory.CreateServiceLogger(new Diagnostics.LoggerSettings
        {
            ComponentId = Diagnostics.ComponentID.UxService,
            EnableMdsTracing = true,
            SourceLevels = SourceLevels.All
        });
        public void ConfigureAuth(IAppBuilder app)
        {

            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
            app.UseCookieAuthentication(new CookieAuthenticationOptions());


            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
#if DEBUG
                AllowInsecureHttp = true,
#endif
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new SimpleAuthorizationServerProvider(_tokenCache, logger),
                AuthenticationMode = AuthenticationMode.Active
            };

            OAuthServerOptions.AccessTokenFormat = new JwtTokenFormatter(OAuthServerOptions);
            //OpenIdConnectAuthenticationHandler handler = new OpenIdConnectAuthenticationHandler(null);

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);

            app.UseOpenIdConnectAuthentication(
                new OpenIdConnectAuthenticationOptions
                {
                    ClientId = ClientId,
                    Authority = Authority,
                    TokenValidationParameters = new TokenValidationParameters { ValidateIssuer = false },
                    Notifications = new OpenIdConnectAuthenticationNotifications
                    {
                        AuthorizationCodeReceived = context =>
                        {
                            string identityProvider = string.Empty, tenantId = TenantId;
                            var claimsIdentity = context.AuthenticationTicket.Identity;
                            claimsIdentity.AddClaim(new Claim("code", context.Code));
                            claimsIdentity.AddClaim(new Claim("id_token", context.JwtSecurityToken.RawData));
                            var signedinUserName = claimsIdentity.Name;
                            TokenCacheItem cachedItem;
                            //check if we have the cached token for the user in dictionary
                            if (_tokenCache.TryGetValue(signedinUserName, out cachedItem))
                            {
                                var updatedCachedItem = new TokenCacheItem();
                                updatedCachedItem.authCode = context.Code;
                                updatedCachedItem.idTokenRawValue = context.JwtSecurityToken.RawData;
                                updatedCachedItem.redirectUri = context.Request.Uri.AbsoluteUri;
                                updatedCachedItem.sessionId = cachedItem.sessionId;
                                _tokenCache.TryUpdate(signedinUserName, updatedCachedItem, cachedItem);
                                logger.Write(TraceEventType.Information, "Owin.AuthorizationCodeReceived for existing user - {0}, Session ID:{1}", signedinUserName, cachedItem.sessionId.ToString());
                            }
                            else
                            {
                                var tokenCacheItem =  new TokenCacheItem { redirectUri = context.Request.Uri.AbsoluteUri, authCode = context.Code, idTokenRawValue = context.JwtSecurityToken.RawData, sessionId = Guid.NewGuid() };
                                _tokenCache.TryAdd(claimsIdentity.Name, tokenCacheItem);
                                logger.Write(TraceEventType.Information, "Owin.AuthorizationCodeReceived for new user - {0}, Session ID :{1}", signedinUserName, tokenCacheItem.sessionId.ToString());
                            }

                            return Task.FromResult(0);
                        },
                        RedirectToIdentityProvider = (context) =>
                        {
                            if (context.ProtocolMessage.RequestType == OpenIdConnectRequestType.AuthenticationRequest)
                            {
                                context.ProtocolMessage.RedirectUri = context.Request.Uri.AbsoluteUri;
                                context.ProtocolMessage.PostLogoutRedirectUri = PostLogoutRedirectUri;
                                context.ProtocolMessage.Resource = resourceKey;
                                context.ProtocolMessage.SetParameter("popupui", "");

                            }


                            if (context.ProtocolMessage.RequestType == OpenIdConnectRequestType.LogoutRequest)
                            {
                                TokenCacheItem tci;
                                _tokenCache.TryRemove(context.OwinContext.Authentication.User.Identity.Name, out tci);
                                context.ProtocolMessage.RedirectUri = context.Request.Uri.AbsoluteUri;
                                context.ProtocolMessage.PostLogoutRedirectUri = PostLogoutRedirectUri;
                            }

                            return Task.FromResult(0);
                        },
                        SecurityTokenReceived = (context) =>
                        {

                            return Task.FromResult(0);
                        },
                        // we use this notification for injecting our custom logic
                        SecurityTokenValidated = (context) =>
                        {
                            return Task.FromResult(0);
                        },
                        AuthenticationFailed = (context) =>
                        {
                            logger.Write(TraceEventType.Critical, "Owin.AuthenticationFailed for - {0}, Url :{1},Exception : {2}", context.OwinContext.Authentication.User.Identity.Name,
                                context.Exception.Message, context.Exception.Message);
                            context.OwinContext.Response.Redirect(string.Format("{0}{1}{2}", context.Request.Uri.AbsoluteUri, AuthenticationErrorRedirectUrlSegment, "?message=" + context.Exception.Message));
                            context.HandleResponse();
                            return Task.FromResult(0);
                        }
                    }
                });

            app.UseStageMarker(PipelineStage.Authenticate);

        }

    }
}
