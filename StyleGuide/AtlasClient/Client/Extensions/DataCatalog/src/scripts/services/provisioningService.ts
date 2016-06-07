module Microsoft.DataStudio.DataCatalog.Services {

    export class ProvisioningService extends BaseService {
        private static executeAsyncPoll(asyncFn: () => JQueryPromise<any>, keyMapper: (result: any) => string, pollingEndKey: string): JQueryPromise<any> {
            var deferred = $.Deferred();

            var timeout = setTimeout(() => {
                deferred.reject("timeout");
            }, 1000 * 60 * 5); // 5 minutes

            var poll = () => {
                asyncFn()
                    .done((result: { properties: { provisioningState: string } }) => {
                    // Treat empty key value as a success
                    if (result && ($.trim(keyMapper(result)) || pollingEndKey).toUpperCase() === pollingEndKey.toUpperCase()) {
                        clearTimeout(timeout);
                        deferred.resolve();
                    } else if (deferred.state() === "pending") {
                        setTimeout(poll, 1500);
                    }
                })
                    .fail(deferred.reject);
            };

            poll();

            return deferred.promise();
        }

        private static onUnauthorized(correlationId): JQueryPromise<any> {
            logger.logWarning("arm token expired", { correlationId: correlationId });
            if (ModalService.isShowing()) {
                var response = confirm(Core.Resx.expiredSession);
                if (response) {
                    window.location.reload();
                }
            } else {
                ModalService.show({ title: Core.Resx.expiredSessionTitle, bodyText: Core.Resx.expiredSession })
                    .done((modal) => {
                    modal.close();
                    window.location.reload();
                });
            }

            return $.Deferred().reject().promise();
        }

        static getSubscriptions(): JQueryPromise<any> {
            return this.ajax("/api/provisioning/subscriptions", null, null, false, this.onUnauthorized);
        }

        static getLocations(subscriptionId: string): JQueryPromise<any> {
            return this.ajax("/api/provisioning/locations", { data: { subscriptionId: subscriptionId } }, null, false, this.onUnauthorized);
        }

        static registerSubscription(subscriptionId: string): JQueryPromise<any> {
            return this.executeAsyncPoll(() => {
                return this.ajax("/api/provisioning/registerSubscription?subscriptionId=" + subscriptionId, { method: "PUT" }, null, false, this.onUnauthorized);
            }, result => result.registrationState, "Registered");
        }

        static createResourceGroup(subscriptionId: string, location: string): JQueryPromise<any> {
            return this.executeAsyncPoll(() => {
                return this.ajax(Core.Utilities.stringFormat("/api/provisioning/createResourceGroup?subscriptionId={0}&location={1}", subscriptionId, location), { method: "PUT" }, null, false, this.onUnauthorized);
            }, result => result.properties.provisioningState, "Succeeded");
        }

        static createCatalog(catalog: Interfaces.ICreateCatalog): JQueryPromise<any> {
            return this.executeAsyncPoll(() => {
                return this.ajax("/api/provisioning/createCatalog", { method: "PUT", data: this.stringify(catalog), contentType: "application/json" }, null, false, this.onUnauthorized);
            }, result => result.properties.provisioningState, "Succeeded");
        }

        static updateCatalog(catalog: Interfaces.ICreateCatalog): JQueryPromise<any> {
            return this.executeAsyncPoll(() => {
                return this.ajax("/api/provisioning/updateCatalog", { method: "PATCH", data: this.stringify(catalog), contentType: "application/json" }, null, false, this.onUnauthorized);
            }, result => result.properties.provisioningState, "Succeeded");
        }

        static updateCatalogRp(catalog: Interfaces.ICreateCatalog): JQueryPromise<any> {
            return this.executeAsyncPoll(() => {
                return this.ajax("/api/provisioning/updateCatalogRp", { method: "PATCH", data: this.stringify(catalog), contentType: "application/json" }, null, false);
            }, result => result.properties.provisioningState, "Succeeded");
        }

        static deleteCatalog(subscriptionId: string, catalogName: string, location: string, resourceGroupName: string) {
            var deferred = $.Deferred();

            var timeout = setTimeout(() => {
                deferred.reject("timeout");
            }, 1000 * 60 * 5); // 5 minutes

            var poll = () => {
                this.ajax(Core.Utilities.stringFormat("/api/provisioning/deleteCatalog?subscriptionId={0}&location={1}&catalogName={2}&resourceGroupName={3}", subscriptionId, location, catalogName, resourceGroupName), { method: "DELETE" }, null, true, this.onUnauthorized)
                    .done((data, textStatus, jqXhr: JQueryXHR) => {
                    //// https://msdn.microsoft.com/en-us/library/azure/dn790539.aspx
                    if (jqXhr.status === 200) {
                        clearTimeout(timeout);
                        deferred.resolve();
                    } else if (jqXhr.status === 202) {
                        setTimeout(poll, 1500);
                    }
                })
                    .fail(deferred.reject);
            };

            poll();

            return deferred.promise();
        }
    }
}