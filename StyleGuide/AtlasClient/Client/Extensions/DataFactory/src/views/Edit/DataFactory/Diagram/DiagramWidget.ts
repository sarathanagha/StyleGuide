/// <amd-dependency path="text!./Templates/DiagramWidget.html" />
import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
import Framework = require("../../../../_generated/Framework");
import DiagramModuleDeclarations = require("./DiagramModuleDeclarations");
import VivaUtil = DiagramModuleDeclarations.VivaUtil;

import AppContext = require("../../../../scripts/AppContext");
import DiagramViewModel = require("./DiagramViewModel");
import SelectionHandler = require("../../../../scripts/Handlers/MessageHandler");
import StatusCalendar = Framework.StatusCalendar;

import Encodable = require("../../../../scripts/Framework/Model/Contracts/Encodable");
import GraphNodeViewModels = require("./GraphNodeViewModels");

/* tslint:disable:no-var-requires */
export const template: string = require("text!./Templates/DiagramWidget.html");
/* tslint:enable:no-var-requires */

import Graph = DiagramModuleDeclarations.Controls.Visualization.Graph;

let diagramToolbarSelector = "#diagramToolbar";
let diagramSelectionPublisherName = "DiagramWidget";
let vivaGraphControlSelector = ".vivaGraphControl";
let graphNodeStatusFlyoutSelector = ".adfGraphNodeStatusFlyout";

export class DiagramWidget extends Framework.Disposable.ChildDisposable {
    public diagramViewModel: DiagramViewModel.DiagramViewModel;
    public statusCalendar: StatusCalendar.StatusCalendar = null;

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();
    private _widget: DiagramModuleDeclarations.Controls.Visualization.Graph.GraphWidget;
    private _tableNodeStatusFlyout: WinJS.UI.Flyout;
    private _diagramSelectionSubscriber: SelectionHandler.ISelectionSubscription = null;
    private _highlightedNodes: GraphNodeViewModels.HighlightableNode[] = [];

    private _keyDown = (e: KeyboardEvent): void => {
        switch (e.keyCode) {
            case VivaUtil.KeyCode.Z:
                if (e.ctrlKey && !e.altKey) {
                    if (e.shiftKey) {
                        this._widget.redo();
                    } else {
                        this._widget.undo();
                    }
                }
                break;
            default:
                // ignore other keyboard events
                break;
        }
    };

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, element: JQuery) {
        super(lifetimeManager);
        let diagramLoadStartTime = new Date().getTime();

        element.html(template);
        this._tableNodeStatusFlyout = new WinJS.UI.Flyout(element.find(graphNodeStatusFlyoutSelector)[0], {
            placement: "auto"
        });
        this.statusCalendar = new StatusCalendar.StatusCalendar(this._lifetimeManager, {
            size: 1
        });

        let vivaGraphControlElement = element.find(vivaGraphControlSelector);
        this.diagramViewModel = new DiagramViewModel.DiagramViewModel(this._lifetimeManager, vivaGraphControlElement);
        this._widget = new DiagramModuleDeclarations.Controls.Visualization.Graph.GraphWidget(vivaGraphControlElement, this.diagramViewModel.graphViewModel.graphViewModel);

        WinJS.UI.processAll(element.find(diagramToolbarSelector)[0]);

        this._widget.createContextMenu = (evt: JQueryEventObject, graphEntityViewModel: Graph.GraphEntityViewModel): void => {
            if (graphEntityViewModel.entity.commandGroup()) {
                let commandGroup = this._appContext.getContextMenuCommandGroup(graphEntityViewModel.entity.commandGroup());
                commandGroup.bindViewModels(graphEntityViewModel);
                Microsoft.DataStudio.UxShell.Menu.createContextMenu({
                    clientX: evt.clientX,
                    clientY: evt.clientY
                }, commandGroup);
            }
        };

        this._createSelectionBindings();
        this._addEventListeners();
        ko.applyBindingsToDescendants(this, element.find(".adfDiagramWidget")[0]);

        // Load time calculation.
        let initialDataLoadSubscription = this.diagramViewModel._diagramModel.initialLoadComplete.subscribe((initialLoadComplete) => {
            if (initialLoadComplete) {
                initialDataLoadSubscription.dispose();
                let firstLoadSubscription = null;
                let loggedTelemetry = false;
                firstLoadSubscription = Framework.Util.subscribeAndCall(this.diagramViewModel.loading, (loading) => {
                    if (!loading) {
                        if (firstLoadSubscription) {
                            firstLoadSubscription.dispose();
                        }
                        let diagramLoadTime = new Date().getTime() - diagramLoadStartTime;
                        let diagramModel = this.diagramViewModel._diagramModel;
                        let activityCount = 0;
                        for (let key in diagramModel._pipelines) {
                            let pipeline = diagramModel._pipelines[key];
                            activityCount += Framework.Util.koPropertyHasValue(pipeline.properties().activities) ? pipeline.properties().activities().length : 0;
                        }

                        Framework.Telemetry.instance.logEvent(new Framework.Telemetry.Event(
                            this._appContext.factoryId(), "Diagram", Framework.Telemetry.Action.initialize, {
                                time: diagramLoadTime.toString(),
                                pipelineCount: Object.keys(this.diagramViewModel._diagramModel._pipelines).length.toString(),
                                datasetCount: Object.keys(this.diagramViewModel._diagramModel._allTables).length.toString(),
                                activityCount: activityCount.toString()
                            })
                        );
                        loggedTelemetry = true;
                    }
                });
                if (loggedTelemetry) {
                    firstLoadSubscription.dispose();
                } else {
                    this._lifetimeManager.registerForDispose(firstLoadSubscription);
                }
            }
        });
        this._lifetimeManager.registerForDispose(initialDataLoadSubscription);
    }

    public dispose(): void {
        $(diagramToolbarSelector).off("keydown");
        this._appContext.selectionHandler.unregister(this._diagramSelectionSubscriber);
        this._tableNodeStatusFlyout.dispose();
        this._lifetimeManager.dispose();
    }

    private _resetHighlighting(): void {
        // reset highlight state
        this._highlightedNodes.forEach((graphNode) => {
            graphNode.highlighted(false);
        });

        this._highlightedNodes = [];
    }

    // Bind diagram's selection with module's selection model.
    private _createSelectionBindings(): void {
        let publisherName: string = diagramSelectionPublisherName;
        let selectionUpdateFromAnotherView: boolean = false;

        // Listen to selection events from other views.
        let updateSelection = (encodables: Encodable.Encodable[]) => {
            selectionUpdateFromAnotherView = true;
            this._widget.selectionManager.modifySelection(() => {
                this._widget.selectionManager.resetSelection();

                this._resetHighlighting();

                encodables.forEach((encodable: Encodable.Encodable) => {
                    let selectNode = (nodeId: string) => {
                        let graphNodeViewModel = this._widget.graphNodes.lookup(nodeId);
                        if (graphNodeViewModel) {
                            this._widget.selectionManager.selectEntity(graphNodeViewModel);
                        }
                    };

                    let highlightNode = (nodeId: string) => {
                        let graphNodeViewModel = this._widget.graphNodes.lookup(nodeId);
                        if (graphNodeViewModel && graphNodeViewModel.graphNode instanceof GraphNodeViewModels.HighlightableNode) {
                            let highlightable = <GraphNodeViewModels.HighlightableNode>graphNodeViewModel.graphNode;

                            highlightable.highlighted(true);
                            this._highlightedNodes.push(highlightable);
                        }
                    };

                    // if it's an activity window or a Linked Service, try to select all of the entities
                    switch (encodable.type) {
                        case Encodable.EncodableType.ACTIVITY_RUN:
                            (<Encodable.ActivityRunEncodable>encodable).observable().entities.forEach((entity) => {
                                highlightNode(Encodable.createLegacyKeyFromEncodable(entity));
                            });
                            break;
                        case Encodable.EncodableType.LINKED_SERVICE:
                            (<Encodable.LinkedServiceEncodable>encodable).entities.forEach((entity) => {
                                highlightNode(Encodable.createLegacyKeyFromEncodable(entity));
                            });
                            break;
                        case Encodable.EncodableType.ACTIVITY:
                            // try to select the activity, otherwise highlight the pipeline it belongs to.
                            selectNode(Encodable.createLegacyKeyFromEncodable(encodable));

                            let pipelineEncodable = new Encodable.PipelineEncodable((<Encodable.ActivityEncodable>encodable).pipelineName);
                            highlightNode(Encodable.createLegacyKeyFromEncodable(pipelineEncodable));
                            break;
                        default:
                            // otherwise just try to select the single entity
                            let selectedNodeId = Encodable.createLegacyKeyFromEncodable(encodable);
                            selectNode(selectedNodeId);
                            break;
                    }
                });
            });
            selectionUpdateFromAnotherView = false;
        };

        // Send updates for selection triggered by user action on the diagram.
        this._widget.selectionManager.selectedGraphNodeViewModels.subscribe(this._lifetimeManager, (selectedEntites) => {
            if (!selectionUpdateFromAnotherView) {
                let selectedNodeIds = [];
                for (let key in selectedEntites) {
                    selectedNodeIds.push(Encodable.createEncodableFromLegacyKey(key));
                }
                this._appContext.selectionHandler.pushState(publisherName, selectedNodeIds);

                // reset highlight state
                this._resetHighlighting();
            }
        });

        // Register diagram with the module's selection handler.
        this._diagramSelectionSubscriber = {
            name: publisherName,
            callback: updateSelection
        };
        this._appContext.selectionHandler.register(this._diagramSelectionSubscriber);
    }

    private _addEventListeners(): void {
        $(diagramToolbarSelector).keydown(this._keyDown);
    }
}
