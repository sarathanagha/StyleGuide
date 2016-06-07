/// <reference path="../../References.d.ts" />

import AppContext = require("../AppContext");
import NodeUuid = require("node-uuid");

let logger = Microsoft.DataStudio.Studio.LoggerFactory.getLogger({ loggerName: "BaseService", category: "BaseService" });

export class BaseService {
    public _appContext: AppContext.AppContext = null;
    protected classLogger = logger;

    constructor(appContext: AppContext.AppContext) {
        this._appContext = appContext;
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
        return "https://management.azure.com" + location;
    }

    public ajax<T>(request: JQueryAjaxSettingsExtended): JQueryXHRPromise<T> {
        let spinner = this._appContext.spinner.getInstance().on();

        let deferred = jQuery.Deferred();
        Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken().then((token: string) => {
            request.url = this.getAppRelativeUri(request.url);
            if (!request.type || request.type === "GET") {
                if (!request.data) {
                    request.data = {};
                }
            } else {
                let params = { };

                if (request.getData) {
                    jQuery.extend(params, request.getData);
                }

                request.url += "?" + jQuery.param(params);
            }

            request.crossDomain = true;
            if (!request.headers) {
                request.headers = {};
            }
            jQuery.extend(request.headers, {
                "Authorization": "Bearer " + token
            });

            let requestId = this.addRequestId(request);

            jQuery.ajax(request).then((...args: Object[]) => {
                spinner.off();
                deferred.resolve.apply(deferred, args);
            }, (...args: Object[]) => {
                spinner.off();
                let reason = <JQueryXHR>args[0];

                let errorMessage = "Api call failed: {0}, Reason: {1}, CorrelationId: {2}".format(
                    request.url, this.getResponseInfo(reason), requestId);

                this.classLogger.logError(errorMessage);
                deferred.reject.apply(deferred, args);
            });
        }, (reason: Object) => {
            spinner.off();
            this.classLogger.logError(reason.toString(), reason);
            deferred.reject(reason);
        });
        return deferred.promise();
    }

    public ajaxQ<T>(request: JQueryAjaxSettingsExtended): Q.Promise<T> {
        let deferred = Q.defer<T>();
        this.ajax(request).then((data: T) => {
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

    protected addRequestId(request: JQueryAjaxSettingsExtended): string {
        let requestId = NodeUuid.v4();
        request.headers["x-ms-client-request-id"] = requestId;
        return requestId;
    }
}

