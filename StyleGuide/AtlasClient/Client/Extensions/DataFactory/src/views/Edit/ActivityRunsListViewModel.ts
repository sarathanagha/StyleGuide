/// <reference path="../../References.d.ts" />

import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");
import TypeDeclarations = require("../../scripts/Framework/Shared/TypeDeclarations");
import DataConstants = Framework.DataConstants;
import MessageHandler = require("../../scripts/Handlers/MessageHandler");

import Encodable = require("../../scripts/Framework/Model/Contracts/Encodable");
import Log = require("../../scripts/Framework/Util/Log");
import Util = require("../../scripts/Framework/Util/Util");
import MonitoringViewHandler = require("../../scripts/Handlers/MonitoringViewHandler");
import ActivityWindowCache = require("../../scripts/Framework/Model/ActivityWindowCache");
import IActivityWindowObservable = ActivityWindowCache.IActivityWindowObservable;
import KnockoutBindings = require("../../bootstrapper/KnockoutBindings");
import PipelineModel = require("../../scripts/Framework/Model/Contracts/Pipeline");

import ActivityRunsToolbar = require("./ActivityRunsToolbarViewModel");
import ActivityRunsListHeader = require("./ActivityRunsListHeaderViewModel");

import {FilterSummaryViewModel} from "./FilterSummaryViewModel";

"use strict";

let logger = Log.getLogger({
    loggerName: DataConstants.ActivityWindowListViewModel
});

export interface ICustomFooterEvent {
    detail: {
        visible: boolean;
    };
};

export class ActivityRunsListViewModel extends Framework.Disposable.ChildDisposable {
    public static className: string = DataConstants.ActivityWindowListViewModel;
    private static _instanceCount: number = 0;

    public activityRunsToolbarBindingOptions: KnockoutBindings.IWinJSToolbarValueAccessor;
    public activityRunsListHeaderToolbarBindingOptions: KnockoutBindings.IWinJSToolbarValueAccessor;

    public winJSListView: WinJS.UI.ListView<IActivityWindowObservable> = null;
    public winJSList: WinJS.Binding.List<IActivityWindowObservable> = null;
    public winJSListViewBindingOptions: KnockoutBindings.IWinJSListViewValueAccessor<IActivityWindowObservable> = null;
    public list: KnockoutObservableArray<IActivityWindowObservable>;
    public selectedActivityWindowsEncodables: KnockoutObservableArray<Encodable.ActivityRunEncodable>;
    public latestUpdateStatus: KnockoutObservable<KnockoutObservable<string>>;
    public totalFilterCountStatus: KnockoutObservable<string>;
    public filterSummaryViewModel: FilterSummaryViewModel;
    public selectionSubscription: MessageHandler.ISelectionSubscription;
    public activityRunUpdateSubscription: MessageHandler.IActivityRunUpdateSubscription;
    public monitoringViewSubscription: MessageHandler.IMessageSubscription<string>;
    public viewSubscription: MessageHandler.ISelectionSubscription;
    public customClasses: KnockoutObservable<string> = null;

    public filter: KnockoutObservable<string> = ko.observable("");
    public sort: KnockoutObservable<string> = ko.observable("");
    public monitoringViewHandler: MonitoringViewHandler.MonitoringViewHandler;

    public activityRunsListViewFooterStatus: KnockoutObservable<string> = ko.observable("");
    public makingRequest: KnockoutObservable<boolean>;
    public emptyMessage: KnockoutComputed<string>;

    // TODO Template should be loaded from html (ko.template)
    public template =
    "<div class='activityRunListItem' data-bind='event: {dblclick: onDoubleClick.bind(data, data)}, with: data'> " +
    "<span data-bind='titleText: pipelineName, copy: copyPairs.pipeline'></span> " +
    "<span data-bind='titleText: activityName, copy: copyPairs.activity'></span> " +
    "<span data-bind='titleText: windowStartPair.UTC, copy: copyPairs.windowStart'></span> " +
    "<span data-bind='titleText: windowEndPair.UTC, copy: copyPairs.windowEnd'></span> " +
    "<span data-bind='html: displayStateHtml, attr: { title: stateDescription }, copy: copyPairs.displayState'></span> " +
    "<span data-bind='titleText: activityType, copy: copyPairs.activityType'></span> " +
    "<span data-bind='titleText: runStartPair.UTC, copy: copyPairs.runStart'></span> " +
    "<span data-bind='titleText: runEndPair.UTC, copy: copyPairs.runEnd'></span> " +
    "<span data-bind='titleText: duration, copy: copyPairs.duration'></span> " +
    "<span data-bind='titleText: runAttempts, copy: copyPairs.attempts'></span> " +
    "</div>";

    /* This method is called by the MonitoringViewHandler.
    * It updates the list based on changes to the filter or sort properties in the monitoring view.
    */
    public processFilterChange = () => {
        if (!this._appContext.splitFactoryId() || !this.monitoringViewHandler) {
            return;
        }

        let selectedView = this.monitoringViewHandler.getSelectedView();
        this.filter(selectedView.filter.stringify());
        this.sort(selectedView.sort.stringify());
        this.fetchActivityWindows(false);

        let _filterCount = (selectedView.filter.totalFilterCount() === 0 ? ClientResources.noFilterCountText :
                            selectedView.filter.totalFilterCount() === 1 ? ClientResources.singleFilterCountText :
                            ClientResources.multipleFilterCountText.format(selectedView.filter.totalFilterCount()));
        this.totalFilterCountStatus(_filterCount);
    };

    public fetchActivityWindows = (incrementalFetch: boolean) => {
        if (this._additionalViewFilter() === null || this._additionalViewFilter().filterState === PipelineModel.OneTimePipelineFilterState.Loaded) {
            this.makingRequest(true);
            let currentRefreshId = ++this._refreshId;
            if (!incrementalFetch) {
                this.activityRunsListViewFooterStatus("");
                this.list.removeAll();
                this._appContext.activityWindowCache.clearPageContext(this._instanceName);
            }

            let filter = Util.andFilter(this.filter.peek(), this._additionalViewFilter() ? this._additionalViewFilter().filter : null);
            this._appContext.activityWindowCache.fetchPage(this._instanceName, filter, this.sort()).then((activityWindows) => {
                if (currentRefreshId === this._refreshId) {
                    if (incrementalFetch) {
                        this.list(this.list().concat(activityWindows));
                    } else {
                        this.list(activityWindows);
                    }

                    if (this._appContext.activityWindowCache.hasNextPage(this._instanceName)) {
                        this.activityRunsListViewFooterStatus("<span>" + Framework.Svg.progressRing + "</span><span>" + ClientResources.activityRunsListFooterStatus + "</span>");
                    } else {
                        this.activityRunsListViewFooterStatus("");
                    }

                    this.setLastUpdateTime();
                    this.makingRequest(false);
                    this._makingIncrementalRequest = false;
                }
            }, (error: JQueryXHR) => {
                this._appContext.errorHandler.makeResourceFailedHandler(ClientResources.activityWindowsResource)(error);
                this.makingRequest(false);
                this._makingIncrementalRequest = false;
            });
        }
    };

    // open activity window properties on double click
    public onDoubleClick = (activityWindow: IActivityWindowObservable) => {
        this.removeHighlights();
        this._appContext.openActivityWindowExplorer();

        // get rid of text selection side-effect
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            /* tslint:disable:no-any */
        } else if ((<any>document).selection) {
            (<any>document).selection.empty();
        }
        /* tslint:enable:no-any */
    };

    // Called if the user clicks an item in the activity runs list.
    public onSelectionChanged = (event: CustomEvent) => {
        event.stopPropagation();
        if (!this._selectionUpdateFromAnotherView) {
            this.removeHighlights();

            // build the array of selected activity runs
            let selectedActivityWindowsEncodables: Encodable.ActivityRunEncodable[] = [];
            this.winJSListView.selection.getItems().then((selectedItems: WinJS.UI.IItem<IActivityWindowObservable>[]) => {
                selectedItems.forEach((selectedItem) => {
                    selectedActivityWindowsEncodables.push(new ActivityWindowCache.Encodable(selectedItem.data));
                });
            });

            this._appContext.selectionHandler.pushState(this.selectionSubscription.name, selectedActivityWindowsEncodables);
            this.selectedActivityWindowsEncodables(selectedActivityWindowsEncodables);
        }
    };

    public onFooterVisibilityChanged = (footer: ICustomFooterEvent) => {
        let visible = footer.detail.visible;
        if (visible && !this._makingIncrementalRequest && Util.koPropertyHasValue(this.list) && this.list().length > 0) {
            this._makingIncrementalRequest = true; // to avoid duplicate calls if the user scroll the list view multiple times before the list is updated
            this.fetchActivityWindows(true);
        }
    };

    // TODO paverma Since we are duplicating the list now we need to scope these selectors to their parent element.
    public removeHighlights = () => {
        this.customClasses("");
    };

    public addHighlights = () => {
        this.customClasses(Framework.Constants.CSS.highlightedClass);
    };

    // TODO paverma Verify once again that WinJS list does not support setting arbitrary indices as selected.
    // It seems that it only takes ranges.

    // Called if another view model updates the selection state.
    public processSelectionUpdate = (selectedEncodables: Encodable.Encodable[]) => {
        this._selectionUpdateFromAnotherView = true;
        let selectedIndices: number[] = [];
        let selectedActivityWindowsEncodables: Encodable.ActivityRunEncodable[] = [];

        this.removeHighlights();

        let shouldHighlight = false;

        this.winJSList.forEach((activityWindow: IActivityWindowObservable, index: number) => {
            for (let i = 0; i < selectedEncodables.length; i++) {
                let encodable = selectedEncodables[i];

                switch (encodable.type) {
                    case Encodable.EncodableType.ACTIVITY_RUN:
                        if ((<Encodable.ActivityRunEncodable>encodable).observable === activityWindow) {
                            selectedIndices.push(index);
                            selectedActivityWindowsEncodables.push(<Encodable.ActivityRunEncodable>encodable);
                        }
                        break;

                    case Encodable.EncodableType.LINKED_SERVICE:
                        (<Encodable.LinkedServiceEncodable>encodable).entities.forEach((entity) => {
                            if (activityWindow().entities.contains(entity)) {
                                selectedIndices.push(index);
                                shouldHighlight = true;
                            }
                        });

                        break;

                    default:
                        // otherwise check if we posess the entity so we can highlight it
                        if (activityWindow().entities.contains(encodable)) {
                            selectedIndices.push(index);
                            shouldHighlight = true;
                        }
                }
            }
        });

        if (shouldHighlight) {
            this.addHighlights();
        }

        this.winJSListView.selection.set(selectedIndices);
        this.selectedActivityWindowsEncodables(selectedActivityWindowsEncodables);
        this._selectionUpdateFromAnotherView = false;
    };

    private _appContext: AppContext.AppContext;
    private _selectionUpdateFromAnotherView: boolean = false;
    private _factoryId: string = null;
    private _latestUpdateTime: KnockoutObservable<moment.Moment> = null;
    private _refreshId: number = 0; // refresh id for acitivty windows list
    private _makingIncrementalRequest: boolean = false;
    private _instanceName: string = null;
    private _additionalViewFilter: KnockoutObservable<PipelineModel.IOneTimePipelineFilter> = null;

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, additionalViewFilter: KnockoutObservable<PipelineModel.IOneTimePipelineFilter>) {
        super(lifetimeManager);
        logger.logInfo("Begin create ActivityRunsListViewModel...");

        this._instanceName = ActivityRunsListViewModel.className + (ActivityRunsListViewModel._instanceCount++);

        this._appContext = AppContext.AppContext.getInstance();
        this._factoryId = this._appContext.factoryId();
        this._additionalViewFilter = additionalViewFilter;
        // holds all of the items for the winjs list
        this.list = ko.observableArray<IActivityWindowObservable>();
        this.selectedActivityWindowsEncodables = ko.observableArray<Encodable.ActivityRunEncodable>();

        this.selectionSubscription = {
            name: this._instanceName,
            callback: this.processSelectionUpdate
        };

        this._appContext.selectionHandler.register(this.selectionSubscription);

        // we're going to get this from the RefreshManager later
        this.latestUpdateStatus = ko.observable(ko.observable<string>());
        this.totalFilterCountStatus = ko.observable<string>();
        this.filterSummaryViewModel = new FilterSummaryViewModel(this._lifetimeManager, this.totalFilterCountStatus);

        let activityRunsToolbar = new ActivityRunsToolbar.ActivityRunsToolbarViewModel(this._lifetimeManager, this);
        this.activityRunsToolbarBindingOptions = {
            toolbar: activityRunsToolbar,
            options: {
                shownDisplayMode: "full"
            }
        };

        let activityRunsListHeaderToolbar = new ActivityRunsListHeader.ActivityRunsListHeaderViewModel(this._lifetimeManager);
        this.activityRunsListHeaderToolbarBindingOptions = {
            toolbar: activityRunsListHeaderToolbar,
            options: {
                shownDisplayMode: "full"
            }
        };

        this.makingRequest = ko.observable(false);

        // if we're making a request, we should show loading
        this.emptyMessage = ko.pureComputed(() => {
            return (this.makingRequest() || activityRunsToolbar.makingRequest()) ? ClientResources.activityRunsListLoadingMessage : ClientResources.activityWindowsListEmptyMessage;
        });

        this._lifetimeManager.registerForDispose(this._appContext.splitFactoryId.subscribe(() => {
            this.fetchActivityWindows(false);
        }));

        /* When the global date range is changed, we always clear the window start/end filters.
         * It was decided that this would be the most consistent behavior for now.
         */
        this._lifetimeManager.registerForDispose(this._appContext.globalActivityWindowFilter.subscribe(() => {
            this.monitoringViewHandler.getSelectedView().filter.filterState().windowStart(null);
            this.monitoringViewHandler.getSelectedView().filter.filterState().windowEnd(null);
            this.monitoringViewHandler.pushState(this._instanceName, this.monitoringViewHandler.getState());
            this.fetchActivityWindows(false);
        }));
        this._lifetimeManager.registerForDispose(this._additionalViewFilter.subscribe(() => {
            this.fetchActivityWindows(false);
        }));

        this.customClasses = ko.observable<string>();
        this.winJSListViewBindingOptions = {
            data: this.list,
            options: {
                onselectionchanged: this.onSelectionChanged,
                onfootervisibilitychanged: this.onFooterVisibilityChanged,
                layout: new WinJS.UI.ListLayout(),
                selectionMode: WinJS.UI.SelectionMode.multi,
                tapBehavior: WinJS.UI.TapBehavior.directSelect
            },
            onDoubleClick: this.onDoubleClick,
            template: this.template,
            footerSelector: ".activityRunsListViewFooter",
            resizeTrackingParentSelector: ".activityRunsListView",
            customClasses: this.customClasses
        };

        // subscribe to the monitoring view handler
        this.monitoringViewHandler = this._appContext.monitoringViewHandler;
        this.monitoringViewSubscription = {
            name: this._instanceName,
            callback: this.processFilterChange
        };
        this.monitoringViewHandler.register(this.monitoringViewSubscription);
        this.processFilterChange();

        logger.logInfo("End create ActivityRunsListViewModel.");
    }

    public dispose(): void {
        super.dispose();
        this._appContext.selectionHandler.unregister(this.selectionSubscription);
        this._appContext.activityRunUpdateHandler.unregister(this.activityRunUpdateSubscription);
        this.monitoringViewHandler.unregister(this.monitoringViewSubscription);
        this._appContext.activityWindowCache.clearPageContext(this._instanceName);
    }

    private setLastUpdateTime() {
        // create /update our observables
        if (!this._latestUpdateTime) {
            let element = this._appContext.refreshHandler.createElement(moment());
            this._latestUpdateTime = element.timestamp;
            this.latestUpdateStatus(element.html);
        } else {
            this._latestUpdateTime(moment());
        }
    }
}
