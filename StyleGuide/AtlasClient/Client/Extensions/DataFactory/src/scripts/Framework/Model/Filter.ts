/// <reference path="../../../References.d.ts" />

import ActivityWindowModel = require("./Contracts/ActivityWindow");
import Log = require("../Util/Log");
import Util = require("../Util/Util");

export interface INumberRange {
    min: number;
    max: number;
}

// TODO: consider storing more state/information so that no regex extraction is required to retrieve the data.
export interface IFilterState {
        pipelineNames: KnockoutObservableArray<string>;
        activityNames: KnockoutObservableArray<string>;
        activityTypes: KnockoutObservableArray<string>;
        windowStates: KnockoutObservableArray<string>;
        attemptsRange: KnockoutObservable<INumberRange>;
        durationMsRange: KnockoutObservable<INumberRange>;
        percentageCompleteRange: KnockoutObservable<INumberRange>;
        windowStart: KnockoutObservable<Date>;
        windowEnd: KnockoutObservable<Date>;
}

let logger = Log.getLogger({
    loggerName: "Framework/Model/Filter"
});

// TODO: improve the pattern of retrieving filters.
export class State {
    public filterState: KnockoutObservable<IFilterState>;
    public totalFilterCount: KnockoutComputed<number>;
    public extendedProperties = ActivityWindowModel.ServiceColumnNames.ExtendedProperties;

    constructor(filterState: IFilterState = null) {
        this.filterState = filterState ? ko.observable(filterState) : ko.observable({
            pipelineNames: ko.observableArray<string>(),
            activityNames: ko.observableArray<string>(),
            activityTypes: ko.observableArray<string>(),
            windowStates: ko.observableArray<string>(),
            attemptsRange: ko.observable<INumberRange>(),
            durationMsRange: ko.observable<INumberRange>(),
            percentageCompleteRange: ko.observable<INumberRange>(),
            windowStart: ko.observable<Date>(),
            windowEnd: ko.observable<Date>()
        });
        this.totalFilterCount = ko.pureComputed(() => {
            return  (this.filterState && this.filterState()) ?
                    this.filterState().pipelineNames().length +
                    this.filterState().activityNames().length +
                    this.filterState().windowStates().length +
                    (this.filterState().windowStart() ? 1 : 0) +
                    (this.filterState().windowEnd() ? 1 : 0) : 0;
        });
    }

    public mapColumnToFilterState(column: string) {
        switch(column) {
            case this.extendedProperties.PipelineName:
                return this.filterState().pipelineNames;
            case this.extendedProperties.ActivityName:
                return this.filterState().activityNames;
            case this.extendedProperties.WindowState:
                return this.filterState().windowStates;
            case this.extendedProperties.ActivityType:
                return this.filterState().activityTypes;
            default:
                logger.logDebug("Filter state not found for column: {0}".format(column));
        }
    }

    public mapDateTimeColumnToFilterState(column: string) {
        switch (column) {
            case this.extendedProperties.WindowStart:
                return this.filterState().windowStart;
            case this.extendedProperties.WindowEnd:
                return this.filterState().windowEnd;
            default:
                let errorMessage = "Unexpected column: " + column + " as input to mapDateTimeColumnToFilterState.";
                logger.logError(errorMessage);
                throw new Error("Unexpected column: " + column + " as input to mapDateTimeColumnToFilterState.");
        }
    }

    /*
     * This method converts an IFilterState object into an OData query string.
     */
    public stringify(): string {
        let filter: string;

        let pipelineNames: string[] = this.filterState().pipelineNames();
        let activityNames: string[] = this.filterState().activityNames();
        let activityTypes: string[] = this.filterState().activityTypes();
        let windowStates: string[] = this.filterState().windowStates();
        let attemptsRange: INumberRange = this.filterState().attemptsRange();
        let durationMsRange: INumberRange = this.filterState().durationMsRange();
        let percentageCompleteRange: INumberRange = this.filterState().percentageCompleteRange();

        let extendedProperties = ActivityWindowModel.ServiceColumnNames.ExtendedProperties;
        filter = this.joinFilterArray(pipelineNames);
        filter += this.joinFilterArray(activityNames);
        filter += this.joinFilterArray(activityTypes);
        filter += this.joinFilterArray(windowStates);

        filter += this.stringifyNumberRange(extendedProperties.Attempts, attemptsRange);
        filter += this.stringifyNumberRange(extendedProperties.DurationMs, durationMsRange);
        filter += this.stringifyNumberRange(extendedProperties.PercentageComplete, percentageCompleteRange);

        filter += this.stringifyDate(extendedProperties.WindowStart, this.filterState().windowStart());
        filter += this.stringifyDate(extendedProperties.WindowEnd, this.filterState().windowEnd());

        /* trim the filter,
         * - remove trailing ' and ' if it's there
         * - remove any leading/trailing whitespace
         */
        if(filter.match("^.* and $")) {
            return filter.substr(0, filter.length - 5).trim();
        } else {
            return filter.trim();
        }
    }

    /*
     * Returns true if there are no active filters, else returns false.
     */
    public isEmpty(): boolean {
        for(let property in this.filterState()) {
            let stateProperty = this.filterState()[property];
            if(Util.koPropertyHasValue(stateProperty)) {
                return false;
            }
        }
        return true;
    }

    /*
     * This clears the current filter state, and replaces it with an empty IFilterState instance.
     */
    public clear(): void {
        this.filterState({
            pipelineNames: ko.observableArray<string>(),
            activityNames: ko.observableArray<string>(),
            activityTypes: ko.observableArray<string>(),
            windowStates: ko.observableArray<string>(),
            attemptsRange: ko.observable<INumberRange>(),
            durationMsRange: ko.observable<INumberRange>(),
            percentageCompleteRange: ko.observable<INumberRange>(),
            windowStart: ko.observable<Date>(),
            windowEnd: ko.observable<Date>()
        });
    }

    /*
     * This clears the current filter state for a specific column.
     */
    public clearColumnFilters(property: string): void {
        let stateProperty = this.mapColumnToFilterState(property);
        if (stateProperty) {
            stateProperty([]);
        } else {
            let stateDateProperty = this.mapDateTimeColumnToFilterState(property);
            stateDateProperty(null);
        }
    }

    // This function should only be used when the filterArray contains OData queries.
    private joinFilterArray(filterArray: string[]): string {
        if(filterArray.length > 0) {
            return "(" + filterArray.join(" or ") + ") and ";
        } else {
            return "";
        }
    }

    private stringifyNumberRange(indexName: string, numberRange: INumberRange): string {
        return Util.propertyHasValue(numberRange) ?
            "({0} ge {1} and {0} le {2}) and ".format(indexName, numberRange.min, numberRange.max) :
            "";
    }

    private stringifyDate(indexName: string, date: Date): string {
        if(Util.propertyHasValue(date)) {
            switch(indexName) {
                case this.extendedProperties.WindowStart:
                    return "({0} ge {1}) and ".format(indexName, date.toISOString());
                case this.extendedProperties.WindowEnd:
                    return "({0} le {1}) and ".format(indexName, date.toISOString());
                default:
                    return "";
            }
        } else {
            return "";
        }
    }
}
