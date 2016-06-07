/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class Heatmap {
        public telemetryClient: RdxTelemetryClient;
        public queryEndpoint: string;
        public rerenderTrigger: KnockoutObservable<boolean> = ko.observable(false);
        public rows: Array<HeatmapRow> = [];
        public columns: Array<HeatmapColumn> = [];
        public selectedCells: Array<HeatmapCell> = [];
        public progressMessage: KnockoutObservable<string> = ko.observable('');
        public progressPercentage: KnockoutObservable<number> = ko.observable(0);
        public isColdSpan: KnockoutObservable<boolean> = ko.observable(false);
        public eventsSelected: KnockoutComputed<number>;
        public eventsSelectedTrigger: KnockoutObservable<boolean> = ko.observable(false);
        public barChartEventsSelectedTrigger: KnockoutObservable<boolean> = ko.observable(false);
        public firstSelectedCell: HeatmapCell;
        public lastHoveredCell: HeatmapCell;
        public mouseIsDown: boolean = false;
        public eventSourceHitsWebsocket: WebSocket;
        public snapshotHandle: string;
        public predicateJS: Object;
        public searchSpan: Object;
        public take: KnockoutObservable<number> = ko.observable(10000);
        public dimension: string = '';
        public measure: string = '';
        public timeDimensionAsString: string = '';
        public selectedVisualization: KnockoutObservable<string> = ko.observable('line');
        public filter: KnockoutObservable<string> = ko.observable('').extend({ throttle: 200 });
        public orderByName: KnockoutObservable<boolean> = ko.observable(false);
        public noResults: KnockoutObservable<boolean> = ko.observable(false);
        public startStreamMs: number;
        public isFirstPacket: boolean = false;
        public minMeasure: number = 0;
        public maxMeasure: number = 0;

        constructor(telemetryClient: RdxTelemetryClient, queryEndpoint: string) {
            this.telemetryClient = telemetryClient;
            this.queryEndpoint = queryEndpoint;
            $(window).mouseup(() => { this.mouseIsDown = false; }); // TODO dispose

            // number of events selected in the heatmap.  recomputed by mutating eventsSelectedTrigger
            this.eventsSelected = ko.computed(() => {
                var trigger = this.eventsSelectedTrigger();
                return this.selectedCells.reduce(function (prev, curr) {
                    if (curr.hit)
                        prev += curr.hit.eventCount;
                    return prev;
                }, 0);
            });

            this.filter.subscribe((filter) => {
                this.filterRows(filter);
                this.setRelativeMeasureForHits();
                this.triggerRerender();
            });

        }

        // renders proper progress message after socket close
        private handleSocketClose(): void {
            this.isColdSpan(false);
            var totalEventsHit = this.rows.reduce(function (prev, curr) {
                prev += curr.cells.reduce(function (prev2, curr2) {
                    if (curr2.hit)
                        prev2 += curr2.hit.eventCount;
                    return prev2;
                }, 0);
                return prev;
            }, 0);
            var streamingDuration = (new Date()).valueOf() - this.startStreamMs;
            this.progressMessage('Streaming complete. ' + totalEventsHit.toLocaleString('en') + ' total events hit in ' + streamingDuration / 1000 + ' seconds.');
            if (totalEventsHit == 0)
                this.noResults(true);
            this.progressPercentage(100);
            this.telemetryClient.logUserAction('streamEventSourceHitsComplete', { duration: streamingDuration, totalEvents: totalEventsHit });
        }

        public filterRows = (filter) => {
            var filterRegEx = new RegExp(filter, 'i');
            this.rows.forEach((row) => {
                if (filterRegEx.test(row.eventSourceName)) {
                    row.isInFilter = true;
                }
                else {
                    row.isInFilter = false;
                }
            });
        }

        // streams heatmap to client
        public streamEventSourceHits(predicateJS: Object, timePicker: Models.TimePicker, dimension: string, timeDimension: string, timeInteger: number, environmentId: string, measure: string): void {
            this.predicateJS = predicateJS;
            this.destroyWebSocket(this.eventSourceHitsWebsocket, true);
            var uri = 'wss://' + this.queryEndpoint + '/environments/' + environmentId + '/eventsourcehits';
            this.eventSourceHitsWebsocket = new WebSocket(uri, '20150504');
            this.dimension = dimension;
            this.measure = measure;

            this.noResults(false);
            // init heatmap with new columns
            this.columns = [];
            this.rows = [];
            this.selectedCells = [];
            this.triggerRerender();
            this.setEventsSelectedCount();
            this.progressMessage('Streaming results...');
            this.progressPercentage(1);

            this.eventSourceHitsWebsocket.onclose = e => {
            }

            this.eventSourceHitsWebsocket.onerror = e => {
                this.telemetryClient.logUserAction('streamEventSourceHitsError', { duration: (new Date()).valueOf() - this.startStreamMs });
                this.isFirstPacket = false;
            }

            // parses response to create heatmap object, triggers rerender
            this.eventSourceHitsWebsocket.onmessage = e => {

                // log this event
                if (this.isFirstPacket) {
                    this.telemetryClient.logUserAction('streamEventSourceHitsFirstPacket', { duration: (new Date()).valueOf() - this.startStreamMs });
                    this.isFirstPacket = false;
                }

                if (e.data) {
                    var message = JSON.parse(e.data);

                    if (message.isColdSpan) {
                        this.isColdSpan(true);
                    }

                    if (message.percentCompleted) {
                        this.progressPercentage(message.percentCompleted)
                        if (!this.isColdSpan()) {
                            this.progressMessage('Streaming results...');
                        }
                        else {
                            this.progressMessage('Streaming results from <span style="color:blue">cold span</span>...');
                        }
                    }

                    if (message.content) {
                        // percent completed
                        if (message.content.percentCompletedPerInterval) {
                            for (var idx in message.content.percentCompletedPerInterval) {
                                this.columns[idx].percentCompleted = message.content.percentCompletedPerInterval[idx];
                            }
                        }

                        var andNotExpressionResults = message.content.andNotExpressionResults;
                        for (var idx in andNotExpressionResults) {
                            if (andNotExpressionResults[idx]) {
                                this.rows = [];  // BLOWING AWAY ROWS EACH ANE RESULT.  THIS WILL BREAK MULTI EXPRESSION SEARCH

                                this.snapshotHandle = andNotExpressionResults[idx].snapshotHandle;
                                for (var eventSourceName in andNotExpressionResults[idx].eventSourceHits) {

                                    // same as row.any(eventSourceName == thisEventSourceName)
                                    var existingRow = this.rows.reduce(function (prev, curr) {
                                        if (!prev) {
                                            if (curr.eventSourceName == eventSourceName)
                                                return curr;
                                        }
                                        return prev;
                                    }, null);

                                    // if there is no row add cells
                                    if (!existingRow) {
                                        var heatmapRow = new Models.HeatmapRow(eventSourceName);
                                        for (var colIdx in this.columns) {
                                            var heatmapCell = new HeatmapCell();
                                            heatmapCell.id = this.rows.length + "_" + colIdx;
                                            heatmapRow.cells.push(heatmapCell);
                                        }
                                        this.rows.push(heatmapRow);
                                        existingRow = heatmapRow;
                                    }

                                    // add hits to cells
                                    for (var cellIdx in andNotExpressionResults[idx].eventSourceHits[eventSourceName]) {

                                        // same as hits.any(color == thisAndNotExpressionResultColor)
                                        var thisHit = existingRow.cells[cellIdx].hit;

                                        if (!thisHit) {
                                            var heatmapHit = new HeatmapHit();
                                            if (Object.keys(andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx]).length > 1) {
                                                for (var key in andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx]) {
                                                    if (key != 'count') {
                                                        if(key == 'min')
                                                            heatmapHit.minMeasure = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx][key];
                                                        else if (key == 'max')
                                                            heatmapHit.maxMeasure = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx][key];
                                                        else
                                                            heatmapHit.measure = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx][key];
                                                    }
                                                }
                                            } else {
                                                heatmapHit.measure = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx].count;
                                                heatmapHit.minMeasure = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx].count;
                                                heatmapHit.maxMeasure = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx].count;
                                            }
                                            heatmapHit.eventCount = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx].count;
                                            existingRow.cells[cellIdx].hit = heatmapHit;
                                        } else {
                                            var previousCount = thisHit.eventCount;
                                            if (Object.keys(andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx]).length > 1) {
                                                for (var key in andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx]) {
                                                    if (key != 'count') {
                                                        thisHit.measure = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx][key];
                                                    }
                                                }
                                            } else {
                                                thisHit.measure = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx].count;
                                            }
                                            thisHit.eventCount = andNotExpressionResults[idx].eventSourceHits[eventSourceName][cellIdx].count;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // attach indices for multiselect
                    this.attachRowIdxAndColIdxToCells();
                    this.filterRows(this.filter());
                    this.setRelativeMeasureForHits();
                    this.triggerRerender();
                    this.setEventsSelectedCount();
                    if (message.percentCompleted ? message.percentCompleted == 100 : false) {
                        this.destroyWebSocket(this.eventSourceHitsWebsocket, false);
                        this.handleSocketClose();
                    }
                }
                else {
                    this.progressPercentage(100);
                    this.handleSocketClose();
                    this.progressMessage('Streaming events failed :(  Please try again later');
                    this.destroyWebSocket(this.eventSourceHitsWebsocket, false);
                }
            }

            // sends serialized and not expressions to server side
            this.eventSourceHitsWebsocket.onopen = () => {

                // create columns based on time bucketing
                var timeDimensionInMillis = 0;
                var timeDimensionAsString = '';
                switch (timeDimension) {
                    case 'Minutes':
                        timeDimensionInMillis = timeInteger * 1000 * 60;
                        timeDimensionAsString = timeInteger + 'm';
                        break;
                    case 'Hours':
                        timeDimensionInMillis = timeInteger * 1000 * 60 * 60;
                        timeDimensionAsString = timeInteger + 'h';
                        break;
                    case 'Days':
                        timeDimensionInMillis = timeInteger * 1000 * 60 * 60 * 24;
                        timeDimensionAsString = timeInteger + 'd';
                        break;
                }
                this.timeDimensionAsString = timeDimensionAsString;
                var startMillisRoundedDown = Math.floor(timePicker.startDateMilliseconds() / (timeDimensionInMillis)) * (timeDimensionInMillis);
                var endMillisRoundedDown = Math.ceil(timePicker.endDateMilliseconds() / (timeDimensionInMillis)) * (timeDimensionInMillis);
                var numberOfTimeBuckets = (endMillisRoundedDown - startMillisRoundedDown) / (timeDimensionInMillis);
                var currentDayMillis = timePicker.startDateMilliseconds();
                for (var j = 0; j < numberOfTimeBuckets; j++) {
                    var column = new HeatmapColumn(timePicker.startDateMilliseconds() + (j * timeDimensionInMillis));
                    if (j == 0 || (column.dateTime.valueOf() - currentDayMillis >= 24 * 60 * 60 * 1000) || j == numberOfTimeBuckets - 1) {
                        column.prettyPrintDate = true;
                        currentDayMillis = column.dateTime.valueOf();
                    }
                    this.columns.push(column);
                }

                // log this event
                this.startStreamMs = (new Date()).valueOf();
                this.telemetryClient.logUserAction('startStreamEventSourceHits');
                this.isFirstPacket = true;

                var andNotExpressionsArray = [];
                andNotExpressionsArray.push(this.predicateJS);
                Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken().then((token) => {
                    var messageObject = {};
                    messageObject['headers'] = { 'Authorization': JSON.stringify(['Bearer ' + token]) };
                    this.searchSpan = { from: new Date(timePicker.startDateMilliseconds()).toISOString(), to: new Date(timePicker.endDateMilliseconds()).toISOString() };
                    var dimensionObject = (this.dimension == '' || this.dimension == 'EventSourceName') ? null : { propertyType: 'string', eventSourceName: '*', propertyName: dimension };
                    messageObject['content'] = { andNotExpressions: andNotExpressionsArray, intervalSize: timeDimensionAsString, searchSpan: this.searchSpan, dimension: dimensionObject };
                    this.eventSourceHitsWebsocket.send(JSON.stringify(messageObject));
                });
            }
        }

        private destroyWebSocket(webSocket: WebSocket, shouldCancel: boolean): void {
            if (webSocket != null) {
                webSocket.onerror = null;
                webSocket.onmessage = null;
                if (webSocket.readyState === webSocket.OPEN && shouldCancel) {
                    webSocket.send('{ "command" : "cancel" }');
                }
                webSocket.close();
                webSocket.onclose = null;
                webSocket = null;
            }
        }

        public orderBy(orderingType: Number) {

            // average ordering
            if (orderingType == 0) {
                var indexAndMeasures = [];
                this.rows.forEach((row, rowIndex) => {
                    var rowAverage = row.cells.reduce((prev, curr) => {
                        if (curr.hit) {
                            prev.hits++;
                            prev.totalRelativeMeasure += curr.hit.relativeMeasure;
                            return prev;
                        }
                        return prev;
                    }, { hits: 0, totalRelativeMeasure: 0 });
                    indexAndMeasures.push({ idx: rowIndex, avg: rowAverage.totalRelativeMeasure / rowAverage.hits });
                });

                var compare = (a, b) => {
                    if (a.avg < b.avg)
                        return 1;
                    return -1;
                };

                indexAndMeasures.sort(compare);
                var orderedRows = [];
                indexAndMeasures.forEach((idxAndMeasure, idx) => {
                    var currentRow = this.rows[idxAndMeasure.idx];
                    currentRow.cells.forEach(cell => { cell.rowIdx = idx; });
                    orderedRows.push(currentRow);
                });
                this.rows = orderedRows;
            }
            // alphabetical ordering
            else if (orderingType = 1) {
                this.rows.sort((a, b) => { return a.eventSourceName < b.eventSourceName ? -1 : 1 });
                this.rows.forEach((currentRow, idx) => {
                    currentRow.cells.forEach(cell => { cell.rowIdx = idx; });
                });
            }
        }

        // attaches indices for multiselect
        private attachRowIdxAndColIdxToCells(): void {
            var rowIdx = 0;
            var colIdx = 0;
            this.rows.forEach(function (row) {
                row.cells.forEach(function (cell) {
                    cell.rowIdx = rowIdx;
                    cell.colIdx = colIdx;
                    cell.eventSourceName = row.eventSourceName;
                    colIdx++;
                });
                rowIdx++;
                colIdx = 0;
            });
        }

        private setRelativeMeasureForHits(): void {
            var maxMeasureValue = -1 * Infinity;
            var minMeasureValue = Infinity;
            var totalMeasure = 0;
            var totalHits = 0;
            var allMeasures = [];

            // first pass to get the mean
            this.rows.forEach(function (row) {
                if (row.isInFilter) {
                    row.cells.forEach(function (cell) {
                        if (cell.hit) {
                            if (cell.hit.measure > maxMeasureValue)
                                maxMeasureValue = cell.hit.measure;
                            if (cell.hit.measure < minMeasureValue)
                                minMeasureValue = cell.hit.measure;
                            totalMeasure += cell.hit.measure;
                            totalHits++;
                            allMeasures.push(cell.hit.measure);
                        }
                    });
                }
            });
            var mean = totalMeasure / totalHits;

            //// second pass to get standard deviation
            //var sumOfSquares = 0;
            //allMeasures.forEach(measure => {
            //    var diff = measure - mean;
            //    sumOfSquares += diff * diff;
            //})
            //sumOfSquares /= allMeasures.length;
            //var stdDeviation = Math.sqrt(sumOfSquares);

            this.rows.forEach((row) => {
                row.cells.forEach((cell) => {
                    if (cell.hit) {
                        // color distribution based on std deviation, TODO: revisit
                        //var relativeMeasure = this.cdf(cell.hit.measure, mean, stdDeviation * stdDeviation);
                        //cell.hit.relativeMeasure = maxMeasureValue == minMeasureValue ? 1 : relativeMeasure;

                        // conventional with linear dist of colors
                        cell.hit.relativeMeasure = maxMeasureValue == minMeasureValue ? 1 : ((cell.hit.measure - minMeasureValue) / (maxMeasureValue - minMeasureValue));
                    }
                });
            });
            this.minMeasure = minMeasureValue;
            this.maxMeasure = maxMeasureValue;
        }

        private cdf(x, mean, variance) {
            return 0.5 * (1 + this.erf((x - mean) / (Math.sqrt(2 * variance))));
        }

        private erf(x) {
            // save the sign of x
            var sign = (x >= 0) ? 1 : -1;
            x = Math.abs(x);

            // constants
            var a1 = 0.254829592;
            var a2 = -0.284496736;
            var a3 = 1.421413741;
            var a4 = -1.453152027;
            var a5 = 1.061405429;
            var p = 0.3275911;

            // A&S formula 7.1.26
            var t = 1.0 / (1.0 + p * x);
            var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
            return sign * y; // erf(-x) = -erf(x);
        }

        // to determine width of y axis in heatmap
        public rowLabelWidth(): number {
            return 340;
        }

        public handleCellMousedown = function (rowIdx, colIdx, event) {
            // clear all current selections if ctrl is not pressed
            var cell = this.rows[rowIdx].cells[colIdx];
            if (!event.ctrlKey) {
                this.unselectAllCells();
            }
            cell.selected = !cell.selected;
            if (cell.selected) {
                this.selectedCells.push(cell);
                $("#" + cell.overlayId()).show();
            } else {
                var index = this.selectedCells.indexOf(cell);
                if (index != -1)
                    this.selectedCells.splice(index, 1);
                $("#" + cell.overlayId()).hide();
            }
            this.firstSelectedCell = cell;
            this.lastHoveredCell = cell;
            this.setEventsSelectedCount();
        }

        public handleCellMouseover = function (rowIdx, colIdx) {
            if (this.mouseIsDown) {
                var cell = this.rows[rowIdx].cells[colIdx];
                this.unhighlightSpanBetweenLastHoveredAndFirstSelected();
                this.multiSelect(cell);
                this.lastHoveredCell = cell;
                this.setEventsSelectedCount();
            }
        }

        public handleRowClick = function (rowIdx, event) {
            if (!event.ctrlKey) {
                this.unselectAllCells();
            }
            this.rows[rowIdx].cells.forEach(cell => {
                cell.selected = true;
                this.selectedCells.push(cell);
                $("#" + cell.overlayId()).show();
            });
            this.setEventsSelectedCount();
        };

        public handleColumnClick = function (colIdx, event) {
            if (!event.ctrlKey) {
                this.unselectAllCells();
            }
            this.rows.forEach(row => {
                if (row.isInFilter) {
                    var cell = row.cells[colIdx];
                    cell.selected = true;
                    this.selectedCells.push(cell);
                    $("#" + cell.overlayId()).show();
                }
            });
            this.setEventsSelectedCount();
        };

        public unselectAllCells = function () {
            this.selectedCells.forEach(cell => {
                cell.selected = false;
                $("#" + cell.overlayId()).hide();
            });
            this.selectedCells = [];
            this.setEventsSelectedCount();
        };

        private multiSelect = function (lastSelectedCell) {
            var span = this.getSpanExtent(this.firstSelectedCell, lastSelectedCell);

            for (var i = span.minRow; i < span.maxRow + 1; i++) {
                for (var j = span.minCol; j < span.maxCol + 1; j++) {
                    if (this.rows[i].isInFilter && this.rows[i].hasActiveHits()) {
                        var cell = this.rows[i].cells[j];
                        cell.selected = true;
                        this.selectedCells.push(cell);
                        $("#" + cell.overlayId()).show();
                    }
                }
            }
        };

        private unhighlightSpanBetweenLastHoveredAndFirstSelected = function () {
            var span = this.getSpanExtent(this.lastHoveredCell, this.firstSelectedCell);

            for (var i = span.minRow; i < span.maxRow + 1; i++) {
                for (var j = span.minCol; j < span.maxCol + 1; j++) {
                    var cell = this.rows[i].cells[j];
                    cell.selected = false;
                    var index = this.selectedCells.indexOf(cell);
                    if (index != -1) {
                        this.selectedCells.splice(index, 1);
                    }
                    $("#" + cell.overlayId()).hide();
                }
            }
        };

        private getSpanExtent = function (fromCell, toCell) {
            var first = {
                row: fromCell.rowIdx,
                col: fromCell.colIdx
            };

            var last = {
                row: toCell.rowIdx,
                col: toCell.colIdx
            };

            // find selection range border
            return {
                minRow: Math.min(first.row, last.row),
                maxRow: Math.max(first.row, last.row),
                minCol: Math.min(first.col, last.col),
                maxCol: Math.max(first.col, last.col)
            };
        };

        public triggerRerender = () => {
            this.orderBy(this.orderByName() ? 1 : 0);
            this.rerenderTrigger.valueHasMutated();
        }

        public setEventsSelectedCount(): void {
            this.eventsSelectedTrigger.valueHasMutated();
        }

        public setBarChartEventsSelectedCount(): void {
            this.barChartEventsSelectedTrigger.valueHasMutated();
        }

        public mouseDown(): void {
            this.mouseIsDown = true;
        }
    }
}