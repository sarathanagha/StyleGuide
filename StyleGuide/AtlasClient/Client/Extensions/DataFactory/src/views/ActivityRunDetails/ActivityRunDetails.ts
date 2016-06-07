/// <amd-dependency path="text!./ActivityRunDetails.html" />
/// <amd-dependency path="css!./ActivityRunDetails.css" />
/// <reference path="../../References.d.ts" />

/* tslint:disable:no-var-requires */
export const template: string = require("text!./ActivityRunDetails.html");
/* tslint:enable:no-var-requires */

import ActivityWindowModel = require("../../scripts/Framework/Model/Contracts/ActivityWindow");
import ActivityWindowHelper = require("../../scripts/Framework/Model/Helpers/ActivityWindowHelper");
import ActivityWindowCache = require("../../scripts/Framework/Model/ActivityWindowCache");

import AppContext = require("../../scripts/AppContext");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");
import Encodable = require("../../scripts/Framework/Model/Contracts/Encodable");
import ResourceIdUtil = require("../../scripts/Framework/Util/ResourceIdUtil");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import Log = require("../../scripts/Framework/Util/Log");
import Constants = require("../../scripts/Framework/Shared/Constants");
import DateTime = require("../../scripts/Framework/Util/Datetime");
import Framework = require("../../_generated/Framework");
import DataConstants = Framework.DataConstants;
import StatusCalendar = Framework.StatusCalendar;
import Loader = Framework.Loader;
import Util = require("../../scripts/Framework/Util/Util");
import Svg = Framework.Svg;
import DataCache = require("../../scripts/Framework/Model/DataCache");
import RunRecordModel = require("../../scripts/Framework/Model/Contracts/RunRecord");
import ActivityRunDetailsToolbar = require("./ActivityRunDetailsToolbarViewModel");
import CollapsibleKnockoutBinding = require("../../bootstrapper/CollapsibleKnockoutBinding");

const BYTES_IN_KILOBYTE: number = 1024;

// time in milliseconds before we refresh
const REFRESH_DELAY: number = 2000;

let logger = Log.getLogger({
    loggerName: DataConstants.ActivityWindowDetailsViewModel
});

export interface IAccordionItem extends CollapsibleKnockoutBinding.ICollapsibleValueAccessor {
    icon?: KnockoutObservable<string>;
}

class ActivityInputProperties implements CollapsibleKnockoutBinding.ICollapsibleValueAccessor {
    public properties: KnockoutObservableArray<string[]>;
    public isExpanded = ko.observable(false);
    public header = ClientResources.runInputPropertiesText;

    constructor(properties: string[][]) {
        this.properties = ko.observableArray(properties);
    }
}

export interface IActivityRunAttempt extends IAccordionItem {
    date: KnockoutObservable<string>;
    tooltipDate: KnockoutObservable<string>;
    status: KnockoutObservable<string>;
    message: KnockoutObservable<string>;
    messageVisible: KnockoutObservable<boolean>;
    percentComplete: KnockoutObservable<string>;
    runRecordId: KnockoutObservable<string>;
    hasLogs: KnockoutObservable<boolean>;
    logs: KnockoutObservableArray<IActivityRunAttemptLog>;
    type: KnockoutObservable<string>;
    properties?: KnockoutObservable<MdpExtension.DataModels.RunRecordProperties>;
    activityInputProperties: ActivityInputProperties;
}

export interface IUpstreamActivityWindow extends IAccordionItem {
    tableName: string;
    slices: {
        status: string,
        icon: string,
        start: string,
        end: string
    }[];
}

export interface IActivityRunAttemptLog {
    fileName: KnockoutObservable<string>;
    size: KnockoutObservable<string>;
    date: KnockoutObservable<string>;
    sasUri: KnockoutObservable<string>;
    tooltipDate: KnockoutObservable<string>;
    icon: string | Object;
}

/* tslint:disable:class-name */
export class viewModel extends Framework.Disposable.RootDisposable {
    /* tslint:enable:class-name */

    public static viewName: string = DataConstants.ActivityWindowDetailsViewModel;

    public selectionSubscription: MessageHandler.ISelectionSubscription;
    public activityRunUpdateSubscription: MessageHandler.IActivityRunUpdateSubscription;
    public activityRunDetails: KnockoutObservableArray<IActivityRunAttempt>;
    public activityWindow: KnockoutObservable<ActivityWindowCache.IActivityWindowObservable>;
    public upstreamActivityWindows: KnockoutObservableArray<IUpstreamActivityWindow>;
    public pipeline: KnockoutObservable<Encodable.PipelineEncodable>;
    public activity: KnockoutObservable<Encodable.ActivityEncodable>;
    public runRecordsExist: KnockoutObservable<boolean>;
    public statusCalendar: StatusCalendar.StatusCalendar = null;
    public logIcon: KnockoutObservable<string>;
    public collapseUpIcon: KnockoutObservable<string>;
    public collapseDownIcon: KnockoutObservable<string>;

    public loading: KnockoutObservable<boolean> = ko.observable(true);
    public isEmpty: KnockoutObservable<boolean>;

    public spinnerImage: string = Framework.Svg.progressRing;

    public refreshButton: Framework.Command.ObservableCommand;

    public activityRunDetailsToolbar: ActivityRunDetailsToolbar.ActivityRunDetailsToolbarViewModel;

    public datasetHeaders = ["Dataset", "Status", "Run Start", "Run End"];

    public explorerCollapsible: CollapsibleKnockoutBinding.ICollapsibleValueAccessor = {
        isExpanded: ko.observable(true)
    };

    public detailsCollapsible: CollapsibleKnockoutBinding.ICollapsibleValueAccessor = {
        isExpanded: ko.observable(true)
    };

    public runRecordsCollapsible: CollapsibleKnockoutBinding.ICollapsibleValueAccessor = {
        isExpanded: ko.observable(true)
    };

    public upstreamCollapsible: CollapsibleKnockoutBinding.ICollapsibleValueAccessor = {
        isExpanded: ko.observable(true)
    };

    public entityClick = (entity: Encodable.Encodable) => {
        this._appContext.selectionHandler.pushState(viewModel.viewName, [entity]);
    };

    public tableClick = (tableName: string) => {
        this.entityClick(new Encodable.TableEncodable(tableName));
    };

    public refreshPane = () => {
        if (!this.activityWindow()) {
            return;
        }

        this.loading(true);
        this.setupCalendar(this.activityWindow());
        this.showAttemptsList();

        // If the activity window is waiting to run, display the upstream entities of interest.
        if (this.activityWindow()().windowState === ActivityWindowModel.States.Waiting.name) {
            this.setupUpstreamActivityWindows();
        } else {
            this.upstreamActivityWindows.removeAll();
        }
    };

    public processSelectionUpdate = (selectedNodes: Encodable.Encodable[], publisherName: string) => {
        this.cancelTimeout();

        this.loading(true);
        let runCount = 0;
        this.activityWindow(null);
        let selectedActivityWindow: ActivityWindowCache.IActivityWindowObservable = null;

        selectedNodes.some((encodable: Encodable.Encodable) => {
            switch (encodable.type) {
                case Encodable.EncodableType.ACTIVITY_RUN:
                    // only one can be displayed at a time
                    if (runCount++ > 0) {
                        return true;
                    }
                    selectedActivityWindow = (<Encodable.ActivityRunEncodable>encodable).observable;
                    break;
                default:
                    // This viewModel shows details for a single activity window, hence its best to ignore the rest of the cases.
                    break;
            }

            return false;
        });

        // it has be exactly one item for now
        if (runCount === 1) {
            this.activityWindow(selectedActivityWindow);
            this.pipeline(new Encodable.PipelineEncodable(this.activityWindow()().pipelineName));
            this.activity(new Encodable.ActivityEncodable(this.activityWindow()().pipelineName, this.activityWindow()().activityName));

            // Get the sliceId and tableName for the listRunRecords call
            let rawSliceId = this.activityWindow()().windowStart; // e.g., "2015-07-13 22:00:00.0000000"
            this._sliceId = DateTime.getIso8601DateString(rawSliceId);

            let entities: Encodable.EncodableSet = this.activityWindow()().entities;
            let entitiesCopy: Encodable.EncodableSet = jQuery.extend(true, {}, entities);
            entitiesCopy.filterEncodables(Encodable.EncodableType.TABLE);
            entitiesCopy.forEach((entity) => {
                this._tableName = entity.id;
            });

            this.refreshPane();
        } else {
            // no activity window is selected
            this.activityWindow(null);
            this.loading(false);
        }
    };

    // tries to excecute a refresh after a given number of milliseconds
    public refreshTimeout = (milliseconds: number) => {
        this._refreshTimeout = setTimeout(this.refreshPane, milliseconds);
    };

    private _appContext: AppContext.AppContext;
    private _splitDataFactoryId: KnockoutComputed<ResourceIdUtil.IDataFactoryId>;
    private _sliceId: string;
    private _tableName: string;
    private _frequency: string;
    private _interval: number;
    private _refreshTimeout: number = null;
    private _runRecordsQueryView: DataCache.DataCacheView<MdpExtension.DataModels.RunRecord[], ArmService.IDatasetResourceBaseUrlParams, ArmService.ISliceResourceQueryParams> = null;
    private _runRecordEntityView: DataCache.DataCacheView<MdpExtension.DataModels.RunRecord, ArmService.IRunRecordBaseUrlParams, void> = null;
    private _runLogsQueryView: DataCache.DataCacheView<MdpExtension.DataModels.BlobMetaData[], void, void> = null;

    /* tslint:disable:no-unused-variable */
    private toggleMessageOverflow = (data, event): void => {
        /* tslint:enable:no-unused-variable */
        $(event.currentTarget).prev().toggleClass(Constants.CSS.overflowMessageClass);
        $(event.currentTarget).text((i, text) => {
            return text === ClientResources.errorMessageExpand ? ClientResources.errorMessageCollapse : ClientResources.errorMessageExpand;
        });
    };

    private showAttemptsList = () => {
        this.listRunRecords().then(() => {
            this.loading(false);
        });
    };

    private _setRunStatusIcon = (runRecordStatus: string, runAttempt: IActivityRunAttempt) => {
        let svg: string;

        switch (runRecordStatus) {
            case RunRecordModel.Status.Succeeded:
                svg = Framework.Svg.statusReady;
                break;

            case RunRecordModel.Status.FailedExecution:
            case RunRecordModel.Status.FailedValidation:
            case RunRecordModel.Status.TimedOut:
            case RunRecordModel.Status.FailedResourceAllocation:
            case RunRecordModel.Status.Canceled:
                svg = Framework.Svg.statusFailed;
                runAttempt.percentComplete(null);
                break;

            case RunRecordModel.Status.Starting:
            case RunRecordModel.Status.AllocatingResources:
            case RunRecordModel.Status.Configuring:
                svg = Framework.Svg.statusStarting;
                break;

            case RunRecordModel.Status.Running:
                svg = Framework.Svg.statusInProgress;
                break;

            default:
                logger.logError("Unsupported slice status: " + runRecordStatus);
                svg = Framework.Svg.statusStarting;
        }

        runAttempt.icon(svg);
    };

    private listRunRecords = (): Q.Promise<void> => {
        let splitDataFactoryId = this._splitDataFactoryId();

        let deferred = Q.defer<void>();

        this._runRecordsQueryView.fetch({
            factoryName: splitDataFactoryId.dataFactoryName,
            subscriptionId: splitDataFactoryId.subscriptionId,
            resourceGroupName: splitDataFactoryId.resourceGroupName,
            tableName: this._tableName
        }, {
            startTime: this._sliceId
        }).then((runRecords) => {
            this.runRecordsExist(runRecords.length > 0);

            runRecords.reverse(); // want to show oldest run records first
            let runAttemptsList: IActivityRunAttempt[] = [];

            runRecords.forEach((record: MdpExtension.DataModels.RunRecord) => {
                let processingStartTime: string = record.processingStartTime();
                let utcStartTime = DateTime.getUtcTime(processingStartTime);
                let fullDateStartTime = DateTime.getLocalTime(processingStartTime);

                let runRecordId: KnockoutObservable<string> = record.id;

                let pc = ClientResources.percentageCompleteInBracketText.format(record.percentComplete().toString());

                // TODO paverma This is dangerous need to call it label and rename accordingly everywhere.
                let runStatus = ko.observable<string>(RunRecordModel.StatusLabel[record.status()] || record.status());

                let runAttempt: IActivityRunAttempt = {
                    date: ko.observable(utcStartTime),
                    tooltipDate: ko.observable(fullDateStartTime),
                    status: runStatus,
                    message: record.errorMessage,
                    messageVisible: ko.observable(record.status() !== RunRecordModel.Status.Succeeded && record.errorMessage() && record.errorMessage().length > 0),
                    percentComplete: ko.observable(pc),
                    isExpanded: ko.observable(false),
                    runRecordId: runRecordId,
                    hasLogs: record.hasLogs,
                    icon: ko.observable(null),
                    logs: (ko.observableArray(<IActivityRunAttemptLog[]>[])),
                    type: record.type,
                    properties: ko.observable(<MdpExtension.DataModels.RunRecordProperties>{
                        details: ko.observable<string>(),
                        dataVolume: ko.observable<string>(),
                        throughput: ko.observable<string>()
                    }),
                    activityInputProperties: new ActivityInputProperties(null)
                };

                // Should avoid registering for dispose, since the lifetime scope is the run attempt and not the view.
                runAttempt.isExpanded.subscribe((isExpanded) => {
                    if (isExpanded) {
                        this.listRunLogs(runAttempt);
                        this.getRunRecordProperties(runAttempt);
                    }
                });

                this._setRunStatusIcon(record.status(), runAttempt);

                runAttemptsList.push(runAttempt);
            });

            // Expand the first attempt by default and get its logs
            let firstAttempt = runAttemptsList[0];
            if (firstAttempt) {
                firstAttempt.isExpanded(true);
                Q.all([this.listRunLogs(firstAttempt), this.getRunRecordProperties(firstAttempt)]).fin(() => {
                    this.activityRunDetails(runAttemptsList);
                    deferred.resolve(null);
                });
            } else {
                this.activityRunDetails(runAttemptsList);
                deferred.resolve(null);
            }
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to fetch run records. Xhr message: " + reason.responseText);
            deferred.resolve(null);
            // TODO rigoutam: clear the right panel since we failed to fetch stuff
        });

        return deferred.promise;
    };

    // Gets the logs for a given run attempt
    private listRunLogs = (runAttempt: IActivityRunAttempt): Q.Promise<void> => {
        let deferred = Q.defer<void>();

        if (runAttempt.hasLogs()) {
            let splitDataFactoryId = this._splitDataFactoryId();

            return this._runLogsQueryView.fetch({
                factoryName: splitDataFactoryId.dataFactoryName,
                subscriptionId: splitDataFactoryId.subscriptionId,
                resourceGroupName: splitDataFactoryId.resourceGroupName,
                runId: runAttempt.runRecordId
            }).then((runLogs) => {
                runAttempt.logs.removeAll();

                runLogs.forEach((log) => {
                    let filesize = ko.observable(this.getFileSize(log.Size()));
                    let utcDate = ko.observable(DateTime.getUtcTime(log.Date()));
                    let fullDate = ko.observable(DateTime.getTooltipDate(log.Date()));

                    let runAttemptLog: IActivityRunAttemptLog = {
                        fileName: log.Name,
                        size: filesize,
                        date: utcDate,
                        sasUri: log.SasUri,
                        tooltipDate: fullDate,
                        icon: Svg.download
                    };
                    runAttempt.logs.push(runAttemptLog);
                });
            }, (reason: JQueryXHR) => {
                logger.logError("Failed to fetch run logs. Xhr message: " + JSON.stringify(reason.responseText));
            });
        } else {
            logger.logDebug("Run Attempt does not have logs so not making listRunLogs request");
            deferred.resolve(null);
        }
        return deferred.promise;
    };

    private getRunRecordProperties = (runAttempt: IActivityRunAttempt): Q.Promise<void> => {
        let splitDataFactoryId = this._splitDataFactoryId();
        return this._runRecordEntityView.fetch({
            factoryName: splitDataFactoryId.dataFactoryName,
            subscriptionId: splitDataFactoryId.subscriptionId,
            resourceGroupName: splitDataFactoryId.resourceGroupName,
            runId: runAttempt.runRecordId()
        }).then((runRecord: MdpExtension.DataModels.RunRecord) => {
            let properties = runRecord.properties();

            let extendedDetails = "";
            if (properties.details && properties.details()) {
                extendedDetails = properties.details();

                if (properties.totalDuration && properties.totalDuration()) {
                    extendedDetails = "{0}, {1}: {2}".format(extendedDetails, ClientResources.runTotalCopyDurationTitle, properties.totalDuration());
                }
            }

            runAttempt.properties().details(extendedDetails);
            runAttempt.properties().dataVolume(properties.dataVolume && properties.dataVolume() ? properties.dataVolume() : "");
            runAttempt.properties().throughput(properties.throughput && properties.throughput() ? ClientResources.copyThroughputLabelAndValueTemplate.format(properties.throughput()) : "");

            if (runRecord.activityInputProperties) {
                let runInputDict = runRecord.activityInputProperties();
                let propertyArray: string[][] = [];
                for (let key in runInputDict) {
                    let value = runInputDict[key]();
                    propertyArray.push([key, value]);
                }
                runAttempt.activityInputProperties.properties(propertyArray);
            }
        }, (error) => {
            logger.logError("An error occurred while fetching the run record with id: {0}".format(runAttempt.runRecordId));
        });
    };

    // TODO rigoutam: make this work for mb, gb, etc and not be fixed to two decimal places
    private getFileSize = (rawSize: number): string => {
        return (rawSize / BYTES_IN_KILOBYTE).toFixed(2) + "kb";
    };

    private _eventHandler = (activityRun: Encodable.ActivityRunEncodable) => {
        this.refreshTimeout(REFRESH_DELAY);
    };

    constructor() {
        super();

        this.activityWindow = ko.observable(null);
        this.upstreamActivityWindows = ko.observableArray([]);

        this._appContext = AppContext.AppContext.getInstance();
        this._splitDataFactoryId = this._appContext.splitFactoryId;
        this._runRecordEntityView = this._appContext.armDataFactoryCache.runRecordCacheObject.createView();
        this._runRecordsQueryView = this._appContext.armDataFactoryCache.runRecordListCacheObject.createView();
        this._runLogsQueryView = this._appContext.dataFactoryCache.runLogsCacheObject.createView();

        this.selectionSubscription = {
            name: viewModel.viewName,
            callback: this.processSelectionUpdate
        };

        this.activityRunUpdateSubscription = {
            name: viewModel.viewName,
            callback: this._eventHandler
        };

        this.activityRunDetails = ko.observableArray<IActivityRunAttempt>();
        this.pipeline = ko.observable<Encodable.PipelineEncodable>();
        this.activity = ko.observable<Encodable.ActivityEncodable>();
        this.runRecordsExist = ko.observable<boolean>(false);
        this.logIcon = ko.observable<string>(Svg.logs);
        this.collapseUpIcon = ko.observable<string>(Svg.collapseUp);
        this.collapseDownIcon = ko.observable<string>(Svg.collapseDown);

        this._appContext.selectionHandler.register(this.selectionSubscription);
        this._appContext.activityRunUpdateHandler.register(this.activityRunUpdateSubscription);

        this.refreshButton = new Framework.Command.ObservableCommand({
            icon: Framework.Svg.refresh,
            tooltip: ClientResources.activityRunDetailsRefreshTooltip,
            onclick: () => {
                this.cancelTimeout();
                this.refreshPane();
            }
        });

        this.loading(false);

        // Setup calendar for the activity runs.
        this.statusCalendar = new StatusCalendar.StatusCalendar(this._lifetimeManager, {
            size: 1
        });

        this.isEmpty = ko.pureComputed(() => { return this.activityWindow() === null; });

        let observableArray: KnockoutObservableArray<ActivityWindowCache.Encodable> = <KnockoutObservableArray<ActivityWindowCache.Encodable>>ko.observableArray();

        this._lifetimeManager.registerForDispose(ko.computed(() => {
            observableArray(<ActivityWindowCache.Encodable[]>(!this.isEmpty() ? [new ActivityWindowCache.Encodable(this.activityWindow())] : []));
        }));

        // create the toolbar
        this.activityRunDetailsToolbar = new ActivityRunDetailsToolbar.ActivityRunDetailsToolbarViewModel(this._lifetimeManager, this);
    }

    // cancels an existing refresh
    public cancelTimeout() {
        if (this._refreshTimeout) {
            clearTimeout(this._refreshTimeout);
        }
    }

    public setupCalendar(activityRunObservable: ActivityWindowCache.IActivityWindowObservable): void {
        let calendarUpdateConfig: StatusCalendar.IStatusCalendarUpdate = null;
        if (activityRunObservable) {

            let activityRun = activityRunObservable();
            let splitDataFactoryId = this._appContext.splitFactoryId();
            let tableEntityView = this._appContext.armDataFactoryCache.tableCacheObject.createView();
            this.statusCalendar.loading(Loader.LoadingState.BlockingUiLoading);

            tableEntityView.fetch({
                subscriptionId: splitDataFactoryId.subscriptionId,
                resourceGroupName: splitDataFactoryId.resourceGroupName,
                factoryName: splitDataFactoryId.dataFactoryName,
                tableName: this._tableName
            }).then((table: MdpExtension.DataModels.DataArtifact) => {
                let frequency: string = table.properties().availability().frequency();
                let interval: number = table.properties().availability().interval();
                let returnData = StatusCalendar.findCorrectFrequencyAndInterval(frequency, interval);
                this._frequency = <string>returnData[0];
                this._interval = <number>returnData[1];
                let footer = ko.pureComputed<string[]>(() => {
                    return ["{0} - {1}".format(this.activityWindow()().windowStartPair.UTC, this.activityWindow()().windowEndPair.UTC)];
                });

                calendarUpdateConfig = {
                    footer: footer,
                    frequency: this._frequency,
                    interval: this._interval,
                    baseDate: new Date(activityRun.windowStart),
                    pageCallback: Util.curry(this.calendarPageCallback, this, activityRun),
                    dateRange: this._appContext.dateRange()
                };
                this.statusCalendar.update(calendarUpdateConfig);
                this.statusCalendar.updateSelection(calendarUpdateConfig.baseDate);
            }, (reason: JQueryXHR) => {
                logger.logError("Failed to fetch table: {0}".format(reason.responseText));
            });
        } else {
            // TODO paverma Evaluate if a another loading state is also needed, after approval of the failed one.
            this.statusCalendar.loading(Loader.LoadingState.Failed);
        }
    }

    public calendarPageCallback(activityWindow: ActivityWindowModel.IActivityWindowParameters, dateRange: DateTime.IDateRange): Q.Promise<StatusCalendar.IStatusBox[]> {
        let deferred = Q.defer<StatusCalendar.IStatusBox[]>();

        let filter = "{0} eq '{1}' and {2} eq '{3}' and {4} le {5} and {5} le {6}"
            .format(ActivityWindowModel.ServiceColumnNames.ExtendedProperties.PipelineName, activityWindow.pipelineName,
            ActivityWindowModel.ServiceColumnNames.ExtendedProperties.ActivityName, activityWindow.activityName,
            dateRange.startDate.toISOString(), ActivityWindowModel.ServiceColumnNames.ExtendedProperties.WindowStart,
            dateRange.endDate.toISOString());

        this._appContext.activityWindowCache.fetchTop(filter, "WindowStart asc", 200)
            .then((activityRunPrimaryEvents) => {
                let statusBoxes: StatusCalendar.IStatusBox[] = [];
                activityRunPrimaryEvents.forEach((primaryEvent) => {
                    let statusBox: StatusCalendar.IStatusBox = <StatusCalendar.IStatusBox>{
                        date: new Date(primaryEvent().windowStart),
                        status: ko.pureComputed(() => { return primaryEvent().statusCalendarStatus; }),
                        tooltip: ko.pureComputed(() => {
                            return ClientResources.statusCalendarBoxTooltip.format(primaryEvent().displayState, primaryEvent().windowStartPair.UTC, primaryEvent().windowEndPair.UTC);
                        }),
                        clickCallback: (currentStatusBox: StatusCalendar.IStatusBox) => {
                            // Build the activityRunParams that would be pushed into the selection.
                            this.activityWindow(primaryEvent);

                            this._appContext.selectionHandler.pushState
                                (viewModel.viewName, [new ActivityWindowCache.Encodable(primaryEvent)]);
                            // Update the current state of activityRunDetails part
                            this.statusCalendar.updateSelection(currentStatusBox.date);
                            this._sliceId = DateTime.getIso8601DateString(primaryEvent().windowStart);

                            this.showAttemptsList();
                            this.setupUpstreamActivityWindows();
                        }
                    };
                    if (statusBoxes.length > 0 && statusBoxes[statusBoxes.length - 1].date.getTime() === statusBox.date.getTime()) {
                        statusBoxes.pop();
                    }
                    statusBoxes.push(statusBox);
                });
                deferred.resolve(statusBoxes);
            }, (reason: JQueryXHR) => {
                logger.logError("Failed to retrieve activityruns: {0}".format(reason.responseText));
                throw reason;
            });

        return deferred.promise;
    }

    public setupUpstreamActivityWindows(): void {
        this.upstreamActivityWindows.removeAll();
        let splitDataFactoryId = this._splitDataFactoryId(),
            activityWindow = this.activityWindow()();

        // TODO tilarden: currently we're using the 'list upstream slices of interest' API to get this data.
        // This will be switched to a 'list upstream activity windows of interest' call when the API is supported.
        let baseUrlParams: ArmService.ISliceResourceBaseUrlParams = {
            subscriptionId: splitDataFactoryId.subscriptionId,
            resourceGroupName: splitDataFactoryId.resourceGroupName,
            factoryName: splitDataFactoryId.dataFactoryName,
            tableName: activityWindow.outputDatasets[0], // any output dataset name can be used.
            slicesStart: DateTime.getIso8601DateString(activityWindow.windowStart),
            slicesEnd: DateTime.getIso8601DateString(activityWindow.windowEnd)
        };

        this._appContext.armService.listUpstreamSlicesOfInterest(baseUrlParams).then(
            (response: ArmService.IStandardResponse<ArmService.IDependency[]>) => {
                let sliceSets = response.value;
                sliceSets.forEach((sliceSet: ArmService.IDependency) => {
                    // The slices are sorted by the backend, hence we're using the first slice's state as the aggregate value.
                    let aggregateState = sliceSet.slices[0].state;

                    let displaySlices = sliceSet.slices.map((slice) => {
                        let windowState: string;
                        let windowSubstate: string;
                        let windowStateModel = ActivityWindowModel.States[slice.state];
                        let windowSubstateModel: ActivityWindowModel.ISubstate;

                        if (windowStateModel) {
                            windowState = windowStateModel.displayName;
                            if (windowStateModel.substates) {
                                windowSubstateModel = windowStateModel.substates[slice.substate];
                                windowSubstate = windowSubstateModel ? windowSubstateModel.displayName : slice.substate;
                            }
                        } else {
                            windowState = slice.state;
                            windowSubstate = slice.substate;
                        }

                        let displayState = !windowSubstate ?
                            windowState : "{0}: {1}".format(windowState, windowSubstate);

                        return {
                            start: DateTime.getUtcTime(slice.start),
                            end: DateTime.getUtcTime(slice.end),
                            status: displayState,
                            icon: ActivityWindowHelper.getStateIcon(slice.state)
                        };
                    });

                    this.upstreamActivityWindows.push(<IUpstreamActivityWindow>{
                        tableName: sliceSet.tableName,
                        slices: displaySlices,
                        isExpanded: ko.observable(false),
                        icon: ko.observable<string>(ActivityWindowHelper.getStateIcon(aggregateState))
                    });
                });

                // automatically expand the first item in the list.
                if (this.upstreamActivityWindows().length > 0) {
                    this.upstreamActivityWindows()[0].isExpanded(true);
                }
            });
    }

    public dispose(): void {
        super.dispose();
        this._appContext.selectionHandler.unregister(this.selectionSubscription);
        this._appContext.activityRunUpdateHandler.unregister(this.activityRunUpdateSubscription);
    }
}
