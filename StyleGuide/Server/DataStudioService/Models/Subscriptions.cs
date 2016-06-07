using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Microsoft.DataStudio.Services.Models
{
    public class Subscription
    {
        public string SubscriptionId { get; set; }
        public string DisplayName { get; set; }
        public string State { get; set; }
    }

    public class Subscriptions
    {
        public List<Subscription> Value { get; set; }
        public string NextLink { get; set; }
    }
}