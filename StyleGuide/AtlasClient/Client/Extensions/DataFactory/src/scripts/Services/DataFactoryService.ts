/// <reference path="../../References.d.ts" />

import AppContext = require("../AppContext");
import BaseService = require("./BaseService");
import Log = require("../Framework/Util/Log");

let logger = Log.getLogger({ loggerName: "DataFactoryService" });

/* Return Values */
export interface IIdentityContract {
    GivenName: string;
    Surname: string;
}

export interface IActivityBlobInfoQueryParams {
    subscriptionId: string;
    resourceGroupName: string;
    factoryName: string;
    name: string;
    activityName: string;
    noApiVersion: boolean;
}

export interface IActivityBlobInfo {
    IsTruncated: boolean;
    BlobData: string;
    BlobSasUri: string;
}

export class DataFactoryService extends BaseService.BaseService {
    protected _apiVersion: string = "2015-09-01";
    private _identityUrl = "/api/Identity";

    constructor(appContext: AppContext.AppContext, moduleName: string) {
        super(appContext, logger, moduleName);
    }

    // API
    public logTelemetry(data: string): Q.Promise<void> {
        return this.ajaxQ<void>({
            url: "/api/ClientTelemetry",
            data: data,
            type: "POST",
            contentType: "application/json"
        });
    }

    public getIdentity(): Q.Promise<string> {
        let deferred = Q.defer<string>();
        let userIdentity = null;

        if (userIdentity) {
            deferred.resolve(userIdentity);
        } else {
            this.ajaxQ<IIdentityContract>({
                url: this._identityUrl,
                type: "GET",
                contentType: "application/json"
            }).then((identity) => {
                // We try to fill in as much of the user's name as they gave. If they haven't provided either
                if (identity.GivenName && identity.Surname) {
                    userIdentity = ClientResources.nameFormat.format(identity.GivenName, identity.Surname);
                } else if (identity.GivenName) {
                    userIdentity = identity.GivenName;
                } else if (identity.Surname) {
                    userIdentity = identity.Surname;
                } else {
                    userIdentity = ClientResources.unknownUser;
                }
                deferred.resolve(userIdentity);
            }, (reason: JQueryXHR) => {
                logger.logError("Failed to get user identity: {0}".format(reason.responseText));
                deferred.reject(reason);
            });
        }
        return deferred.promise;
    }

    public getActivityScriptBlob(params: IActivityBlobInfoQueryParams): Q.Promise<IActivityBlobInfo[]> {
        return this.ajaxQ<IActivityBlobInfo>({
            url: "/api/datapipeline/GetActivityScriptBlobInfo",
            data: params,
            type: "GET"
        }).fail((reason) => {
            logger.logError("Failed to retrieve activity script blob for params {0}. Reason {1}".format(JSON.stringify(params), JSON.stringify(reason)));
            throw reason;
            /* tslint:disable:no-unreachable */
            return null;
            /* tslint:enable:no-unreachable */
        });
    }

    /**
     * Gets the path to the application relative uri.
     *
     * @param uri The application relative uri.
     * @return The uri.
     */
    public getAppRelativeUri(location: string): string {
           return Microsoft.DataStudio.Application.Environment.getConstant("https://s2.datafactory.ext.azure.com",
               {
                   [Microsoft.DataStudio.Application.EnvironmentType.CATFOOD]: "https://s1.datafactory.ext.azure.com",
                   [Microsoft.DataStudio.Application.EnvironmentType.DOGFOOD]: "https://df.datafactory.onecloud-ext.azure-test.net"
               }) + location;
           // return "https://localhost:901" + location;
    }

    // Use the ajaxQ method if the access to headers is not required.
    public ajax<T>(request: JQueryAjaxSettingsExtended): JQueryXHRPromise<T> {
        let spinner = this.spinner().on();

        let deferred = jQuery.Deferred<T>();

        Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken(this._appContext.splitFactoryId().subscriptionId).then((token: string) => {
            request.url = this.getAppRelativeUri(request.url);
            if (!request.data) {
                request.data = {};
            }
            // A few calls to the DataFactoryService do not need api version, hence do not add apiVersion if specifically asked not to.
            if (!request.data["apiVersion"] && !request.data["noApiVersion"]) {
                request.data["apiVersion"] = this._apiVersion;
            }
            delete request.data["noApiVersion"];

            request.crossDomain = true;
            if (!request.headers) {
                request.headers = {};
            }
            jQuery.extend(request.headers, {
                "Authorization": "Bearer " + token
            });

            let {requestId, sessionId} = this.addClientIdentificationIds(request);
            logger.logInfo("Making request to {0}".format(request.url), {
                clientRequestId: requestId
            });
            this.addModuleName(request, this.moduleName);

            jQuery.ajax(request).then((...args: Object[]) => {
                spinner.off();
                logger.logInfo("Completed request to {0}".format(request.url), {
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
        }, (reason: JQueryXHR) => {
            spinner.off();
            logger.logError("ajax request failed: {0}".format(reason.responseText));
            deferred.reject(reason);
        });
        return deferred.promise();
    }

    public ajaxQ<T>(request: JQueryAjaxSettings): Q.Promise<T> {
        let deferred = Q.defer<T>();
        this.ajax(request).then((data: T) => {
            deferred.resolve(data);
        }, (jqXHR: JQueryXHR) => {
            deferred.reject(jqXHR);
        });

        return deferred.promise;
    }
}
