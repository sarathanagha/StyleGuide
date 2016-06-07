import Framework = require("../_generated/Framework");

interface IWinJSButtonBindingValue {
    options: Framework.Command.ObservableCommand;
    buttonClass?: string;
    menu?: Framework.Menu.MenuViewModelBase;
}

export class WinJSButtonBindingHandler extends Framework.Disposable.RootDisposable implements KnockoutBindingHandler {
    /**
     * Wraps the WinJS Button control in a knockout custom binding.
     */
    public init = (
        element: HTMLElement,
        valueAccessor: () => IWinJSButtonBindingValue,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } => {

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            this._lifetimeManager.dispose();
        });

        return { controlsDescendantBindings: true };
    };

    public update = (
        element: HTMLElement,
        valueAccessor: () => IWinJSButtonBindingValue,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext) => {
        // we make a child button so we can clean it up easily
        let buttonElement: HTMLElement =
            <HTMLElement>($(element).html("<button class='koMainButton'></button>").children()[0]);

        let options: Framework.Command.ObservableCommand = ko.unwrap(valueAccessor().options);

        this._lifetimeManager.dispose();
        this._lifetimeManager = new Framework.Disposable.DisposableLifetimeManager();
        let button = new Framework.Command.Button(this._lifetimeManager, options).appBarCommand(buttonElement);

        // we'll add a dropdown menu if they specify a menu view model
        if (valueAccessor().menu) {
            let menu: Framework.Menu.MenuViewModelBase = ko.unwrap(valueAccessor().menu);
            if (menu) {
                menu.addDropdownButton(button);
            }
        }

        // clean up old classes if we have them
        $(buttonElement).removeClass($(buttonElement).attr("data-buttonClass"));

        if (valueAccessor().buttonClass) {
            // add new classes
            $(buttonElement).addClass(ko.unwrap(valueAccessor().buttonClass));
            $(buttonElement).attr("data-buttonClass", valueAccessor().buttonClass);
        }
    };
}
