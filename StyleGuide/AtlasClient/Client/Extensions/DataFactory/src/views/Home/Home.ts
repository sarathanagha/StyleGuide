/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./Home.html" />
/// <amd-dependency path="css!./Home.css" />
/// <amd-dependency path="css!../../stylesheets/Base.Images.css" />

/* tslint:disable:no-var-requires */
export const template: string = require("text!./Home.html");
/* tslint:enable:no-var-requires */

import DataCache = require("../../scripts/Framework/Model/DataCache");
import AppContext = require("../../scripts/AppContext");
import Routing = require("../../scripts/Handlers/RoutingHandler");
import Framework = require("../../_generated/Framework");
import IconResources = Framework.IconResources;
import ResourceIdUtil = require("../../scripts/Framework/Util/ResourceIdUtil");
import TableModel = require("../../scripts/Framework/Model/Contracts/DataArtifact");
import PipelineModel = require("../../scripts/Framework/Model/Contracts/Pipeline");
import LinkedServiceModel = require("../../scripts/Framework/Model/Contracts/LinkedService");
import NavToolbar = require("../Edit/NavToolbar");
import ActivityWindowModel = require("../../scripts/Framework/Model/Contracts/ActivityWindow");
import MonitoringViewHandler = require("../../scripts/Handlers/MonitoringViewHandler");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");

import Log = require("../../scripts/Framework/Util/Log");

let logger = Log.getLogger({
    loggerName: "HomeView"
});

export interface IMetrics {
    // title of the metrics
    metricsTitle: KnockoutObservable<string>;
    // date of the metrics
    metricsDate: KnockoutObservable<string>;
    // metrics (number)
    metricsNumber: KnockoutObservable<string>;
    // icon
    metricsIcon: KnockoutObservable<string>;
};

export interface ILinkedServicesDetails {
    // title
    linkedServicesDetailTitle: KnockoutObservable<string>;
    // number
    linkedServicesDetailNumber: KnockoutObservable<string>;
};

/* tslint:disable:class-name */
export class viewModel extends Framework.Disposable.RootDisposable {
    /* tslint:enable:class-name */
    public static className = "Home";

    public _newDataAvailable: KnockoutObservable<boolean> = ko.observable(true).extend({ notify: "always" });
    public _pipelines: StringMap<MdpExtension.DataModels.BatchPipeline> = null;
    public _allTables: StringMap<MdpExtension.DataModels.DataArtifact> = null;
    public _isFactoryEmpty: boolean = false;

    public monitorTitle: KnockoutObservable<string>;
    public summaryTitle: KnockoutObservable<string>;
    public linkedServicesTitle: KnockoutObservable<string>;
    public monitorLaunchButtons: KnockoutObservableArray<Microsoft.DataStudio.Model.ICommand>;
    public datasetsSummary: KnockoutObservable<string>;
    public pipelinesSummary: KnockoutObservable<string>;
    public metricsSummary: KnockoutObservable<string>;
    public numberOfLinkedServices: KnockoutObservable<string>;
    public numberOfDatasets: KnockoutObservable<string>;
    public numberOfPipelines: KnockoutObservable<string>;
    public notificationTitle: KnockoutObservable<string>;
    public notificationItems: KnockoutObservableArray<Object>;
    public metricsDetails: KnockoutObservableArray<IMetrics>;
    public linkedServicesDetails: KnockoutObservableArray<ILinkedServicesDetails>;
    public linkedServicesIcon;
    public datasetsIcon;
    public pipelinesIcon;
    public navToolbar: NavToolbar.NavToolbarViewModel;
    public breadcrumbs: Framework.Breadcrumbs.Breadcrumbs;

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();
    private _factoryId: string;
    private _splitFactoryId: ResourceIdUtil.IDataFactoryId;
    // Query views
    private _pipelinesQueryView: DataCache.DataCacheView<MdpExtension.DataModels.BatchPipeline[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;
    private _tablesQueryView: DataCache.DataCacheView<MdpExtension.DataModels.DataArtifact[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;
    private _queriesFetched: boolean = false;
    private _topFetchParam: number = 1000; // TODO: t-torodr/paverma update value when the backend top is updated

    constructor(params: Object) {
        super();
        logger.logInfo("Loading view: Home");

        this._factoryId = this._appContext.factoryId();
        if (this._factoryId === null) {
            // TODO: if no factoryId is found display tiles wihtout data or error message
        }
        this._splitFactoryId = ResourceIdUtil.splitResourceString(this._factoryId);

        this._setupNavigationToolbar();
        this._setupSummary();
        this._setupMetricsTile();
        this._setupMonitor();

        // TODO [agoyal] We should not control elements in a such way. Only for demo purposes. Expose SidePane collapase() & expand() functions.
        $(".sidePanel").removeClass("collapsed");

        logger.logInfo("Finished loading view: Home");
    }

    private _setupNavigationToolbar(): void {
        // Set up Navigation toolbar
        this.navToolbar = new NavToolbar.NavToolbarViewModel(this._lifetimeManager);
        this.breadcrumbs = new Framework.Breadcrumbs.Breadcrumbs();
        this.breadcrumbs.addBreadcrumb({
            displayText: this._appContext.splitFactoryId().dataFactoryName,
            nodeClickedCallback: () => {
                return null;
            }
        }, 0);
    }

    private _setupSummary(): void {
        this.summaryTitle = ko.observable("Summary");
        this._setupLinkedServicesTile();
        this._setupDatasetsTile();
        this._setupPipelinesTile();
    }

    private _setupLinkedServicesTile(): void {
        this.linkedServicesTitle = ko.observable("Linked services");
        this.numberOfLinkedServices = ko.observable(Framework.Svg.progressRing);
        this.linkedServicesDetails = ko.observableArray([]);
        this.linkedServicesIcon = IconResources.Icons.linkedService;

        let linkedServicesDetails = [
            {
                linkedServicesDetailTitle: ko.observable("DATA STORES"),
                linkedServicesDetailNumber: ko.observable(Framework.Svg.progressRing)
            },
            {
                linkedServicesDetailTitle: ko.observable("GATEWAYS"),
                linkedServicesDetailNumber: ko.observable(Framework.Svg.progressRing)
            }
        ];

        this.linkedServicesDetails(linkedServicesDetails);
        // TODO iannight: add linked services to the cache
        let linkedServicesPromise = this._appContext.armService.listLinkedServices({
            factoryName: this._splitFactoryId.dataFactoryName,
            subscriptionId: this._splitFactoryId.subscriptionId,
            resourceGroupName: this._splitFactoryId.resourceGroupName
        });

        let gatewaysPromise = this._appContext.armService.listGateways({
            factoryName: this._splitFactoryId.dataFactoryName,
            subscriptionId: this._splitFactoryId.subscriptionId,
            resourceGroupName: this._splitFactoryId.resourceGroupName
        });

        Q.all([linkedServicesPromise, gatewaysPromise]).spread((linkedServices, gateways) => {
            if (linkedServices !== null) {
                this.numberOfLinkedServices("" + linkedServices.length);
            }
            if (gateways !== null) {
                this.linkedServicesDetails()[1].linkedServicesDetailNumber("" + gateways.value.length);
            }
            let computeServices: number = 0;
            linkedServices.forEach((linkedService) => {
                let type: string = linkedService.properties.type;
                LinkedServiceModel.DataStoreType.allComputeTypes.forEach((value, index, array) => {
                    if (type === value.name) {
                        ++computeServices;
                    }
                });
            });
            this.linkedServicesDetails()[0].linkedServicesDetailNumber("" + (linkedServices.length - computeServices));
        });
    }

    private _setupPipelinesTile(): void {
        this.pipelinesSummary = ko.observable("Pipelines");
        this.numberOfPipelines = ko.observable(Framework.Svg.progressRing);
        this.pipelinesIcon = IconResources.Icons.graphPipelineIcon;
        // Query View to query the cache for data
        this._pipelinesQueryView = this._appContext.armDataFactoryCache.pipelineListCacheObject.createView();
        this._lifetimeManager.registerForDispose(this._pipelinesQueryView.items.subscribe(() => {
            let pipelines = this._pipelinesQueryView.items();

            this._pipelines = Object.create(null);
            pipelines.forEach((pipeline: MdpExtension.DataModels.BatchPipeline) => {
                this._pipelines[PipelineModel.getPipelineKey(pipeline.name())] = pipeline;
            });

            this._cacheRefreshed();
        }));

        let fetchPipeline = this._pipelinesQueryView.fetch({
            subscriptionId: this._splitFactoryId.subscriptionId,
            resourceGroupName: this._splitFactoryId.resourceGroupName,
            factoryName: this._splitFactoryId.dataFactoryName
        });

        // fetch pipelines and update number of pipelines in tile
        fetchPipeline.then(() => {
            this.numberOfPipelines("" + this._pipelinesQueryView.items().length);
        });
    }

    private _setupDatasetsTile(): void {
        this.datasetsSummary = ko.observable("Datasets");
        this.numberOfDatasets = ko.observable(Framework.Svg.progressRing);
        this.datasetsIcon = IconResources.Icons.tableIcon;
        // Query View to query the cache for data
        this._tablesQueryView = this._appContext.armDataFactoryCache.tableListCacheObject.createView();
        this._lifetimeManager.registerForDispose(this._tablesQueryView.items.subscribe(() => {
            let tables = this._tablesQueryView.items();

            this._allTables = Object.create(null);
            tables.forEach((artifact: MdpExtension.DataModels.DataArtifact) => {
                this._allTables[TableModel.getTableKey(artifact.name())] = artifact;
            });

            this._cacheRefreshed();
        }));

        let fetchTables = this._tablesQueryView.fetch({
            subscriptionId: this._splitFactoryId.subscriptionId,
            resourceGroupName: this._splitFactoryId.resourceGroupName,
            factoryName: this._splitFactoryId.dataFactoryName
        });

        // fetch tables and update number of tables in tile
        fetchTables.then(() => {
            let tablesArr = <MdpExtension.DataModels.DataArtifact[]>this._tablesQueryView.items();
            this.numberOfDatasets("" + tablesArr.length);
        });
    }

    private _setupMetricsTile(): void {
        this.metricsSummary = ko.observable("Metrics");
        this.metricsDetails = ko.observableArray([]);

        let startDate: Date = new Date(moment().subtract(7, "days").calendar()), endDate: Date = new Date();
        let mDetails = [
            {
                metricsTitle: ko.observable("SUCCEEDED"),
                metricsDate: ko.observable("(" + moment(startDate).format("L") + "-" + moment(endDate).format("L") + ")"),
                metricsNumber: ko.observable(Framework.Svg.progressRing),
                metricsIcon: ko.observable(Framework.Svg.statusReady)
            },
            {
                metricsTitle: ko.observable("FAILED"),
                metricsDate: ko.observable("(" + moment(startDate).format("L") + "-" + moment(endDate).format("L") + ")"),
                metricsNumber: ko.observable(Framework.Svg.progressRing),
                metricsIcon: ko.observable(Framework.Svg.statusFailed)
            },
            {   // In progress metrics doesn't have a Date.
                metricsTitle: ko.observable("IN PROGRESS"),
                metricsDate: ko.observable(""),
                metricsNumber: ko.observable(Framework.Svg.progressRing),
                metricsIcon: ko.observable("<span class = \"adf-runStatusIcon\">" + Framework.Svg.statusInProgress + "</span>")
            }
        ];

        this.metricsDetails(mDetails);
        // Query for activity runs in the past 7 days.  Date must be formatted YYYY-MM-DD for the ajax call.
        let activityRunQueryStartDate: string = moment().subtract(7, "days").format("YYYY-MM-DD");

        this.fetchActivityRuns("(WindowStart ge " + activityRunQueryStartDate +
            " and (LastRunStatus eq 'FailedExecution' or LastRunStatus eq 'TimedOut'))").done((activityRuns: KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>[]) => {
                this.metricsDetails()[1].metricsNumber("" + activityRuns.length);
                // top is limited to 1000 atm. For this reason, if top is reached we need to change the date range accordingly.
                if (activityRuns.length >= this._topFetchParam) {
                    this.metricsDetails()[1].metricsDate("(" + moment(startDate).format("L") + "-" + moment(activityRuns[this._topFetchParam - 1]().runStart.toString()).format("L") + ")");
                }
            });

        this.fetchActivityRuns("(WindowStart ge " + activityRunQueryStartDate +
            " and LastRunStatus eq 'Succeeded')").done((activityRuns: KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>[]) => {
                this.metricsDetails()[0].metricsNumber("" + activityRuns.length);
                // top is limited to 1000 atm. For this reason, if top is reached we need to change the date range accordingly.
                if (activityRuns.length >= this._topFetchParam) {
                    this.metricsDetails()[0].metricsDate("(" + moment(startDate).format("L") + "-" + moment(activityRuns[this._topFetchParam - 1]().runStart.toString()).format("L") + ")");
                }
            });

        this.fetchActivityRuns("(WindowStart ge " + activityRunQueryStartDate +
            " and LastRunStatus eq 'Running')").done((activityRuns: KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>[]) => {
                this.metricsDetails()[2].metricsNumber("" + activityRuns.length);
                // top is limited to 1000 atm. For this reason, if top is reached we need to change the date range accordingly.
                if (activityRuns.length >= this._topFetchParam) {
                    this.metricsDetails()[2].metricsDate("(" + moment(startDate).format("L") + "-" + moment(activityRuns[this._topFetchParam - 1]().runStart.toString()).format("L") + ")");
                }
            });
    }

    private _setupMonitor(): void {
        this.monitorTitle = ko.observable("Monitor");
        let actionFactory = (viewName: string) => {
            return () => {
                let newUrlParams: StringMap<string> = {};
                newUrlParams[Routing.urlKeywords.moduleView.value] = Routing.viewName.edit;
                newUrlParams[Routing.urlKeywords.view.value] = viewName;
                this._appContext.routingHandler.pushState(viewModel.className, newUrlParams);
            };
        };

        // Monitor quick launch buttons
        this.monitorLaunchButtons = ko.observableArray([
            {
                name: "View recent activity windows",
                action: actionFactory(MonitoringViewHandler.MonitoringViewHandler.systemViewNames.recent)
            },
            {
                name: "View failed activity windows",
                action: actionFactory(MonitoringViewHandler.MonitoringViewHandler.systemViewNames.failed)
            },
            {
                name: "View in-progress activity windows",
                action: actionFactory(MonitoringViewHandler.MonitoringViewHandler.systemViewNames.inProgress)
            },
        ]);
    }

    private fetchActivityRuns(filter: string): Q.Promise<KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>[]> {
        let deferred = Q.defer<KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>[]>();
        let splitFactoryId = this._appContext.splitFactoryId();
        let orderBy: string = "WindowStart desc";
        let top: number = this._topFetchParam;

        // always add the factory name to the filter
        if (filter) {
            filter += " and DataFactoryName eq '{0}'";
        } else {
            filter = "DataFactoryName eq '{0}'";
        }

        filter = filter.format(splitFactoryId.dataFactoryName.toLowerCase());

        this._appContext.activityWindowCache.fetchTop(filter, orderBy, top).then((response: KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>[]) => {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    private _cacheRefreshed(): void {
        if (this._queriesFetched) {
            if (this._pipelinesQueryView.items().length + this._tablesQueryView.items().length === 0) {
                this._isFactoryEmpty = true;
            } else {
                this._isFactoryEmpty = false;
            }
            this._newDataAvailable(true);
        }
    }
}
