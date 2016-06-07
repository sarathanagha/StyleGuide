/// <reference path="../../References.d.ts" />

import Log = require("../Framework/Util/Log");

import AppContext = require("../AppContext");
import BaseService = require("./BaseService");

let logger = Log.getLogger({ loggerName: "AzureInsightsService" });

export interface IBaseUrlParams {
    subscriptionId: string;
    resourceGroupName: string;
}

export interface IAlertUrlParams extends IBaseUrlParams {
    alertRuleName: string;
}

export interface ICreateAlertUrlParams extends IAlertUrlParams {
    factoryName: string;
}

// User inputed parameters to create or update an alert rule
export interface ICreateOrUpdateRuleJsonParams {
    name: string;
    location: string;
    description: string;
    isEnabled: boolean;
    operationName: string;
    status: string;
    subStatus?: string;
    customEmails: string[];
    sendToServiceOwners: boolean;
    operator?: string;
    windowSize?: string;
    threshold?: number;
}

/**
 * Service to interface with the Azure Insights REST APIs
 *
 * Azure Insights API: https://msdn.microsoft.com/en-us/library/azure/dn931943.aspx
 */
export class AzureInsightsService extends BaseService.BaseService {
    protected _apiVersion: string = "2015-04-01";

    private _insightsResourceProviderNamespace: string = "Microsoft.Insights";
    private _datafactoryResourceProviderNamespace: string = "Microsoft.DataFactory";

    private _insightsBaseUrl: string = "/subscriptions/{subscriptionId}/resourcegroups/" +
    "{resourceGroupName}/providers/" + this._insightsResourceProviderNamespace;
    private _datafactoryBaseUrl: string = "/subscriptions/{subscriptionId}/resourcegroups/" +
    "{resourceGroupName}/providers/" + this._datafactoryResourceProviderNamespace;

    private _alertUrl: string = this._insightsBaseUrl + "/alertRules/{alertRuleName}";
    private _listRulesUrl: string = this._insightsBaseUrl + "/alertRules";
    private _factoryResourceUrl: string = this._datafactoryBaseUrl + "/datafactories/{factoryName}";

    constructor(appcontext: AppContext.AppContext) {
        super(appcontext, logger);
    }

    // Creates an alert rule or updates it if it already exists
    public createOrUpdateRule(resourceParams: ICreateAlertUrlParams, createOrUpdateRuleJsonParams: ICreateOrUpdateRuleJsonParams): Q.Promise<IAlertResponse> {
        let url: string = this.getBaseUrl(this._alertUrl, resourceParams);
        let data = this.getCreateOrUpdateAlertRuleJson(resourceParams, createOrUpdateRuleJsonParams);

        let promise = this.ajaxQ<IAlertResponse>({
            url: url,
            data: data,
            type: "PUT",
            contentType: "application/json"
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Creating alert rule {0} failed".format(resourceParams.alertRuleName), url));

        return promise;
    }

    // Deletes an alert rule
    public deleteRule(alertParams: IAlertUrlParams): Q.Promise<IAlertResponse> {
        let url: string = this.getBaseUrl(this._alertUrl, alertParams);

        let promise = this.ajaxQ<IAlertResponse>({
            url: url,
            type: "DELETE",
            contentType: "application/json"
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Deleting alert rule {0} failed".format(alertParams.alertRuleName), url));

        return promise;
    }

    // Gets information about an alert rule
    public getRule(alertParams: IAlertUrlParams): Q.Promise<IGetAlertResponse> {
        let url: string = this.getBaseUrl(this._alertUrl, alertParams);

        let promise = this.ajaxQ<IGetAlertResponse>({
            url: url,
            type: "GET",
            contentType: "application/json"
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Getting information about alert rule {0} failed".format(alertParams.alertRuleName), url));

        return promise;
    }

    // Lists the alert rules within a resource group
    public listRules(baseUrlParams: IBaseUrlParams): Q.Promise<IListAlertsResponse> {
        let url: string = this.getBaseUrl(this._listRulesUrl, baseUrlParams);

        let promise = this.ajaxQ<IListAlertsResponse>({
            url: url,
            type: "GET",
            contentType: "application/json"
        });

        promise.fail((error: JQueryXHR) => {
            this.logMessage(error.status, "Failed to fetch alerts {0}".format(JSON.stringify(error)));
        });

        return promise;
    }

    private getCreateOrUpdateAlertRuleJson(resourceParams: ICreateAlertUrlParams, params: ICreateOrUpdateRuleJsonParams): string {
        // Only support creating alerts on tables (datasets) and the factory itself at the moment
        let resourceUri = this.getBaseUrl(this._factoryResourceUrl, resourceParams);
        // Default values for the JSON PUT request
        let jsonTemplate = {
            "type": "microsoft.insights/alertrules",
            "properties":
            {
                "condition":
                {
                    "odata.type": "Microsoft.Azure.Management.Insights.Models.ManagementEventRuleCondition",
                    "dataSource":
                    {
                        "odata.type": "Microsoft.Azure.Management.Insights.Models.RuleManagementEventDataSource",
                        "resourceUri": resourceUri
                    }
                },
                "action":
                {
                    "odata.type": "Microsoft.Azure.Management.Insights.Models.RuleEmailAction"
                }
            }
        };

        let jsonObject: ICreateRuleJsonObject = JSON.parse(JSON.stringify(jsonTemplate));
        jsonObject.name = params.name;
        jsonObject.location = params.location;
        jsonObject.properties.name = params.name;
        jsonObject.properties.description = params.description;
        jsonObject.properties.isEnabled = params.isEnabled;
        jsonObject.properties.condition.dataSource.operationName = params.operationName;
        jsonObject.properties.condition.dataSource.status = params.status;
        jsonObject.properties.condition.dataSource.subStatus = params.subStatus;
        // If we have one of the aggregation params, we have them all and should aggregate
        if (params.windowSize) {
            jsonObject.properties.condition.aggregation = {
                operator: params.operator,
                windowSize: params.windowSize,
                threshold: params.threshold
            };
        }
        jsonObject.properties.action.customEmails = params.customEmails;
        jsonObject.properties.action.sendToServiceOwners = params.sendToServiceOwners;

        return JSON.stringify(jsonObject);
    }
}

interface ICreateRuleJsonObject {
    name: string;
    type: string;
    location: string;
    properties: {
        name: string;
        description: string;
        isEnabled: boolean;
        condition: {
            dataSource: {
                operationName: string;
                status: string;
                subStatus?: string;
            };
            aggregation?: {
                windowSize: string;
                threshold: number;
                operator: string;
            };
        };
        action: {
            customEmails: string[];
            sendToServiceOwners: boolean;
        };
    };
}

export interface IAlertResponse {
    value: {
        name: string;
        properties: {
            condition: {
                dataSource: {
                    "odata.type": string;
                };
            };
        };
    }[];
}

export interface ICreateAlertResponse {
    // stub
}

export interface IGetAlertResponse {
    name: string;
    location: string;
    properties: {
        description: string;
        isEnabled: boolean;
        condition: {
            dataSource: {
                "odata.type": string;
                operationName: string;
                status: string;
                subStatus: string;
            };
            aggregation?: {
                operator: string;
                windowSize: string;
                threshold: number;
            };
        };
        action: {
            customEmails: string[];
        };
    };
}

export interface IDeleteAlertResponse {
    // stub
}

export interface IListAlertsResponse {
    value: {
        name: string;
        location: string;
        properties: {
            description?: string;
            isEnabled: boolean;
            condition: {
                dataSource: {
                    "odata.type": string;
                    operationName?: string;
                    status?: string;
                    subStatus?: string;
                    resourceUri?: string;
                };
                aggregation?: {
                    operator: string;
                    windowSize: string;
                    threshold: number;
                };
            };
            action: {
                sendToServiceOwners: boolean;
                customEmails: string[]
            };
        };
    }[];
}
