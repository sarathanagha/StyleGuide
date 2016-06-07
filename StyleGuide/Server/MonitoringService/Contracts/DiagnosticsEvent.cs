using System;

namespace Microsoft.DataStudio.UxMonitoring.WebRole.Contracts
{
    public class DiagnosticsEvent
    {
        public DateTimeOffset Timestamp { get; set; }
        public int Priority { get; set; }

        // Session details
        public string SessionId { get; set; }
        public string UserId { get; set; }

        // Subscription details
        public Guid SubscriptionId { get; set; }
        public string ResourceGroupName { get; set; }
        public string ResourceName { get; set; }
        public string Provider { get; set; }

        public DiagnosticsEventType EventType { get; set; }
        public string EventBody { get; set; }
    }
}
