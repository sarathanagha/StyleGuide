/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class RdxContext {
        public predicate: Predicate;
        public heatmap: Heatmap;
        public timePicker: TimePicker;
        public metadataExplorer: MetadataExplorer;
        public grid: Grid;
        public telemetryClient: RdxTelemetryClient;
        public targetBuckets: number = 60;
        public settingsPanelOpen: KnockoutObservable<boolean> = ko.observable(true);
        public timeInteger: KnockoutObservable<number> = ko.observable(1);
        public timeDimension: KnockoutObservable<string> = ko.observable('Minute');
        public timeDimensionOptions: KnockoutObservableArray<string> = ko.observableArray(['Minutes', 'Hours', 'Days']);
        public dimension: KnockoutObservable<string> = ko.observable('EventSourceName');
        public dimensionOptions: KnockoutObservableArray<string> = ko.observableArray(['EventSourceName']);
        public aggregateOptions: KnockoutObservableArray<string> = ko.observableArray(["Count", "Min", "Max", "Sum", "Avg"]);
        public aggregatePropertyName: KnockoutObservable<string> = ko.observable("Event Count");
        public propertyOptions: KnockoutObservableArray<string> = ko.observableArray(['Event Count']);
        public setTimeDimensionTrigger: KnockoutComputed<boolean>;
        public setTimeRangeBucketTrigger: KnockoutComputed<boolean>;
        public environments: KnockoutObservableArray<Models.Environment> = ko.observableArray([]);
        public environmentId: KnockoutObservable<string> = ko.observable('');
        public environmentName: KnockoutObservable<string> = ko.observable('');
        private setTimeframeByAvailability = false;
        public timeDimensionAlert: KnockoutObservable<string> = ko.observable('');
        public errorMessage: KnockoutObservable<string> = ko.observable('');
        public errorToast: KnockoutObservable<string> = ko.observable('');
        public errorToastVisible: KnockoutObservable<boolean> = ko.observable(false);
        public feedbackFormVisible: KnockoutObservable<boolean> = ko.observable(false);
        public feedback: KnockoutObservable<string> = ko.observable('');
        public timePickerVisible: KnockoutObservable<boolean> = ko.observable(false);
        public metadataExplorerVisible: KnockoutObservable<boolean> = ko.observable(false);
        public environmentsVisible: KnockoutObservable<boolean> = ko.observable(false);
        public legendVisible: KnockoutObservable<boolean> = ko.observable(true);
        public queryEndpoint: string;
        public clusteringAvailable: KnockoutObservable<boolean> = ko.observable(false);
        public shouldClusterEventSourceHits: KnockoutObservable<boolean> = ko.observable(false);
        public clusterBreadcrumbs: KnockoutObservableArray<Models.ClusterBreadcrumb> = ko.observableArray([]);
        public barChartAvailable: KnockoutObservable<boolean> = ko.observable(true);
        public hasMinMaxProperty: KnockoutObservable<boolean> = ko.observable(false);
        public showingHelpContent: KnockoutObservable<boolean> = ko.observable(true);
        public feedbackSubmitted: KnockoutObservable<boolean> = ko.observable(false);

        constructor() {
            this.queryEndpoint = this.isTestEndpoint() ? 'svc.crystal-dev.windows-int.net' : 'svc.crystal.windows.net';
            this.clusteringAvailable(this.isTestEndpoint());
            this.telemetryClient = new RdxTelemetryClient(this.queryEndpoint);
            this.predicate = new Predicate();
            this.predicate.predicateText('*.*');
            this.heatmap = new Heatmap(this.telemetryClient, this.queryEndpoint);
            this.timePicker = new TimePicker(this.telemetryClient, this.queryEndpoint);
            this.metadataExplorer = new MetadataExplorer(this.timePicker, this.telemetryClient, this.queryEndpoint);
            this.grid = new Grid(this.telemetryClient, this.queryEndpoint);

            // handles getting availability and metadata when envId changes
            this.environmentId.subscribe(id => {
                if (id) {
                    this.metadataExplorer.environmentId = id;
                    this.timePicker.getMetadataTrigger.valueHasMutated(); // triggers get metadata call
                    this.timePicker.getAvailability(id, this.setTimeframeByAvailability); // if settimeframebyavailability, this will trigger another metadata call
                    this.setTimeframeByAvailability = false;
                    this.telemetryClient.logUserAction('environmentSelected', { environmentId: id, environmentName: this.environments().filter(env => { return env.id() == id })[0].displayName() });
                }
            });

            // handles populating dropdowns when metadata is fetched
            this.metadataExplorer.loadingMetadata.subscribe((isLoading) => { if (!isLoading) this.populatePropertyAndMeasureOptions(); });

            // handles setting time buckets based on time picker value
            this.setTimeRangeBucketTrigger = ko.computed(() => {
                this.setTimeDimensionFromTimeRange(this.timePicker.startDateMilliseconds(), this.timePicker.endDateMilliseconds());
                return true;
            });

            // handles back/forward actions for state management
            window.onpopstate = (event) => {
                this.telemetryClient.logUserAction('backButtonPressed');
                if (history.state) {
                    if (this.parseStateObject(history.state))
                        this.streamEventSourceHits(true);
                }
            }

            // set initial state and get environment
            this.setInitialStateFromUrl();
            this.getEnvironments();
            this.telemetryClient.logUserAction('userAgent', { userAgent: navigator.userAgent });
            this.telemetryClient.logNumberOfTenantsAndIfContainsMsftTenant();

            $(window).on('resize.resizeComponents', () => { this.heatmap.triggerRerender(); this.timePicker.loadingAvailability.valueHasMutated(); }); // TODO: dispose, and handle slide out of left panel
        }

        private populatePropertyAndMeasureOptions(): void {
            var propertiesObject = {};
            var dimensionsObject = {};
            this.metadataExplorer.metadata().forEach((md) => {
                md.properties().forEach((prop) => {
                    if ((prop.type().indexOf('Int') != -1) || prop.type() == 'Double')
                        propertiesObject[prop.propertyName()] = true;
                    if (prop.type() == 'String')
                        dimensionsObject[prop.propertyName()] = true;
                });
            });
            if (Object.keys(propertiesObject).length == 0 && this.aggregatePropertyName())
                propertiesObject[this.aggregatePropertyName()] = true;
            if (Object.keys(dimensionsObject).length == 0 && this.dimension())
                dimensionsObject[this.dimension()] = true;

            var propertyOptions = Object.keys(propertiesObject).sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            var dimensionOptions = Object.keys(dimensionsObject).sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            if (propertyOptions.indexOf('Event Count') == -1)
                propertyOptions.unshift('Event Count');
            if (dimensionOptions.indexOf('EventSourceName') == -1)
                dimensionOptions.unshift('EventSourceName');
            this.propertyOptions(propertyOptions);
            this.dimensionOptions(dimensionOptions);
            if (!this.dimension() || !dimensionsObject.hasOwnProperty(this.dimension())) {
                this.dimension("EventSourceName");
            }
            if (!this.aggregatePropertyName() || !propertiesObject.hasOwnProperty(this.aggregatePropertyName())) {
                this.aggregatePropertyName("Event Count");
            }
        }

        public addFilter = (eventSourceName: string, propertyName: string) => {
            this.predicate.predicateText(eventSourceName + '.' + (propertyName ? propertyName : '*'));
        }

        public streamEventsFromHeatmap = () => {
            this.telemetryClient.logUserAction('exploreFromHeatmap', { eventsSelected: this.heatmap.eventsSelected() });
            this.grid.streamEvents(this.heatmap.snapshotHandle, this.heatmap.predicateJS, this.heatmap.selectedCells, this.heatmap.searchSpan, this.heatmap.take(), this.heatmap.dimension, this.heatmap.timeDimensionAsString, this.environmentId());
        }

        public streamEventsFromChart = () => {
            var eventType = this.heatmap.selectedVisualization() == 'line' ? 'exploreFromLineChart' : 'exploreFromBarChart';
            this.telemetryClient.logUserAction(eventType, { eventsSelected: this.heatmap.eventsSelected() });
            this.grid.streamEvents(this.heatmap.snapshotHandle, this.heatmap.predicateJS, this.heatmap.selectedCells, this.heatmap.searchSpan, this.heatmap.take(), this.heatmap.dimension, this.heatmap.timeDimensionAsString, this.environmentId());
        }

        public streamEventSourceHits = (dontPushState: boolean = false) => {
            this.showingHelpContent(false);
            this.environmentsVisible(false);

            // toast user and set time dimension if its too small
            if (this.numberOfTimeIntervals() > 100) {
                var originalTimeDimension = this.timeInteger() + ' ' + (this.timeInteger() == 1 ? this.timeDimension().substring(0, this.timeDimension().length - 1) : this.timeDimension());
                this.setTimeDimensionFromTimeRange(this.timePicker.startDateMilliseconds(), this.timePicker.endDateMilliseconds(), 100);
                var newTimeDimension = this.timeInteger() + ' ' + (this.timeInteger() == 1 ? this.timeDimension().substring(0, this.timeDimension().length - 1) : this.timeDimension());
                if (originalTimeDimension != newTimeDimension) {
                    this.timeDimensionAlert('Your time dimension of ' + originalTimeDimension + ' was too small. <br/>  We\'ve changed it to ' + newTimeDimension + ' for you &#128521;');
                    setTimeout(() => { this.timeDimensionAlert(''); }, 5000);
                }
            }

            this.telemetryClient.logUserAction('streamEventSourceHits', { predicate: this.predicate.predicateText(), timeInteger: this.timeInteger(), timeDimension: this.timeDimension(), dimension: this.dimension(), measurePropertyName: this.aggregatePropertyName(), timeSpanInMinutes: (this.timePicker.endDateMilliseconds() - this.timePicker.startDateMilliseconds()) / 60000 });

            // init bar chart and blow away grid
            this.grid.nukeContent();
            var predicateJS = this.predicate.toJS();
            predicateJS['aggregationClusteringEnabled'] = this.shouldClusterEventSourceHits();
            if (this.aggregatePropertyName() == 'Event Count') {
                this.hasMinMaxProperty(false);
                this.barChartAvailable(true);
            }
            else {
                if (this.heatmap.selectedVisualization() == 'bar')
                    this.heatmap.selectedVisualization('line');
                predicateJS['aggregationFunctions'] = ['min', 'max', 'avg']
                predicateJS['aggregationProperty'] = { propertyType: 'string', eventSourceName: '*', propertyName: this.aggregatePropertyName() };
                this.hasMinMaxProperty(true);
                this.barChartAvailable(false);
            }
            this.heatmap.streamEventSourceHits(predicateJS, this.timePicker, this.dimension(), this.timeDimension(), this.timeInteger(), this.environmentId(), this.aggregatePropertyName());
            if (!dontPushState)
                this.serializeStateToUrl();
        }

        private numberOfTimeIntervals = () => {
            var timeDimensionInMillis;
            switch (this.timeDimension()) {
                case 'Minutes':
                    timeDimensionInMillis = this.timeInteger() * 1000 * 60;
                    break;
                case 'Hours':
                    timeDimensionInMillis = this.timeInteger() * 1000 * 60 * 60;
                    break;
                case 'Days':
                    timeDimensionInMillis = this.timeInteger() * 1000 * 60 * 60 * 24;
                    break;
            }
            var startMillisRoundedDown = Math.floor(this.timePicker.startDateMilliseconds() / (timeDimensionInMillis)) * (timeDimensionInMillis);
            var endMillisRoundedDown = Math.ceil(this.timePicker.endDateMilliseconds() / (timeDimensionInMillis)) * (timeDimensionInMillis);
            return (endMillisRoundedDown - startMillisRoundedDown) / (timeDimensionInMillis);
        }

        public setTimeDimensionFromTimeRange = (zoomMin, zoomMax, targetBuckets = 0) => {
            var timeRangeInMillis = zoomMax - zoomMin;
            var numberOfDays = timeRangeInMillis / 86400000;
            this.targetBuckets = targetBuckets == 0 ? Math.round($('.visualizationComponentWrapper').width() / 26) : targetBuckets;
            if (numberOfDays > 50) {
                this.timeInteger(Math.ceil(numberOfDays/50));
                this.timeDimension('Days');
            }
            else if (numberOfDays > 1.5) {
                var numberOfHours = numberOfDays * 24;
                this.timeInteger(Math.ceil(numberOfHours / this.targetBuckets));
                this.timeDimension('Hours');
            }
            else {
                var numberOfMinutes = numberOfDays * 24 * 60;
                this.timeInteger(Math.ceil(numberOfMinutes / this.targetBuckets));
                this.timeDimension('Minutes');
            }
        }

        // displays the toast message in the upper right hand corner of the UI
        public toastUser = (message: string) => {
            this.errorToast(message);
            var currentVisibilityValue = this.errorToastVisible();
            this.errorToastVisible(true);
            if (currentVisibilityValue)
                this.errorToastVisible.valueHasMutated();
        }

        public zoomFromHeatmap = () => {
            this.telemetryClient.logUserAction('zoomFromHeatmap');
            var seriesNames = {};
            this.heatmap.selectedCells.forEach(cell => {
                seriesNames[this.heatmap.rows[cell.rowIdx].eventSourceName] = true;
            });
            if (this.predicate.predicateText() == '*.*')
                this.predicate.predicateText('');
            var prependedPredicateText = this.predicate.predicateText() ? this.predicate.predicateText() + ' AND ' : '';
            this.predicate.predicateText(prependedPredicateText + '*.' + this.heatmap.dimension + ' LIKE_ANY ' + Object.keys(seriesNames).join(' '));
            this.zoom(this.heatmap.selectedCells);
        }

        private zoom = (selectedCells) => {
            var zoomMin = Infinity;
            var zoomMax = 0;
            selectedCells.forEach((cell) => {
                var columnMillis = this.heatmap.columns[cell.colIdx].dateTime.valueOf();
                if (zoomMin > columnMillis)
                    zoomMin = columnMillis;
                if (zoomMax < columnMillis)
                    zoomMax = columnMillis;
            });
            if (zoomMin == zoomMax)
                zoomMin -= 60 * 1000;
            this.timePicker.setTimeRange(zoomMin, zoomMax);
            this.setTimeDimensionFromTimeRange(zoomMin, zoomMax);
            this.timePicker.loadingAvailability.valueHasMutated();
            this.streamEventSourceHits();
        }

        public zoomFromChart = () => {
            var eventType = this.heatmap.selectedVisualization() == 'line' ? 'zoomFromLineChart' : 'zoomFromBarChart';
            this.telemetryClient.logUserAction(eventType);
            this.zoom(this.heatmap.selectedCells);
        }

        public andValue = (value: string) => {
            var text = this.predicate.predicateText();
            text += " AND " + value;
            this.predicate.predicateText(text);
        }

        public submitFeedback = () => {
            var feedback = this.feedback();
            this.telemetryClient.logUserAction('feedback', { feedback: feedback, url: window.location.search });
            this.feedback('');
            this.feedbackSubmitted(true);
            this.feedbackSubmitted.valueHasMutated();
        }

        public getEnvironments = () => {
            var environmentIdAlreadyExists = this.environmentId() != '';
            Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken().then((token) => {
                $.ajax({
                    url: 'https://' + this.queryEndpoint + '/environments',
                    type: 'GET',
                    contentType: 'application/json',
                    beforeSend: function (xhr) { xhr.setRequestHeader('version', '20150504'); xhr.setRequestHeader('Authorization', JSON.stringify(['Bearer ' + token])); },
                    success: data => {
                        this.environments([]);
                        data.environments.forEach(env => {
                            var newEnv = new Models.Environment();
                            newEnv.displayName(env.displayName);
                            newEnv.id(env.environmentId);
                            this.environments.push(newEnv);
                        });
                        if (!environmentIdAlreadyExists) {
                            this.setTimeframeByAvailability = true;
                            this.environmentId(this.environments()[0].id());
                            this.environmentName(this.environments()[0].displayName());
                        }
                        this.environmentName(this.environments().reduce((prev, curr) => {
                            if (!prev)
                                var prev = curr.id() == this.environmentId() ? curr.displayName() : '';
                            return prev;
                        }, ''));
                    }
                }).always(() => {
                    if (!this.environments().length)
                        this.errorMessage("Sorry, something went wrong, or you don't have access to any environments :'(");
                });
            });
        }

        public resultsPanelGrow = () => {
            $('.resultsPanel').height('calc(100% - ' + 115 + 'px)');
        }

        public resultsPanelShrink = () => {
            $('.resultsPanel').height('calc(100% - ' + $('.rdxTopPanel').height() + 'px)');
        }

        private isTestEndpoint = () => {
            return location.search.split('endpoint=').splice(1).join('').split('&')[0] == 'test';
        }

        private serializeStateToUrl = () => {
            var stateObject = {
                predicate: encodeURIComponent(this.predicate.predicateText()),
                from: this.timePicker.startDateMilliseconds(),
                to: this.timePicker.endDateMilliseconds(),
                timeBucketSize: this.timeInteger(),
                timeBucketUnit: this.timeDimension(),
                dimension: this.dimension(),
                measureProperty: this.aggregatePropertyName(),
                environmentId: this.environmentId(),
                environmentName: this.environmentName(),
                endpoint: this.isTestEndpoint() ? 'test' : '',
                clusterResults: this.shouldClusterEventSourceHits() ? 'true' : ''
            }
            history.pushState(
                stateObject, '',
                '?rdx/?predicate=' + stateObject.predicate +
                '&from=' + stateObject.from +
                '&to=' + stateObject.to +
                '&timeBucketSize=' + stateObject.timeBucketSize +
                '&timeBucketUnit=' + stateObject.timeBucketUnit +
                '&dimension=' + stateObject.dimension +
                '&measureProperty=' + stateObject.measureProperty +
                '&environmentId=' + stateObject.environmentId +
                '&environmentName=' + stateObject.environmentName +
                (stateObject.endpoint ? '&endpoint=' + stateObject.endpoint : '') +
                (stateObject.clusterResults ? '&clusterResults=' + stateObject.clusterResults : ''));
        }

        private setInitialStateFromUrl = () => {
            var params = {};
            if (location.search) {
                var parts = location.search.substring(1).split('&');
                for (var i = 0; i < parts.length; i++) {
                    var nv = parts[i].split('=');
                    if (!nv[0]) continue;
                    params[nv[0]] = nv[1] || true;
                }
            }
            if (this.parseStateObject(params))
                this.streamEventSourceHits();
            else
                this.environmentsVisible(true);
        }

        // TODO: handle error conditions
        private parseStateObject(stateObject) {
            if (stateObject.predicate)
                this.predicate.predicateText(decodeURIComponent(stateObject.predicate));
            // because of goofy routing /?rdx/?predicate
            if (stateObject.hasOwnProperty('rdx/?predicate'))
                this.predicate.predicateText(decodeURIComponent(stateObject['rdx/?predicate']));
            if (stateObject.dimension) {
                this.dimension(stateObject.dimension);
                if (this.dimensionOptions().indexOf(this.dimension()) == -1) {
                    this.dimensionOptions.push(this.dimension());
                }
            }
            if (stateObject.measureProperty) {
                this.aggregatePropertyName(decodeURIComponent(stateObject.measureProperty));
                if (this.propertyOptions().indexOf(this.aggregatePropertyName()) == -1) {
                    this.propertyOptions.push(this.aggregatePropertyName());
                }
            }
            if (stateObject.environmentName && stateObject.environmentId) {
                var environment = new Models.Environment();
                var environmentName = decodeURIComponent(stateObject.environmentName);
                environment.displayName(environmentName);
                environment.id(stateObject.environmentId);
                var environments = this.environments();
                if (!environments.filter(env => { return env.id() == environment.id() && env.displayName() == environment.displayName() }).length) {
                    environments.push(environment)
                    this.environments(environments);
                }
                this.environmentName(environmentName);
                this.environmentId(stateObject.environmentId);
            }
            if (stateObject.from && stateObject.to)
                this.timePicker.setTimeRange(parseInt(stateObject.from), parseInt(stateObject.to))
            if (stateObject.timeBucketSize && stateObject.timeBucketUnit) {
                this.timeInteger(parseInt(stateObject.timeBucketSize));
                this.timeDimension(stateObject.timeBucketUnit)
            }
            if (stateObject.clusterResults)
                this.shouldClusterEventSourceHits(stateObject.clusterResults)
            else
                this.shouldClusterEventSourceHits(false);
            if (stateObject.environmentId && stateObject.from && stateObject.to && (stateObject.predicate || stateObject.hasOwnProperty('rdx/?predicate')))
                return true;
            return false;
        }
    }
}