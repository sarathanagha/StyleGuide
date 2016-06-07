import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
import {ResourceIdUtil, Util, Controls} from "./DiagramModuleDeclarations";
import AppContext = require("../../../../scripts/AppContext");
import Framework = require("../../../../_generated/Framework");
import DataConstants = Framework.DataConstants;
import DiagramLayout = require("./DiagramLayout");
import DiagramModel = require("./DiagramModel");
import DiagramUtil = require("./DiagramUtil");
import GraphNodeViewModels = require("./GraphNodeViewModels");

import Log = require("../../../../scripts/Framework/Util/Log");

"use strict";
import Graph = Controls.Visualization.Graph;
let logger = Log.getLogger({
    loggerName: "ResourceToGraphViewModels"
});

/**
 * All view layers should expect an inconsistency in the underlying data objects and should handle them accordingly.
 */
export class ResourceToGraphViewModel implements TypeDeclarations.Disposable {
    protected _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();
    protected _lifetimeManager: TypeDeclarations.DisposableLifetimeManager;
    protected _refreshId: number = 0;               // Represents the data update.
    protected _disposed: boolean = false;
    protected _factoryId: string;
    protected _splitFactoryId: ResourceIdUtil.IDataFactoryId;
    protected _diagramModel: DiagramModel.DiagramModel = null;

    protected _pipelineNodeDescriptors: StringMap<DiagramLayout.IGraphNode> = Object.create(null);
    protected _activityNodeDescriptors: StringMap<DiagramLayout.IGraphNode> = Object.create(null);
    protected _tableNodeDescriptors: StringMap<DiagramLayout.IGraphNode> = Object.create(null);
    protected _edgeDescriptors: DiagramLayout.IGraphEdge[];
    protected _localLayoutCenter: DiagramLayout.IPoint = null;
    protected _currentLayoutLifetime: Framework.Disposable.IDisposableLifetimeManager = null;

    public _diagramLayoutStateMachine: DiagramLayout.DiagramLayoutStateMachine;
    public graphNodeViewModels: StringMap<Graph.GraphNode> = Object.create(null);
    public graphEdgeViewModels: StringMap<Graph.GraphEdge> = Object.create(null);
    public _newGraphAvailable: KnockoutObservable<boolean> = <KnockoutObservable<boolean>>ko.observable(false).extend({ notify: "always" });
    public resourceViewStatus: KnockoutObservable<string> = ko.observable(null);

    private _diagramModelSubscription: KnockoutSubscription<boolean> = null;

    constructor(container: Framework.Disposable.IDisposableLifetimeManager, factoryId: string, diagramModel: DiagramModel.DiagramModel) {
        this._lifetimeManager = container.createChildLifetime();
        this._diagramModel = diagramModel;
        if (factoryId) {
            this._updateFactoryId(factoryId);
        }
        if (diagramModel) {
            this._updateDiagramModel(diagramModel);
        }
    }

    public _updateFactoryId(factoryId: string) {
        this._factoryId = factoryId;
        this._splitFactoryId = ResourceIdUtil.splitResourceString(factoryId);
    }

    public _updateDiagramModel(diagramModel: DiagramModel.DiagramModel): void {
        this._diagramModel = diagramModel;
        if (this._diagramModelSubscription) {
            this._diagramModelSubscription.dispose();
        }
        this._diagramModelSubscription = diagramModel._newDataAvailable.subscribe(() => {
            this._updateGraphInputs();
        });
        this._lifetimeManager.registerForDispose(this._diagramModelSubscription);
    }

    public _updateGraphInputs(): void {
        logger.logError("_updateGraphInputs should be overidden by the implementing class.");
    }

    protected _createPipelineNodes(pipelines: StringMap<MdpExtension.DataModels.BatchPipeline>) {
        this._pipelineNodeDescriptors = Object.create(null);

        // We arbitrarily assign X and Y because MSAGL is going to assign these fields later.
        for (let key in pipelines) {
            let pipeline = pipelines[key];

            this._pipelineNodeDescriptors[GraphNodeViewModels.FixedSizePipelineGraphNodeViewModel._pipelineKey(pipeline.name())] = {
                Height: GraphNodeViewModels.Constants.PipelineGraphNodeHeight,
                Width: GraphNodeViewModels.Constants.PipelineGraphNodeWidth,
                X: 0,
                Y: 0
            };
        }
    }

    protected _createActivityNodes(pipeline: MdpExtension.DataModels.BatchPipeline, pipelineId: string) {
        this._activityNodeDescriptors = Object.create(null);

        pipeline.properties().activities().forEach((activity: MdpExtension.DataModels.Activity) => {
            this._activityNodeDescriptors[GraphNodeViewModels.ActivityGraphNodeViewModel._activityKey(activity.name(), pipelineId)] = {
                Height: GraphNodeViewModels.Constants.ActivityGraphNodeHeight,
                Width: GraphNodeViewModels.Constants.ActivityGraphNodeWidth,
                X: 0,
                Y: 0
            };
        });
    }

    protected _createTableNodes(allTables: StringMap<MdpExtension.DataModels.DataArtifact>) {
        this._tableNodeDescriptors = Object.create(null);

        for (let key in allTables) {
            let table = allTables[key];

            this._tableNodeDescriptors[GraphNodeViewModels.TableGraphNodeViewModel._tableKey(table.name())] = {
                Height: GraphNodeViewModels.Constants.TableGraphNodeHeight,
                Width: GraphNodeViewModels.Constants.TableGraphNodeWidth,
                X: 0,
                Y: 0
            };
        }
    }

    protected _layoutGraph(currentRefresh: number, isSoftFilter: (key: string) => boolean): TypeDeclarations.PromiseN<DiagramLayout.LoadSaveResult> {
        let deferred = <Q.Deferred<DiagramLayout.IGraph>>Q.defer();

        this._diagramLayoutStateMachine.load().then(
            () => {
                if (this._refreshId === currentRefresh && !this._disposed) {
                    let nodesNeedingLayout: StringMap<DiagramLayout.IGraphNode> = {};
                    let allNodes: StringMap<DiagramLayout.IGraphNode> = {};

                    // Find nodes that don't have any layout information or have soft positions and ship them off to MSAGL.
                    for (let key in this._tableNodeDescriptors) {
                        if (!(key in this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes) ||
                            this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key].IsSoft) {
                            nodesNeedingLayout[key] = this._tableNodeDescriptors[key];
                        }

                        allNodes[key] = this._tableNodeDescriptors[key];
                    }

                    for (let key in this._pipelineNodeDescriptors) {
                        if (!(key in this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes) ||
                            this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key].IsSoft) {
                            nodesNeedingLayout[key] = this._pipelineNodeDescriptors[key];
                        }

                        allNodes[key] = this._pipelineNodeDescriptors[key];
                    }

                    for (let key in this._activityNodeDescriptors) {
                        if (!(key in this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes) ||
                            this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key].IsSoft) {
                            nodesNeedingLayout[key] = this._activityNodeDescriptors[key];
                        }

                        allNodes[key] = this._activityNodeDescriptors[key];
                    }

                    if (Object.keys(nodesNeedingLayout).length > 0) {
                        let graphToLayout = {
                            Nodes: allNodes,
                            Edges: this._edgeDescriptors,
                            GridResolution: GraphNodeViewModels.Constants.GridResolution
                        };

                        // In case any of the graph nodes do not have layout information in the saved graph, we get the layout of the entire graph,
                        // but then update the layout information of only the nodes that were missing it in the first place.
                        this._autoLayout(graphToLayout).then((layoutGraph: DiagramLayout.IGraph) => {
                            if (this._refreshId === currentRefresh && !this._disposed) {
                                for (let key in nodesNeedingLayout) {
                                    this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key] = layoutGraph.Nodes[key];
                                    if (isSoftFilter(key)) {
                                        this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key].IsSoft = true;
                                    }
                                }
                                deferred.resolve(layoutGraph);
                            }
                        });
                    } else {
                        deferred.resolve(null);
                    }
                }
            },
            (response: DiagramLayout.ILoadResponse) => {
                // If we don't find the diagram, then we should automatically lay one out.
                if (response.reason === DiagramLayout.LoadSaveResult.NotFound) {
                    if (!this._disposed && this._refreshId === currentRefresh) {
                        // Because load failed, currentLayout is presently undefined. We need to create an empty
                        // graph so autolayout can function.
                        this._diagramLayoutStateMachine.diagramLayout.currentLayout = {
                            Version: DiagramLayout.Constants.CurrentSchemaVersion,
                            Nodes: Object.create(null),
                            Edges: [],
                            GridResolution: GraphNodeViewModels.Constants.GridResolution
                        };

                        let graphToLayout: DiagramLayout.IGraph = {
                            Version: DiagramLayout.Constants.CurrentSchemaVersion,
                            Nodes: Object.create(null),
                            Edges: this._edgeDescriptors,
                            GridResolution: GraphNodeViewModels.Constants.GridResolution
                        };

                        for (let key in this._pipelineNodeDescriptors) {
                            graphToLayout.Nodes[key] = this._pipelineNodeDescriptors[key];
                        }

                        for (let key in this._tableNodeDescriptors) {
                            graphToLayout.Nodes[key] = this._tableNodeDescriptors[key];
                        }

                        for (let key in this._activityNodeDescriptors) {
                            graphToLayout.Nodes[key] = this._activityNodeDescriptors[key];
                        }

                        this._autoLayout(graphToLayout).then(
                            (layoutGraph: DiagramLayout.IGraph) => {
                                let topMargin = 4 * GraphNodeViewModels.Constants.GridResolution;
                                let leftMargin = 2 * GraphNodeViewModels.Constants.GridResolution;

                                let layoutCenter: DiagramLayout.IPoint = this._getTranslationForLayout(this._localLayoutCenter, layoutGraph);

                                // Copy the result of autolayout to our bookkeeping, adding margins so the diagram isn't flush to the top left.
                                for (let key in layoutGraph.Nodes) {
                                    let currentNode = layoutGraph.Nodes[key];

                                    this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key] = {
                                        X: currentNode.X + leftMargin - layoutCenter.X,
                                        Y: currentNode.Y + topMargin - layoutCenter.Y,
                                        Height: currentNode.Height,
                                        Width: currentNode.Width
                                    };
                                }

                                if (!this._disposed && this._refreshId === currentRefresh) {
                                    this._diagramLayoutStateMachine.save().then(
                                        () => {
                                            deferred.resolve(null);
                                        },
                                        (_response: DiagramLayout.ISaveResponse) => {
                                            deferred.resolve(null);
                                        }
                                    );
                                }
                            },
                            (reason: DiagramLayout.LoadSaveResult) => {
                                deferred.reject(response.reason);
                            }
                        );
                    }
                } else {
                    deferred.reject(response.reason);
                }
            }
        );
        return deferred.promise;
    }

    protected _autoLayout(graph: DiagramLayout.IGraph): TypeDeclarations.PromiseVN<DiagramLayout.IGraph, DiagramLayout.LoadSaveResult> {
        let deferred = Q.defer();

        this._appContext.dataFactoryService.ajaxQ<DiagramLayout.IGraph>({
            url: DataConstants.LayoutGraphUri,
            data: JSON.stringify(graph),
            type: "POST",
            contentType: "application/json"
        }).then((layoutGraph: DiagramLayout.IGraph) => {
            deferred.resolve(layoutGraph);
        }, (reason: JQueryXHR) => {
            // TODO paverma Currently the fail method does not exist. Either bring in some concepts from Ibiza, or
            // modify this to convey failure elsewise.
            logger.logError("Failed to get auto layout: {0}".format(reason.responseText));
            deferred.reject(DiagramLayout.LoadSaveResult.Unknown);
        });

        return deferred.promise;
    }

    // This is exposed to the graphViewModel and creates the IGraph that MSAGL understands and populates the diagramLayoutStateMachine's layout.
    public _invokeAutoLayout(): TypeDeclarations.Promise {
        let allNodes: StringMap<DiagramLayout.IGraphNode> = {};
        for (let key in this._pipelineNodeDescriptors) {
            allNodes[key] = this._pipelineNodeDescriptors[key];
        }

        for (let key in this._tableNodeDescriptors) {
            allNodes[key] = this._tableNodeDescriptors[key];
        }

        for (let key in this._activityNodeDescriptors) {
            allNodes[key] = this._activityNodeDescriptors[key];
        }

        let graph = {
            Nodes: allNodes,
            Edges: this._edgeDescriptors,
            GridResolution: GraphNodeViewModels.Constants.GridResolution
        };

        return this._autoLayout(graph).then(
            (layoutGraph: DiagramLayout.IGraph) => {
                let layoutGraphCenter = this._getTranslationForLayout(this._localLayoutCenter, layoutGraph);

                for (let key in this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes) {
                    let curNode = this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key];

                    if (key in layoutGraph.Nodes) {
                        curNode.X = layoutGraph.Nodes[key].X - layoutGraphCenter.X;
                        curNode.Y = layoutGraph.Nodes[key].Y - layoutGraphCenter.Y;
                    }
                }
            },
            () => {
                logger.logError("Failed to autolayout.");
            }
        );
    }

    /**
     * Teardown
     */
    public dispose() {
        this._disposed = true;
        this._lifetimeManager.dispose();
    }

    // The graph being stretched is retrieved from an external source, and hence its okay to modify inplace.
    protected _stretchGraph(graph: DiagramLayout.IGraph): DiagramLayout.IGraph {
        for (let key in graph.Nodes) {
            let node = graph.Nodes[key];
            node.Y *= GraphNodeViewModels.Constants.VerticalStretchFactor;
            node.Height *= GraphNodeViewModels.Constants.VerticalStretchFactor;
        }
        return graph;
    }

    // The graph being contracted is present in the layout state machine, and hence cannot be modified inplace.
    protected _contractGraph(graph: DiagramLayout.IGraph): DiagramLayout.IGraph {
        graph = JSON.parse(JSON.stringify(graph));
        for (let key in graph.Nodes) {
            let node = graph.Nodes[key];
            node.Y /= GraphNodeViewModels.Constants.VerticalStretchFactor;
            node.Height /= GraphNodeViewModels.Constants.VerticalStretchFactor;
        }
        return graph;
    }

    protected _updateTableAvailabilityFromPipelines(
        pipelines: StringMap<MdpExtension.DataModels.BatchPipeline>,
        tables: StringMap<MdpExtension.DataModels.DataArtifact>): void {
        for (let pipelineKey in pipelines) {
            let pipeline = pipelines[pipelineKey];
            if (pipeline.properties().activities) {
                pipeline.properties().activities().forEach((activity) => {
                    if (activity.outputs) {
                        activity.outputs().forEach((outputTable) => {
                            let tableKey = GraphNodeViewModels.TableGraphNodeViewModel._tableKey(outputTable.name());
                            let table = tables[tableKey];
                            if (table) {
                                table.properties().availability = activity.scheduler;
                            }
                        });
                    }
                });
            }
        }
    }

    private _getTranslationForLayout(localLayoutCenter: DiagramLayout.IPoint, currentLayout: DiagramLayout.IGraph): DiagramLayout.IPoint {
        if (localLayoutCenter === null) {
            return { X: 0, Y: 0 };
        }
        // Get centre for the current layout.
        let layoutBoundingBox: Graph.IRect = null;
        for (let key in currentLayout.Nodes) {
            let node = currentLayout.Nodes[key];
            if (layoutBoundingBox === null) {
                layoutBoundingBox = { x: node.X, y: node.Y, width: node.Width, height: node.Height };
            } else {
                DiagramUtil._updateBoundingBox(layoutBoundingBox, node);
            }
        }
        let layoutCenter: DiagramLayout.IPoint = {
            X: layoutBoundingBox.x + layoutBoundingBox.width / 2 - localLayoutCenter.X,
            Y: layoutBoundingBox.y + layoutBoundingBox.height / 2 - localLayoutCenter.Y
        };
        return layoutCenter;
    }
}

/**
 * Setup all the data subscriptions, select the nodes that will be a part of the graph, and use helper classes to get a
 * layout for the nodes.
 */
export class FactoryToGraphViewModel extends ResourceToGraphViewModel {
    private _tableIngresses: StringMap<StringMap<string>>;
    private _tableEgresses: StringMap<StringMap<string>>;
    private _tablesWithoutInternals: StringMap<MdpExtension.DataModels.DataArtifact>;
    private _internalTables: StringMap<number>;

    constructor(container: Framework.Disposable.IDisposableLifetimeManager, factoryId: string, diagramModel: DiagramModel.DiagramModel) {
        super(container, factoryId, diagramModel);

        // Create a DSM that knows how to load and save the graph.
        this._diagramLayoutStateMachine = new DiagramLayout.DiagramLayoutStateMachine(
            this._lifetimeManager,
            (): TypeDeclarations.PromiseVN<DiagramLayout.ILoadResponse, DiagramLayout.ILoadResponse> => {
                let deferred = <Q.Deferred<DiagramLayout.ILoadResponse>>Q.defer();

                this._appContext.dataFactoryService.ajax<string>({
                    url: DataConstants.FactoryUri + "/ExtensionData",
                    data: {
                        subscriptionId: this._splitFactoryId.subscriptionId,
                        resourceGroupName: this._splitFactoryId.resourceGroupName,
                        factoryName: this._splitFactoryId.dataFactoryName,
                        key: "layout"
                    },
                    type: "GET",
                    contentType: "application/json"
                }).then((data: string, status: string, xhr: TypeDeclarations.JQueryXHRString) => {
                    // We consider either a 404 or empty text to be not found.
                    // Our data was serialized twice so the backend can see it's a string. The portal deserializes once for us, so we only need to call JSON.parse once.
                    let response = {
                        reason: data ? DiagramLayout.LoadSaveResult.Ok : DiagramLayout.LoadSaveResult.NotFound,
                        etag: xhr.getResponseHeader("Etag"),
                        graph: data ? this._stretchGraph(JSON.parse(xhr.responseText)) : undefined
                    };

                    if (data) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
                }, (xhr: TypeDeclarations.JQueryXHRString) => {
                    let response = {
                        reason: this._getLoadSaveResult(xhr, "load layout"),
                        etag: xhr.getResponseHeader("Etag")
                    };

                    deferred.reject(response);
                });

                return deferred.promise;
            },
            (request: DiagramLayout.ISaveRequest): TypeDeclarations.PromiseVN<DiagramLayout.ISaveResponse, DiagramLayout.ISaveResponse> => {
                let deferred = <Q.Deferred<DiagramLayout.ISaveResponse>>Q.defer();

                this._appContext.dataFactoryService.ajax<string>({
                    url: DataConstants.FactoryUri + "/ExtensionData?" + $.param({
                        subscriptionId: this._splitFactoryId.subscriptionId,
                        resourceGroupName: this._splitFactoryId.resourceGroupName,
                        factoryName: this._splitFactoryId.dataFactoryName,
                        key: "layout"
                    }),
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(JSON.stringify(this._contractGraph(request.graph))), // We stringify twice so that the backend will deserialize into a string instead of a graph.
                    headers: { "If-Match": request.etag }
                }).then((data: string, status: string, xhr: TypeDeclarations.JQueryXHRString) => {
                    let saveResponse: DiagramLayout.ISaveResponse = {
                        reason: DiagramLayout.LoadSaveResult.Ok,
                        etag: xhr.getResponseHeader("Etag")
                    };

                    deferred.resolve(saveResponse);
                }, (xhr: TypeDeclarations.JQueryXHRString) => {
                    let saveResponse: DiagramLayout.ISaveResponse = {
                        reason: this._getLoadSaveResult(xhr, "save layout"),
                        etag: xhr.getResponseHeader("Etag")
                    };

                    if (xhr.status === 412) {
                        // Precondition failed returns the current version of the saved graph.
                        saveResponse.graph = this._stretchGraph(JSON.parse(xhr.responseText));
                    }
                    deferred.reject(saveResponse);
                });

                return deferred.promise;
            }
        );
    }

    public _updateGraphInputs(): void {
        let pipelines = this._diagramModel._pipelines;
        let allTables = this._diagramModel._allTables;

        if (Object.keys(pipelines).length + Object.keys(allTables).length === 0) {
            this.resourceViewStatus(ClientResources.emptyFactoryText);
        } else {
            this.resourceViewStatus(null);
        }

        let currentRefreshId = ++this._refreshId;

        // 1. Figure out from activities which pipelines are connected to which tables. If this doesn't return a valid graph,
        //    then we need to refresh the table and pipeline caches and try again.
        // 2. Remove tables both produced and consumed only by the same pipeline. If a table
        //    is produced and consumed by a pipeline, but is also produced or consumed by another
        //    pipeline, remove connections feeding back into the pipeline.
        // 3. Create a list of graph nodes for MSAGL to layout.
        // 4. Create a list of edges for MSAGL.
        // 5. Ship the graph off to MSAGL via ajax to get node positions.
        // 6. When that call completes, create graph nodes and edges, assign their positions, and put them in  their respective maps.
        this._correlateEdges(pipelines, allTables);
        this._removeInternalTables(allTables);
        this._createPipelineNodes(pipelines);
        this._createTableNodes(allTables);
        this._createEdges();
        this._updateTableAvailabilityFromPipelines(pipelines, allTables);

        // If the node has no edges, we mark its layout as soft so we can move it again later when it
        // gets connected.
        let isSoftFilter = (key: string) => {
            if (!(key in this._tableEgresses) && !(key in this._tableIngresses)) {
                return true;
            }
            return false;
        };

        this._layoutGraph(currentRefreshId, isSoftFilter).then(() => {
            // We only want the result of layoutGraph to be applied if it's the result of the most recent call to updateGraph.
            // Create the graph node/edge view models here and let the floordiagram pick up the changes, if it wants to.
            if (this._refreshId === currentRefreshId && !this._disposed) {
                if (this._currentLayoutLifetime) {
                    this._currentLayoutLifetime.dispose();
                }
                this._currentLayoutLifetime = this._lifetimeManager.createChildLifetime();
                this.graphNodeViewModels = Object.create(null);
                this.graphEdgeViewModels = Object.create(null);

                let newGraphNode: Graph.GraphNode;
                let layout: DiagramLayout.IGraphNode;

                // Remove internal nodes from the layout.
                for (let key in this._internalTables) {
                    delete this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key];
                }

                for (let key in this._tablesWithoutInternals) {
                    layout = this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key];
                    // The layout function ensures that all graph nodes have layout information.
                    newGraphNode = new GraphNodeViewModels.TableGraphNodeViewModel(this._tablesWithoutInternals[key], this._factoryId, layout.X,
                        layout.Y, this._diagramModel._tableStatusQueryProperties[key]);
                    newGraphNode.id(key);
                    this.graphNodeViewModels[key] = newGraphNode;
                }

                for (let key in pipelines) {
                    let pipeline = pipelines[key];
                    layout = this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[key];
                    newGraphNode = new GraphNodeViewModels.FixedSizePipelineGraphNodeViewModel(this._currentLayoutLifetime, pipeline, this._factoryId, layout.X, layout.Y);
                    newGraphNode.id(key);
                    this.graphNodeViewModels[key] = newGraphNode;
                }

                this._edgeDescriptors.forEach((edge: DiagramLayout.IGraphEdge) => {
                    let newGraphEdge = new Graph.GraphEdge(
                        {
                            id: ko.observable(edge.StartNodeId)
                        },
                        {
                            id: ko.observable(edge.EndNodeId)
                        }
                    );
                    this.graphEdgeViewModels[newGraphEdge.id()] = newGraphEdge;
                });

                this._newGraphAvailable(true);
            }
        }, (reason) => {
            if (currentRefreshId === this._refreshId) {
                logger.logError("An error occurred while updating the graph: " + JSON.stringify(reason),
                    { category: "FactoryToGraphViewModel" });
            }
        });

        if (!this._diagramLayoutStateMachine.isAutoLoading()) {
            this._diagramLayoutStateMachine.startAutoLoading();
        }
    }

    private _getLoadSaveResult(xhr: TypeDeclarations.JQueryXHRString, action: string): DiagramLayout.LoadSaveResult {
        let reason: DiagramLayout.LoadSaveResult = DiagramLayout.LoadSaveResult.Unknown;

        switch (xhr.status) {
            case 412:
                reason = DiagramLayout.LoadSaveResult.OutOfDate;
                break;
            case 404:
                reason = DiagramLayout.LoadSaveResult.NotFound;
                break;
            case 403:
                reason = DiagramLayout.LoadSaveResult.Forbidden;
                break;
            case 0:
                logger.logError("Failed to {0}. Xhr message: {1}".format(action, JSON.stringify(xhr)));
                break;
            default:
                logger.logError("Failed to {0}. HTTP status code: {1}".format(action, xhr.status));
                break;
        }

        return reason;
    }

    /**
     * Goes through activity ids on pipelines and correlated pipelines to tables. In some cases, we expect
     * that the created graph is invalid, namely when tables have fetched again and are deleted but the
     * pipeline cache hasn't updated yet. This function will throw away any invalid edges under the assumption
     * that a later pipeline refresh will sort everything out.
     */
    private _correlateEdges(pipelines: StringMap<MdpExtension.DataModels.BatchPipeline>, allTables: StringMap<MdpExtension.DataModels.DataArtifact>) {
        this._tableIngresses = Object.create(null);
        this._tableEgresses = Object.create(null);

        this._tableIngresses = Object.create(null);
        this._tableEgresses = Object.create(null);
        let pipelineKey: string;
        for (pipelineKey in pipelines) {
            let pipeline = pipelines[pipelineKey];

            // Correlate table inputs and outputs from edges. We can't assume the pipelines and tables
            // API calls are in a consistent state, so we have to throw away any edges to table nodedfsda
            // that don't exist.
            pipeline.properties().activities().forEach((activity: MdpExtension.DataModels.Activity) => {
                if (Util.koPropertyHasValue(activity.inputs)) {
                    activity.inputs().forEach((input: MdpExtension.DataModels.ActivityInput) => {
                        let inputKey = GraphNodeViewModels.TableGraphNodeViewModel._tableKey(input.name());

                        // Dump edges from tables we don't know about.
                        if (!(inputKey in allTables)) {
                            return;
                        }

                        if (!(inputKey in this._tableEgresses)) {
                            this._tableEgresses[inputKey] = Object.create(null);
                        }

                        this._tableEgresses[inputKey][pipelineKey] = pipelineKey;
                    });
                }

                if (Util.koPropertyHasValue(activity.outputs)) {
                    activity.outputs().forEach((output: MdpExtension.DataModels.ActivityOutput) => {
                        let outputKey = GraphNodeViewModels.TableGraphNodeViewModel._tableKey(output.name());

                        // Dump edges to tables we don't know about.
                        if (!(outputKey in allTables)) {
                            return;
                        }

                        if (!(outputKey in this._tableIngresses)) {
                            this._tableIngresses[outputKey] = Object.create(null);
                        }

                        this._tableIngresses[outputKey][pipelineKey] = pipelineKey;
                    });
                }
            });
        }
    }

    private _removeInternalTables(allTables: StringMap<MdpExtension.DataModels.DataArtifact>) {
        this._tablesWithoutInternals = {};
        this._internalTables = {};

        // Initially copy all the tables over to tableWithoutInternals. We'll remove
        // internal tables later.
        for (let tableKey in allTables) {
            this._tablesWithoutInternals[tableKey] = allTables[tableKey];
        }

        for (let tableKey in this._tableEgresses) {
            let egresses = this._tableEgresses[tableKey];
            let ingresses = this._tableIngresses[tableKey];

            // If a table is created by only 1 pipeline, and the table is consumed
            // by the pipeline that created it, then we want to completely remove the
            // table and all edges to and from it. It is an internal table.
            if (egresses && Object.keys(egresses).length === 1 &&
                ingresses && Object.keys(ingresses).length === 1 &&
                Object.keys(egresses)[0] in ingresses) {
                this._internalTables[tableKey] = null;
                delete this._tablesWithoutInternals[tableKey];
                delete this._tableEgresses[tableKey];
                delete this._tableIngresses[tableKey];
            } else { // Remove table egresses that are also ingresses
                for (let egressKey in egresses) {
                    if (ingresses && egressKey in ingresses) {
                        delete egresses[egressKey];
                    }
                }
            }
        }
    }

    private _createEdges(): void {
        this._edgeDescriptors = [];

        for (let tableKey in this._tableEgresses) {
            let egresses = this._tableEgresses[tableKey];

            for (let pipelineKey in egresses) {
                this._edgeDescriptors.push({
                    StartNodeId: tableKey,
                    EndNodeId: pipelineKey,
                    Waypoints: []
                });
            }
        }

        for (let tableKey in this._tableIngresses) {
            let ingresses = this._tableIngresses[tableKey];

            for (let pipelineKey in ingresses) {
                this._edgeDescriptors.push({
                    StartNodeId: pipelineKey,
                    EndNodeId: tableKey,
                    Waypoints: []
                });
            }
        }
    }
}
