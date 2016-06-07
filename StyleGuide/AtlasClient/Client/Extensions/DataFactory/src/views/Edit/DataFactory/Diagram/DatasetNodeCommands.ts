/* tslint:disable:no-unused-variable as we use it to import Graph */
import DiagramModuleDeclarations = require("./DiagramModuleDeclarations");
/* tslint:enable:no-unused-variable */
import Graph = DiagramModuleDeclarations.Controls.Visualization.Graph;
import AppContext = require("../../../../scripts/AppContext");
import Log = require("../../../../scripts/Framework/Util/Log");
import Framework = require("../../../../_generated/Framework");

let logger = Log.getLogger({
    loggerName: "DatasetNodeCommands"
});

export class DatasetNodeCommandGroup implements Microsoft.DataStudio.UxShell.Menu.IContextMenuCommandGroup {
    static className = "DataFactory.Diagram.DatasetNodeCommands";
    public commandGroupName: string = DatasetNodeCommandGroup.className;
    public commands: WinJS.UI.MenuCommand[] = [];
    private _graphEntityViewModel: Graph.GraphEntityViewModel = null;
    private _appContext = AppContext.AppContext.getInstance();

    constructor() {
        this._addCreateAlertOnDatasetCommand();
    }

    public bindViewModels(graphEntityViewModel: Graph.GraphEntityViewModel): void {
        this._graphEntityViewModel = graphEntityViewModel;
    }

    public unbindViewModels(): void {
        this._graphEntityViewModel = null;
    }

    private _addCreateAlertOnDatasetCommand(): void {
        let createAlertOnDatasetElement = document.createElement("button");
        let createAlertOnDatasetCommand = new WinJS.UI.MenuCommand(createAlertOnDatasetElement, {
            type: "button",
            label: ClientResources.createAlertText,
            onclick: () => {
                if (!this._graphEntityViewModel) {
                    logger.logError("No viewModel bound to the openDatasetCommand");
                }
                let listeners: string[] = [Framework.DataConstants.alertExplorerViewModel];
                this._appContext.stringMessageHandler.pushState(Framework.DataConstants.datasetNodeCommands, "Create alert", listeners);
            }
        });
        this.commands.push(createAlertOnDatasetCommand);
    }
}
