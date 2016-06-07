import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
/* tslint:disable:no-unused-variable */
import DiagramModuleDeclarations = require("./DiagramModuleDeclarations");
/* tslint:enable:no-unused-variable */

import DiagramLayout = require("./DiagramLayout");
import DiagramModel = require("./DiagramModel");
import GraphNodeViewModels = require("./GraphNodeViewModels");
import ResourceToGraphVewModels = require("./ResourceToGraphViewModels");
import Framework = require("../../../../_generated/Framework");
import Log = Framework.Log;

"use strict";
import Graph = DiagramModuleDeclarations.Controls.Visualization.Graph;
let logger = Log.getLogger({
    loggerName: "PipelineToGraphViewModel"
});

// Pipeline view has to subscribe to the entire set of pipelines, as if an entity cache view is created for the pipeline, the object would be unaware if the
// pipeline gets deleted.
export class PipelineToGraphViewModel extends ResourceToGraphVewModels.ResourceToGraphViewModel {
    public _pipelineId: string = null;
    private _pipelineActivities: StringMap<MdpExtension.DataModels.Activity> = Object.create(null);
    private _pipelineTables: StringMap<MdpExtension.DataModels.DataArtifact> = Object.create(null);

    constructor(container: Framework.Disposable.IDisposableLifetimeManager, factoryId: string, diagramModel: DiagramModel.DiagramModel, pipelineId: string, localLayoutCenter: DiagramLayout.IPoint) {
        super(container, factoryId, diagramModel);
        this._pipelineId = pipelineId;
        this._localLayoutCenter = localLayoutCenter;

        this._diagramLayoutStateMachine = new DiagramLayout.DiagramLayoutStateMachine(
            this._lifetimeManager,
            (): TypeDeclarations.PromiseVN<DiagramLayout.ILoadResponse, DiagramLayout.ILoadResponse> => {
                let deferred = <Q.Deferred<DiagramLayout.ILoadResponse>>Q.defer();
                deferred.reject({
                    reason: DiagramLayout.LoadSaveResult.NotFound,
                    etag: "0"
                });
                return deferred.promise;
            },
            (request: DiagramLayout.ISaveRequest): TypeDeclarations.PromiseVN<DiagramLayout.ISaveResponse, DiagramLayout.ISaveResponse> => {
                let deferred = <Q.Deferred<DiagramLayout.ISaveResponse>>Q.defer();
                deferred.resolve({
                    reason: DiagramLayout.LoadSaveResult.Ok,
                    etag: "0"
                });
                return deferred.promise;
            }
            );
    }

    public _updateGraphInputs(): void {
        let pipelines = this._diagramModel._pipelines;
        let allTables = this._diagramModel._allTables;
        let activityWindows = this._diagramModel._activityWindows;

        let currentRefreshId = ++this._refreshId;

        let pipeline = pipelines[this._pipelineId];
        if (!pipeline) {
            this.graphNodeViewModels = Object.create(null);
            this.graphEdgeViewModels = Object.create(null);
            this._newGraphAvailable(true);
            this.resourceViewStatus(ClientResources.emptyPipelineText);
            return;
        } else {
            this.resourceViewStatus(null);
        }

        this._identifyActivitiesAndTablesAndCreateEdges(pipeline, allTables);
        this._createActivityNodes(pipeline, this._pipelineId);
        this._createTableNodes(this._pipelineTables);
        this._updateTableAvailabilityFromPipelines(pipelines, allTables);

        let isSoftFilter = (key: string): boolean => { return false; };

        this._layoutGraph(currentRefreshId, isSoftFilter).then(() => {
            if (this._refreshId === currentRefreshId && !this._disposed) {
                this.graphNodeViewModels = Object.create(null);
                this.graphEdgeViewModels = Object.create(null);

                let newGraphNode: Graph.GraphNode;
                let layout: DiagramLayout.IGraphNode;

                for (let tableKey in this._pipelineTables) {
                    layout = this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[tableKey];
                    newGraphNode = new GraphNodeViewModels.TableGraphNodeViewModel(this._pipelineTables[tableKey], this._factoryId, layout.X, layout.Y,
                        this._diagramModel._tableStatusQueryProperties[tableKey]);
                    newGraphNode.id(tableKey);
                    this.graphNodeViewModels[tableKey] = newGraphNode;
                }

                for (let activityKey in this._pipelineActivities) {
                    layout = this._diagramLayoutStateMachine.diagramLayout.currentLayout.Nodes[activityKey];
                    newGraphNode = new GraphNodeViewModels.ActivityGraphNodeViewModel(this._pipelineActivities[activityKey], pipeline, this._factoryId,
                        layout.X, layout.Y, activityWindows.get(activityKey));
                    newGraphNode.id(activityKey);
                    this.graphNodeViewModels[activityKey] = newGraphNode;
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
                logger.logError("An error occurred while updating the graph: " + JSON.stringify(reason));
            }
        });
    }

    private _identifyActivitiesAndTablesAndCreateEdges(pipeline: MdpExtension.DataModels.BatchPipeline, allTables: StringMap<MdpExtension.DataModels.DataArtifact>) {
        this._pipelineActivities = Object.create(null);
        this._pipelineTables = Object.create(null);
        this._edgeDescriptors = [];

        // Add an edge between table and activity iff table details are present in allTables.
        pipeline.properties().activities().forEach((activity: MdpExtension.DataModels.Activity) => {
            let activityKey = GraphNodeViewModels.ActivityGraphNodeViewModel._activityKey(activity.name(), this._pipelineId);
            this._pipelineActivities[activityKey] = activity;

            if (activity.inputs) {
                activity.inputs().forEach((activityInput: MdpExtension.DataModels.ActivityInput) => {
                    let tableKey = GraphNodeViewModels.TableGraphNodeViewModel._tableKey(activityInput.name());
                    let tableDetails = allTables[tableKey];
                    if (tableDetails) {
                        this._pipelineTables[tableKey] = tableDetails;

                        this._edgeDescriptors.push({
                            StartNodeId: tableKey,
                            EndNodeId: activityKey,
                            Waypoints: []
                        });
                    }
                });
            }

            if (activity.outputs) {
                activity.outputs().forEach((activityOutput: MdpExtension.DataModels.ActivityOutput) => {
                    let tableKey = GraphNodeViewModels.TableGraphNodeViewModel._tableKey(activityOutput.name());
                    let tableDetails = allTables[tableKey];
                    if (tableDetails) {
                        this._pipelineTables[tableKey] = tableDetails;

                        this._edgeDescriptors.push({
                            StartNodeId: activityKey,
                            EndNodeId: tableKey,
                            Waypoints: []
                        });
                    }
                });
            }
        });
    }
}
