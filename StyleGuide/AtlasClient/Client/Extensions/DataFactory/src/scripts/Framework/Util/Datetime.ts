/// <reference path="../../../References.d.ts" />

import Constants = require("../Shared/Constants");

export module TimeUnit {
    export let Millisecond = "Millisecond";
    export var Minute = "Minute";
    export var Hour = "Hour";
    export var Day = "Day";
    export var Week = "Week";
    export var Month = "Month";
    export var Year = "Year";
}

export var timeUnitToMilliseconds = {};
timeUnitToMilliseconds[TimeUnit.Minute] = 60 * 1000;
timeUnitToMilliseconds[TimeUnit.Hour] = 60 * 60 * 1000;
timeUnitToMilliseconds[TimeUnit.Day] = 24 * 60 * 60 * 1000;
timeUnitToMilliseconds[TimeUnit.Week] = 7 * 24 * 60 * 60 * 1000;
timeUnitToMilliseconds[TimeUnit.Month] = 28 * 24 * 60 * 60 * 1000;
timeUnitToMilliseconds[TimeUnit.Year] = 365 * 24 * 60 * 60 * 1000;

// TODO paverma Default lib.d.ts of typescript seems to be buggy, since it always asks for hour12.
/* tslint:disable:no-any */
export var shortTime = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, { hour: "2-digit", hour12: true, minute: "2-digit", timeZone: "UTC" });
export var shortHour = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, { hour: "2-digit", hour12: true, timeZone: "UTC" });
export var shortDate = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, { weekday: "short", day: "numeric", month: "numeric", hour12: true, timeZone: "UTC" });
export var shortMonth = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, { month: "short", hour12: true, timeZone: "UTC" });
export var shortMonthYear = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, { month: "short", year: "numeric", hour12: true, timeZone: "UTC" });

export var fullYear = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, { year: "numeric", hour12: true, timeZone: "UTC" });
export var fullDay = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale,
    { year: "numeric", month: "numeric", day: "numeric", hour12: true, timeZone: "UTC" });
export var fullDate = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale,
    { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: true, timeZone: "UTC" });
export var fullDateWithTimezone = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale,
    { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: true, timeZone: "UTC", timeZoneName: "short" });

export var shortDayMonth = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, {
    day: "numeric",
    month: "short",
    hour12: true,
    timeZone: "UTC"
});

export var format1 = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, { weekday: "short", day: "numeric", month: "short", year: "numeric", hour12: true, timeZone: "UTC" });

export var narowWeekday = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, { weekday: "narrow", hour12: true, timeZone: "UTC" });
export var numericHour = <Intl.DateTimeFormat><any>new Intl.DateTimeFormat(Constants.locale, { hour: "numeric", hour12: true, timeZone: "UTC" });
/* tslint:enable:no-any */

// Returns the week number to which the week belongs. 1-based index.
export function getWeekOfTheYear(date: Date): number {
    // Will be used for weekly calendar.
    let weekIndex: number = 0;
    let firstJan: Date = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    let firstSunday: Date = firstJan;
    while (firstSunday.getUTCDay() !== 0) {
        weekIndex = 1;
        firstSunday = new Date(firstSunday.getTime() + timeUnitToMilliseconds[TimeUnit.Day]);
    }
    weekIndex += Math.ceil((date.getTime() - firstSunday.getTime()) / timeUnitToMilliseconds[TimeUnit.Week]);
    if (date.getUTCDay() === 0 && date.getTime() % timeUnitToMilliseconds[TimeUnit.Week] === 0) {
        weekIndex++;
    }
    return weekIndex;
}

// moment.toISOString() retains the milliseconds which is improperly formatted for our purposes
// returns 2015-07-20T00:00:00Z not 2015-07-20T00:00:00:000Z
export function getIso8601DateString(rawLocalDate: string): string {
    return moment(rawLocalDate).toISOString().slice(0, -5) + "Z";
}

export function getUtcTime(rawDate: string): string {
    let utcTime = moment(rawDate).toISOString();
    return moment.utc(utcTime).format("MM/DD/YYYY h:mm A [UTC]");
}

export function getLocalTime(rawDate: string): string {
    // TODO rigoutam: return "Today" instead of "Sun" if the date is today
    return moment(rawDate).format("ddd, MM/D/YYYY h:mm A [local]");
}

export function getTooltipDate(rawDate: string): string {
    return getUtcTime(rawDate) + " (" + getLocalTime(rawDate) + ")";
}

export interface ITimePair {
    local: string;
    UTC: string;
}

export function getTimePair(rawDate: string): ITimePair {
    return { UTC: getUtcTime(rawDate), local: getLocalTime(rawDate) };
}

// TODO paverma The idea was to support strings like Now which if queried for will return the current time.
// Keeping it around for a while. Will drop it still looks unreasonable in future.
/*
export var stringCurrentTime = "Now";
export var stringEpochTime = "Epoch";
export var NamedDateMap: StringMap<() => Date> = {};
NamedDateMap[stringCurrentTime] = () => { return new Date() };
NamedDateMap[stringEpochTime] = () => { return new Date(0) };

class NamedDate {
    static writeErrorMessage: string = "Trying to initialize current date with incorrect value: {0}";
    private _date: KnockoutObservable<string|Date> = null;

    constructor(value: string|Date) {
        this._date = ko.observable(value);
    }

    public getFormattedDate(): string {
        return fullDateWithTimezone.format(this.getDateValue().getTime());
    }

    public getStringValue(): string {
        if (typeof this._date.peek() === "string") {
            return <string>this._date.peek();
        } else {
            return fullDateWithTimezone.format((<Date>this._date.peek()).getTime());
        }
    }

    public getDateValue(): Date {
        if (typeof this._date.peek() === "string") {
            return NamedDateMap[<string>this._date.peek()]();
        } else {
            return new Date((<Date>this._date.peek()).getTime());
        }
    }

    public validateValue(value: string|Date): string|Date {
        if (typeof value === "string") {
            let namedDateValue = NamedDateMap[value];
            if (!namedDateValue) {
                let newValue = new Date(<string>value);
                if (isNaN(newValue.getTime())) {
                    return null;
                } else {
                    return newValue;
                }
            } else {
                return value;
            }
        } else if (!(value instanceof Date)) {
            return null;
        } else {
            return new Date(value.getTime());
        }
    }

    public setValue(value: string|Date): void {
        let validatedValue = this.validateValue(value);
        if (validatedValue) {
            this._date(validatedValue);
        } else {
            let message = NamedDate.writeErrorMessage.format(value);
            throw new Error(message);
        }
    }

    public subscribe(callback: (value: Date) => void): KnockoutSubscription<string|Date> {
        return this._date.subscribe(callback);
    }
}
*/

export interface IDateRange {
    startDate: Date;
    endDate: Date;
}

export function getDateRangeObservable(initialValue?: IDateRange): KnockoutComputed<IDateRange> {
    let  _dateRange = ko.observable<IDateRange>(initialValue);
    let dateRange = ko.pureComputed({
        read: () => {
            return _dateRange();
        },
        write: (value) => {
            if (!value.startDate || !value.endDate) {
                return;
            }
            // Update iff its a new update, to reduce the number of update calls.
            if (!_dateRange() || (value.startDate.getTime() !== _dateRange().startDate.getTime())
                || (value.endDate.getTime() !== _dateRange().endDate.getTime())) {
                _dateRange(value);
            }
        }
    });
    return dateRange;
}

export function convertAsStringFromLocalToUTC(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
        date.getSeconds(), date.getMilliseconds()));
}

export function convertAsStringFromUTCToLocal(date: Date): Date {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(),
        date.getUTCSeconds(), date.getUTCMilliseconds());
}

export function durationToExactString(milliseconds: number): string {
    if (milliseconds < 0) {
        throw new Error("milliseconds: " + milliseconds + " is not a valid value to evaluate duration.");
    }
    let seconds = Math.round(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    let hours = Math.floor(minutes / 60);
    minutes -= hours * 60;
    let days = Math.floor(hours / 24);
    hours -= days * 24;

    return (days > 0 ? days + ":" : "") +
        (hours < 10 ? "0" + hours : hours.toString()) + ":" +
        (minutes < 10 ? "0" + minutes : minutes.toString()) + ":" +
        (seconds < 10 ? "0" + seconds : seconds.toString());
}
