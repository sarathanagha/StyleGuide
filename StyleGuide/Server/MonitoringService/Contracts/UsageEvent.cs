namespace Microsoft.DataStudio.UxMonitoring.WebRole.Contracts
{
    public class UsageEvent : EventBase
    {
        public string EventType { get; set; }

        public string EventName { get; set; }
    }
}