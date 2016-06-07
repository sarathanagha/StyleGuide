/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./Edit.html" />
/// <amd-dependency path="css!./Edit.css" />
/// <amd-dependency path="text!./Templates/ActivityWindowList.html" name="activityWindowListTemplate" />

/// <amd-dependency path="css!./MsPortalFx.css" />
/// <amd-dependency path="css!../../stylesheets/Base.Images.css" />

/* tslint:disable:no-var-requires */
export let template: string = require("text!./Edit.html");
/* tslint:enable:no-var-requires */

import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");
import ActivityRunsList = require("./ActivityRunsListViewModel");
import ActionToolbar = require("./ActionToolbarViewModel");
import NavToolbar = require("./NavToolbar");
import DiagramWidget = require("./DataFactory/Diagram/DiagramWidget");
import Log = require("../../scripts/Framework/Util/Log");
import StartEndTimePickerViewModel = require("./StartEndTimePickerViewModel");
import RoutingHandler = require("../../scripts/Handlers/RoutingHandler");
import WinJSKnockoutBindings = require("../../bootstrapper/WinJSKnockoutBindings");
import PipelineModel = require("../../scripts/Framework/Model/Contracts/Pipeline");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");

let activityWindowListTemplate: string;

let logger = Log.getLogger({
    loggerName: "EditView"
});

/* tslint:disable:class-name */
export class viewModel extends Framework.Disposable.RootDisposable {
    /* tslint:enable:class-name */

    public static viewName: string = "Edit";
    public splitterKey: string = "adf-splitter-position";
    public startEndPicker: StartEndTimePickerViewModel.StartEndTimePickerViewModel = null;
    public diagramLayoutStatus: KnockoutComputed<string> = null;
    public diagramLoading: KnockoutComputed<Framework.Loader.LoadingState> = null;
    public breadcrumbs: Framework.Breadcrumbs.Breadcrumbs = null;
    public navToolbar: NavToolbar.NavToolbarViewModel = null;
    public actionToolbar: ActionToolbar.ActionToolbarViewModel = null;
    public monitoringListViews: WinJSKnockoutBindings.IWinJSPivotValueAccessor = null;
    public hideDiagramWidget: KnockoutObservable<boolean> = null;
    public expandActivityWindowsList: KnockoutObservable<boolean> = null;
    public nextScheduledRunText: KnockoutObservable<string> = null;
    public _routingHandlerSubscription: RoutingHandler.IRoutingHandlerSubscription = null;
    public moveSplitter = () => {
        this.expandActivityWindowsList(!this.expandActivityWindowsList);
    };

    private _appContext: AppContext.AppContext = null;
    private _diagramWidget: DiagramWidget.DiagramWidget = null;
    private _activityRunsListViewModel: ActivityRunsList.ActivityRunsListViewModel = null;
    private _pipelineEntityView: Framework.DataCache.DataCacheView<MdpExtension.DataModels.BatchPipeline, ArmService.IPipelineResourceBaseUrlParams, void> = null;

    constructor(params) {
        super();
        logger.logInfo("Loading view: Edit");

        this._appContext = AppContext.AppContext.getInstance();

        let inputs = {
            factoryId: this._appContext.factoryId()
        };

        this._diagramWidget = new DiagramWidget.DiagramWidget(this._lifetimeManager, $("#adfDiagram"));
        this._diagramWidget.diagramViewModel.onInputsSet(inputs);
        this.hideDiagramWidget = ko.observable(false);
        this.expandActivityWindowsList = ko.observable(false);
        this.expandActivityWindowsList.extend({ notify:"always" });

        // TODO we should not substitute this viewmodel with activityRunsViewModel.
        // Consider create activityRunsList ko.component so it can be reused by multiple views.
        // DesignPanel is a container for other controls (ko.components)

        // TODO Ideally viewmodel should not know about it's views. Markup manipulations in VM make very easy to break things.
        // TODO Consider use of data-bind, so binding handlers know what is the element to fill data in.
        logger.logDebug("Binding view model for WinJS list.");
        this._activityRunsListViewModel = new ActivityRunsList.ActivityRunsListViewModel(this._lifetimeManager, ko.observable(null));

        // Pivot has nice swipe away animation, but we are disabling it because the animation with hiding diagram widget is quite ugly.
        this.monitoringListViews = {
            pivotItems: [
                {
                    options: {
                        header: ClientResources.activityWindowListTitle
                    },
                    viewModel: this._activityRunsListViewModel,
                    template: activityWindowListTemplate
                }
            ]
        };

        logger.logDebug("Binding view model for WinJs Toolbar.");
        this.actionToolbar = new ActionToolbar.ActionToolbarViewModel(this._lifetimeManager, $("#adf-toolbarMenu")[0]);

        this.navToolbar = new NavToolbar.NavToolbarViewModel(this._lifetimeManager);

        // TODO iannight: fix this once we poll
        this.actionToolbar.diagramModel = this._diagramWidget.diagramViewModel._diagramModel;
        this.actionToolbar.diagramViewModel = this._diagramWidget.diagramViewModel;

        this.actionToolbar.onInputsSet(inputs);

        let startEndPickerElement = $(".adf-startEndPickerHolder")[0];
        this.startEndPicker = new StartEndTimePickerViewModel.StartEndTimePickerViewModel(this._lifetimeManager, startEndPickerElement);

        this.diagramLayoutStatus = this._diagramWidget.diagramViewModel.layoutStatus;
        this.diagramLoading = ko.pureComputed(() => {
            return this._diagramWidget.diagramViewModel.loading() ? Framework.Loader.LoadingState.Loading : Framework.Loader.LoadingState.Ready;
        });

        // setup breadcrumbs for the view, and pipeline's nextScheduledRun text.
        this.breadcrumbs = new Framework.Breadcrumbs.Breadcrumbs();
        this.breadcrumbs.addBreadcrumb({
            displayText: this._appContext.splitFactoryId().dataFactoryName,
            nodeClickedCallback: () => {
                let newUrlParams: StringMap<string> = {};
                newUrlParams[RoutingHandler.urlKeywords.pipeline.value] = null;
                this._appContext.routingHandler.pushState(viewModel.viewName + "breadcrumbs", newUrlParams);
                this.breadcrumbs.removeNodes(this.breadcrumbs.length - 1);
                return null;
            }
        }, 0);

        this._pipelineEntityView = this._appContext.armDataFactoryCache.pipelineCacheObject.createView(false);
        this.nextScheduledRunText = ko.observable<string>(null);
        let nextScheduledPipelineRunSubscription: Framework.Disposable.IDisposable = null;
        this._routingHandlerSubscription = {
            name: viewModel.viewName,
            callback: (message) => {
                let pipelineName = message[RoutingHandler.urlKeywords.pipeline.value];
                const piplineNodeIndex = 1;
                if (pipelineName) {
                    this.breadcrumbs.addBreadcrumb({
                        displayText: pipelineName,
                        nodeClickedCallback: () => {
                            let newUrlParams: StringMap<string> = {};
                            newUrlParams[RoutingHandler.urlKeywords.pipeline.value] = pipelineName;
                            this._appContext.routingHandler.pushState(viewModel.viewName, newUrlParams);
                            return null;
                        }
                    }, piplineNodeIndex);
                } else {
                    this.breadcrumbs.removeNodes(this.breadcrumbs.length - piplineNodeIndex);
                }

                if (pipelineName) {
                    let splitFactoryId = this._appContext.splitFactoryId();
                    this._pipelineEntityView.fetch({
                        subscriptionId: splitFactoryId.subscriptionId,
                        resourceGroupName: splitFactoryId.resourceGroupName,
                        factoryName: splitFactoryId.dataFactoryName,
                        pipelineName: pipelineName
                    }).fail((reason) => {
                        logger.logError("Failed to fetch pipeline object for pipeline {0} in factory {1}. Reason: {2}".format(pipelineName, splitFactoryId.dataFactoryName,
                            JSON.stringify(reason)));
                        this.nextScheduledRunText(null);
                    });
                    if (nextScheduledPipelineRunSubscription) {
                        nextScheduledPipelineRunSubscription.dispose();
                    }
                    nextScheduledPipelineRunSubscription = this._pipelineEntityView.items.subscribe((pipeline) => {
                        if (pipeline) {
                            let nextScheduledRun = PipelineModel.getNextScheduledWindowTime(pipeline, new Date());
                            if (nextScheduledRun) {
                                this.nextScheduledRunText(ClientResources.nextScheduledRunText.format(Framework.Datetime.fullDateWithTimezone.format(nextScheduledRun.getTime())));
                            } else {
                                this.nextScheduledRunText(ClientResources.noScheduledRunText);
                            }
                        } else {
                            this.nextScheduledRunText(null);
                        }
                    });
                    this._lifetimeManager.registerForDispose(nextScheduledPipelineRunSubscription);

                } else {
                    this.nextScheduledRunText(null);
                }
            }
        };
        this._routingHandlerSubscription.callback(this._appContext.routingHandler.getState());
        this._appContext.routingHandler.register(this._routingHandlerSubscription);

        logger.logInfo("Finished loading view: Edit");
    }

    public dispose(): void {
        this._lifetimeManager.dispose();
        this._appContext.routingHandler.unregister(this._routingHandlerSubscription);
    }
}
