/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class RdxTelemetryClient {
        public sessionId: string;
        public queryEndpoint: string;
        public currentUserToken: any;
        private currentUserId: string = '';
        private currentUserEmail: string = '';

        constructor(queryEndpoint: string) {
            this.queryEndpoint = queryEndpoint;
            this.sessionId = this.guid();

            var authMgr = <any>Microsoft.DataStudio.Managers.AuthenticationManager.instance;
            var currentUser = authMgr.getCurrentUser();
            this.currentUserToken = currentUser.token;
            try {
                this.currentUserEmail = currentUser.email;
                this.currentUserId = currentUser.puid;
            }
            catch (e) {
            }

            // dont collect logs for my dev box
            var isLocalTesting = window.location.hostname.indexOf('atlas-preview') != -1;
            if (isLocalTesting) {
                this.logUserAction = () => { };
            }

            this.logUserAction('sessionStart');
        }

        public logUserAction = (eventType: string, logObject: any = {}) => {
            logObject.eventType = eventType;
            logObject.sessionId = this.sessionId;
            logObject.userId = this.currentUserId;
            logObject.email = this.currentUserEmail;
            Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken().then((token) => {
                $.ajax({
                    url: 'https://' + this.queryEndpoint + '/telemetry/rdx',
                    type: 'POST',
                    contentType: 'application/json',
                    beforeSend: function (xhr) { xhr.setRequestHeader('version', '20150504'); xhr.setRequestHeader('Authorization', JSON.stringify(['Bearer ' + token])) },
                    data: JSON.stringify(logObject)
                });
            });
        }

        public logNumberOfTenantsAndIfContainsMsftTenant = () => {
            var authMgr = <any>Microsoft.DataStudio.Managers.AuthenticationManager.instance;
            authMgr.subscriptionToTenantMapDeferred.promise.then((map) => {
                var tenantIdToSubIdMap = {};
                for (var subId in map) {
                    tenantIdToSubIdMap[map[subId].tenantId] = subId;
                }
                this.logUserAction('tenantInfo', { numberOfTenants: Object.keys(tenantIdToSubIdMap).length, hasMicrosoftTenant: tenantIdToSubIdMap.hasOwnProperty("72f988bf-86f1-41af-91ab-2d7cd011db47") })
            });
        }

        private guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }
}