"use strict";

export module EntityType {
    export const table = "table";
    export const pipeline = "datapipeline";
    export const linkedService = "linkedservice";
    export const gateway = "gateway";
}

export const MonitoringModuleName = "Monitoring";
export const PowerCopyToolModuleName = "CodeFreeCopy";

export const ApiUri = "/api";
export const ActivityRunsUri = ApiUri + "/ActivityRuns";
export const FactoryUri = ApiUri + "/DataFactory";
export const DataArtifactUri = ApiUri + "/" + EntityType.table;
export const DataSlicesUri = ApiUri + "/DataSlice";
export const DefaultSubscriptionId = "68BB21FC-7AF0-4126-BE17-76F2942DEEDF";
export const DefaultResourceGroupName = "ResourceGroup";
export const RunRecordUri = ApiUri + "/RunRecord";
export const RunLogUri = ApiUri + "/RunLog";
export const PipelineUri = ApiUri + "/" + EntityType.pipeline;
export const LinkedServiceUri = ApiUri + "/" + EntityType.linkedService;
export const GatewayUri = ApiUri + "/" + EntityType.gateway;
export const ResourceUri = ApiUri + "/Resource";
export const RegionUri = ApiUri + "/Region";
export const DataFactoryResourceId = "Microsoft.DataFactory/dataFactories";
export const DataFactoryProvider = "Microsoft.DataFactory";
export const LayoutUri = ApiUri + "/Layout";
export const LayoutGraphUri = LayoutUri + "/LayoutGraph";
export const RemoveOverlapsUri = LayoutUri + "/RemoveOverlaps";
export const IsFactoryNameAvailableUri = ApiUri + "/FactoryNameAvailability";
export const GetBlobAsStringUri = ApiUri + "/MdpBase/GetBlobAsString";
export const dateColumnWidth = ko.observable<string>("170px");
export const fileBytesLoadLimit: number = 256000; // Keep in line with the fileBytesLoadLimit in MdpBaseController
export const getMLSwaggerUri = ApiUri + "/AzureML/GetSwaggerDoc";

// Monitoring service
export const ActivityRunsMonitoringUri = "/activitywindows";
export const DataSlicesMonitoringUri = "/dataslices";

// Views/Binding name constants
export const GraphNodeStatusBindingHandler = "graphNodeStatus";
export const ActivityWindowListViewModel = "ActivityWindowListViewModel";
export const activityRunsListFilterViewModel = "ActivityRunsListFilterViewModel";
export const dateTimeFilterViewModel = "DateTimeFilterViewModel";
export const ActivityWindowDetailsViewModel = "ActivityWindowDetailsViewModel";
export let alertExplorerViewModel = "AlertExplorerViewModel";
export let datasetNodeCommands = "DatasetNodeCommands";

export module ObsArrayChangeStatus {
    export const added = "added";
    export const deleted = "deleted";
}

export interface IObservableArrayChange<T> {
    index: number;
    moved: number; // This may be undefined if an item was added or deleted, not moved
    status: string; // possible values in ObsArrayChangeStatus
    value: T;
}
