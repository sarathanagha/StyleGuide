/// <reference path="../Services/Mocks/SolutionAcceleratorServiceMock.ts" />
/// <reference path="../Services/SolutionAcceleratorServiceImpl.ts" />
/// <reference path="../Model/Resource.ts" />

import Model = Microsoft.DataStudio.SolutionAccelerator.Model;
import ShellContext = Microsoft.DataStudio.Application.ShellContext;

module Microsoft.DataStudio.SolutionAccelerator.Managers
{
    export class SolutionAcceleratorManager
    {
        public OpenedSolutionAccelerator: KnockoutObservable<Model.SolutionAccelerator> = ko.observable(<Model.SolutionAccelerator>{});

        public static deletedIDs: KnockoutObservable<Object> = ko.observable({});
        public sharedMethods: Object = {};

        // TODO Move instance variable to factory.
        private static _instance: SolutionAcceleratorManager;

        constructor()
        {
        }

        public static getInstance(): SolutionAcceleratorManager
        {

            if (!SolutionAcceleratorManager._instance)
            {
                SolutionAcceleratorManager._instance = new SolutionAcceleratorManager();
            }

            return SolutionAcceleratorManager._instance;
        }

        private static registerDeletedSolutionId(solutionId: string): void
        {
            SolutionAcceleratorManager.deletedIDs()[solutionId] = true;
            SolutionAcceleratorManager.deletedIDs.notifySubscribers();
        }

        //  Return all deployed solution for current user/subscription
        //      - Gets data from API call to server
        //      - populate static content through calls to Mock service
        public getAllDeployedSolutions(): Promise<Model.SolutionAccelerator[]>
        {
            var self = this;
            var saService = Microsoft.DataStudio.SolutionAccelerator.Services.Impl.SolutionAcceleratorServiceImpl.getInstance();
            var saMockService = Microsoft.DataStudio.SolutionAccelerator.Services.Mocks.SolutionAcceleratorServiceMock.getInstance();
            var allSolutions = [];
            var deletingStatusString: string = Model.Graph.GraphNodeStatus[Model.Graph.GraphNodeStatus.Deleting].toLowerCase();
            return new Promise<Model.SolutionAccelerator[]>((resolve, reject) =>
            {
                saService.getAllDeployedSolutions().then((solutions) =>
                {
                    solutions.forEach((solution) =>
                    {
                        var allResources:Model.Resource[];
                        try {
                            var deployedResources = solution.Resources;
                            if (deployedResources) {
                                allResources = deployedResources;
                            }

                            var provisionedStatus = solution.Provisioning;
                            var solutionProvisionStatus: any = {};
                            if (provisionedStatus) {
                                solutionProvisionStatus = {
                                    message: provisionedStatus.Message,
                                    provisioningState: provisionedStatus.ProvisioningState,
                                    operations: provisionedStatus.Operations,
                                };
                                if (solutionProvisionStatus.provisioningState.toLowerCase() === deletingStatusString) {
                                    SolutionAcceleratorManager.registerDeletedSolutionId(solution.RowKey);
                                }
                            }

                            var exeLinks = solution.ExeLinks ? JSON.parse(solution.ExeLinks) : "";
                            // fill in the static content from Mock interface
                            saMockService.getDeployedSolutionStatus(solution.TemplatedId).then((sol) => {
                                allSolutions.push({
                                    title: sol.title,
                                    description: sol.description,

                                    templateId: solution.TemplatedId,
                                    resources: allResources,
                                    provisionState: solutionProvisionStatus,
                                    resourceGroupName: solution.resourceGroupName,
                                    exeLinks: exeLinks,
                                    partitionKey: solution.PartitionKey,
                                    rowKey: solution.RowKey,
                                    timestamp: solution.Timestamp,
                                    eTag: solution.ETag,
                                });
                            });
                        }
                        catch (e) {
                            throw new Error("Failed to parse the server response to get all deployed solutions: " + e);
                        }
                    });
                    resolve(allSolutions);
                }).catch((error: Error) => reject(error));
            });
        }

        //  Return deployed solution status for the given solution id
        //      - Gets data from API call to server
        //      - populate static content through calls to Mock service
        public getDeployedSolutionStatusById(solutionId: string, solutionSubscriptionId: string): Promise<Model.SolutionAccelerator>
        {
            var self = this;
            var saService = Microsoft.DataStudio.SolutionAccelerator.Services.Impl.SolutionAcceleratorServiceImpl.getInstance();
            var saMockService = Microsoft.DataStudio.SolutionAccelerator.Services.Mocks.SolutionAcceleratorServiceMock.getInstance();
            return new Promise<Model.SolutionAccelerator>((resolve, reject) =>
            {
                saService.getDeployedSolutionStatus(solutionId, solutionSubscriptionId).then((solution) =>
                {
                    var allResources: Model.Resource[];
                    try
                    {
                        var deployedResources = solution.Resources;
                        if (deployedResources)
                        {
                            allResources = deployedResources;
                        }

                        var provisionedStatus = solution.Provisioning;
                        if (deployedResources) {
                            var solutionProvisionStatus = {
                                message: provisionedStatus.Message,
                                provisioningState: provisionedStatus.ProvisioningState,
                                operations: provisionedStatus.Operations,
                            };
                        }

                        var exeLinks = solution.ExeLinks ? JSON.parse(solution.ExeLinks) : "";

                        var sol = {
                            title: "",
                            description: null,
                            graphTemplate: null,
                            imageUrl: "",
                            moduleUrl: "",

                            templateId: solution.TemplatedId,
                            resources: allResources,
                            provisionState: solutionProvisionStatus,
                            resourceGroupName: solution.resourceGroupName,
                            exeLinks: exeLinks,
                            partitionKey: solution.PartitionKey,
                            rowKey: solution.RowKey,
                            timestamp: solution.Timestamp,
                            eTag: solution.ETag,
                        };
                        // fill in the static content from mock interface
                        saMockService.getDeployedSolutionStatus(sol.templateId).then((solution)=> {
                            sol.title = solution.title;
                            sol.description = solution.description;
                            resolve(sol);
                        });
                    }
                    catch (e) {
                        throw new Error("Failed to parse the server response to get a solution: " + e);
                    }
                }).catch((error: Error) => reject(error));
            });
        }

        // Deploy solution to current subscription
        //      - solutionId: id of the solution to deploy
        //      - templateId: the template id in storage use to deploy this solution
        //      - Note: since both resources and provisionState will be null for the response, Manager will just pass through the service call directly to client
        public deploySolution(solutionId: string, templateId: string, templateParams: string, resourceGroupName?: string): Promise<any> {
            var saService = Microsoft.DataStudio.SolutionAccelerator.Services.Impl.SolutionAcceleratorServiceImpl.getInstance();
            return Promise.resolve(Services.Impl.SolutionAcceleratorServiceImpl.getInstance().deploySolution(solutionId, templateId, templateParams, resourceGroupName));
        }

        public deleteSolution(solutionId: string, solutionSubscriptionId: string): Promise<any> {
            ShellContext.globalSubscriptions.notifySubscribers(solutionId, "deleteSolutionActivated");
            SolutionAcceleratorManager.registerDeletedSolutionId(solutionId);
            var saService = Microsoft.DataStudio.SolutionAccelerator.Services.Impl.SolutionAcceleratorServiceImpl.getInstance();
            return Promise.resolve(Services.Impl.SolutionAcceleratorServiceImpl.getInstance().deleteSolution(solutionId, solutionSubscriptionId));
        }

        public getActiveSolutionAccelerator(): Promise<Model.SolutionAccelerator>
        {
            return Promise.resolve(this.OpenedSolutionAccelerator());
        }

        public openSolutionAcceleratorById(id: string): Promise<Model.SolutionAccelerator>
        {
            var SolutionAcceleratorService: Services.Mocks.SolutionAcceleratorServiceMock = Services.Mocks.SolutionAcceleratorServiceMock.getInstance();
            var SolutionAcceleratorPromise: Promise<Model.SolutionAccelerator> = SolutionAcceleratorService.getSolutionAcceleratorById(id);

            var promise = new Promise<Model.SolutionAccelerator>((resolve, reject) =>
            {
                SolutionAcceleratorPromise.then((SolutionAccelerator) =>
                {
                    this.OpenedSolutionAccelerator(SolutionAccelerator);
                    resolve(SolutionAccelerator);
                }).catch(reject)
            });

            return promise;
        }

        public createFromTemplate(templateId: string, name?: string): Promise<Model.SolutionAccelerator>
        {

            var SolutionAcceleratorService = Services.Mocks.SolutionAcceleratorServiceMock.getInstance();
            var SolutionAcceleratorPromise: Promise<Model.SolutionAccelerator> =
                SolutionAcceleratorService.createSolutionAccelerator(templateId, name);

            var promise = new Promise<Model.SolutionAccelerator>((resolve, reject) =>
            {
                SolutionAcceleratorPromise.then((SolutionAccelerator: Model.SolutionAccelerator) =>
                {

                    this.OpenedSolutionAccelerator(SolutionAccelerator);
                    resolve(SolutionAccelerator);
                }).catch(reject);
            });

            return promise;
        }

        public getSolutionAcceleratorTemplate(templateType: string): Promise<Model.SolutionAcceleratorTemplate> 
        {
            return Services.Mocks.SolutionAcceleratorServiceMock.getInstance().getSolutionAcceleratorTemplate(templateType);
        }  
    }
}
