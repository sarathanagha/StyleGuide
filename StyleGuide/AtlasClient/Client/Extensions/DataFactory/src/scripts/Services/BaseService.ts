/// <reference path="../../References.d.ts" />

import AppContext = require("../AppContext");
import Logger = Microsoft.DataStudio.Diagnostics.Logging.Logger;
import LogEventData = Microsoft.DataStudio.Diagnostics.Logging.LogEventData;
import NodeUuid = require("node-uuid");

export abstract class BaseService {
    protected _apiVersion: string = null;     // This should be overriden by the derived class. TODO should this be method so we can make it abstract?
    public _appContext: AppContext.AppContext = null;
    protected _classLogger = null;
    protected moduleName: string = null;

    constructor(appContext: AppContext.AppContext, classLogger: Logger, moduleName?: string) {
        this._appContext = appContext;
        this._classLogger = classLogger;
        this.moduleName = moduleName;
    }

    // creates a new spinner instance
    public spinner() {
        return this._appContext.spinner.getInstance();
    }

    public sendMessage<T>(relativeUri: string, type: string, queryStringParams: Object = null, postData: Object = null): Q.Promise<T> {
        let options = {
            url: relativeUri + ((queryStringParams) ? "?" + $.param(queryStringParams) : ""),
            contentType: "application/json",
            type: type
        };
        if (postData !== null) {
            options["data"] = JSON.stringify(postData);
        }
        return this.ajaxQ<T>(options);
    }

    protected getResponseInfo(response: JQueryXHR): string {
        if (response.response) {
            return response.response;
        }

        if (response.responseText) {
            return response.responseText;
        }

        // we should spit out as much info as possible otherwise
        return "No response text: (" + JSON.stringify(response) + ")";
    }

    /**
     * Gets the path to the application relative uri.
     *
     * @param uri The application relative uri.
     * @return The uri.
     */
    public getAppRelativeUri(location: string): string {
        return Microsoft.DataStudio.Application.ResourceConstants.AZURE_RESOURCE_URL + location;
    }

    public ajax<T>(request: JQueryAjaxSettingsExtended, usingNextLink: boolean): JQueryXHRPromise<T> {
        let spinner = this._appContext.spinner.getInstance().on();

        let deferred = jQuery.Deferred();
        Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken(this._appContext.splitFactoryId().subscriptionId).then((token: string) => {
            if (!usingNextLink) {
                request.url = this.getAppRelativeUri(request.url);
                if (!request.type || request.type === "GET") {
                    if (!request.data) {
                        request.data = {};
                    }
                    if (!request.data["api-version"]) {
                        request.data["api-version"] = this._apiVersion;
                    }
                } else {
                    let params = {
                        "api-version": this._apiVersion
                    };

                    if (request.getData) {
                        jQuery.extend(params, request.getData);
                    }

                    request.url += "?" + jQuery.param(params);
                }
            }

            request.crossDomain = true;
            if (!request.headers) {
                request.headers = {};
            }
            jQuery.extend(request.headers, {
                "Authorization": "Bearer " + token
            });

            let {requestId, sessionId} = this.addClientIdentificationIds(request);
            this._classLogger.logInfo("Making request to {0}".format(request.url), {
                clientRequestId: requestId
            });

            this.addModuleName(request, this.moduleName);
            jQuery.ajax(request).then((...args: Object[]) => {
                spinner.off();
                this._classLogger.logInfo("Completed request to {0}".format(request.url), {
                    clientRequestId: requestId,
                    correlationId: this.getCorrelationId(<JQueryXHR>args[2])
                });
                deferred.resolve.apply(deferred, args);
            }, (...args: Object[]) => {
                spinner.off();
                let reason = <JQueryXHRExtended>args[0];

                reason.requestUrl = request.url;

                let errorMessage = "Api call failed: {0}, Reason: {1}, RequestId: {2}, SessionId: {3}".format(
                    request.url, this.getResponseInfo(reason), requestId, sessionId);

                this.logMessage(reason.status, errorMessage, {
                    clientRequestId: requestId,
                    correlationId: this.getCorrelationId(<JQueryXHR>args[0])
                });
                deferred.reject.apply(deferred, args);
            });
        }, (reason: Object) => {
            spinner.off();
            this._classLogger.logError(reason.toString(), reason);
            deferred.reject(reason);
        });
        return deferred.promise();
    }

    public ajaxQ<T>(request: JQueryAjaxSettingsExtended, usingNextLink: boolean = false): Q.Promise<T> {
        let deferred = Q.defer<T>();
        this.ajax(request, usingNextLink).then((data: T) => {
            deferred.resolve(data);
        }, (jqXHR: JQueryXHR) => {
            deferred.reject(jqXHR);
        });
        return deferred.promise;
    }

    protected getBaseUrl(baseUrl: string, baseUrlParams: Object): string {
        return baseUrl.slice().replace(/{([^}]+)}/g, (matchedString: string, varName: string) => {
            return baseUrlParams[varName].toString();
        });
    }

    protected addClientIdentificationIds(request: JQueryAjaxSettingsExtended): { requestId: string, sessionId: string } {
        let requestId = NodeUuid.v4();
        request.headers["x-ms-client-request-id"] = requestId;
        let sessionId = Microsoft.DataStudio.Managers.AuthenticationManager.instance.getCurrentUser().sessionId;
        request.headers["x-ms-client-session-id"] = sessionId;
        return { requestId: requestId, sessionId: sessionId };
    }

    protected addModuleName(request: JQueryAjaxSettingsExtended, moduleName: string): void {
        if (moduleName) {
            request.headers["x-ms-client-module-name"] = moduleName;
        }
    }

    protected getCorrelationId(response: JQueryXHR): string {
        return response.getResponseHeader("x-ms-request-id");
    }

    protected logMessage(statusCode: number, message: string, data?: LogEventData): void {
        if (statusCode >= 500) {
            this._classLogger.logError(message, data);
        } else {
            this._classLogger.logInfo(message, data);
        }
    }
}

