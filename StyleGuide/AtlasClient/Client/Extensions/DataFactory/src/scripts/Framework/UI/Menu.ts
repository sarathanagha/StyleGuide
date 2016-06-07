// Framework
import Constants = require("../Shared/Constants");
import TypeDeclarations = require("../Shared/TypeDeclarations");
import Disposable = require("../Shared/Disposable");
import Command = require("./Command");

// TODO iannight Known issues:
// a. Tooltip does not show on menu items
export class MenuViewModelBase extends Disposable.ChildDisposable {
    public tooltip: string = "";
    public icon: Object = null;

    // observable list of MenuCommands
    public _commands: KnockoutObservableArray<WinJS.UI.MenuCommand>
    = <KnockoutObservableArray<WinJS.UI.MenuCommand>>(ko.observableArray(null));

    // the WinJS menu object
    public menu: KnockoutObservable<WinJS.UI.Menu> = ko.observable(null);

    // adds a button the menu
    public addMenuButton = (command: Command.EitherCommand): Command.MenuCommand => {
        let button = new Command.Button(this._lifetimeManager, command);

        let menuCommand = button.menuCommand();

        this._commands.push(menuCommand);

        return menuCommand;
    };

    // adds the menu as a dropdown to a button
    public addDropdownButton = (menuButton: Command.AppBarCommand) => {
        $(menuButton.element).addClass(Constants.CSS.menuButtonClass);
        $(this.menu().element).addClass(Constants.CSS.dropdownMenuClass);

        let menuButtonClicked = (event: Event) => {
            let handler = (_event: Event) => {
                $(menuButton.element).removeClass(Constants.CSS.hoveredClass);
                this.menu().removeEventListener("beforehide", handler);
            };

            // remove our class
            this.menu().addEventListener("beforehide", handler);

            // show hovered behavior while the menu is open
            $(menuButton.element).addClass(Constants.CSS.hoveredClass);

            this.showMenu(menuButton.element);
        };

        menuButton._command.onclick(menuButtonClicked);

        return menuButton;
    };

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, element: HTMLElement) {
        super(lifetimeManager);

        element.setAttribute("data-win-control", "WinJS.UI.Menu");

        WinJS.UI.processAll(element).then(() => {
            this.menu(element.winControl);
        });
    }

    // given an anchor element, show the menu
    public showMenu(anchor: HTMLElement, type = "bottom") {
        this.menu().commands = this._commands();
        this.menu().show(anchor, type);
    }
}
