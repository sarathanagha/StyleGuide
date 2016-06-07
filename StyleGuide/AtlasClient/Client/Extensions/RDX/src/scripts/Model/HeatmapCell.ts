/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class HeatmapCell {
        public hit: HeatmapHit = null;
        public selected: boolean = false;
        public rowIdx: number;
        public colIdx: number;
        public id: string;
        public eventSourceName: string;

        constructor () {
        }

        public overlayId (): string {
            return "overlay" + this.id;
        }
    }
}