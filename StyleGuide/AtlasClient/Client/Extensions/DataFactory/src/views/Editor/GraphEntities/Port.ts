/// <reference path="../../../references.d.ts" />
/// <amd-dependency path="text!./Templates/Port.html" />
/// <amd-dependency path="text!./Templates/OutputPort.html" />

import Framework = require("../../../_generated/Framework");
import Includes = require("./Includes");
import Geometry = Includes.Geometry;
import Adornment = require("./Adornment");

export type PortUIEventHandler = (port: Port, event: Event, ui) => void;

export interface IEdge {
    dispose: () => void;
    id: KnockoutObservable<string>;
}

export class Port extends Adornment.Adornment {
    protected static ACTIVE_CLASS: string = "active";
    protected static HOVER_CLASS: string = "hover";

    public activeIcon: string = Framework.Svg.blue_plus;

    protected template = require("text!./Templates/Port.html");

    constructor(parent: Adornment.IAdornmentNode) {
        super(parent);
    }
}

export class OutputPort extends Port {
    protected static X_OFFSET: number = -4;

    public basicIcon: string = Framework.Svg.node_output;

    constructor(parent: Adornment.IAdornmentNode) {
        super(parent);

        this._alignRight();

        this.displayClasses = ko.pureComputed(() => {
            return "output static";
        });

        this._calculateStyle();

        this.tooltip(ClientResources.addNewOutputCommandLabel);
    }
}

export class DraggableOutputPort extends OutputPort {
    protected template = require("text!./Templates/OutputPort.html");

    public potentialMates: KnockoutObservableArray<InputPort> = ko.observableArray([]);
    public potentialConnection: KnockoutObservable<Includes.IStartEnd> = ko.observable(null);
    public line: KnockoutObservable<Geometry.AnchoredLine> = ko.observable(null);
    public isDragging: KnockoutObservable<boolean> = ko.observable(false);
    public draggingPoint: KnockoutObservable<Includes.GraphContracts.IPoint> = ko.observable(null);
    public onStart: KnockoutObservable<PortUIEventHandler> = ko.observable($.noop);
    public onStop: KnockoutObservable<Includes.NodeUIEventHandler> = ko.observable($.noop);
    public onDrag: KnockoutObservable<PortUIEventHandler> = ko.observable($.noop);
    public typeClasses: KnockoutObservableArray<string> = ko.observableArray<string>([]);
    public expandedHeight: KnockoutObservable<number> = ko.observable(Adornment.Adornment.DEFAULT_WIDTH);

    public start = (event: Event, ui) => {
        this.drag(event, ui);
        this.line().visible(true);
        this.isDragging(true);
        this.parent.isConnecting(true);
        this.potentialConnection(null);
        this.potentialMates([]);

        // call injected function
        this.onStart()(this, event, ui);
    };

    public stop = (event: Event, ui) => {
        // remove positioning override
        this.location(null);

        this.line().visible(false);
        this.isDragging(false);
        this.parent.isConnecting(false);

        // reset style
        this.x.notifySubscribers();

        // fix active potential mates
        this.potentialMates().forEach((inputPort) => {
            inputPort.resetState();
        });

        // call injected function
        this.onStop()(this.parent, event, ui);
    };

    public drag = (event: Event, ui) => {
        this.onDrag()(this, event, ui);
        this.draggingPoint(this.location());
    };

    private lineStartEndSubscription: KnockoutSubscription<Includes.IStartEnd>;
    private _hostElement: HTMLElement;

    /* tslint:disable:no-unused-variable */
    // Used in OutputPort.html
    private portUIConfig = (element: HTMLElement) => {
        this._hostElement = element;

        return {
            draggable: {
                containment: Includes.Constants.CONTAINER_SELECTOR,
                drag: this.drag,
                start: this.start,
                stop: this.stop
            }
        };
    };
    /* tslint:enable:no-unused-variable */

    constructor(parent: Adornment.IAdornmentNode) {
        super(parent);

        this.displayClasses = ko.pureComputed(() => {
            return "output " + (this.isDragging() ? " dragging " : "") + this.typeClasses().join(" ");
        });

        this.line(new Geometry.AnchoredLine(null));

        // initialize dragging point
        this.draggingPoint({ x: this.x(), y: this.y() });

        let lineStartEnd =
            Includes.Util.getComputedIntersectsFromRectangles(this.parent.location, this.parent.width, this.parent.height,
                this.draggingPoint, this.width, this.expandedHeight);

        this.lineStartEndSubscription = ko.computed(() => {
            this.line().start(this.potentialConnection() ? this.potentialConnection().start : lineStartEnd().start);
            this.line().end(this.potentialConnection() ? this.potentialConnection().end : lineStartEnd().end);
        });
    }

    public dispose() {
        this.lineStartEndSubscription.dispose();
    }
}

export class InputPort extends Port {
    public basicIcon: string = Framework.Svg.node_input;

    // the output port that we can connect to
    public potentialMate: KnockoutObservable<DraggableOutputPort> = ko.observable(null);

    // the start and end of the connection between the dragging output port and us
    public potentialConnection: KnockoutObservable<Includes.IStartEnd> = ko.observable(null);

    // when a potential connection is actually over us
    public hover: KnockoutObservable<boolean> = ko.observable(false);

    public onDrop: KnockoutObservable<Includes.NodeUIEventHandler> = ko.observable($.noop);
    public onStop: KnockoutObservable<Includes.NodeUIEventHandler> = ko.observable($.noop);
    public onAccept: KnockoutObservable<(nodeId: string) => DraggableOutputPort> = ko.observable(($.noop));

    // jQuery UI over event handler
    public over = (element: JQuery) => {
        this.hover(true);
        this.potentialMate().potentialConnection(this.potentialConnection());
    };

    // jQuery UI out event handlerhandler
    public out = (element: JQuery) => {
        this.hover(false);
        this.potentialMate().potentialConnection(null);
    };

    // jQuery UI accept handler
    public accept = (element: JQuery) => {
        let outputId = element.attr("data-id");

        this.potentialMate(this.onAccept()(outputId));

        // if we have a potenial mate and we can accept it
        this.parent.active(this.potentialMate() !== null);

        // add us to the potential mates
        if (this.parent.active()) {
            this.potentialMate().potentialMates.push(this);

            if (this.lineStartEndSubscription) {
                this.lineStartEndSubscription.dispose();
            }

            let startEnd = Includes.Util.getComputedIntersectsFromRectangles(this.potentialMate().parent.location,
                this.potentialMate().parent.width, this.potentialMate().parent.height,
                this.parent.location, this.parent.width, this.parent.height);

            this.potentialConnection(startEnd());
        }

        return this.parent.active();
    };

    private lineStartEndSubscription: KnockoutSubscription<Includes.IStartEnd> = null;

    // the ouput port is responsible for calling this, as we don't know when dragging has stopped
    public resetState() {
        this.location(null);
        this.parent.active(false);
        this.hover(false);
        this.potentialConnection(null);
        if (this.lineStartEndSubscription) {
            this.lineStartEndSubscription.dispose();
            this.lineStartEndSubscription = null;
        }
        this.potentialMate(null);
    }

    constructor(parent: Adornment.IAdornmentNode, accepts: string[] = []) {
        super(parent);
        this.displayClasses = ko.pureComputed(() => {
            return "input" + (this.hover() ? " hover" : "");
        });

        this.parentUIConfig = {
            droppable: {
                accept: this.accept,
                drop: this.handleEvent(this.onDrop),
                over: this.over,
                out: this.out,
                activeClass: Port.ACTIVE_CLASS,
                hoverClass: Port.HOVER_CLASS
            }
        };

        this.tooltip(ClientResources.addNewInputCommandLabel);
    }
}
