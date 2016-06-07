/// <reference path="../../../references.d.ts" />
import GraphContracts = require("../GraphContracts");

export class Line {
    public static DEFAULT_THICKNESS = 2;
    public start: KnockoutObservable<GraphContracts.IPoint> = ko.observable(null);
    public end: KnockoutObservable<GraphContracts.IPoint> = ko.observable(null);
    public thickness: KnockoutObservable<number> = ko.observable(null);
    public visible: KnockoutObservable<boolean> = ko.observable(false);
    public dragging: KnockoutObservable<boolean> = ko.observable(false);
    public zIndex: KnockoutObservable<number> = ko.observable(1);
    public transform: KnockoutObservable<string> = ko.observable(null);

    private style: KnockoutComputed<Object>;

    constructor() {
        this.thickness(Line.DEFAULT_THICKNESS);

        this.style = ko.pureComputed(() => {
            if (!this.visible() || !this.start() || !this.end()) {
                return { display: "none" };
            }

            let x1 = this.start().x, y1 = this.start().y, x2 = this.end().x, y2 = this.end().y;

            let length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            let center: GraphContracts.IPoint = { x: (x1 + x2 - length) / 2, y: (y1 + y2 - this.thickness()) / 2 };
            let theta = Math.atan2(y1 - y2, x1 - x2);
            let transformation = "rotate(" + theta * 180 / Math.PI + "deg)";

            this.transform(transformation);

            return {
                display: "block",
                zIndex: this.zIndex(),
                height: this.thickness() + "px",
                left: center.x + "px",
                top: center.y + "px",
                width: length + "px",
                // Browser-specific
                "-moz-transform": transformation,
                "-webkit-transform": transformation,
                "-o-transform": transformation,
                "-ms-transform": transformation,
                transform: transformation
            };
        });
    }
}

export class Anchor {
    public width: number = 8;
    public height: number = 8;

    public style: KnockoutComputed<Object>;
    public left: KnockoutObservable<number> = ko.observable(0);
    public top: KnockoutObservable<number> = ko.observable(0);

    private parentSubscription: KnockoutSubscription<Object>;

    constructor(location: KnockoutObservable<GraphContracts.IPoint>, zIndex: KnockoutObservable<number>,
                transform: KnockoutObservable<string>, parent: AnchoredLine) {

        this.parentSubscription = ko.computed(() => {
            if (!location()) {
                return;
            }
            this.left(location().x - this.height / 2);
            this.top(location().y - this.height / 2);
        });

        this.style = ko.pureComputed(() => {
            if (!parent.visible() || !location()) {
                return { display: "none" };
            }

            return {
                height: this.height + "px",
                width: this.width + "px",
                left: this.left() + "px",
                top: this.top() + "px",
                zIndex: zIndex(),
                borderLeft: "",
                borderRight: "",
                borderTop: "",
                borderBottom: "",
                display: "block"
            };
        });
    }

    public dispose() {
        this.parentSubscription.dispose();
    }
}

export class Arrow extends Anchor {
    public width: number = 4;

    public style: KnockoutComputed<Object>;
    public isStart: KnockoutObservable<boolean> = ko.observable(false);

    constructor(location: KnockoutObservable<GraphContracts.IPoint>, zIndex: KnockoutObservable<number>,
                transform: KnockoutObservable<string>, parent: AnchoredLine) {
        super(location, zIndex, transform, parent);

        this.style = ko.pureComputed(() => {
            if (!parent.visible() || !location()) {
                return { display: "none" };
            }

            return {
                borderTop: this.width + "px solid transparent",
                borderBottom: this.width + "px solid transparent",
                borderRight: this.isStart() ? "" : this.height + "px solid",
                borderLeft: this.isStart() ? this.height + "px solid" : "",
                left: this.left() + "px",
                top: this.top() + "px",
                zIndex: zIndex(),
                width: 0,
                height: 0,
                // Browser-specific
                "-moz-transform": transform(),
                "-webkit-transform": transform(),
                "-o-transform": transform(),
                "-ms-transform": transform(),
                transform: transform(),
                display: "block"
            };
        });
    }
}

export class AnchoredLine extends Line {
    private startAnchor: KnockoutObservable<Anchor> = ko.observable(null);
    private endAnchor: KnockoutObservable<Arrow> = ko.observable(null);

    constructor(isCycle: KnockoutObservable<boolean> = null) {
        super();

        this.startAnchor = ko.pureComputed(() => {
            if (isCycle && isCycle()) {
                let arrow = new Arrow(this.start, this.zIndex, this.transform, this);
                arrow.isStart(true);
                return arrow;
            }
            return new Anchor(this.start, this.zIndex, this.transform, this);
        });

        this.endAnchor(new Arrow(this.end, this.zIndex, this.transform, this));
    }
}
