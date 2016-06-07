import Disposable = require("../Shared/Disposable");

export interface ICommand {
    tooltip?: string;
    onclick?: (event: Event) => void;
    disabled?: boolean;
    icon?: string;
    name?: string;
    label?: string;
    buttonType?: string;
    selected?: boolean;
}

export interface IIbizaIconEnabled {
    element: HTMLElement;
    ibizaIcon: KnockoutObservable<string>;
}

export class ObservableCommand extends Disposable.RootDisposable {
    public tooltip: KnockoutObservable<string> = ko.observable(null);
    public onclick: KnockoutObservable<(event: Event) => void> = ko.observable(null);
    public disabled: KnockoutObservable<boolean> = ko.observable(false);
    public selected: KnockoutObservable<boolean> = ko.observable(false);
    public icon: KnockoutObservable<string> = ko.observable(null);
    public name: KnockoutObservable<string> = ko.observable(null);
    public label: KnockoutObservable<string> = ko.observable(null);
    public buttonType: KnockoutObservable<string> = ko.observable("button");

    constructor(command: ICommand) {
        super();

        if (command.tooltip) {
            this.tooltip(command.tooltip);
        }

        if (command.onclick) {
            this.onclick(command.onclick);
        }

        if (command.disabled) {
            this.disabled(command.disabled);
        }

        if (command.icon) {
            this.icon(command.icon);
        }

        if (command.name) {
            this.name(command.name);
        }

        if (command.label) {
            this.label(command.label);
        }

        if (command.buttonType) {
            this.buttonType(command.buttonType);
        }

        if (command.selected) {
            this.selected(command.selected);
        }
    }
}

export type EitherCommand = ICommand | ObservableCommand;

export interface ISelfUpdating {
    // changed when the UI object has been updated
    updated: KnockoutObservable<boolean>;

    // underlying command representation
    _command: ObservableCommand;

    // actual DOM object
    element: HTMLElement;
}

export class AppBarCommand extends WinJS.UI.AppBarCommand implements IIbizaIconEnabled, ISelfUpdating {
    public ibizaIcon = ko.observable(null);
    public updated = ko.observable(null).extend({ notify: "always" });
    public _command: ObservableCommand;
}

export class MenuCommand extends WinJS.UI.MenuCommand implements ISelfUpdating {
    public updated = ko.observable(null).extend({ notify: "always" });
    public _command: ObservableCommand;
}

export class Button extends Disposable.ChildDisposable {
    public _command: ObservableCommand;

    public static removeCSS(element: JQuery) {
        element.find("[fill]").attr("class", "svg-fill").removeAttr("fill");
        element.find("[stroke]").attr("class", "svg-stroke").removeAttr("stroke");
        return element[0].outerHTML || $("<div></div>").append(element).html();
    }

    // stops mouse move events from being propagated
    // so the button behaves as expected
    private static _captureMouseEvent(buttonElement: HTMLElement) {
        let handler = (event) => {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.cancelBubble = true;
        };

        buttonElement.onmousedown = handler;
        buttonElement.onmousemove = handler;
        buttonElement.onmouseleave = handler;
    }

    constructor(lifetimeManager: Disposable.IDisposableLifetimeManager, command: EitherCommand) {
        super(lifetimeManager);

        if (command instanceof ObservableCommand) {
            this._command = <ObservableCommand>command;
        } else {
            this._command = new ObservableCommand(<ICommand>command);
        }
    }

    public menuCommand(element: HTMLElement = null): MenuCommand {
        let button = new MenuCommand(element, {
            disabled: this._command.disabled(),
            onclick: this._command.onclick(),
            label: this._command.label(),
            type: this._command.buttonType(),
            tooltip: null
        });

        button._command = this._command;

        this._syncObservables(button);
        this._syncObservableProperty(button, "tooltip");

        return button;
    }

    public appBarCommand(element: HTMLElement = null): AppBarCommand {
        let button = new AppBarCommand(element, {
            disabled: this._command.disabled(),
            onclick: this._command.onclick(),
            label: this._command.label(),
            type: this._command.buttonType(),
            selected: this._command.selected(),
            tooltip: null
        });

        Button._captureMouseEvent(button.element);

        button._command = this._command;

        this._updateIcon(button);

        this._syncObservables(button);

        this._lifetimeManager.registerForDispose(this._command.icon.subscribe((icon: Object) => {
            this._updateIcon(button);
            button.updated(true);
        }));
        this._lifetimeManager.registerForDispose(button);

        return button;
    }

    // syncs the observables related to a generic button
    private _syncObservables(object: ISelfUpdating) {
        this._syncObservableProperty(object, "label");
        this._syncObservableProperty(object, "onclick");
        this._syncObservableProperty(object, "disabled");
        this._syncObservableProperty(object, "selected");
        this._syncObservableProperty(object, "buttonType", "type");

        this._addTooltip(object);
    }

    // adds a subscription to an observable property so the nonobservable is synced
    private _syncObservableProperty(object: ISelfUpdating, srcProperty: string, destProperty: string = null) {
        if (!destProperty) {
            destProperty = srcProperty;
        }

        let makeSubscription = (_object, _destProperty) => {
            return (value) => {
                // update the property
                _object[_destProperty] = value;

                _object.updated(true);
            };
        };

        this._lifetimeManager.registerForDispose(this._command[srcProperty].subscribe(makeSubscription(object, destProperty)));
    }

    private _addTooltip(object: ISelfUpdating) {
        // Commenting out data-tooltip as they cause clipping issues when the tooltip overflows its parent
        // object.element.setAttribute("data-tooltip", this._command.tooltip());
        object.element.title = this._command.tooltip();

        this._lifetimeManager.registerForDispose(object._command.tooltip.subscribe((value) => {
            // object.element.setAttribute("data-tooltip", value);
            object.element.title = value;

            object.updated(true);
        }));
    }

    private _updateIcon(appBarCommand: AppBarCommand): void {
        // no icon
        if (!this._command.icon()) {
            appBarCommand.icon = null;
            appBarCommand.ibizaIcon(null);
            appBarCommand.element.innerHTML = appBarCommand.label;
            return;
        }

        appBarCommand.element.innerHTML = "";

        // no ibiza icon, just a regular one
        if (typeof this._command.icon() === "string") {
            appBarCommand.element.innerHTML = this._command.icon();
            // remove all inline fills and strokes
            Button.removeCSS($(appBarCommand.element));

            appBarCommand.ibizaIcon(null);
            return;
        }

        // otherwise we have an ibiza icon
        appBarCommand.ibizaIcon(this._command.icon());

        // check if we've already bound it
        if (!$(appBarCommand.element).is("[data-bind]")) {
            appBarCommand.element.setAttribute("data-bind", "image: icon()");
            ko.applyBindings({ icon: appBarCommand.ibizaIcon }, appBarCommand.element);
        }
    }
}
