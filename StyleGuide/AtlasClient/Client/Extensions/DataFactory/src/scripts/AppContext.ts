/// <reference path="../References.d.ts" />

import DataConstants = Framework.DataConstants;
import DiagramContracts = require("./Framework/Model/Contracts/Diagram");
import ErrorHandler = require("./Handlers/ErrorHandler");
import Framework = require("../_generated/Framework");
import MessageHandler = require("./Handlers/MessageHandler");
import MonitoringViewHandler = require("./Handlers/MonitoringViewHandler");
import RoutingHandler = require("./Handlers/RoutingHandler");
import Telemetry = Framework.Telemetry;
import WinJSHandlers = require("./Handlers/WinJSHandlers");
import AuthoringHandler = require("./Handlers/AuthoringHandler");

import ActivityWindowCache = require("./Framework/Model/ActivityWindowCache");
import ArmService = require("./Services/AzureResourceManagerService");
import HDInsightArmService = require("./Services/HDInsightArmService");
import InsightService = require("./Services/AzureInsightsService");
import DataFactoryCache = require("./Framework/Model/DataFactoryCache");
import ArmDataFactoryCache = require("./Framework/Model/ArmDataFactoryCache");
import DataFactoryService = require("./Services/DataFactoryService");
import ResourceIdUtil = require("./Framework/Util/ResourceIdUtil");
import Datetime = Framework.Datetime;
import ActivityWindowModel = require("./Framework/Model/Contracts/ActivityWindow");
import AuthoringOverlay = require("../views/Editor/Wizards/AuthoringOverlay");
import AuthoringEntityStore = require("./Framework/Model/Authoring/EntityStore");
import {EntityDeployer} from "./Framework/Model/Authoring/EntityDeployer";
import Encodable = require("./Framework/Model/Contracts/Encodable");
import EntityProperties = require("./Framework/Model/EntityProperties");

import Log = require("./Framework/Util/Log");

"use strict";
let logger = Log.getLogger({
    loggerName: "AppContext"
});

// Instead of implementing singleton pattern everywhere, using this as the method of interaction
// between different viewmodels and objects.
export class AppContext extends Framework.Disposable.RootDisposable {
    public static className = "AppContext";
    private static _instance: AppContext;

    public stringMessageHandler: MessageHandler.MessageHandler<string>;
    public selectionHandler: MessageHandler.SelectionHandler;
    public activityRunUpdateHandler: MessageHandler.ActivityRunUpdateHandler;
    public dialogHandler: WinJSHandlers.DialogHandler;
    public flyoutHandler: WinJSHandlers.FlyoutHandler;
    public calloutHandler: WinJSHandlers.CalloutHandler;
    public errorHandler: ErrorHandler.ErrorHandler;
    public routingHandler: RoutingHandler.RoutingHandler;
    public diagramContext: KnockoutObservable<DiagramContracts.IDiagramContext>;
    public refreshHandler: Framework.Refresh.RefreshHandler;

    public authoringHandler: AuthoringHandler.AuthoringHandler;
    public authoringOverlayHandler: MessageHandler.MessageHandler<AuthoringOverlay.AuthoringOverlay>;
    public authoringEntityStore: AuthoringEntityStore.EntityStore;
    public authoringEntityDeployer: EntityDeployer;

    // TODO paverma Split this into datafactory and Arm service.
    public armService: ArmService.AzureResourceManagerService;
    public hdInsightArmService: HDInsightArmService.HDInsightArmService;
    public insightsService: InsightService.AzureInsightsService;
    public dataFactoryService: DataFactoryService.DataFactoryService;
    public dataFactoryCache: DataFactoryCache.DataFactoryCache;
    public armDataFactoryCache: ArmDataFactoryCache.DataFactoryCache;
    public activityWindowCache: ActivityWindowCache.ActivityWindowCache;

    public spinner: Framework.Spinner.SpinnerViewModel = null;
    public showingDashboard: KnockoutObservable<boolean> = ko.observable(true);
    public factoryId: KnockoutObservable<string> = ko.observable(null);
    public splitFactoryId: KnockoutComputed<ResourceIdUtil.IDataFactoryId>;
    public authoringPipelineProperties: EntityProperties.PipelineProperties;

    public monitoringViewHandler: MonitoringViewHandler.MonitoringViewHandler;
    // This should later get merged into Tim's filter object.
    public dateRange: KnockoutComputed<Datetime.IDateRange> = null;
    public globalActivityWindowFilter: KnockoutComputed<string> = null;

    private _commandGroups: StringMap<Microsoft.DataStudio.UxShell.Menu.IContextMenuCommandGroup> = {};
    private routingHandlerSubscription: RoutingHandler.IRoutingHandlerSubscription = null;

    public static getInstance(): AppContext {
        if (!AppContext._instance) {
            AppContext._instance = new AppContext();
        }
        return AppContext._instance;
    }

    constructor() {
        super();
        logger.logInfo("Begin loading ADF AppContext.");

        this.splitFactoryId = ko.computed(() => {
            let factoryId = this.factoryId();

            if (!factoryId) {
                return null;
            }

            let split = ResourceIdUtil.splitResourceString(factoryId);

            // update our loggers
            let subscriptionData: Microsoft.DataStudio.Diagnostics.Hub.SubscriptionData = {
                subscriptionId: split.subscriptionId,
                resourceGroupName: split.resourceGroupName,
                resourceName: split.dataFactoryName,
                provider: DataConstants.DataFactoryProvider
            };

            Microsoft.DataStudio.Diagnostics.Hub.DiagnosticsHub.configureSusbscription(subscriptionData);

            // actually return the split id
            return split;
        });

        this.diagramContext = ko.observable<DiagramContracts.IDiagramContext>({
            diagramMode: DiagramContracts.DiagramMode.Factory,
            diagramModeParameters: null
        });

        // the services depend on this
        this.spinner = new Framework.Spinner.SpinnerViewModel();
        this.refreshHandler = new Framework.Refresh.RefreshHandler(this._lifetimeManager);

        this.dataFactoryService = new DataFactoryService.DataFactoryService(this, DataConstants.MonitoringModuleName);
        this.armService = new ArmService.AzureResourceManagerService(this, DataConstants.MonitoringModuleName);
        this.insightsService = new InsightService.AzureInsightsService(this);
        this.hdInsightArmService = new HDInsightArmService.HDInsightArmService(this);
        this.dataFactoryCache = new DataFactoryCache.DataFactoryCache(this.dataFactoryService);
        this.armDataFactoryCache = new ArmDataFactoryCache.DataFactoryCache(this.armService);
        this.activityWindowCache = new ActivityWindowCache.ActivityWindowCache(this);

        this.stringMessageHandler = new MessageHandler.MessageHandler<string>();
        this.selectionHandler = new MessageHandler.SelectionHandler([], (state) => {
            return !state || state.length === 0;
        });
        this.activityRunUpdateHandler = new MessageHandler.ActivityRunUpdateHandler();
        this.dialogHandler = new WinJSHandlers.DialogHandler();
        this.flyoutHandler = new WinJSHandlers.FlyoutHandler();
        this.calloutHandler = new WinJSHandlers.CalloutHandler();
        this.errorHandler = new ErrorHandler.ErrorHandler(this);
        this.routingHandler = new RoutingHandler.RoutingHandler(this);
        this.monitoringViewHandler = new MonitoringViewHandler.MonitoringViewHandler(this.routingHandler);
        this.authoringHandler = new AuthoringHandler.AuthoringHandler();
        this.authoringOverlayHandler = new MessageHandler.MessageHandler<AuthoringOverlay.AuthoringOverlay>();

        this.authoringEntityStore = new AuthoringEntityStore.EntityStore(this.splitFactoryId(), this.armDataFactoryCache);
        this.authoringEntityDeployer = new EntityDeployer(this);

        Telemetry.instance.updateServiceObject(this.dataFactoryService);
        this._lifetimeManager.registerForDispose(Telemetry.instance);

        this._lifetimeManager.registerForDispose(this.splitFactoryId);

        let startDate: Date = moment().subtract(3, Datetime.TimeUnit.Month).toDate();
        startDate.setSeconds(0,0);
        let endDate: Date = new Date(new Date().getTime() + 60 * 60 * 1000 * 24);
        endDate.setSeconds(0,0);
        this.dateRange = Datetime.getDateRangeObservable({
            startDate: startDate,
            endDate: endDate
        });

        this.authoringPipelineProperties = new EntityProperties.PipelineProperties();

        // The global activity window filter is applied to all activity window fetches.
        this.globalActivityWindowFilter = ko.pureComputed(() => {
            let windowStartColName = ActivityWindowModel.ServiceColumnNames.ExtendedProperties.WindowStart;
            let windowEndColName = ActivityWindowModel.ServiceColumnNames.ExtendedProperties.WindowEnd;
            // TODO tilarden: it was decided that validation activity windows will be excluded temporarily from the list.
            let activityTypeColName = ActivityWindowModel.ServiceColumnNames.ExtendedProperties.ActivityType;
            let filter = "(({0} lt {1} and {2} lt {3}) and ({4} ne '' and {4} ne 'Validation'))".format(
                this.dateRange().startDate.toISOString(), windowEndColName,
                windowStartColName, this.dateRange().endDate.toISOString(), activityTypeColName);
            return filter;
        });

        // Set default selection to be factory or pipeline based on url
        this.routingHandlerSubscription = {
            name: AppContext.className,
            callback: (message) => {
                let pipelineName = message[RoutingHandler.urlKeywords.pipeline.value];
                if (pipelineName) {
                    this.selectionHandler.setDefaultState([new Encodable.PipelineEncodable(pipelineName)]);
                    this.authoringPipelineProperties.deployedPipelineName(pipelineName);
                } else {
                    this.selectionHandler.setDefaultState([new Encodable.DataFactoryEncodable(this.splitFactoryId().dataFactoryName)]);
                }
            }
        };
        this.routingHandlerSubscription.callback(this.routingHandler.getState());
        this.routingHandler.register(this.routingHandlerSubscription);

        logger.logInfo("Finished loading ADF AppContext.");
    }

    public registerContextMenuCommandGroup(commandGroup: Microsoft.DataStudio.UxShell.Menu.IContextMenuCommandGroup): void {
        this._commandGroups[commandGroup.commandGroupName] = commandGroup;
    }

    public unregisterContextMenuCommandGroup(commanGroupName: string): void {
        delete this._commandGroups[commanGroupName];
    }

    public getContextMenuCommandGroup(commandGroupName): Microsoft.DataStudio.UxShell.Menu.IContextMenuCommandGroup {
        let commandGroup = this._commandGroups[commandGroupName];
        if (!commandGroup) {
            logger.logError("AppContext: commandGroupName {0} is not defined".format(commandGroupName));
        }
        return commandGroup;
    }

    // For disposing objects whose lifetime is dubious.
    public addForDispose(obj: { dispose: () => void }): void {
        this._lifetimeManager.registerForDispose(obj);
    }

    // TODO paverma Subscribe to the ShellContext so as to track when no view of the module is showing up.
    public dispose(): void {
        super.dispose();
        this.routingHandler.unregister(this.routingHandlerSubscription);
    }

    // TODO iannight: get a better implementation of these from the shell
    public openProperties(): void {
        $(".rightSidePanel .tabview-tabs_1 ").click();
    }

    public openActivityWindowExplorer(): void {
        $(".rightSidePanel .tabview-tabs_0 ").click();
    }
}
