/// <reference path="../../../references.d.ts" />
/* tslint:disable:no-unused-variable */
import Includes = require("./Includes");
/* tslint:enable:no-unused-variable */
import KnockoutExtensions = Includes.KnockoutExtensions;

import Port = require("./Port");
import Node = require("./Node");
import NodeToolbar = require("./NodeToolbar");
import {IconAdornment, IAdornmentNode} from "./Adornment";
import Framework = require("../../../_generated/Framework");

export class Piece extends Framework.Disposable.RootDisposable {
    public node: Node.Node;
    public id: KnockoutObservable<string>;

    public selectChanged(selected: boolean): void {
        // noop
    }

    public dispose(): void {
        super.dispose();
        this.node.dispose();
    }

    constructor(node: Node.Node) {
        super();
        this.node = node;
        this.id = node.id;

        this._lifetimeManager.registerForDispose(this.node.selected.subscribe((selected) => {
            this.selectChanged(selected);
        }));
    }
}

export abstract class OuterPiece extends Piece {
    public collection: PieceCollection = null;

    public selectChanged(selected: boolean): void {
        if (this.collection) {
            this.collection.nodeSelectChanged(selected);
        }
    }

    public abstract getAttachedX(): number;

    public onHover(): void {
        if (this.collection) {
            this.collection.onHover();
        }
    }

    constructor(node: Node.Node) {
        super(node);
    }

    public dispose(): void {
        super.dispose();

        if (this.collection) {
            this.collection.removePiece(this);
        }
    }
}

// these are inputs that only belong to one activity, so we treat them differently
export class InputPiece extends OuterPiece {
    public getAttachedX(): number {
        return this.collection.centerPiece.node.location().x - this.node.width() - PieceCollection.HORIZONTAL_MARGIN;
    }

    constructor(node: Node.Node) {
        super(node);
    }
}

// output port, conditionally connected
export class OutputPiece extends OuterPiece {
    public outputPort: KnockoutObservable<Port.DraggableOutputPort>;

    public getAttachedX(): number {
        return this.collection.centerPiece.node.location().x + this.collection.centerPiece.node.width() + PieceCollection.HORIZONTAL_MARGIN;
    }

    constructor(node: Node.Node) {
        super(node);
        this.outputPort = ko.observable(new Port.DraggableOutputPort(node));

        this._lifetimeManager.registerForDispose(this.outputPort().isDragging.subscribe((isDragging) => {
            if (this.collection) {
                this.collection.dragging(isDragging);
            }
        }));
    }
}

export class InputArrowAdornment extends IconAdornment {
    public icon: KnockoutObservable<string> = ko.observable(Framework.Svg.node_arrow);

    constructor(parent: IAdornmentNode) {
        super(parent);

        this._centerVertically();

        this.width(PieceCollection.HORIZONTAL_MARGIN - 2 * Node.Node.BORDER_WIDTH);

        this.x = ko.pureComputed(() => {
            return this.parent.location().x - this.width();
        });

        this._calculateStyle();
    }
}

export class OutputArrowAdornment extends InputArrowAdornment {
    protected static X_OFFSET: number = 6;

    constructor(parent: IAdornmentNode) {
        super(parent);

        this.x = ko.pureComputed(() => {
            return this.parent.location().x + this.parent.width() + 2 * Node.Node.BORDER_WIDTH;
        });

        this._calculateStyle();
    }
}

export abstract class PieceCollection extends Piece {
    // how far away the collection is from the center node
    public static HORIZONTAL_MARGIN = 32 + 2 * Node.Node.BORDER_WIDTH;

    // vertical distance between the subpieces when they're spread
    public static PIECE_SPREAD_BUFFER = 20;

    // how long before we reset nodes on a spread
    public static PIECE_SPREAD_TIMEOUT = 200;

    // how far the cursor has to go before we collapse the collection
    public static LEAVE_HOVER_PADDING = 20;

    public node: Node.SummaryNode;

    public centerPiece: CenterPiece;
    public locked: KnockoutComputed<boolean>;
    public pinned: KnockoutObservable<boolean>;
    public mousePosition: KnockoutObservable<Includes.GraphContracts.IPoint>;
    public dragging: KnockoutObservable<boolean> = ko.observable(false);

    public _pieces: KnockoutExtensions.ObservableMap<OuterPiece>;

    protected _arrow: InputArrowAdornment;

    private _selectedNodes: KnockoutObservable<number> = ko.observable(0);
    private _expanded: KnockoutObservable<boolean>;
    private _hoverOutTimeout: number = null;
    private _hoverRect: KnockoutComputed<Includes.GraphContracts.IRect>;
    private _originalWidth: number;
    private _originalHeight: number;
    private _height: KnockoutObservable<number> = ko.observable(null);
    private _width: KnockoutObservable<number> = ko.observable(null);
    private _x: KnockoutObservable<number>;
    private _y: KnockoutObservable<number>;

    private _onPieceHoveredOut = (): void => {
        if (!this.locked() && this.node.visible()) {
            if (this._expanded() && Includes.Util.pointInRect(this.mousePosition(), this._hoverRect())) {
                return;
            }

            this._expanded(false);

            clearInterval(this._hoverOutTimeout);
            this._hoverOutTimeout = null;
        }
    };

    constructor(centerPiece: CenterPiece, node: Node.SummaryNode) {
        super(node);

        let toolbar = new NodeToolbar.SummaryNodeToolbar(node, this._lifetimeManager);
        this.pinned = toolbar.pinned;

        this._originalHeight = node.height();
        this._originalWidth = node.width();

        this._expanded = this.node.expanded;

        // show the toolbar only when we're expanded
        this._lifetimeManager.registerForDispose(this._expanded.subscribe((expanded) => {
            toolbar.adornment.visible(expanded);
        }));

        // hidden by default
        toolbar.adornment.visible(true);

        this._lifetimeManager.registerForDispose(this.node.zIndex.subscribe((zIndex) => {
            this._updateZIndexes(zIndex);
        }));

        this.centerPiece = centerPiece;

        this._pieces = new KnockoutExtensions.ObservableMap<OuterPiece>();

        this._lifetimeManager.registerForDispose(this._pieces);

        this.centerPiece._lifetimeManager.registerForDispose(ko.computed(() => {
            if (!this.centerPiece.node.location()) {
                return;
            }

            if (!this._expanded()) {
                this._collapsePieces();
            } else {
                this._spreadPieces();
            }
        }));

        this._x = ko.pureComputed(() => {
            return this.getAttachedX();
        });

        this._y = ko.pureComputed(() => {
            return this.centerPiece.node.location().y + (-this.node.height() + this.centerPiece.node.height()) / 2;
        });

        this.node.width = ko.pureComputed(() => {
            return this._expanded() ? this._width() : this._originalWidth;
        });

        this.node.height = ko.pureComputed(() => {
            return this._expanded() ? this._height() : this._originalHeight;
        });

        this.node.location = ko.pureComputed(() => {
            return { x: this._x(), y: this._y() };
        });

        this._hoverRect = ko.pureComputed(() => {
            return {
                y: this._y() - PieceCollection.LEAVE_HOVER_PADDING,
                height: this._height() + PieceCollection.LEAVE_HOVER_PADDING,
                x: this._x() - PieceCollection.LEAVE_HOVER_PADDING,
                width: this._width() + PieceCollection.LEAVE_HOVER_PADDING
            };
        });

        this.node.updateStyle();

        this.locked = ko.pureComputed(() => {
            return this.pinned() || this.dragging() || this._selectedNodes() > 0;
        });

        this._lifetimeManager.registerForDispose(this.locked.subscribe((isLocked) => {
            // if we change to locked, make sure we're expanded. The reverse is NOT true (we should collpase just because we unlock)
            if (isLocked) {
                this._expanded(true);
            }
        }));

        // default to being invisible
        this.node.visible(false);
    }

    public abstract getAttachedX(): number;

    public nodeSelectChanged(selected: boolean): void {
        this._selectedNodes(this._selectedNodes() + (selected ? 1 : -1));
    }

    public addPiece(piece: OuterPiece): void {
        piece.collection = this;
        this._pieces.put(piece.id(), piece);

        this._piecesChanged();
    }

    public removePiece(piece: OuterPiece): void {
        piece.collection = null;
        this._pieces.remove(piece.id());

        this._piecesChanged();
    }

    public containsPiece(piece: OuterPiece): boolean {
        return !!(this._pieces.lookup(piece.id()));
    }

    public onHover(): void {
        this._expanded(true);

        if (this._hoverOutTimeout) {
            clearInterval(this._hoverOutTimeout);
        }

        this._hoverOutTimeout = setInterval(this._onPieceHoveredOut, PieceCollection.PIECE_SPREAD_TIMEOUT);
    }

    public dispose(): void {
        // make sure we don't close again
        this.pinned(true);

        // spread all of the pieces vertically on deletion
        this._spreadPieces();

        // remove all references to this collection
        this._pieces.forEach((piece: OuterPiece) => {
            piece.collection = null;
        });

        this.centerPiece = null;

        super.dispose();
    }

    private _toggleArrow(visible: boolean) {
        this._arrow.visible(visible);
    }

    private _resetNodePositions(): void {
        this.centerPiece.node.location.notifySubscribers();
    }

    private _piecesChanged(): void {
        let pieces: OuterPiece[] = this._pieces.toArray();

        this._toggleArrow(pieces.length > 0);

        let maxWidth = this._originalWidth;

        let selectedNodes = 0;

        let totalHeight = pieces.reduce((prev: number, piece: OuterPiece) => {
            maxWidth = Math.max(piece.node.width(), maxWidth);

            if (piece.node.selected()) {
                selectedNodes++;
            }

            return prev + piece.node.height();
        }, 0);

        this._selectedNodes(selectedNodes);

        // all the buffers we added and padding on top and bottom
        this._height(totalHeight + PieceCollection.PIECE_SPREAD_BUFFER * (pieces.length + 2));

        this._width(maxWidth + PieceCollection.PIECE_SPREAD_BUFFER * 2);

        let viewModels: Object[] = [];

        // update the summary piece
        this._pieces.forEach((piece: OuterPiece) => {
            viewModels.push(piece.node.extensionViewModel);
        });

        this.node.extensionViewModel.updateSummary(viewModels);

        // only show the sumamry node when we have multiple nodes to summarize
        this.node.visible(pieces.length > 1);

        this._resetNodePositions();
    }

    private _spreadPieces(): void {
        let pieces: OuterPiece[] = this._pieces.toArray();

        // nothing to do
        if (!pieces.length) {
            return;
        }

        // when there's only one node, it should go in the same position as the original
        if (pieces.length === 1) {
            this._showPiece(pieces[0]);
            return;
        }

        // double the buffer amount so we can have room for metadata
        let startY = this._y() + PieceCollection.PIECE_SPREAD_BUFFER * 2;

        pieces.forEach((piece) => {
            piece.node.visible(true);
            piece.node.location({ y: startY, x: this._x() + PieceCollection.PIECE_SPREAD_BUFFER });
            startY += piece.node.height() + PieceCollection.PIECE_SPREAD_BUFFER;
        });
    }

    private _collapsePieces(): void {
        let pieces: OuterPiece[] = this._pieces.toArray();

        // when there's only one node, it should go in the same position as the original
        if (pieces.length === 1) {
            this._showPiece(pieces[0]);
            return;
        }

        pieces.forEach((piece) => {
            piece.node.visible(false);
        });
    }

    // when only one node is in the collection, we show it unchanged
    private _showPiece(piece: OuterPiece): void {
        piece.node.visible(true);

        let y: number = this.centerPiece.node.location().y + (-piece.node.height() + this.centerPiece.node.height()) / 2;

        piece.node.location({ x: piece.getAttachedX(), y: y });
    }

    private _updateZIndexes(zIndex: number) {
        zIndex++;

        this._pieces.forEach((piece: OuterPiece) => {
            piece.node.zIndex(zIndex);
        });
    }
}

export class CenterPiece extends Piece {
    // how output pieces connect to this
    public inputPort: KnockoutObservable<Port.InputPort>;

    // how we can add a new output
    public outputPort: KnockoutObservable<Port.OutputPort>;

    // which input pieces are connected
    public inputs: PieceCollection;

    // outputs that are connected with an edge
    public edgeConnectedInputs: KnockoutExtensions.ObservableMap<OutputPiece>;

    // which outputs are connected
    public outputs: PieceCollection;

    constructor(node: Node.Node, inputsNode: Node.SummaryNode, outputsNode: Node.SummaryNode) {
        super(node);
        this.inputPort = ko.observable(new Port.InputPort(node));
        this.outputPort = ko.observable(new Port.OutputPort(node));
        this.inputs = new InputPieceCollection(this, inputsNode);
        this.outputs = new OutputPieceCollection(this, outputsNode);
        this.edgeConnectedInputs = new KnockoutExtensions.ObservableMap<OutputPiece>();

        this._lifetimeManager.registerForDispose(this.inputs);
        this._lifetimeManager.registerForDispose(this.outputs);
    }

    public addInput(input: InputPiece): void {
        this.inputs.addPiece(input);
    }

    public addOutput(output: OutputPiece): void {
        this.outputs.addPiece(output);
    }

    public removeInput(input: InputPiece): void {
        this.inputs.removePiece(input);
    }

    public removeOutput(output: OutputPiece): void {
        this.outputs.removePiece(output);
    }

    public containsPiece(piece: OuterPiece): boolean {
        return !!(this.edgeConnectedInputs.lookup(piece.id())) || this.outputs.containsPiece(piece);
    }
}

export class InputPieceCollection extends PieceCollection {
    constructor(centerPiece: CenterPiece, node: Node.SummaryNode) {
        super(centerPiece, node);

        this._arrow = new InputArrowAdornment(centerPiece.node);
        this._arrow.visible(false);
    }

    public getAttachedX(): number {
        return this.centerPiece.node.location().x - this.node.width() - PieceCollection.HORIZONTAL_MARGIN;
    };
}

export class OutputPieceCollection extends PieceCollection {
    constructor(centerPiece: CenterPiece, node: Node.SummaryNode) {
        super(centerPiece, node);

        this._arrow = new OutputArrowAdornment(centerPiece.node);
        this._arrow.visible(false);
    }

    public getAttachedX(): number {
        return this.centerPiece.node.location().x + this.centerPiece.node.width() + PieceCollection.HORIZONTAL_MARGIN;
    };
}
