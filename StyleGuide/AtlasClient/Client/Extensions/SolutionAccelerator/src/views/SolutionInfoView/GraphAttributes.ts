/// <reference path="../../References.d.ts" />
import GraphControl = require("srcMap!../../Core/DataStudioUX/src/lib/GraphControl/graphControlExternal");
import NodeExtension = require("./NodeExtension");

export interface IStatusTile {
    icon: KnockoutObservable<string>;
    title: KnockoutObservable<string>;
    count: KnockoutObservable<number>;
}

export interface ICycle {
    bottom: GraphControl.IPoint;
    top: GraphControl.IPoint;
}

export interface IGraphInput {
    nodes: { [key: string]: NodeExtension.INodeExtension };
    edges: GraphControl.IEdge[];
    cycles: { [key: string]: ICycle };
}

export class BoxNode extends GraphControl.GraphNode {
    public extensionTemplate: string = "<div class='sampleNode' data-bind='graphNode:null, html: name'></div>";

    constructor(name: string, rect: GraphControl.IUpdateRect) {
        super(rect);
        this.extensionViewModel = { name: name };
        this.id(name);
    }
}

export class CycleBase extends GraphControl.GraphNode
{
    constructor(name: string, rect: GraphControl.IUpdateRect)
    {
        super(rect);
        this.extensionViewModel = { name: name };
        this.id(name);
    }
}

export class CycleNode extends CycleBase {
    // half the distance between partners
    public static delta = 10;
    public partner: CycleNode = null;
    public top: boolean;
    public name: string;

    public static dumpRect(rect: GraphControl.IRect): GraphControl.IRect {
        rect = $.extend(true, {}, rect);
        rect.x += CycleNode.delta;
        return rect;
    }

    public partnerUpdatePoint(myPoint: GraphControl.IPoint, theirPoint: GraphControl.IPoint): GraphControl.IPoint {
        myPoint.x += 2 * CycleNode.delta;

        // Not in sync
        if (myPoint.x !== theirPoint.x || myPoint.y !== theirPoint.y) {
            return { x: myPoint.x, y: myPoint.y };
        }

        // We're in sync
        return null;
    }

    constructor(id: string, point: GraphControl.IPoint, top: boolean = true, hasPartner = true) {
        super("@@" + id + (top ? "_top" : "_bottom"), hasPartner ? { x: point.x - CycleNode.delta, y: point.y, width: 0, height: 0 } : { x: point.x + CycleNode.delta, y: point.y, width: 0, height: 0 });
        this.top = top;
        this.name = id;

        if (hasPartner) {
            this.partner = new CycleNode(id + "_partner", point, top, false);
        }
    }

}

export class DottedNode extends GraphControl.GraphNode {
    public extensionTemplate: string = "<div class='dottedNode' data-bind='graphNode:null'></div>";

    constructor(name: string, rect: GraphControl.IUpdateRect) {
        super(rect);
        this.extensionViewModel = {};
        this.id(name);
    }
}