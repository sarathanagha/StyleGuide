import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
import DiagramModuleDeclarations = require("./DiagramModuleDeclarations");
import Framework = require("../../../../_generated/Framework");

import AppContext = require("../../../../scripts/AppContext");
import DiagramModel = require("./DiagramModel");
import PipelineToGraphViewModel = require("./PipelineToGraphViewModel");
import ResourceToGraphViewModels = require("./ResourceToGraphViewModels");
import GraphNodeViewModels = require("./GraphNodeViewModels");
import GraphViewModel = require("./GraphViewModel");
import DiagramLayout = require("./DiagramLayout");
import IconResources = Framework.IconResources;
import DiagramUtil = require("./DiagramUtil");
import DiagramContracts = DiagramModuleDeclarations.DiagramContracts;
import PipelineNodeCommands = require("./PipelineNodeCommands");
import DatasetNodeCommands = require("./DatasetNodeCommands");
import Log = require("../../../../scripts/Framework/Util/Log");
import RoutingHandler = require("../../../../scripts/Handlers/RoutingHandler");

let logger = Log.getLogger({
    loggerName: "DiagramViewModel"
});

import Graph = DiagramModuleDeclarations.Controls.Visualization.Graph;

export class DiagramViewModel extends Framework.Disposable.ChildDisposable {
    public static className: string = "DiagramViewModel";
    public loading: KnockoutObservable<boolean>;

    public _diagramModel: DiagramModel.DiagramModel;
    public graphViewModel: GraphViewModel.GraphViewModel;

    public layoutStatus: KnockoutComputed<string>;
    public switchInProgress: KnockoutObservable<boolean> = ko.observable(false);
    public switchInProgressImage: TypeDeclarations.Image = IconResources.Icons.loading;
    public diagramStatus: KnockoutComputed<string> = null;

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();
    private _factoryId: string;

    private _activeResourceView: KnockoutObservable<ResourceToGraphViewModels.ResourceToGraphViewModel>;
    private _activeDiagramContext: DiagramContracts.IDiagramContext = null;
    private _factoryResourceView: KnockoutObservable<ResourceToGraphViewModels.ResourceToGraphViewModel> = ko.observable(null);
    private _factoryDiagramContext: DiagramContracts.IDiagramContext;
    private _routingHandlerSubscription: RoutingHandler.IRoutingHandlerSubscription = null;

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, element: JQuery) {
        super(lifetimeManager);

        this._diagramModel = new DiagramModel.DiagramModel(this._lifetimeManager);
        this.graphViewModel = new GraphViewModel.GraphViewModel(this._lifetimeManager);

        // hook up the spinner
        this.loading = this.graphViewModel.loading;

        // register with routing handler
        this._routingHandlerSubscription = {
            name: DiagramViewModel.className,
            callback: (message) => {
                let pipelineName = message[RoutingHandler.urlKeywords.pipeline.value];
                if (pipelineName) {
                    this._appContext.diagramContext({
                        diagramMode: DiagramContracts.DiagramMode.OpenPipeline,
                        diagramModeParameters: {
                            pipelineId: DiagramModuleDeclarations.PipelineModel.getPipelineKey(pipelineName)
                        }
                    });
                } else {
                    this._appContext.diagramContext(this._factoryDiagramContext);
                }
            }
        };
        this._appContext.routingHandler.register(this._routingHandlerSubscription);

        // setup diagram context.
        this._factoryDiagramContext = {
            diagramMode: DiagramContracts.DiagramMode.Factory,
            diagramModeParameters: null
        };
        this._routingHandlerSubscription.callback(this._appContext.routingHandler.getState());
        this._activeDiagramContext = this._appContext.diagramContext();

        // setup active resource view.
        this._activeResourceView = ko.observable<ResourceToGraphViewModels.ResourceToGraphViewModel>(null);
        switch (this._activeDiagramContext.diagramMode) {
            case DiagramContracts.DiagramMode.Factory:
                this._activeResourceView(this._getFactoryResourceView());
                break;

            case DiagramContracts.DiagramMode.OpenPipeline:
                let pipelineId = this._activeDiagramContext.diagramModeParameters.pipelineId;
                this._activeResourceView(new PipelineToGraphViewModel.PipelineToGraphViewModel(this._lifetimeManager, this._factoryId, this._diagramModel,
                    pipelineId, null));
                break;

            default:
                // Do not react.
                logger.logError("Unsupported DiagramMode in DiagramContext:", JSON.stringify(this._activeDiagramContext));
                break;
        }

        this.graphViewModel._updateResourceDependencies(this._activeResourceView());
        this.layoutStatus = ko.pureComputed(() => {
            if (this._factoryResourceView()) {
                return this._factoryResourceView()._diagramLayoutStateMachine.layoutStatus();
            }
            return "";
        });

        this._lifetimeManager.registerForDispose(this._appContext.diagramContext.subscribe((diagramContext: DiagramContracts.IDiagramContext) => {
            if (diagramContext && this._activeDiagramContext.diagramMode !== diagramContext.diagramMode && !this.switchInProgress()) {
                switch (diagramContext.diagramMode) {
                    case DiagramContracts.DiagramMode.Factory:
                        if (this._activeDiagramContext.diagramMode === DiagramContracts.DiagramMode.OpenPipeline) {
                            this.switchInProgress(true);
                            this._switchFromPipelineToFactory(diagramContext).finally(() => {
                                this.switchInProgress(false);
                            });
                        }
                        break;

                    // TODO iannight: we should be able to switch from a pipeline to a pipeline
                    case DiagramContracts.DiagramMode.OpenPipeline:
                        if (this._activeDiagramContext.diagramMode === DiagramContracts.DiagramMode.Factory) {
                            this.switchInProgress(true);
                            this._switchFromFactoryToPipeline(diagramContext).finally(() => {
                                this.switchInProgress(false);
                            });
                        }
                        break;

                    default:
                        logger.logError("Unsupported diagram mode");
                }
            }
        }));

        // Global dateRange is one of the ways to refresh the app, hence subscribing here. Once polling mechanism is available,
        // add subsriptions to the individual components that need to subscirbe to dateRange.
        this._lifetimeManager.registerForDispose(this._appContext.dateRange.subscribe(() => {
            this.onInputsSet({
                factoryId: this._factoryId
            });
        }));

        // Register node commands.
        let pipelineNodeCommandGroup = new PipelineNodeCommands.PipelineNodeCommandGroup();
        let datasetNodeCommandGroup = new DatasetNodeCommands.DatasetNodeCommandGroup();
        this._appContext.registerContextMenuCommandGroup(pipelineNodeCommandGroup);
        this._appContext.registerContextMenuCommandGroup(datasetNodeCommandGroup);

        // Setup diagram status.
        this.diagramStatus = ko.pureComputed(() => {
            return this._activeResourceView().resourceViewStatus();
        });
    }

    public onInputsSet(inputs: IInputsSet) {
        this.loading(true);
        this._factoryId = inputs.factoryId;
        this.graphViewModel.onInputsSet(inputs);
        this._activeResourceView()._updateFactoryId(inputs.factoryId);
        this._diagramModel.onInputsSet(inputs).fail((reason: JQueryXHR) => {
            logger.logError("Failed to load diagram for factory {0}.".format(this._factoryId), reason);
            this.loading(false);
        });
    }

    public dispose(): void {
        this._appContext.routingHandler.unregister(this._routingHandlerSubscription);
        super.dispose();
    }

    private _switchFromFactoryToPipeline(diagramContext: DiagramContracts.IDiagramContext): TypeDeclarations.Promise {
        let pipelineId = diagramContext.diagramModeParameters.pipelineId;
        let pipeline = this._diagramModel._pipelines[pipelineId];
        let pipelineView: PipelineToGraphViewModel.PipelineToGraphViewModel;

        let switchComplete = Q.defer();
        let switchCompletePromise = switchComplete.promise.then(() => {
            this._setupPipelineContext(pipelineId, pipeline);

            this.graphViewModel._updateResourceDependencies(pipelineView);
            this._activeResourceView(pipelineView);
            this._activeDiagramContext = diagramContext;
        });

        this.graphViewModel._updateResourceDependencies(null);

        if (pipeline) {
            let pipelineNodeLayout = this._activeResourceView()._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[pipelineId];
            let localLayoutCenter: DiagramLayout.IPoint = { X: pipelineNodeLayout.X + pipelineNodeLayout.Width / 2, Y: pipelineNodeLayout.Y + pipelineNodeLayout.Height / 2 };
            let currentLayout = this._activeResourceView()._diagramLayoutStateMachine.diagramLayout.currentLayout;
            // TODO RDBug 3779152 Even though the dummyPipelineNode is exactly same as the one in the graphViewModels,
            // some issue with selection causes bad behavior (on dragging a node, the node does not move with the
            // mouse pointer). This is fixed with the graph control selection fixes. This can be removed once those changes are in production.
            let dummyPipelineNode = new GraphNodeViewModels.FixedSizePipelineGraphNodeViewModel(
                this._lifetimeManager, pipeline, this._factoryId, currentLayout.Nodes[pipelineId].X, currentLayout.Nodes[pipelineId].Y);

            pipelineView = new PipelineToGraphViewModel.PipelineToGraphViewModel(
                this._lifetimeManager, this._factoryId, this._diagramModel, diagramContext.diagramModeParameters.pipelineId, localLayoutCenter);
            let newGraphSubscription = pipelineView._newGraphAvailable.subscribe(() => {
                newGraphSubscription.dispose();
                this.graphViewModel.animateCentralNodeExit(
                    pipelineId,
                    dummyPipelineNode,
                    this._activeResourceView()._diagramLayoutStateMachine.diagramLayout.currentLayout,
                    pipelineView.graphNodeViewModels,
                    pipelineView.graphEdgeViewModels,
                    pipelineView._diagramLayoutStateMachine.diagramLayout.currentLayout
                ).finally(() => {
                    switchComplete.resolve(true);
                });
            });
            this._lifetimeManager.registerForDispose(newGraphSubscription);
        } else {
            pipelineView = new PipelineToGraphViewModel.PipelineToGraphViewModel(this._lifetimeManager, this._factoryId, this._diagramModel, diagramContext.diagramModeParameters.pipelineId,
                { X: 0, Y: 0 });
            // Even if pipeline doesn't exist, update the diagram and let pipeline view handle the state.
            switchComplete.resolve(true);
        }
        pipelineView._updateGraphInputs();

        return switchCompletePromise;
    }

    private _switchFromPipelineToFactory(diagramContext: DiagramContracts.IDiagramContext): TypeDeclarations.Promise {
        // clear the pipeline filter
        this._appContext.monitoringViewHandler.clearGlobalPipelineFilter();
        this._appContext.monitoringViewHandler.pushNotification();
        let factoryResourceView = this._getFactoryResourceView();

        let switchComplete = Q.defer();
        let switchCompletePromise = switchComplete.promise.then(() => {
            this._appContext.diagramContext(this._factoryDiagramContext);

            this.graphViewModel._updateResourceDependencies(factoryResourceView);
            this._activeResourceView().dispose();
            this._activeResourceView(factoryResourceView);
            this._activeDiagramContext = diagramContext;
        });

        this.graphViewModel._updateResourceDependencies(null);
        let pipelineId = this._activeDiagramContext.diagramModeParameters.pipelineId;
        let pipeline = this._diagramModel._pipelines[pipelineId];
        if (pipeline) {
            let currentLayoutBoundingBox: Graph.IRect = null;
            for (let key in this._activeResourceView()._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes) {
                let node = this._activeResourceView()._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key];
                if (currentLayoutBoundingBox === null) {
                    currentLayoutBoundingBox = { x: node.X, y: node.Y, width: node.Width, height: node.Height };
                } else {
                    DiagramUtil._updateBoundingBox(currentLayoutBoundingBox, node);
                }
            }
            let dummyPipelineNode = new GraphNodeViewModels.BasePipelineGraphNodeViewModel(this._lifetimeManager, pipeline, this._factoryId, currentLayoutBoundingBox);
            dummyPipelineNode.id(this._activeDiagramContext.diagramModeParameters.pipelineId);

            let newGraphSubscription = factoryResourceView._newGraphAvailable.subscribe(() => {
                newGraphSubscription.dispose();
                this.graphViewModel.animateCentralNodeEnter(
                    this._activeDiagramContext.diagramModeParameters.pipelineId,
                    dummyPipelineNode,
                    this._activeResourceView()._diagramLayoutStateMachine.diagramLayout.currentLayout,
                    factoryResourceView.graphNodeViewModels,
                    factoryResourceView.graphEdgeViewModels,
                    factoryResourceView._diagramLayoutStateMachine.diagramLayout.currentLayout
                ).finally(() => {
                    switchComplete.resolve(true);
                });
            });
            this._lifetimeManager.registerForDispose(newGraphSubscription);
        } else {
            switchComplete.resolve(true);       // Resolving, since the factory view should always exist.
        }
        factoryResourceView._updateGraphInputs();

        return switchCompletePromise;
    }

    private _getFactoryResourceView(): ResourceToGraphViewModels.ResourceToGraphViewModel {
        if (!this._factoryResourceView()) {
            this._factoryResourceView(new ResourceToGraphViewModels.FactoryToGraphViewModel(this._lifetimeManager, this._factoryId, this._diagramModel));
        }
        return this._factoryResourceView();
    }

    private _setupPipelineContext(pipelineId: string, pipeline: MdpExtension.DataModels.BatchPipeline): void {
        let pipelineContext = <DiagramContracts.IDiagramContext>{
            diagramMode: DiagramContracts.DiagramMode.OpenPipeline,
            diagramModeParameters: {
                pipelineId: pipelineId
            }
        };
        this._appContext.diagramContext(pipelineContext);
        if (pipeline) {
            let newUrlParams: StringMap<string> = {};
            newUrlParams[RoutingHandler.urlKeywords.pipeline.value] = pipeline.name();
            this._appContext.routingHandler.pushState(DiagramViewModel.className, newUrlParams);
        }
    }
}

export interface IInputsSet {
    factoryId: string;
}
