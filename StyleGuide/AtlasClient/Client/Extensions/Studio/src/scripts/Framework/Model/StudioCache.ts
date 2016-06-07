import DataCache = require("./DataCache");
import DataConstants = require("../Shared/DataConstants");
import Resource = require("../../Contracts/Resource");

export interface IStudioParams {
    subscriptionId: string;
}

export interface IModulePrimitivesParams extends IStudioParams {
    moduleName: string;
}

// TODO pacodel Complete the object using the typemetadata info, because the code assumes that.
// Moreover if the objects are constructed with "use strict", which they will be, it would still
// be required.
export class StudioCache {
    private availableModulesCacheObject: DataCache.DataCache<StudioExtension.DataModels.StudioModule[]> = null;
    private modulePrimitivesCacheObject: DataCache.DataCache<Resource.IResource[]> = null;
    private azureResourcesCacheObject: DataCache.DataCache<Resource.IResource[]> = null;

    private _availableModulesUrl: string = DataConstants.ModulesUri + "/GetAvailableModule";
    private _modulePrimitivesUrl: string = "Subscriptions/{subscriptionId}/Modules/{moduleName}/Primitives";
    private _azureResourcesUrl: string = "Subscriptions/{subscriptionId}/Resources";
    
    constructor(service: CAStudio.IService) {
        this.availableModulesCacheObject = new DataCache.DataCache<StudioExtension.DataModels.StudioModule[]>({
            serviceObject: service,
            requestParams: {
                url: this._availableModulesUrl,
                type: "GET",
                contentType: "application/json"
            }
        });
        
        this.modulePrimitivesCacheObject = new DataCache.DataCache<Resource.IResource[]>({
            serviceObject: service,
            requestParams: {
                url: this._modulePrimitivesUrl,
                type: "GET",
                contentType: "application/json"
            }
        });
        
        this.azureResourcesCacheObject = new DataCache.DataCache<Resource.IResource[]>({
            serviceObject: service,
            requestParams: {
                url: this._azureResourcesUrl,
                type: "GET",
                contentType: "application/json"
            }
        });
    }
    
    public GetAvailableModules(baseUrlParams: IStudioParams, fetchParams: IStudioParams, callback, cache: boolean = false): void {
        let url: string = this.getBaseUrl(this._availableModulesUrl, baseUrlParams);
        var promise; 
        var useCache = cache;
        if(url != this.availableModulesCacheObject.getUrl()){
            this.availableModulesCacheObject.setUrl(url);
            useCache = false;
        }
        promise = this.availableModulesCacheObject.fetch(fetchParams, useCache);
        promise.then((data: StudioExtension.DataModels.StudioModule[]) => callback(data));
    }
    
    public GetModulePrimitives(baseUrlParams: IModulePrimitivesParams, fetchParams: IStudioParams, callback, cache: boolean = false): void  {
        // NOTE tilarden: Generate mock resources for the DataFactory module for now.
        if(baseUrlParams.moduleName === "DataFactory") {
            this.getMockResources(callback);
            return;
        }

        let url: string = this.getBaseUrl(this._modulePrimitivesUrl, baseUrlParams);
        var promise; 
        var useCache = cache;
        if(url != this.modulePrimitivesCacheObject.getUrl()){
            this.modulePrimitivesCacheObject.setUrl(url);
            useCache = false;
        }
        this.modulePrimitivesCacheObject.setUrl(url);
        promise = this.modulePrimitivesCacheObject.fetch(fetchParams, useCache);
        promise.then((data: Resource.IResource[]) => callback(data));
    }
    
    public GetAzureResources(baseUrlParams: IStudioParams, fetchParams: IStudioParams, callback, cache: boolean = false): void  {
        let url: string = this.getBaseUrl(this._azureResourcesUrl, baseUrlParams);
        var promise; 
        var useCache = cache;
        if(url != this.azureResourcesCacheObject.getUrl()){
            this.azureResourcesCacheObject.setUrl(url);
            useCache = false;
        }
        this.azureResourcesCacheObject.setUrl(url);
        promise = this.azureResourcesCacheObject.fetch(fetchParams, useCache);
        promise.then((data: Resource.IResource[]) => callback(data));
    }
    
    protected getBaseUrl(baseUrl: string, baseUrlParams: Object): string {
        return baseUrl.slice().replace(/{([^}]+)}/g, (matchedString: string, varName: string) => {
            return baseUrlParams[varName].toString();
        });
    }

    public stripValue(data: {value: Object}): Object {
        return data.value;
    }
    
    private getMockResources(callback: (data: Resource.IResource[]) => {}): void {
        let mockResources: Resource.IResource[] = [
            {
                Name: ko.observable("Copy Activity"),
                Category: ko.observable("Activities"),
                Id: ko.observable("CopyActivity"),
                Description: ko.observable("Copy Activity"),
                FamilyId: ko.observable("DataFactory"),
                Items: ko.observableArray([]),
                InputPorts: ko.observableArray([]),
                OutputPorts: ko.observableArray([]),
                Properties: ko.observableArray([])
            },
            {
                Name: ko.observable("Hive Activity"),
                Category: ko.observable("Activities"),
                Id: ko.observable("HiveActivity"),
                Description: ko.observable("Hive Activity"),
                FamilyId: ko.observable("DataFactory"),
                Items: ko.observableArray([]),
                InputPorts: ko.observableArray([]),
                OutputPorts: ko.observableArray([]),
                Properties: ko.observableArray([])
            },
            {
                Name: ko.observable("Pig Activity"),
                Category: ko.observable("Activities"),
                Id: ko.observable("PigActivity"),
                Description: ko.observable("Pig Activity"),
                FamilyId: ko.observable("DataFactory"),
                Items: ko.observableArray([]),
                InputPorts: ko.observableArray([]),
                OutputPorts: ko.observableArray([]),
                Properties: ko.observableArray([])
            }
        ];
        callback(mockResources);
    };
}
