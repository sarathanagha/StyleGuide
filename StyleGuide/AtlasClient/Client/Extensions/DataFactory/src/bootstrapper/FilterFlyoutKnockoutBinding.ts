/// <amd-dependency path="text!./Templates/FilterCheckboxTemplate.html" />
/// <amd-dependency path="text!./Templates/FilterDateTimeTemplate.html" />
/// <amd-dependency path="text!./Templates/FilterSearchTemplate.html" />
/// <amd-dependency path="text!./Templates/FilterSortOnlyTemplate.html" />
/// <reference path="../References.d.ts" />

import AppContext = require("../scripts/AppContext");
import DateTimeFilter = require("../views/Edit/DateTimeFilterViewModel");
import Filter = require("../views/Edit/FilterViewModel");
import Framework = require("../_generated/Framework");
import Log = require("../scripts/Framework/Util/Log");

let logger = Log.getLogger({
    loggerName: "FilterFlyoutKnockoutBinding"
});

let dateTimeFilterViewModel = DateTimeFilter.DateTimeFilterViewModel;

export class FilterFlyoutKnockoutBinding implements KnockoutBindingHandler {
    static className: string = "filterFlyout";

    public static checkboxTemplate: string = require("text!./Templates/FilterCheckboxTemplate.html");
    public static dateTimeTemplate: string = require("text!./Templates/FilterDateTimeTemplate.html");
    public static searchTemplate: string = require("text!./Templates/FilterSearchTemplate.html");
    public static sortOnlyTemplate: string = require("text!./Templates/FilterSortOnlyTemplate.html");

    public appContext: AppContext.AppContext;

    private flyout: WinJS.UI.Flyout;

    public init(
        element: HTMLElement,
        valueAccessor: () => void,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Filter.FilterViewModel,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        this.flyout = new WinJS.UI.Flyout(element, { placement: "auto" });
        this.appContext = AppContext.AppContext.getInstance();

        switch(viewModel.filterType) {
            case Filter.FilterType.Search:
                element.innerHTML = FilterFlyoutKnockoutBinding.searchTemplate
                    .format(Framework.Svg.sort_up, Framework.Svg.sort_down);
                break;
            case Filter.FilterType.Checkbox:
                element.innerHTML = FilterFlyoutKnockoutBinding.checkboxTemplate
                    .format(Framework.Svg.sort_up, Framework.Svg.sort_down);
                break;
            case Filter.FilterType.SortOnly:
                element.innerHTML = FilterFlyoutKnockoutBinding.sortOnlyTemplate
                    .format(Framework.Svg.sort_up, Framework.Svg.sort_down);
                break;
            case Filter.FilterType.DateTime:
                let dateViewModel = <DateTimeFilter.DateTimeFilterViewModel>viewModel;
                switch(viewModel.column) {
                    case viewModel.extendedProperties.WindowStart:
                        element.innerHTML = FilterFlyoutKnockoutBinding.dateTimeTemplate
                            .format(Framework.Svg.sort_up, Framework.Svg.sort_down, dateTimeFilterViewModel.windowStartDateTimePickerSelector);
                        dateViewModel.dateTimePickerElement = $("." + dateTimeFilterViewModel.windowStartDateTimePickerSelector);
                        dateViewModel.defaultDate = this.appContext.dateRange().startDate;
                        break;
                    case viewModel.extendedProperties.WindowEnd:
                        element.innerHTML = FilterFlyoutKnockoutBinding.dateTimeTemplate
                            .format(Framework.Svg.sort_up, Framework.Svg.sort_down, dateTimeFilterViewModel.windowEndDateTimePickerSelector);
                        dateViewModel.dateTimePickerElement = $("." + dateTimeFilterViewModel.windowEndDateTimePickerSelector);
                        dateViewModel.defaultDate = this.appContext.dateRange().endDate;
                        break;
                    default:
                        logger.logError("Unrecognized column '{0}' for DateTime filter type.");
                }

                dateViewModel.initializeView();
                break;
            default:
                logger.logDebug("Unrecognized filter type: " + viewModel.filterType);
        }

        viewModel.flyoutControl = element.winControl;

        ko.applyBindingsToDescendants(viewModel, element);
        return { controlsDescendantBindings: true };
    }
}
