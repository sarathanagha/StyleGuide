import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
import Framework = require("../../../../_generated/Framework");
import AppContext = require("../../../../scripts/AppContext");
import TableModel = require("../../../../scripts/Framework/Model/Contracts/DataArtifact");
import PipelineModel = require("../../../../scripts/Framework/Model/Contracts/Pipeline");
import ActivityModel = require("../../../../scripts/Framework/Model/Contracts/Activity");
import DiagramContracts = require("../../../../scripts/Framework/Model/Contracts/Diagram");
import DataCache = require("../../../../scripts/Framework/Model/DataCache");
import Log = require("../../../../scripts/Framework/Util/Log");
import ActivityWindowModel = require("../../../../scripts/Framework/Model/Contracts/ActivityWindow");
import Util = Framework.Util;
import ActivityWindowCache = Framework.ActivityWindowCache;
import StatusCalendar = Framework.StatusCalendar;
import ArmService = require("../../../../scripts/Services/AzureResourceManagerService");

"use strict";
let logger = Log.getLogger({
    loggerName: "DiagramModel"
});

// TODO paverma This still needs to be updated to have the actual product code.
// Until then directly loading the mock data and creating the required objects.
// TODO paverma The availability info has been removed from the ListTables called and instead
// has been added on the activity. As a quick fix we will be injecting the properties from the
// activity to its output tables, and if missing we would then be making the GetTabke call.
// Ideally, we would want to have this property added by the data layer.
export class DiagramModel extends Framework.Disposable.ChildDisposable {
    public _newDataAvailable: KnockoutObservable<boolean> = ko.observable(true).extend({ notify: "always" });
    public _pipelines: StringMap<MdpExtension.DataModels.BatchPipeline> = null;
    public _allTables: StringMap<MdpExtension.DataModels.DataArtifact> = null;
    public _isFactoryEmpty: boolean = false;
    public _tableStatusQueryProperties: StringMap<DiagramContracts.ITableStatusQueryProperties> = null;
    public _activityWindows: Util.DefaultDict<KnockoutObservableArray<ActivityWindowCache.IActivityWindowObservable>> = null;
    public initialLoadComplete = ko.pureComputed(() => {
        return this._queriesFetched() && this._initalActivityWindowFetchComplete();
    });

    private _appContext = AppContext.AppContext.getInstance();
    private _factoryId: string = null;
    private _pipelinesQueryView: DataCache.DataCacheView<MdpExtension.DataModels.BatchPipeline[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;
    private _tablesQueryView: DataCache.DataCacheView<MdpExtension.DataModels.DataArtifact[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;
    private _queriesFetched = ko.observable(false);
    private _initalActivityWindowFetchComplete = ko.observable(false);

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager) {
        super(lifetimeManager);

        this._pipelinesQueryView = this._appContext.armDataFactoryCache.pipelineListCacheObject.createView();
        this._tablesQueryView = this._appContext.armDataFactoryCache.tableListCacheObject.createView();

        this._lifetimeManager.registerForDispose(this._tablesQueryView.items.subscribe(() => {
            let tables = this._tablesQueryView.items();

            this._allTables = Object.create(null);
            tables.forEach((artifact: MdpExtension.DataModels.DataArtifact) => {
                this._allTables[TableModel.getTableKey(artifact.name())] = artifact;
            });

            this._cacheRefreshed();
        }));

        this._lifetimeManager.registerForDispose(this._pipelinesQueryView.items.subscribe(() => {
            let pipelines = this._pipelinesQueryView.items();

            if (pipelines.length === 0) {
                this._initalActivityWindowFetchComplete(true);
            }

            this._pipelines = Object.create(null);
            this._tableStatusQueryProperties = Object.create(null);
            let schedulerToActivityMap = new Util.DefaultDict(() => { return <string[][]>[]; });
            pipelines.forEach((pipeline: MdpExtension.DataModels.BatchPipeline) => {
                if (Util.koPropertyHasValue(pipeline.properties().pipelineMode) && pipeline.properties().pipelineMode() !== PipelineModel.PipelineMode.Scheduled) {
                    // Diagram should only display scheduled pipelines.
                    return;
                }

                let pipelineKey = PipelineModel.getPipelineKey(pipeline.name());
                this._pipelines[pipelineKey] = pipeline;

                if (pipeline.properties().activities) {
                    pipeline.properties().activities().forEach((activity) => {
                        if (activity.outputs) {
                            let colNames = ActivityWindowModel.ServiceColumnNames.ExtendedProperties;
                            let query = "{0} eq '{1}' and {2} eq '{3}'".format(colNames.PipelineId, pipeline.properties().id(),
                                colNames.ActivityName, activity.name());
                            activity.outputs().forEach((outputTables) => {
                                this._tableStatusQueryProperties[TableModel.getTableKey(outputTables.name())] = {
                                    queryFilter: query,
                                    scheduler: activity.scheduler(),
                                    recentActivityWindows: this._activityWindows.get(ActivityModel.getActivityKey(activity.name(), pipelineKey))
                                };
                            });
                        }

                        if (Util.koPropertyHasValue(activity.scheduler)) {
                            schedulerToActivityMap.get(this.getSchedulerKey(activity.scheduler())).push([pipeline.properties().id(), activity.name()]);
                        } else {
                            // All activities should have a scheduler object.
                            logger.logError("Missing activity scheduler for activity {0} in pipeline {1} of factory {2}".format(activity.name(), pipeline.name(), this._factoryId));
                        }
                    });
                }
            });

            if (schedulerToActivityMap.keys().length === 0) {
                this._initalActivityWindowFetchComplete(true);
            }
            // TODO paverma Explicitly subscribe to global daterange, once data layer polling is available. Currently, the entire diagram subscribes to it.
            schedulerToActivityMap.keys().forEach((key) => {
                let pipelineActivityNames = schedulerToActivityMap.get(key);
                let scheduler = this.getSchedulerFromKey(key);
                this.getActivityWindows(pipelineActivityNames, scheduler);
            });

            this._cacheRefreshed();
        }));

        this._activityWindows = new Util.DefaultDict(() => { return ko.observableArray<ActivityWindowCache.IActivityWindowObservable>([]); });
    }

    public onInputsSet(inputs: Object): Q.Promise<void> {
        this._factoryId = this._appContext.factoryId();
        let splitFactoryId = this._appContext.splitFactoryId();

        // reset this value so we don't have as many updates
        this._queriesFetched(false);

        let fetchPipeline = this._pipelinesQueryView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        });

        fetchPipeline.fail(this._appContext.errorHandler.makeResourceFailedHandler("pipelines in {0} factory".format(splitFactoryId.dataFactoryName)));

        let fetchTables = this._tablesQueryView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        });

        fetchTables.fail(this._appContext.errorHandler.makeResourceFailedHandler("tables in {0} factory".format(splitFactoryId.dataFactoryName)));

        return Q.all<(MdpExtension.DataModels.BatchPipeline | MdpExtension.DataModels.DataArtifact)[]>([fetchPipeline, fetchTables]).then(() => {
            this._queriesFetched(true);
            this._cacheRefreshed();
        }, (reason: Object) => {
            let message = "Failed to fetch data. Reason: " + JSON.stringify(reason);
            logger.logError(message);
            throw reason;
        });
    }

    public getActivityWindows(pipelineActivityNames: string[][], scheduler: MdpExtension.DataModels.ActivityScheduler): void {
        let colNames = ActivityWindowModel.ServiceColumnNames.ExtendedProperties;
        const batchSize = 50;
        let numberOfFilterExpressions = pipelineActivityNames.length;
        let numberOfRequests = 0;

        let processBatch = (batchIndex: number) => {
            let localPipelineActivityNames = pipelineActivityNames.splice(batchIndex, batchIndex + batchSize);
            let activityFilter = localPipelineActivityNames.map((pipelineActivityName) => {
                return "({0} eq '{1}' and {2} eq '{3}')".format(colNames.PipelineId, pipelineActivityName[0], colNames.ActivityName, pipelineActivityName[1]);
            }).join(" or ");

            numberOfRequests += 1;
            // ActivityWindowCache takes care of pagination, thus we should be able to specify a value greater than 1000.
            let [frequency] = StatusCalendar.findCorrectFrequencyAndInterval(scheduler.frequency(), scheduler.interval());
            let numberOfStatusOnNodes = StatusCalendar.maxNumberOfSlotsInARowMap[frequency];
            let top = localPipelineActivityNames.length * numberOfStatusOnNodes;
            this._appContext.activityWindowCache.fetchTop(activityFilter, "{0} desc".format(colNames.WindowStart), top).then((activityWindows) => {
                activityWindows.reverse();
                let activityWindowsMap = new Util.DefaultDict(() => { return <ActivityWindowCache.IActivityWindowObservable[]>[]; });
                activityWindows.forEach((activityWindow) => {
                    activityWindowsMap.get(ActivityModel.getActivityKey(activityWindow().activityName, PipelineModel.getPipelineKey(activityWindow().pipelineName))).push(activityWindow);
                });

                activityWindowsMap.keys().forEach((key) => {
                    let value = activityWindowsMap.get(key);
                    this._activityWindows.get(key)(value);
                });
            }, (reason) => {
                logger.logError("Failed to fetch activity windows for filter {0} for factory {1}. Reason {2}.".format(activityFilter, this._factoryId, JSON.stringify(reason)));
            }).finally(() => {
                numberOfRequests -= 1;
                if (numberOfRequests === 0) {
                    this._initalActivityWindowFetchComplete(true);
                }
            });
        };

        for (let i = 0; i < numberOfFilterExpressions; i += batchSize) {
            processBatch(i);
        }
    }

    private _cacheRefreshed(): void {
        if (this._queriesFetched()) {
            if (this._pipelinesQueryView.items().length + this._tablesQueryView.items().length === 0) {
                this._isFactoryEmpty = true;
            } else {
                this._isFactoryEmpty = false;
            }
            this._newDataAvailable(true);
        }
    }

    private getSchedulerKey(scheduler: MdpExtension.DataModels.ActivityScheduler): string {
        return scheduler.frequency() + "#" + scheduler.interval().toString();
    }

    private getSchedulerFromKey(key: string): MdpExtension.DataModels.ActivityScheduler {
        let [frequency, interval] = key.split("#");
        if (!frequency || !interval) {
            logger.logError("Bad scheduler key {0} in factory {1}.".format(key, this._factoryId));
            return null;
        }

        return {
            frequency: ko.observable(frequency),
            interval: ko.observable(parseInt(interval, 10))
        };
    }
}
