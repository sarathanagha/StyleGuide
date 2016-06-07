// Framework
import Menu = require("./Menu");
import Command = require("./Command");
import Constants = require("../Shared/Constants");
import Disposable = require("../Shared/Disposable");
import TypeDeclarations = require("../Shared/TypeDeclarations");

// TODO paverma Known issues:
// a. Tooltip does not shows up on disabled commands.
// b. DiagramToolbar in reduced space gets the "...", but the content inside it is messed up.

export class ToolbarViewModelBase extends Disposable.ChildDisposable {
    public _dataArray: WinJS.Binding.List<WinJS.UI.AppBarCommand> = new WinJS.Binding.List<WinJS.UI.AppBarCommand>();

    public static removeDropdownMenuFromButton(button: Command.AppBarCommand) {
        $(button.element).removeClass(Constants.CSS.dropdownMenuClass);
    }

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, namespace: string = null) {
        super(lifetimeManager);

        if (namespace !== null) {
            WinJS.Namespace.define(namespace, <DataFactory.WinJSExtensions.DiagramToolbar>{
                commandList: this._dataArray
            });
        }
    }

    // add a generic button to the toolbar
    public addButton(command: Command.EitherCommand): Command.AppBarCommand {
        let button = new Command.Button(this._lifetimeManager, command).appBarCommand();
        this._lifetimeManager.registerForDispose(button);

        this._dataArray.push(button);

        return button;
    }

    // add a button that toggles a boolean observable
    public addToggleButton(command: Command.EitherCommand, observable: KnockoutObservable<boolean>): Command.AppBarCommand {
        let button = new Command.Button(this._lifetimeManager, command);
        this._lifetimeManager.registerForDispose(button);

        button._command.buttonType("toggle");

        let appBarCommand = button.appBarCommand();

        button._command.onclick(() => {
            observable(appBarCommand.selected);
        });

        this._dataArray.push(appBarCommand);

        return appBarCommand;
    }

    // add a seperator to the toolbar
    public addSeperator() {
        let seperator = new WinJS.UI.AppBarCommand(null, { type: "separator" });
        this._lifetimeManager.registerForDispose(seperator);
        this._dataArray.push(seperator);
    }

    // given a menu viewmodel and a button, add an additional button that will open a menu
    public addMenuButton(command: Command.EitherCommand, menuViewModel: Menu.MenuViewModelBase): void {
        let menuButton = this.addButton(command);

        $(menuViewModel.menu().element).addClass(Constants.CSS.dropdownMenuClass);

        menuButton._command.onclick(() => {
            let handler = (event: Event) => {
                $(menuButton.element).removeClass(Constants.CSS.hoveredClass);
                menuViewModel.menu().removeEventListener("beforehide", handler);
            };

            // remove our class
            menuViewModel.menu().addEventListener("beforehide", handler);

            // show hovered behavior while the menu is open
            $(menuButton.element).addClass(Constants.CSS.hoveredClass);

            // show the menu
            menuViewModel.showMenu(menuButton.element);
        });
    }
}
