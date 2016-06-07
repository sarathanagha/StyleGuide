
module Microsoft.DataStudio.Application.Knockout.Bindings {

    export class ContextMenuBindingHandler implements KnockoutBindingHandler {

        static BindingName = "contextMenu";

        // At any moment at most one instance of context menu will be present. Hence, it is reasonable to have the
        // control as static.
        static contextMenuControl: WinJS.UI.Menu = null;
        static contextMenuPositionElement: HTMLElement = null;

        public init(
            element: HTMLElement,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

            var contextMenuWinJSHostDivSelector = ".contextMenuWinJSHostDiv";
            var contextMenuPositionSelector = ".contextMenuPosition";
            let logger = Application.LoggerFactory.getLogger({ loggerName: "ContextMenuBindingHandler" });

            var contextMenuElement = element.querySelector(contextMenuWinJSHostDivSelector);
            WinJS.UI.processAll(contextMenuElement).then((contextMenuElement: Element) => {
                ContextMenuBindingHandler.contextMenuControl = contextMenuElement.winControl;
                ContextMenuBindingHandler.contextMenuPositionElement = <HTMLElement>element.querySelector(contextMenuPositionSelector);

            },(error: any) => {
                logger.logError("Failed to initialize context menu: ", JSON.stringify(error));
            });

            // To have consistent right-click experience, stop displaying the browser's right click menu.
            var stopDefault = (event: Event) => {
                // TODO paverma Currently WinJS follows the model of making the flyouts/menu go away explicitly, which is quite a
                // different experience for the right click. Consider making the clickeater permeable in case of a context menu.
                if (ContextMenuBindingHandler.contextMenuControl) {
                    ContextMenuBindingHandler.contextMenuControl.hide();
                }
            };
            document.addEventListener("contextmenu", stopDefault);

            let flyoutClickEater =  $("body > section.win-flyoutmenuclickeater");
            let preventContextMenuOnClickEater = (event: Event) => {
                event.preventDefault();
            };
            flyoutClickEater.on("contextmenu", preventContextMenuOnClickEater);

            ko.utils.domNodeDisposal.addDisposeCallback(element,() => {
                if (ContextMenuBindingHandler.contextMenuControl) {
                    ContextMenuBindingHandler.contextMenuControl.dispose();
                }
                document.removeEventListener("contextmenu", stopDefault);
                flyoutClickEater.off("contextmenu", preventContextMenuOnClickEater);
            });

            return { controlsDescendantBindings: true};
        }
    }
}