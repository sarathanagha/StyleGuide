/// <reference path="../../../references.d.ts" />
import Includes = require("./Includes");
import Graph = require("./Graph");
import Piece = require("./Piece");
import Node = require("./Node");
import Port = require("./Port");
import Edge = require("./Edge");
import KnockoutExtensions = Includes.KnockoutExtensions;
import Framework = require("../../../_generated/Framework");

let logger = Framework.Log.getLogger({
    loggerName: "Puzzle"
});

export interface IPuzzleDependency {
    centerViewModel: Object;
    inputViewModels: Object[];
    outputViewModels: Object[];
}

export class Puzzle {
    // how things are actually represented
    public graph: Graph.Graph;
    public mousePosition: KnockoutObservable<Includes.GraphContracts.IPoint> = ko.observable(null);

    public nodeAddedHandler: KnockoutObservable<(node: Node.Node, inputPort: Port.InputPort, outputPort: Port.OutputPort) => void>
    = ko.observable($.noop);

    public summaryNodeAddedHandler: KnockoutObservable<(node: Node.Node) => void>
    = ko.observable($.noop);

    private _pieces: KnockoutExtensions.ObservableMap<Piece.Piece>;

    constructor() {
        this.graph = new Graph.Graph();
        this._pieces = new KnockoutExtensions.ObservableMap<Piece.Piece>();
    }

    public getViewModels(collection: Piece.PieceCollection): Object[] {
        return collection._pieces.toArray().map(this.getViewModel);
    }

    public getViewModel(piece: Piece.Piece): Object {
        return piece.node.extensionViewModel;
    }

    public getDependencies(): StringMap<IPuzzleDependency> {
        let dependencies: StringMap<IPuzzleDependency> = {};

        this._pieces.forEach((piece: Piece.Piece) => {
            if (piece instanceof Piece.CenterPiece) {
                let dependency = {
                    centerViewModel: this.getViewModel(piece),
                    inputViewModels: this.getViewModels(piece.inputs),
                    outputViewModels: this.getViewModels(piece.outputs)
                };

                dependencies[piece.id()] = dependency;
            }
        });

        this.graph.edges.forEach((edge: Edge.Edge) => {
            let startPiece = this.getPiece(<Node.Node>edge.startNode());
            let endPiece = this.getPiece(<Node.Node>edge.endNode());

            if (startPiece instanceof Piece.OutputPiece && endPiece instanceof Piece.CenterPiece) {
                dependencies[endPiece.id()].inputViewModels.push(this.getViewModel(endPiece));
            }
        });

        return dependencies;
    }

    public getPiece(node: Node.Node) {
        return this._pieces.lookup(node.id());
    }

    public getCenterPiece(node: Node.Node): Piece.CenterPiece {
        let piece: Piece.Piece = this._pieces.lookup(node.id());

        if (piece instanceof Piece.OuterPiece) {
            if (piece.collection) {
                return piece.collection.centerPiece || null;
            }
        } else if (piece instanceof Piece.PieceCollection) {
            return piece.centerPiece;
        } else if (piece instanceof Piece.CenterPiece) {
            return piece;
        }

        return null;
    }

    public deleteSelected() {
        $.each(this.graph.selectedEntities, (id: string, entity: Includes.IGraphEntity) => {
            if (entity instanceof Node.Node) {
                this.removePiece(this._pieces.lookup(id));
            } else {
                this.graph.deleteEntity(entity);
            }
        });
    };

    public deleteNode(node: Node.Node) {
        this.removePiece(this._pieces.lookup(node.id()));
    }

    public addCenterPiece(
            contract: Includes.GraphContracts.IExtensionPiece, inputsSummary: Includes.GraphContracts.ISummaryExtensionConfig, outputsSummary: Includes.GraphContracts.ISummaryExtensionConfig) {
        let centerPiece = new Piece.CenterPiece(new Node.Node(contract.mainConfig), new Node.SummaryNode(inputsSummary), new Node.SummaryNode(outputsSummary));
        centerPiece.inputs.mousePosition = this.mousePosition;
        centerPiece.outputs.mousePosition = this.mousePosition;

        centerPiece.inputPort().onAccept((nodeId: string) => {
            let outputPiece = this._pieces.lookup(nodeId);

            if (outputPiece instanceof Piece.OutputPiece) {
                // if this is either our output or already an input
                if (centerPiece.containsPiece(outputPiece)) {
                    return null;
                }

                // TODO iannight: add type checking
                return outputPiece.outputPort();
            }

            return null;
        });

        this._addNode(centerPiece.node, centerPiece.inputPort(), centerPiece.outputPort());
        this._addSummaryNode(centerPiece.inputs.node);
        this._addSummaryNode(centerPiece.outputs.node);

        contract.inputConfigs.forEach((input) => {
            this.addNewInput(centerPiece, input);
        });
        contract.outputConfigs.forEach((output) => {
            this.addNewOutput(centerPiece, output);
        });

        this._pieces.put(centerPiece.id(), centerPiece);
        this._pieces.put(centerPiece.inputs.id(), centerPiece.inputs);
        this._pieces.put(centerPiece.outputs.id(), centerPiece.outputs);

        return centerPiece;
    };

    public addNewInput(centerPiece: Piece.CenterPiece, input: Includes.GraphContracts.IExtensionConfig) {
        let node = new Node.Node(input);
        let inputPiece = new Piece.InputPiece(node);
        centerPiece.addInput(inputPiece);
        this._addNode(node);
        this._pieces.put(inputPiece.id(), inputPiece);
    }

    public addNewOutput(centerPiece: Piece.CenterPiece, output: Includes.GraphContracts.IExtensionConfig) {
        let node = new Node.Node(output);
        let outputPiece = new Piece.OutputPiece(node);
        centerPiece.addOutput(outputPiece);
        this._addNode(node, null, outputPiece.outputPort());
        this._pieces.put(outputPiece.id(), outputPiece);
    }

    public substituteConfig(node: Node.Node, config: Includes.GraphContracts.IExtensionConfig): void {
        let nodePiece = this.getPiece(node);
        if (nodePiece instanceof Piece.InputPiece) {
            let asInput = <Piece.InputPiece>nodePiece;
            this._pieces.forEach((piece) => {
                if (piece instanceof Piece.CenterPiece) {
                    let centerPiece = <Piece.CenterPiece>piece;
                    if (centerPiece.inputs.containsPiece(asInput)) {
                        centerPiece.inputs.removePiece(asInput);
                        this.addNewInput(centerPiece, config);
                    } else if (centerPiece.outputs.containsPiece(asInput)) {
                        centerPiece.outputs.removePiece(asInput);
                        this.addNewOutput(centerPiece, config);
                    }
                }
            });
        } else {
            logger.logError("Expected node {0} to be an instance of Piece.InputPiece".format(JSON.stringify(nodePiece)));
        }
    }

    public removePiece(piece: Piece.Piece) {
        this.graph.deleteEntity(piece.node);
        this._pieces.remove(piece.id());

        if (piece instanceof Piece.CenterPiece) {
            this.removePiece(piece.inputs);
            this.removePiece(piece.outputs);
        }

        piece.dispose();
    };

    public connectNode(outputNode: Node.Node, centerNode: Node.Node) {
        let outputPiece: Piece.OutputPiece = <Piece.OutputPiece>this._pieces.lookup(outputNode.id()),
            centerPiece: Piece.CenterPiece = <Piece.CenterPiece>this._pieces.lookup(centerNode.id());

        this._connectPiece(outputPiece, centerPiece);
    }

    public detatchPiece(outerPiece: Piece.OuterPiece) {
        if (outerPiece instanceof Piece.OutputPiece) {
            outerPiece.collection.removePiece(outerPiece);
        }
    }

    public selectNode(node: Node.Node) {
        let entities: Includes.IGraphEntity[] = [];

        entities.push(node);
        this.graph.selectEntities(entities);
    }

    public nodeHovered(node: Node.Node) {
        let piece = this._pieces.lookup(node.id());

        if (piece instanceof Piece.OuterPiece || piece instanceof Piece.PieceCollection) {
            piece.onHover();
        }
    };

    public nodeHoveredOut(position: Includes.GraphContracts.IPoint) {
        this.mousePosition(position);
    };

    private _connectPiece(outputPiece: Piece.OutputPiece, centerPiece: Piece.CenterPiece, clone: boolean = true) {
        this.graph.addEdge(outputPiece.node, centerPiece.node);
        centerPiece.edgeConnectedInputs.put(outputPiece.id(), outputPiece);
    };

    private _addNode(node: Node.Node, inputPort: Port.InputPort = null, outputPort: Port.OutputPort = null) {
        this.nodeAddedHandler()(node, inputPort, outputPort);

        // this should happen after the call to the nodeAddedHandler so all of the templates are properly configured by the handler
        this.graph.addNode(node);
    };

    private _addSummaryNode(node: Node.Node) {
        this.summaryNodeAddedHandler()(node);
        this.graph.addNode(node);
    };
}
