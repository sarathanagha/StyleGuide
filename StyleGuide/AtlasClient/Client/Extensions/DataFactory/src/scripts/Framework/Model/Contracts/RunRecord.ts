// TODO paverma Confirm if these statuses should be matching the ones on the ActivityWindow
export module Status {
    export const Starting = "Starting";
    export const Configuring = "Configuring";
    export const AllocatingResources = "AllocatingResources";
    export const FailedResourceAllocation = "FailedResourceAllocation";
    export const Running = "Running";
    export const Succeeded = "Succeeded";
    export const FailedExecution = "FailedExecution";
    export const TimedOut = "TimedOut";
    export const Canceled = "Canceled";
    export const FailedValidation = "FailedValidation";
}

// TODO paverma Confirm if these should instead be picked up from the client resources.
// That would mean that all of the strings will have to be listed out here.
export const StatusLabel: StringMap<string> = {
    AllocatingResources: "Allocating resources",
    FailedResourceAllocation: "Failed resource allocation",
    FailedExecution: "Failed execution",
    TimedOut: "Timed out",
    FailedValidation: "Failed validation"
};
