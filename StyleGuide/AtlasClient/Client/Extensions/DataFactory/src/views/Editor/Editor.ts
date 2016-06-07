/// <reference path="../../references.d.ts" />

/// <amd-dependency path="text!./editor.html" />
/// <amd-dependency path="css!./editor.css" />
/// <amd-dependency path="text!./Wizards/templates/AuthoringOverlay.html" />
/// <amd-dependency path="css!./Wizards/AuthoringOverlay.css" />

/* tslint:disable:no-var-requires */
export const template: string = require("text!./editor.html");
/* tslint:enable:no-var-requires */

import {AppContext} from "../../scripts/AppContext";
import Framework = require("../../_generated/Framework");
import {EditorCommandBar} from "./EditorCommandBar";
import GraphEntities = require("./GraphEntities/Entities");
import GraphContracts = require("./GraphContracts");
import {BaseViewModel} from "./GraphExtensions/Base";
import Node = GraphEntities.Node.Node;
import NodeToolbar = require("./GraphEntities/NodeToolbar");
import Edge = GraphEntities.Edge.Edge;
import Puzzle = GraphEntities.Puzzle.Puzzle;
import ExtensionConfigs = require("./GraphExtensions/ExtensionConfigs");
import Tables = require("./GraphExtensions/Tables");
import Toolbox = require("../../views/Toolbox/Toolbox");
import EntityStore = require("../../scripts/Framework/Model/Authoring/EntityStore");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import AuthoringOverlay = require("../../views/Editor/Wizards/AuthoringOverlay");
import Activity = require("./GraphExtensions/Activities/Activity");
import NodePatcher = require("./GraphExtensions/Activities/NodePatcher");

let logger = Framework.Log.getLogger("Editor");

export class EditorViewModel extends Framework.Disposable.RootDisposable {
    public static className = "EditorViewModel";
    private static MIN_SCALE: number = .1;
    private static MAX_SCALE: number = 2;
    private static SCALE_INCREMENT: number = .05;
    private static INITIAL_WIDTH: number = 20000;
    private static INITIAL_HEIGHT: number = 20000;
    private static viewName: string = "Editor";

    public commandBar = new EditorCommandBar();

    public authoringOverlayTemplate: string = require("text!./Wizards/templates/AuthoringOverlay.html");

    // last z-index used by the graph
    public lastZIndex = 1;
    public draggingNode: Node = null;
    public lastX: number;
    public lastY: number;

    // the actual graphContainer element
    public containerElement: KnockoutObservable<JQuery> = ko.observable(null);

    public width: KnockoutObservable<number> = ko.observable(EditorViewModel.INITIAL_WIDTH);
    public height: KnockoutObservable<number> = ko.observable(EditorViewModel.INITIAL_HEIGHT);
    public scrollLeft: KnockoutObservable<number> = ko.observable(0);
    public scrollTop: KnockoutObservable<number> = ko.observable(0);

    public zoomEnabled: KnockoutObservable<boolean> = ko.observable(true);
    public connecting: KnockoutObservable<boolean> = ko.observable(false);
    public hasFocus: KnockoutObservable<boolean> = ko.observable(true);
    public authoringOverlay: KnockoutObservable<AuthoringOverlay.AuthoringOverlay> = ko.observable(null);
    public overlayModalParams: Microsoft.DataStudioUX.Interfaces.IModalBindingParams = null;

    public puzzle: Puzzle;

    public getViewModelName = (viewModel: Object): string => {
        if (viewModel instanceof BaseViewModel) {
            return viewModel.displayName();
        }

        // TODO iannight: is any caller reaching this path?
        return null;
    };

    public getDependencies = (): EntityStore.IDependenciesMap => {
        let dependencyMap: EntityStore.IDependenciesMap = {};

        $.each(this.puzzle.getDependencies(), (key: string, puzzleDependency: GraphEntities.Puzzle.IPuzzleDependency) => {
            let authoringDependencies: EntityStore.IDependencies<string> = {
                inputs: puzzleDependency.inputViewModels.map(this.getViewModelName),
                outputs: puzzleDependency.outputViewModels.map(this.getViewModelName)
            };

            dependencyMap[this.getViewModelName(puzzleDependency.centerViewModel)] = authoringDependencies;
        });

        return dependencyMap;
    };

    // applied to the style binding
    public style: KnockoutComputed<Object> = ko.pureComputed(() => {
        let dim = this._undoScale(100);
        return {
            transform: "scale(" + this.puzzle.graph.scale() + ")",
            height: dim + "%",
            width: dim + "%"
        };
    });

    public canvasStyle: KnockoutComputed<Object> = ko.pureComputed(() => {
        return {
            width: this.width() + "px",
            height: this.height() + "px"
        };
    });

    // jQuery UI Config for the container
    public containerUIConfig = {
        droppable: {
            accept: ".tool",
            drop: (event: MouseEvent, ui) => {
                let toolbox = Toolbox.Toolbox.getInstance();
                let onDropAction = toolbox.getToolboxItem(ui.draggable.attr("data-entityId")).onDropAction;
                if (onDropAction) {
                    this.updateModelScroll();
                    // TODO paverma Keeping this for quick local testing.
                    // let graphPoint = this._eventGraphCoordinates(event);
                    // this.addCenterNode(this.createCenterPieceOfType(ui.draggable.text()), graphPoint.x, graphPoint.y);

                    this._addNodes(null, onDropAction(), this._eventGraphCoordinates(event));
                }
            }
        }
    };

    // jQuery UI Config for the container
    /* tslint:disable:no-unused-variable Used in editor.html */
    public canvasUIConfig = {
        draggable: {
            helper: () => {
                return "<div></div>";
            },

            start: (event, ui) => {
                this.lastX = this._undoScale(ui.position.left);
                this.lastY = this._undoScale(ui.position.top);
            },

            drag: (event, ui) => {
                let newX = this._undoScale(ui.position.left),
                    newY = this._undoScale(ui.position.top);

                let dX = newX - this.lastX;
                let dY = newY - this.lastY;

                this.pan(dX, dY);

                this.lastX = newX;
                this.lastY = newY;
            }
        }
    };
    /* tslint:enable:no-unused-variable */

    /* Events */
    public mouseWheel = (event: JQueryEventObject) => {
        if ((<MouseWheelEvent>event.originalEvent).wheelDelta >= 0) {
            this.zoomIn();
        } else {
            this.zoomOut();
        }

        event.preventDefault();

        return false;
    };

    // keyboard events
    public keyDown = (event: { which: number; keyCode: number; shiftKey: boolean }) => {
        this.puzzle.graph.multiSelect(<boolean>event.shiftKey);

        return true;
    };

    public keyUp = (event: { which: number; keyCode: number; shiftKey: boolean }) => {
        let keyCode = event.which || event.keyCode;

        this.puzzle.graph.multiSelect(event.shiftKey);

        switch (keyCode) {
            // 0
            case 48:
                this._updateScale(1);
                break;

            // r
            case 82:
                this.puzzle.graph.restoreGraph();
                break;

            // s
            case 83:
                this.puzzle.graph.saveGraph();
                break;

            // o
            case 79:
                this.centerCanvas();
                break;

            // +
            case 187:
                this.zoomIn();
                break;

            // -
            case 189:
                this.zoomOut();
                break;

            // delete
            case 46:
                this.puzzle.deleteSelected();
                this.pushSelectionState();

                break;

            default:
                // noop
                break;
        }

        return true;
    };

    // click events

    public edgeClicked = (edge: Edge, ignore: Object, event: Event) => {
        event.stopPropagation();

        this.puzzle.graph.selectEntity(edge);
        this.pushSelectionState();
    };

    public nodeClicked = (node: Node, ignore: Object, event: Event) => {
        event.stopPropagation();

        if (!node.selected()) {
            this.puzzle.graph.selectEntity(node);
            this.pushSelectionState();
        }
    };

    public nodeMouseOver = (node: Node) => {
        this.puzzle.nodeHovered(node);
    };

    public graphMouseOver = (ignore, event: MouseEvent) => {
        let position = this._eventGraphCoordinates(event);

        this.puzzle.nodeHoveredOut(position);
    };

    public backgroundClicked = (ignore, event) => {
        this.focus();
        this.puzzle.graph.clearSelection();
        this.pushSelectionState();
    };

    // called while the knockout binding is being applied to an element
    public initHTML = (element: HTMLElement) => {
        this.containerElement($(element));

        this.containerElement().keyup(this.keyUp);
        this.containerElement().keydown(this.keyDown);
        this.containerElement().bind("mousewheel DOMMouseScroll", this.mouseWheel);

        // initialize the canvas width
        this.containerElement().find(".canvas").width(this.width());
        this.containerElement().find(".canvas").height(this.height());
        this.centerCanvas();
    };

    public nodeStart: GraphEntities.NodeUIEventHandler = (node, event, ui) => {
        this.lastX = this._undoScale(ui.position.left);
        this.lastY = this._undoScale(ui.position.top);

        if (!node.selected()) {
            this.puzzle.graph.selectEntity(node);
            this.pushSelectionState();
        }

        this.lastZIndex += 2;
        node.zIndex(this.lastZIndex);

        // override what the drag is doing
        ui.position.left = node.location().x;
        ui.position.top = node.location().y;
    };

    public nodeDragged: GraphEntities.NodeUIEventHandler = (node, event, ui) => {
        let dX = this._undoScale(ui.position.left) - this.lastX;
        let dY = this._undoScale(ui.position.top) - this.lastY;

        $.each(this.puzzle.graph.selectedEntities, (index, selected) => {
            if (selected instanceof Node) {
                // if this has a center piece, we want to move that instead
                let centerPiece = this.puzzle.getCenterPiece(selected);
                selected = (centerPiece && centerPiece.node) || selected;

                selected.location({ x: selected.location().x + dX, y: selected.location().y + dY });
            }
        });

        // override what the drag is doing
        ui.position.left = node.location().x;
        ui.position.top = node.location().y;

        this.lastX = ui.position.left;
        this.lastY = ui.position.top;
    };

    public portStart: GraphEntities.PortUIEventHandler = (port, event, ui) => {
        this.connecting(true);

        this.draggingNode = <Node>port.parent;
    };

    public portDrag: GraphEntities.PortUIEventHandler = (port, event, ui) => {
        if (port.location() === null) {
            this.lastX = this._undoScale(ui.position.left);
            this.lastY = this._undoScale(ui.position.top);

            port.location({ x: port.x(), y: port.y() });
        }

        let dX = this._undoScale(ui.position.left) - this.lastX;
        let dY = this._undoScale(ui.position.top) - this.lastY;

        port.location({ x: port.location().x + dX, y: port.location().y + dY });

        // override what the drag is doing
        ui.position.left = port.location().x;
        ui.position.top = port.location().y;

        this.lastX = ui.position.left;
        this.lastY = ui.position.top;
    };

    public portDrop: GraphEntities.NodeUIEventHandler = (node, event, ui) => {
        let connectNode = (outputNode: Node, inputNode: Node) => {
            return () => {
                this.puzzle.connectNode(outputNode, inputNode);
            };
        };

        // we don't want to block the stop event, so we set a timeout
        setTimeout(connectNode(this.draggingNode, <Node>node));
        this.draggingNode = null;
    };

    public portStop: GraphEntities.NodeUIEventHandler = (node, event, ui) => {
        this.connecting(false);
    };

    public inputPortAdd = () => {
        return this._portAdd(true);
    };

    public outputPortAdd = () => {
        return this._portAdd();
    };

    public addSummaryNode = (node: Node) => {
        if (!node) {
            return;
        }

        node.onStart(this.nodeStart);
        node.onDrag(this.nodeDragged);
    };

    public addNode = (node: Node, inputPort: GraphEntities.Port.InputPort, outputPort: GraphEntities.Port.OutputPort) => {
        if (!node) {
            return;
        }

        let toolbar = new NodeToolbar.EditorNodeToolbar(node, this._lifetimeManager);

        toolbar.onDelete((_node) => {
            this.puzzle.selectNode(<Node>_node);
            this.puzzle.deleteSelected();
        });
        toolbar.onEdit(() => {
            this.puzzle.selectNode(node);
            let promise = node.edit();
            if (promise) {
                promise.then((extensionPieces) => {
                    this.puzzle.selectNode(node);
                    let point = node.location();
                    this._addNodes(node, extensionPieces, point);
                    this.puzzle.deleteNode(node);
                }, (reason) => {
                    // Nothing to do since the wizard/dialog was closed before completion.
                });
            }
        });

        node.onStart(this.nodeStart);
        node.onDrag(this.nodeDragged);

        if (outputPort) {
            if (outputPort instanceof GraphEntities.Port.DraggableOutputPort) {
                outputPort.onStop(this.portStop);
                outputPort.onStart(this.portStart);
                outputPort.onDrag(this.portDrag);
            } else {
                outputPort.onClick(this.outputPortAdd());
            }
        }

        if (inputPort) {
            inputPort.onDrop(this.portDrop);
            inputPort.onClick(this.inputPortAdd());
        }

        // leave room for node collections to have different layers
        this.lastZIndex += 2;

        node.zIndex(this.lastZIndex);
    };

    private _overlaySubscription: MessageHandler.IMessageSubscription<AuthoringOverlay.AuthoringOverlay>;

    private _portAdd = (isInput: boolean = false) => {
        return (centerNode: GraphEntities.Node.Node, event: MouseEvent) => {
            let commandGroup = new ExtensionConfigs.AddTableCommandGroup(isInput);

            let promise = commandGroup.bindViewModels();

            Microsoft.DataStudio.UxShell.Menu.createContextMenu({
                clientX: event.clientX,
                clientY: event.clientY
            }, commandGroup);

            promise.then((config) => {
                let centerPiece = this.puzzle.getPiece(centerNode);

                if (centerPiece instanceof GraphEntities.Piece.CenterPiece) {
                    if (isInput) {
                        this.puzzle.addNewInput(centerPiece, config);
                    } else {
                        this.puzzle.addNewOutput(centerPiece, config);
                    }
                } else {
                    logger.logError("Tried to add an {0} to a non-center piece. Piece id: {1}".format(isInput ? "input" : "output", centerPiece.id()));
                }
            }, (err) => {
                // nothing to do, the user canceled this
            });
        };
    };

    /* Deployment */
    // iannight: We can maybe take some of the logic for our actual deployment step, so I'm keeping it
    /* tslint:disable:no-unused-variable */
    private deployEntities = () => {
        /* tslint:enable:no-unused-variable */
        let promises: Q.Promise<Object>[] = [],
            done: Q.Deferred<Object> = Q.defer();

        Q.all(promises).then((results) => {
            let url = Microsoft.DataStudio.Application.ShellContext.CurrentRoute().url.replace(
                Microsoft.DataStudio.Application.ShellContext.CurrentRoute().view, "edit");

            url = url.replace(Microsoft.DataStudio.Application.ShellContext.CurrentRoute().module, "datafactory");

            if (results.length === 1) {
                // url += "/pipeline/" + results[0].name;
            }

            // remove questionmark
            url = url.substring(1);

            window.setTimeout(() => {
                Microsoft.DataStudio.Application.Router.navigate(url);
                done.resolve("Success!");
            }, 3000);
        }, () => {
            done.reject("An error occured");
        });

        return done.promise;
    };

    constructor(params?: Object) {
        super();

        logger.logInfo("Begin creating editor...");

        // TODO iannight: Do we want to set the getDependencies function in the EntityStore like this?
        // We should add a helper method to set it so it's more clear what's happening.
        AppContext.getInstance().authoringEntityStore.getDependencies(this.getDependencies);
        this.puzzle = new Puzzle();
        this.puzzle.nodeAddedHandler(this.addNode);
        this.puzzle.summaryNodeAddedHandler(this.addSummaryNode);

        this.puzzle.graph.center = ko.pureComputed(() => {
            return { x: this.width() / 2, y: this.height() / 2 };
        });

        NodePatcher.patchNodes();
        let appContext = AppContext.getInstance();
        this.overlayModalParams = {
            isVisible: ko.observable(false),
            modalContainerClass: "adf-editor-modal",
            template: this.authoringOverlayTemplate
        };
        this._overlaySubscription = {
            name: EditorViewModel.className,
            callback: (authoringOverlay) => {
                if (authoringOverlay) {
                    // The lines in this block are order-dependent.
                    this.authoringOverlay(authoringOverlay);
                    this.overlayModalParams.isVisible(!!authoringOverlay.overlayContent);
                } else {
                    this.authoringOverlay(authoringOverlay);
                    this.overlayModalParams.isVisible(false);
                }
            }
        };
        appContext.authoringOverlayHandler.register(this._overlaySubscription);

        logger.logInfo("End creating editor.");
    }

    // updates the actual dom element with the current scroll position
    public updateElementScroll() {
        if (!this.containerElement()) {
            return;
        }

        this.containerElement().scrollLeft(this.scrollLeft());
        this.containerElement().scrollTop(this.scrollTop());
    }

    public centerCanvas() {
        this.scrollTop((this.height() - this.containerElement().height()) / 2);
        this.scrollLeft((this.width() - this.containerElement().width()) / 2);

        this.updateElementScroll();
    }

    // update view model to reflect container element
    public updateModelScroll() {
        if (!this.containerElement()) {
            return;
        }

        this.scrollLeft(this.containerElement().scrollLeft());
        this.scrollTop(this.containerElement().scrollTop());
    }

    public pushSelectionState() {
        let viewModels = [];

        for (let i in this.puzzle.graph.selectedEntities) {
            if (this.puzzle.graph.selectedEntities[i] instanceof Node) {
                viewModels.push((<Node>(this.puzzle.graph.selectedEntities[i])).extensionViewModel);
            }
        }

        AppContext.getInstance().selectionHandler.pushState(EditorViewModel.viewName, viewModels);
    }

    public focus() {
        this.hasFocus(true);
    }

    /* Event Handling */

    public addCenterNode(config: GraphContracts.IExtensionPiece, x: number, y: number, add = true) {
        let newPiece = this.puzzle.addCenterPiece(config, new Tables.TableSummary(), new Tables.TableSummary());

        // additional config needed for the center node
        newPiece.node.location({ x: x, y: y });

        this.puzzle.graph.selectEntity(newPiece.node, true);
        this.pushSelectionState();
    }

    public dispose(): void {
        super.dispose();
        AppContext.getInstance().authoringOverlayHandler.unregister(this._overlaySubscription);
    }

    public pan(dX: number, dY): void {
        this.updateModelScroll();
        this.scrollLeft(this.scrollLeft() - dX);
        this.scrollTop(this.scrollTop() - dY);
        this.updateElementScroll();
    }

    public zoomIn(amount: number = EditorViewModel.SCALE_INCREMENT): void {
        this._updateScale(Math.min(EditorViewModel.MAX_SCALE, this.puzzle.graph.scale() + amount));
    }

    public zoomOut(amount: number = EditorViewModel.SCALE_INCREMENT): void {
        this._updateScale(Math.max(EditorViewModel.MIN_SCALE, this.puzzle.graph.scale() - amount));
    }

    private _eventGraphCoordinates(event: MouseEvent): GraphContracts.IPoint {
        // TODO iannight: fix issues with scaling (produces incorrect values when scale != 1)

        return {
            x: this._undoScale(event.pageX - this.containerElement().offset().left) + this.containerElement().scrollLeft(),
            y: this._undoScale(event.pageY - this.containerElement().offset().top) + this.containerElement().scrollTop()
        };
    }

    /* tslint:disable:no-unused-variable iannight: I really think we'll need this at some point */
    private _applyScale(coordinate: number) {
        return coordinate * this.puzzle.graph.scale();
    }
    /* tslint:enable:no-unused-variable */

    private _undoScale(coordinate: number) {
        return coordinate / this.puzzle.graph.scale();
    }

    private _updateScale(newScale: number) {
        if (!this.zoomEnabled()) {
            return false;
        }

        let oldWidth = this.containerElement().width(),
            oldHeight = this.containerElement().height();

        this.puzzle.graph.scale(newScale);

        let newWidth = this.containerElement().width(),
            newHeight = this.containerElement().height();

        this.pan((newWidth - oldWidth) / 2, (newHeight - oldHeight) / 2);
    }

    private _addNodes(node: Node, pieces: GraphContracts.IExtensionPiece[], point: GraphContracts.IPoint) {
        let yDelta = Math.max(Tables.TableNode.height, Activity.ActivityNode.height) + 10;
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].mainConfig) {
                this.addCenterNode(pieces[i], point.x, point.y + yDelta * i);
            } else if (pieces[i].inputConfigs && pieces[i].inputConfigs.length === 1 && node) {
                let inputConfig = pieces[i].inputConfigs[0];
                this.puzzle.substituteConfig(node, inputConfig);
            }
        }
    }
}

// needed for actual component
export let viewModel = EditorViewModel;
