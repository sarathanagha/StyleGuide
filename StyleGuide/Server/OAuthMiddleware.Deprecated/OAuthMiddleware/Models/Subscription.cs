
using System.Web.Script.Serialization;
namespace Microsoft.DataStudio.OAuthMiddleware.Models
{
    /// <summary>
    /// Azure resource manager subscription.
    /// </summary>
    public class Subscription
    {
        /// <summary>
        /// Subscription identifier
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Subscription GUID
        /// </summary>
        public string SubscriptionId { get; set; }

        /// <summary>
        /// Display name
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// Subscription state
        /// </summary>
        public string State { get; set; }

        public string Access_token { get; set; }
        
        [ScriptIgnore]
        public string Refresh_token { get; set; }

        [ScriptIgnore]
        public string TenantId { get; set; }
       
    }
}