/// <reference path="../references.ts" />
/// <reference path="LogEventData.ts" />

module Microsoft.DataStudio.Diagnostics.Logging {

    export interface LogEvent extends LogEventData {

        level: LogLevel;
        message: string;
    }
}
