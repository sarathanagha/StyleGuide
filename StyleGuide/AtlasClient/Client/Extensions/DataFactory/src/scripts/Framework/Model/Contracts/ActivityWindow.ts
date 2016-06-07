import BaseEncodable = require("./BaseEncodable");
import DateTime = require("../../Util/Datetime");

"use strict";

export interface IActivityWindowParameters extends IActivityWindow {
    copyPairs: Object;
    displayState: string;
    displayStateHtml: string;
    entities: BaseEncodable.EncodableSet;
    reservedId: string;
    stateId: string;
    runEndPair: DateTime.ITimePair;
    runStartPair: DateTime.ITimePair;
    stateDescription: string;
    statusCalendarStatus: string;
    waiting: boolean; // Whether or not the HTML status shows "Waiting"
    windowEndPair: DateTime.ITimePair;
    windowPair: DateTime.ITimePair;
    windowStartPair: DateTime.ITimePair;
}

export interface IActivityWindow {
    activityName: string;
    activityType: string;
    dataFactoryName: string;
    duration: string;
    inputDatasetIds: string[];
    inputDatasets: string[];
    linkedServiceName: string;
    outputDatasetIds: string[];
    outputDatasets: string[];
    percentComplete: number;
    pipelineName: string;
    resourceGroupName: string;
    runAttempts: number;
    runEnd: string;
    runStart: string;
    windowEnd: string;
    windowStart: string;
    windowState: string;
    windowSubstate: string;
};

export module ServiceColumnNames {
    export const EventNamespave = "EventNamespace";
    export const Key = "Key";
    export const Scope = "Scope";
    export const Tenant = "Tenant";
    export const Timestamp = "Timestamp";

    export module ExtendedProperties {
        export const ActivityId = "ActivityId";
        export const ActivityName = "ActivityName";
        export const ActivityType = "ActivityType";
        export const Attempts = "Attempts";
        export const DataFactoryId = "DataFactoryId";
        export const DataFactoryName = "DataFactoryName";
        export const DurationMs = "DurationMs";
        export const InputTables = "InputTables";
        export const OutputTables = "OutputTables";
        export const PercentageComplete = "PercentageComplete";
        export const PipelineId = "PipelineId";
        export const PipelineName = "PipelineName";
        export const ResourceGroup = "ResourceGroup";
        export const WindowStart = "WindowStart";
        export const WindowEnd = "WindowEnd";
        export const LastRunStart = "LastRunStart";
        export const LastRunEnd = "LastRunEnd";
        export const LastRunStatus = "LastRunStatus";
        export const WindowState = "WindowState";
        export const WindowStatus = "WindowStatus";
        export const WindowSubstate = "WindowSubstate";
    };
}

// TODO paverma Confirm the list of statuses.
export module Status {
    export const Succeeded = "Succeeded";
    export const Failed = "FailedExecution";
    export const TimedOut = "TimedOut";
    export const Starting = "Starting";
    export const AllocatingResources = "AllocatingResources";
    export const Configuring = "Configuring";
    export const Retry = "Retry";
    export const Running = "Running";
}

// TODO paverma Determine if these should be picked up from the ClientResources or not.
export const StatusLabel: { [s: string]: string } = {
    LongRetry: "Long retry",
    TimedOut: "Timed out",
    AllocatingResources: "Allocating resources",
    FailedExecution: "Failed"
};

export interface IState {
    name: string;
    displayName: string;
    description?: string;
    substates?: {};
}

export interface ISubstate {
    name: string;
    displayName: string;
    description: string;
}

export module States {
    export const Ready: IState = {
        name: "Ready",
        displayName: ClientResources.ReadyDisplayName,
        description: ClientResources.ReadyDescription
    };

    export const Waiting: IState = {
        name: "Waiting",
        displayName: ClientResources.WaitingDisplayName,
        substates: {
            ScheduledTime: <ISubstate>{
                name: "ScheduledTime",
                displayName: ClientResources.ScheduledTimeDisplayName,
                description: ClientResources.ScheduledTimeDescription
            },
            DatasetDependencies: <ISubstate>{
                name: "DatasetDependencies",
                displayName: ClientResources.DatasetDependenciesDisplayName,
                description: ClientResources.DatasetDependenciesDescription
            },
            ComputeResources: <ISubstate>{
                name: "ComputeResources",
                displayName: ClientResources.ComputeResourcesDisplayName,
                description: ClientResources.ComputeResourcesDescription
            },
            ConcurrencyLimit: <ISubstate>{
                name: "ConcurrencyLimit",
                displayName: ClientResources.ConcurrencyLimitDisplayName,
                description: ClientResources.ConcurrencyLimitDescription
            },
            ActivityResume: <ISubstate>{
                name: "ActivityResume",
                displayName: ClientResources.ActivityResumeDisplayName,
                description: ClientResources.ActivityResumeDescription
            },
            Retry: <ISubstate>{
                name: "Retry",
                displayName: ClientResources.RetryDisplayName,
                description: ClientResources.RetryDescription
            },
            Validation: <ISubstate>{
                name: "Validation",
                displayName: ClientResources.ValidationDisplayName,
                description: ClientResources.WaitingValidationDescription
            },
            ValidationRetry: <ISubstate>{
                name: "ValidationRetry",
                displayName: ClientResources.ValidationRetryDisplayName,
                description: ClientResources.ValidationRetryDescription
            }
        }
    };

    export const InProgress: IState = {
        name: "InProgress",
        displayName: ClientResources.InProgressDisplayName,
        description: ClientResources.InProgressDescription,
        substates: {
            Validating: <ISubstate>{
                name: "Validating",
                displayName: ClientResources.ValidatingDisplayName,
                description: ClientResources.ValidatingDescription
            }
        }
    };

    export const Failed: IState = {
        name: "Failed",
        displayName: ClientResources.FailedDisplayName,
        description: ClientResources.FailedDescription,
        substates: {
            TimedOut: <ISubstate>{
                name: "TimedOut",
                displayName: ClientResources.TimedOutDisplayName,
                description: ClientResources.TimedOutDescription
            },
            Canceled: <ISubstate>{
                name: "Canceled",
                displayName: ClientResources.CanceledDisplayName,
                description: ClientResources.CanceledDescription
            },
            Validation: <ISubstate>{
                name: "Validation",
                displayName: ClientResources.ValidationDisplayName,
                description: ClientResources.FailedValidationDescription
            }
        }
    };

    export const Skipped: IState = {
        name: "Skipped",
        displayName: ClientResources.SkippedDisplayName,
        description: ClientResources.SkippedDescription
    };

    export const None: IState = {
        name: "None",
        displayName: ClientResources.NoneDisplayName,
        description: ClientResources.NoneDescription
    };
}
