/// <reference path="../references.ts" />
/// <reference path="LogLevel.ts" />
/// <reference path="LoggerData.ts" />
/// <reference path="LogEventData.ts" />
/// <reference path="LogEvent.ts" />
/// <reference path="Logger.ts" />
/// <reference path="LoggerBus.ts" />

module Microsoft.DataStudio.Diagnostics.Logging {

    export class LoggerImpl implements Logger {

        private loggerData: LoggerData;

        constructor(loggerData: LoggerData) {
            Assert.argumentIsObject(loggerData, "loggerData");

            this.loggerData = loggerData;
        }

        logDebug(message: string, data?: LogEventData): void {
            var methodData: LogEvent = {
                level: LogLevel.Debug,
                message: message
            };

            LoggerImpl.logEvent(this.loggerData, methodData, data);
        }

        logInfo(message: string, data?: LogEventData): void {
            var methodData: LogEvent = {
                level: LogLevel.Info,
                message: message
            };

            LoggerImpl.logEvent(this.loggerData, methodData, data);
        }

        logWarning(message: string, data?: LogEventData): void {
            var methodData: LogEvent = {
                level: LogLevel.Warning,
                message: message
            };

            LoggerImpl.logEvent(this.loggerData, methodData, data);
        }

        logError(message: string, data?: LogEventData): void {
            var methodData: LogEvent = {
                level: LogLevel.Error,
                message: message
            };

            LoggerImpl.logEvent(this.loggerData, methodData, data);
        }

        logUsage(eventType: UsageEventType, eventName: string, data?: any): void {
            var usageEvent: UsageEvent = {
                eventType: UsageEventType[eventType],
                eventName: eventName
            };

            usageEvent = <UsageEvent>ObjectUtils.merge(usageEvent, this.loggerData, data);

            LoggerBus.publishUsageEvent(usageEvent);
        }

        private static logEvent(...data: LogEventData[]): void {
            // Create a log event by provided chain of data objects
            var logEvent = <LogEvent>ObjectUtils.mergeFromArray(data);

            // Normalizing the log level
            logEvent.level = ObjectUtils.numberOrDefault(logEvent.level, LogLevel.Info);

            // Normalizing the predefined fields
            logEvent.moduleName = ObjectUtils.stringOrDefault(logEvent.moduleName);
            logEvent.loggerName = ObjectUtils.stringOrDefault(logEvent.loggerName);
            logEvent.category = ObjectUtils.stringOrDefault(logEvent.category);
            logEvent.message = ObjectUtils.stringOrDefault(logEvent.message);
            logEvent.error = <Error>ObjectUtils.objectOrUndefined(logEvent.error);
            logEvent.correlationId = ObjectUtils.stringOrDefault(logEvent.correlationId);
            logEvent.clientRequestId = ObjectUtils.stringOrDefault(logEvent.clientRequestId);

            // Publish the event to bus for delivery to registered sinks
            LoggerBus.publishLogEvent(logEvent);
        }
    }
}
