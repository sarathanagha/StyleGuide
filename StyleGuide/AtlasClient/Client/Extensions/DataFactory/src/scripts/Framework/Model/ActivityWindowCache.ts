import ActivityModel = require("./Contracts/Activity");
import AppContext = require("../../AppContext");
import ActivityWindowModel = require("./Contracts/ActivityWindow");
import ArmService = require("../../Services/AzureResourceManagerService");
import BaseEncodable = require("./Contracts/BaseEncodable");
import LinkedServiceModel = require("./Contracts/LinkedService");
import Log = require("../Util/Log");
import PipelineModel = require("./Contracts/Pipeline");
import DateTime = require("../Util/Datetime");
import ActivityWindowHelper = require("./Helpers/ActivityWindowHelper");
import Util = require("../Util/Util");
import StatusCalendar = require("../UI/StatusCalendar");
import TableModel = require("./Contracts/DataArtifact");

"use strict";

let logger = Log.getLogger({
    loggerName: "ActivityWindowCache"
});

export type IActivityWindowObservable = KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>;

export class Encodable extends BaseEncodable.BaseEncodable {
    public observable: IActivityWindowObservable;

    constructor(activityWindow: IActivityWindowObservable) {
        super(BaseEncodable.EncodableType.ACTIVITY_RUN, activityWindow().reservedId);
        this.observable = activityWindow;
    }
}

export function getReservedId(activityWindow: ActivityWindowModel.IActivityWindow): string {
    return [activityWindow.dataFactoryName, activityWindow.pipelineName,
        activityWindow.activityName, activityWindow.windowStart, activityWindow.windowEnd].join("-").toLowerCase();
}

export function getStateId(activityWindow: ActivityWindowModel.IActivityWindow): string {
    return activityWindow.duration + activityWindow.percentComplete + activityWindow.runAttempts +
        activityWindow.runEnd + activityWindow.runStart + activityWindow.windowState + activityWindow.windowSubstate;
}

export class ActivityWindowCache {
    private static _defaultTop: number = 200;
    public _appContext: AppContext.AppContext;
    private _activityWindowCache: StringMap<KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>> = {};
    private _pageContext: { [viewName: string]: string } = {};

    constructor(appContext: AppContext.AppContext) {
        this._appContext = appContext;
    }

    public clearPageContext(viewName: string): void {
        if (viewName in this._pageContext) {
            delete this._pageContext[viewName];
        }
    }

    public hasNextPage(viewName: string): boolean {
        return Util.propertyHasValue(this._pageContext[viewName]);
    }

    /* Fetches a page of data, and stores the page context using the specified viewName.
     * This allows the same view to ask for the next page if it exists.
     */
    public fetchPage(viewName: string, filter?: string, orderBy?: string): Q.Promise<IActivityWindowObservable[]> {
        let deferred = Q.defer<IActivityWindowObservable[]>();

        filter = this.applyGlobalFilter(filter);
        let queryParameters: ArmService.IMonitoringServiceParams = {
            filter: filter,
            orderby: orderBy
        };

        if (viewName in this._pageContext) {
            // This viewName has already asked for a page.
            let nextLink: string = this._pageContext[viewName];
            if (nextLink === null) {
                deferred.resolve([]);
                return deferred.promise;
            }
            this.fetch(deferred, false, nextLink, queryParameters, viewName);
        } else {
            // Return the first page and add an entry to _pageContext.
            this.fetch(deferred, false, null, queryParameters, viewName);
        }

        return deferred.promise;
    }

    // Fetches the top n items from the service - nextLinks will be continually fetched until all the data is received.
    public fetchTop(filter: string, orderBy: string, top: number): Q.Promise<IActivityWindowObservable[]> {
        let deferred = Q.defer<KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>[]>();

        filter = this.applyGlobalFilter(filter);
        let queryParameters: ArmService.IMonitoringServiceParams = {
            filter: filter,
            orderby: orderBy,
            top: top ? top : ActivityWindowCache._defaultTop
        };

        this.fetch(deferred, true, null, queryParameters, null);
        return deferred.promise;
    }

    // Updates all of the static elements of the activity window object to a waiting state.
    public waitForUpdate(activityWindowObservable: IActivityWindowObservable) {
        let activityWindow = activityWindowObservable();
        activityWindow.waiting = true;
        activityWindow.windowState = ClientResources.statusWaiting;
        activityWindow.statusCalendarStatus = StatusCalendar.StatusBoxState.inprogress;
        activityWindow.displayStateHtml = ActivityWindowHelper.updateStateHtml(activityWindow.windowState, activityWindow.displayState);
        activityWindow.copyPairs = new ActivityWindowHelper.ActivityWindowCopyPairs(activityWindow);

        // Trigger update to all of the view models
        activityWindowObservable(activityWindow);
    }

    protected processData(activityWindows: ActivityWindowModel.IActivityWindow[]): IActivityWindowObservable[] {
        let resultActivityWindowParameters: IActivityWindowObservable[] = [],
            numNew: number = 0,
            numCached: number = 0,
            numNoChange: number = 0;

        activityWindows.forEach((activityWindow: ActivityWindowModel.IActivityWindow) => {
            let reservedId = getReservedId(activityWindow);
            let stateId = getStateId(activityWindow);

            let activityWindowObservable: IActivityWindowObservable = this._activityWindowCache[reservedId];
            if (Util.koPropertyHasValue(activityWindowObservable)) {
                // If the cached object is up-to-date, return it directly.
                if (stateId === activityWindowObservable().stateId) {
                    resultActivityWindowParameters.push(activityWindowObservable);
                    numNoChange++;
                    return;
                }
                numCached++;
            } else {
                // Create a new observable and add it to the cache
                activityWindowObservable = ko.observable(null);
                this._activityWindowCache[reservedId] = activityWindowObservable;
                numNew++;
            }

            let pipeline = new PipelineModel.Encodable(activityWindow.pipelineName);
            let entities: BaseEncodable.EncodableSet = new BaseEncodable.EncodableSet();
            let activityEncodable = new ActivityModel.Encodable(activityWindow.pipelineName, activityWindow.activityName);

            entities.add(pipeline);
            entities.add(activityEncodable);
            activityWindow.outputDatasets.forEach((outputDataset) => {
                entities.add(new TableModel.Encodable(outputDataset));
            });

            if (activityWindow.linkedServiceName) {
                entities.add(new LinkedServiceModel.Encodable(activityWindow.linkedServiceName));
            }

            let windowState: string;
            let windowSubstate: string;
            let windowStateModel = ActivityWindowModel.States[activityWindow.windowState];
            let windowSubstateModel: ActivityWindowModel.ISubstate;

            if (windowStateModel) {
                windowState = windowStateModel.displayName;
                if (windowStateModel.substates) {
                    windowSubstateModel = windowStateModel.substates[activityWindow.windowSubstate];
                    windowSubstate = windowSubstateModel ? windowSubstateModel.displayName : activityWindow.windowSubstate;
                }
            } else {
                windowState = activityWindow.windowState;
                windowSubstate = activityWindow.windowSubstate;
            }

            let displayState = !windowSubstate ? windowState : "{0}: {1}".format(windowState, windowSubstate);
            let stateDescription: string = ActivityWindowHelper.getStateDescription(windowStateModel, windowSubstateModel, displayState);

            let statusCalendarStatus = ActivityWindowHelper.createStatusCalendarStatus(activityWindow);

            let runEnd: string;
            let runStart: string;
            let duration: string;

            switch (activityWindow.windowState) {
                case ActivityWindowModel.States.InProgress.name:
                    runEnd = ClientResources["emptyFieldPlaceholder"];
                    runStart = ActivityWindowHelper.getFormattedDate(activityWindow.runStart, false);
                    duration = DateTime.durationToExactString(new Date().getTime() - new Date(activityWindow.runStart).getTime());
                    break;
                case ActivityWindowModel.States.Waiting.name:
                    runEnd = ClientResources.emptyFieldPlaceholder;
                    runStart = ClientResources.emptyFieldPlaceholder;
                    duration = ClientResources.emptyFieldPlaceholder;
                    break;
                default:
                    runEnd = ActivityWindowHelper.getFormattedDate(activityWindow.runEnd, false);
                    runStart = ActivityWindowHelper.getFormattedDate(activityWindow.runStart, false);
                    duration = DateTime.durationToExactString(new Date(activityWindow.runEnd).getTime() - new Date(activityWindow.runStart).getTime());
            }

            let windowStart = ActivityWindowHelper.getFormattedDate(activityWindow.windowStart, false);
            let windowEnd = ActivityWindowHelper.getFormattedDate(activityWindow.windowEnd, false);

            let emptyPlaceHolder = ClientResources.emptyFieldPlaceholder;
            let runEndPair = runEnd !== emptyPlaceHolder ?
                DateTime.getTimePair(activityWindow.runEnd) : { local: emptyPlaceHolder, UTC: emptyPlaceHolder };
            let runStartPair = runStart !== emptyPlaceHolder ?
                DateTime.getTimePair(activityWindow.runStart) : { local: emptyPlaceHolder, UTC: emptyPlaceHolder };
            let windowStartPair = DateTime.getTimePair(activityWindow.windowStart);
            let windowEndPair = DateTime.getTimePair(activityWindow.windowEnd);
            let windowPair = {
                local: "{0} - {1}".format(windowStartPair.local, windowEndPair.local),
                UTC: "{0} - {1}".format(windowStartPair.UTC, windowEndPair.UTC)
            };

            let activityWindowParameters: ActivityWindowModel.IActivityWindowParameters = {
                activityName: activityWindow.activityName,
                activityType: activityWindow.activityType,
                copyPairs: null,
                dataFactoryName: activityWindow.dataFactoryName,
                displayState: displayState,
                displayStateHtml: ActivityWindowHelper.updateStateHtml(activityWindow.windowState, displayState),
                duration: duration,
                entities: entities,
                inputDatasetIds: activityWindow.inputDatasetIds,
                inputDatasets: activityWindow.inputDatasets,
                linkedServiceName: activityWindow.linkedServiceName,
                outputDatasetIds: activityWindow.outputDatasetIds,
                outputDatasets: activityWindow.outputDatasets,
                percentComplete: activityWindow.percentComplete,
                pipelineName: activityWindow.pipelineName,
                reservedId: reservedId,
                resourceGroupName: activityWindow.resourceGroupName,
                runAttempts: activityWindow.runAttempts,
                runEnd: runEnd,
                runEndPair: runEndPair,
                runStart: runStart,
                runStartPair: runStartPair,
                stateDescription: stateDescription,
                stateId: stateId,
                statusCalendarStatus: statusCalendarStatus,
                waiting: false,
                windowEnd: windowEnd,
                windowEndPair: windowEndPair,
                windowPair: windowPair,
                windowStart: windowStart,
                windowStartPair: windowStartPair,
                windowState: windowState,
                windowSubstate: windowSubstate
            };

            activityWindowParameters.copyPairs = new ActivityWindowHelper.ActivityWindowCopyPairs(activityWindowParameters);

            activityWindowObservable(activityWindowParameters);
            resultActivityWindowParameters.push(activityWindowObservable);
        });

        logger.logDebug("Returning {0} activity windows ({1} new, {2} cached with new info, {3} completely cached)."
            .format(resultActivityWindowParameters.length, numNew, numCached, numNoChange));

        return resultActivityWindowParameters;
    }

    private fetch(
        deferred: Q.Deferred<KnockoutObservable<ActivityWindowModel.IActivityWindowParameters>[]>,
        fetchAllPages: boolean,
        nextLink: string,
        queryParameters: ArmService.IMonitoringServiceParams,
        viewName: string): void {

        let splitFactoryId = this._appContext.splitFactoryId();
        this._appContext.armService.listActivityWindows({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        }, queryParameters, nextLink, fetchAllPages).then((response) => {
            if (viewName !== null && viewName !== "") {
                this._pageContext[viewName] = response.nextLink ? response.nextLink : null;
            }
            deferred.resolve(this.processData(response.value));
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to fetch activity windows for factory {0} with args {1}. Reason: {2}.".format(
                this._appContext.factoryId(), JSON.stringify(queryParameters), JSON.stringify(reason)));
            this._appContext.errorHandler.makeResourceFailedHandler("Activity Windows")(reason);
        });
    }

    private applyGlobalFilter(filter: string): string {
        if (filter === null || filter === "") {
            return this._appContext.globalActivityWindowFilter();
        } else {
            return "({0}) and ({1})".format(filter, this._appContext.globalActivityWindowFilter());
        }
    }
}
