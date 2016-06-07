/// <amd-dependency path="text!./Templates/StatusCalendar.html" />
/// <reference path="../../../References.d.ts" />

// https://datafactory.azure.com/?datafactory/edit/subscription/d3bb3b2e-9a7e-4194-9960-5171bd192117/resourcegroup/ADF/datafactory/pavermaStatusCalendarTestCases/
// has pipelines that cover different cases for StatusCalendar.

import Datetime = require("../Util/Datetime");
import Disposable = require("../Shared/Disposable");
import Command = require("./Command");
import Svg = require("../../../_generated/Svg");
import Loader = require("./Loader");
import Log = require("../Util/Log");
import Util = require("../Util/Util");

let logger = Log.getLogger({
    loggerName: "StatusCalendar"
});

let prevDirectionString = "prev";
let nextDirectionString = "next";
let genericLayoutTypeString: string = "Generic";        // Rest are same as Datetime.TimeUnits

// Configurations
let numberOfRowsInMinuteCalendar = 12;
let numberOfRowsInHourCalendar = 7;

let numberOfYearsToShowInARow = 3;
let numberOfRowsInYearCalendar = 4;

export let numberOfDatesInGenericCalendar = 10;
export let numberOfDatesInGenericRow = 4;

let numberOfWeeksInARow: number = 4;
let numberOfWeeksInCalendar: number = 10;

let numberOfMonthsInARow = 3;

export let maxNumberOfSlotsInARow = 24;
export let maxNumberOfSlotsInACalendar = 24 * 7;
export let maxNumberOfSlotsInARowMap = {};
maxNumberOfSlotsInARowMap[Datetime.TimeUnit.Minute] = 4;
maxNumberOfSlotsInARowMap[Datetime.TimeUnit.Hour] = 24;
maxNumberOfSlotsInARowMap[Datetime.TimeUnit.Day] = 7;
maxNumberOfSlotsInARowMap[Datetime.TimeUnit.Week] = 4;
maxNumberOfSlotsInARowMap[Datetime.TimeUnit.Month] = 3;
maxNumberOfSlotsInARowMap[Datetime.TimeUnit.Year] = 4;

// This is in sync with css class which would style the boxes.
export let StatusBoxState = {
    success: "success",
    failed: "failed",
    inprogress: "inprogress",
    waiting: "waiting",
    missing: "missing"         // No info will be shown for this in the calendar. Nor will it be actionable.
};

export interface IStatusBox {
    date: Date;
    displayDate?: Date;     // This can be specified if the date has been modified from the pattern.
    status: KnockoutObservable<string>;
    id?: string;
    clickCallback?: (statusBox: IStatusBox) => void;       // This can be generalized to instead have callbacks for any action.
    doubleClickCallback?: (statusBox: IStatusBox) => void;       // This can be generalized to instead have callbacks for any action.
    boxLabel?: string;
    tooltip?: KnockoutComputed<string>;
    highlight?: KnockoutObservable<boolean>;
}

export interface IStatusCalendarUpdate {
    header?: string;
    subHeader?: string;
    footer: string[] | KnockoutComputed<string[]>;
    frequency: string;
    interval: number;
    isGeneric?: boolean;
    baseDate: Date;         // The calendar will be based on this.
    pageCallback: (dateRange: Datetime.IDateRange) => Q.Promise<IStatusBox[]>;
    dateRange?: Datetime.IDateRange;
    highlightedDates?: KnockoutComputed<number[]>;
}

export interface IStatusCalendarConfig {
    size: number;
}

export enum StatusCalendarUpdateResultEnum {
    complete,
    aborted,
    failed
};

export let UpdateResultString: NumberMap<string> = {};
UpdateResultString[StatusCalendarUpdateResultEnum.complete] = "complete";
UpdateResultString[StatusCalendarUpdateResultEnum.aborted] = "aborted";
UpdateResultString[StatusCalendarUpdateResultEnum.failed] = "failed";

export interface IStatusCalendarUpdateResult {
    result: StatusCalendarUpdateResultEnum;
    reason?: string;
}

export class StatusCalendarPage extends Disposable.ChildDisposable {
    public statusBoxRows: KnockoutObservableArray<IStatusBox[]> = ko.observableArray([]);
    public rowLabels: KnockoutObservableArray<string> = ko.observableArray([]);
    public colLabels: KnockoutObservableArray<string> = ko.observableArray([]);
    public rowSeparatorCount: KnockoutObservable<number> = ko.observable(0);
    public dateRange: Datetime.IDateRange = null;

    public loading: KnockoutObservable<Loader.LoadingState> = ko.observable(Loader.LoadingState.BlockingUiLoading);
    public pageHeader: KnockoutObservable<string> = ko.observable<string>();

    private _highlightedNodesSubscription: Disposable.IDisposableLifetimeManager;

    constructor(lifetimeManager: Disposable.IDisposableLifetimeManager) {
        super(lifetimeManager);
    }

    public calculateLabelsAndSeparator(statusBoxes: IStatusBox[][], frequency: string, interval: number, isGeneric: boolean): void {
        let rowLabels: string[] = [];
        let colLabels: string[] = [];
        let pageHeader: string = "";
        this.rowSeparatorCount(0);

        let firstDate = statusBoxes[0][0].date;
        let lastDate = statusBoxes[statusBoxes.length - 1][statusBoxes[0].length - 1].date;
        let headerSeparator: string = "{0} - {1}";

        if (isGeneric) {
            for (let i = 0; i < statusBoxes.length; i++) {
                rowLabels.push(Datetime.fullDate.format(statusBoxes[i][0].date.getTime()));
            }
            this.rowSeparatorCount(1);
        } else {
            switch (frequency) {
                case Datetime.TimeUnit.Minute:
                    // Add column headers for each, as there will always be very few headers.
                    for (let i = 0; i < statusBoxes[0].length; i++) {
                        colLabels.push(":" + i * interval);
                    }
                    for (let i = 0; i < statusBoxes.length; i++) {
                        rowLabels.push(Datetime.shortHour.format(statusBoxes[i][0].date.getTime()));
                    }
                    this.rowSeparatorCount(1);
                    pageHeader = getConciseDateRangeLabel(firstDate, lastDate);
                    break;

                case Datetime.TimeUnit.Hour:
                    let nCols = statusBoxes[0].length;
                    // For columns have at most 4 headers.
                    let colIncrements = 1;
                    for (let i = 6; i >= 1; i--) {
                        if (nCols % i === 0) {
                            colIncrements = statusBoxes[0].length / i;
                            break;
                        }
                    }
                    for (let i = 0; i < nCols; i += colIncrements) {
                        // This converts 0..12..23 to 1..12 1..12.
                        let tempUTCHours = (i * 24 / nCols + 11) % 12 + 1;
                        let colLabel: string = null;
                        if (tempUTCHours === 12) {
                            colLabel = tempUTCHours.toString() + (i === 0 ? "AM" : "PM");
                        } else {
                            colLabel = tempUTCHours.toString();
                        }
                        colLabels.push(colLabel);
                    }
                    for (let i = 0; i < statusBoxes.length; i += 1) {
                        rowLabels.push(Datetime.shortDate.format(statusBoxes[i][0].date.getTime()));
                    }
                    this.rowSeparatorCount(1);

                    pageHeader = getConciseDateRangeLabel(firstDate, lastDate);
                    break;

                case Datetime.TimeUnit.Day:
                    statusBoxes.forEach((rowStatusBox) => {
                        rowStatusBox.forEach((statusBox) => {
                            statusBox.boxLabel = statusBox.date.getUTCDate().toString();
                        });
                    });

                    statusBoxes[0].forEach((statusBox) => {
                        colLabels.push(Datetime.narowWeekday.format(statusBox.date.getTime()));
                    });

                    pageHeader = Datetime.shortMonthYear.format(firstDate.getTime() + Datetime.timeUnitToMilliseconds[Datetime.TimeUnit.Week]);
                    break;

                case Datetime.TimeUnit.Week:
                    for (let i = 0; i < statusBoxes.length; i++) {
                        let weekStart = statusBoxes[i][0].date;
                        let weekEnd = new Date(weekStart.getTime() + (7 - 1) * Datetime.timeUnitToMilliseconds[Datetime.TimeUnit.Day]);
                        rowLabels.push(getConciseDateRangeLabel(weekStart, weekEnd));

                        if (i === statusBoxes.length - 1) {
                            pageHeader = getConciseDateRangeLabel(statusBoxes[0][0].date, weekEnd);
                        }
                    }
                    this.rowSeparatorCount(1);

                    break;

                case Datetime.TimeUnit.Month:
                    statusBoxes.forEach((rowStatusBox) => {
                        rowStatusBox.forEach((statusBox) => {
                            statusBox.boxLabel = Datetime.shortMonth.format(statusBox.date.getTime());
                        });
                    });
                    pageHeader = Datetime.fullYear.format(firstDate.getTime());
                    break;

                case Datetime.TimeUnit.Year:
                    statusBoxes.forEach((rowStatusBox) => {
                        rowStatusBox.forEach((statusBox) => {
                            statusBox.boxLabel = Datetime.fullYear.format(statusBox.date.getTime());
                        });
                    });
                    pageHeader = headerSeparator.format(Datetime.fullYear.format(firstDate.getTime()),
                        Datetime.fullYear.format(lastDate.getTime()));
                    break;
                default:
                    logger.logError("Unexpected switch statement value: " + frequency);
                    break;
            }
        }

        this.rowLabels(rowLabels);
        this.colLabels(colLabels);
        if (isGeneric) {
            this.pageHeader("");
        } else {
            this.pageHeader(pageHeader);
        }
    }

    public updateHiglightedNodeSubscription(pageData: IStatusBox[][], highlightedNodes: KnockoutComputed<number[]>): void {
        if (this._highlightedNodesSubscription) {
            this._highlightedNodesSubscription.dispose();
        }
        if (highlightedNodes) {
            this._lifetimeManager.registerForDispose(Util.subscribeAndCall(highlightedNodes, (highlightedNodesLocal) => {
                let pageDateMap: StringMap<IStatusBox> = {};
                pageData.forEach((statusBoxRow) => {
                    statusBoxRow.forEach((statusBox) => {
                        pageDateMap[statusBox.date.getTime()] = statusBox;
                        statusBox.highlight = null;
                    });
                });

                highlightedNodesLocal.forEach((highlightedNode) => {
                    let statusBox = pageDateMap[highlightedNode];
                    if (statusBox) {
                        statusBox.highlight = ko.observable(true);
                    }
                });
            }));
        }
    }

    public clean(): void {
        this.statusBoxRows([]);
    }
}

export class StatusCalendar extends Disposable.ChildDisposable {
    static template: string = require("text!./Templates/StatusCalendar.html");
    static statusCalendars: StringMap<StatusCalendar> = {};

    // Details for laying out StatusBox'es.
    public loading: KnockoutObservable<Loader.LoadingState> = ko.observable(Loader.LoadingState.BlockingUiLoading);
    public header: KnockoutObservable<string> = ko.observable<string>();
    public subHeader: KnockoutObservable<string> = ko.observable<string>();
    public footer: KnockoutObservable<string[] | KnockoutComputed<string[]>> = ko.observable<string[] | KnockoutComputed<string[]>>();
    public type: KnockoutObservable<string> = ko.observable<string>();

    public pages: KnockoutObservableArray<StatusCalendarPage> = ko.observableArray<StatusCalendarPage>();
    public nextButtonOptions: Command.ObservableCommand = null;
    public previousButtonOptions: Command.ObservableCommand = null;

    private _currentUpdateLifetimeManager: Disposable.IDisposableLifetimeManager = null;
    private _updateConfig: IStatusCalendarUpdate = null;
    private _refreshId: number = 0;
    private selectedDate: KnockoutObservable<Date> = ko.observable<Date>();

    constructor(lifetimeManager: Disposable.IDisposableLifetimeManager, statusCalendarConfig: IStatusCalendarConfig) {
        super(lifetimeManager);
        this._lifetimeManager = lifetimeManager.createChildLifetime();

        this.nextButtonOptions = new Command.ObservableCommand({
            icon: Svg.rightarrow,
            onclick: () => { this.navigatePage(nextDirectionString); },
            name: "next",
            label: ClientResources.nextButtonText,
            tooltip: ClientResources.nextButtonText
        });

        this.previousButtonOptions = new Command.ObservableCommand({
            icon: Svg.leftarrow,
            onclick: () => { this.navigatePage(prevDirectionString); },
            name: "previous",
            label: ClientResources.previousButtonText,
            tooltip: ClientResources.previousButtonText
        });

        let pages: StatusCalendarPage[] = [];
        for (let i = 0; i < statusCalendarConfig.size; i++) {
            let page = new StatusCalendarPage(this._lifetimeManager);
            pages.push(page);
        }
        this.pages(pages);
    }

    public navigatePage(direction: string): void {
        if (this.loading() !== Loader.LoadingState.Ready) {
            return;
        }

        this.loading(Loader.LoadingState.Loading);
        let currentRefreshId = this._refreshId;
        let baseDate = null;
        if (direction === prevDirectionString) {
            baseDate = getBaseDate(this.pages()[0].dateRange, this._updateConfig.frequency, this._updateConfig.interval, this._updateConfig.isGeneric, false);
        } else if (direction === nextDirectionString) {
            let pages = this.pages();
            baseDate = getBaseDate(pages[pages.length - 1].dateRange, this._updateConfig.frequency, this._updateConfig.interval, this._updateConfig.isGeneric, true);
        }

        if (baseDate) {
            let newPage = new StatusCalendarPage(this._lifetimeManager);
            let dateRange = getStartEndDateRange(baseDate, this._updateConfig.frequency, this._updateConfig.interval, this._updateConfig.isGeneric, true);
            this._updateConfig.pageCallback(dateRange).then((statusBoxes: IStatusBox[]) => {
                if (currentRefreshId !== this._refreshId) {
                    return;
                }
                let pageData: IStatusBox[][] = [];
                try {
                    pageData = sanitizeIncomingData(statusBoxes, dateRange, this._updateConfig.frequency, this._updateConfig.interval, this._updateConfig.isGeneric, true);
                    newPage.dateRange = getPageDateRange(pageData, this._updateConfig.frequency, this._updateConfig.interval);
                } catch (ex) {
                    this.enterFailedState();
                    return;
                }
                newPage.calculateLabelsAndSeparator(pageData, this._updateConfig.frequency, this._updateConfig.interval, this._updateConfig.isGeneric);
                newPage.updateHiglightedNodeSubscription(pageData, this._updateConfig.highlightedDates);
                newPage.statusBoxRows(pageData);

                let pages = this.pages().slice();
                if (direction === prevDirectionString) {
                    pages.pop().dispose();
                    pages.unshift(newPage);
                } else if (direction === nextDirectionString) {
                    pages.shift().dispose();
                    pages.push(newPage);
                }
                this.pages(pages);
                this.disableCalendarNavigationIfOutsideOfRange(pages, this._updateConfig.dateRange);
                this.loading(Loader.LoadingState.Ready);
            }, (reason: JQueryXHR) => {
                this.enterFailedState();
                logger.logError(reason.responseText);
            });
        }
    }

    public update(updateConfig: IStatusCalendarUpdate): Q.Promise<IStatusCalendarUpdateResult> {
        this.loading(Loader.LoadingState.BlockingUiLoading);
        let currentRefreshId = ++this._refreshId;

        let deferred = Q.defer<IStatusCalendarUpdateResult>();
        if (this._currentUpdateLifetimeManager) {
            this._currentUpdateLifetimeManager.dispose();
        }
        this._currentUpdateLifetimeManager = this._lifetimeManager.createChildLifetime();
        this._updateConfig = updateConfig;
        this.header(updateConfig.header);
        this.subHeader(updateConfig.subHeader);
        this.footer(updateConfig.footer);
        this.selectedDate(null);

        let baseDate = updateConfig.baseDate;
        updateConfig.isGeneric = hasGenericCalendar(updateConfig.frequency, updateConfig.interval);
        this.pages().forEach((page) => {
            page.dateRange = getStartEndDateRange(baseDate, updateConfig.frequency, updateConfig.interval, updateConfig.isGeneric, true);
            baseDate = new Date(page.dateRange.startDate.getTime() - 1);
        });

        let combinedDateRange: Datetime.IDateRange = {
            startDate: this.pages()[0].dateRange.startDate,
            endDate: this.pages()[this.pages().length - 1].dateRange.endDate
        };

        updateConfig.pageCallback(combinedDateRange).then((statusBoxes: IStatusBox[]) => {
            if (currentRefreshId !== this._refreshId) {
                deferred.reject({
                    result: StatusCalendarUpdateResultEnum.aborted
                });
            }
            // Split the data for each page.
            for (let i = 0; i < this.pages().length; i++) {
                let page = this.pages()[i];
                let pageData: IStatusBox[][] = [];
                try {
                    pageData = sanitizeIncomingData(statusBoxes, page.dateRange, updateConfig.frequency, updateConfig.interval, updateConfig.isGeneric, true);
                    page.dateRange = getPageDateRange(pageData, updateConfig.frequency, updateConfig.interval);
                } catch (ex) {
                    this.enterFailedState();
                    deferred.reject({
                        result: StatusCalendarUpdateResultEnum.failed,
                        reason: ex
                    });
                    return;
                }
                page.calculateLabelsAndSeparator(pageData, updateConfig.frequency, updateConfig.interval, updateConfig.isGeneric);
                page.updateHiglightedNodeSubscription(pageData, updateConfig.highlightedDates);
                page.statusBoxRows(pageData);
            }
            this.loading(Loader.LoadingState.Ready);
            this.disableCalendarNavigationIfOutsideOfRange(this.pages(), this._updateConfig.dateRange);
            deferred.resolve({
                result: StatusCalendarUpdateResultEnum.complete
            });
        }, (reason: string) => {
            this.enterFailedState();
            deferred.reject({
                result: StatusCalendarUpdateResultEnum.failed,
                reason: reason
            });
        });

        this.cleanCurrentState();

        // Set calendar type.
        if (updateConfig.isGeneric) {
            this.type(genericLayoutTypeString);
        } else {
            this.type(updateConfig.frequency);
        }

        return deferred.promise;
    }

    public updateSelection(selectedDate: Date) {
        if (!selectedDate) {
            this.selectedDate(null);
            return;
        }

        this.selectedDate(selectedDate);
    }

    public enterFailedState(): void {
        this.loading(Loader.LoadingState.Failed);
        this.cleanCurrentState();
    }

    public cleanCurrentState(): void {
        this.pages().forEach((page) => {
            page.clean();
        });
    }

    public disableCalendarNavigationIfOutsideOfRange(pages: StatusCalendarPage[], dateRange: Datetime.IDateRange): void {
        this.previousButtonOptions.disabled(false);
        this.nextButtonOptions.disabled(false);
        if (!dateRange) {
            return;
        }
        let startDate = pages[0].dateRange.startDate;
        let endDate = pages[pages.length - 1].dateRange.endDate;
        if (startDate.getTime() <= dateRange.startDate.getTime()) {
            this.previousButtonOptions.disabled(true);
        }
        if (dateRange.endDate.getTime() < endDate.getTime()) {
            this.nextButtonOptions.disabled(true);
        }
    }

    public dispose(): void {
        this._lifetimeManager.dispose();
    }
}

export interface ITimeScale {
    unit: string;
    scaleFactor: number;
}

// scaleFactor: Multiplier to reach the next unit.
export let timeScales: ITimeScale[] = [
    { unit: Datetime.TimeUnit.Minute, scaleFactor: 60 },
    { unit: Datetime.TimeUnit.Hour, scaleFactor: 24 },
    { unit: Datetime.TimeUnit.Day, scaleFactor: 7 },
    { unit: Datetime.TimeUnit.Week, scaleFactor: -1 },
    { unit: Datetime.TimeUnit.Month, scaleFactor: 12 },
    { unit: Datetime.TimeUnit.Year, scaleFactor: -1 },
];

export let timeScaleMap: StringMap<ITimeScale> = {};
timeScales.forEach((timeScale) => {
    timeScaleMap[timeScale.unit] = timeScale;
});

// Update frequency, interval combination to a higher frequency value if possible.
// e.g. Month, 12 === Year, 1; Day,7 === Week, 1; Minute, 60*24 === Day, 1
// However Day,30 !== Month, 1
export function findCorrectFrequencyAndInterval(frequency: string, interval: number): (string | number)[] {
    for (let i = 0; i < timeScales.length; i++) {
        let timeUnit = timeScales[i];
        if (timeUnit.unit === frequency) {
            if (timeUnit.scaleFactor === -1) {
                // still continue
            } else {
                if (interval < timeUnit.scaleFactor) {
                    if (!(timeUnit.scaleFactor % interval === 0)) {
                        // TODO paverma: Something here
                    }
                } else {
                    if (interval % timeUnit.scaleFactor === 0) {
                        frequency = timeScales[i + 1].unit;
                        interval /= timeUnit.scaleFactor;
                    }
                }
            }
        }
    }
    return [frequency, interval];
}

export function getGapInMillis(frequency: string, interval: number): number {
    return Datetime.timeUnitToMilliseconds[frequency] * interval;
}

// Returns the date range for which the data should be queried for.
// if fullCalendar is true, the range is based on display structure,
// else the range is independent of structure, i.e will rollover.
export function getStartEndDateRange(date: Date, frequency: string, interval: number, isGeneric: boolean, fullCalendar: boolean): Datetime.IDateRange {
    let startDate: number = null;
    let endDate: number = null;
    let dateMoment: moment.Moment = moment.utc(date.getTime()); // This is mutated.

    // We always include the status box range which has the input date.

    if (isGeneric) {
        endDate = dateMoment.add(1, Datetime.TimeUnit.Millisecond).valueOf();
        startDate = dateMoment.subtract(interval * (fullCalendar ? numberOfDatesInGenericCalendar : numberOfDatesInGenericRow), frequency).valueOf();
        return {
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };
    }

    if (!fullCalendar) {
        switch (frequency) {
            case Datetime.TimeUnit.Minute:
            case Datetime.TimeUnit.Hour:
                let intervalMillis = Datetime.timeUnitToMilliseconds[frequency] * interval;
                endDate = Math.floor(date.getTime() / intervalMillis) * intervalMillis + intervalMillis;
                let gap = timeScaleMap[frequency].scaleFactor * Datetime.timeUnitToMilliseconds[frequency];
                startDate = endDate - gap;
                break;
            case Datetime.TimeUnit.Day:
                endDate = getStartOfNextTimeUnit(dateMoment, Datetime.TimeUnit.Day).valueOf();
                startDate = dateMoment.subtract(timeScaleMap[frequency].scaleFactor, Datetime.TimeUnit.Day).valueOf();
                break;
            case Datetime.TimeUnit.Week:
                endDate = getStartOfNextTimeUnit(dateMoment, Datetime.TimeUnit.Week).valueOf();
                startDate = dateMoment.subtract(numberOfWeeksInARow, Datetime.TimeUnit.Week).valueOf();
                break;
            case Datetime.TimeUnit.Month:
                endDate = getStartOfNextTimeUnit(dateMoment, Datetime.TimeUnit.Month).valueOf();
                startDate = dateMoment.subtract(numberOfMonthsInARow, Datetime.TimeUnit.Month).valueOf();
                break;
            case Datetime.TimeUnit.Year:
                endDate = getStartOfNextTimeUnit(dateMoment, Datetime.TimeUnit.Year).valueOf();
                startDate = dateMoment.subtract(numberOfYearsToShowInARow, Datetime.TimeUnit.Year).valueOf();
                break;
            default:
                logger.logError("Unexpected switch statement value: " + frequency);
                break;
        }
    } else {
        switch (frequency) {
            case Datetime.TimeUnit.Minute:
                endDate = getStartOfNextTimeUnit(dateMoment, Datetime.TimeUnit.Hour).valueOf();
                startDate = dateMoment.subtract(numberOfRowsInMinuteCalendar, Datetime.TimeUnit.Hour).valueOf();
                break;
            case Datetime.TimeUnit.Hour:
                endDate = getStartOfNextTimeUnit(dateMoment, Datetime.TimeUnit.Day).valueOf();
                startDate = dateMoment.subtract(numberOfRowsInHourCalendar, Datetime.TimeUnit.Day).valueOf();
                break;
            case Datetime.TimeUnit.Day:
                let nextMonthStartMoment = getStartOfNextTimeUnit(dateMoment.clone(), Datetime.TimeUnit.Month);
                let nextMonthMillis = nextMonthStartMoment.valueOf();
                if (nextMonthStartMoment.startOf(Datetime.TimeUnit.Week).valueOf() !== nextMonthMillis) {
                    nextMonthStartMoment.add(1, Datetime.TimeUnit.Week);
                }
                endDate = nextMonthStartMoment.valueOf();
                startDate = dateMoment.startOf(Datetime.TimeUnit.Month).startOf(Datetime.TimeUnit.Week).valueOf();
                break;
            case Datetime.TimeUnit.Week:
                endDate = getStartOfNextTimeUnit(dateMoment, Datetime.TimeUnit.Week).valueOf();
                startDate = dateMoment.subtract(numberOfWeeksInCalendar, Datetime.TimeUnit.Week).valueOf();
                break;
            case Datetime.TimeUnit.Month:
                endDate = getStartOfNextTimeUnit(dateMoment, Datetime.TimeUnit.Year).valueOf();
                startDate = dateMoment.subtract(1, Datetime.TimeUnit.Year).valueOf();
                break;
            case Datetime.TimeUnit.Year:
                endDate = getStartOfNextTimeUnit(dateMoment, Datetime.TimeUnit.Year).valueOf();
                startDate = dateMoment.subtract(numberOfYearsToShowInARow * numberOfRowsInYearCalendar, Datetime.TimeUnit.Year).valueOf();
                break;
            default:
                logger.logError("Unexpected switch statement value: " + frequency);
                break;
        }
    }
    return {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
    };
}

export function sanitizeIncomingData(data: IStatusBox[], dateRange: Datetime.IDateRange, frequency: string, interval: number, isGeneric: boolean, isFullCalendar: boolean): IStatusBox[][] {
    let sanitizedData: IStatusBox[] = [];
    let {nCols, nRows} = getGridSizeForFrequencyInterval(dateRange, frequency, interval, isGeneric, isFullCalendar);
    let firstKnownDate = data.length > 0 ? data[0].date : dateRange.endDate;
    let curMoment = moment.utc(firstKnownDate);

    let getMissingStatusBox = (millis: number): IStatusBox => {
        return { date: new Date(millis), status: ko.observable(StatusBoxState.missing) };
    };

    // Add initial missing boxes
    curMoment.subtract(interval, frequency);
    while (curMoment.valueOf() >= dateRange.startDate.getTime()) {
        sanitizedData.push(getMissingStatusBox(curMoment.valueOf()));
        curMoment.subtract(interval, frequency);
    }
    sanitizedData.reverse();

    curMoment = moment.utc(lowerBoundDate(firstKnownDate, dateRange.startDate, frequency, interval));
    let dataIndex = 0, dataLength = data.length;
    dataIndex = lowerBoundIndex(data, curMoment.toDate());

    while (curMoment.valueOf() < dateRange.endDate.getTime()) {
        let addMissingStatusBox = true;
        for (; dataIndex < dataLength; dataIndex++) {
            let dataItemMillis = data[dataIndex].date.getTime();
            if (dataItemMillis === curMoment.valueOf()) {
                sanitizedData.push(data[dataIndex]);
                dataIndex++;
                addMissingStatusBox = false;
                break;
            } else if (dataItemMillis > curMoment.valueOf()) {
                addMissingStatusBox = true;
                break;
            } else if (dataItemMillis < curMoment.valueOf()) {
                logger.logError("Unxepected dataItem. The date value of {0} is less than the expected value {1} for {2}.".format(
                    data[dataIndex].date.toISOString(), curMoment.toISOString(), JSON.stringify(data[dataIndex])));
            }
        }
        if (addMissingStatusBox) {
            sanitizedData.push(getMissingStatusBox(curMoment.valueOf()));
        }
        curMoment.add(interval, frequency);
    }

    // Convert into a grid.
    let returnData: IStatusBox[][] = [];
    for (let i = 0; i < nRows; i++) {
        if ((i + 1) * nCols <= sanitizedData.length) {
            returnData.push(sanitizedData.slice(i * nCols, (i + 1) * nCols));
        } else {
            logger.logError("The grid size is different than the size of data generated for {0}, {1}, {2}, {3}; grid: nCols {4}, nRows{5}".format(JSON.stringify(dateRange),
                frequency, interval, isFullCalendar, nCols, nRows));
            break;
        }
    }

    return returnData;
}

interface ICalendarGridSize {
    nCols: number;
    nRows: number;
}

function getGridSizeForFrequencyInterval(dateRange: Datetime.IDateRange, frequency: string, interval: number, isGeneric: boolean, isFullCalendar: boolean): ICalendarGridSize {
    if (isGeneric) {
        if (isFullCalendar) {
            return {
                nCols: 1,
                nRows: numberOfDatesInGenericCalendar
            };
        } else {
            return {
                nCols: numberOfDatesInGenericRow,
                nRows: 1
            };
        }
    }

    let nCols: number = null, nRows: number = null;
    switch (frequency) {
        case Datetime.TimeUnit.Minute:
        case Datetime.TimeUnit.Hour:
        case Datetime.TimeUnit.Day:
            nCols = timeScaleMap[frequency].scaleFactor / interval;
            if (isFullCalendar) {
                nRows = (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (Datetime.timeUnitToMilliseconds[frequency] * timeScaleMap[frequency].scaleFactor);
            } else {
                nRows = 1;
            }
            break;
        case Datetime.TimeUnit.Week:
            if (isFullCalendar) {
                nRows = numberOfWeeksInCalendar;
                nCols = 1;
            } else {
                nRows = 1;
                nCols = numberOfWeeksInARow;
            }
            break;
        case Datetime.TimeUnit.Month:
            nCols = numberOfMonthsInARow;
            nRows = isFullCalendar ? (12 / numberOfMonthsInARow) : 1;
            break;
        case Datetime.TimeUnit.Year:
            nCols = numberOfYearsToShowInARow;
            nRows = isFullCalendar ? numberOfRowsInYearCalendar : 1;
            break;
        default:
            logger.logError("Unexpected switch statement value: " + frequency);
            break;
    }
    return {
        nCols: nCols,
        nRows: nRows
    };
}

export function hasGenericCalendar(frequency: string, interval: number): boolean {
    let isGeneric: boolean = false;
    switch (frequency) {
        case Datetime.TimeUnit.Minute:
        case Datetime.TimeUnit.Hour:
            if (timeScaleMap[frequency].scaleFactor % interval !== 0) {
                isGeneric = true;
            }
            break;

        case Datetime.TimeUnit.Week:
        case Datetime.TimeUnit.Day:
        case Datetime.TimeUnit.Month:
        case Datetime.TimeUnit.Year:
            if (interval !== 1) {
                isGeneric = true;
            }
            break;
        default:
            logger.logError("hasGenericCalendar: Unexpected switch statement value: " + frequency);
            break;
    }
    return isGeneric;
}

// Gets the next base date that could be fed into the getCurrentRows to get the next calendar page.
export function getBaseDate(dateRange: Datetime.IDateRange, frequency: string, interval: number, isGeneric: boolean, next: boolean): Date {
    let newBaseDate: Date = null;
    // Since the endDate was not included in the previous page, hence get the last included date.
    let curDate: Date = null;

    if (!next) {
        if (isGeneric) {
            // since for generic calendar there is no structure, hence baseDate is always the last value.
            return new Date(dateRange.startDate.getTime() - 1);
        } else {
            return moment.utc(dateRange.startDate).subtract(interval, frequency).toDate();
        }
    }

    if (isGeneric) {
        return moment.utc(dateRange.endDate).add(interval * numberOfDatesInGenericCalendar, frequency).subtract(1, Datetime.TimeUnit.Millisecond).toDate();
    }
    curDate = new Date(dateRange.endDate.getTime());

    switch (frequency) {
        case Datetime.TimeUnit.Minute:
            newBaseDate = new Date(curDate.getTime() + (numberOfRowsInMinuteCalendar - 1) * Datetime.timeUnitToMilliseconds[Datetime.TimeUnit.Hour]);
            break;

        case Datetime.TimeUnit.Hour:
            newBaseDate = new Date(curDate.getTime() + (numberOfRowsInHourCalendar - 1) * Datetime.timeUnitToMilliseconds[Datetime.TimeUnit.Day]);
            break;

        case Datetime.TimeUnit.Week:
            newBaseDate = new Date(curDate.getTime() + (numberOfWeeksInCalendar - 1) * Datetime.timeUnitToMilliseconds[Datetime.TimeUnit.Week]);
            break;

        case Datetime.TimeUnit.Day:
        case Datetime.TimeUnit.Month:
            newBaseDate = moment.utc(curDate).add(1, frequency).toDate();
            break;

        case Datetime.TimeUnit.Year:
            newBaseDate = moment.utc(curDate).add(numberOfYearsToShowInARow * numberOfRowsInYearCalendar - 1, Datetime.TimeUnit.Year).toDate();
            break;
        default:
            logger.logError("Unexpected switch statement value: " + frequency);
            break;
    }
    return newBaseDate;
}

// TODO paverma This will have to be re-evaluated for localization/globalization.
function getConciseDateRangeLabel(firstDate: Date, lastDate: Date): string {
    let label: string = "";
    let headerSeparator = "{0} - {1}";
    if (firstDate.getUTCFullYear() === lastDate.getUTCFullYear()) {
        if (firstDate.getUTCMonth() === lastDate.getUTCMonth()) {
            if (firstDate.getUTCDate() === lastDate.getUTCDate()) {
                label = Datetime.format1.format(firstDate.getTime());
            } else {
                label = Datetime.shortMonth.format(firstDate.getTime()) + " " +
                    headerSeparator.format(firstDate.getUTCDate(), lastDate.getUTCDate()) + " " + firstDate.getUTCFullYear();
            }
        } else {
            label = headerSeparator.format(Datetime.shortDayMonth.format(firstDate.getTime()),
                Datetime.shortDayMonth.format(lastDate.getTime())) + " " + firstDate.getUTCFullYear();
        }
    } else {
        label = headerSeparator.format(Datetime.fullDate.format(firstDate.getTime()),
            Datetime.fullDate.format(lastDate.getTime()));
    }
    return label;
}

function getStartOfNextTimeUnit(currentMoment: moment.Moment, timeUnit: string): moment.Moment {
    return currentMoment.add(1, timeUnit).startOf(timeUnit);
}

function getPageDateRange(pageData: IStatusBox[][], frequency: string, interval: number): Datetime.IDateRange {
    if (pageData.length > 0 && pageData[0].length > 0) {
        return {
            startDate: new Date(pageData[0][0].date.getTime()),
            endDate: moment.utc(pageData[pageData.length - 1][pageData[0].length - 1].date).add(interval, frequency).toDate()
        };
    } else {
        return null;
    }
}

// add x times interval, frequency to curDate, such that lower_bound <= curDate
function lowerBoundDate(curDate: Date, lowerBound: Date, frequency: string, interval: number): Date {
    let curMoment = moment.utc(curDate), lowerBoundMillis = lowerBound.getTime(), bestLowerBound = curDate.getTime();
    let start = 0, end = 100000, mid = 0;
    while (start <= end) {
        mid = Math.floor((start + end) / 2);
        let tempMoment = curMoment.clone().add(mid * interval, frequency).valueOf();

        if (tempMoment >= lowerBoundMillis) {
            bestLowerBound = tempMoment;
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    return new Date(bestLowerBound);
}

function lowerBoundIndex(data: IStatusBox[], lowerBound: Date): number {
    let lowerBoundMillis = lowerBound.getTime(), bestLowerBound = data.length;
    let start = 0, end = data.length - 1, mid = 0;
    while (start <= end) {
        mid = Math.floor((start + end) / 2);
        let tempDate = data[mid].date.getTime();
        if (tempDate >= lowerBoundMillis) {
            bestLowerBound = mid;
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    return bestLowerBound;
}
