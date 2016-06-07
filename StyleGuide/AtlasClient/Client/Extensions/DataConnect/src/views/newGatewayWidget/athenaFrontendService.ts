/// <reference path="../../References.d.ts" />

import models = Microsoft.DataStudio.Modules.DataConnect.Models;

// Temporarily put this class here, will revise it later.
export class AthenaFrontendService {
    private apiVersion: string = "apiversion=1.0";

    constructor() {

    }

    public createGateway(gatewayRequest: any): JQueryPromise<any> {
        var connectionManagerUrl = gatewayRequest.connectionManagerUrl;
        var key = gatewayRequest.adminKey;
        var gatewayData = {
            name: gatewayRequest.name,
            description: gatewayRequest.description
        };

        var options = {
            url: connectionManagerUrl + "/gateways/" + gatewayData.name + "?" + this.apiVersion,
            contentType: "application/json",
            type: "PUT",
            data: JSON.stringify(gatewayData),
            token: key
        }

        return this.ajax<any>(options);
    }

    public listGateway(gatewayRequest: any): JQueryPromise<any> {
        var connectionManagerUrl = gatewayRequest.connectionManagerUrl;
        var key = gatewayRequest.adminKey;

        var options = {
            url: connectionManagerUrl + "/gateways" + "?" + this.apiVersion,
            contentType: "application/json",
            type: "GET",
            token: key
        }

        return this.ajax<any>(options);
    }


    public testConnection(connectorRequest: any): JQueryPromise<any> {
        var connectionManagerUrl = connectorRequest.connectionManagerUrl;
        var key = connectorRequest.adminKey;
        var username = null;
        var password = null;

        if (connectorRequest.connectionSettings.credentialFields) {
            $.each(connectorRequest.connectionSettings.credentialFields(), (idx, item) => {
                if (item.name === "username") {
                    username = item.propertyValue();
                }
                if (item.name === "password") {
                    password = item.propertyValue();
                }
            });
        }

        var connectorData = {
            type: connectorRequest.type,
            credential: {
                isEncrypted: connectorRequest.isCredentialEncrypted,
                username: username,
                password: password
            },
            connectionSettings: this.buildDsr(connectorRequest.connectionSettings),
            gateway: connectorRequest.gatewayUrl ? {
                url: connectorRequest.gatewayUrl
            } : null
        };

        var options = {
            url: connectionManagerUrl + "/testconnection" + "?" + this.apiVersion,
            contentType: "application/json",
            type: "POST",
            data: JSON.stringify(connectorData),
            token: key
        }

        return this.ajax<any>(options);
    }

    public buildDsr(connectionSettings: any): string {
        if (!connectionSettings)
            return "";

        var dsrObj = {
            authentication: connectionSettings.selectedAuthenticationType(),
            address: {}
        };

        $.each(connectionSettings.address, (idx, item) => {
            if (item.propertyValue()) {
                dsrObj.address[item.name] = item.propertyValue();
            }
        });

        return JSON.stringify(dsrObj);
    }

    public getConnectorSchema(connectorRequest: any) {
        var options = {
            url: connectorRequest.connectionManagerUrl + "/connectortypeschemas",
            contentType: "application/json",
            type: "GET",
            token: connectorRequest.adminKey
        }

        return this.ajax<any>(options);
    }
    
    // Use the ajaxQ method if the access to headers is not required.
    public ajax<T>(request: any): JQueryPromise<T> {
        //var spinner = this.spinner().on();

        var deferred = jQuery.Deferred<T>();
        //request.url = this.getAppRelativeUri(request.url);
        if (!request.data) {
            request.data = {};
        }

        request.crossDomain = true;
        if (!request.headers) {
            request.headers = {};
        }

        jQuery.extend(request.headers, {
            "Authorization": "Bearer " + request.token
        });

        jQuery.ajax(request).then((...args: any[]) => {
            //spinner.off();
            deferred.resolve.apply(deferred, args);
        }, (...args: any[]) => {
            //spinner.off();
            let reason = <JQueryXHR>args[0];
            //logger.logError(args[0].response + " " + JSON.stringify({ correlationId: this.getRequestId(reason) }));
            deferred.reject.apply(deferred, args);
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