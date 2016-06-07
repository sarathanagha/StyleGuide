import {AppContext} from "../../scripts/AppContext";

export class EditorCommandBar {
    public pipelineName: KnockoutObservable<string>;

    public deployText: KnockoutObservable<string> = ko.observable(ClientResources.deployLabel);

    public deployClicked = () => {
        this.deployText("Deploying...");

        // TODO iannight this should only be enabled after validation
        AppContext.getInstance().authoringEntityDeployer.deploy().then(() => {
            this.deployText("Deployment completed!");
        }, () => {
            this.deployText("Deployment failed!");
        });
    };

    private _appContext: AppContext;

    constructor() {
        this._appContext = AppContext.getInstance();
        this.pipelineName = this._appContext.authoringPipelineProperties.name;
    }
}
