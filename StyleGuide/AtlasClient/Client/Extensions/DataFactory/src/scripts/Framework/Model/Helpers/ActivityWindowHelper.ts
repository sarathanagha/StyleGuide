/// <reference path="../../../../References.d.ts" />

import ActivityWindowModel = require("../Contracts/ActivityWindow");
import CopyBinding = require("../../../../bootstrapper/CopyBinding");
import Log = require("../../Util/Log");
import StatusCalendar = require("../../UI/StatusCalendar");
import Svg = require("../../../../_generated/Svg");

"use strict";

let logger = Log.getLogger({
    loggerName: "ActivityWindowHelper"
});

export let CoercedActivityRunStatus = {};
CoercedActivityRunStatus[ActivityWindowModel.States.Ready.name] = StatusCalendar.StatusBoxState.success;
CoercedActivityRunStatus[ActivityWindowModel.States.Failed.name] = StatusCalendar.StatusBoxState.failed;
CoercedActivityRunStatus[ActivityWindowModel.States.InProgress.name] = StatusCalendar.StatusBoxState.inprogress;
CoercedActivityRunStatus[ActivityWindowModel.States.Waiting.name] = StatusCalendar.StatusBoxState.waiting;
CoercedActivityRunStatus[ActivityWindowModel.States.None.name] = StatusCalendar.StatusBoxState.missing;
CoercedActivityRunStatus[ActivityWindowModel.States.Skipped.name] = StatusCalendar.StatusBoxState.missing;

export class ActivityWindowCopyPairs {
    public pipeline: CopyBinding.ICopyBindingValue;
    public activity: CopyBinding.ICopyBindingValue;
    public displayState: CopyBinding.ICopyBindingValue;
    public activityType: CopyBinding.ICopyBindingValue;
    public attempts: CopyBinding.ICopyBindingValue;
    public runStart: CopyBinding.ICopyBindingValue;
    public runEnd: CopyBinding.ICopyBindingValue;
    public windowStart: CopyBinding.ICopyBindingValue;
    public windowEnd: CopyBinding.ICopyBindingValue;
    public duration: CopyBinding.ICopyBindingValue;
    public complete: CopyBinding.ICopyBindingValue;

    private _rowValue: string;

    private createPairs(label: string, value: string) {
        return [{ label: label, value: value }, { label: ClientResources.entireRowCopyLabel, value: this._rowValue }];
    }

    constructor(activityWindow: ActivityWindowModel.IActivityWindowParameters) {
        this._rowValue = [
            activityWindow.pipelineName,
            activityWindow.activityName,
            activityWindow.windowStartPair.UTC,
            activityWindow.windowEndPair.UTC,
            activityWindow.windowState,
            activityWindow.activityType,
            activityWindow.runStart,
            activityWindow.runEnd,
            activityWindow.duration,
            activityWindow.runAttempts]
            .join("\t");

        this.pipeline = this.createPairs(ClientResources.pipelineNameCopyLabel, activityWindow.pipelineName);
        this.activity = this.createPairs(ClientResources.activityNameCopyLabel, activityWindow.activityName);
        this.windowStart = this.createPairs(ClientResources.windowStartCopyLabel, activityWindow.windowStartPair.UTC);
        this.windowEnd = this.createPairs(ClientResources.windowEndCopyLabel, activityWindow.windowEndPair.UTC);
        this.displayState = this.createPairs(ClientResources.statusCopyLabel, activityWindow.displayState);
        this.activityType = this.createPairs(ClientResources.typeCopyLabel, activityWindow.activityType);
        this.runStart = this.createPairs(ClientResources.attemptStartCopyLabel, activityWindow.runStart);
        this.runEnd = this.createPairs(ClientResources.attemptEndCopyLabel, activityWindow.runEnd);
        this.duration = this.createPairs(ClientResources.durationCopyLabel, activityWindow.duration);
        this.attempts = this.createPairs(ClientResources.attemptsCopyLabel, activityWindow.runAttempts.toLocaleString());
    }
}

export function getStateIcon(windowState: string): string {
    let svg: string;

    switch (windowState) {
        // a progress ring icon is displayed for activity windows that have been recently rerun
        case ClientResources.statusWaiting:
            svg = Svg.progressRing;
            break;

        case ActivityWindowModel.States.Ready.name:
            svg = Svg.statusReady;
            break;

        case ActivityWindowModel.States.Failed.name:
            svg = Svg.statusFailed;
            break;

        case ActivityWindowModel.States.Waiting.name:
            svg = Svg.statusWaiting;
            break;

        case ActivityWindowModel.States.InProgress.name:
            svg = Svg.statusInProgress;
            break;

        case ActivityWindowModel.States.None.name:
            svg = Svg.statusNone;
            break;

        case ActivityWindowModel.States.Skipped.name:
            svg = Svg.statusSkipped;
            break;

        default:
            logger.logError("Unrecognized window state: " + windowState);
            svg = Svg.statusStarting;
    }

    return svg;
}

export function updateStateHtml(windowState: string, displayState: string): string {
    let svg: string = getStateIcon(windowState);
    return "<div class = \"row\">" +
                "<div class = \"adf-statusImage\">" + svg + "</div>" +
                "<div>" + displayState + "</div>" +
            "</div>";
}

export function createStatusCalendarStatus (activityWindow: ActivityWindowModel.IActivityWindow): string {
    let status = CoercedActivityRunStatus[activityWindow.windowState];

    if (!status) {
        logger.logError("Unhandled window status for status calendar: " + activityWindow.windowState);
    }

    return status;
}

/* This function attempts to return the most specific state description,
 * given the known states and substates in the ActivityWindowModel.
 */
export function getStateDescription(state: ActivityWindowModel.IState, substate: ActivityWindowModel.ISubstate, displayState: string) {
    if(substate) {
        return substate.description;
    } else if(state && state.description) {
        return state.description;
    } else {
        return displayState;
    }
}

export function getFormattedDate(dateString: string, relativeFormat: boolean): string {
    let dateMoment = moment(dateString);

    if (!dateMoment.isValid()) {
        return dateString;
    }

    if (relativeFormat) {
        return dateMoment.fromNow();
    } else {
        return dateMoment.format("MM/DD/YYYY hh:mm:ss A");
    }
}
