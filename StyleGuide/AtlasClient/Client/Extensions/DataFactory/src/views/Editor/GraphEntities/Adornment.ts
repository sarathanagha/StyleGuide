/// <reference path="../../../references.d.ts" />
import Includes = require("./Includes");
import Framework = require("../../../_generated/Framework");

export interface IAdornmentNode extends Includes.INode {
    active: KnockoutObservable<boolean>;
    adornments: KnockoutObservableArray<Adornment>;
    visible: KnockoutObservable<boolean>;
    isConnecting: KnockoutObservable<boolean>;
}

export class Adornment extends Framework.Disposable.ChildDisposable {
    protected static X_OFFSET: number = 9;
    protected static Y_OFFSET: number = 5;
    protected static DEFAULT_WIDTH: number = 24;
    protected static DEFAULT_HEIGHT: number = 16;

    public parent: IAdornmentNode;

    // applied to the parent
    public parentUIConfig: Object = {};

    public y: KnockoutComputed<number>;
    public x: KnockoutComputed<number>;
    public location: KnockoutObservable<Includes.GraphContracts.IPoint> = ko.observable(null);
    public width: KnockoutObservable<number>;
    public height: KnockoutObservable<number>;
    // is ignored when the parent is not visible
    public visible: KnockoutObservable<boolean> = ko.observable(true);

    public onClick: KnockoutObservable<(node: IAdornmentNode, event: MouseEvent) => void> = ko.observable($.noop);

    // template to be bound with the instantiated Adornment
    protected template: string = "<div></div>";
    protected displayClasses: KnockoutComputed<string> = null;

    protected handleEvent = (handler: KnockoutObservable<Includes.NodeUIEventHandler>) => {
        return (event: Event, ui) => {
            event.stopPropagation();

            handler()(this.parent, event, ui);

            return false;
        };
    };

    /* tslint:disable:no-unused-variable Used in the template */
    protected tooltip: KnockoutObservable<string> = ko.observable("");
    /* tslint:enable:no-unused-variable */

    private _visible: KnockoutComputed<boolean>;
    private _style: KnockoutComputed<Object>;
    private _styleSubscription: KnockoutSubscription<Object> = null;
    private style: KnockoutObservable<Object> = ko.observable();

    constructor(parent: IAdornmentNode) {
        super(parent._lifetimeManager);
        this.parent = parent;

        this.width = ko.observable(Adornment.DEFAULT_WIDTH);

        this.height = ko.observable(Adornment.DEFAULT_HEIGHT);

        this._alignLeft();

        this._alignBottom();

        this._visible = ko.pureComputed(() => {
            return this.parent.visible() && this.visible();
        });

        this._calculateStyle();

        this.parent.adornments.push(this);
    }

    // Utility functions for child classes
    protected _centerHorizontally() {
        this.x = ko.pureComputed(() => {
            return this.parent.location().x + (this.parent.width() - this.width()) / 2;
        });
    }

    protected _centerVertically() {
        this.y = ko.pureComputed(() => {
            return this.parent.location().y + this.parent.height() / 2;
        });
    }

    protected _alignTop(offset: number = Adornment.Y_OFFSET) {
        this.y = ko.pureComputed(() => {
            return this.parent.location().y + offset;
        });
    }

    protected _alignBottom(offset: number = Adornment.Y_OFFSET) {
        this.y = ko.pureComputed(() => {
            return this.parent.location().y + this.parent.height() - this.height() - offset;
        });
    }

    protected _alignLeft(offset: number = Adornment.X_OFFSET) {
        this.x = ko.pureComputed(() => {
            return this.parent.location().x + offset;
        });
    }

    protected _alignRight(offset: number = Adornment.X_OFFSET) {
        this.x = ko.pureComputed(() => {
            return this.parent.location().x + this.parent.width() - this.width() - offset;
        });
    }

    // should be called when any of the style computed are reassigned
    protected _calculateStyle() {
        if (this._styleSubscription) {
            this._styleSubscription.dispose();
        }

        this._style = ko.pureComputed(() => {
            return {
                display: this._visible() ? "block" : "none",
                zIndex: this.parent.zIndex() + 1,
                width: this.width() + "px",
                height: this.height() + "px",
                left: (this.x()) + "px",
                top: (this.y()) + "px",
                position: "absolute"
            };
        });

        this.style(this._style);

        this._styleSubscription = this._style.subscribe((style) => {
            this.style(style);
        });
    }

    /* tslint:disable:no-unused-variable Used in the template */
    private _onClick(ignore, event: MouseEvent) {
        event.stopPropagation();

        this.onClick()(this.parent, event);

        return false;
    }
    /* tslint:enable:no-unused-variable */
}

export class IconAdornment extends Adornment {
    public icon: KnockoutObservable<string> = ko.observable("");

    protected template: string = "<div data-bind='html: icon, style: style'></div>";

    constructor(parent: IAdornmentNode) {
        super(parent);
    }
}
