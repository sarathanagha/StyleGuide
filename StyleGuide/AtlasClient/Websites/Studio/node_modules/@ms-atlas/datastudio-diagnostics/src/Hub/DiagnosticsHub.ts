/// <reference path="../references.ts" />
/// <reference path="../Http/HttpClientFactory.ts" />
/// <reference path="DiagnosticsEvent.ts" />
/// <reference path="SessionData.ts" />

module Microsoft.DataStudio.Diagnostics.Hub {

    export class DiagnosticsHub {
        private static sessionData: SessionData = null;
        private static subscriptionData: SubscriptionData = null;

        private static queueEnabled: boolean = false;
        private static uploadEnabled: boolean = false;
        private static uploadInProgress: boolean = false;

        private static httpClient: Http.HttpClient = null;
        private static httpEndpoint: string;

        private static eventQueue: DiagnosticsEvent[] = [];

        static configureSession(sessionData: SessionData) {
            Assert.argumentIsObject(sessionData, "sessionData");

            if (!TypeInfo.isString(sessionData.sessionId)) {
                throw new Error("DiagnosticsHub: sessionData.sessionId isn't a valid string");
            }

            if (!TypeInfo.isString(sessionData.userId)) {
                throw new Error("DiagnosticsHub: sessionData.userId isn't a valid string");
            }

            DiagnosticsHub.sessionData = sessionData;

            DiagnosticsHub.checkEnableQueue(); // Enable event queue if hub is configured
        }

        static configureSusbscription(subscriptionData: SubscriptionData) {
            Assert.argumentIsObject(subscriptionData, "subscriptionData");

            if (!TypeInfo.isGuid(subscriptionData.subscriptionId)) {
                throw new Error("DiagnosticsHub: subscriptionData.subscriptionId isn't a valid GUID");
            }
            
            if (!TypeInfo.isString(subscriptionData.resourceGroupName)) {
                throw new Error("DiagnosticsHub: subscriptionData.resourceGroupName isn't a valid string");
            }

            if (!TypeInfo.isString(subscriptionData.resourceName)) {
                throw new Error("DiagnosticsHub: subscriptionData.resourceName isn't a valid string");
            }

            if (!TypeInfo.isString(subscriptionData.provider)) {
                throw new Error("DiagnosticsHub: subscriptionData.provider isn't a valid string");
            }

            DiagnosticsHub.subscriptionData = subscriptionData;

            DiagnosticsHub.checkEnableQueue(); // Enable event queue if hub is configured
        }

        static configureEndpoint(endpointUrl: string) {
            Assert.argumentIsString(endpointUrl, "endpointUrl");

            if (!DiagnosticsHub.httpClient) {
                DiagnosticsHub.httpClient = Http.HttpClientFactory.createRetryClient();
            }
            DiagnosticsHub.httpEndpoint = endpointUrl;

            // Endpoint configured, ready to send messages
            DiagnosticsHub.uploadEnabled = true;

            // Start upload of the already queued events
            DiagnosticsHub.startUpload();
        }

        static publishEvent(event: DiagnosticsEvent): void {
            Assert.argumentIsObject(event, "event");

            if (!DiagnosticsHub.queueEnabled) {
                // The queue is disabled, rejecting all incoming events
                console.warn("DiagnosticsHub.publishEvent(): The queue is disabled, rejecting all incoming events!");
                return;
            }

            // Validating event
            DiagnosticsHub.validateEvent(event);

            // Include session data
            ObjectUtils.update(event, DiagnosticsHub.sessionData);

            // Include subscription data
            ObjectUtils.update(event, DiagnosticsHub.subscriptionData);

            // Add the event to the queue
            DiagnosticsHub.eventQueue.push(event);

            // Start upload
            DiagnosticsHub.startUpload();
        }

        private static checkEnableQueue(): void {
            if (DiagnosticsHub.sessionData != null && DiagnosticsHub.subscriptionData != null)
                DiagnosticsHub.queueEnabled = true; // Hub configured, ready to accept messages
        }

        private static validateEvent(event: DiagnosticsEvent): void {
            if (!TypeInfo.isObject(event.timestamp)) {
                throw new Error("DiagnosticsHub: Event with no 'timestamp' rejected.");
            }

            if (!TypeInfo.isNumber(event.priority)) {
                throw new Error("DiagnosticsHub: Event with no 'priority' rejected.");
            }

            if (!TypeInfo.isString(event.eventType)) {
                throw new Error("DiagnosticsHub: Event with no 'eventType' rejected.");
            }

            if (!TypeInfo.isString(event.eventBody)) {
                throw new Error("DiagnosticsHub: Event with no 'eventBody' rejected.");
            }
        }

        private static startUpload(): void {
            if (!DiagnosticsHub.uploadEnabled) {
                // Upload haven't been enabled, collecting events but not sending on the server
                return;
            }

            if (DiagnosticsHub.uploadInProgress || DiagnosticsHub.eventQueue.length == 0) {
                // Skipping, upload is already in progress or nothing to do
                return;
            }

            // Set the "in progress" state to prevent simultaneous uploads
            DiagnosticsHub.uploadInProgress = true;

            // Delaying the upload to collect more events
            PromiseUtils.delay(2000).then(() => {

                // Serialize the existing events and clear the queue
                var events = DiagnosticsHub.eventQueue;
                var serializedEvents = ObjectUtils.serialize(events);
                DiagnosticsHub.eventQueue = [];

                Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken().then((token) => {
                    // Send the events on the server
                    DiagnosticsHub.httpClient.postAsync(DiagnosticsHub.httpEndpoint, serializedEvents,
                        "application/json", token).then(() => {

                            // Upload successfully finished, can be started again
                            DiagnosticsHub.uploadInProgress = false;

                            // Check for further events to upload
                            DiagnosticsHub.startUpload();

                        }).catch(e => {
                            console.error("DiagnosticsHub disabled due to error: %s", e.message);

                            // Permanently disabling upload due to failure after several attempts
                            DiagnosticsHub.uploadEnabled = false;

                            // Disabling and clearing the queue
                            DiagnosticsHub.queueEnabled = false;
                            DiagnosticsHub.eventQueue = [];
                        });
                });
            });
        }
    }
}
