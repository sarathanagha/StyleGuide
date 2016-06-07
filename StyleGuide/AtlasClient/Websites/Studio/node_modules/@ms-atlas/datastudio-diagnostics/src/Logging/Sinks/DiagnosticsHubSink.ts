/// <reference path="../../references.ts" />
/// <reference path="../LoggerSink.ts" />
/// <reference path="../../Hub/DiagnosticsEvent.ts" />
/// <reference path="../../Hub/DiagnosticsHub.ts" />

module Microsoft.DataStudio.Diagnostics.Logging.Sinks {

    export class DiagnosticsHubSink implements LoggerSink {

        publishLogEvent(logEvent: LogEvent): void {
            if (logEvent.level <= LogLevel.Debug) { // TODO rskumar: Make this configurable at deployment time..
                // Skipping debug events
                return;
            }

            var diagnosticsEvent: Hub.DiagnosticsEvent = {
                timestamp: new Date(),
                priority: logEvent.level,
                eventType: Hub.DiagnosticsEventType[Hub.DiagnosticsEventType.LogEvent],
                eventBody: ObjectUtils.serialize(logEvent)
            };

            // Publish the diagnostics event to hub for further delivery on server
            Hub.DiagnosticsHub.publishEvent(diagnosticsEvent);
        }

        publishUsageEvent(usageEvent: UsageEvent): void {

            var diagnosticsEvent: Hub.DiagnosticsEvent = {
                timestamp: new Date(),
                priority: Logging.LogLevel.Info,
                eventType: Hub.DiagnosticsEventType[Hub.DiagnosticsEventType.UsageEvent],
                eventBody: ObjectUtils.serialize(usageEvent)
            };

            Hub.DiagnosticsHub.publishEvent(diagnosticsEvent);
        }
    }
}
