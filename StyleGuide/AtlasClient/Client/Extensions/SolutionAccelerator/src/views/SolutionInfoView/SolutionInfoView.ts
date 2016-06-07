/// <reference path="../../References.d.ts" />
/// <reference path="../../Module.d.ts" />
/// <amd-dependency path="text!./SolutionInfoView.html" />
/// <amd-dependency path="css!./SolutionInfoView.css" />

import ko = require("knockout");
import GraphControl = require("srcMap!../../Core/DataStudioUX/src/lib/GraphControl/graphControlExternal");
import NodeExtension = require("./NodeExtension");
import GraphAttributes = require("./GraphAttributes");
import Router = Microsoft.DataStudio.Application.Router;
import Managers = Microsoft.DataStudio.SolutionAccelerator.Managers;
import Model = Microsoft.DataStudio.SolutionAccelerator.Model;
import PromiseUtils = Microsoft.DataStudio.Diagnostics.PromiseUtils;
import DataStudioUXBindings = Microsoft.DataStudioUX.Knockout.Bindings;
import ShellContext = Microsoft.DataStudio.Application.ShellContext;
import GraphModel = Model.Graph;
import GraphNodeStatus = GraphModel.GraphNodeStatus;
import SolutionAcceleratorServiceMock = Microsoft.DataStudio.SolutionAccelerator.Services.Mocks.SolutionAcceleratorServiceMock;
import IInstanceReference = Microsoft.DataStudio.Application.IInstanceReference;
import ManagerFactory = Microsoft.DataStudio.Application.ManagerFactory;

export var template: string = require("text!./SolutionInfoView.html");

/******* solutionInfoView viewModel - START *******/
export class viewModel {
    /* Static view properties - START */
    public DataManagerReference: IInstanceReference;
    public DataManager: Managers.SolutionAcceleratorDataManager;
    public PanelManagerReference: IInstanceReference;
    public PanelManager: Managers.SidePanelManager;

    public progressType: DataStudioUXBindings.ProgressType = DataStudioUXBindings.ProgressType.IndeterminateInline;
    public notificationProgressType: DataStudioUXBindings.ProgressType = DataStudioUXBindings.ProgressType.DeterminateBar;
    public galleryEndpoint: string = Microsoft.DataStudio.Managers.ConfigurationManager.instance.getGalleryEndpointUrl();

    public solutionSubscriptionId: string;

    // Graph node status strings
    private graphNodeStatusWaitForDeploy: string = GraphNodeStatus[GraphNodeStatus.WaitForDeploy].toLowerCase();
    private graphNodeStatusInprogress: string = GraphNodeStatus[GraphNodeStatus.InProgress].toLowerCase();
    private graphNodeStatusSucceeded: string = GraphNodeStatus[GraphNodeStatus.Succeeded].toLowerCase();
    private graphNodeStatusFailed: string = GraphNodeStatus[GraphNodeStatus.Failed].toLowerCase();
    private graphNodeStatusStopped: string = GraphNodeStatus[GraphNodeStatus.Stopped].toLowerCase();
    private graphNodeStatusDeleted: string = GraphNodeStatus[GraphNodeStatus.Deleted].toLowerCase();
    private graphNodeStatusDeleting: string = GraphNodeStatus[GraphNodeStatus.Deleting].toLowerCase();
    private graphNodeStatusDeleteRequested: string = GraphNodeStatus[GraphNodeStatus.DeleteReqested].toLowerCase();
    private graphNodeStatusDeleteFailed: string = GraphNodeStatus[GraphNodeStatus.DeleteFailed].toLowerCase();

    // Graph node type strings
    // TODO: stpryor: Move these out of the component, to a config or something
    private graphNodeTypes: any = {
        DataFactory: GraphModel.GraphNodeType[GraphModel.GraphNodeType.DataFactory],
        PowerBI: GraphModel.GraphNodeType[GraphModel.GraphNodeType.PowerBI],
        SampleData: GraphModel.GraphNodeType[GraphModel.GraphNodeType.SampleData],
        HDInsight: GraphModel.GraphNodeType[GraphModel.GraphNodeType.HDInsight],
        EventHub: GraphModel.GraphNodeType[GraphModel.GraphNodeType.EventHub],
        InputData: GraphModel.GraphNodeType[GraphModel.GraphNodeType.InputData],
        Storage: GraphModel.GraphNodeType[GraphModel.GraphNodeType.Storage]
    };

    private emptyResource: Model.Resource = {
        ResourceId: null,
        ResourceUrl: null,
        ResourceName: "",
        ResourceGroupName: null,
        ResourceType: null,
        StatusCode: null,
        StatusMessage: null,
        ProvisioningState: null,
        Dependencies: null
    };

    public graphControlViewModel: GraphControl.ViewModel;
    public cyclePairs: GraphAttributes.CycleNode[] = [];
    /* Static view properties - END */

    /* Observables - START */
    public solutionName: KnockoutObservable<string> = ko.observable('');
    public solutionType: KnockoutObservable<string> = ko.observable('');
    public numDeployingResources: KnockoutObservable<number> = ko.observable(0);
    public numCompletedResources: KnockoutObservable<number> = ko.observable(0);
    public deploymentCompletionPercentage: KnockoutObservable<number>;

    public showNotification: KnockoutObservable<boolean> = ko.observable(true);
    public solutionIsSelected: KnockoutObservable<boolean> = ko.observable(false);
    public provisioningStatus: KnockoutObservable<GraphNodeStatus> = ko.observable(GraphNodeStatus.InProgress);

    public statusMessage: KnockoutObservable<string> = ko.observable("");
    public isVisibleDeploymentDetails: KnockoutObservable<boolean> = ko.observable(false);
    public isGraphRendering: KnockoutObservable<boolean> = ko.observable(false);
    /* Observables - END */

    /* Computed Observables - START */
    public solutionTypeDisplayName: KnockoutComputed<string> = ko.computed(() => {
        var solutionType: string = this.solutionType();
        var metadata: any = Managers.SolutionAcceleratorDataManager.solutionTypeMetadata[solutionType];
        return metadata && metadata.displayName ? '(' + metadata.displayName + ')': '';
    });
    public deploymentFailed: KnockoutComputed<boolean> = ko.computed(() => this.provisioningStatus() === GraphNodeStatus.Failed);
    public showRedBar: KnockoutComputed<boolean> = ko.computed(() => this.provisioningStatus() === GraphNodeStatus.Failed || this.provisioningStatus() === GraphNodeStatus.DeleteFailed);
    public deploymentSucceeded: KnockoutComputed<boolean> = ko.computed(() => this.provisioningStatus() === GraphNodeStatus.Succeeded);
    public isDeleted: KnockoutComputed<boolean> = ko.computed(() => {
        return this.provisioningStatus() === GraphModel.GraphNodeStatus.Deleting || this.provisioningStatus() === GraphNodeStatus.Deleted || this.provisioningStatus() === GraphNodeStatus.DeleteReqested;
    });
    public showNotificationProgress: KnockoutComputed<boolean> = ko.computed(() => this.showNotification() && !this.isDeleted());

    public showEmptySolutionsMessage: KnockoutComputed<boolean>;;
    /* Computed Observables - END */

    // Method: showDeploymentDetails
    // Enables deployment details modal
    public showDeploymentDetails(): void {
        this.isVisibleDeploymentDetails(true);
    }

    // Method: hideDeploymentDetails
    // Disables deployment details modal
    public hideDeploymentDetails(): void {
        this.isVisibleDeploymentDetails(false);
    }

    // Method: startDeleteFlow
    // Kicks off a new delete flow for the active solution
    public startDeleteFlow(): void {
        this.DataManager.startDeleteConfirmationFlow(this.solutionName(), this.solutionSubscriptionId);
    }

    // Method: closeNotification
    // Hides the notification bar
    public closeNotification = () => {
        this.showNotification(false);
    }

    // Method: fixCycles
    public fixCycles = () => {
        console.log("Fixing cycles");

        var rects = this.graphControlViewModel.getNodeRects()();
        console.log("Rects: ", rects);

        var updateRects: StringMap<GraphControl.IPoint> = {};

        var updateNeeded = false;

        this.cyclePairs.forEach((cycle) => {
            var rect1 = rects[cycle.id()];
            var rect2 = rects[cycle.partner.id()];

            // pair is not together
            var updatePoint = cycle.partnerUpdatePoint(rect1, rect2);

            if (updatePoint) {
                updateNeeded = true;

                // for simplicty always fix the left one
                updateRects[cycle.partner.id()] = updatePoint;
            }
        });

        if (updateNeeded) {
            this.graphControlViewModel.setNodeRects()(updateRects);
        }
    }

    public disposeGraphNodeViewModels = () => {
        if (this.graphControlViewModel && this.graphControlViewModel.graphNodes) {
            this.graphControlViewModel.graphNodes.forEach((node: GraphControl.GraphNode) => {
                var nodeViewModel: NodeExtension.NodeExtensionViewModel = <NodeExtension.NodeExtensionViewModel>node.extensionViewModel;
                if (nodeViewModel && nodeViewModel.dispose && typeof nodeViewModel.dispose === 'function') {
                    nodeViewModel.dispose();
                }
            });
        }
    }

    // Method: buildGraph
    // Constructs the solution graph
    public buildGraph = (input: GraphAttributes.IGraphInput) => {
        this.graphControlViewModel.edges.clear();
        this.disposeGraphNodeViewModels();
        this.graphControlViewModel.graphNodes.clear();

        if (this.solutionType() === SolutionAcceleratorServiceMock.ANOMALYDETECTION) {
            var box = new GraphAttributes.DottedNode("DOTTED", { height: 140, width: 655, x: 234, y: 0 });
            this.graphControlViewModel.graphNodes.put(box.id(), box);
        } else {
            var box = new GraphAttributes.DottedNode("DOTTED", { height: 286, width: 1052, x: 2, y: 287 });
            this.graphControlViewModel.graphNodes.put(box.id(), box);
        }
        
        this.cyclePairs = [];

        var cycles: GraphControl.IEdge[] = [];

        var edgeMap: StringMap<boolean> = {};

        // create the cycle edges differently
        $.each(input.cycles, (key: string, cycle: GraphAttributes.ICycle) => {
            var top = new GraphAttributes.CycleNode(key, cycle.top);
            var bottom = new GraphAttributes.CycleNode(key, cycle.bottom, false);

            // add the nodes
            this.graphControlViewModel.graphNodes.put(top.id(), top);
            this.graphControlViewModel.graphNodes.put(top.partner.id(), top.partner);
            this.graphControlViewModel.graphNodes.put(bottom.id(), bottom);
            this.graphControlViewModel.graphNodes.put(bottom.partner.id(), bottom.partner);

            // add the edges
            this.graphControlViewModel.addEdge({ startNodeId: bottom.id(), endNodeId: top.id() });
            this.graphControlViewModel.addEdge({ startNodeId: top.partner.id(), endNodeId: bottom.partner.id() });

            // add to the view model
            this.cyclePairs.push(top, bottom);
        });

        // add the nodes last so they're always on top
        $.each(input.nodes, (key: string, rect: NodeExtension.INodeExtension) => {
            var graphNode = new NodeExtension.NodeExtension(key, rect);
            this.graphControlViewModel.graphNodes.put(graphNode.id(), graphNode);
        });

        // create the normal edges (after the nodes have been created)
        input.edges.forEach((edge) => {
            this.graphControlViewModel.addEdge(edge);
        });

        // Now fix edge styling
        this.graphControlViewModel.edges.forEach((edge, key) => {
            edge.startMarker(GraphControl.GraphEntityModel.EdgeMarker.None);
        });

        this.graphControlViewModel.zoomToFit()();;
    }

    // Method: updateProvisioningStatus
    // Contains the logic to handle each possible solution provisioningState
    private updateProvisioningStatus = (template: Model.SolutionAccelerator) => {
        var self = this;
        // Get the status of overall deployment
        if (template && template.provisionState && template.provisionState.provisioningState) {
            switch (template.provisionState.provisioningState.toLowerCase()) {
                case self.graphNodeStatusSucceeded:
                    self.provisioningStatus(GraphNodeStatus.Succeeded);
                    self.statusMessage("Your solution template was deployed successfully.");
                    // On successful deployment, show the right panel
                    ShellContext.RightPanelIsExpanded(true);
                    self.deploymentCompletionPercentage(100);
                    break;
                case self.graphNodeStatusFailed:
                    self.setGraphNodeStop();
                    self.provisioningStatus(GraphNodeStatus.Failed);
                    self.deploymentCompletionPercentage(100);
                    if (template.provisionState.message) {
                        self.statusMessage(template.provisionState.message);
                    } else {
                        self.statusMessage("Deployment failed, please delete and retry.");
                    }
                    break;
                case self.graphNodeStatusDeleting:
                    self.provisioningStatus(GraphNodeStatus.Deleting);
                    self.statusMessage("We're deleting your solution template. This may take a few minutes.");
                    if (self.graphControlViewModel.selectedEntities().length > 0) {
                        self.graphControlViewModel.graphNodes.forEach((graphNode) => graphNode.selected(false));
                    }
                    self.PanelManager.initialize();
                    self.showNotification(true);
                    break;
                case self.graphNodeStatusDeleteRequested:
                    self.provisioningStatus(GraphNodeStatus.DeleteReqested);
                    self.statusMessage("Waiting for server confirmation that delete has started.");
                    if (self.graphControlViewModel.selectedEntities().length > 0) {
                        self.graphControlViewModel.graphNodes.forEach((graphNode) => graphNode.selected(false));
                    }
                    self.PanelManager.initialize();
                    self.showNotification(true);
                    break;
                case self.graphNodeStatusDeleted:
                    self.provisioningStatus(GraphNodeStatus.Deleted);
                    self.statusMessage("Your solution template was deleted successfully.");
                    break;
                case self.graphNodeStatusDeleteFailed:
                    self.provisioningStatus(GraphNodeStatus.DeleteFailed);
                    self.deploymentCompletionPercentage(100);
                    if (template.provisionState.message) {
                        self.statusMessage(template.provisionState.message);
                    } else {
                        self.statusMessage("Deleting the solution template failed!");
                    }
                    break;
                case self.graphNodeStatusInprogress:
                    self.provisioningStatus(GraphNodeStatus.InProgress);
                    self.statusMessage("We're setting things up. This usually takes up to 20 minutes.");
                    self.showNotification(true);
                    self.deploymentCompletionPercentage(self.numDeployingResources() > 0 ? (100 * (self.numCompletedResources() / self.numDeployingResources())) : 0);
                    break;
                default:
                    self.provisioningStatus(GraphNodeStatus.WaitForDeploy);
                    self.statusMessage("Retrieving solution deployment status...");
                    self.showNotification(true);
                    break;
            }
        }
    }

    // Method: extractHDInsightResources
    // Contains the logic to extrac the HDInsight resources from the DataFactory resources
    // Moved into a seperate function to avoid clutter in the UpdateDeploymentStatus method
    private extractHDInsightResources = (nodeResourceMap: any) => {
        var self = this;
        var dataFactoryResource: Model.Resource = nodeResourceMap[self.graphNodeTypes.DataFactory];
        if (dataFactoryResource && dataFactoryResource.Dependencies) {
            var stateCnts: any = {};
            // Extract the HDInsight resources from the DataFactory resources
            var hdDependencies = dataFactoryResource.Dependencies.filter((dfResource) => {
                if (dfResource.ResourceName.indexOf(self.graphNodeTypes.HDInsight) > -1) {
                    var provisioningState: string = dfResource.ProvisioningState.toLowerCase();
                    stateCnts[provisioningState] = (stateCnts[provisioningState] || 0) + 1;
                    return true;
                }
            });
            if (hdDependencies.length > 0) {
                var hdiResource: Model.Resource = $.extend({}, dataFactoryResource);
                hdiResource.Dependencies = hdDependencies;
                if (stateCnts[self.graphNodeStatusFailed] > 0) {
                    hdiResource.ProvisioningState = self.graphNodeStatusFailed;
                } else if (stateCnts[self.graphNodeStatusSucceeded] === hdDependencies.length) {
                    hdiResource.ProvisioningState = self.graphNodeStatusSucceeded;
                }
                nodeResourceMap[self.graphNodeTypes.HDInsight] = hdiResource;
            }
        }
    }

    // Method: UpdateDeploymentStatus
    // Takes a solution template and discovers/assigns the status for each available node
    public UpdateDeploymentStatus = (template: Model.SolutionAccelerator) => {
        var self = this;
        if (template) {
            if (template.resources && template.resources.length > 0) {
                // Step 1: Create a mapping from available nodes to resources
                var nodeResourceMap: any = {};
                self.graphControlViewModel.graphNodes.forEach((graphNode) => {
                    var graphNodeId: string = graphNode.id();
                    // Check for @ to ignore extra graph display nodes
                    if (graphNodeId.indexOf('@') < 0 && !!!nodeResourceMap[graphNodeId]) {
                        // TODO (stpryor): A more elegant solution to the static nodes would be nice
                        if (graphNodeId == self.graphNodeTypes.InputData || graphNodeId == self.graphNodeTypes.PowerBI) {
                            var newResource: Model.Resource = $.extend({}, self.emptyResource);
                            var nodeLinkMappings = graphNode.extensionViewModel.staticData.linkMappings;
                            if (nodeLinkMappings) {
                                newResource.ResourceId = nodeLinkMappings.exeLinkKey && template.exeLinks ? template.exeLinks[nodeLinkMappings.exeLinkKey] : null;
                                newResource.ResourceId = nodeLinkMappings.exeLinkOverride ? nodeLinkMappings.exeLinkOverride : newResource.ResourceId;
                                newResource.ResourceUrl = newResource.ResourceId;
                            }
                            newResource.ResourceType = graphNodeId;
                            newResource.ProvisioningState = self.graphNodeStatusWaitForDeploy;
                            nodeResourceMap[graphNodeId] = newResource;
                        } else {
                            nodeResourceMap[graphNodeId] = null;
                        }
                    }
                });

                // Step 2: Map the available resources to their corresponding nodes
                var nodeIds: string[] = Object.keys(nodeResourceMap);
                template.resources.forEach((resource) => {
                    var nodeIndex: number = -1;
                    nodeIds.some((nodeId, index) => {
                        if (resource.ResourceType.indexOf(nodeId) > -1) {
                            nodeIndex = index;
                            resource.ProvisioningState = resource.ProvisioningState.toLowerCase();
                            nodeResourceMap[nodeId] = resource;
                            return true;
                        }
                        return false;
                    });
                    // Remove used Ids from the list
                    if (nodeIndex > -1) nodeIds.splice(nodeIndex, 1);
                });

                // Step 3: Handle the HDInsight special case by extracting the HDInsight resources from the data factory resources
                // TODO (stpryor): When this step is completed on the server, remove this line
                self.extractHDInsightResources(nodeResourceMap);

                // Step 4: Update nodes
                var completedResources: number = 0;
                var stopDueToFailure: boolean = false;
                self.graphControlViewModel.graphNodes.forEach((graphNode) => {
                    if (nodeResourceMap[graphNode.id()] && graphNode.extensionViewModel) {
                        graphNode.extensionViewModel.resource(nodeResourceMap[graphNode.id()]);
                        var provisioningState: string = nodeResourceMap[graphNode.id()].ProvisioningState;
                        graphNode.extensionViewModel.status(provisioningState);
                        stopDueToFailure = stopDueToFailure || provisioningState === self.graphNodeStatusFailed;
                        if (provisioningState === self.graphNodeStatusSucceeded) {
                            completedResources++;
                        }
                    }
                });

                // Step 5: Update solution overall status
                if (stopDueToFailure) {
                    self.setGraphNodeStop();
                }
                self.numCompletedResources(completedResources);
            }
            self.updateProvisioningStatus(template);
        }
    }

    // Method: resetGraphNodeDefaults
    // Set all available graph nodes to WaitForDeploy status
    private resetGraphNodeDefaults(): void {
        var self = this;
        self.graphControlViewModel.graphNodes.forEach((graphNode) => {
            graphNode.selected(false); // Deselect any selected nodes
            var nodeViewModel: NodeExtension.NodeExtensionViewModel = graphNode.extensionViewModel ? graphNode.extensionViewModel : null;
            if (nodeViewModel && nodeViewModel.status) nodeViewModel.status(self.graphNodeStatusWaitForDeploy);
        });
    }

    // Method: setGraphNodeStop
    // Set all available graph nodes to Stopped status if they are not pass or fail
    private setGraphNodeStop(): void {
        var self = this;
        self.graphControlViewModel.graphNodes.forEach((graphNode) => {
            var nodeViewModel: NodeExtension.NodeExtensionViewModel = graphNode.extensionViewModel ? graphNode.extensionViewModel : null;
            if (nodeViewModel && nodeViewModel.status && nodeViewModel.status() === self.graphNodeStatusInprogress) {
                nodeViewModel.status(self.graphNodeStatusStopped);
            }
        });
    }

    // Method: initializeNewSolution
    // Contains all logic for what should happen when a new solution is opened
    private initializeNewSolution(activeSolution: KnockoutObservable<Model.SolutionAccelerator>): void {
        var self = this;
        // Initial graph update
        self.resetGraphNodeDefaults();
        self.UpdateDeploymentStatus(activeSolution());
        self.isGraphRendering(false);
        self.showNotification(self.provisioningStatus() != GraphNodeStatus.Succeeded);

        // Subscribe for all later updates to the solution template
        self.solutionSubscriptions.push(activeSolution.subscribe(template => self.UpdateDeploymentStatus(template)));
    }

    // Method: initializeViewContext
    // Reset the view to the default settings
    private initializeViewContext(): void {
        this.PanelManager.initialize();
    }

    // Lists of all subscriptions that will need to be disposed of
    private componentSubscriptions: KnockoutSubscription<any>[];
    private solutionSubscriptions: KnockoutSubscription<any>[];

    constructor(params: any) {
        var self = this;
        self.DataManagerReference = ManagerFactory.getInstanceOf(Managers.SolutionAcceleratorDataManager._className);
        self.DataManager = <Managers.SolutionAcceleratorDataManager>this.DataManagerReference.instance;
        self.PanelManagerReference = ManagerFactory.getInstanceOf(Managers.SidePanelManager._className);
        self.PanelManager = <Managers.SidePanelManager>this.PanelManagerReference.instance;

        // Place computed in constructor because of datamanager dependency
        self.showEmptySolutionsMessage = ko.computed(() => {
            return self.DataManager.allSolutions().length < 1
                && !self.DataManager.allSolutions.isLoading()
                && self.DataManager.allSolutions.updatedCnt() > 0
        }).extend({
            rateLimit: {
                timeout: 10,
                method: "notifyWhenChangesStop"
            }
        });

        var urlParams: Array<string> = Router.currentArguments() ? decodeURIComponent(Router.currentArguments()).split('/') : [];

        self.solutionSubscriptions = [];
        self.componentSubscriptions = [];

        self.initializeViewContext();

        // New solution template wizard scenario
        if (urlParams.length === 1)
        {
            Router.navigate("solutionaccelerator/new/" + urlParams[0]);
            return;
        }

        // Hard coding the value of 7 for now. This will need to be updated when the graph is dynamic.
        self.numDeployingResources(7);
        self.deploymentCompletionPercentage = ko.observable(0);

        // Create the graph ViewModel and initialize parameters
        self.graphControlViewModel = new GraphControl.ViewModel();
        self.graphControlViewModel.gridResolution(1);
        self.graphControlViewModel.editorCapabilities(GraphControl.GraphEditorCapabilities.None); // Disallow movement
        self.graphControlViewModel.layoutChanged.subscribe(self.fixCycles); // Fix cycles properly

        // Don't allow the user to select more than one node in the graph
        self.graphControlViewModel.selectedEntities.subscribe((selectedEntities) => {
            var nodes: any[] = selectedEntities;
            if (nodes && !!nodes.length) {
                if (nodes.length > 1) {
                    // Deselect all but the most recently selected nodes
                    nodes.slice(0, nodes.length - 1).forEach((node) => node.selected(false));
                } else if (nodes.length > 0 && nodes[0] && nodes[0].extensionViewModel && nodes[0].extensionViewModel.showDetails) {
                    // Show the right panel for the given node
                    nodes[0].extensionViewModel.showDetails();
                }
            } else {
                // Reset the right panel
                self.PanelManager.initialize();
            }
        });

        // Initialize the component to listen for changing active solutions
        var activeSolutionSubscription: KnockoutSubscription<any> = self.DataManager
            .activeSolution
            .subscribe((activeSolution: KnockoutObservable<Model.SolutionAccelerator>) => {
                // Reset solution view context whenever a new solution is selected
                self.disposeSolutionSubscriptions();
                self.initializeViewContext();
                if (activeSolution && activeSolution()) {
                    // Reset solution parameters to defaults
                    self.solutionIsSelected(true);
                    self.showNotification(false);
                    self.numCompletedResources(0);
                    self.deploymentCompletionPercentage(0);
                    self.deploymentCompletionPercentage.notifySubscribers();
                    self.isGraphRendering(true);
                    self.provisioningStatus(GraphNodeStatus.InProgress);
                    self.resetGraphNodeDefaults();

                    var currentStatus: string = activeSolution().provisionState.provisioningState.toLowerCase();
                    // If the solution is still deploying, default to not show the right panel
                    ShellContext.RightPanelIsExpanded(currentStatus != self.graphNodeStatusInprogress);

                    // Extract the solution type and update if needed
                    self.solutionName(activeSolution().rowKey);
                    self.solutionSubscriptionId = activeSolution().partitionKey;
                    var newSolutionType: string = activeSolution().templateId;
                    var solutionTypeUpdated: boolean = false;
                    if (self.solutionType() != newSolutionType) {
                        self.solutionType(newSolutionType);
                        solutionTypeUpdated = true;
                    }

                    // If a new solution type, update the graph
                    // Else, if no change in solution type, just reuse the old graph
                    if (solutionTypeUpdated) {
                        Managers.SolutionAcceleratorManager
                            .getInstance()
                            .getSolutionAcceleratorTemplate(self.solutionType())
                            .then(solutionTemplate => {
                                if (solutionTemplate) {
                                    self.buildGraph(solutionTemplate.graphTemplate);
                                    self.initializeNewSolution(activeSolution);
                                }
                            });
                    }
                    else {
                        // Just in case it was moved, re-center the graph
                        self.graphControlViewModel.zoomToFit()();
                        self.initializeNewSolution(activeSolution);
                    }
                }
                else {
                    self.solutionIsSelected(false);
                }
            });

        // When the right panel is expanded or collapsed, resize the graph to fit in the available area
        var resizeSub: KnockoutSubscription<any> = ShellContext.RightPanelIsExpanded.subscribe(() => {
            // Only attempt to zoom to fit if the graph has been drawn (e.g. there are graph nodes)
            if (self.graphControlViewModel && self.graphControlViewModel.graphNodes.count > 0) {
                self.graphControlViewModel.zoomToFit()();
            }
        });

        self.componentSubscriptions.push(activeSolutionSubscription);
        self.componentSubscriptions.push(resizeSub);
    }

    // Method: disposeSolutionSubscriptions
    // Dispose of all subscriptions that should live only as long as the current solution is active
    private disposeSolutionSubscriptions(): void {
        var self = this;
        self.solutionSubscriptions.forEach(subscription => subscription.dispose());
        self.solutionSubscriptions = [];
    }

    // Method: dispose
    // Component level dispose function, dispose of all subscriptions that shouldn't live beyond the component life time
    public dispose(): void {
        var self = this;
        self.disposeSolutionSubscriptions();
        self.componentSubscriptions.forEach(subscription => subscription.dispose());
        // Dispose of computed variables
        self.solutionTypeDisplayName.dispose();
        self.deploymentFailed.dispose();
        self.deploymentSucceeded.dispose();
        self.isDeleted.dispose();
        self.showNotificationProgress.dispose();
        self.showEmptySolutionsMessage.dispose();
        self.disposeGraphNodeViewModels();
        // Release reference to DataManager to allow garbage collection
        self.DataManager = null;
        self.DataManagerReference.release();
        self.PanelManager.clear();
        self.PanelManager = null;
        self.PanelManagerReference.release();
    }
}
/******* solutionInfoView viewModel - END *******/