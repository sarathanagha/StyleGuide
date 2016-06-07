using Microsoft.IdentityModel.S2S.Tokens;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IdentityModel.Claims;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web;

namespace Microsoft.DataStudio.OAuthMiddleware.Helpers
{
    public class JwtTokenParser
    {
        private static JwtSecurityToken _token = null;
        private const string Upn = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn";
        private const string Expiration = "http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration";
        internal static JwtSecurityToken AddTokenForValidation(string rawValue)
        {
            try
            {
                _token = new JwtSecurityToken(rawValue);
            }
            catch (Exception)
            {
            }
            return _token;
        }

        public static bool HasExpired(string rawToken)
        {
            return HasExpired(new JwtSecurityToken(rawToken));
        }

        public static bool HasExpired(JwtSecurityToken token)
        {
            try
            {
                if (token.Payload.Exp.HasValue)
                {
                    TimeSpan timeDifference = UnixTimeStampToDateTime((long)token.Payload.Exp.Value) - DateTime.Now;
                    if (timeDifference.TotalMinutes < 0)
                    {
                        return true;
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
            return false;
        }


        /// <summary>
        /// Property to check  if the acces token is about to expiry. The threshold is kept for 5 min. The token will be refreshed using the refresh token once 
        /// the call time is within 5 minutes of expiry.
        /// </summary>
        public static bool RenewThresholdReached(string rawToken)
        {
            try
            {
                JwtSecurityToken token = new JwtSecurityToken(rawToken);
                if (token.Payload.Exp.HasValue)
                {
                    TimeSpan timeDifference = UnixTimeStampToDateTime((long)token.Payload.Exp.Value) - DateTime.Now;
                    if (timeDifference.TotalMinutes <= 5)
                    {
                        return true;
                    }
                }

            }
            catch (Exception)
            {
                throw;
            }
            return false;
        }

        /// <summary>
        /// Method which converts a Unix time stamp to .net Datetime type
        /// </summary>
        /// <param name="unixTimeStamp"></param>
        /// <returns>.Net type of DateTime is returned</returns>
        public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }

        internal static void Validate(string claim, ConcurrentDictionary<string, TokenCacheItem> tokenCache)
        {
            TokenCacheItem cachedItem;
            switch (claim)
            {
                case Upn:
                    //check if we have the valid user who is calling, else he would not be in the dictionary.
                    if (!tokenCache.TryGetValue(GetSignedUserName(), out cachedItem)) throw new Exception("Invalid Token:");
                    break;
                case Expiration:
                    var expiry = HasExpired(_token);
                    if (expiry) throw new Exception("Token Expired");
                    break;
            }
        }

        internal static string GetSignedUserName()
        {
            if (!HasExpired(_token))
            {
                String idp, email;
                if (_token.Claims.Any(c => c.Type.Equals("puid")))
                {
                    return _token.Claims.Single(c => c.Type.Equals("upn")).Value;
                }
                else
                {
                    try
                    {
                        idp = _token.Claims.Single(c => c.Type.Equals("idp")).Value;
                        email = _token.Claims.Single(c => c.Type.Equals("email")).Value;
                        return string.Format("{0}#{1}", idp, email);
                    }
                    catch (Exception)
                    {
                        throw new Exception("Correct claim is not found in claims.Please check the id token for the right claim");
                    }
                }
            }
            throw new Exception("Token Expired.Please send a valid Id token to get access_token");
        }
    }


}