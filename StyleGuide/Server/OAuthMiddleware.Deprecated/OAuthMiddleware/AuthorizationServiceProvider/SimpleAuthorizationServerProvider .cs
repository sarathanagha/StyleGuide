using System;
using System.Collections.Concurrent;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web;
using AuthenticationContext = Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext;
using Claim = System.Security.Claims.Claim;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security.OpenIdConnect;
using System.Net;
using System.Collections.Generic;
using Microsoft.DataStudio.OAuthMiddleware.Models;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Linq;
using Microsoft.DataStudio.Diagnostics;
using System.Diagnostics;
using Microsoft.DataStudio.OAuthMiddleware.Helpers;
using Microsoft.Azure;
using Microsoft.Owin.Security;

namespace Microsoft.DataStudio.OAuthMiddleware.AuthorizationServiceProvider
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {

        /// <summary>
        /// The AAD specific configuration values. 
        /// </summary>
        private static readonly string ClientId = CloudConfigurationManager.GetSetting("ida:ClientId");
        private static readonly string TenantId = CloudConfigurationManager.GetSetting("ida:TenantId");
        private static readonly string AADInstance = CloudConfigurationManager.GetSetting("ida:AADInstance");
        private static readonly string RedirectUrl = CloudConfigurationManager.GetSetting("ida:RedirectUri");
        private static readonly string PostLogoutRedirectUri = CloudConfigurationManager.GetSetting("ida:PostLogoutRedirectUri");
        private static readonly string resourceKey = CloudConfigurationManager.GetSetting("ida:ResourceName");
        private static readonly string armEndpoint = CloudConfigurationManager.GetSetting("ida:armEndpoint");
        private string certName = CloudConfigurationManager.GetSetting("ida:certName");
        private ConcurrentDictionary<string, TokenCacheItem> _tokenCache;
        private static ClientAssertionCertificate certCred;
        ILogger _logger;
        private const string GRANT_TYPE_CLIENTCREDENTIAL = "client_credentials";
        private const string GRANT_TYPE_CUSTOM = "custom";
        private const string SUBSCRIPTIONID = "subscriptionid";

        internal ConcurrentDictionary<string, TokenCacheItem> TokenCache { get { return _tokenCache; } }

        public SimpleAuthorizationServerProvider(object cacheObject, ILogger logger)
        {
            this._tokenCache = cacheObject as ConcurrentDictionary<string, TokenCacheItem>;
            certCred = new ClientAssertionCertificate(ClientId, GetAADCertificate());
            this._logger = logger;
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            /// validate the token if is from the right caller. Will pass through if the grant_type=clientcredential, else it  will decode the JWT token and validate .
            /// 
            var grantType = context.Parameters.Get("grant_type");
            if (grantType == null)
            {
                _logger.Write(TraceEventType.Error, "Owin.ValidateClientAuthentication User:{0} grant_type is null", context.OwinContext.Authentication.User.Identity.Name);
                return Task.FromResult<object>(null);
            }
            if (grantType == GRANT_TYPE_CLIENTCREDENTIAL)
            {
                if (this.isUserAuthenticated(context.OwinContext))
                {
                    context.Validated();
                }
            }
            if (grantType == GRANT_TYPE_CUSTOM)
            {
                string idToken = context.Parameters.Get("access_token");
                if (!string.IsNullOrEmpty(idToken))
                {
                    JwtTokenParser.AddTokenForValidation(context.Parameters.Get(("access_token")));
                    JwtTokenParser.Validate(ClaimTypes.Upn, _tokenCache);
                    JwtTokenParser.Validate(ClaimTypes.Expiration, _tokenCache);

                    context.Validated();
                }
                else
                {
                    _logger.Write(TraceEventType.Error, "Owin.ValidateClientAuthentication User:{0} access_token is null or invalid", context.OwinContext.Authentication.User.Identity.Name);
                }
            }
            return base.ValidateClientAuthentication(context);
        }

        public override Task GrantCustomExtension(OAuthGrantCustomExtensionContext context)
        {
            string idToken = context.Parameters.Get("idtoken");
            JwtTokenParser.AddTokenForValidation(idToken);
            var oAuthIdentity = new ClaimsIdentity(context.Options.AuthenticationType);
            /// Add username to the claim so that it can be identified in the next owin pipeline
            /// 
            string userName = JwtTokenParser.GetSignedUserName();
            oAuthIdentity.AddClaim(new Claim(ClaimTypes.Name, JwtTokenParser.GetSignedUserName()));

            /// Update the access_token with a fresh 60 min token.
            TokenCacheItem cachedItem;

            //check if we have the cached token for the user in dictionary
            if (_tokenCache.TryGetValue(userName, out cachedItem))
            {

                var tenants = GetTenant(cachedItem.authCode, cachedItem, userName);
                List<Subscription> userSubscriptions = GetSubscriptions(cachedItem.authCode, cachedItem, tenants, userName);
                var updatedCachedItem = new TokenCacheItem();
                updatedCachedItem.sessionId = cachedItem.sessionId;
                updatedCachedItem.authCode = cachedItem.authCode;
                updatedCachedItem.idTokenRawValue = cachedItem.idTokenRawValue;
                updatedCachedItem.redirectUri = cachedItem.redirectUri;
                updatedCachedItem.sessionId = cachedItem.sessionId;
                updatedCachedItem.subscriptions = userSubscriptions;
                _tokenCache.AddOrUpdate(userName, updatedCachedItem, (key, newValue) => updatedCachedItem);
            }
            var ticket = new AuthenticationTicket(oAuthIdentity, new AuthenticationProperties());
            context.Validated(ticket);
            return base.GrantCustomExtension(context);
        }


        /// <summary>
        /// This method is called on each request for access_token.
        /// </summary>
        /// <param name="context">Owin context that is passed from the middleware. This is where we create the claims</param>
        /// <returns></returns>
        public override Task GrantClientCredentials(OAuthGrantClientCredentialsContext context)
        {
            string signedInUserUniqueName = context.OwinContext.Authentication.User.Identity.Name;
            var claimsIdentity = new ClaimsIdentity(context.OwinContext.Authentication.User.Identity);
            var authCode = claimsIdentity.Claims.SingleOrDefault(c => c.Type == "code");
            var id_token = claimsIdentity.Claims.SingleOrDefault(c => c.Type == "id_token");
            #region ACCESS_TOKEN

            // retrieve the auth_code that we recieved from the Authentication flow. This authcode is provided after user signs in successfully.
            // make a call to AAD with the auth code for the access token. Result of the call will be access_token and refresh token. The refresh token 
            // can be used again before expiry to renew the access token.
            TokenCacheItem cachedItem;

            //check if we have the cached token for the user in dictionary
            if (_tokenCache.TryGetValue(signedInUserUniqueName, out cachedItem))
            {
                if (cachedItem.IsValid)
                {
                    //now that we have the cached item lets check if the token is about to expiry
                    if (cachedItem.RenewThresholdReached)
                    {
                        GetAccessTokenWithRefreshCode(cachedItem, signedInUserUniqueName);
                    }
                }
                else
                {
                    //item is in cache but not with complete values so lets fetch the token for the first time and update the item.
                    GetAccessTokenWithAuthCode(authCode.Value, id_token.Value, signedInUserUniqueName);
                    _tokenCache.TryGetValue(signedInUserUniqueName, out cachedItem);
                    _logger.Write(TraceEventType.Information, "Owin.GrantClientCredentials for existing user - {0}, issuer :{1}", signedInUserUniqueName, cachedItem.TokensData);
                }
            }
            else
            {
                //item is not in cache yet so lets fetch the token for the first time and store it.
                _tokenCache.TryAdd(signedInUserUniqueName, new TokenCacheItem { authCode = authCode.Value, sessionId = Guid.NewGuid() });
                GetAccessTokenWithAuthCode(authCode.Value, id_token.Value, signedInUserUniqueName);
            }

            #endregion

            context.Validated(claimsIdentity);
            return Task.FromResult<object>(null);
        }

        /// <summary>
        /// Method to get the Access token using a refresh token.
        /// </summary>
        /// <param name="cachedItem">cached item which is already in the token dictionary</param>
        private void GetAccessTokenWithRefreshCode(TokenCacheItem cachedItem, string userName)
        {
            if (cachedItem != null)
            {
                // We need a certificate based client credential. The client here is really our owin layer, as this 
                // layer is responsible for getting the access_token from the AAD. As a security measure we use a certificate to validate our credential.
                int retryCount = 0;
                bool retry = false;
                // Lets try for 3 times if AAD is down or service is unavailable.
                do
                {
                    retry = false;

                    try
                    {
                        //var tenants = GetTenant(cachedItem.authCode, cachedItem, userName);
                        //var aadlContext = new AuthenticationContext(string.Format(AADInstance, cachedItem.tenantId));
                        // var result = aadlContext.AcquireTokenByRefreshToken(cachedItem.refreshTokenRawValue, certCred, resourceKey);
                        //cachedItem.UpdateTokens(result);
                        var updatedCachedItem = new TokenCacheItem();
                        updatedCachedItem.sessionId = cachedItem.sessionId;
                        updatedCachedItem.authCode = cachedItem.authCode;
                        updatedCachedItem.idTokenRawValue = cachedItem.idTokenRawValue;
                        //updatedCachedItem.tenantId = cachedItem.tenantId;
                        updatedCachedItem.redirectUri = cachedItem.redirectUri;
                        updatedCachedItem.subscriptions = GetSubscriptionsByRefreshCode(cachedItem, userName);
                        _tokenCache.TryUpdate(userName, updatedCachedItem, cachedItem);
                    }
                    catch (AdalException ex)
                    {
                        if (ex.ErrorCode == "temporarily_unavailable")
                        {
                            retry = true;
                            retryCount++;
                        }
                        else
                        {
                            cachedItem.LastError = ex.Message;
                        }
                        _logger.Write(TraceEventType.Error, "Owin.GetAccessTokenWithRefreshCode User:{0} Exception:{1}", userName, ex.Message);
                    }
                    catch (Exception ex)
                    {
                        cachedItem.LastError = ex.Message;
                        _logger.Write(TraceEventType.Error, "Owin.GetAccessTokenWithRefreshCode User:{0} Exception:{1}", userName, ex.Message);
                    }
                } while ((retry == true) && (retryCount < 3));

            }
        }



        /// <summary>
        /// Method to get the Access token using a auth code.
        /// </summary>
        /// <param name="authCode">authorization code that we recieved after a successfull authentication. The suth code is recieved only once and hence we need to save it. Here we saved it in the dictionary object</param>
        /// <param name="id_token">id token  we recieved after a successfull authentication</param>
        /// <param name="userName">logged in user</param>
        private void GetAccessTokenWithAuthCode(string authCode, string id_token, string userName)
        {
            TokenCacheItem cachedItem;
            _tokenCache.TryGetValue(userName, out cachedItem);
            if (cachedItem != null)
            {
                // We need a certificate based client credential. The client here is really our owin layer, as this 
                // layer is responsible for getting the access_token from the AAD. As a security measure we use a certificate to validate our credential.
                int retryCount = 0;
                bool retry = false;
                // Lets try for 3 times if AAD is down or service is unavailable.
                do
                {
                    retry = false;

                    try
                    {
                        var tenants = GetTenant(authCode, cachedItem, userName);
                        List<Subscription> userSubscriptions = GetSubscriptions(authCode, cachedItem, tenants, userName);
                        var updatedCachedItem = new TokenCacheItem();
                        updatedCachedItem.sessionId = cachedItem.sessionId;
                        updatedCachedItem.authCode = authCode;
                        updatedCachedItem.idTokenRawValue = id_token;
                        updatedCachedItem.redirectUri = cachedItem.redirectUri;
                        updatedCachedItem.subscriptions = userSubscriptions;
                        _tokenCache.TryUpdate(userName, updatedCachedItem, cachedItem);
                    }
                    catch (AdalException ex)
                    {
                        if (ex.ErrorCode == "temporarily_unavailable")
                        {
                            retry = true;
                            retryCount++;
                        }
                        else
                        {
                            cachedItem.LastError = ex.Message;
                        }
                        _logger.Write(TraceEventType.Error, "Owin.GetAccessTokenWithAuthCode User:{0} Exception:{1}", userName, ex.Message);
                    }
                    catch (Exception ex)
                    {
                        cachedItem.LastError = ex.Message;
                        _logger.Write(TraceEventType.Error, "Owin.GetAccessTokenWithAuthCode User:{0} Exception:{1}", userName, ex.Message);
                    }
                } while ((retry == true) && (retryCount < 3));

            }
        }

        private List<Subscription> GetSubscriptionsByRefreshCode(TokenCacheItem cachedItem, string userName)
        {
            List<Subscription> allSubscriptions = new List<Subscription>();
            var uri = new Uri(string.Format("{0}subscriptions?api-version=2014-04-01", armEndpoint));


            foreach (var item in cachedItem.subscriptions)
            {
                try
                {
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
                    request.Method = "GET";
                    request.Accept = "application/json";
                    request.ContentType = "application/json";
                    var aadlContext = new AuthenticationContext(string.Format(AADInstance, item.TenantId));
                    var result = aadlContext.AcquireTokenByRefreshToken(item.Refresh_token, certCred, resourceKey);
                    request.Headers.Add("Authorization", "Bearer " + result.AccessToken);
                    var response = request.GetResponse();
                    StreamReader reader = new StreamReader(response.GetResponseStream());
                    string responseFromServer = reader.ReadToEnd();
                    reader.Close();
                    response.Close();
                    dynamic data = JObject.Parse(responseFromServer);
                    var subscriptions = ((JArray)data.value).ToObject<List<Subscription>>();
                    subscriptions.ForEach((s) =>
                    {
                        s.Access_token = result.AccessToken;
                        s.Refresh_token = result.RefreshToken;
                    });
                    allSubscriptions.AddRange(subscriptions);
                }
                catch (Exception ex)
                {
                    _logger.Write(TraceEventType.Error, "Owin.GetSubscriptions User:{0} Exception:{1}", userName, ex.Message);
                }
            }
            return allSubscriptions;
        }

        private List<Subscription> GetSubscriptions(string authCode, TokenCacheItem currentItem, List<Tenant> tenants, string userName)
        {
            List<Subscription> allSubscriptions = new List<Subscription>();
            if (tenants == null) return allSubscriptions;
            if (tenants.Count() == 0) return allSubscriptions;
            var uri = new Uri(string.Format("{0}subscriptions?api-version=2014-04-01", armEndpoint));


            foreach (var tenant in tenants)
            {
                try
                {
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
                    request.Method = "GET";
                    request.Accept = "application/json";
                    request.ContentType = "application/json";
                    var aadlContext = new AuthenticationContext(string.Format(AADInstance, tenant.tenantId));
                    var result = aadlContext.AcquireTokenByAuthorizationCode(authCode, new Uri(currentItem.redirectUri), certCred, resourceKey);
                    request.Headers.Add("Authorization", "Bearer " + result.AccessToken);
                    var response = request.GetResponse();
                    StreamReader reader = new StreamReader(response.GetResponseStream());
                    string responseFromServer = reader.ReadToEnd();
                    reader.Close();
                    response.Close();
                    dynamic data = JObject.Parse(responseFromServer);
                    var subscriptions = ((JArray)data.value).ToObject<List<Subscription>>();
                    subscriptions.ForEach((s) =>
                    {
                        s.Access_token = result.AccessToken;
                        s.Refresh_token = result.RefreshToken;
                        s.TenantId = tenant.tenantId;
                    });
                    allSubscriptions.AddRange(subscriptions);
                }
                catch (Exception ex)
                {
                    currentItem.LastError = ex.Message;
                    _logger.Write(TraceEventType.Error, "Owin.GetSubscriptions User:{0} Exception:{1}", userName, ex.Message);
                }
            }
            return allSubscriptions;
        }

        private List<Tenant> GetTenant(string authCode, TokenCacheItem cachedItem, string userName)
        {
            try
            {
                var aadlContext = new AuthenticationContext(string.Format(AADInstance, "common"));
                var result = aadlContext.AcquireTokenByAuthorizationCode(authCode, new Uri(cachedItem.redirectUri), certCred, resourceKey);

                var uri = new Uri(string.Format("{0}tenants?api-version=2014-04-01", armEndpoint));
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
                request.Method = "GET";
                request.Accept = "application/json";
                request.Headers.Add("Authorization", "Bearer " + result.AccessToken);
                request.ContentType = "application/json";

                var response = request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                string responseFromServer = reader.ReadToEnd();
                reader.Close();
                response.Close();
                dynamic data = JObject.Parse(responseFromServer);
                return ((JArray)data.value).ToObject<List<Tenant>>();
            }
            catch (Exception ex)
            {
                _logger.Write(TraceEventType.Error, "Owin.GetSubscriptions User:{0} Exception:{1}", userName, ex.Message);
                return null;
            }
        }


        /// <summary>
        /// Reads the configured certificates for the AAD.
        /// </summary>
        /// <returns></returns>
        private X509Certificate2 GetAADCertificate()
        {
            #region CERTTIFICATE QUERY

            X509Certificate2 cert = null;
            ///Certificate to be stored in Localmachine.
            X509Store store = new X509Store(StoreLocation.LocalMachine);
            store.Open(OpenFlags.ReadOnly | OpenFlags.OpenExistingOnly);
            try
            {
                X509Certificate2Collection collection = (X509Certificate2Collection)store.Certificates;
                X509Certificate2Collection fcollection = (X509Certificate2Collection)collection.Find(X509FindType.FindByTimeValid, DateTime.Now, false);

                // IMP : The following line should use the hard coded certificate name. Probably a big in the framework code, if the variable certname is used then the certificate is not returned.
                // X509Certificate2Collection signingCert = fcollection.Find(X509FindType.FindByThumbprint, certName, false);

                X509Certificate2Collection signingCert = fcollection.Find(X509FindType.FindByThumbprint, "43EFD2E646863477F5E06438E5A6DB65D864CE74", false);

                // From the collection of unexpired certificates, find the ones with the correct name.
                if (signingCert.Count == 0)
                {
                    //claimsIdentity.AddClaim(new Claim("fetch_error", "No matching certificate found, please check if the right certificate are installed for the Owin server."));
                    // No matching certificate found.
                    //return Task.FromResult<Exception>(new Exception("No matching certificate found"));
                }
                // Return the first certificate in the collection, has the right name and is current.
                cert = signingCert[0];
            }
            catch (Exception ex)
            {
                _logger.Write(TraceEventType.Critical, "Owin.GetAADCertificate Exception:{0}", ex.Message);
            }
            finally
            {
                //make sure we close the store.
                store.Close();
            }

            return cert;
            #endregion
        }

        private bool isUserAuthenticated(IOwinContext context)
        {
            return context.Authentication.User != null &&
                context.Authentication.User.Identity.IsAuthenticated;
        }
    }
}