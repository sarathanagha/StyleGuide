/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class MetadataExplorer {
        public telemetryClient: RdxTelemetryClient;
        public timePicker: TimePicker;
        public queryEndpoint: string;
        public metadata: KnockoutObservableArray<EventSourceMetadata> = ko.observableArray([]);
        public loadingMetadata: KnockoutObservable<boolean> = ko.observable(true);
        public environmentId: string = '';
        private metadataRequestHandle: XMLHttpRequest = null;
        private availabilityCallStartMs: number;

        constructor(timePicker: TimePicker, telemetryClient: RdxTelemetryClient, queryEndpoint: string) {
            this.telemetryClient = telemetryClient;
            this.timePicker = timePicker;
            this.queryEndpoint = queryEndpoint;

            // gets metadata when timepicker says to, only gets metadata if there is no metadata yet
            this.timePicker.getMetadataTrigger.subscribe(() => {
                var metadata = this.metadata.peek();
                if (this.environmentId) {
                    this.getMetadata();
                }
            });
        }

        public getMetadata = () => {

            // ensure we only process the most recent request
            if (this.metadataRequestHandle) {
                this.metadataRequestHandle.abort();
                this.metadataRequestHandle = null;
                this.telemetryClient.logUserAction('getMetadataCallAbandoned');
            }
            this.telemetryClient.logUserAction('getMetadataCallStart', { environmentId: this.environmentId });
            this.availabilityCallStartMs = (new Date()).valueOf();

            this.loadingMetadata(true);
            this.metadata([]);
            var searchSpan = { from: new Date(this.timePicker.availabilityFromMillis).toISOString(), to: new Date(this.timePicker.availabilityToMillis).toISOString() };

            Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken().then((token) => {
                this.metadataRequestHandle = $.ajax({
                    url: 'https://' + this.queryEndpoint + '/environments/' + this.environmentId + '/metadata',
                    type: 'POST',
                    data: JSON.stringify({ searchSpan: searchSpan }),
                    contentType: 'application/json',
                    beforeSend: function (xhr) { xhr.setRequestHeader('version', '20150504'); xhr.setRequestHeader('Authorization', JSON.stringify(['Bearer ' + token])) },
                    success: data => {

                        // read metadata into an object so we can sort it
                        var metadata = {};
                        for (var eventSourceProperty in data.metadata) {
                            if (!metadata.hasOwnProperty(data.metadata[eventSourceProperty].eventSourceName)) {
                                metadata[data.metadata[eventSourceProperty].eventSourceName] = [];
                            }
                            metadata[data.metadata[eventSourceProperty].eventSourceName].push({
                                propertyName: data.metadata[eventSourceProperty].propertyName,
                                type: data.metadata[eventSourceProperty].propertyType
                            });
                        }

                        // read metadata into array
                        var metadataArray = [];
                        var sortedEventSourceNameArray = Object.keys(metadata).sort();
                        for (var eventIdx in sortedEventSourceNameArray) {
                            var eventSourceName = sortedEventSourceNameArray[eventIdx];
                            var eventSourceMetadata = new EventSourceMetadata(eventSourceName);

                            for (var propertyIdx in metadata[eventSourceName]) {
                                eventSourceMetadata.properties.push(new EventSourcePropertyMetadata(metadata[eventSourceName][propertyIdx].propertyName, metadata[eventSourceName][propertyIdx].type));
                            }
                            metadataArray.push(eventSourceMetadata);
                        }

                        // set, no more loading
                        this.metadata(metadataArray);
                        this.loadingMetadata(false);
                        this.metadataRequestHandle = null;
                        this.telemetryClient.logUserAction('getMetadataCallComplete', { duration: (new Date()).valueOf() - this.availabilityCallStartMs });
                    },
                    error: (xhr, text_status) => {
                        if (text_status != 'abort')
                            this.telemetryClient.logUserAction('getMetadataCallFailed');
                        this.loadingMetadata(false);
                    }
                });
            });
        }

        public setMetadataFilteredAttributes = (filter: string) => {
            this.telemetryClient.logUserAction('filterMetadata', { filter: filter });
            this.metadata().forEach(function(eventSourceMetadata) {
                eventSourceMetadata.filter(filter);
            });
        }
    }
}