/// <reference path="../references.ts" />
/// <reference path="LogEvent.ts" />

module Microsoft.DataStudio.Diagnostics.Logging {

    export interface LoggerSink {
        publishLogEvent(logEvent: LogEvent): void;
        publishUsageEvent(usageEvent: UsageEvent): void;
    }
}
