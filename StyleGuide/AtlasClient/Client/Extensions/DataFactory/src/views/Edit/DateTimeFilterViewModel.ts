/// <reference path="../../References.d.ts" />

import DateTimeUtil = require("../../scripts/Framework/Util/Datetime");
import Filter = require("./FilterViewModel");
import Framework = require("../../_generated/Framework");
import Log = require("../../scripts/Framework/Util/Log");
import Util = require("../../scripts/Framework/Util/Util");

let logger = Log.getLogger({
    loggerName: "ItemListFilterViewModel"
});

export class DateTimeFilterViewModel extends Filter.FilterViewModel {
    public static className: string = Framework.DataConstants.dateTimeFilterViewModel;
    public static windowStartDateTimePickerSelector: string = "adf-filterFlyoutStartDateTimePicker";
    public static windowEndDateTimePickerSelector: string = "adf-filterFlyoutEndDateTimePicker";

    public dateTimePickerElement: JQuery;
    public defaultDate: Date;
    public currentDate: Date;

    // this is used in the cancelClicked handler to reset the calendar's date to the previous value.
    public previousDate: Date;

    constructor(lifetimeManager: Framework.TypeDeclarations.DisposableLifetimeManager, filterDetails: Filter.IFilterDetails) {
        super(lifetimeManager, filterDetails);

        this.monitoringViewSubscription = {
            name: DateTimeFilterViewModel.className,
            callback: this.updateViewState
        };
        this.monitoringViewHandler.register(this.monitoringViewSubscription);

        this._filterState = this.monitoringViewHandler.getSelectedView().filter.mapDateTimeColumnToFilterState(this.column);
    }

    public isActiveFilter = (): boolean => {
        return Util.koPropertyHasValue(this._filterState);
    };

    /* called by the FilterFlyoutKnockoutBinding */
    public initializeView = () => {
        this.dateTimePickerElement.datetimepicker(<DateTimePickerOptions>{
            minDateTime: DateTimeUtil.convertAsStringFromUTCToLocal(this.appContext.dateRange().startDate),
            maxDateTime: DateTimeUtil.convertAsStringFromUTCToLocal(this.appContext.dateRange().endDate),
            timeFormat: "hh:mm tt",
            showOtherMonths: true
        });

        this.dateTimePickerElement.datetimepicker("setDate", DateTimeUtil.convertAsStringFromUTCToLocal(this.defaultDate));
    };

    public updateViewState = () => {
        super.updateViewStateBase();

        /* The following block adjusts the min/max selectable date on load.
         * e.g. If the user sets a WindowStart filter, we would update the minimum selectable
         * date for the WindowEnd filter accordingly (and vice versa).
         */
        let newMinDateTime: Date;
        let newMaxDateTime: Date;

        let globalStartDate = this.appContext.dateRange().startDate;
        let globalEndDate = this.appContext.dateRange().endDate;

        let windowStartFilter: KnockoutObservable<Date> = this.monitoringViewHandler.getSelectedView().filter.filterState().windowStart;
        let windowEndFilter: KnockoutObservable<Date> = this.monitoringViewHandler.getSelectedView().filter.filterState().windowEnd;

        let selectedDate = DateTimeUtil.convertAsStringFromLocalToUTC(this.dateTimePickerElement.datetimepicker("getDate"));
        switch (this.column) {
            case this.extendedProperties.WindowStart:
                newMinDateTime = globalStartDate;
                newMaxDateTime = Util.koPropertyHasValue(windowEndFilter) &&
                    windowEndFilter().getTime() < globalEndDate.getTime() &&
                    windowEndFilter().getTime() > globalStartDate.getTime() ?
                    windowEndFilter() : globalEndDate;

                this.setDateTimeLimits(newMinDateTime, newMaxDateTime);

                if (selectedDate.getTime() < globalStartDate.getTime() || selectedDate.getTime() > globalEndDate.getTime()) {
                        windowStartFilter(null); // the current filter is outside of the global date range, so reset it.
                        this.dateTimePickerElement.datetimepicker("setDate", DateTimeUtil.convertAsStringFromUTCToLocal(globalStartDate));
                }
                break;
            case this.extendedProperties.WindowEnd:
                newMinDateTime = Util.koPropertyHasValue(windowStartFilter) &&
                    windowStartFilter().getTime() > globalStartDate.getTime() &&
                    windowStartFilter().getTime() < globalEndDate.getTime() ?
                    windowStartFilter() : globalStartDate;
                newMaxDateTime = globalEndDate;

                this.setDateTimeLimits(newMinDateTime, newMaxDateTime);

                if (selectedDate.getTime() < globalStartDate.getTime() || selectedDate.getTime() > globalEndDate.getTime()) {
                        windowEndFilter(null);
                        this.dateTimePickerElement.datetimepicker("setDate", DateTimeUtil.convertAsStringFromUTCToLocal(globalEndDate));
                }
                break;
            default:
                logger.logDebug("updateViewState - column unrecognized: {0}".format(this.column));
        }
    };

    public showFlyout = () => {
        this.updateViewState();
        super.showFlyoutBase();
        this.previousDate = DateTimeUtil.convertAsStringFromLocalToUTC(this.dateTimePickerElement.datetimepicker("getDate"));
    };

    public okClicked = () => {
        this.flyoutControl.hide();
        this.currentDate = DateTimeUtil.convertAsStringFromLocalToUTC(this.dateTimePickerElement.datetimepicker("getDate"));

        if (this.currentDate.getTime() === this.previousDate.getTime() &&
            this._filterState() &&
            this.currentDate.getTime() === this._filterState().getTime()) {
            return;
        }

        switch (this.column) {
                case this.extendedProperties.WindowStart:
                if (this.currentDate.getTime() !== this.appContext.dateRange().startDate.getTime()) {
                    this._updateFilterState(this.currentDate);
                    }
                    break;
                case this.extendedProperties.WindowEnd:
                if (this.currentDate.getTime() !== this.appContext.dateRange().endDate.getTime()) {
                    this._updateFilterState(this.currentDate);
                    }
                    break;
                default:
                    logger.logError("Unexpected column name: " + this.column + " for adding to filterState.");
            }
    };

    public cancelClicked = () => {
        this.flyoutControl.hide();
        this.dateTimePickerElement.datetimepicker("setDate", DateTimeUtil.convertAsStringFromUTCToLocal(this.previousDate));
    };

    private _filterState: KnockoutObservable<Date>;

    private setDateTimeLimits(newMinDateTime: Date, newMaxDateTime: Date) {
        // we are required to set both <x>DateTime and <x>Date, otherwise the date *and* time aren't updated correctly.
        this.dateTimePickerElement.datetimepicker("option", "minDateTime", DateTimeUtil.convertAsStringFromUTCToLocal(newMinDateTime));
        this.dateTimePickerElement.datepicker("option", "minDate", DateTimeUtil.convertAsStringFromUTCToLocal(newMinDateTime));
        this.dateTimePickerElement.datetimepicker("option", "maxDateTime", DateTimeUtil.convertAsStringFromUTCToLocal(newMaxDateTime));
        this.dateTimePickerElement.datepicker("option", "maxDate", DateTimeUtil.convertAsStringFromUTCToLocal(newMaxDateTime));
    }

    private _updateFilterState(newDate: Date): void {
        if (newDate) {
            this._filterState(newDate);
            this.monitoringViewHandler.pushNotification();
        }
    }
}
