/// <reference path="SolutionProvisionState.ts" />
/// <reference path="Resource.ts" />

module Microsoft.DataStudio.SolutionAccelerator.Model {

    export interface SolutionAccelerator {
        title: string;
        description: string;
        graphTemplate: any;
        imageUrl: string;
        moduleUrl: string;
        templateId: string;

        resources: Resource[];
        provisionState: SolutionProvisionState;
        resourceGroupName: string;
        exeLinks: string[];
        partitionKey: string;
        rowKey: string;
        timestamp: string;
        eTag: string;
    }

    export interface SolutionAcceleratorTemplate
    {
        graphType: string;
        description: string;
        graphTemplate: any;
    }
}
