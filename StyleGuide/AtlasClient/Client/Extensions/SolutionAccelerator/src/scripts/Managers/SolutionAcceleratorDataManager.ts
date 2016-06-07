/// <reference path="../Model/GraphNodeStatus.ts" />

interface KnockoutObservable<T> {
    intervalHandler?: KnockoutObservable<any>;
    pollingSubscriber?: KnockoutSubscription<any>;
    isPolling?: KnockoutComputed<boolean>;
    stopPolling?: () => any;
    startPolling?: () => any;
}

interface KnockoutObservableArray<T> {
    isLoading?: KnockoutObservable<boolean>;
    updatedCnt?: KnockoutObservable<number>;
    isError?: KnockoutObservable<boolean>;
    errorMessage?: KnockoutObservable<string>;
}

module Microsoft.DataStudio.SolutionAccelerator.Managers {
    var logger = LoggerFactory.getLogger({ loggerName: "SolutionTemplateDataManager", category: "Managers" });
    import GraphNodeStatus = Model.Graph.GraphNodeStatus;
    import Logging = Microsoft.DataStudio.Diagnostics.Logging;

    export class SolutionAcceleratorDataManager implements Application.IDisposableManager {

        public static _className: string = "Microsoft.DataStudio.SolutionAccelerator.Managers.SolutionAcceleratorDataManager";

        /* Static view properties - START */
        private subscribers: KnockoutSubscription<any>[];

        // Strings for graph status
        // [TODO] stpryor: update the graph node status enum to map to lowercase strings
        private static graphNodeStatusWaitForDeploy: string = GraphNodeStatus[GraphNodeStatus.WaitForDeploy].toLowerCase();
        private static graphNodeStatusInprogress: string = GraphNodeStatus[GraphNodeStatus.InProgress].toLowerCase();
        private static graphNodeStatusSucceeded: string = GraphNodeStatus[GraphNodeStatus.Succeeded].toLowerCase();
        private static graphNodeStatusFailed: string = GraphNodeStatus[GraphNodeStatus.Failed].toLowerCase();
        private static graphNodeStatusStopped: string = GraphNodeStatus[GraphNodeStatus.Stopped].toLowerCase();
        private static graphNodeStatusDeleted: string = GraphNodeStatus[GraphNodeStatus.Deleted].toLowerCase();
        private static graphNodeStatusDeleting: string = GraphNodeStatus[GraphNodeStatus.Deleting].toLowerCase();
        /* Static view properties - END */

        /* Observables - START */
        public allSolutions: KnockoutObservableArray<KnockoutObservable<Model.SolutionAccelerator>>;

        public activeSolutionParameters: KnockoutComputed<{ solutionId: string; subscriptionId: string }>;
        public validSelection: KnockoutObservable<boolean>;
        public activeSolution: KnockoutObservable<KnockoutObservable<Model.SolutionAccelerator>>;

        private deleteParams: KnockoutObservable<{ id: string; subscriptionId: string }>;
        public deleteConfirmationInProgress: KnockoutObservable<boolean>;
        /* Observables - END */

        // Constructor: Initialize and augment observables
        /* constructor - START */
        constructor() {
            var self = this;

            self.subscribers = [];

            // All solutions for the account
            self.allSolutions = ko.observableArray([]);
            self.allSolutions.isLoading = ko.observable(false);
            self.allSolutions.updatedCnt = ko.observable(0);
            self.allSolutions.isError = ko.observable(false);
            self.allSolutions.errorMessage = ko.observable('');

            self.validSelection = ko.observable(true);

            self.subscribers.push(
                // Call this whenever the list of all solutions is updated
                self.allSolutions.subscribe(allSolutions => {
                    // If there are no solutions, clear the active solution
                    if (allSolutions.length < 1) {
                        self.clearActiveSolution();
                    }
                    else if (self.activeSolution()) {
                        // If the current active solution is still in the updated list, reset the active solution to point to the correct observable
                        var params: Model.SolutionAccelerator = self.activeSolution()();
                        var solution: KnockoutObservable<Model.SolutionAccelerator> = self.findSolutionInAllSolutions(params.rowKey, params.partitionKey);
                        if (solution) {
                            self.activeSolution(solution);
                        }
                        else {
                            // If the active solution is no longer in the available list, activate the first solution
                            var firstTemplate: Model.SolutionAccelerator = allSolutions[0]();
                            self.setActiveSolution(firstTemplate.rowKey, firstTemplate.partitionKey);
                        }
                    }
                    else if (!self.validSelection()) {
                        // If no active solution, activate the first solution in the list
                        var firstTemplate: Model.SolutionAccelerator = allSolutions[0]();
                        self.setActiveSolution(firstTemplate.rowKey, firstTemplate.partitionKey);
                    }
                })
            );

            // The active solution
            self.activeSolution = ko.observable(null).extend({
                rateLimit: {
                    timeout: 50,
                    method: "notifyWhenChangesStop"
                }
            });

            self.activeSolutionParameters = ko.computed(() => {
                if (self.activeSolution()) {
                    var params: Model.SolutionAccelerator = self.activeSolution()();
                    return { solutionId: params.rowKey, subscriptionId: params.partitionKey };
                }
                return null;
            });

            // Active solution polling controls
            self.activeSolution.intervalHandler = ko.observable(null);
            self.activeSolution.pollingSubscriber = null;
            self.activeSolution.stopPolling = () => self.activeSolution.intervalHandler(clearInterval(self.activeSolution.intervalHandler()));
            self.activeSolution.startPolling = () => {
                self.activeSolution.stopPolling();
                var solution: KnockoutObservable<Model.SolutionAccelerator> = self.activeSolution();
                if (solution) {
                    // Poll the server once to get the most recent up as as soon as possible
                    self.updateSolutionStatus(solution);
                    // Set an interval to continue
                    var interval = setInterval(() => self.updateSolutionStatus(solution), 10 * 1000);
                    self.activeSolution.intervalHandler(interval);
                }
            };
            self.activeSolution.isPolling = ko.computed(() => !!self.activeSolution.intervalHandler());

            self.subscribers.push(
                // Do this whenever a new solution becomes active
                self.activeSolution.subscribe((updatedSolution: KnockoutObservable<Model.SolutionAccelerator>) => {
                    // Stop polling and clear existing subscribers
                    self.activeSolution.stopPolling();
                    if (self.activeSolution.pollingSubscriber) {
                        self.activeSolution.pollingSubscriber.dispose();
                        self.activeSolution.pollingSubscriber = null;
                    }
                    // If the a new solution has been selected, initialize polling and create new subscribers
                    if (updatedSolution) {
                        self.pollingUpdater(updatedSolution()); // Initialize
                        self.activeSolution.pollingSubscriber = updatedSolution.subscribe(self.pollingUpdater);
                    }
                })
            );

            // Control parameters for deleting a solution
            self.deleteParams = ko.observable(null);
            self.deleteConfirmationInProgress = ko.observable(false);

            self.subscribers.push(
                self.deleteParams.subscribe(newParams => self.deleteConfirmationInProgress(!!newParams))
            );

            self.subscribers.push(
                self.deleteConfirmationInProgress.subscribe(newStatus => {
                    if (!newStatus) self.clearDeleteConfirmationFlow();
                })
            );
        }
        /* constructor - END */

        // Method: findSolutionInAllSolutions
        //  Given a solution ID and subscription ID, return the matching solution if one exists, else null
        private findSolutionInAllSolutions = (solutionId: string, subscriptionId: string): KnockoutObservable<Model.SolutionAccelerator> => {
            return ko.utils.arrayFirst(this.allSolutions(), solution => solution().rowKey === solutionId && solution().partitionKey === subscriptionId);
        }

        // Method: pollingUpdater
        // Call this method every time the active solution is updated.
        // This method will control whether or not to start or stop polling for status updates.
        private pollingUpdater = (template: Model.SolutionAccelerator): void => {
            var self = this;
            if (template && template.provisionState && template.provisionState.provisioningState) {
                var newProvisionState: string = template.provisionState.provisioningState.toLowerCase();
                var shouldBePolling: boolean = newProvisionState === SolutionAcceleratorDataManager.graphNodeStatusInprogress || newProvisionState === SolutionAcceleratorDataManager.graphNodeStatusDeleting;
                if (shouldBePolling && !self.activeSolution.isPolling()) {
                    self.activeSolution.startPolling();
                }
                else if (!shouldBePolling && self.activeSolution.isPolling()) {
                    self.activeSolution.stopPolling();
                }
                // Handler completed delete scenario
                if (newProvisionState === SolutionAcceleratorDataManager.graphNodeStatusDeleted) {
                    var solutionId: string = template.rowKey;
                    var subscriptionId: string = template.partitionKey;
                    Microsoft.DataStudioUX
                        .Managers
                        .ToasterManager
                        .getInstance()
                        .notify('Your solution "' + solutionId + '" has been deleted successfully.');
                    self.allSolutions.remove(solution => solution().rowKey === solutionId && solution().partitionKey === subscriptionId);
                    // If the current active solution was just deleted, select the 
                    // first element in the list of all solutions if it is nonempty
                    if (self.allSolutions().length > 0) {
                        var firstTemplate: Model.SolutionAccelerator = self.allSolutions()[0]();
                        self.setActiveSolution(firstTemplate.rowKey, firstTemplate.partitionKey);
                    } else {
                        self.clearActiveSolution();
                        self.validSelection(true);
                    }
                }
            }
            else {
                self.clearActiveSolution();
            }
        }

        // Method: getAllSolutions
        // Retrieve all deployed/deploying solutions for the user account        
        public getAllSolutions = (): void => {
            var self = this;
            self.allSolutions.isLoading(true);

            SolutionAcceleratorManager
                .getInstance()
                .getAllDeployedSolutions()
                .then((solutions) => {
                    self.allSolutions(solutions.map(solution => ko.observable(solution)));
                    self.allSolutions.isLoading(false);
                    self.allSolutions.updatedCnt(self.allSolutions.updatedCnt() + 1);
                    self.allSolutions.isError(false);
                    self.allSolutions.errorMessage('');
                })
                .catch((errorMessage) => {
                    self.allSolutions.isLoading(false);
                    self.allSolutions.isError(true);
                    self.allSolutions.errorMessage(errorMessage);
                });
        }

        /* Delete Flow - START */

        // Method: startDeleteConfirmationFlow
        // Initialize delete parameters
        public startDeleteConfirmationFlow = (id: string, subscriptionId: string): void => {
            this.deleteParams({ id: id, subscriptionId: subscriptionId });
        }

        // Method: clearDeleteConfirmationFlow
        // Clear the delete parameters to exit the delete flow
        public clearDeleteConfirmationFlow = (): void => {
            this.deleteParams(null);
        }

        // Method: deleteSolution
        // Use the delete parameters to call the server to delete a solution
        // TODO: stpryor: Add error handling for delete
        public deleteSolution = (): void => {
            var self = this;
            var deleteParams: { id: string, subscriptionId: string } = self.deleteParams();
            if (deleteParams) {
                // Find the deleted solution and set the status to deleting to update the page
                // Calling findSolutionInAllSolutions because the user can delete solutions that aren't active
                var deletedSolution: KnockoutObservable<Model.SolutionAccelerator> = self.findSolutionInAllSolutions(deleteParams.id, deleteParams.subscriptionId);
                // Set status to delete requested to prevent polling
                deletedSolution().provisionState.provisioningState = Model.Graph.GraphNodeStatus[Model.Graph.GraphNodeStatus.DeleteReqested];
                deletedSolution.valueHasMutated(); // Alert the observable's subscribers that the value has changed
                self.clearDeleteConfirmationFlow();
                SolutionAcceleratorManager
                    .getInstance()
                    .deleteSolution(deleteParams.id, deleteParams.subscriptionId)
                    .then((response: any) => {
                    // Once the delete is confirmed, update the status
                        logger.logUsage(Logging.UsageEventType.Custom, "SolTemplate_SuccessDelete", { templateType: deletedSolution().templateId });
                        deletedSolution().provisionState.provisioningState = Model.Graph.GraphNodeStatus[Model.Graph.GraphNodeStatus.Deleting];
                        deletedSolution.valueHasMutated();
                    })
                    .catch((reason) => {
                        logger.logUsage(Logging.UsageEventType.Custom, "SolTemplate_FailedDelete", { templateType: deletedSolution().templateId, failureMessage: reason.toString() });
                        console.log("Call to deleteSolution failed with the following response");
                        console.log(reason);
                    });
            }
        }
        /* Delete Flow - END */

        // Method: setActiveSolution
        // Sets the active solution parameters
        public setActiveSolution = (solutionId: string, subscriptionId: string) => {
            var self = this;
            if (solutionId && subscriptionId) {
                var solution: KnockoutObservable<Model.SolutionAccelerator> = self.findSolutionInAllSolutions(solutionId, subscriptionId);
                self.validSelection(!!solution);
                if (self.activeSolution() != solution) {
                    self.activeSolution(solution);
                }
            }
        }

        // Method: setActiveSolution
        // Clears the active solution parameters
        public clearActiveSolution = () => this.activeSolution(null);

        // Method: updateSolutionStatus
        // Updates an observable of a solution template with the most recent template
        // TODO: stpryor: Add error handling for updateSolutionStatus
        private updateSolutionStatus = (solution: KnockoutObservable<Model.SolutionAccelerator>) => {
            var self = this;
            if (solution && solution() && solution().rowKey && solution().partitionKey) {
                SolutionAcceleratorManager
                    .getInstance()
                    .getDeployedSolutionStatusById(solution().rowKey, solution().partitionKey)
                    .then(newSolution => {
                        if (newSolution) solution(newSolution);
                    })
                    .catch((reason) => {
                        console.log("Call to getDeployedSolutionStatusById failed with the following response");
                        console.log(reason);
                    });
            }
        }

        // Method: dispose
        // Object level dispose function, dispose of all subscriptions that shouldn't live beyond the instance life time
        public dispose(): void {
            this.activeSolution.stopPolling();
            this.subscribers.forEach(subscription => subscription.dispose());
        }

        // Solution Type Meta Data
        // TODO: stpryor: The server should be providing these values
        public static solutionTypeMetadata: Object = {
            connectedcar: {
                displayName: "Vehicle Telemetry Analytics"
            },
            predictivemaintenance: {
                displayName: "Predictive Maintenance for Aerospace"
            },
            demandforecasting: { // TODO: stpryo: Name not finalized
                displayName: "Demand Forecasting for Energy"
            },
            anomalydetection: {
                displayName: "Anomaly Detection"
            }
            /*/
            customerchurn: {
                displayName: "Customer Churn Analysis for Telco"
            },
            */
        };

    }
}
