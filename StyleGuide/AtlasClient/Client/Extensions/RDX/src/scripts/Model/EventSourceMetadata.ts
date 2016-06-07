/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class EventSourceMetadata {
        public eventSourceName: KnockoutObservable<string>;
        public markedEventSourceName: KnockoutObservable<string>;
        public isInFilter: KnockoutObservable<boolean> = ko.observable(true);
        public isExpanded: KnockoutObservable<boolean> = ko.observable(false);
        public properties: KnockoutObservableArray<EventSourcePropertyMetadata> = ko.observableArray([]);

        constructor (eventSourceName: string) {
            this.eventSourceName = ko.observable(eventSourceName);
            this.markedEventSourceName = ko.observable(eventSourceName);
        }

        public filter = (filter: string) => {
            var filterRegEx = new RegExp(filter, 'i');
            if (filterRegEx.test(this.eventSourceName())) {
                this.isInFilter(true);
                this.markedEventSourceName(this.eventSourceName().replace(filterRegEx, '<mark>' + '$&' + '</mark>'));
            } else {
                this.isInFilter(false);
                this.markedEventSourceName(this.eventSourceName());
            }

            this.properties().forEach((property) => {
                property.filter(filter);
                if (!this.isInFilter() && property.isInFilter()) {
                    this.isInFilter(true);
                }
            });
        }
    }
}
