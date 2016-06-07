/// <reference path="../references.ts" />

module Microsoft.DataStudio.Diagnostics.Hub {

    export interface DiagnosticsEvent {

        timestamp: Date;
        priority: number;

        eventType: string;
        eventBody: string;
    }
}
