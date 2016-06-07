import AppContext = require("../scripts/AppContext");
import Log = require("../scripts/Framework/Util/Log");
import Framework = require("../_generated/Framework");

let logger = Log.getLogger({
    loggerName: "CopyBinding"
});

export class CopyCommandGroup implements Microsoft.DataStudio.UxShell.Menu.IContextMenuCommandGroup {
    private static invisibleInputClass: string = "adf-invisibleInput";
    public commandGroupName: string = "CopyCommandGroup";
    public commands: WinJS.UI.MenuCommand[] = [];

    private _hostElement: HTMLElement = null;

    public bindViewModels(hostElement: HTMLElement): void {
        this._hostElement = hostElement;
        $(this._hostElement).addClass(Framework.Constants.CSS.copyClass);
    }

    public unbindViewModels(): void {
        $(this._hostElement).removeClass(Framework.Constants.CSS.copyClass);
    }

    public addCopyCommand(copyValue: string = "", label = ClientResources.copy): void {
        let openPipelineElement = document.createElement("button");
        let openPipelineCommand = new WinJS.UI.MenuCommand(openPipelineElement, {
            type: "button",
            label: label,
            onclick: (event) => {
                if (!this._hostElement) {
                    logger.logError("Copy command not bound. Triggering event: " + JSON.stringify(event));
                    return;
                }

                let textArea = document.createElement("textarea");
                textArea.className = CopyCommandGroup.invisibleInputClass;
                textArea.value = copyValue;
                document.body.appendChild(textArea);
                textArea.select();

                let succeeded = Framework.Util.copySelectedText(copyValue);

                document.body.removeChild(textArea);

                if (!succeeded) {
                    // Fallback for when copying isn't supported
                    window.prompt(ClientResources.clipboardFallbackMessage, copyValue);
                } else {
                    // we set a timeout so WinJS doesn't close this flyout when it closes the context menu
                    window.setTimeout(() => {
                        AppContext.AppContext.getInstance().flyoutHandler.addRequest({ anchor: this._hostElement, innerHTML: ClientResources.copySuccessful, timeout: 1000 });
                    });
                }

            }
        });
        this.commands.push(openPipelineCommand);
    }

    public addCreateAlertCommand(): void {
        let createAlertElement = document.createElement("button");
        let createAlertCommand = new WinJS.UI.MenuCommand(createAlertElement, {
            type: "button",
            label: ClientResources.createAlertText,
            onclick: (event) => {
                logger.logDebug("Creating alert from activity window");
                let listeners: string[] = [Framework.DataConstants.alertExplorerViewModel];
                AppContext.AppContext.getInstance().stringMessageHandler.pushState(this.commandGroupName, "Create alert", listeners);
            }
        });

        this.commands.push(createAlertCommand);
    }
}

// Either an array of (label, value) pairs or just a value
export type ICopyBindingValue = { label: string, value: string }[] | string;

export class CopyBindingHandler implements KnockoutBindingHandler {
    public static className: string = "copy";

    public init = (
        element: HTMLElement,
        valueAccessor: () => string,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } => {

        // initialize using the ko library binding
        ko.bindingHandlers["event"].init(element, () => {
            return {
                contextmenu: this._copyHandler(element, ko.unwrap(valueAccessor()))
            };
        },
            allBindingsAccessor, viewModel, bindingContext);

        return { controlsDescendantBindings: false };
    };

    private _copyHandler = (element: HTMLElement, copyValue: ICopyBindingValue) => {
        return (objet, event) => {
            event.stopPropagation();
            event.preventDefault();

            let commandGroup = new CopyCommandGroup();

            if (typeof copyValue === "string") {
                commandGroup.addCopyCommand(copyValue);
            } else {
                copyValue.forEach((pair) => {
                    commandGroup.addCopyCommand(pair.value, pair.label);
                });
            }

            commandGroup.addCreateAlertCommand();

            commandGroup.bindViewModels(element);

            Microsoft.DataStudio.UxShell.Menu.createContextMenu({
                clientX: event.clientX,
                clientY: event.clientY
            }, commandGroup);
        };
    };
}

