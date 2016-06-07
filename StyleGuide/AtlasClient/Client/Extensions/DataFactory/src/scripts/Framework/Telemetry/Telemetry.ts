/// <reference path="../../../References.d.ts" />

"use strict";

let startOfAdfSession = new Date();
let moduleName = "AtlasDataFactory";

export interface ITelemetryLoggingService {
    logTelemetry(data: string): Q.Promise<void>;
}

export module Action {
    export const click = "click";
    export const hover = "hover";
    export const invoke = "invoke";
    export const open = "open";
    export const initialize = "initialize";
}

export class Event {
    public clientTimestamp: number;
    public tsbos: number;       // Time Since Beginning Of Session
    public areaId: string;
    public action: string;
    public azureResourceId: string;
    public otherInfo: string;
    public module: string;

    constructor(azureResourceId: string, areaId: string, action: string, otherInfo?: StringMap<string>) {
        let now = new Date();
        this.clientTimestamp = now.getTime();
        this.tsbos = now.getTime() - startOfAdfSession.getTime();
        this.module = moduleName;
        this.areaId = areaId;
        this.action = action;
        this.azureResourceId = azureResourceId;
        this.otherInfo = JSON.stringify(otherInfo);
    }
}

export class Telemetry {
    public periodicClearBufferCallback = () => {
        if (this.buffer.length !== 0 && (new Date().getTime() - this.lastBufferDump) >= this.bufferDumpWindow) {
            this.clearBuffer();
        }
    };

    private service: ITelemetryLoggingService = null;
    private buffer: Event[] = [];
    private bufferLength: number = 100;
    private bufferDumpWindow: number = 120000;      // The telemetry data will be dumped at least once in twice this time range.
    private lastBufferDump: number = new Date().getTime();
    // We need to periodically dump the logs. This var contains the id of the setInterval which does the task.
    private periodicBufferDumpId: number = null;

    constructor() {
        this.periodicBufferDumpId = setInterval(this.periodicClearBufferCallback, this.bufferDumpWindow);
    }

    public logEvent(event: Event): void {
        this.buffer.push(event);
        if (this.buffer.length >= this.bufferLength) {
            this.clearBuffer();
        }
    }

    public clearBuffer(): void {
        if (!this.service || this.buffer.length === 0) {
            this.buffer = [];
            return;
        }

        this.lastBufferDump = new Date().getTime();
        this.service.logTelemetry(JSON.stringify(this.buffer));
        this.buffer = [];
    }

    public updateServiceObject(service: ITelemetryLoggingService): void {
        this.service = service;
    }

    public dispose(): void {
        clearInterval(this.periodicBufferDumpId);
        this.clearBuffer();
    }
}

export const instance = new Telemetry();
