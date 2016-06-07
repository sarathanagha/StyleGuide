"use strict";

export interface IIdentifier {
    id: string;
    name: string;
}

export interface IBaseMdpParameters {
    subscriptionId: string;
    resourceGroupName: string;
}

export interface IFactoryScopedParameters extends IBaseMdpParameters {
    factoryName: string;
}

export module ProvisioningState {
    // Being defined from $/Data Pipeline/Main/Product/Source/PlatformV2/Coordination/CoordinationContracts/EntityStatus.cs
    // EntityStatus enum.
    export const NotSpecified = "NotSpecified";
    export const PendingCreation = "PendingCreation";
    export const Succeeded = "Succeeded";
    export const PendingUpdate = "PendingUpdate";
    export const PendingDeletion = "PendingDeletion";
    export const Failed = "Failed";
    export const PendingRecreation = "PendingRecreation";
    export const Disabled = "Disabled";
    export const Running = "Running";
}
