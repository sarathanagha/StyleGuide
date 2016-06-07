/// <reference path="../../../references.d.ts" />

import Includes = require("./Includes");
import KnockoutExtensions = Includes.KnockoutExtensions;
import GraphContracts = Includes.GraphContracts;
import Port = require("./Port");
import Adornment = require("./Adornment");
import Framework = require("../../../_generated/Framework");

export class Node extends Framework.Disposable.RootDisposable implements Includes.INode, Includes.GraphContracts.IDisposable, Adornment.IAdornmentNode {
    public static BORDER_WIDTH = 3;
    private static MIN_HEIGHT = 65;
    private static MIN_WIDTH = 200;

    // used to have a unique id for every node
    private static lastNodeId = 0;

    public id: KnockoutObservable<string> = ko.observable(null);
    public isConnecting: KnockoutObservable<boolean> = ko.observable(false);
    public isDragging: KnockoutObservable<boolean> = ko.observable(false);
    public active: KnockoutObservable<boolean> = ko.observable(false);
    public extensionTemplate: string = "";
    public extensionViewModel: Object = {};
    public adornments: KnockoutObservableArray<Adornment.Adornment>;
    public edges: KnockoutExtensions.ObservableMap<Port.IEdge> = new KnockoutExtensions.ObservableMap<Port.IEdge>();
    public location: KnockoutObservable<GraphContracts.IPoint> = ko.observable(null);
    public width: KnockoutObservable<number> = ko.observable(0);
    public height: KnockoutObservable<number> = ko.observable(0);
    public selected: KnockoutObservable<boolean> = ko.observable(false);
    public zIndex: KnockoutObservable<number> = ko.observable(1);
    public visible: KnockoutObservable<boolean> = ko.observable(true);

    // Handlers that the container can hook into
    public onDrag: KnockoutObservable<Includes.NodeUIEventHandler> = ko.observable($.noop);
    public onStart: KnockoutObservable<Includes.NodeUIEventHandler> = ko.observable($.noop);
    public onStop: KnockoutObservable<Includes.NodeUIEventHandler> = ko.observable($.noop);

    public clone: () => Node = () => {
        return new Node(this._extensionConfig);
    };

    public edit = (): Q.Promise<GraphContracts.IExtensionPiece[]> => {
        let onEdit = this._extensionConfig.onEdit;
        if (onEdit) {
            return onEdit();
        }
    };

    public onResize = (event: Event, ui) => {
        ui.size.width = Math.max(Node.MIN_WIDTH, ui.size.width);
        ui.size.height = Math.max(Node.MIN_HEIGHT, ui.size.height);

        this.width(ui.size.width);
        this.height(ui.size.height);
    };

    // Creates a generic handler that calls the hook when it's there
    private _handleEvent = (handler: KnockoutObservable<Includes.NodeUIEventHandler>, callback: () => void = $.noop) => {
        return (event: Event, ui) => {
            handler()(this, event, ui);

            callback();
        };
    };

    private combinedUIConfig: KnockoutComputed<Object>;
    private style: KnockoutComputed<Object>;

    private _nodeUIConfig: Object;

    // what was used to create this node
    private _extensionConfig: Includes.GraphContracts.IExtensionConfig;

    constructor(extensionConfig: Includes.GraphContracts.IExtensionConfig, adornments: Adornment.Adornment[] = []) {
        super();

        this._extensionConfig = extensionConfig;
        this.adornments = ko.observableArray([]);

        this.id("node_" + Node.lastNodeId++);
        this.extensionTemplate = extensionConfig.template;
        this.extensionViewModel = extensionConfig.viewModel;

        if (extensionConfig.initialRect) {
            this.width(extensionConfig.initialRect.width);
            this.height(extensionConfig.initialRect.height);
            this.location({ x: extensionConfig.initialRect.x, y: extensionConfig.initialRect.y });
        }

        this.updateStyle();

        this._nodeUIConfig = {
            draggable: {
                containment: Includes.Constants.CONTAINER_SELECTOR, zIndex: 999,
                start: this._handleEvent(this.onStart, () => {
                    this.isDragging(true);
                }),
                stop: this._handleEvent(this.onStop, () => {
                    this.isDragging(false);
                }),
                drag: this._handleEvent(this.onDrag)
            },
            resizable: { resize: this.onResize, aspectRatio: true, handles: "se, ne" }
        };

        this.combinedUIConfig = ko.pureComputed(() => {
            let config = $.extend({}, this._nodeUIConfig);

            this.adornments().forEach((adornment) => {
                $.extend(config, adornment.parentUIConfig);
            });

            return config;
        });
    }

    public dispose() {
        this.edges.forEach((edge) => {
            edge.dispose();
        });
    }

    public updateStyle(): void {
        this.style = ko.pureComputed(() => {
            return {
                display: this.visible() ? "block" : "none",
                height: this.height() + "px",
                width: this.width() + "px",
                left: this.location().x + "px",
                top: this.location().y + "px",
                zIndex: this.zIndex(),
                minWidth: Node.MIN_WIDTH + "px",
                minHeight: Node.MIN_HEIGHT + "px"
            };
        });
    }
}

export class SummaryNode extends Node {
    public expanded: KnockoutObservable<boolean> = ko.observable(false);
    public extensionViewModel: Includes.GraphContracts.ISummaryViewModel;

    constructor(extensionConfig: Includes.GraphContracts.ISummaryExtensionConfig, adornments: Adornment.Adornment[] = []) {
        super(extensionConfig, adornments);
    }
}
