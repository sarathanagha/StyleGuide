import BaseEncodable = require("./BaseEncodable");
import Common = require("./Common");

export function getPipelineKey(pipelineName: string): string {
    return "P" + pipelineName.toUpperCase();
}

export class Encodable extends BaseEncodable.BaseEncodable {
    public name: string;

    constructor(name: string) {
        // Ideally the toUpperCase here would match CLR's String.ToUpperInvariant()
        // which is in line with string.Equals(other, StringComparison.OrdinalIgnoreCase)
        // used for data factory identifiers. However, it is up to browser implementation,
        // but this is the best we have.
        super(BaseEncodable.EncodableType.PIPELINE, name.toUpperCase());
        this.name = name;
    }

    public getLegacyKey(): string {
        return getPipelineKey(this.name);
    }
}

// TODO paverma Backend intends to introduce the concept of type of pipeline. Bring it in sync then.
/* tslint:disable:no-internal-module variable-name */
export module PipelineType {
    export const Default = "Default";
    export const SSIS = "SSISPipeline";
}
/* tslint:enable:no-internal-module variable-name */

/* tslint:disable:no-internal-module variable-name */
export module PipelineMode {
    export const Scheduled = "Scheduled";
    export const OneTime = "OneTime";
}
/* tslint:enable:no-internal-module variable-name */

/* tslint:disable:no-internal-module variable-name */
export module PipelineSchedulerExecutionStyle {
    export const StartOfInterval = "StartOfInterval";
    export const EndOfInterval = "EndOfInterval";
}
/* tslint:enable:no-internal-module variable-name */

export enum OneTimePipelineFilterState {
    Loaded,     // The filter has been loaded.
    Evaluating, // Still loading the filter.
    None        // There are no one time pipelines.
}

export interface IOneTimePipelineFilter {
    filterState: OneTimePipelineFilterState;
    filter?: string;
}

/* tslint:disable:no-internal-module variable-name */
export module PipelineStatusName {
    export let paused = "paused";
    export let active = "active";
    export let idle = "idle";
    export let failed = "failed";
}
/* tslint:enable:no-internal-module variable-name */

/* tslint:disable:no-internal-module variable-name */
export let PipelineStatusDisplayName: StringMap<string> = {};
PipelineStatusDisplayName[PipelineStatusName.paused] = ClientResources.pausedPipelineStatusText;
PipelineStatusDisplayName[PipelineStatusName.active] = ClientResources.activePipelineStatusText;
PipelineStatusDisplayName[PipelineStatusName.idle] = ClientResources.idlePipelineStatusText;
PipelineStatusDisplayName[PipelineStatusName.failed] = ClientResources.failedProvisioningStatusText;
/* tslint:enable:no-internal-module variable-name */

// This will later also use the pipeline state property.
export function getPipelineStatus(provisioningState: string, isPaused: boolean): string {
    if (provisioningState === Common.ProvisioningState.Failed || provisioningState === Common.ProvisioningState.Disabled) {
        return PipelineStatusName.failed;
    }
    if (isPaused) {
        return PipelineStatusName.paused;
    }
    return PipelineStatusName.active;
}

export function getNextScheduledWindowTime(pipeline: MdpExtension.DataModels.BatchPipeline, currentDate: Date): Date {
    let activities = pipeline.properties().activities;
    if (!activities || getPipelineStatus(pipeline.properties().provisioningState(), pipeline.properties().isPaused()) !== PipelineStatusName.active
        || !pipeline.properties().start || !pipeline.properties().end ) {
        return null;
    }

    let startDate = new Date(pipeline.properties().start());
    let endDate = new Date(pipeline.properties().end());

    let activityDates: Date[] = [];
    activities().forEach((activity) => {
        // Logic from backend. Will be using this till we get an api.
        // $\Data Pipeline\Main\Product\Common\Coordination\src\CoordinationContracts\ObjectModel\DataSlice\DataSlice.cs
        let scheduler = activity.scheduler();
        let offset = moment.duration(0);

        if (scheduler.offset) {
            offset = moment.duration(scheduler.offset());
        }

        let tmoment: moment.Moment = null;
        tmoment = moment.utc(startDate);
        tmoment.subtract(offset);
        tmoment.startOf(scheduler.frequency());

        // Ignoring anchor date time.

        tmoment.add(offset);
        if (tmoment.valueOf() > startDate.getTime()) {
            tmoment.subtract(scheduler.interval(), scheduler.frequency());
        }

        if (!(scheduler.style && scheduler.style() === PipelineSchedulerExecutionStyle.StartOfInterval)) {
            tmoment.add(scheduler.interval(), scheduler.frequency());
        }

        let nextExecutionDate = upperBoundDate(tmoment.toDate(), currentDate, scheduler.frequency(), scheduler.interval());
        if (nextExecutionDate.getTime() < currentDate.getTime()) {
            nextExecutionDate = moment(nextExecutionDate).add(scheduler.interval(), scheduler.frequency()).toDate();
        }

        if (startDate.getTime() <= nextExecutionDate.getTime() && nextExecutionDate.getTime() < endDate.getTime()) {
            activityDates.push(nextExecutionDate);
        } else {
            activityDates.push(null);
        }
    });

    let nextScheduledExecution = activityDates.reduce((prevDate, curDate) => {
        if (prevDate === null) {
            return curDate;
        }
        if (curDate === null) {
            return prevDate;
        }
        return prevDate.getTime() < curDate.getTime() ? prevDate : curDate;
    });

    return nextScheduledExecution;
}

// Add x times interval, frequency to curDate such that curDate <= upperBound
function upperBoundDate(curDate: Date, upperBound: Date, frequency: string, interval: number): Date {
    let curMoment = moment.utc(curDate), upperBoundMillis = upperBound.getTime(), bestUpperBound = curDate.getTime();
    let start = -100000, end = 100000, mid = 0;
    while (start <= end) {
        mid = Math.floor((start + end) / 2);
        let tempMoment = curMoment.clone().add(mid * interval, frequency).valueOf();

        if (tempMoment <= upperBoundMillis) {
            bestUpperBound = tempMoment;
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return new Date(bestUpperBound);
}
