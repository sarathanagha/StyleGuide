/// <reference path="../../References.d.ts" />

import ActivityWindowModel = require("../../scripts/Framework/Model/Contracts/ActivityWindow");
import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");
import Log = require("../../scripts/Framework/Util/Log");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import MonitoringViewHandler = require("../../scripts/Handlers/MonitoringViewHandler");

export interface IFilterDetails {
    filterType: FilterType;
    column: string;
    anchor: HTMLElement;
}

export enum FilterType {
    Search,
    Checkbox,
    SortOnly,
    DateTime
}

let logger = Log.getLogger({
    loggerName: "FilterViewModel"
});

/*
 * This is a base class for filter view models, please do not instantiate it directly.
 */
export class FilterViewModel extends Framework.Disposable.ChildDisposable {
    static className: string = "FilterViewModel";

    public extendedProperties = ActivityWindowModel.ServiceColumnNames.ExtendedProperties;

    public column: string;
    public filterType: FilterType;

    public flyoutControl: WinJS.UI.Flyout;
    public anchorElement: HTMLElement;
    public template: string;

    public appContext: AppContext.AppContext;
    public monitoringViewHandler: MonitoringViewHandler.MonitoringViewHandler;
    public monitoringViewSubscription: MessageHandler.IMessageSubscription<string>;
    public subscriptionName: string;
    public showFlyout: () => void;
    public isActiveFilter: () => boolean;

    constructor(lifetimeManager: Framework.TypeDeclarations.DisposableLifetimeManager, filterDetails: IFilterDetails) {
        super(lifetimeManager);

        this.subscriptionName = "{0}/{1}".format(FilterViewModel.className, filterDetails.column);
        this.appContext = AppContext.AppContext.getInstance();
        this.monitoringViewHandler = this.appContext.monitoringViewHandler;

        this.filterType = filterDetails.filterType;
        this.column = filterDetails.column;

        this.anchorElement = filterDetails.anchor;
    }

    public sortAscendingClicked = () => {
        this.sortClickedHandlerBase(MonitoringViewHandler.MonitoringViewHandler.sortAscending);
    };

    public sortDescendingClicked = () => {
        this.sortClickedHandlerBase(MonitoringViewHandler.MonitoringViewHandler.sortDescending);
    };

    protected showFlyoutBase(): void {
        if (this.flyoutControl && this.anchorElement) {
            this.flyoutControl.show(this.anchorElement);
        }
    };

    protected updateViewStateBase(): void {
        let selectedView = this.monitoringViewHandler.getSelectedView();

        if (selectedView.sort.column === this.column) {
            if (selectedView.sort.order === MonitoringViewHandler.MonitoringViewHandler.sortAscending) {
                this.flyoutControl.element.querySelector("#adf-sort-asc").classList.add("adf-activeSortOrder");
                this.flyoutControl.element.querySelector("#adf-sort-desc").classList.remove("adf-activeSortOrder");
            } else {
                this.flyoutControl.element.querySelector("#adf-sort-desc").classList.add("adf-activeSortOrder");
                this.flyoutControl.element.querySelector("#adf-sort-asc").classList.remove("adf-activeSortOrder");
            }
            // update svg color.
            $(this.flyoutControl.element).find("[fill]").attr("class", "adf-fill").removeAttr("fill");
            $(this.flyoutControl.element).find("[stroke]").attr("class", "adf-stroke").removeAttr("stroke");
        } else {
            this.flyoutControl.element.querySelector("#adf-sort-asc").classList.remove("adf-activeSortOrder");
            this.flyoutControl.element.querySelector("#adf-sort-desc").classList.remove("adf-activeSortOrder");
        }
    };

    protected sortClickedHandlerBase(order: string): void {
        logger.logInfo("Updating view's sort to column: {0}, order: {1}".format(this.column, order));
        let selectedView = this.monitoringViewHandler.getSelectedView();
        selectedView.sort.column = this.column;
        selectedView.sort.order = order;
        this.monitoringViewHandler.pushNotification();
    };
}
