using System;
using Microsoft.DataStudio.OAuthMiddleware.Models;
namespace Microsoft.DataStudio.OAuthMiddleware
{
    public class CustomBearerToken
    {
        public string message { get; set; }
        public string idTokenRawValue { get; set; }
        public string accessTokenRawValue { get; set; }
        public Guid sessionId { get; set; }
        public string email { get; set; }
        public dynamic subscriptions { get; set; }
    }
}