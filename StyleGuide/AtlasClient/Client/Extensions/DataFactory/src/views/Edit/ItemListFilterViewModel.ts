/// <reference path="../../References.d.ts" />

import ActivityWindowModel = require("../../scripts/Framework/Model/Contracts/ActivityWindow");
import DataCache = require("../../scripts/Framework/Model/DataCache");
import Filter = require("./FilterViewModel");
import Framework = require("../../_generated/Framework");
import Log = require("../../scripts/Framework/Util/Log");
import MonitoringViewHandler = require("../../scripts/Handlers/MonitoringViewHandler");
import View = require("../../scripts/Framework/Model/MonitoringView");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");

interface IFilterListItem {
    checked: KnockoutObservable<boolean>;
    name: string;
    filter: string;
}

let logger = Log.getLogger({
    loggerName: "ItemListFilterViewModel"
});

export class ItemListFilterViewModel extends Filter.FilterViewModel {
    public static className: string = Framework.DataConstants.activityRunsListFilterViewModel;

    public items: KnockoutObservableArray<IFilterListItem>;
    public filteredItems: KnockoutComputed<IFilterListItem[]>;
    public searchTerm: KnockoutObservable<string>;

    public pipelinesQueryView: DataCache.DataCacheView<MdpExtension.DataModels.BatchPipeline[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;

    public isActiveFilter = () : boolean => {
        let existingFilters = this.monitoringViewHandler.getSelectedView().filter.mapColumnToFilterState(this.column);
        return existingFilters && existingFilters() && existingFilters().length > 0;
    };

    public showFlyout = () => {
        this.previousListState = [];
        this.items().forEach((item: IFilterListItem) => {
            this.previousListState.push(item.checked());
        });
        this.updateViewState();
        super.showFlyoutBase();
    };

    public updateViewState = () => {
        super.updateViewStateBase();

        let existingFilters = this.monitoringViewHandler.getSelectedView().filter.mapColumnToFilterState(this.column);
        this.items().forEach((item: IFilterListItem) => {
            if (existingFilters.indexOf(item.filter) >= 0) {
                item.checked(true);
            } else {
                if (!this.sortUpdated) {
                    item.checked(false);
                }
            }
        });

        // reset sort update var.
        this.sortUpdated = false;
    };

    public okClicked = () => {
        this.flyoutControl.hide();

        let listStateChanged: boolean = false;
        this.items().forEach((item: IFilterListItem, index: number) => {
            if (item.checked() !== this.previousListState[index]) {
                listStateChanged = true;
                return;
            }
        });

        if (listStateChanged) {
            let existingFilters = this.monitoringViewHandler.getSelectedView().filter.mapColumnToFilterState(this.column);
            existingFilters.removeAll();

            this.items().forEach((item: IFilterListItem) => {
                if (item.checked() && item.filter) {
                    logger.logDebug("Adding filter for column {0}, query: {1}".format(this.column, item.filter));
                    existingFilters.push(item.filter);
                }
            });

            this.monitoringViewHandler.pushNotification();
        }
    };

    public cancelClicked = () => {
        this.flyoutControl.hide();
        for(let i = 0; i < this.previousListState.length; i++) {
            this.items()[i].checked(this.previousListState[i]);
        }
    };

    public sortAscendingClicked = () => {
        this.sortClickedHandler(MonitoringViewHandler.MonitoringViewHandler.sortAscending);
    };

    public sortDescendingClicked = () => {
        this.sortClickedHandler(MonitoringViewHandler.MonitoringViewHandler.sortDescending);
    };

    protected sortClickedHandler = (order: string) => {
        this.sortUpdated = true;
        super.sortClickedHandlerBase(order);
    };

    private lifetimeManager: Framework.TypeDeclarations.DisposableLifetimeManager;

    constructor(lifetimeManager: Framework.TypeDeclarations.DisposableLifetimeManager, filterDetails: Filter.IFilterDetails) {
        super(lifetimeManager, filterDetails);
        this.lifetimeManager = lifetimeManager;

        this.monitoringViewSubscription = {
            name: ItemListFilterViewModel.className,
            callback: this.updateViewState
        };
        this.monitoringViewHandler.register(this.monitoringViewSubscription);

        this.pipelinesQueryView = this.appContext.armDataFactoryCache.pipelineListCacheObject.createView();

        this.searchTerm = ko.observable<string>("");
        this.items = ko.observableArray<IFilterListItem>();
        this.filteredItems = ko.pureComputed(() => {
            return this.items().filter((item: IFilterListItem) => {
                return item.name.toUpperCase().search(this.searchTerm().toUpperCase()) >= 0;
            });
        });
        this.populateItemList();
    }

    private previousListState: boolean[];
    private sortUpdated: boolean;

    // This method populates the list of available filters for a given column.
    private populateItemList(): void {
        let itemList: IFilterListItem[] = [];

        switch(this.column) {
            case this.extendedProperties.PipelineName:
                this.pipelinesQueryView.fetch({
                    subscriptionId: this.appContext.splitFactoryId().subscriptionId,
                    resourceGroupName: this.appContext.splitFactoryId().resourceGroupName,
                    factoryName: this.appContext.splitFactoryId().dataFactoryName
                }).then((pipelines: MdpExtension.DataModels.BatchPipeline[]) => {
                    pipelines.forEach((pipeline) => {
                       itemList.push({
                           checked: ko.observable(false),
                           name: pipeline.name(),
                           filter: View.equalityFilterTemplate.format(this.extendedProperties.PipelineName, pipeline.name())
                       });
                    });

                    this.items(itemList);
                }, (error) => {
                    logger.logError("Failed to fetch pipelines, error: {0}".format(error));
                });
                break;
            case this.extendedProperties.ActivityName:
                this.pipelinesQueryView.fetch({
                    subscriptionId: this.appContext.splitFactoryId().subscriptionId,
                    resourceGroupName: this.appContext.splitFactoryId().resourceGroupName,
                    factoryName: this.appContext.splitFactoryId().dataFactoryName
                }).then((pipelines: MdpExtension.DataModels.BatchPipeline[]) => {
                    pipelines.forEach((pipeline: MdpExtension.DataModels.BatchPipeline) => {
                       pipeline.properties().activities().forEach((activity: MdpExtension.DataModels.Activity) => {
                           // Check the activity name is unique before pushing it to the itemList.
                           if (itemList.filter((value: IFilterListItem) => {
                               return value.name === activity.name();
                           }).length === 0) {
                               itemList.push({
                                   checked: ko.observable(false),
                                   name: activity.name(),
                                   filter: View.equalityFilterTemplate.format(this.extendedProperties.ActivityName, activity.name())
                               });
                           }
                       });
                    });

                    this.items(itemList);
                }, (error) => {
                    logger.logError("Failed to fetch pipelines, error: {0}".format(error));
                });
                break;
            case this.extendedProperties.WindowState:
                let windowStates = ActivityWindowModel.States;
                for(let stateKey in windowStates) {
                    let windowState: ActivityWindowModel.IState = windowStates[stateKey];
                    itemList.push({
                        checked: ko.observable(false),
                        name: windowState.displayName,
                        filter: View.equalityFilterTemplate.format(this.extendedProperties.WindowState, windowState.name)
                    });

                    if(windowState.substates) {
                        for(let substateKey in windowState.substates) {
                            let windowSubstate: ActivityWindowModel.ISubstate = windowState.substates[substateKey];
                            itemList.push({
                                checked: ko.observable(false),
                                name: "{0}: {1}".format(windowState.displayName, windowSubstate.displayName),
                                filter: View.dualEqualityFilterTemplate.format(
                                    this.extendedProperties.WindowState, windowState.name,
                                    this.extendedProperties.WindowSubstate, windowSubstate.name)
                            });
                        }
                    }
                }
                this.items(itemList);
                break;
            default:
                logger.logDebug("No items to fetch for column: {0}".format(this.column));
        }
    }
}
