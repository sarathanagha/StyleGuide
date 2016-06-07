/* tslint:disable:no-unused-variable */
import DiagramModuleDeclarations = require("./DiagramModuleDeclarations");
/* tslint:enable:no-unused-variable */
import AppContext = require("../../../../scripts/AppContext");
import DiagramContract = require("../../../../scripts/Framework/Model/Contracts/Diagram");
import Log = require("../../../../scripts/Framework/Util/Log");

let logger = Log.getLogger({
    loggerName: "PipelineNodeCommands"
});
import Graph = DiagramModuleDeclarations.Controls.Visualization.Graph;

export class PipelineNodeCommandGroup implements Microsoft.DataStudio.UxShell.Menu.IContextMenuCommandGroup {
    static className = "DataFactory.Diagram.PipelineNodeCommands";
    public commandGroupName: string = PipelineNodeCommandGroup.className;
    public commands: WinJS.UI.MenuCommand[] = [];
    private _graphEntityViewModel: Graph.GraphEntityViewModel = null;
    private _appContext = AppContext.AppContext.getInstance();

    constructor() {
        this._addOpenPipelineCommand();
    }

    public bindViewModels(graphEntityViewModel: Graph.GraphEntityViewModel): void {
        this._graphEntityViewModel = graphEntityViewModel;
    }

    public unbindViewModels(): void {
        this._graphEntityViewModel = null;
    }

    private _addOpenPipelineCommand(): void {
        let openPipelineElement = document.createElement("button");
        let openPipelineCommand = new WinJS.UI.MenuCommand(openPipelineElement, {
            type: "button",
            label: ClientResources.openPipelineCommandText,
            onclick: () => {
                if (!this._graphEntityViewModel) {
                    logger.logError("PipelineNodeCommands: No viewModel bound to the openPipelineCommand");
                }
                this._appContext.diagramContext({
                    diagramMode: DiagramContract.DiagramMode.OpenPipeline,
                    diagramModeParameters: {
                        pipelineId: this._graphEntityViewModel.entity.id()
                    }
                });
            }
        });
        this.commands.push(openPipelineCommand);
    }
}
