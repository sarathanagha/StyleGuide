using System;
using System.Linq;
using System.IdentityModel.Tokens;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using System.Web;
using System.Collections.Concurrent;
using Microsoft.DataStudio.OAuthMiddleware.Models;
using System.Dynamic;
using System.Collections.Generic;

namespace Microsoft.DataStudio.OAuthMiddleware.AuthorizationServiceProvider
{
    public class JwtTokenFormatter : ISecureDataFormat<AuthenticationTicket>
    {
        private SimpleAuthorizationServerProvider authorizationProvider;
        private ConcurrentDictionary<string, TokenCacheItem> _tokenCache;
        public JwtTokenFormatter(OAuthAuthorizationServerOptions oAuthServerOptions)
        {
            authorizationProvider = oAuthServerOptions.Provider as SimpleAuthorizationServerProvider;
            _tokenCache = authorizationProvider.TokenCache;
        }
        public string Protect(AuthenticationTicket data)
        {
            if (data == null) throw new ArgumentNullException("data");
            TokenCacheItem cachedItem;
            List<dynamic> subscriptionlist = new List<dynamic>();
            //check if we have the cached token for the user in dictionary
            _tokenCache.TryGetValue(data.Identity.Name, out cachedItem);
            if (cachedItem != null)
            {
                var errorMesage = cachedItem.LastError;
                if (string.IsNullOrEmpty(errorMesage))
                {
                    if (cachedItem.subscriptions != null)
                    {
                        var useremail = data.Identity.Name.Contains('#') == true ? data.Identity.Name.Split('#')[1] : data.Identity.Name;
                        var result = new CustomBearerToken { email = useremail, sessionId = cachedItem.sessionId, accessTokenRawValue = cachedItem.subscriptions.FirstOrDefault().Access_token, idTokenRawValue = cachedItem.idTokenRawValue, message = cachedItem.LastError };
                        foreach (var item in cachedItem.subscriptions)
                        {
                            dynamic bareminimumSubscription = new ExpandoObject();
                            bareminimumSubscription.subscriptionid = item.SubscriptionId;
                            bareminimumSubscription.access_token = item.Access_token;
                            bareminimumSubscription.displayName = item.DisplayName;
                            subscriptionlist.Add(bareminimumSubscription);
                        }
                        result.subscriptions = subscriptionlist.ToArray();
                        return JsonConvert.SerializeObject(result);
                    }
                }
                else
                {
                    cachedItem.LastError = string.Empty;
                    return JsonConvert.SerializeObject(new CustomBearerToken { accessTokenRawValue = string.Empty, idTokenRawValue = string.Empty, message = errorMesage });
                }
            }
            return JsonConvert.SerializeObject(new CustomBearerToken { accessTokenRawValue = string.Empty, idTokenRawValue = string.Empty, message = "Error encountered. Please relogin again." });
        }

        public AuthenticationTicket Unprotect(string protectedText)
        {
            throw new NotImplementedException();
        }
    }
}