/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./solutions.html" />
/// <amd-dependency path="css!./solutions.css" />

export var template: string = require("text!./solutions.html");
import Router = Microsoft.DataStudio.Application.Router;
import ShellContext = Microsoft.DataStudio.Application.ShellContext;
import Managers = Microsoft.DataStudio.SolutionAccelerator.Managers;
import Model = Microsoft.DataStudio.SolutionAccelerator.Model;
import DataStudioUXBindings = Microsoft.DataStudioUX.Knockout.Bindings;
import IInstanceReference = Microsoft.DataStudio.Application.IInstanceReference;
import ManagerFactory = Microsoft.DataStudio.Application.ManagerFactory;

export class viewModel
{
    private static succeededStatusString: string = Model.Graph.GraphNodeStatus[Model.Graph.GraphNodeStatus.Succeeded].toLowerCase();
    private static failedStatusString: string = Model.Graph.GraphNodeStatus[Model.Graph.GraphNodeStatus.Failed].toLowerCase();
    private static stoppedStatusString: string = Model.Graph.GraphNodeStatus[Model.Graph.GraphNodeStatus.Stopped].toLowerCase();

    /* Static view properties - START */
    public DataManagerReference: IInstanceReference;
    public DataManager: Managers.SolutionAcceleratorDataManager;
    public progressType: DataStudioUXBindings.ProgressType;

    // Collections of all subscriptions that will need to be disposed of
    private componentSubscriptions: KnockoutSubscription<any>[];
    /* Static view properties - END */

    /* Computed Observables - START */
    public solutions: KnockoutComputed<Object[]>;
    public selectedExperimentId: KnockoutComputed<string>;
    public loadingSolutions: KnockoutComputed<boolean>;
    public noDeployedSolutions: KnockoutComputed<boolean>;
    public routerArguments: KnockoutComputed<string[]>;
    /* Computed Observables - END */

    constructor(params: any) {
        var self = this;

        self.componentSubscriptions = [];

        // Initialize parameters
        self.DataManagerReference = ManagerFactory.getInstanceOf(Managers.SolutionAcceleratorDataManager._className);
        self.DataManager = <Managers.SolutionAcceleratorDataManager>self.DataManagerReference.instance;

        self.progressType = DataStudioUXBindings.ProgressType.IndeterminateInline;
        self.routerArguments = ko.pureComputed(() => viewModel.extractArguments(Router.currentArguments()));

        self.selectedExperimentId = ko.pureComputed(() =>
        {
            var activeSolutionParameters = self.DataManager.activeSolutionParameters();
            if (activeSolutionParameters)
            {
                return activeSolutionParameters.solutionId + activeSolutionParameters.subscriptionId;
            }
            return null; 
        });

        // Listen for page navigation events to handle backwards navigation
        self.componentSubscriptions.push(
            self.routerArguments.subscribe((inputParams: string[]) => {
                if (Router.currentView() === 'solutionInfoView' && inputParams.length >= 2 && self.selectedExperimentId() != inputParams[0]) {
                    self.DataManager.setActiveSolution(inputParams[0], inputParams[1]);
                }
            })
        );

        // Format the solutions list
        self.solutions = ko.pureComputed(() => self.DataManager.allSolutions().map(self.formatSolution));

        self.componentSubscriptions.push(
            self.solutions.subscribe((solutions: any[]) =>
            {
                if (self.selectedExperimentId() === null && solutions.length > 0)
                {
                    // If url arguments exist, selected the solution they specify, otherwise default to the first solution
                    var inputParams: string[] = self.routerArguments();
                    if (inputParams.length >= 2)
                    {
                        self.DataManager.setActiveSolution(inputParams[0], inputParams[1]);
                    }
                    else if (inputParams.length != 1)
                    {
                        self.DataManager.setActiveSolution(solutions[0].solutionId, solutions[0].subscriptionId);
                    }
                }
            })
        );

        // Manage the page routing whenever the active solution changes
        self.componentSubscriptions.push(
            self.DataManager.activeSolution.subscribe((newSolution: KnockoutObservable<Model.SolutionAccelerator>) =>
            {
                if (newSolution && newSolution())
                {
                    Router.navigate("solutionaccelerator/solutionInfoView/" + newSolution().rowKey + "/" + newSolution().partitionKey);
                }
                else
                {
                    Router.navigate("solutionaccelerator");
                }
            })
        );

        self.loadingSolutions = ko.pureComputed(() => 
        { 
            return !self.DataManager.allSolutions['isError']() && (self.DataManager.allSolutions['isLoading']() || self.DataManager.allSolutions['updatedCnt']() < 1);
        }).extend({
            rateLimit: {
                timeout: 5,
                method: "notifyWhenChangesStop"
            }
        });

        self.noDeployedSolutions = ko.pureComputed(() => !self.DataManager.allSolutions['isError']() &&  !self.loadingSolutions() && self.solutions().length == 0).extend({
            rateLimit: {
                timeout: 5,
                method: "notifyWhenChangesStop"
            }
        });

        // Call the server to get solutions
        self.DataManager.getAllSolutions();
    }

    // Method: extractArguments
    // Takes a url and breaks it into its component parts
    public static extractArguments = (args: string): string[]=> args ? decodeURIComponent(args).split('/') : [];

    // Method: formatSolution
    // Extracts the needed parameters from a solution template to render the list of solutions
    private formatSolution = (solution: KnockoutObservable<Model.SolutionAccelerator>): Object =>
    {
        var self = this;
        var solutionId: string = solution().rowKey;
        var subscriptionId: string = solution().partitionKey;
        var options: DataStudioUXBindings.ContextualMenuOption[] = [
            {
                name: "Open",
                action: () => self.DataManager.setActiveSolution(solutionId, subscriptionId),
                isDisabled: ko.pureComputed(() => self.selectedExperimentId() === solutionId + subscriptionId)
            },
            {
                name: "Delete",
                action: () => self.DataManager.startDeleteConfirmationFlow(solutionId, subscriptionId),
                isDisabled: ko.pureComputed(() => {
                    var provisioningState: string = solution().provisionState.provisioningState.toLowerCase();
                    // Disable delete for all statuses except succeeded, failed, and stopped
                    return !(provisioningState === viewModel.succeededStatusString || provisioningState === viewModel.failedStatusString || provisioningState === viewModel.stoppedStatusString);
                })
            }
        ];
        return {
            title: solution().title,
            solutionId: solutionId,
            subscriptionId: subscriptionId,
            uniqueId: solutionId + subscriptionId,
            options: options
        };
    }

    // Method: openSolution
    // Activates a new solution from the given paramters
    public openSolution = (data: any) => this.DataManager.setActiveSolution(data.solutionId, data.subscriptionId);

    // Method: dispose
    // Component level dispose function, dispose of all subscriptions that shouldn't live beyond the component life time
    public dispose(): void {
        var self = this;
        self.componentSubscriptions.forEach(subscription => subscription.dispose());
        self.DataManager = null;
        self.DataManagerReference.release();
    }
}