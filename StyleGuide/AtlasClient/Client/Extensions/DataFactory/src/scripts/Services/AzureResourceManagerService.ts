/// <reference path="../../References.d.ts" />

import Log = require("../Framework/Util/Log");

import AppContext = require("../AppContext");
import BaseService = require("./BaseService");
import ActivityWindowModel = require("../Framework/Model/Contracts/ActivityWindow");
import ArmContracts = require("../Framework/Model/Contracts/AzureResourceManager");

let logger = Log.getLogger({ loggerName: "AzureResourceManagerService" });

const JSON_CONTENT_TYPE: string = "application/json";

/* Params */
export interface IDataFactoryResourceBaseUrlParams {
    subscriptionId: string;
    resourceGroupName: string;
    factoryName: string;
}

export interface IGatewayResourceBaseUrlParams extends IDataFactoryResourceBaseUrlParams {
    gatewayName: string;
}

export interface IGatewayParams {
    name: string;
    properties: {
        description: string;
    };
}

export interface IPipelineResourceBaseUrlParams extends IDataFactoryResourceBaseUrlParams {
    pipelineName: string;
}

export interface ILinkedServiceResourceBaseUrlParams extends IDataFactoryResourceBaseUrlParams {
    linkedServiceName: string;
}

export interface IEntityBaseUrlParams extends IDataFactoryResourceBaseUrlParams {
    entityType: string;
    entityName: string;
}

export interface ILinkedServiceParams {
    name: string;
    properties: {
        type: string;
        typeProperties: Object;
    };
}

export interface IActivityProperties {
    name: string;
    linkedServiceName: string;
    type: string;
    description: string;
    inputs: { name: string }[];
    outputs: { name: string }[];
    typeProperties: Object;
    policy: {
        concurrency: number;
        executionPriorityOrder: string;
        retry: number;
        timeout: string;
    };
    scheduler: {
        frequency: string,
        interval: number
    };
}

export interface IHiveActivityProperties extends IActivityProperties {
    typeProperties: {
        /* tilarden: commenting out for demo.
        scriptpath: string;
        scriptLinkedService: string;
        defines: Object;
        */
        script: string;
    };
}

export interface IPipelineDeployParams {
    properties: {
        name: string;
        description: string;
        activities: IActivityProperties[],
        datasets?: Object;
        start?: string;
        end?: string;
    };
}

export interface IDatasetResourceBaseUrlParams extends IDataFactoryResourceBaseUrlParams {
    tableName: string;
}

export interface IPipelinePauseParams {
    terminateExecutions?: boolean;
}

export interface ISliceResourceBaseUrlParams extends IDataFactoryResourceBaseUrlParams {
    tableName: string;
    slicesStart: string;
    slicesEnd: string;
}

export interface ISliceResourceQueryParams {
    startTime: string;
}

export interface IRunRecordBaseUrlParams extends IDataFactoryResourceBaseUrlParams {
    runId: string;
}

export interface ISliceStatusParams {
    SliceStatus: string;
    updateType: number;
}

export interface IMonitoringServiceParams {
    top?: number;
    skip?: number;
    filter?: string;
    orderby?: string;
    select?: string;
}

/* Return Values */
export interface IStandardResponse<T> {
    value: T;
    nextLink?: string;
}

export interface ISlice {
    status: string;
    start: string;
    end: string;
}

export interface IDependency {
    dependencies?: IDependency[];
    tableName: string;
    slices: {
        status: string,
        state: string,
        substate: string,
        start: string,
        end: string
    }[];
}

export interface IGenericADFEntityProperties {
    type: string;
    description: string;
    provisioningState: string;
    errorMessage?: string;
    typeProperties: Object;
}

export interface IGenericADFEntity {
    name: string;
    properties: IGenericADFEntityProperties;
}

export interface ILinkedService extends IGenericADFEntity { }

// START dataset interface
export interface IListDatasetProperties extends IGenericADFEntityProperties {
}

export interface IAzureBlobFormatInterface {
    type: string;
}

export interface ITextFormat {
    columnDelimiter?: string;
    rowDelimiter?: string;
    escapeChar?: string;
    quoteChar?: string;
    nullValue?: string;
    encodingName?: string;
}

export interface IAzureBlobTypeProperties {
    fileName?: string;
    folderPath?: string;
    partitionedBy?: {
        name: string;
        value: {
            type: string;
            date?: string;
            format?: string;
        }
    }[];
    format?: ITextFormat;
}

export interface IGetDatasetProperties extends IListDatasetProperties {
    linkedServiceName: string;
    typeProperties: IAzureBlobTypeProperties;
    structure?: {
        name: string;
        description: string;
        position: number;
        type: string;
    }[];
    policy?: {
        validation?: {
            minimumRows?: number;
            minimumSizeMB?: number;
            validationPriorityOrder?: string;
        };
        latency?: Object;
    };
}

export interface IGetDataset extends IGenericADFEntity {
    properties: IGetDatasetProperties;
}

export interface IListDataset extends IGenericADFEntity {
    properties: IListDatasetProperties;
}
// END dataset interface

export interface IGetDataFactoryResponse {
    name: string;
    id: string;
    location: string;
}

// Response for Get/Create Gateway calls
// https://msdn.microsoft.com/en-us/library/azure/mt415887.aspx
export interface IGatewayResponse {
    name: string;
    location: string;
    properties: {
        key: string;
        description: string;
        status: string;
        versionStatus: string;
        provisioningState: string;
        version: string;
    };
}

interface IEntityResponseProperties {
    provisioningState: string;
    errorMessage: string;
}

export interface IEntityResponse {
    name: string;
    properties: IEntityResponseProperties;
}

export class AzureResourceManagerService extends BaseService.BaseService {
    protected _apiVersion: string = "2015-09-01";

    private _resourceProviderNamespace: string = "Microsoft.DataFactory";
    private _baseUrl: string = "/subscriptions/{subscriptionId}/resourcegroups/" +
    "{resourceGroupName}/providers/" + this._resourceProviderNamespace + "/" +
    "datafactories/{factoryName}";

    private _pipelinesUrl = this._baseUrl + "/datapipelines";
    private _pipelineUrl: string = this._pipelinesUrl + "/{pipelineName}";
    private _datasetsUrl = this._baseUrl + "/datasets";
    private _datasetUrl = this._datasetsUrl + "/{tableName}";
    private _slicesUrl: string = this._datasetUrl + "/slices";
    private _linkedServicesUrl: string = this._baseUrl + "/linkedservices";
    private _linkedServiceUrl: string = this._linkedServicesUrl + "/{linkedServiceName}";
    private _listGatewayUrl: string = this._baseUrl + "/gateways";
    private _gatewayUrl: string = this._baseUrl + "/gateways/{gatewayName}";
    private _activityRunUrl: string = this._baseUrl + "/activitywindows";
    private _runRecordsUrl = this._datasetUrl + "/sliceruns";
    private _runRecordUrl = this._baseUrl + "/runs/{runId}";
    private _entityUrl = this._baseUrl + "/{entityType}/{entityName}";

    constructor(appcontext: AppContext.AppContext, moduleName: string, apiVersion?: string) {
        super(appcontext, logger, moduleName);
        if (apiVersion) {
            this._apiVersion = apiVersion;
        }
    }

    // API
    public setSliceStatus(baseUrlParams: ISliceResourceBaseUrlParams, statusParams: ISliceStatusParams): Q.Promise<void> {
        let url: string = this.getBaseUrl(this._slicesUrl, baseUrlParams);
        url += "/setstatus";
        let promise = this.ajaxQ<void>({
            url: url,
            data: JSON.stringify(statusParams),
            getData: { start: baseUrlParams.slicesStart, end: baseUrlParams.slicesEnd },
            type: "PUT",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Setting {0} factory slice status".format(baseUrlParams.factoryName), url));

        return promise;
    }

    public listUpstreamDependencies(baseUrlParams: ISliceResourceBaseUrlParams): Q.Promise<IDependency> {
        let url: string = this.getBaseUrl(this._slicesUrl, baseUrlParams);
        url += "/dependencychain";
        let data = { start: baseUrlParams.slicesStart, end: baseUrlParams.slicesEnd, dependencyType: "UpStream" };

        let promise = this.ajaxQ<IDependency>({
            url: url,
            data: data,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Slice dependency for {0} DataFactory".format(baseUrlParams.factoryName), url));

        return promise;
    }

    public listUpstreamSlicesOfInterest(baseUrlParams: ISliceResourceBaseUrlParams): Q.Promise<IStandardResponse<IDependency[]>> {
        let url: string = this.getBaseUrl(this._slicesUrl, baseUrlParams);
        url += "/upstreamofinterest";
        let data = { start: baseUrlParams.slicesStart, end: baseUrlParams.slicesEnd, top: "20", compressSlices: "False" };

        let promise = this.ajaxQ<IStandardResponse<IDependency[]>>({
            url: url,
            data: data,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Upstream slice of interest for {0} DataFactory".format(baseUrlParams.factoryName), url));

        return promise;
    }

    public pausePipeline(baseUrlParams: IPipelineResourceBaseUrlParams, pauseParams: IPipelinePauseParams): Q.Promise<void> {
        let url: string = this.getBaseUrl(this._pipelineUrl, baseUrlParams);
        url += "/pause";
        let promise = this.ajaxQ<void>({
            url: url,
            data: pauseParams,
            type: "POST",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Pausing {0} pipeline".format(baseUrlParams.pipelineName), url));

        return promise;
    }

    public resumePipeline(baseUrlParams: IPipelineResourceBaseUrlParams): Q.Promise<void> {
        let url: string = this.getBaseUrl(this._pipelineUrl, baseUrlParams);
        url += "/resume";
        let promise = this.ajaxQ<void>({
            url: url,
            type: "POST",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Resuming {0} pipeline".format(baseUrlParams.pipelineName), url));

        return promise;
    }

    public deployPipeline(baseUrlParams: IPipelineResourceBaseUrlParams, deployParams: IPipelineDeployParams): Q.Promise<void> {
        let url: string = this.getBaseUrl(this._pipelineUrl, baseUrlParams);

        let promise = this.ajaxQ<void>({
            url: url,
            type: "PUT",
            data: JSON.stringify(deployParams),
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Deploying {0} pipeline".format(baseUrlParams.pipelineName), url));

        return promise;
    }

    public createLinkedService(baseUrlParams: ILinkedServiceResourceBaseUrlParams, createParams: ILinkedServiceParams): Q.Promise<void> {
        let url: string = this.getBaseUrl(this._linkedServiceUrl, baseUrlParams);

        let promise = this.ajaxQ<void>({
            url: url,
            type: "PUT",
            data: JSON.stringify(createParams),
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Failed to create {0} linked service".format(baseUrlParams.linkedServiceName), url));

        return promise;
    }

    public createEntity(baseUrlParams: IEntityBaseUrlParams, createPayload: Object): Q.Promise<IEntityResponse> {
        let url: string = this.getBaseUrl(this._entityUrl, baseUrlParams);

        let promise = this.ajaxQ<IEntityResponse>({
            url: url,
            type: "PUT",
            data: JSON.stringify(createPayload),
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Failed to create entity {0}".format(baseUrlParams.entityName), url));

        return promise;
    }

    public listLinkedServices(baseUrlParams: IDataFactoryResourceBaseUrlParams): Q.Promise<Object> {
        let url: string = this.getBaseUrl(this._linkedServicesUrl, baseUrlParams);

        return this.ajaxQ<IStandardResponse<Object>>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        }).then((data) => {
            return data.value;
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to retrieve Linked services for params {0}. Reason: {1}.".format(JSON.stringify(baseUrlParams),
                JSON.stringify(reason)));
            return Q.reject<Object>(reason);
        });
    }

    public listGateways(baseUrlParams: IDataFactoryResourceBaseUrlParams): Q.Promise<Object> {
        let url: string = this.getBaseUrl(this._listGatewayUrl, baseUrlParams);
        let promise = this.ajaxQ<Object>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Gateways for the {0} factory".format(baseUrlParams.factoryName), url));

        return promise;
    }

    public createGateway(baseUrlParams: IGatewayResourceBaseUrlParams, gatewayParams: IGatewayParams): Q.Promise<IGatewayResponse> {
        let url: string = this.getBaseUrl(this._gatewayUrl, baseUrlParams);
        let data = JSON.stringify(gatewayParams);
        let promise = this.ajaxQ<IGatewayResponse>({
            url: url,
            type: "PUT",
            data: data,
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail((error: JQueryXHR) => {
            logger.logError("Failed to create gateway {0} for the factory {1}".format(baseUrlParams.gatewayName, baseUrlParams.factoryName) + JSON.stringify(error));
        });

        return promise;
    }

    public verifyGateway(baseUrlParams: IGatewayResourceBaseUrlParams): Q.Promise<void> {
        let url: string = this.getBaseUrl(this._gatewayUrl, baseUrlParams);
        url += "/verifyname";
        let promise = this.ajaxQ<void>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail((error: JQueryXHR) => {
            logger.logError("Failed to verify gateway {0} for the factory {1}".format(baseUrlParams.gatewayName, baseUrlParams.factoryName) + JSON.stringify(error));
        });

        return promise;
    }

    public getGateway(baseUrlParams: IGatewayResourceBaseUrlParams): Q.Promise<IGatewayResponse> {
        let url: string = this.getBaseUrl(this._gatewayUrl, baseUrlParams);
        let promise = this.ajaxQ<IGatewayResponse>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail((error: JQueryXHR) => {
            logger.logError("Failed to get gateway {0} for the factory {1}".format(baseUrlParams.gatewayName, baseUrlParams.factoryName) + JSON.stringify(error));
        });

        return promise;
    }

    public deleteGateway(baseUrlParams: IGatewayResourceBaseUrlParams): Q.Promise<IGatewayResponse> {
        let url: string = this.getBaseUrl(this._gatewayUrl, baseUrlParams);
        let promise = this.ajaxQ<IGatewayResponse>({
            url: url,
            type: "DELETE",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail((error: JQueryXHR) => {
            logger.logError("Failed to delete gateway {0} for the factory {1}".format(baseUrlParams.gatewayName, baseUrlParams.factoryName) + JSON.stringify(error));
        });

        return promise;
    }

    public listActivityWindows(
        baseUrlParams: IDataFactoryResourceBaseUrlParams,
        activityWindowParams: IMonitoringServiceParams,
        nextLink: string = null,
        fetchAllPages: boolean = false): Q.Promise<IStandardResponse<ActivityWindowModel.IActivityWindow[]>> {

        let deferred = Q.defer<IStandardResponse<ActivityWindowModel.IActivityWindow[]>>();
        let usingNextLink = nextLink && nextLink !== "";
        let url: string = usingNextLink ? nextLink : this.getBaseUrl(this._activityRunUrl, baseUrlParams);

        this.ajaxQ<IStandardResponse<{ activityWindows: ActivityWindowModel.IActivityWindow[] }>>({
            url: url,
            type: "POST",
            contentType: JSON_CONTENT_TYPE,
            processData: false,
            data: JSON.stringify(activityWindowParams)
        }, usingNextLink).then((response) => {
            let responseHasNextLink = response.nextLink && response.nextLink !== "";
            if (fetchAllPages && responseHasNextLink) {
                this.listActivityWindows(baseUrlParams, activityWindowParams, response.nextLink, true).then((newData) => {
                    deferred.resolve({ value: response.value.activityWindows.concat(newData.value) });
                }, this._appContext.errorHandler.makeResourceFailedHandler("Failed to fetch activity windows for {0} data factory".format(baseUrlParams.factoryName), response.nextLink, deferred));
            } else {
                deferred.resolve({
                    value: response.value.activityWindows,
                    nextLink: responseHasNextLink ? response.nextLink : null
                });
            }
        }, this._appContext.errorHandler.makeResourceFailedHandler("Failed to fetch activity windows for {0} data factory".format(baseUrlParams.factoryName), url, deferred));

        return deferred.promise;
    }

    public getDataFactory(baseUrlParams: IDataFactoryResourceBaseUrlParams) {
        let url: string = this.getBaseUrl(this._baseUrl, baseUrlParams);

        let promise = this.ajaxQ<Object>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Getting information about data factory {0} failed".format(baseUrlParams.factoryName), url));

        return promise;
    }

    public getUserPermissions(resourceId: string): Q.Promise<ArmContracts.IPermissionRule[]> {
        let getData: StringMap<string> = {
            "api-version": "2015-05-01-preview"
        };

        let deferred = Q.defer<ArmContracts.IPermissionRule[]>();
        this.ajaxQ<IStandardResponse<ArmContracts.IPermissionRule[]>>({
            url: "{0}/providers/Microsoft.Authorization/permissions".format(resourceId),
            type: "GET",
            contentType: JSON_CONTENT_TYPE,
            data: getData
        }).then((data) => {
            // TODO paverma The data layer that consumes this api call (the one that is sandwiched between this and actual consumer),
            // should be taking care of the pagination.
            deferred.resolve(data.value);
        }, (reason) => {
            logger.logError("Failed to verify user permissions", reason);
            deferred.reject(reason);
        });
        return deferred.promise;
    }

    public getLinkedService(baseUrlParams: ILinkedServiceResourceBaseUrlParams): Q.Promise<ILinkedService> {
        let url: string = this.getBaseUrl(this._linkedServiceUrl, baseUrlParams);

        return this.ajaxQ<ILinkedService>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        }).then((service) => {
            return service;
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to retrieve linked service for params {0}. Reason: {1}.".format(JSON.stringify(baseUrlParams),
                JSON.stringify(reason)));
            return Q.reject<ILinkedService>(reason);
        });
    }

    public getEntity(baseUrlParams: IEntityBaseUrlParams): Q.Promise<IEntityResponse> {
        let url: string = this.getBaseUrl(this._entityUrl, baseUrlParams);

        let promise = this.ajaxQ<IEntityResponse>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Failed to get entity {0}".format(baseUrlParams.entityName), url));
        return promise;
    }

    // TODO Also Consider updating these api's to use arm's invoke api.
    // TODO paverma Create better interfaces for these after the api version upgrade.
    public listPipelines(baseUrlParams: IDataFactoryResourceBaseUrlParams): Q.Promise<Object> {
        let url: string = this.getBaseUrl(this._pipelinesUrl, baseUrlParams);

        return this.ajaxQ<IStandardResponse<Object>>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        }).then((data) => {
            return data.value;
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to retrieve pipelines for params {0}. Reason: {1}.".format(JSON.stringify(baseUrlParams),
                JSON.stringify(reason)));
            return Q.reject<Object>(reason);
        });
    }

    public getPipeline(baseUrlParams: IPipelineResourceBaseUrlParams): Q.Promise<Object> {
        let url: string = this.getBaseUrl(this._pipelineUrl, baseUrlParams);

        return this.ajaxQ<Object>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        }).then((data) => {
            return data;
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to retrieve pipeline for params {0}. Reason: {1}.".format(JSON.stringify(baseUrlParams),
                JSON.stringify(reason)));
            return Q.reject<Object>(reason);
        });
    }

    public listDatasets(baseUrlParams: IDataFactoryResourceBaseUrlParams): Q.Promise<Object> {
        let url: string = this.getBaseUrl(this._datasetsUrl, baseUrlParams);

        return this.ajaxQ<IStandardResponse<Object>>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        }).then((data) => {
            return data.value;
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to retrieve datasets for params {0}. Reason: {1}.".format(JSON.stringify(baseUrlParams),
                JSON.stringify(reason)));
            return Q.reject<Object>(reason);
        });
    }

    public listSlices(baseUrlParams: ISliceResourceBaseUrlParams): Q.Promise<Object> {
        let url: string = this.getBaseUrl(this._slicesUrl, baseUrlParams);

        return this.ajaxQ<IStandardResponse<Object>>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        }).then((data) => {
            return data.value;
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to retrieve slices for params {0}. Reason: {1}.".format(JSON.stringify(baseUrlParams),
                JSON.stringify(reason)));
            return Q.reject<Object>(reason);
        });
    }

    public listRunRecords(baseUrlParams: IDatasetResourceBaseUrlParams, queryParams: ISliceResourceQueryParams): Q.Promise<Object> {
        let url: string = this.getBaseUrl(this._runRecordsUrl, baseUrlParams);

        return this.ajaxQ<IStandardResponse<Object>>({
            url: url,
            type: "GET",
            data: queryParams,
            contentType: JSON_CONTENT_TYPE
        }).then((data) => {
            return data.value;
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to retrieve run records for params {0}, {1}. Reason: {2}.".format(JSON.stringify(baseUrlParams),
                JSON.stringify(queryParams), JSON.stringify(reason)));
            return Q.reject<Object>(reason);
        });
    }

    public getRunRecord(baseUrlParams: IRunRecordBaseUrlParams): Q.Promise<Object> {
        let url: string = this.getBaseUrl(this._runRecordUrl, baseUrlParams);

        return this.ajaxQ<Object>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        }).then((data) => {
            return data;
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to retrieve run record for params {0}. Reason: {1}.".format(JSON.stringify(baseUrlParams),
                JSON.stringify(reason)));
            return Q.reject<Object>(reason);
        });
    }

    public getDataset(baseUrlParams: IDatasetResourceBaseUrlParams): Q.Promise<IGetDataset> {
        let url: string = this.getBaseUrl(this._datasetUrl, baseUrlParams);

        return this.ajaxQ<IGetDataset>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        }).then((dataset) => {
            return dataset;
        }, (reason) => {
            logger.logError("Failed to retrieve dataset for params {0}. Reason: {1}.".format(JSON.stringify(baseUrlParams),
                JSON.stringify(reason)));
            return Q.reject<IGetDataset>(reason);
        });
    }

    public createDataset(baseUrlParams: IDatasetResourceBaseUrlParams, datasetParams: IGetDataset): Q.Promise<void> {
        let url: string = this.getBaseUrl(this._datasetUrl, baseUrlParams);

        let data = JSON.stringify(datasetParams);

        let promise = this.ajaxQ<void>({
            url: url,
            type: "PUT",
            contentType: JSON_CONTENT_TYPE,
            data: data
        });

        promise.fail(this._appContext.errorHandler.makeResourceFailedHandler("Creating {0} dataset failed".format(baseUrlParams.tableName), url));;

        return promise;
    }
}
