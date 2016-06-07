/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class TimePicker {
        public telemetryClient: RdxTelemetryClient;
        public queryEndpoint: string;
        public prettyPrintedValue: KnockoutComputed<string>;
        public startDateMilliseconds: KnockoutObservable<number> = ko.observable(0);
        public endDateMilliseconds: KnockoutObservable<number> = ko.observable(0);
        public getMetadataTrigger: KnockoutObservable<boolean> = ko.observable(false); // for getting metadata
        public latestAvailableTimeInMilliseconds: number = new Date().valueOf();
        public earliestAvailableTimeInMilliseconds: number = new Date().valueOf();
        public startDate: KnockoutObservable<string> = ko.observable('');
        public startTime: KnockoutObservable<string> = ko.observable('');
        public endDate: KnockoutObservable<string> = ko.observable('');
        public endTime: KnockoutObservable<string> = ko.observable('');
        public startDateTime: KnockoutComputed<string> = ko.computed(() => { return this.startDate() + ' ' + this.startTime(); });
        public endDateTime: KnockoutComputed<string> = ko.computed(() => { return this.endDate() + ' ' + this.endTime(); })
        public timeAndDateInputConsistency: KnockoutComputed<void>;
        public errorMessage: KnockoutComputed<string>;
        public clickSearchButtonHelpMessage: KnockoutObservable<string> = ko.observable('').extend({throttle: 250});
        public loadingAvailability: KnockoutObservable<boolean> = ko.observable(false);
        public availabilityDistribution = {};
        public numberOfEventsInRange = ko.observable(0);
        public availabilityRequestFailed: KnockoutObservable<boolean> = ko.observable(false);
        public availabilityFromMillis:number = 0;
        public availabilityToMillis:number = 0;
        private availabilityRequestHandle: XMLHttpRequest = null;
        private availabilityCallStartMs: number;

        constructor(telemetryClient: RdxTelemetryClient, queryEndpoint: string) {
            this.telemetryClient = telemetryClient;
            this.queryEndpoint = queryEndpoint;
            this.prettyPrintedValue = ko.computed({
                owner: this,
                read: () => {
                    this.parseDateTimeFromString();
                    return '<span class="textMSB">FROM</span> ' + this.startDateTime() + '&nbsp;&nbsp;<span class="textMSB">TO</span> ' + this.endDateTime();  // TODO: revisit design
                }
            });

            this.errorMessage = ko.computed(() => {
                var beforeStartTime = this.endDateMilliseconds() < this.startDateMilliseconds() ? 'End time cannot be before start time' : '';
                var totalEvents = 0;
                var availabilityDistributionKeys = Object.keys(this.availabilityDistribution);
                availabilityDistributionKeys.forEach(k => {
                    if (this.startDateMilliseconds() <= parseInt(k) && parseInt(k) <= this.endDateMilliseconds())
                        totalEvents += this.availabilityDistribution[k];
                });
                this.numberOfEventsInRange(totalEvents);
                var outOfRange = '';
                // if we have an availability dist, check on the error conditions
                if (Object.keys(this.availabilityDistribution).length)
                    outOfRange = this.endDateMilliseconds() < this.availabilityFromMillis || this.startDateMilliseconds() > this.availabilityToMillis ? 'Selected time range has no available data' : (this.numberOfEventsInRange() == 0 ? 'Selected time range contains 0 events' : '');
                var message = beforeStartTime ? beforeStartTime : outOfRange;
                if (!message)
                    this.clickSearchButtonHelpMessage('Click the <span class="fa fa-search"></span> button to search this time range');
                else
                    this.clickSearchButtonHelpMessage('');
                return message
            }).extend({ notify: 'always' });

            this.setTimeToLatestAvailable();
        }

        public setTimeRange(startMillis: number, endMillis: number): void {
            var endDateTimeObject = this.getDateTimeStringFromMilliseconds(endMillis);
            this.endDate(endDateTimeObject.date);
            this.endTime(endDateTimeObject.time);
            var startDateTimeObject = this.getDateTimeStringFromMilliseconds(startMillis);
            this.startDate(startDateTimeObject.date);
            this.startTime(startDateTimeObject.time);
            this.endDateMilliseconds(this.getMillisecondsFromDateTimeString(this.endDateTime()));
            this.startDateMilliseconds(this.getMillisecondsFromDateTimeString(this.startDateTime()));
            this.parseDateTimeFromString();
        }

        public getAvailability(environmentId, setTimeToLatestAvailable = false): void {
            this.loadingAvailability(true);
            this.availabilityRequestFailed(false);
            this.availabilityDistribution = {};

            // ensure we only process the most recent request
            if (this.availabilityRequestHandle) {
                this.availabilityRequestHandle.abort();
                this.availabilityRequestHandle = null;
                this.telemetryClient.logUserAction('getAvailabilityCallAbandoned');
            }
            this.telemetryClient.logUserAction('getAvailabilityCallStart', { environmentId: environmentId });
            this.availabilityCallStartMs = (new Date()).valueOf();
            Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken().then((token) => {
            this.availabilityRequestHandle = $.ajax({
                url: 'https://' + this.queryEndpoint + '/environments/' + environmentId + '/availability',
                type: 'GET',
                contentType: 'application/json',
                beforeSend: function (xhr) { xhr.setRequestHeader('version', '20150504'); xhr.setRequestHeader('Authorization', JSON.stringify(['Bearer ' + token])) },
                success: data => {
                    if (data) {
                        if (data.distribution) {
                            var fromMillisRounded = Math.floor((new Date(data.fromTo.from)).valueOf() / (1000 * 60 * 60)) * 1000 * 60 * 60;
                            var toMillisRounded = Math.floor((new Date(data.fromTo.to)).valueOf() / (1000 * 60 * 60)) * 1000 * 60 * 60;
                            this.availabilityFromMillis = fromMillisRounded;
                            this.availabilityToMillis = toMillisRounded;

                            this.availabilityDistribution = Object.keys(data.distribution).reduce((prev, curr) => {
                                prev[(new Date(curr)).valueOf()] = data.distribution[curr];
                                return prev;
                            }, {});

                            for (var i = fromMillisRounded; i <= toMillisRounded; i += 1000 * 60 * 60) {
                                if (!this.availabilityDistribution.hasOwnProperty(i.toString()))
                                    this.availabilityDistribution[i] = 0;
                            }
                        }
                        var to = new Date(data.fromTo.to);
                        this.latestAvailableTimeInMilliseconds = to.valueOf();
                        var from = new Date(data.fromTo.from);
                        this.earliestAvailableTimeInMilliseconds = from.valueOf();
                        if (setTimeToLatestAvailable) {
                            this.setTimeToLatestAvailable();
                        }
                        this.endDateMilliseconds.valueHasMutated(); // triggers compute of potential error conditions
                    }
                    this.availabilityRequestHandle = null;
                    this.telemetryClient.logUserAction('getAvailabilityCallComplete', { duration: (new Date()).valueOf() - this.availabilityCallStartMs });
                    this.loadingAvailability(false);
                    
                    // side effect, get metadata when availability call completes
                    this.getMetadataTrigger.valueHasMutated();
                },
                error: (xhr, text_status) => {
                    if (text_status != 'abort') {
                        this.telemetryClient.logUserAction('getAvailabilityCallFailed');
                        this.loadingAvailability(false);
                        this.availabilityRequestFailed(true);
                    }
                }
            });
            });
        }

        public setTimeToLatestAvailable = () => {
            this.setTimeRange(this.latestAvailableTimeInMilliseconds - 60 * 1000 * 60, this.latestAvailableTimeInMilliseconds);
        }

        private parseDateTimeFromString(): void {
            this.startDateMilliseconds(this.getMillisecondsFromDateTimeString(this.startDateTime()));
            this.endDateMilliseconds(this.getMillisecondsFromDateTimeString(this.endDateTime()));
        }

        private getMillisecondsFromDateTimeString(dateTimeString: string): number {
            var splitDateTime = dateTimeString.split(' ');
            var splitDate = <any>splitDateTime[0].split('/');
            var splitTime = <any>splitDateTime[1].split(':');
            return Date.UTC(splitDate[2], splitDate[0] - 1, splitDate[1], splitTime[0], splitTime[1]).valueOf();
        }

        private getDateTimeStringFromMilliseconds(milliseconds: number): any {
            var date = new Date(milliseconds);
            var day = <any>date.getUTCDate();
            day = day < 10 ? '0' + day : day;
            var month = <any>date.getUTCMonth() + 1;
            month = month < 10 ? '0' + month : month;
            var year = date.getUTCFullYear();
            var hours = <any>date.getUTCHours();
            hours = hours < 10 ? '0' + hours : hours;
            var minutes = <any>date.getUTCMinutes();
            minutes = minutes < 10 ? '0' + minutes : minutes;

            return { date: month + '/' + day + '/' + year, time: hours + ':' + minutes };
        }
    }
}