/// <reference path="../references.ts" />

module Microsoft.DataStudio.Diagnostics.Logging {

    export interface UsageEvent extends LoggerData {

        eventType: string;
        eventName: string;
    }
}
