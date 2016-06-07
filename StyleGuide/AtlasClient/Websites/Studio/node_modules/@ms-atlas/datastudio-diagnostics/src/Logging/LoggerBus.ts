/// <reference path="../references.ts" />
/// <reference path="LogEvent.ts" />
/// <reference path="LoggerSink.ts" />
/// <reference path="Sinks/BrowserConsoleSink.ts" />
/// <reference path="Sinks/DiagnosticsHubSink.ts" />

module Microsoft.DataStudio.Diagnostics.Logging {

    export class LoggerBus {

        private static globalData = {};

        // TODO: [agoyal] Configure sinks from outside, it should be empty
        private static logEventSinks: LoggerSink[] = [
            new Sinks.BrowserConsoleSink(),
            new Sinks.DiagnosticsHubSink()
        ];

        private static usageEventSinks: LoggerSink[] = [
            new Sinks.DiagnosticsHubSink()
        ];

        static configureEventData(data: {}): void {
            Assert.argumentIsObject(data, "data");

            ObjectUtils.update(LoggerBus.globalData, data);
        }

        static configureSink(loggerSink: LoggerSink): void {
            Assert.argumentIsObject(loggerSink, "loggerSink");

            LoggerBus.logEventSinks.push(loggerSink);
        }

        static publishLogEvent(logEvent: LogEvent): void {
            Assert.argumentIsObject(logEvent, "logEvent");

            // Update the event with predefined global event data
            ObjectUtils.update(logEvent, LoggerBus.globalData, false);

            // Publish the event to registered sinks
            LoggerBus.logEventSinks.forEach(loggerSink => {
                try {
                    loggerSink.publishLogEvent(logEvent);
                } catch (e) {
                    console.error("LoggerBus: Publishing of event to sink %s failed.", loggerSink, e);
                }
            });
        }

        static publishUsageEvent(usageEvent: UsageEvent): void {
            Assert.argumentIsObject(usageEvent, "usageEvent");

            // Publish the event to registered sinks
            LoggerBus.usageEventSinks.forEach(usageSink => {
                try {
                    usageSink.publishUsageEvent(usageEvent);
                } catch (e) {
                    console.error("LoggerBus: Publishing of event to sink %s failed.", usageSink, e);
                }
            });
        }
    }
}
