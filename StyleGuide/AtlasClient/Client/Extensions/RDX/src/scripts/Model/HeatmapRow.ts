/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models{
    export class HeatmapRow{
        public eventSourceName: string;
        public cells: Array<HeatmapCell> = [];
        public isInFilter: boolean = true;
        public markedEventSourceName: string;

        constructor(eventSourceName: string) {
            this.eventSourceName = eventSourceName;
            this.markedEventSourceName = eventSourceName;
        }

        public hasActiveHits (): boolean {
            return true;
        }
    }
}