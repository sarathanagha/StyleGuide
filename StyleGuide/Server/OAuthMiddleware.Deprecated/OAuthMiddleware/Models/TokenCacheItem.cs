using Microsoft.DataStudio.OAuthMiddleware.Helpers;
using Microsoft.DataStudio.OAuthMiddleware.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Text;

namespace Microsoft.DataStudio.OAuthMiddleware
{

    /// <summary>
    /// This class handles the token validation for expiry and caches the tokens for a user
    /// </summary>
    public class TokenCacheItem
    {
        private IdentityModel.Clients.ActiveDirectory.AuthenticationResult result;

        public TokenCacheItem()
        {

        }
        public TokenCacheItem(IdentityModel.Clients.ActiveDirectory.AuthenticationResult result)
        {
            this.result = result;
            this.accessTokenRawValue = result.AccessToken;
            this.idTokenRawValue = result.IdToken;
            this.refreshTokenRawValue = result.RefreshToken;
        }
        public string refreshTokenRawValue;
        public string idTokenRawValue;
        public string accessTokenRawValue;
        public string authCode;
        public Guid sessionId;
        public string LastError;
        public string redirectUri;
        public List<Subscription> subscriptions = new List<Subscription>();

        public string TokensData
        {
            get
            {
                StringBuilder sb = new StringBuilder();
                foreach (var item in subscriptions)
                {
                    sb.Append("Subscription ID:[" + item.SubscriptionId + "] ");
                    sb.Append("State:[" + item.State + "] ");
                    sb.Append("Tenant ID:[" + item.TenantId + "] ");
                }
                return sb.ToString();
            }
        }


        public bool IsValid
        {

            get
            {
                if (subscriptions.Count == 0) return false;
                try
                {
                    if (new JwtSecurityToken(this.subscriptions[0].Access_token) != null)
                    {
                        return true;
                    }
                    else return false;
                }
                catch (Exception) { return false; }
            }
        }

        /// <summary>
        /// Property to check if the access token expired for the user
        /// </summary>
        public bool HasExpired
        {
            get
            {
                return JwtTokenParser.HasExpired(this.subscriptions[0].Access_token);
            }
        }

        /// <summary>
        /// Property to check  if the acces token is about to expiry. The threshold is kept for 5 min. The token will be refreshed using the refresh token once 
        /// the call time is within 5 minutes of expiry.
        /// </summary>
        public bool RenewThresholdReached
        {
            get
            {
                return JwtTokenParser.RenewThresholdReached(this.subscriptions[0].Access_token);
            }
        }

        /// <summary>
        /// Updates the token for the user with the fresh set of token issued from AAD.
        /// </summary>
        /// <param name="result"></param>
        internal void UpdateTokens(IdentityModel.Clients.ActiveDirectory.AuthenticationResult result)
        {
            this.result = result;
            this.accessTokenRawValue = result.AccessToken;
            if (result.IdToken != null)
            {
                this.idTokenRawValue = result.IdToken;
            }
            this.refreshTokenRawValue = result.RefreshToken;
        }

        /// <summary>
        /// Method which converts a Unix time stamp to .net Datetime type
        /// </summary>
        /// <param name="unixTimeStamp"></param>
        /// <returns>.Net type of DateTime is returned</returns>
    }
}