/// <reference path="../../References.d.ts" />

export interface IAlert {
    name: KnockoutObservable<string>;
    location: KnockoutObservable<string>;
    description: KnockoutObservable<string>;
    isEnabled: KnockoutObservable<boolean>;
    operationName: KnockoutObservable<string>;
    status: KnockoutObservable<string>;
    subStatus?: KnockoutObservable<string>;
    customEmails: KnockoutObservableArray<string>;
    shouldSendToServiceOwners: KnockoutObservable<boolean>;
    resource: KnockoutObservable<string>;
    shouldAggregate: KnockoutObservable<boolean>;
    aggregationOperator?: KnockoutObservable<string>;
    aggregationThreshold?: KnockoutObservable<number>;
    aggregationWindowSize?: KnockoutObservable<string>;
}

// TODO add support for pipelines and activities if we ever want to be able to create alerts on them here
export enum AlertResourceType {
    FACTORY
}

export interface IAlertResource {
    name: KnockoutObservable<string>;
    resourceType: AlertResourceType;
}

export class AlertResource implements IAlertResource {
    public name: KnockoutObservable<string>;
    public resourceType: AlertResourceType;

    constructor(name: string, resourceType: AlertResourceType) {
        this.name = ko.observable<string>(name);
        this.resourceType = resourceType;
    }
}

// Values from https://azure.microsoft.com/en-us/documentation/articles/data-factory-monitor-manage-pipelines/#create-alerts
export let OperationNameMap: StringMap<string> = {
    "RunStarted": ClientResources.operationNameRunStarted,
    "RunFinished": ClientResources.operationNameRunFinished,
    "OnDemandClusterCreateStarted": ClientResources.operationNameOnDemandClusterCreateStarted,
    "OnDemandClusterCreateSuccessful": ClientResources.operationNameOnDemandClusterCreateSuccessful,
    "OnDemandClusterDeleted": ClientResources.operationNameOnDemandClusterDeleted
};

export let StatusMap: StringMap<string> = {
    "Started": ClientResources.statusStarted,
    "Failed": ClientResources.statusFailed,
    "Succeeded": ClientResources.statusSucceeded
};

export let SubstatusMap: StringMap<string> = {
    "": ClientResources.emptyFieldPlaceholder,
    "Starting": ClientResources.substatusStarting,
    "FailedResourceAllocation": ClientResources.substatusFailedResourceAllocation,
    "Succeeded": ClientResources.substatusSucceeded,
    "FailedExecution": ClientResources.substatusFailedExecution,
    "TimedOut": ClientResources.substatusTimedOut,
    "FailedValidation": ClientResources.substatusFailedValidation,
    "Abandoned": ClientResources.substatusAbandoned
};

export module OperationName {
    export let RunStarted = "RunStarted";
    export let RunFinished = "RunFinished";
    export let OnDemandClusterCreateStarted = "OnDemandClusterCreateStarted";
    export let OnDemandClusterCreateSuccessful = "OnDemandClusterCreateSuccessful";
    export let OnDemandClusterDeleted = "OnDemandClusterDeleted";
}

export module Status {
    export let Started = "Started";
    export let Failed = "Failed";
    export let Succeeded = "Succeeded";
}

export module Substatus {
    export let EmptySubstatus = "";
    export let Starting = "Starting";
    export let FailedResourceAllocation = "FailedResourceAllocation";
    export let Succeeded = "Succeeded";
    export let FailedExecution = "FailedExecution";
    export let TimedOut = "TimedOut";
    export let FailedValidation = "FailedValidation";
    export let Abandoned = "Abandoned";
}

// Table of acceptable mappings between operation name, status, and optional substatus
export let operationNames: OperationName[] = [
    {
        name: OperationName.RunStarted,
        statuses: [{ name: Status.Started, substatuses: [Substatus.EmptySubstatus, Substatus.Starting] }]
    },
    {
        name: OperationName.RunFinished,
        statuses: [
            { name: Status.Succeeded, substatuses: [Substatus.EmptySubstatus, Substatus.Succeeded] },
            { name: Status.Failed,
                substatuses: [Substatus.EmptySubstatus, Substatus.FailedResourceAllocation, Substatus.FailedExecution, Substatus.TimedOut, Substatus.FailedValidation, Substatus.Abandoned]
            }]
    },
    {
        name: OperationName.OnDemandClusterCreateStarted,
        statuses: [{ name: Status.Started, substatuses: [Substatus.EmptySubstatus] }]
    },
    {
        name: OperationName.OnDemandClusterCreateSuccessful,
        statuses: [{ name: Status.Succeeded, substatuses: [Substatus.EmptySubstatus] }]
    },
    {
        name: OperationName.OnDemandClusterDeleted,
        statuses: [{ name: Status.Succeeded, substatuses: [Substatus.EmptySubstatus] }]
    },
];

export type DisplayItem = {
    value: string;
    displayValue: string;
}
export type OperationName = { name: string, statuses: Status[] };
export type Status = { name: string, substatuses: string[] }
