/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models{
    export class Grid{
        public telemetryClient: RdxTelemetryClient;
        public queryEndpoint: string;
        public rerenderTrigger: KnockoutObservable<boolean> = ko.observable(false);
        public progressMessage: KnockoutObservable<string> = ko.observable('');
        public progressPercentage: KnockoutObservable<number> = ko.observable(0);
        public rows: Array<any> = [];
        public columns: Object = {};
        public eventsWebsocket: WebSocket;
        public startStreamMs: number;
        public isFirstPacket: boolean = false;

        constructor(telemetryClient: RdxTelemetryClient, queryEndpoint: string) {
            this.telemetryClient = telemetryClient;
            this.queryEndpoint = queryEndpoint;
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
                console.log("WebSocket: cancelling and closing previous connection");
                webSocket = null;
            }
        }

        // removes all values from the model and html
        public nukeContent (): void {
            this.rows = [];
            this.columns = {};
            this.progressMessage('');
            this.progressPercentage(0);
            this.rerenderTrigger.valueHasMutated();
        }

        // streams events to grid
        public streamEvents(snapshotHandle: any, predicateJS: Object, selectedCells: Array<HeatmapCell>, searchSpan: any, take: number, dimension: string, timeDimension: string, environmentId: string): void {
            this.destroyWebSocket(this.eventsWebsocket, true);
            var uri = 'wss://' + this.queryEndpoint + '/environments/' + environmentId + '/events';
            this.eventsWebsocket = new WebSocket(uri, '20150504');

            this.eventsWebsocket.onclose = e => {
            }

            this.eventsWebsocket.onerror = e => {
                this.telemetryClient.logUserAction('streamEventsError', { duration: (new Date()).valueOf() - this.startStreamMs });
                this.isFirstPacket = false;
            }

            // parses response for rows
            this.eventsWebsocket.onmessage = e => {
                
                // log this event
                if (this.isFirstPacket) {
                    this.telemetryClient.logUserAction('streamEventsFirstPacket', { duration: (new Date()).valueOf() - this.startStreamMs });
                    this.isFirstPacket = false;
                }

                var message = JSON.parse(e.data);
                var events = message.content.events;
                this.progressPercentage(Math.max(1,Math.floor(1.0* this.rows.length / take * 100)));
                if (message.percentCompleted) {
                    this.progressPercentage(message.percentCompleted);
                }
                if (message.percentCompleted ? message.percentCompleted == 100 : false) {
                    this.progressMessage('Streaming events complete. Total rows: ' + this.rows.length.toLocaleString('en'));
                    this.telemetryClient.logUserAction('streamEventsComplete', { duration: (new Date()).valueOf() - this.startStreamMs, totalEvents: this.rows.length });
                    return;
                }

                var eventSourceProperties = {};
                for (var eventIdx in events) {
                    var eventSourceId;
                    if (events[eventIdx].hasOwnProperty('eventSource')) {
                        eventSourceProperties[events[eventIdx].eventSource.id] = {};
                        eventSourceProperties[events[eventIdx].eventSource.id].propertyNames = events[eventIdx].eventSource.properties.reduce(function (prev, curr) { prev.push(curr.name);
                            return prev;
                        }, []);
                        eventSourceProperties[events[eventIdx].eventSource.id].eventSourceName = events[eventIdx].eventSource.name;
                        eventSourceId = events[eventIdx].eventSource.id;
                    } else {
                        eventSourceId = events[eventIdx].eventSourceId;
                    }

                    var event = { timestamp: events[eventIdx].timestamp, EventSourceName: eventSourceProperties[eventSourceId].eventSourceName };
                    for (var propIdx in eventSourceProperties[eventSourceId].propertyNames) {
                        if (!this.columns.hasOwnProperty(eventSourceProperties[eventSourceId].propertyNames[propIdx]))
                            this.columns[eventSourceProperties[eventSourceId].propertyNames[propIdx]] = true;
                        event[eventSourceProperties[eventSourceId].propertyNames[propIdx]] = events[eventIdx].values[propIdx];
                    }
                    this.rows.push(event);
                }
                this.progressMessage('Streaming events...');
                this.rerenderTrigger.valueHasMutated();
            }

            // constructs selection and opens the websocket to stream events
            this.eventsWebsocket.onopen = () => {
                this.rows = [];
                this.columns = {};
                var andNotExpressions = [];
                var snapshotHandles = [];
                var selection = {};
                for (var cellIdx in selectedCells) {
                    if (!selection.hasOwnProperty(selectedCells[cellIdx].eventSourceName)) {
                        selection[selectedCells[cellIdx].eventSourceName] = [];
                    }
                    selection[selectedCells[cellIdx].eventSourceName].push(selectedCells[cellIdx].colIdx.toString());
                }
                andNotExpressions.push(predicateJS);
                snapshotHandles.push(snapshotHandle);

                // log this event
                this.startStreamMs = (new Date()).valueOf();
                this.telemetryClient.logUserAction('startSteamEvents');
                this.isFirstPacket = true;
                Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken().then((token) => {
                    var messageObject = {};
                    messageObject['headers'] = { 'Authorization': JSON.stringify(['Bearer ' + token]) };
                    var dimensionObject = (dimension == '' || dimension == 'EventSourceName') ? null : { propertyType: 'string', eventSourceName: '*', propertyName: dimension };
                    messageObject['content'] = { andNotExpressions: andNotExpressions, skip: 0, take: take, intervalSize: timeDimension.toLowerCase(), selection: selection, snapshotHandles: snapshotHandles, searchSpan: searchSpan, dimension: dimensionObject };
                    this.columns['EventSourceName'] = true;
                    this.rerenderTrigger.valueHasMutated();
                    this.progressPercentage(1);
                    this.progressMessage('Streaming events...');
                    this.eventsWebsocket.send(JSON.stringify(messageObject));
                });

            }
        }
    }

}