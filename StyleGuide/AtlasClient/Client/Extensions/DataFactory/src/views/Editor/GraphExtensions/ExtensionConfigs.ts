import DatasetTool = require("../Wizards/DatasetTool");
import Tables = require("./Tables");
import Framework = require("../../../_generated/Framework");

let logger = Framework.Log.getLogger({
    loggerName: "ExtensionConfigs"
});

export class AddTableCommandGroup implements Microsoft.DataStudio.UxShell.Menu.IContextMenuCommandGroup {
    public commandGroupName: string = "AddTableCommandGroup";

    public commands: WinJS.UI.MenuCommand[] = [];

    private _deferred: Q.Deferred<Tables.TableNode>;

    constructor(isInput: boolean) {
        let addElement = document.createElement("button");
        let addCommand = new WinJS.UI.MenuCommand(addElement, {
            type: "button",
            label: isInput ? ClientResources.addNewInputCommandLabel : ClientResources.addNewOutputCommandLabel,
            onclick: (event) => {
                if (!this._deferred) {
                    logger.logError("Add command not bound. Triggering event: " + JSON.stringify(event));
                    return;
                }

                let entity = DatasetTool.createNewDatasetEntity();
                let dataset = new Tables.TableNode(entity);
                this._deferred.resolve(dataset);
            }
        });

        this.commands.push(addCommand);
    }

    public bindViewModels(): Q.Promise<Tables.TableNode> {
        this._deferred = Q.defer<Tables.TableNode>();

        return this._deferred.promise;
    }

    public unbindViewModels(): void {
        if (this._deferred) {
            this._deferred.reject("viewmodel unbound");
        }

        this._deferred = null;
    }
}
