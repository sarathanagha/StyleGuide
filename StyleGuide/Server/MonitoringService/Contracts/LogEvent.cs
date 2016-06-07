namespace Microsoft.DataStudio.UxMonitoring.WebRole.Contracts
{
    public class LogEvent : EventBase
    {
        public LogLevel Level { get; set; }

        public string Message { get; set; }

        public string CorrelationId { get; set; }

        public string ClientRequestId { get; set; }
    }
}
