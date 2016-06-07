/// <reference path="../References.d.ts" />

import {Datetime, Log} from "../_generated/Framework";

let logger = Log.getLogger({
    loggerName: "JQueryUIBindings"
});

export interface IDatetimeRangeBindingValueAccessor {
    // This is to allow consumers to consume the current value on the control.
    // They can set the value on it to update the fields too.
    currentValue: KnockoutComputed<Datetime.IDateRange>;
    isReady: KnockoutObservable<boolean>;
}

// Fixing "now" for the datetimepicker. If an additional property of "setDatepickerToNow" is defined then call it instead.
/* tslint:disable:no-any */
let originalGoToToday = (<any>$.datepicker)._gotoToday;
(<any>$.datepicker)._gotoToday = function() {
    let element = $(arguments[0]);       // datepicker id
    if (element) {
        let method: any = element.data("setDatepickerToNow");
        if (element.datetimepicker && method) {
            method(element);
        } else {
            originalGoToToday.apply(this, arguments);
        }
    }
};
/* tslint:enable:no-any */

// Note: The timepicker add on plugin uses the datepicker jquery ui component. Hence, $.datepicker,
// $.timepicker, $.datetimepicker all co-exist. The included .d.ts file seems to be incomplete, hence
// while deving, please refer to the documentation of datetimepicker.

// It creates two text boxes with class names datetimeRangeStartDate and datetimeRangeEndDate.
export class DatetimeRangeBindingHandler implements KnockoutBindingHandler {
    static className: string = "datetimeRange";
    static startDateInputBoxClassName = "datetimeRangeStartDate";
    static endDateInputBoxClassName = "datetimeRangeEndDate";

    static getInitialValueAccessor(): IDatetimeRangeBindingValueAccessor {
        return {
            currentValue: Datetime.getDateRangeObservable(),
            isReady: ko.observable(false)
        };
    }

    public init(
        element: HTMLElement,
        valueAccessor: () => IDatetimeRangeBindingValueAccessor,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: {},
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        let valAccessor = valueAccessor();
        let startDateElement = $(element).find("." + DatetimeRangeBindingHandler.startDateInputBoxClassName);
        let endDateElement = $(element).find("." + DatetimeRangeBindingHandler.endDateInputBoxClassName);

        if (startDateElement.length === 0 || endDateElement.length === 0) {
            logger.logError("Could not find elements with class name {0} and/or {1} inside element {2}."
                .format(DatetimeRangeBindingHandler.startDateInputBoxClassName, DatetimeRangeBindingHandler.endDateInputBoxClassName,
                    element));
        }

        let pauseUpdate: boolean = false;
        let updateCurrentValue = () => {
            let startDate = Datetime.convertAsStringFromLocalToUTC(startDateElement.datetimepicker("getDate"));
            let endDate = Datetime.convertAsStringFromLocalToUTC(endDateElement.datetimepicker("getDate"));
            pauseUpdate = true;
            valAccessor.currentValue({
                startDate: startDate,
                endDate: endDate
            });
        };

        // We need fake dates to display times in UTC. The widget supports a timezone value, which works fine
        // at the time of retrieval. However, while setting the dates, it adds the offset in other direction.
        // Hence using the standard trick.

        // Using any as this is not mentioned in the .d.ts.
        /* tslint:disable:no-any */
        (<any>$).timepicker.datetimeRange(startDateElement, endDateElement, {
        /* tslint:enable:no-any */
            timeFormat: "hh:mm tt",
            minInterval: 15*60*1000,
            showOtherMonths: true,
            start: {
                onSelect: (dateText: string) => {
                    if (endDateElement.val() === "") {
                        endDateElement.datetimepicker("setDate", dateText);
                    }
                    updateCurrentValue();
                }
            },
            end: {
                onSelect: (dateText: string) => {
                    if (startDateElement.val() === "") {
                        startDateElement.datetimepicker("setDate", dateText);
                    }
                    updateCurrentValue();
                }
            }
        });

        let updateDatetimeRangeValue = (dateRange) => {
            if (pauseUpdate) {
                // Only to avoid updating the picker, if it was the one that trigerred an update.
                pauseUpdate = false;
            } else {
                // Setting up async for the initial load. It seems datetimepicker construction (using the timepicker api)
                // seems to be delayed.
                setTimeout(() => {
                    startDateElement.datetimepicker("setDate", Datetime.convertAsStringFromUTCToLocal(dateRange.startDate));
                    endDateElement.datetimepicker("setDate", Datetime.convertAsStringFromUTCToLocal(dateRange.endDate));
                    valAccessor.isReady(true);
                }, 1);
            }
        };
        let currentValueSubscription = valAccessor.currentValue.subscribe((dateRange) => {
            updateDatetimeRangeValue(dateRange);
        });
        updateDatetimeRangeValue(valAccessor.currentValue());

        // Hide the picker if the input looses focus, iff the mouse is not over the calendar widget.
        let hideOnBlur = (event: JQueryEventObject) => {
            updateCurrentValue();
            let inputElment = (<JQuery>event.data);
            if (!inputElment.datepicker("widget").is(":hover")) {
                inputElment.datetimepicker("hide");
            }
        };
        startDateElement.on("blur", startDateElement, hideOnBlur);
        endDateElement.on("blur", endDateElement, hideOnBlur);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            startDateElement.datetimepicker("destroy");
            endDateElement.datetimepicker("destroy");
            currentValueSubscription.dispose();
            startDateElement.off("blur", hideOnBlur);
            endDateElement.off("blur", hideOnBlur);
        });

        startDateElement.data("setDatepickerToNow", setDatepickerToUTCNow);
        endDateElement.data("setDatepickerToNow", setDatepickerToUTCNow);

        return { controlsDescendantBindings: false };
    }
}

function setDatepickerToUTCNow(element: JQuery): void {
    if (element.datetimepicker) {
        element.datetimepicker("setDate", Datetime.convertAsStringFromUTCToLocal(new Date()));
    }
}
