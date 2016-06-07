module Microsoft.DataStudio.SolutionAccelerator.Model {

    export interface Resource {
        ResourceId: string;
        ResourceUrl: string;
        ResourceName: string;
        ResourceGroupName: string;
        ResourceType: string;
        StatusCode: string;
        StatusMessage: string;
        ProvisioningState: string;
        Dependencies: Resource[];
    }
}
