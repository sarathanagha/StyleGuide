/// <reference path="../../References.d.ts" />
/// <reference path="../Model/SolutionAccelerator.ts" />

module Microsoft.DataStudio.SolutionAccelerator.Services {

    export interface SolutionAcceleratorService {

        getAllDeployedSolutions(): Promise<any[]>;

        getDeployedSolutionStatus(solutionId: string, solutionSubscriptionId: string): Promise<any[]>;

        deploySolution(solutionId: string, templateId: string, subscriptionId: string, templateParams: string, resourceGroupName?: string): Promise<any[]>;

        deleteSolution(solutionId: string, solutionSubscriptionId: string ): Promise<any[]>;
    }
}
