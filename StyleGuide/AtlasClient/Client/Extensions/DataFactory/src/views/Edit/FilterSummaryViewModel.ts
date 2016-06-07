/// <amd-dependency path="text!./Templates/FilterSummary.html" />
/// <reference path="../../References.d.ts" />
import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");
import View = Framework.MonitoringView;
import MonitoringViewHandler = require("../../scripts/Handlers/MonitoringViewHandler");
import DateTime = require("../../scripts/Framework/Util/Datetime");

const filterSummarySelector = ".totalFilterCountLabel";
const filterSummaryContainer = "#filterSummaryContainer";

export interface IFilterSummary {
    header: string;
    filterStateAccessor: string;
    data: KnockoutObservableArray<string>;
}

export class FilterSummaryViewModel extends Framework.Disposable.ChildDisposable {

    public static filterSummaryTemplate: string = require("text!./Templates/FilterSummary.html");
    public flyoutControl: WinJS.UI.Flyout;
    public filterDialogElement: HTMLElement;
    public filterSummaryVisible: KnockoutComputed<boolean>;
    public filterSummaryStatusTitle: KnockoutObservable<string> = ko.observable("");

    constructor(lifetimeManager: Framework.Disposable.IDisposableLifetimeManager, filterStatus: KnockoutObservable<string>) {
        super(lifetimeManager);
        this._appContext = AppContext.AppContext.getInstance();
        this._monitoringViewHandler = this._appContext.monitoringViewHandler;
        let filterStateExtendedProperties = this._monitoringViewHandler.getSelectedView().filter.extendedProperties;
        this.filterSummary = ko.observableArray([
            {header: ClientResources.activityRunListPipelineTitle, filterStateAccessor: filterStateExtendedProperties.PipelineName, data: ko.observableArray<string>()},
            {header: ClientResources.activityRunListActivityNameTitle, filterStateAccessor: filterStateExtendedProperties.ActivityName, data: ko.observableArray<string>()},
            {header: ClientResources.activityRunListStateTitle, filterStateAccessor: filterStateExtendedProperties.WindowState, data: ko.observableArray<string>()},
            {header: ClientResources.activityRunListWindowStartTitle, filterStateAccessor: filterStateExtendedProperties.WindowStart, data: ko.observableArray<string>()},
            {header: ClientResources.activityRunListWindowEndTitle, filterStateAccessor: filterStateExtendedProperties.WindowEnd, data:ko.observableArray<string>()}
        ]);

        this.filterSummaryVisible = ko.pureComputed(() => {
            return (!this._monitoringViewHandler.getSelectedView().filter.isEmpty());
        });
        this.filterSummaryStatusTitle = filterStatus;

        this.appendFilterDialogElement();
    }

    public filterSummaryClicked = () : void => {
        let selectedView = this._monitoringViewHandler.getSelectedView();
        if (!selectedView.filter.isEmpty()) {
            this.updateFilterSummaryList();
            this.filterDialogElement = $(filterSummarySelector)[0];
            if (this.flyoutControl) {
                this.flyoutControl.show(this.filterDialogElement);
            }
        }
    };

    public closeClicked = () => {
        this.flyoutControl.hide();
    };

    private _appContext: AppContext.AppContext;
    private _monitoringViewHandler: MonitoringViewHandler.MonitoringViewHandler;
    private filterSummary: KnockoutObservableArray<IFilterSummary>;
    private container: HTMLElement;

    private updateFilterSummaryList = () : void => {
        this.filterSummary().forEach((summary: IFilterSummary) => {
            let stateProperty = this._monitoringViewHandler.getSelectedView().filter.mapColumnToFilterState(summary.filterStateAccessor);
            if (stateProperty) {
                summary.data(this.extractFilterNames(stateProperty()));
            } else {
                let stateDateProperty = this._monitoringViewHandler.getSelectedView().filter.mapDateTimeColumnToFilterState(summary.filterStateAccessor);
                summary.data(stateDateProperty() ? [DateTime.getUtcTime(stateDateProperty().toUTCString())] : []);
            }

        });
    };

    /*
     * this method is used in FilterSummary.html.
     */
    /* tslint:disable:no-unused-variable */
    private removeFilterClicked = (event: IFilterSummary) => {
        let selectedView = this._monitoringViewHandler.getSelectedView();
        selectedView.filter.clearColumnFilters(event.filterStateAccessor);
        this._monitoringViewHandler.pushNotification();
        this.updateFilterSummaryList();
        if(!this.filterSummaryVisible()) {
            this.flyoutControl.hide();
        }
    };
    /* tslint:disable:no-unused-variable */

    private extractFilterNames = (input: string[]) : string[] => {
        let result = [];
        for (let i = 0; i < input.length; i++) {
            let dualTemplateMatch = View.extractDualFilterFromTemplateRegex.exec(input[i]);
            if (dualTemplateMatch && dualTemplateMatch.length > 1) {
                result.push(dualTemplateMatch[1] + ":" + dualTemplateMatch[2]);
            } else {
                let singleTemplateMatch = View.extractFilterFromTemplateRegex.exec(input[i]);
                if (singleTemplateMatch) {
                    result.push(View.extractFilterFromTemplateRegex.exec(input[i])[1]);
                }
            }
        }
        return result;
    };

    private appendFilterDialogElement(): void {
        this.container = $(filterSummaryContainer)[0];
        if (!this.container) {
            this.container = $(FilterSummaryViewModel.filterSummaryTemplate).appendTo("body")[0];
        }
        ko.applyBindingsToDescendants(this, this.container);
        if (!this.flyoutControl) {
            this.flyoutControl = new WinJS.UI.Flyout(this.container, { placement: "auto" });
        }
    }
}
