/// <reference path="../../../references.d.ts" />

import Includes = require("./Includes");
import Geometry = Includes.Geometry;
import Port = require("./Port");

export interface IEdgeNode extends Includes.INode {
    edges: Includes.KnockoutExtensions.ObservableMap<Port.IEdge>;
}

export class Edge implements Includes.IGraphEntity, Port.IEdge {
    public id: KnockoutObservable<string> = ko.observable(null);
    public startNode: KnockoutObservable<IEdgeNode> = ko.observable<IEdgeNode>(null);
    public endNode: KnockoutObservable<IEdgeNode> = ko.observable<IEdgeNode>(null);
    public line: KnockoutObservable<Geometry.AnchoredLine> = ko.observable<Geometry.AnchoredLine>(null);
    public selected: KnockoutObservable<boolean> = ko.observable<boolean>(false);

    public allowCycle: KnockoutObservable<boolean> = ko.observable(false);
    public isCycle: KnockoutComputed<boolean>;
    public siblingId: KnockoutObservable<string> = ko.observable(null);

    public removeSibling = () => {
        if (!this._sibling()) {
            return;
        }
        this._sibling().dispose();
        this._sibling(null);
    };

    public addSibling = (sibling: Edge) => {
        this._sibling(sibling);
    };

    private _sibling: KnockoutObservable<Edge> = ko.observable(null);

    private _lineStartEndSubscription: KnockoutSubscription<Includes.IStartEnd>;

    constructor(startNode: IEdgeNode, endNode: IEdgeNode) {
        this.startNode(startNode);
        this.endNode(endNode);

        this.isCycle = ko.pureComputed(() => {
            return this._sibling() !== null;
        });

        this.line(new Geometry.AnchoredLine(this.isCycle));

        this._lineStartEndSubscription = Includes.Util.getLineStartEndSubscription(startNode.location, startNode.width, startNode.height,
            endNode.location, endNode.width, endNode.height, this.line);

        this.line().visible(true);

        // the zindex should be equal to the greater parent
        this.line().zIndex = ko.pureComputed(() => {
            return Math.min(this.startNode().zIndex(), this.endNode().zIndex());
        });

        // this should be a unique combo of both parents
        this.id(this.startNode().id() + " @ " + this.endNode().id());
        this.siblingId(this.endNode().id() + " @ " + this.startNode().id());

        this.startNode().edges.put(this.id(), this);
        this.endNode().edges.put(this.id(), this);
    }

    public dispose() {
        if (this._sibling()) {
            this._sibling().dispose();
        }

        this.startNode().edges.remove(this.id());
        this.endNode().edges.remove(this.id());
        this._lineStartEndSubscription.dispose();
    }
}
