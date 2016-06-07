/// <reference path="../references.ts" />
/// <reference path="LogEventData.ts" />

module Microsoft.DataStudio.Diagnostics.Logging {

    export interface Logger {

        // UxTraceLog
        logDebug(message: string, data?: LogEventData | any): void;
        logInfo(message: string, data?: LogEventData | any): void;
        logWarning(message: string, data?: LogEventData | any): void;
        logError(message: string, data?: LogEventData | any): void;

        // UxUsageLog
        logUsage(eventType: UsageEventType, eventName: string, data?: any): void;
    }
}
