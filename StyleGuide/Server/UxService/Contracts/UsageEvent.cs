namespace Microsoft.DataStudio.UxService.Contracts
{
    public class UsageEvent : EventBase
    {
        public string EventType { get; set; }

        public string EventName { get; set; }
    }
}