/// <reference path="../../References.d.ts" />

import ActivityWindow = require("../Framework/Model/Contracts/ActivityWindow");
/* tslint:disable:no-unused-variable */
import Framework = require("../../_generated/Framework");
/* tslint:enable:no-unused-variable */
import Filter = Framework.Filter;
import MessageHandler = require("./MessageHandler");
import View = Framework.MonitoringView;
import Log = Framework.Log;
import RoutingHandler = require("./RoutingHandler");

"use strict";
let logger = Log.getLogger({
    loggerName: "MonitoringViewHandler"
});

export class MonitoringViewHandler extends MessageHandler.MessageHandler<string> {
    static className: string = "MonitoringViewHandler";
    static systemViewNames = {
        recent: "Recent",
        failed: "Failed",
        inProgress: "InProgress"
    };

    static sortColumnNames = ActivityWindow.ServiceColumnNames.ExtendedProperties;
    static sortAscending: string = "asc";
    static sortDescending: string = "desc";

    public extendedProperties = ActivityWindow.ServiceColumnNames.ExtendedProperties;
    public monitoringViews: StringMap<View.MonitoringView> = {};

    private _routingHandler: RoutingHandler.RoutingHandler;
    private _routingHandlerSubscription: RoutingHandler.IRoutingHandlerSubscription;
    private _currentPipelineName: string = null;

    private _handleUrlUpdate = (parsedUrlParams: StringMap<string>): void => {
        let pushNotification: boolean = false;

        let pipelineName = parsedUrlParams[RoutingHandler.urlKeywords.pipeline.value] || null;
        if (pipelineName !== this._currentPipelineName) {
            pushNotification = true;
            this._currentPipelineName = pipelineName;
            if (pipelineName) {
                logger.logDebug("Updating filter because of url for pipeline: " + pipelineName);
                this.setGlobalPipelineFilter(pipelineName);
            } else {
                logger.logDebug("Updating filter because of url");
                this.clearGlobalPipelineFilter();
            }
        }

        let monitoringView = parsedUrlParams[RoutingHandler.urlKeywords.view.value] || MonitoringViewHandler.systemViewNames.recent;
        if (monitoringView !== this.getState()) {
            this.pushState(MonitoringViewHandler.className, monitoringView);
            pushNotification = false;
        }

        if (pushNotification) {
            this.pushNotification();
        }
    };

    constructor(routingHandler: RoutingHandler.RoutingHandler) {
        super();

        // create system filters
        let recentFilter = new Filter.State();
        let failedFilter = new Filter.State();
        failedFilter.filterState().windowStates([
            View.equalityFilterTemplate.format(
                this.extendedProperties.WindowState, ActivityWindow.States.Failed.name)
        ]);
        let inProgressFilter = new Filter.State();
        inProgressFilter.filterState().windowStates([
            View.equalityFilterTemplate.format(
                this.extendedProperties.WindowState, ActivityWindow.States.InProgress.name)
        ]);

        // create system monitoring views
        let recentMonitoringView = new View.MonitoringView(
            View.MonitoringViewType.System,
            MonitoringViewHandler.systemViewNames.recent,
            "Recent activity windows",
            recentFilter,
            new View.Sort(MonitoringViewHandler.sortColumnNames.WindowStart, MonitoringViewHandler.sortDescending)
        );
        let failedMonitoringView = new View.MonitoringView(
            View.MonitoringViewType.System,
            MonitoringViewHandler.systemViewNames.failed,
            "Failed activity windows",
            failedFilter,
            new View.Sort(MonitoringViewHandler.sortColumnNames.WindowStart, MonitoringViewHandler.sortDescending)
        );
        let inProgressMonitoringView = new View.MonitoringView(
            View.MonitoringViewType.System,
            MonitoringViewHandler.systemViewNames.inProgress,
            "In-progress activity windows",
            inProgressFilter,
            new View.Sort(MonitoringViewHandler.sortColumnNames.WindowStart, MonitoringViewHandler.sortDescending)
        );

        this.monitoringViews = {};
        this.monitoringViews[MonitoringViewHandler.systemViewNames.recent] = recentMonitoringView;
        this.monitoringViews[MonitoringViewHandler.systemViewNames.failed] = failedMonitoringView;
        this.monitoringViews[MonitoringViewHandler.systemViewNames.inProgress] = inProgressMonitoringView;

        // Subscribe to routing handler for pipeline param.
        this._routingHandler = routingHandler;
        this._handleUrlUpdate(routingHandler.getState());
        this._routingHandlerSubscription = {
            name: MonitoringViewHandler.className,
            callback: this._handleUrlUpdate
        };
        routingHandler.register(this._routingHandlerSubscription);
    }

    public getSelectedView(): View.MonitoringView {
        return this.monitoringViews[this.getState()];
    }

    /* This method applies a pipeline filter to the system monitoring views.
     * User views are not altered.
     */
    public setGlobalPipelineFilter(pipelineName: string) {
        for(let monitoringViewId in this.monitoringViews) {
            let monitoringView = this.monitoringViews[monitoringViewId];
            if(monitoringView.type === View.MonitoringViewType.System) {
                monitoringView.filter.filterState().pipelineNames(
                    [View.equalityFilterTemplate.format(
                        this.extendedProperties.PipelineName, pipelineName)]);
            }
        }
    }

    // Reverts the changes made by setGlobalPipelineFilter.
    public clearGlobalPipelineFilter() {
        for(let monitoringViewId in this.monitoringViews) {
            let monitoringView = this.monitoringViews[monitoringViewId];
            if(monitoringView.type === View.MonitoringViewType.System) {
                monitoringView.filter.filterState().pipelineNames([]);
            }
        }
    }

    /*
     * Empties the current view's filter settings.
     */
    public clearFilter(): void {
        let selectedView = this.getSelectedView();
        selectedView.filter.clear();
        this.pushNotification();
    }

    public pushNotification() {
        this.pushState(MonitoringViewHandler.className, this.getState());
    }

    public listMonitoringViews(): View.MonitoringView[] {
        let monitoringViewsArray: View.MonitoringView[] = [];
        for(let viewKey in this.monitoringViews) {
            let viewValue = this.monitoringViews[viewKey];
            monitoringViewsArray.push(viewValue);
        }
        return monitoringViewsArray;
    }

    public dispose(): void {
        this._routingHandler.unregister(this._routingHandlerSubscription);
    }
}
