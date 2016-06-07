/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class HeatmapColumn {
        public percentCompleted: number = 100;
        public dateTime: Date;
        public prettyPrintDate: boolean = false;

        constructor(dateTimeInMilliseconds: number) {
            this.dateTime = new Date(dateTimeInMilliseconds);
        }

        public prettyPrintedTime(): string {
            if (this.prettyPrintDate)
                return this.prettyPrintedBarChartTime();
            var minutes = this.dateTime.getUTCMinutes();
            return this.dateTime.getUTCHours() + ":" + (minutes < 10 ? '0' + minutes : minutes);
        }

        public prettyPrintedBarChartTime(): string {
            var date = this.dateTime.getUTCMonth() + 1 + '/' + this.dateTime.getUTCDate() + ' ';
            var minutes = this.dateTime.getUTCMinutes();
            if (minutes < 10)
                return date + this.dateTime.getUTCHours() + ":0" + minutes;
            return date + this.dateTime.getUTCHours() + ":" + minutes;
        }
    }
}