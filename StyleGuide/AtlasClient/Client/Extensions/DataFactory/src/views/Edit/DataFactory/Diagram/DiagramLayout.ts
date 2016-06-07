import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
import {DateTime} from "./DiagramModuleDeclarations";

import Log = require("../../../../scripts/Framework/Util/Log");
import AppContext = require("../../../../scripts/AppContext");

export module Constants {
    export const AutoLoadRateInMs = 30000;
    export const DiagramLayoutArea = "DiagramLayout";
    export const CurrentSchemaVersion = 1.0;
}

let logger = Log.getLogger({
    loggerName: Constants.DiagramLayoutArea
});

/**
 * Serialized representation of a graph node. This contract exists only between the ux controller and client,
 * which is why it isn't auto-generated. For layout purposes, all graph nodes are rectangles.
 */
export interface IGraphNode {
    /**
     * The X coordinate of the node's top-left corner.
     */
    X: number;

    /**
     * The Y coordinate of the node's top-left corner.
     */
    Y: number;

    /**
     * The height of the graph node.
     */
    Height: number;

    /**
     * The width of the graph node.
     */
    Width: number;

    /**
     * Whether this position is a suggestion or not
     */
    IsSoft?: boolean;

    /**
     * Optional Id
     */
    Id?: string;
}

/**
 * A Cartesian point.
 */
export interface IPoint {
    /**
     * The x coordinate.
     */
    X: number;

    /**
     * The y coordinate.
     */
    Y: number;
}

/**
 * Serialized representation of a graph edge.
 */
export interface IGraphEdge {
    /**
     * The starting node's id.
     */
    StartNodeId: string;

    /**
     * The ending node's id.
     */
    EndNodeId: string;

    /**
     * A collection of points that define the curve's path. Returned by auto-layout if the edge isn't a straight line.
     */
    Waypoints: IPoint[];
}

/**
 * Serialized representation of a graph.
 */
export interface IGraph {
    /**
     * Version. Used in loading/saving semantics. Shouldn't be needed for layout calls.
     */
    Version?: number;

    /**
     * A collection of nodes in the graph.
     */
    Nodes: StringMap<IGraphNode>;

    /**
     * A collection of edges in the graph.
     */
    Edges: IGraphEdge[];

    /**
     * The snap-to-grid resolution.
     */
    GridResolution: number;

    /**
     * Who last changed the graph.
     */
    lastModifiedBy?: string;

    /**
     * When the graph was last saved.
     */
    lastModifiedDate?: string;
}

export enum LoadSaveResult {
    Ok,
    NotFound,
    Preempted,
    OutOfDate,
    Unknown,
    Forbidden
}

export interface ISaveRequest {
    graph: IGraph;
    etag: string;
}

export interface ISaveResponse {
    reason: LoadSaveResult;
    graph?: IGraph; // A failed save should return a graph
    etag?: string;
}

export interface ILoadResponse {
    reason: LoadSaveResult;
    etag?: string;
    graph?: IGraph;
}

export class DiagramLayoutStateMachine {
    public diagramLayout: DiagramLayout;
    public diagramRefreshed: KnockoutObservable<boolean> = ko.observable(false);
    public layoutStatus: KnockoutObservable<string> = ko.observable("");
    private _isAutoLoading: boolean = false;
    private _disposed: boolean = false;
    private _currentOperation: Q.Deferred<{}>;
    private _pendingOperation: Q.Deferred<{}>;
    private _pendingOperationIsSave: boolean;

    /**
     * Manages concurrency with regards to loading and saving as well as tracking auto-loading. All loads and saves are pushed into a
     * queue and executed in order.
     */
    constructor(
        lifetimeManager: TypeDeclarations.DisposableLifetimeManager,
        loadLayout: () => TypeDeclarations.PromiseVN<ILoadResponse, ILoadResponse>,
        saveLayout: (request: ISaveRequest) => TypeDeclarations.PromiseVN<ISaveResponse, ISaveResponse>) {
        this.diagramLayout = new DiagramLayout(loadLayout, saveLayout);
        lifetimeManager.registerForDispose(this);
    }

    public isAutoLoading(): boolean {
        return this._isAutoLoading;
    }

    /**
     * Starts auto-loading the diagram layout state. The control won't autoload while load and save tasks are queued.
     */
    public startAutoLoading(): void {
        this._isAutoLoading = true;

        let loadLoop = () => {
            if (!this._disposed) {
                this.load().then(
                    () => {
                        if (!this._disposed) {
                            this.diagramRefreshed(!this.diagramRefreshed());
                        }
                    },
                    (reason: ILoadResponse) => {
                        if (reason.reason !== LoadSaveResult.Preempted) {
                            logger.logError("Failed to load diagram layout. Reason: " + LoadSaveResult[reason.reason]);
                        }
                    }
                    ).finally(() => {
                        if (!this._disposed) {
                            setTimeout(loadLoop, Constants.AutoLoadRateInMs);
                        }
                    });
            }
        };

        loadLoop();
    }

    /**
     * Commits the diagram's layout state.
     */
    public save(): TypeDeclarations.PromiseVN<ISaveResponse, ISaveResponse> {
        let deferred = Q.defer();

        // Saves will cancel any previous pending operation, load or save. This is because a save implies loading and ensuring
        // the layout is up to date and the more recent call to save will always contain a more up to date graph that would
        // just overwrite any pending saves anyways.
        if (this._pendingOperation) {
            this._pendingOperation.reject({ reason: LoadSaveResult.Preempted });
        }

        this._pendingOperationIsSave = true;
        this._pendingOperation = deferred;

        if (!this._currentOperation) {
            this._executePending();
        }

        return deferred.promise;
    }

    /**
     * Refresh the diagram loading state from the server.
     */
    public load(): TypeDeclarations.PromiseVN<ILoadResponse, ILoadResponse> {
        let deferred = Q.defer();

        // Loads will not pre-empt loads or saves.
        if (this._pendingOperation) {
            deferred.reject({ reason: LoadSaveResult.Preempted });
        } else {
            this._pendingOperation = deferred;
            this._pendingOperationIsSave = false;
        }

        if (!this._currentOperation) {
            this._executePending();
        }

        return deferred.promise;
    }

    /**
     * Dispose of this object.
     */
    public dispose() {
        this._disposed = true;
    }

    private _executePending() {
        // If there's no work to do, just return.
        if (!this._pendingOperation) {
            return;
        }

        if (this._currentOperation) {
            logger.logError("Can't execute load or save operation while one is running.");
        }

        this._currentOperation = this._pendingOperation;
        this._pendingOperation = null;

        if (this._pendingOperationIsSave) {
            this.diagramLayout.save().then(
                () => {
                    if (this.diagramLayout.currentLayout && this.diagramLayout.currentLayout.lastModifiedBy && this.diagramLayout.currentLayout.lastModifiedDate) {
                        this.layoutStatus(ClientResources.layoutSavedMessage.format(this.diagramLayout.currentLayout.lastModifiedBy,
                            DateTime.localDateToRelativeString(new Date(this.diagramLayout.currentLayout.lastModifiedDate))));
                    }

                    this._currentOperation.resolve(true);
                },
                (reason: ISaveResponse) => {
                    this._currentOperation.reject(reason);
                }
                ).finally(() => {
                    this._currentOperation = null;
                    this._executePending();
                });
        } else {
            this.diagramLayout.load().then(
                () => {
                    if (this.diagramLayout.currentLayout && this.diagramLayout.currentLayout.lastModifiedBy && this.diagramLayout.currentLayout.lastModifiedDate) {
                        this.layoutStatus(ClientResources.layoutSavedMessage.format(this.diagramLayout.currentLayout.lastModifiedBy, DateTime.localDateToRelativeString(new Date
                            (this.diagramLayout.currentLayout.lastModifiedDate))));
                    }

                    this._currentOperation.resolve(true);
                },
                (reason: ILoadResponse) => {
                    this._currentOperation.reject(reason);
                }
                ).finally(() => {
                    this._currentOperation = null;
                    this._executePending();
                });
        }
    }
}

// Currently only manages node positions.
export class DiagramLayout {
    /**
     * The current graph layout.
     */
    public currentLayout: IGraph = null;
    private _lastLoadedLayout = null;
    private _loadLayout: () => TypeDeclarations.PromiseVN<ILoadResponse, ILoadResponse>;
    private _saveLayout: (request: ISaveRequest) => TypeDeclarations.PromiseVN<ISaveResponse, ISaveResponse>;
    private _currentSavePromise: TypeDeclarations.Promise;
    private _pendingSaveDeferred: Q.Deferred<{}>;
    private _etag: string;

    constructor(
        loadLayout: () => TypeDeclarations.PromiseVN<ILoadResponse, ILoadResponse>,
        saveLayout: (request: ISaveRequest) => TypeDeclarations.PromiseVN<ISaveResponse, ISaveResponse>) {
        this._loadLayout = loadLayout;
        this._saveLayout = saveLayout;
    }

    private static _deepCopy(obj: Object): Object {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Loads the graph layout.
     *
     * @return a promise that resolves with the loaded graph or rejects when an error occurs.
     */
    public load(): TypeDeclarations.PromiseVN<ILoadResponse, ILoadResponse> {
        let layoutPromise = this._loadLayout();

        layoutPromise.then(
            (response: ILoadResponse) => {
                // If we have ever loaded a 3-way layout, we need to do a 3-way merge with any server-side changes and take ours
                if (this.currentLayout) {
                    this.currentLayout = this._threeWayMerge(this.currentLayout, response.graph, this._lastLoadedLayout);
                } else {
                    this.currentLayout = response.graph;
                }

                this._etag = response.etag;
                this.currentLayout.lastModifiedBy = response.graph.lastModifiedBy;
                this.currentLayout.lastModifiedDate = response.graph.lastModifiedDate;

                // We want the last loaded graph from the server instead of the merged graph
                // so any outstanding changes we have will persist in the diff during
                // 3-way merge.
                this._lastLoadedLayout = DiagramLayout._deepCopy(response.graph);
            },
            (response: ILoadResponse) => {
                if (response.reason === LoadSaveResult.NotFound) {
                    this._etag = response.etag;
                }
            }
            );

        return layoutPromise;
    }

    /**
     * Saves the current graph layout. If there exist conflicting changes, fetch the latest version, do a 3-way merge take ours, and then save.
     * This process can repeat ad-nauseam until the conflict gets resolved. Can have at most one queued save in addition to a currently processing one.
     * Enqueuing another save will reject any previous save with LoadSaveFailureReason.Preempted.
     */
    public save(): TypeDeclarations.PromiseVN<ISaveResponse, ISaveResponse> {
        let deferred = Q.defer();

        // If there is already a save currently in progress, cancel any queued saves and queue another.
        if (this._currentSavePromise) {
            if (this._pendingSaveDeferred) {
                this._pendingSaveDeferred.reject({ reason: LoadSaveResult.Preempted });
            }
            this._pendingSaveDeferred = deferred;
        } else { // Otherwise, we save our graph directly
            this._commit().then(
                (response: ISaveResponse) => {
                    deferred.resolve(response);
                },
                (response: ISaveResponse) => {
                    deferred.reject(response);
                }
                );
        }

        return deferred.promise;
    }

    /**
     * Helper function for save. Handles retry and merge logic.
     */
    private _commit(): TypeDeclarations.PromiseVN<ISaveResponse, ISaveResponse> {
        let deferred = Q.defer();
        this._currentSavePromise = deferred.promise;
        let retry: () => void;

        this._markLastModified().then(() => {
            let outOfDate = (response: ISaveResponse) => {
                this.currentLayout = this._threeWayMerge(this.currentLayout, response.graph, this._lastLoadedLayout);
                this._etag = response.etag;
                retry();
            };

            retry = () => {
                this._markLastModified().then(() => {
                    this._commit().then(
                        (response: ISaveResponse) => {
                            deferred.resolve(response);
                        },
                        (response: ISaveResponse) => {
                            if (response.reason === LoadSaveResult.OutOfDate) {
                                outOfDate(response);
                            } else {
                                deferred.reject(response);
                            }
                        }
                        );
                });
            };

            let request: ISaveRequest = {
                etag: this._etag,
                graph: this.currentLayout
            };

            this._saveLayout(request).then(
                (response: ISaveResponse) => {
                    // If we have an outstanding graph that needs to be saved, save it.
                    if (this._pendingSaveDeferred) {
                        // Capture the current pending save deferred, as another save could replace it before its commit completes.
                        let pendingSaveDeferred = this._pendingSaveDeferred;

                        // The recursed commit will set _currentSavePromise within this stack frame, leaving no window by which
                        // another save could cancel the pending save. The transition from pending to current save is atomic.
                        this._commit().then(
                            (reason: ISaveResponse) => {
                                pendingSaveDeferred.resolve(reason);
                            },
                            (reason: ISaveResponse) => {
                                pendingSaveDeferred.reject(reason);
                            }
                            );
                        this._pendingSaveDeferred = null;
                    } else {
                        this._currentSavePromise = null;
                    }

                    // If we manage to save without a conflict, then we copy current layout into the common lineage layout.
                    this._lastLoadedLayout = DiagramLayout._deepCopy(this.currentLayout);
                    this._etag = response.etag;
                    deferred.resolve(response);
                },
                (response: ISaveResponse) => {
                    if (response.reason === LoadSaveResult.OutOfDate) {
                        outOfDate(response);
                    } else {
                        deferred.reject(response);
                    }
                }
                );
        });

        return deferred.promise;
    }

    /**
     * Performs a 3-way merge of my changes, changes on the server, and the last changes I loaded.
     * Overwrites any conflicting changes on the server with mine.
     */
    private _threeWayMerge(mine: IGraph, theirs: IGraph, common: IGraph): IGraph {
        let nodes: StringMap<IGraphNode> = Object.create(null);
        let myNodes: StringMap<IGraphNode> = Object.create(null);
        let theirNodes: StringMap<IGraphNode> = Object.create(null);

        let returnedGraph: IGraph = {
            Version: Constants.CurrentSchemaVersion,
            Nodes: nodes,
            Edges: [], // Edges currently don't have any data to persist, so we'll not persist any.
            GridResolution: 0
        };

        // If we don't yet have a lineage, then we should just take our changes without replaying diffs.
        if (!common) {
            returnedGraph.Nodes = mine.Nodes;
            return returnedGraph;
        }

        for (let id in common.Nodes) {
            nodes[id] = common.Nodes[id];
        }

        // Calculate diff between mine and common
        for (let id in mine.Nodes) {
            let myNode = mine.Nodes[id];

            if (id in nodes) {
                let commonNode = nodes[id];

                if (commonNode.X !== myNode.X || commonNode.Y !== myNode.Y) {
                    myNodes[id] = myNode;
                }
            } else {
                myNodes[id] = myNode;
            }
        }

        // Calculate diff between theirs and common
        for (let id in theirs.Nodes) {
            let theirNode = theirs.Nodes[id];

            if (id in nodes) {
                let commonNode = nodes[id];

                if (commonNode.X !== theirNode.X || commonNode.Y !== theirNode.Y) {
                    theirNodes[id] = theirNode;
                }
            } else {
                theirNodes[id] = theirNode;
            }
        }

        // Play their merges over the common...
        for (let key in theirNodes) {
            nodes[key] = theirNodes[key];
        }

        // ...then play ours to do 'take ours'
        for (let key in myNodes) {
            nodes[key] = myNodes[key];
        }

        return returnedGraph;
    }

    private _markLastModified(): TypeDeclarations.Promise {
        return AppContext.AppContext.getInstance().dataFactoryService.getIdentity().then(
            (identity: string) => {
                this.currentLayout.lastModifiedBy = identity;
                this.currentLayout.lastModifiedDate = new Date().toISOString();
            },
            (reason) => {
                logger.logError("Failed to fetch user identity when saving layout. Will mark as 'Unknown.' Reason: " + reason, reason);
                this.currentLayout.lastModifiedBy = ClientResources.unknownUser;
                this.currentLayout.lastModifiedDate = new Date().toISOString();
            }
        );
    }
}
