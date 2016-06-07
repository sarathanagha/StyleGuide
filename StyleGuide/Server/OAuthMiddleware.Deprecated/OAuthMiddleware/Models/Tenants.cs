using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Microsoft.DataStudio.OAuthMiddleware.Models
{
    public class Tenant
    {
        /// <summary>
        /// Subscription identifier
        /// </summary>
        public string id { get; set; }

        /// <summary>
        /// Subscription GUID
        /// </summary>
        public string tenantId { get; set; }

    }
}