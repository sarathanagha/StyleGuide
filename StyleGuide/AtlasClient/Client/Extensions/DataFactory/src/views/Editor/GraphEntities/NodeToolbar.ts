/// <reference path="../../../references.d.ts" />
/// <amd-dependency path="text!./Templates/NodeToolbar.html" />
/// <amd-dependency path="css!./Templates/NodeToolbar.css" />

import Adornment = require("./Adornment");
import Framework = require("../../../_generated/Framework");

export class NodeToolbar extends Adornment.Adornment {
    private static TOOLBAR_HEIGHT: number = 16;
    private static TOOLBAR_MIN_WIDTH: number = 69;

    // additional padding of 5 is being added here to fix winjs min-width problem. The css added a left -5 to compensate
    private static BUTTON_DEFAULT_WIDTH: number = 25;
    private static BUTTON_SPACING: number = 12;

    public toolbar: Framework.Toolbar.ToolbarViewModelBase;
    public buttonWidth: KnockoutObservable<number> = ko.observable(NodeToolbar.BUTTON_DEFAULT_WIDTH);

    private _width: KnockoutObservable<number>;

    private _updateWidth = () => {
        this._width(Math.max(this.toolbar._dataArray.length * this.buttonWidth() + NodeToolbar.BUTTON_SPACING * (this.toolbar._dataArray.length - 1),
            NodeToolbar.TOOLBAR_MIN_WIDTH));
    };

    constructor(node: Adornment.IAdornmentNode, toolbar: Framework.Toolbar.ToolbarViewModelBase) {
        super(node);
        this._width = ko.observable(node.width());

        this.template = require("text!./Templates/NodeToolbar.html");

        this.toolbar = toolbar;

        this.toolbar._dataArray.addEventListener("iteminserted", this._updateWidth);
        this.toolbar._dataArray.addEventListener("itemremoved", this._updateWidth);
        this._updateWidth();

        this.width = ko.pureComputed(() => {
            return this._width();
        });

        this.height = ko.pureComputed(() => {
            return NodeToolbar.TOOLBAR_HEIGHT;
        });

        this._centerHorizontally();

        this._calculateStyle();

        // we updated the template after the super call
        this.parent.adornments.notifySubscribers();
    }
}

export class UpperRightNodeToolbar extends NodeToolbar {
    constructor(node: Adornment.IAdornmentNode, toolbar: Framework.Toolbar.ToolbarViewModelBase) {
        super(node, toolbar);

        this._alignRight();
        this._alignTop();
    }
}

export class NodeToolbarBase extends Framework.Toolbar.ToolbarViewModelBase {
    public adornment: NodeToolbar;

    protected _node: Adornment.IAdornmentNode;

    protected _handleEvent = (handler: KnockoutObservable<(node: Adornment.IAdornmentNode) => void>) => {
        return () => {
            event.stopPropagation();

            if (handler()) {
                handler()(this._node);
            }

            return false;
        };
    };

    constructor(node: Adornment.IAdornmentNode, lifetimeManager: Framework.TypeDeclarations.DisposableLifetimeManager) {
        super(lifetimeManager);

        this._node = node;
    }
}

export class SummaryNodeToolbar extends NodeToolbarBase {
    public pinned: KnockoutObservable<boolean> = ko.observable(false);

    public onPin: KnockoutObservable<(node: Adornment.IAdornmentNode) => void> = ko.observable(null);
    public pinCommand: Framework.Command.ObservableCommand;

    constructor(node: Adornment.IAdornmentNode, lifetimeManager: Framework.TypeDeclarations.DisposableLifetimeManager) {
        super(node, lifetimeManager);

        this.pinCommand = new Framework.Command.ObservableCommand({
            tooltip: ClientResources.pinCommandText,
            onclick: this._handleEvent(this.onPin),
            buttonType: "toggle"
        });

        this.pinCommand.icon = ko.pureComputed(() => {
            return this.pinned() ? Framework.Svg.pin_on : Framework.Svg.pin_off;
        });

        this.addToggleButton(this.pinCommand, this.pinned);

        this.adornment = new UpperRightNodeToolbar(this._node, this);
    }
}

export class EditorNodeToolbar extends NodeToolbarBase {
    public onDelete: KnockoutObservable<(node: Adornment.IAdornmentNode) => void> = ko.observable(null);
    public onClone: KnockoutObservable<(node: Adornment.IAdornmentNode) => void> = ko.observable(null);
    public onEdit: KnockoutObservable<(node: Adornment.IAdornmentNode) => void> = ko.observable(null);
    public onComment: KnockoutObservable<(node: Adornment.IAdornmentNode) => void> = ko.observable(null);

    public editCommand: Framework.Command.ObservableCommand;
    public cloneCommand: Framework.Command.ObservableCommand;
    public deleteCommand: Framework.Command.ObservableCommand;
    public commentCommand: Framework.Command.ObservableCommand;

    constructor(node: Adornment.IAdornmentNode, lifetimeManager: Framework.TypeDeclarations.DisposableLifetimeManager) {
        super(node, lifetimeManager);

        this.cloneCommand = new Framework.Command.ObservableCommand({
            icon: Framework.Svg.resource_explorer,
            tooltip: ClientResources.clone,
            onclick: this._handleEvent(this.onClone)
        });

        this.editCommand = new Framework.Command.ObservableCommand({
            icon: Framework.Svg.properties,
            tooltip: ClientResources.EditCommand,
            onclick: this._handleEvent(this.onEdit)
        });

        this.deleteCommand = new Framework.Command.ObservableCommand({
            icon: Framework.Svg.del,
            tooltip: ClientResources.deleteCommandText,
            onclick: this._handleEvent(this.onDelete)
        });

        this.commentCommand = new Framework.Command.ObservableCommand({
            icon: Framework.Svg.comment,
            tooltip: ClientResources.commentCommandText,
            onclick: this._handleEvent(this.onComment)
        });

        // add all of the buttons
        [this.editCommand, this.cloneCommand, this.deleteCommand, this.commentCommand].forEach((command) => {
            this.addButton(command);
        });

        this.adornment = new NodeToolbar(this._node, this);
    }
}
