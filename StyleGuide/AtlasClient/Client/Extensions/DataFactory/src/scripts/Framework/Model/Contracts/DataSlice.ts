/// <reference path="../../../../References.d.ts" />

"use strict";

// TODO: Auto-generate these strings
export module SliceStatus {
    export const NotSpecified = "NotSpecified";
    export const PendingExecution = "PendingExecution";
    export const InProgress = "InProgress";
    export const Failed = "Failed";
    export const Ready = "Ready";
    export const Skip = "Skip";
    export const Retry = "Retry";
    export const TimedOut = "TimedOut";
    export const PendingValidation = "PendingValidation";
    export const RetryValidation = "RetryValidation";
    export const FailedValidation = "FailedValidation";
    export const LongRetry = "LongRetry";
    export const ValidationInProgress = "ValidationInProgress";
    export const None = "None";
}

export enum UpdateType {
    INDIVIDUAL = 0,
    UPSTREAM_IN_PIPELINE = 1
}

export interface IDataSlice {
    Status: string;
    RetryCount: number;
    Start: string;
    End: string;
}

export const sliceStatusToResourceMap: { [s: string]: string } = Object.create(null);

sliceStatusToResourceMap[SliceStatus.NotSpecified] = ClientResources.statusNotSpecified;
sliceStatusToResourceMap[SliceStatus.PendingExecution] = ClientResources.statusPendingExecution;
sliceStatusToResourceMap[SliceStatus.InProgress] = ClientResources.statusInProgress;
sliceStatusToResourceMap[SliceStatus.Failed] = ClientResources.statusFailed;
sliceStatusToResourceMap[SliceStatus.Ready] = ClientResources.statusReady;
sliceStatusToResourceMap[SliceStatus.Skip] = ClientResources.statusSkip;
sliceStatusToResourceMap[SliceStatus.Retry] = ClientResources.statusRetry;
sliceStatusToResourceMap[SliceStatus.TimedOut] = ClientResources.statusTimedOut;
sliceStatusToResourceMap[SliceStatus.PendingValidation] = ClientResources.statusPendingValidation;
sliceStatusToResourceMap[SliceStatus.RetryValidation] = ClientResources.statusRetryValidation;
sliceStatusToResourceMap[SliceStatus.FailedValidation] = ClientResources.statusFailedValidation;
sliceStatusToResourceMap[SliceStatus.LongRetry] = ClientResources.statusLongRetry;
sliceStatusToResourceMap[SliceStatus.ValidationInProgress] = ClientResources.statusValidationInProgress;
sliceStatusToResourceMap[SliceStatus.None] = ClientResources.statusNone;

export const sliceStatusToDescriptionMap: { [s: string]: string } = {};

sliceStatusToDescriptionMap[SliceStatus.PendingExecution] = ClientResources.statusPendingExecutionDescription;
sliceStatusToDescriptionMap[SliceStatus.InProgress] = ClientResources.statusInProgressDescription;
sliceStatusToDescriptionMap[SliceStatus.Failed] = ClientResources.statusFailedDescription;
sliceStatusToDescriptionMap[SliceStatus.Ready] = ClientResources.statusReadyDescription;
sliceStatusToDescriptionMap[SliceStatus.Skip] = ClientResources.statusSkipDescription;
sliceStatusToDescriptionMap[SliceStatus.Retry] = ClientResources.statusRetryDescription;
sliceStatusToDescriptionMap[SliceStatus.TimedOut] = ClientResources.statusTimedOutDescription;
sliceStatusToDescriptionMap[SliceStatus.PendingValidation] = ClientResources.statusPendingValidationDescription;
sliceStatusToDescriptionMap[SliceStatus.RetryValidation] = ClientResources.statusRetryValidationDescription;
sliceStatusToDescriptionMap[SliceStatus.FailedValidation] = ClientResources.statusFailedValidationDescription;
sliceStatusToDescriptionMap[SliceStatus.LongRetry] = ClientResources.statusLongRetryDescription;
sliceStatusToDescriptionMap[SliceStatus.ValidationInProgress] = ClientResources.statusValidationInProgressDescription;
sliceStatusToDescriptionMap[SliceStatus.None] = ClientResources.statusNoneDescription;

// TODO paverma Also consider subclassing instead of having optional properties.
// TODO paverma Why is corepayload needed? I find it improbable to ever use it. Confirm with Bogdan.
// TODO tilarden: this should be added to the TypeMetadataModels when it's integrated.
export interface IDataSlicePrimaryEvent {
    CorePayload: {
        reserved_EventNamespace: string;
        reserved_Id: string;
        reserved_Key: string;
        reserved_Scope: string;
        reserved_Tenant: string;
        reserved_Timestamp: string;
    };
    ExtendedPayload: {
        DataFactoryId?: string;
        DataFactoryName?: string;
        TableId?: string;
        TableName: string;
        Start: string;         // date // TODO paverma Add support for converting them to the date objects.
        End: string;           // date
        Status: string;
        State?: string;
        Substate?: string;
        LatencyStatus?: string;
        RetryCount?: number;
        LongRetryCount?: number;
        StatusUpdateTimeStamp?: number;
    };
}
