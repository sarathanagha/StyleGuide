using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.UxService.Contracts;
using Microsoft.DataStudio.WebRole.Common.Controllers;
using Newtonsoft.Json;
using ILogger = Microsoft.DataStudio.Diagnostics.ClientUX.ILogger;

namespace Microsoft.DataStudio.UxService.Controllers
{
    // DataStudio# 6976650 is tracking to remove this duplicate controller and its contracts
    [Authorize]
    public class DiagnosticsHubController : UxControllerBase
    {
        public DiagnosticsHubController(Diagnostics.ILogger logger) : base(logger)
        {
        }

        [HttpPost]
        [Route("api/diagnosticshub/publish")]
        public IHttpActionResult Publish(DiagnosticsEvent[] diagnosticsEvents)
        {
            CheckNotNull(diagnosticsEvents, "diagnosticsEvents");

            string userAgent = this.UserAgent;
            ILogger logger = LoggerFactory.CreateClientUXLogger(SourceLevels.All);

            foreach (var diagnosticsEvent in diagnosticsEvents)
            {
                try
                {
                    ProcessDiagnosticsEvent(diagnosticsEvent, userAgent, logger);
                }
                catch (Exception ex)
                {
                    this.logger.Write(TraceEventType.Warning, "Unable to process diagnostics event: {0}", ex);
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message));
                }
            }

            return Ok();
        }

        private void ProcessDiagnosticsEvent(DiagnosticsEvent diagnosticsEvent, string userAgent, ILogger logger)
        {
            switch (diagnosticsEvent.EventType)
            {
                case DiagnosticsEventType.LogEvent:
                    {
                        var logEvent = JsonConvert.DeserializeObject<LogEvent>(diagnosticsEvent.EventBody);

                        logger.WriteLogEvent(
                            TraceEventTypeFromLogLevel((LogLevel)logEvent.Level),
                            logEvent.ModuleName,
                            logEvent.LoggerName,
                            logEvent.Category,
                            diagnosticsEvent.Timestamp.DateTime,
                            diagnosticsEvent.SessionId,
                            logEvent.CorrelationId,
                            logEvent.ClientRequestId,
                            diagnosticsEvent.SubscriptionId,
                            diagnosticsEvent.ResourceGroupName,
                            diagnosticsEvent.ResourceName,
                            diagnosticsEvent.Provider,
                            diagnosticsEvent.UserId,
                            userAgent,
                            logEvent.CustomProperties,
                            logEvent.Message,
                            null);
                    }
                    break;

                case DiagnosticsEventType.UsageEvent:
                    {
                        var usageEvent = JsonConvert.DeserializeObject<UsageEvent>(diagnosticsEvent.EventBody);

                        logger.WriteUsageEvent(
                            usageEvent.EventType,
                            usageEvent.EventName,
                            usageEvent.CustomProperties,
                            usageEvent.ModuleName,
                            usageEvent.LoggerName,
                            usageEvent.Category,
                            diagnosticsEvent.Timestamp.DateTime,
                            diagnosticsEvent.SessionId,
                            diagnosticsEvent.UserId,
                            diagnosticsEvent.SubscriptionId,
                            userAgent);
                    }
                    break;

                default:
                    throw new Exception("Unknown DiagnosticsEventType!");
            }
        }

        private TraceEventType TraceEventTypeFromLogLevel(LogLevel logLevel)
        {
            switch(logLevel)
            {
                case LogLevel.Debug:
                    return TraceEventType.Verbose;

                case LogLevel.Error:
                    return TraceEventType.Error;

                case LogLevel.Info:
                    return TraceEventType.Information;

                case LogLevel.Warning:
                    return TraceEventType.Warning;

                default:
                    return TraceEventType.Information;
            }
        }
    }
}
