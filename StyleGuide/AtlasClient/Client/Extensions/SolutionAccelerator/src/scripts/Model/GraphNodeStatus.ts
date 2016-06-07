module Microsoft.DataStudio.SolutionAccelerator.Model.Graph {

    export enum GraphNodeStatus {
        WaitForDeploy, // resource only, note name cannot start with "Not", scss will mess up
        InProgress,
        Succeeded,
        Failed,
        Stopped,    // resource only
        Deleted,
        Deleting,
        DeleteReqested,
        DeleteFailed
    }
}
