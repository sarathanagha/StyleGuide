/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class EventSourcePropertyMetadata {
        public propertyName: KnockoutObservable<string>;
        public markedPropertyName: KnockoutObservable<string>;
        public type: KnockoutObservable<string>;
        public isInFilter: KnockoutObservable<boolean> = ko.observable(false);

        constructor(eventSourcePropertyName: string, type: string) {
            this.propertyName = ko.observable(eventSourcePropertyName);
            this.markedPropertyName = ko.observable(eventSourcePropertyName);
            this.type = ko.observable(type);
        }

        public filter = (filter: string) => {
            var filterRegEx = new RegExp(filter, 'i');
            if (filterRegEx.test(this.propertyName()) && filter) {
                this.isInFilter(true);
                this.markedPropertyName(this.propertyName().replace(filterRegEx, '<mark>' + '$&' + '</mark>'));
            } else {
                this.isInFilter(false);
                this.markedPropertyName(this.propertyName());
            }
        }
    }
}
