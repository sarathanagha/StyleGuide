import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
import DiagramModuleDeclarations = require("./DiagramModuleDeclarations");
import Framework = require("../../../../_generated/Framework");

import AppContext = require("../../../../scripts/AppContext");
import DataConstants = Framework.DataConstants;
import ExtensionDefinition = DiagramModuleDeclarations.ExtensionDefinition;
import GraphNodeViewModels = require("./GraphNodeViewModels");
import DiagramLayout = require("./DiagramLayout");
import DiagramToolbar = require("./DiagramToolbar");
import DiagramUtil = require("./DiagramUtil");
import ResourceToGraphViewModels = require("./ResourceToGraphViewModels");
import Log = require("../../../../scripts/Framework/Util/Log");

"use strict";
import Graph = DiagramModuleDeclarations.Controls.Visualization.Graph;
let logger = Log.getLogger({
    loggerName: "GraphViewModel"
});

/**
 * Class with which GraphLayer derivatives register themselves with for displaying their content.
 */
export class GraphViewModel extends Framework.Disposable.ChildDisposable {
    public loading: KnockoutObservable<boolean> = ko.observable(true);

    public graphViewModel: Graph.ViewModel;
    public diagramToolbar: DiagramToolbar.DiagramToolbarViewModel;
    public userHasWriteAccess = ko.observable<boolean>(false);

    public _diagramLayoutStateMachine: DiagramLayout.DiagramLayoutStateMachine;
    public _invokeAutoLayout: () => TypeDeclarations.Promise;

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();
    private _disposed: boolean = false;
    private _container: TypeDeclarations.DisposableLifetimeManager;
    private _refreshId: number;              // The resource view bound to the graphViewModel was updated.
    private _resourceViewSubscriptionManager: TypeDeclarations.DisposableLifetimeManager = null;

    constructor(container: TypeDeclarations.DisposableLifetimeManager) {
        super(container.createChildLifetime());
        this._container = container;
        this._lifetimeManager = container.createChildLifetime();
        this._refreshId = 0;

        this.graphViewModel = new Graph.ViewModel(this._lifetimeManager);

        this._lifetimeManager.registerForDispose(this.graphViewModel);

        this.diagramToolbar = new DiagramToolbar.DiagramToolbarViewModel(this._lifetimeManager, this.userHasWriteAccess);
        this.diagramToolbar.addZoomInButton(() => { return this.graphViewModel.zoomIn()(); });
        this.diagramToolbar.addZoomOutButton(() => { return this.graphViewModel.zoomOut()(); });
        this.diagramToolbar.addZoomToFitButton(() => { return this.graphViewModel.zoomToFit()(); });
        this.diagramToolbar.addZoomTo100PercentButton(() => { return this.graphViewModel.zoomTo100Percent()(); });
        this.diagramToolbar.addSelectionModeButton();
        this.diagramToolbar.addLockLayoutButton();

        this.diagramToolbar.addAutoLayoutButton(() => {
            // If the resource bound to the graphViewModel is changed, then do not make any changes to the current node locations and diagramLayoutStateMachine i.e.
            // forego node moves or the diagram save if they are still pending.
            let currentRefreshId = ++this._refreshId;

            let defer = Q.defer();
            this._invokeAutoLayout().then(() => {
                // We want to move our nodes, save, then move any nodes that merge.
                this.graphViewModel.getNodeRectsAccessor().then((rectsBeforeSave) => {
                    if (currentRefreshId === this._refreshId) {
                        this._moveUpdatedNodes(this._diagramLayoutStateMachine.diagramLayout.currentLayout, rectsBeforeSave);

                        this._diagramLayoutStateMachine.save().then(
                            () => {
                                this.graphViewModel.getNodeRectsAccessor().then((rectsAfterSave) => {
                                    if (currentRefreshId === this._refreshId) {
                                        this._moveUpdatedNodes(this._diagramLayoutStateMachine.diagramLayout.currentLayout, rectsAfterSave);
                                    }
                                    defer.resolve(true);
                                });
                            }, (response: DiagramLayout.ISaveResponse) => {
                                if (response.reason !== DiagramLayout.LoadSaveResult.Preempted) {
                                    logger.logError("Failed to save diagram after autolayout. Reason: " + DiagramLayout.LoadSaveResult[response.reason]);
                                }
                                defer.resolve(true);
                            }
                        );
                    }
                });
            }, (reason) => {
                defer.resolve(true);
            });
            return defer.promise;
        });

        this.diagramToolbar.addLineageDisplayButton();

        // Hook up the stateful buttons to the toolbar.
        this.graphViewModel.enableLineage = this.diagramToolbar.lineageEnabled;
        this.graphViewModel.rectSelectionMode = this.diagramToolbar.multiSelectEnabled;

        this.graphViewModel.gridResolution(GraphNodeViewModels.Constants.GridResolution);

        this._lifetimeManager.registerForDispose(this.diagramToolbar.diagramLocked.subscribe(() => {
            this.graphViewModel.editorCapabilities(this.diagramToolbar.diagramLocked() ? Graph.GraphEditorCapabilities.None : Graph.GraphEditorCapabilities.MoveEntities);
        }));
        this.graphViewModel.editorCapabilities(this.diagramToolbar.diagramLocked() ? Graph.GraphEditorCapabilities.None : Graph.GraphEditorCapabilities.MoveEntities);

        this.graphViewModel.getLayoutNoOverlaps((changedNodes: StringMap<Graph.IPoint>, rootId: string) => {
            return this._removeOverlaps(changedNodes, rootId);
        });
    }

    public _updateResourceDependencies(resourceToGraphViewModel: ResourceToGraphViewModels.ResourceToGraphViewModel) {
        // Apart from the static information like nodes and edges, the graphviewmodel needs to constantly interact with diagramLayoutStateMachine and often make calls
        // to get the auto layout.
        this._refreshId++;

        if (this._resourceViewSubscriptionManager !== null) {
            this._resourceViewSubscriptionManager.dispose();
        }
        this._resourceViewSubscriptionManager = this._lifetimeManager.createChildLifetime();

        if (resourceToGraphViewModel) {
            this._diagramLayoutStateMachine = resourceToGraphViewModel._diagramLayoutStateMachine;
            this._invokeAutoLayout = resourceToGraphViewModel._invokeAutoLayout.bind(resourceToGraphViewModel);
            // Hook up moving nodes when the diagram auto-loads.
            this._resourceViewSubscriptionManager.registerForDispose(this._diagramLayoutStateMachine.diagramRefreshed.subscribe(() => {
                // If the autoload timer fires before the observables have had a chance to sync, we'll get an exception if we try to call _moveUpdatedNodes.
                // As such, we need to check and make sure the widget injection for get and set node rects has completed,
                // indicated by widgetAttached.
                if (!this._disposed && this.graphViewModel.widgetAttached()) {
                    this.graphViewModel.getNodeRectsAccessor().then((rects) => {
                        this._moveUpdatedNodes(this._diagramLayoutStateMachine.diagramLayout.currentLayout, rects);
                    });
                }
            }));

            // Hook up saving the layout when the user moves nodes.
            this._resourceViewSubscriptionManager.registerForDispose(this.graphViewModel.layoutChanged.subscribe(() => {
                this._updateDiagramLayoutStateMachineForUserInteraction(this._diagramLayoutStateMachine);
            }));

            this._resourceViewSubscriptionManager.registerForDispose(resourceToGraphViewModel._newGraphAvailable.subscribe(() => {
                this._updateGraph(resourceToGraphViewModel.graphNodeViewModels, resourceToGraphViewModel.graphEdgeViewModels);
            }));

            if (resourceToGraphViewModel._newGraphAvailable()) {
                this._updateGraph(resourceToGraphViewModel.graphNodeViewModels, resourceToGraphViewModel.graphEdgeViewModels);
            }
        }
    }

    public _updateGraph(graphNodeViewModels: StringMap<Graph.GraphNode>, graphEdgeViewModels: StringMap<Graph.GraphEdge>): void {
        this.loading(true);

        // Completely removing and recreating graph nodes requires fewer updates across the iframe than incrementally updating.
        // There are a few edge cases that may (or may not) cause problems (a user is moving a node or a node is animating in the middle of
        // an update), but unfortunately our control currently has these issues regardless of whether we do incremental or full updates.
        // This happens as an artifact that identity isn't preserved across projection updates.

        // We have to clear edges here to prevent graph nodes from instantaneously not existing.
        this.graphViewModel.edges.clear();

        this.graphViewModel.graphNodes.modify(() => {
            this.graphViewModel.graphNodes.clear();
            for (let key in graphNodeViewModels) {
                let newGraphNode: Graph.GraphNode = graphNodeViewModels[key];
                this.graphViewModel.graphNodes.put(key, newGraphNode);
            }
        });
        this.graphViewModel.edges.modify(() => {
            for (let key in graphEdgeViewModels) {
                let newGraphEdge: Graph.GraphEdge = graphEdgeViewModels[key];
                this.graphViewModel.edges.put(key, newGraphEdge);
            }
        });

        this.loading(false);
    }

    /**
     * Moves any nodes whose positions differ from what is in the committed state. Will ignore any nodes whose current
     * position in the graph control is different than in lastNode state (implying the user moved the node between two calls
     * to getNodeRects).
     *
     * @param currentLayout The layout against which we match lastNodeStates to discover the nodes that have moved.
     * @param lastNodeStates The last positions of the nodes last time getNodeRects was called. This function will internally
     * call getNodeRects again and infer that any nodes in different positions were moved by the user.
     * @param options Options that get passed through (clear undo stack, etc.) to setNodeRects. Optional.
     */
    public _moveUpdatedNodes(currentLayout: DiagramLayout.IGraph, lastNodeStates: StringMap<Graph.IRect>, options?: Graph.ISetNodeRectOptions): TypeDeclarations.Promise {
        let currentRefreshId = this._refreshId;
        let moveAnimationComplete = Q.defer();
        this.graphViewModel.getNodeRectsAccessor().then((currentNodeStates: StringMap<Graph.IRect>) => {
            if (!this._disposed && currentRefreshId === this._refreshId) {
                let nodesToUpdate: StringMap<Graph.IRect> = {};
                let nodesMoved: number = 0;

                // We only want to setNodeRects for nodes that aren't in the correct location. This prevents creating animations
                // that can interfere with user interactions.
                for (let key in currentLayout.Nodes) {
                    let node = currentLayout.Nodes[key];
                    let lastNodeState = lastNodeStates[key];
                    let currentNodeState = currentNodeStates[key];

                    // If the graph node in the layout isn't in the graph, we can't move something that doesn't exist.
                    if (!currentNodeState) {
                        continue;
                    }

                    // If the node was in the last snapshot we took and has since moved, then we infer the user has moved it. We should not
                    // touch this node.
                    if (lastNodeState) {
                        if (lastNodeState.x !== currentNodeState.x ||
                            lastNodeState.y !== currentNodeState.y ||
                            lastNodeState.height !== currentNodeState.height ||
                            lastNodeState.width !== currentNodeState.width) {
                            continue;
                        }
                    }

                    // If the node hasn't been moved by the user and is different than what's in our comitted state, then it means
                    // our comitted state is more recent than what's in the graph. Add this node to be moved.
                    if (node.X !== currentNodeStates[key].x ||
                        node.Y !== currentNodeStates[key].y ||
                        node.Height !== currentNodeStates[key].height ||
                        node.Width !== currentNodeStates[key].width) {
                        nodesMoved++;

                        nodesToUpdate[key] = {
                            x: node.X,
                            y: node.Y,
                            height: node.Height,
                            width: node.Width
                        };
                    }
                }

                if (nodesMoved > 0) {
                    this.graphViewModel.setNodeRects()(nodesToUpdate, options).finally(() => {
                        moveAnimationComplete.resolve(true);
                    });
                } else {
                    moveAnimationComplete.resolve(true);
                }
            } else {
                moveAnimationComplete.resolve(true);        // as this move action has become outdated.
            }
        }, (reason) => {
            logger.logError("Call to getNodeRects failed with reason: " + JSON.stringify(reason));
            moveAnimationComplete.resolve(true);       // getNodeRects call failed, no actionable item on extension side.
        });

        return moveAnimationComplete.promise;
    }

    /**
     * Teardown.
     */
    public dispose() {
        this._disposed = true;
        this._lifetimeManager.dispose();
    }

    /**
     * Called when the factory id gets set.
     */
    public onInputsSet(inputs: ExtensionDefinition.ViewModels.Shared.DiagramViewModel.InputsContract): TypeDeclarations.Promise {
        let factoryId: string = inputs.factoryId;
        return DiagramModuleDeclarations.Security.hasPermission(factoryId, ["Microsoft.DataFactory/dataFactories/write"]).then((canWrite: boolean) => {
            this.userHasWriteAccess(canWrite);
        });
    }

    public animateCentralNodeExit(centralNodeId: string, dummyCentralNode: Graph.GraphNode, currentLayout: DiagramLayout.IGraph,
                                  graphNodeViewModels: StringMap<Graph.GraphNode>, graphEdgeViewModels: StringMap<Graph.GraphEdge>, newLayout: DiagramLayout.IGraph): TypeDeclarations.Promise {
        let animationComplete = Q.defer();
        let isDiagramLocked = this.diagramToolbar.diagramLocked();
        this.diagramToolbar.diagramLocked(true);

        let finalAreaRect: Graph.IRect = null;
        for (let key in newLayout.Nodes) {
            let layoutNode = newLayout.Nodes[key];
            if (finalAreaRect === null) {
                finalAreaRect = { x: layoutNode.X, y: layoutNode.Y, width: layoutNode.Width, height: layoutNode.Height };
            } else {
                DiagramUtil._updateBoundingBox(finalAreaRect, layoutNode);
            }
        }

        let stagingAreaRect: Graph.IRect = JSON.parse(JSON.stringify(finalAreaRect));
        let nodesToDim: StringMap<Graph.GraphNode> = {};
        this.graphViewModel.graphNodes.forEach((graphNode: Graph.GraphNode, key: string) => {
            if (newLayout.Nodes[key] || key === centralNodeId) {
                DiagramUtil._updateBoundingBox(stagingAreaRect, currentLayout.Nodes[key]);
            } else {
                nodesToDim[key] = graphNode;
            }
        });
        for (let key in newLayout.Nodes) {
            DiagramUtil._updateBoundingBox(stagingAreaRect, newLayout.Nodes[key]);
        }

        let dimmedGraphEntities: Graph.GraphEntity[] = [];
        Q(this.graphViewModel.bringRectIntoView()(stagingAreaRect)).then(() => {
            for (let key in nodesToDim) {
                let node = nodesToDim[key];
                node.dimmed(true);
                dimmedGraphEntities.push(node);
            }
            this.graphViewModel.edges.forEach((edge) => {
                if (nodesToDim[edge.startNodeId()] || nodesToDim[edge.endNodeId()]) {
                    edge.dimmed(true);
                    dimmedGraphEntities.push(edge);
                }
            });

            return this.graphViewModel.getNodeRects()();
        }).then((rects) => {
            // TODO 4640279 Also zoom to the finalAreaRect once the construct is available in the viva graph control.
            return Q.all([
                this._moveUpdatedNodes(newLayout, rects)
            ]);
        }).then(() => {
            this.graphViewModel.edges.clear();

            this.graphViewModel.graphNodes.modify(() => {
                this.graphViewModel.graphNodes.toArray().forEach((node) => {
                    if (node.dimmed()) {
                        this.graphViewModel.graphNodes.remove(node.id());
                    }
                });
                this.graphViewModel.graphNodes.remove(centralNodeId);
                this.graphViewModel.graphNodes.put(dummyCentralNode.id(), dummyCentralNode);
            });

            dimmedGraphEntities.forEach((entity: Graph.GraphEntity) => {
                entity.dimmed(false);
            });

            // Update central node to expand to cover the entire layout.
            dummyCentralNode.dimmed(true);
            let expandCentralNode: StringMap<Graph.IUpdateRect> = {};
            expandCentralNode[dummyCentralNode.id()] = finalAreaRect;
            return this.graphViewModel.setNodeRects()(expandCentralNode);
        }).fail((reason) => {
            logger.logError("animateCentralNodeExit did not exit gracefully because of: " + JSON.stringify(reason));
        }).finally(() => {
            this.diagramToolbar.diagramLocked(isDiagramLocked);
            animationComplete.resolve(true);
        });
        return animationComplete.promise;
    }

    public animateCentralNodeEnter(centralNodeId: string, dummyCentralNode: Graph.GraphNode, currentLayout: DiagramLayout.IGraph,
                                   graphNodeViewModels: StringMap<Graph.GraphNode>, graphEdgeViewModels: StringMap<Graph.GraphEdge>, newLayout: DiagramLayout.IGraph): TypeDeclarations.Promise {
        let animationComplete = Q.defer();
        let isDiagramLocked = this.diagramToolbar.diagramLocked();
        this.diagramToolbar.diagramLocked(true);

        let currentLayoutBoundingBox: Graph.IRect = null;
        for (let key in currentLayout.Nodes) {
            let graphNode = currentLayout.Nodes[key];

            if (currentLayoutBoundingBox === null) {
                currentLayoutBoundingBox = { x: graphNode.X, y: graphNode.Y, width: graphNode.Width, height: graphNode.Height };
            } else {
                DiagramUtil._updateBoundingBox(currentLayoutBoundingBox, graphNode);
            }
        }

        let stagingAreaRect: Graph.IRect = JSON.parse(JSON.stringify(currentLayoutBoundingBox));
        for (let key in newLayout.Nodes) {
            if (currentLayout.Nodes[key]) {
                DiagramUtil._updateBoundingBox(stagingAreaRect, newLayout.Nodes[key]);
            }
        }

        // Animation requires the nodes to be dimmed at the start. Dim them before animation starts.
        let nodesToAdd: Graph.GraphNode[] = [];
        let graphNodesToKeep: string[] = [];
        for (let key in graphNodeViewModels) {
            let node = graphNodeViewModels[key];
            if (!this.graphViewModel.graphNodes.lookup(key)) {          // Only add new nodes initially so that old nodes do not loose their position.
                node.dimmed(true);
                nodesToAdd.push(node);
            } else {
                graphNodesToKeep.push(key);
            }
        }
        graphNodeViewModels[centralNodeId].dimmed(false);
        let edgesToAdd: Graph.GraphEdge[] = [];
        for (let key in graphEdgeViewModels) {
            let edge = graphEdgeViewModels[key];
            if (graphNodeViewModels[edge.startNodeId()].dimmed() || graphNodeViewModels[edge.endNodeId()].dimmed()) {
                edge.dimmed(true);
            }
            edgesToAdd.push(edge);
        }

        Q(this.graphViewModel.bringRectIntoView()(stagingAreaRect)).then(() => {
            this.graphViewModel.edges.clear();
            this.graphViewModel.graphNodes.modify(() => {
                this.graphViewModel.graphNodes.toArray().forEach((graphNode: Graph.GraphNode) => {
                    if (!(newLayout.Nodes[graphNode.id()])) {
                        this.graphViewModel.graphNodes.remove(graphNode.id());
                    }
                });

                dummyCentralNode.dimmed(true);
                this.graphViewModel.graphNodes.put(dummyCentralNode.id(), dummyCentralNode);
            });

            let squeezeCentralNode: StringMap<Graph.IUpdateRect> = {};
            let finalCentralNodeLayout = newLayout.Nodes[centralNodeId];
            squeezeCentralNode[dummyCentralNode.id()] = { x: finalCentralNodeLayout.X, y: finalCentralNodeLayout.Y, width: finalCentralNodeLayout.Width, height: finalCentralNodeLayout.Height };

            return this.graphViewModel.setNodeRects()(squeezeCentralNode);
        }).then(() => {
            dummyCentralNode.dimmed(false);

            this.graphViewModel.graphNodes.modify(() => {
                nodesToAdd.forEach((node: Graph.GraphNode) => {
                    this.graphViewModel.graphNodes.put(node.id(), node);
                });
            });

            this.graphViewModel.edges.modify(() => {
                edgesToAdd.forEach((edge: Graph.GraphEdge) => {
                    this.graphViewModel.edges.put(edge.id(), edge);
                });
            });

            return this.graphViewModel.getNodeRects()();
        }).then((rects) => {
            // TODO 4640279 Also zoom to the finalAreaRect once the construct is available in the viva graph control.
            return Q.all([
                this._moveUpdatedNodes(newLayout, rects)
            ]);
        }).fail((reason) => {
            logger.logError("animateCentralNodeEnter did not exit gracefully because of: " + JSON.stringify(reason));
        }).finally(() => {
            if (centralNodeId !== dummyCentralNode.id()) {
                this.graphViewModel.graphNodes.remove(dummyCentralNode.id());
            }
            for (let key in graphNodeViewModels) {
                graphNodeViewModels[key].dimmed(false);
            }
            for (let key in graphEdgeViewModels) {
                graphEdgeViewModels[key].dimmed(false);
            }

            this.diagramToolbar.diagramLocked(isDiagramLocked);
            animationComplete.resolve(true);
        });

        return animationComplete.promise;
    }

    private _updateDiagramLayoutStateMachineForUserInteraction(diagramLayoutStateMachine: DiagramLayout.DiagramLayoutStateMachine): void {
        let currentRefreshId = this._refreshId;
        if (!this._disposed) {
            this.graphViewModel.getNodeRectsAccessor().then((nodeRects) => {
                if (!this._disposed && currentRefreshId === this._refreshId) {
                    let nodesMoved = 0;

                    // Update the layout information before saving it. We only want to copy save .
                    for (let id in nodeRects) {
                        let savedNode = diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[id];
                        let movedRect = nodeRects[id];

                        if (savedNode.X !== movedRect.x ||
                            savedNode.Y !== movedRect.y ||
                            savedNode.Height !== movedRect.height ||
                            savedNode.Width !== movedRect.width) {
                            nodesMoved++;

                            // This will additionally clear any softness a node's layout may have, since the
                            // user explicitly moved it.
                            diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[id] = {
                                X: nodeRects[id].x,
                                Y: nodeRects[id].y,
                                Height: nodeRects[id].height,
                                Width: nodeRects[id].width
                            };
                        }
                    }

                    // Calling moveUpdatedNodes will trigger another layout changed and cause an infinite cycle unless
                    // we detect no-ops and abort them.
                    if (nodesMoved > 0) {
                        diagramLayoutStateMachine.save().then(() => {
                            if (!this._disposed && currentRefreshId === this._refreshId) {
                                this._moveUpdatedNodes(diagramLayoutStateMachine.diagramLayout.currentLayout, nodeRects, { clearUndo: true });
                            }
                        },
                            (reason: DiagramLayout.ISaveResponse) => {
                                if (reason.reason !== DiagramLayout.LoadSaveResult.Preempted) {
                                    logger.logError("Failed to save layout. Reason: " + DiagramLayout.LoadSaveResult[reason.reason]);
                                }
                            });
                    }
                }
            });
        }
    }

    private _removeOverlaps(changedNodes: StringMap<Graph.IPoint>, rootId: string): Q.Promise<StringMap<Graph.IPoint>> {
        let viewModelDeferred = Q.defer<StringMap<Graph.IPoint>>();

        let baseGraph: DiagramLayout.IGraph = {
            Version: DiagramLayout.Constants.CurrentSchemaVersion,
            Nodes: {},
            Edges: [],
            GridResolution: GraphNodeViewModels.Constants.GridResolution
        };

        let lockedIds: string[] = [];

        this.graphViewModel.getNodeRectsAccessor().then((rects: StringMap<Graph.IRect>) => {
            for (let id in rects) {
                let rect = rects[id];
                baseGraph.Nodes[id] = {
                    X: rect.x,
                    Y: rect.y,
                    Height: rect.height,
                    Width: rect.width,
                    Id: id
                };
            }

            // update just the changed nodes
            for (let id in changedNodes) {
                let point = changedNodes[id];
                lockedIds.push(id);
                baseGraph.Nodes[id].X = point.x;
                baseGraph.Nodes[id].Y = point.y;
            }

            // TODO paverma RDBug 3598103 Required till the time ghost nodes exist in the graph control.
            if (!this._overlapExists(baseGraph)) {
                viewModelDeferred.resolve({});
                return;
            }

            let graphParameters = {
                Graph: baseGraph,
                LockedIds: lockedIds,
                RootId: rootId
            };

            this._appContext.dataFactoryService.ajaxQ<DiagramLayout.IGraph>({
                url: DataConstants.RemoveOverlapsUri,
                data: JSON.stringify(graphParameters),
                type: "POST",
                contentType: "application/json"
            }).then((graph: DiagramLayout.IGraph) => {
                logger.logInfo(("Sucessfully fetched {0} changed nodes.").format(
                    Object.keys(graph.Nodes).length),
                    {
                        category: "Floorplan (removeOverlaps)"
                    }
                );

                let newChangedNodes: StringMap<Graph.IPoint> = {};

                for (let id in graph.Nodes) {
                    let node = graph.Nodes[id];
                    newChangedNodes[id] = {
                        x: node.X,
                        y: node.Y
                    };
                }

                viewModelDeferred.resolve(newChangedNodes);
            }, (reason: JQueryXHR) => {
                logger.logError(("Failed to get response from layout API: {0}. Data Object: {1}").format(
                    this._appContext.dataFactoryService.getAppRelativeUri(DataConstants.LayoutUri), JSON.stringify(graphParameters)),
                    {
                        category: "Floorplan (removeOverlaps)"
                    }
                );

                viewModelDeferred.reject(false);

                // TODO paverma Currently the fail method does not exist. Either bring in some concepts from Ibiza, or
                // modify this to convey failure elsewise.
                // this._container.fail("Call to graph layout failed.");
            });
        });

        return viewModelDeferred.promise;
    }

    /**
     * This is a hack to prevent excessive removeOverlaps calls because of ghost nodes in Ibiza graph control.
     */
    private _overlapExists(layout: DiagramLayout.IGraph): boolean {
        let rects: DiagramLayout.IGraphNode[] = [];
        for (let key in layout.Nodes) {
            rects.push(layout.Nodes[key]);
        }

        for (let i = 0; i < rects.length - 1; i++) {
            for (let j = i + 1; j < rects.length; j++) {
                // Condition for overlap.
                if (!(rects[i].X + rects[i].Width < rects[j].X || rects[j].X + rects[j].Width < rects[i].X || rects[i].Y + rects[i].Height < rects[j].Y || rects[j].Y + rects[j].Height < rects[i].Y)) {
                    return true;
                }
            }
        }
        return false;
    }
}
