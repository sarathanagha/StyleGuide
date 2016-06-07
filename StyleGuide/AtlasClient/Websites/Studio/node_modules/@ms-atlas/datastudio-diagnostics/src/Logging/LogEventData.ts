/// <reference path="../references.ts" />
/// <reference path="LoggerData.ts" />
/// <reference path="LogLevel.ts" />

module Microsoft.DataStudio.Diagnostics.Logging {

    export interface LogEventData extends LoggerData {

        cause?: string;
        error?: Error;
        correlationId?: string;
        clientRequestId?: string;
    }
}
