/// <amd-dependency path="text!./Templates/Barberpole.html" />
import AppContext = require("../../../../scripts/AppContext");
import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
import Framework = require("../../../../_generated/Framework");
import IconResources = Framework.IconResources;
import PipelineModel = require("../../../../scripts/Framework/Model/Contracts/Pipeline");

/**
 * Extension view model for a pipeline
 */
export class BasePipelineExtensionViewModel extends Framework.Disposable.ChildDisposable {
    // graph node styling
    public icon = IconResources.Icons.graphPipelineIcon;
    public activityCount: number;
    public pipelineName: KnockoutObservable<string>;
    public pipelineStatus: KnockoutObservable<string>;
    public pipelineStatusImage: KnockoutObservable<Object>;
    public statusClasses: KnockoutObservable<string>;
    public barberPole: string = require("text!./Templates/Barberpole.html");
    public assetText: string = ClientResources.lowerPluralActivityAssetText;
    public subheader: string = ClientResources.pipelineSubheader;
    public activePeriodStatus: KnockoutObservable<string>;
    public toolbar: Framework.Toolbar.ToolbarViewModelBase;
    public highlighted: KnockoutObservable<boolean>;

    // used for button
    public makingRequest = ko.observable(false);

    // options for the resume button
    private _resumeCommand: Framework.Command.ObservableCommand;
    // options for the pause button
    private _pauseCommand: Framework.Command.ObservableCommand;
    // options for cancel
    private _cancelCommand: Framework.Command.ObservableCommand;

    // data model
    private _pipeline: MdpExtension.DataModels.BatchPipeline;
    private _appContext = AppContext.AppContext.getInstance();

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, pipeline: MdpExtension.DataModels.BatchPipeline) {
        super(lifetimeManager);

        this._pipeline = pipeline;

        let barberpole = $("<div>" + this.barberPole + "</div>");
        // 24 lines in the pole (20 to fill the bar, 4 to mask the animation]
        ko.applyBindings({rows: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, barberpole[0]);
        this.barberPole = barberpole.html();

        this._resumeCommand = new Framework.Command.ObservableCommand({
            icon: Framework.Svg.resume,
            onclick: this._resumeHandler,
            name: "resume",
            tooltip: ClientResources.resumeSingletonPipelineTooltip
        });

        this._resumeCommand.disabled = ko.computed(() => {
            return this.makingRequest() || !this._pipeline.properties().isPaused();
        });

        this._pauseCommand = new Framework.Command.ObservableCommand({
            icon: Framework.Svg.pause,
            onclick: this._pauseHandler,
            name: "pause",
            label: ClientResources.pausePipelineLabel,
            tooltip: ClientResources.pauseSingletonPipelineTooltip
        });

        this._pauseCommand.disabled = ko.computed(() => {
            return this.makingRequest() || this._pipeline.properties().isPaused();
        });

        this._cancelCommand = new Framework.Command.ObservableCommand({
            icon: Framework.Svg.stop,
            onclick: this._cancelHandler,
            name: "cancel",
            tooltip: ClientResources.cancelSingletonPipelineTooltip,
            label: ClientResources.cancelPipelineLabel
        });

        this._cancelCommand.disabled = ko.computed(() => {
            return this.makingRequest() || this._pipeline.properties().isPaused();
        });

        this.toolbar = new Framework.Toolbar.ToolbarViewModelBase(this._lifetimeManager);
        this.toolbar.addButton(this._resumeCommand);
        this.toolbar.addButton(this._pauseCommand);
        this.toolbar.addButton(this._cancelCommand);

        this.statusClasses = ko.computed(() => {
            return PipelineModel.getPipelineStatus(this._pipeline.properties().provisioningState(), this._pipeline.properties().isPaused());
        });

        this.pipelineName = this._pipeline.name;

        this.activityCount = pipeline.properties().activities().length;

        this.pipelineStatusImage = ko.computed(() => {
            return this.statusClasses() === PipelineModel.PipelineStatusName.active ? this.barberPole : null;
        });

        this.pipelineStatus = ko.computed(() => {
            return PipelineModel.PipelineStatusDisplayName[this.statusClasses()];
        });

        this.activePeriodStatus = ko.computed(() => {
            // TODO iannight: the data model doesn't give us this info
            // but it's where things like "ACTIVE PERIOD NOT SET" will go

            return "";
        });
    }

    private _pauseHandler = () => {
        this._appContext.dialogHandler.okayCancelRequest(ClientResources.pausePipelineTitle,
            ClientResources.pausePipelineQuestionTemplate.format(this._pipeline.name()), () => {
                this.makingRequest(true);

                let splitFactoryId = this._appContext.splitFactoryId();
                let promise = this._appContext.armService.pausePipeline({
                    subscriptionId: splitFactoryId.subscriptionId,
                    resourceGroupName: splitFactoryId.resourceGroupName,
                    factoryName: splitFactoryId.dataFactoryName,
                    pipelineName: this._pipeline.name()
                }, {});

                promise.done(() => {
                    this._pipeline.properties().isPaused(true);
                });

                promise.fin(() => {
                    this.makingRequest(false);
                });
            });
    };

    private _cancelHandler = () => {
        this._appContext.dialogHandler.okayCancelRequest(ClientResources.cancelPipelineTitle,
            ClientResources.cancelPipelineQuestionTemplate.format(this._pipeline.name()), () => {
                this.makingRequest(true);

                let splitFactoryId = this._appContext.splitFactoryId();
                let promise = this._appContext.armService.pausePipeline({
                    subscriptionId: splitFactoryId.subscriptionId,
                    resourceGroupName: splitFactoryId.resourceGroupName,
                    factoryName: splitFactoryId.dataFactoryName,
                    pipelineName: this._pipeline.name()
                }, {
                        terminateExecutions: true
                    });

                promise.done(() => {
                    this._pipeline.properties().isPaused(true);
                });

                promise.fin(() => {
                    this.makingRequest(false);
                });
            });
    };

    private _resumeHandler = () => {
        this._appContext.dialogHandler.okayCancelRequest(ClientResources.resumePipelineTitle,
            ClientResources.resumePipelineQuestionTemplate.format(this._pipeline.name()), () => {
                this.makingRequest(true);

                let splitFactoryId = this._appContext.splitFactoryId();
                let promise = this._appContext.armService.resumePipeline({
                    subscriptionId: splitFactoryId.subscriptionId,
                    resourceGroupName: splitFactoryId.resourceGroupName,
                    factoryName: splitFactoryId.dataFactoryName,
                    pipelineName: this._pipeline.name()
                });

                promise.done(() => {
                    this._pipeline.properties().isPaused(false);
                });

                promise.fin(() => {
                    this.makingRequest(false);
                });
            });
    };
}
