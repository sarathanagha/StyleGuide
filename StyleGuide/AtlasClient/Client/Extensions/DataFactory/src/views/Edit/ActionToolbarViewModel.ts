/// <reference path="../../References.d.ts" />
import AppContext = require("../../scripts/AppContext");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import Encodable = require("../../scripts/Framework/Model/Contracts/Encodable");

import Framework = require("../../_generated/Framework");
import TypeDeclarations = require("../../scripts/Framework/Shared/TypeDeclarations");

import DiagramModel = require("./DataFactory/Diagram/DiagramModel");
import DiagramViewModel = require("./DataFactory/Diagram/DiagramViewModel");

let logger = Framework.Log.getLogger({
    loggerName: "ActionToolbarViewModel"
});

export class ActionToolbarViewModel extends Framework.Toolbar.ToolbarViewModelBase {
    public selectionSubscription: MessageHandler.ISelectionSubscription;

    public pauseCommand: Framework.Command.ObservableCommand;
    public cancelCommand: Framework.Command.ObservableCommand;
    public resumeCommand: Framework.Command.ObservableCommand;

    // TODO iannight: fix this once we poll
    public diagramModel: DiagramModel.DiagramModel;
    public diagramViewModel: DiagramViewModel.DiagramViewModel;

    public tableControlsVisible: KnockoutObservable<boolean> = ko.observable(false);
    public activityControlsVisible: KnockoutObservable<boolean> = ko.observable(false);

    // handles active state for buttons
    public makingRequest: KnockoutObservable<boolean> = ko.observable(false);
    public pausedSelected: KnockoutObservable<boolean> = ko.observable(false);
    public runningSelected: KnockoutObservable<boolean> = ko.observable(false);

    // handles the enabling and disabling of buttons as the global selection is changed
    public processSelectionUpdate = (selectedEntities: Encodable.Encodable[]) => {
        let hasPipelines = false;
        let hasTables = false;
        let hasActivities = false;

        this._selectedPipelineIds = {};

        selectedEntities.forEach((encodable: Encodable.Encodable) => {
            switch (encodable.type) {
                case Encodable.EncodableType.PIPELINE:
                    hasPipelines = true;
                    // TODO iannight: fix this once we poll
                    this._selectedPipelineIds[Encodable.createLegacyKeyFromEncodable(encodable)] = true;
                    break;
                case Encodable.EncodableType.TABLE:
                    hasTables = true;
                    break;
                case Encodable.EncodableType.ACTIVITY:
                    hasActivities = true;
                    break;
                case Encodable.EncodableType.ACTIVITY_RUN:
                case Encodable.EncodableType.DATAFACTORY:
                case Encodable.EncodableType.LINKED_SERVICE:
                case Encodable.EncodableType.GATEWAY:
                    break;
                default:
                    logger.logError("Unexpected switch statement value: " + encodable.type);
                    break;
            }
        });

        this.tableControlsVisible(hasTables);
        this.activityControlsVisible(hasActivities);

        this._pipelineSelectionChanged();
    };

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();
    private _pipelines: StringMap<MdpExtension.DataModels.BatchPipeline> = {};
    private _selectedPipelineIds: StringMap<boolean> = {};
    private _selectedSubscriptions: KnockoutSubscription<Object>[] = [];

    private _pauseHandler = () => {
        this._appContext.dialogHandler.okayCancelRequest(ClientResources.pausePipelinesTitle,
            ClientResources.pauseSelectedPipelinesQuestion, () => {
                this.makingRequest(true);

                let splitFactoryId = this._appContext.splitFactoryId();

                let promises = [];

                for (let id in this._selectedPipelineIds) {
                    let pipeline = this._pipelines[id];

                    let promise = this._appContext.armService.pausePipeline({
                        subscriptionId: splitFactoryId.subscriptionId,
                        resourceGroupName: splitFactoryId.resourceGroupName,
                        factoryName: splitFactoryId.dataFactoryName,
                        pipelineName: pipeline.name()
                    }, {});

                    promise.done(this._changePipelineHandler(pipeline, true));

                    promises.push(promise);
                }

                Q.all(promises).fin(() => {
                    this.makingRequest(false);
                });
            });
    };

    private _cancelHandler = () => {
        this._appContext.dialogHandler.okayCancelRequest(ClientResources.cancelPipelinesTitle,
            ClientResources.cancelSelectedPipelinesQuestion, () => {
                this.makingRequest(true);

                let splitFactoryId = this._appContext.splitFactoryId();

                let promises = [];

                for (let id in this._selectedPipelineIds) {
                    let pipeline = this._pipelines[id];

                    let promise = this._appContext.armService.pausePipeline({
                        subscriptionId: splitFactoryId.subscriptionId,
                        resourceGroupName: splitFactoryId.resourceGroupName,
                        factoryName: splitFactoryId.dataFactoryName,
                        pipelineName: pipeline.name()
                    }, { terminateExecutions: true });

                    promise.done(this._changePipelineHandler(pipeline, true));

                    promises.push(promise);
                }

                Q.all(promises).fin(() => {
                    this.makingRequest(false);
                });
            });
    };

    private _resumeHandler = () => {
        this._appContext.dialogHandler.okayCancelRequest(ClientResources.resumePipelinesTitle,
            ClientResources.resumeSelectedPipelinesQuestion, () => {
                this.makingRequest(true);

                let splitFactoryId = this._appContext.splitFactoryId();

                let promises = [];

                for (let id in this._selectedPipelineIds) {
                    let pipeline = this._pipelines[id];

                    let promise = this._appContext.armService.resumePipeline({
                        subscriptionId: splitFactoryId.subscriptionId,
                        resourceGroupName: splitFactoryId.resourceGroupName,
                        factoryName: splitFactoryId.dataFactoryName,
                        pipelineName: pipeline.name()
                    });

                    promise.done(this._changePipelineHandler(pipeline, false));

                    promises.push(promise);
                }

                Q.all(promises).fin(() => {
                    this.makingRequest(false);
                });
            });
    };

    /* Other Event Handlers */

    private _selectedPipelinePropertiesChanged = (ignore = null) => {
        // recalculate
        let pausedSelected = false;

        let runningSelected = false;

        for (let id in this._selectedPipelineIds) {
            if (!(id in this._pipelines)) {
                continue;
            }

            let pipeline = this._pipelines[id];

            if (pipeline.properties().isPaused()) {
                pausedSelected = true;
            } else {
                runningSelected = true;
            }
        }

        this.runningSelected(runningSelected);
        this.pausedSelected(pausedSelected);
    };

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, menuElement: HTMLElement) {
        super(lifetimeManager);

        // TODO iannight: fix this once we poll
        /*
        this._pipelineQueryView = this._appContext.dataFactoryCache.pipelinesCacheObject.createView();

        this._lifetimeManager.registerForDispose(this._pipelineQueryView.items.subscribe(() => {
            let pipelines = this._pipelineQueryView.items();

            pipelines.forEach((pipeline: MdpExtension.DataModels.BatchPipeline) => {
                let id = new PipelineModel.Encodable(pipeline.name()).id;

                if (!(id in this._pipelines)) {
                    this._pipelines[id] = pipeline;
                }
            });
        }));
        */

        // selection-based commands

        this.resumeCommand = new Framework.Command.ObservableCommand({
            tooltip: ClientResources.resumePipelineTooltip,
            onclick: this._resumeHandler,
            icon: Framework.Svg.resume,
            disabled: true,
            name: "Resume"
        });

        let computed = ko.pureComputed(() => {
            return this.makingRequest() || !this.pausedSelected();
        });

        this._lifetimeManager.registerForDispose(computed);

        this.resumeCommand.disabled = computed;

        this.pauseCommand = new Framework.Command.ObservableCommand({
            tooltip: ClientResources.pausePipelineTooltip,
            onclick: this._pauseHandler,
            icon: Framework.Svg.pause,
            disabled: true,
            name: "Pause"
        });

        computed = ko.pureComputed(() => {
            return this.makingRequest() || !this.runningSelected();
        });

        this._lifetimeManager.registerForDispose(computed);

        this.pauseCommand.disabled = computed;

        this.cancelCommand = new Framework.Command.ObservableCommand({
            tooltip: ClientResources.cancelPipelineTooltip,
            onclick: this._cancelHandler,
            icon: Framework.Svg.stop,
            disabled: true,
            name: "Cancel"
        });

        // follows the exact same disabled logic as the pause command
        this.cancelCommand.disabled = computed;

        this.addButton(this.resumeCommand);
        this.addButton(this.pauseCommand);
        this.addButton(this.cancelCommand);

        this.selectionSubscription = {
            name: "MainToolbarViewModel",
            callback: this.processSelectionUpdate
        };

        this._appContext.selectionHandler.register(this.selectionSubscription);
    }

    public onInputsSet(inputs: Object) {
        // TODO iannight: fix this once we poll
        this._lifetimeManager.registerForDispose(this.diagramModel._newDataAvailable.subscribe(() => {
            this._pipelines = this.diagramModel._pipelines;
        }));
        /*
        let fetchPipeline = this._pipelineQueryView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        });
        */
    }

    private _changePipelineHandler(pipeline: MdpExtension.DataModels.BatchPipeline, isPaused: boolean) {
        return () => {
            pipeline.properties().isPaused(isPaused);
        };
    }

    private _pipelineSelectionChanged() {
        // dispose all of the old ones
        this._selectedSubscriptions.forEach((subscription) => {
            subscription.dispose();
        });

        // add all of the new ones
        for (let id in this._selectedPipelineIds) {
            if (!(id in this._pipelines)) {
                continue;
            }

            let subscription = this._pipelines[id].properties().isPaused.subscribe(this._selectedPipelinePropertiesChanged);

            this._selectedSubscriptions.push(subscription);
        }

        // calculate initial values
        this._selectedPipelinePropertiesChanged();
    }
}
