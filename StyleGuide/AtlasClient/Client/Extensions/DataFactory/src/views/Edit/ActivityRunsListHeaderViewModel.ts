/// <reference path="../../References.d.ts" />
/// <amd-dependency path="css!../../stylesheets/Base.Images.css" />
import AppContext = require("../../scripts/AppContext");
import ActivityWindowModel = require("../../scripts/Framework/Model/Contracts/ActivityWindow");
import DateTimeFilter = require("./DateTimeFilterViewModel");
import ItemListFilter = require("./ItemListFilterViewModel");
import Filter = require("./FilterViewModel");
import Framework = require("../../_generated/Framework");
import Log = require("../../scripts/Framework/Util/Log");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import MonitoringViewHandler = require("../../scripts/Handlers/MonitoringViewHandler");

let ExtendedProperties = ActivityWindowModel.ServiceColumnNames.ExtendedProperties;

let logger = Log.getLogger({
    loggerName: "ActivityRunsListHeaderViewModel"
});

export enum ArrowState {
    NONE,
    UP,
    DOWN
}

export class HeaderCommand extends Framework.Command.ObservableCommand {
    static activeHeaderClass: string = "class='adf-activeHeader'";
    static inactiveFilterHeaderClass: string = "class='adf-inactiveFilterHeader'";
    static activeFilterHeaderClass: string = "class='adf-activeFilterHeader'";
    static template: string = "<span {3}>{0}</span>" +
                            "<span {3}>{1}</span>" +
                            "<span {4}>{2}</span>";

    public arrowState: KnockoutObservable<ArrowState> = ko.observable(ArrowState.NONE);
    public activeFilter: KnockoutObservable<boolean> = ko.observable(false);
    public filterable: boolean;

    constructor(command: Framework.Command.ICommand, filterable: boolean) {
        super(command);

        let iconElement = ko.pureComputed(() => {
            let arrowIcon: string;
            let sortClass: string;
            switch(this.arrowState()) {
                case ArrowState.NONE:
                    arrowIcon = "";
                    sortClass = "";
                    break;
                case ArrowState.UP:
                    arrowIcon = Framework.Svg.sort_up;
                    sortClass = HeaderCommand.activeHeaderClass;
                    break;
                case ArrowState.DOWN:
                    arrowIcon = Framework.Svg.sort_down;
                    sortClass = HeaderCommand.activeHeaderClass;
                    break;
                default:
                    logger.logDebug("Unrecognized switch value: {0}".format(this.arrowState()));
            }

            this.filterable = filterable;
            let filterIcon: string = this.filterable ? Framework.Svg.filter : "";
            let filterClass: string = this.activeFilter() ? HeaderCommand.activeFilterHeaderClass : HeaderCommand.inactiveFilterHeaderClass;
            return HeaderCommand.template.format(this.label(), arrowIcon, filterIcon, sortClass, filterClass);
        });

        this._lifetimeManager.registerForDispose(iconElement);
        this.icon = iconElement;
    }
}

export class ActivityRunsListHeaderViewModel extends Framework.Toolbar.ToolbarViewModelBase {
    public static className: string = "ActivityRunsListHeaderViewModel";
    public monitoringViewSubscription: MessageHandler.IMessageSubscription<string>;

    private _appContext: AppContext.AppContext;

    private _monitoringViewHandler: MonitoringViewHandler.MonitoringViewHandler;
    private _mapSchemaToHeaderCommand: StringMap<HeaderCommand> = {};
    private _mapSchemaToFilterViewModel: StringMap<Filter.FilterViewModel> = {};
    private _mapSortOrderToArrow: StringMap<ArrowState> = {};

    private _columnTitles: string[] =
    [
        ClientResources.activityRunListPipelineTitle,
        ClientResources.activityRunListActivityNameTitle,
        ClientResources.activityRunListWindowStartTitle,
        ClientResources.activityRunListWindowEndTitle,
        ClientResources.activityRunListStateTitle,
        ClientResources.activityRunListActivityTypeTitle,
        ClientResources.activityRunListLastRunStartTitle,
        ClientResources.activityRunListLastRunEndTitle,
        ClientResources.activityRunListDurationTitle,
        ClientResources.activityRunListAttemptsTitle
    ];

    private _columnTooltips: string[] =
    [
        ClientResources.activityWindowListPipelineTooltip,
        ClientResources.activityWindowListActivityNameTooltip,
        ClientResources.activityWindowListWindowStartTooltip,
        ClientResources.activityWindowListWindowEndTooltip,
        ClientResources.activityWindowListStateTooltip,
        ClientResources.activityWindowListActivityTypeTooltip,
        ClientResources.activityWindowListLastRunStartTooltip,
        ClientResources.activityWindowListLastRunEndTooltip,
        ClientResources.activityWindowListDurationTooltip,
        ClientResources.activityWindowListAttemptsTooltip
    ];

    private _primaryEventSchema: string[] =
    [
        ExtendedProperties.PipelineName,
        ExtendedProperties.ActivityName,
        ExtendedProperties.WindowStart,
        ExtendedProperties.WindowEnd,
        ExtendedProperties.WindowState,
        ExtendedProperties.ActivityType,
        ExtendedProperties.LastRunStart,
        ExtendedProperties.LastRunEnd,
        ExtendedProperties.DurationMs,
        ExtendedProperties.Attempts
    ];

    constructor(lifetimeManager: Framework.Disposable.IDisposableLifetimeManager) {
        super(lifetimeManager);

        this._appContext = AppContext.AppContext.getInstance();
        this._monitoringViewHandler = this._appContext.monitoringViewHandler;
        this.monitoringViewSubscription = {
            name: ActivityRunsListHeaderViewModel.className,
            callback: this._updateViewState
        };
        this._monitoringViewHandler.register(this.monitoringViewSubscription);

        this._mapSortOrderToArrow[MonitoringViewHandler.MonitoringViewHandler.sortAscending] = ArrowState.UP;
        this._mapSortOrderToArrow[MonitoringViewHandler.MonitoringViewHandler.sortDescending] = ArrowState.DOWN;

        for (let i = 0; i < this._columnTitles.length; ++i) {
            let filterType = this.getColumnFilterType(this._primaryEventSchema[i]);
            let filterable: boolean = filterType !== Filter.FilterType.SortOnly;
            let filterViewModel: Filter.FilterViewModel;

            let headerCommand: HeaderCommand = new HeaderCommand({
                label: this._columnTitles[i],
                name: this._columnTitles[i],
                tooltip: this._columnTooltips[i],
                onclick: this.columnHeaderClicked(this._primaryEventSchema[i])
            }, filterable);
            this._mapSchemaToHeaderCommand[this._primaryEventSchema[i]] = headerCommand;
            let appBarCommand = this.addButton(headerCommand);

            switch(filterType) {
                case Filter.FilterType.Search:
                case Filter.FilterType.Checkbox:
                    filterViewModel = new ItemListFilter.ItemListFilterViewModel(lifetimeManager, {
                        filterType: filterType,
                        column: this._primaryEventSchema[i],
                        anchor: appBarCommand.element
                    });
                    break;
                case Filter.FilterType.DateTime:
                    filterViewModel = new DateTimeFilter.DateTimeFilterViewModel(lifetimeManager, {
                        filterType: filterType,
                        column: this._primaryEventSchema[i],
                        anchor: appBarCommand.element
                    });
                    break;
                default:
                    filterViewModel = new ItemListFilter.ItemListFilterViewModel(lifetimeManager, {
                        filterType: filterType,
                        column: this._primaryEventSchema[i],
                        anchor: appBarCommand.element
                    });
            }

            this._mapSchemaToFilterViewModel[this._primaryEventSchema[i]] = filterViewModel;

            let filterFlyoutElement = <HTMLElement>(
                $("<div class=\"adf-filterFlyout\" data-bind=\"filterFlyout: { viewModel: filterViewModel }\"> " +
                "</div>").appendTo("body")[0]
            );
            ko.applyBindings(filterViewModel, filterFlyoutElement);
            ko.applyBindings(headerCommand, appBarCommand.element);
        }

        // trigger initial state
        this._updateViewState();
    }

    private columnHeaderClicked = (columnName: string) => {
        return () => {
            this._mapSchemaToFilterViewModel[columnName].showFlyout();
        };
    };

    private _updateViewState = () => {
        let currentView = this._monitoringViewHandler.getSelectedView();
        this._mapSchemaToHeaderCommand[currentView.sort.column].arrowState(this._mapSortOrderToArrow[currentView.sort.order]);

        for (let column in this._mapSchemaToHeaderCommand) {
            if (column !== currentView.sort.column) {
                this._mapSchemaToHeaderCommand[column].arrowState(ArrowState.NONE);
            }

            // activate filter icon(s) on the appropriate column headers.
            this._mapSchemaToHeaderCommand[column].activeFilter(this._mapSchemaToFilterViewModel[column].isActiveFilter());
        }
    };

    private getColumnFilterType(column: string): Filter.FilterType {
        switch(column) {
            case ExtendedProperties.PipelineName:
            case ExtendedProperties.ActivityName:
            case ExtendedProperties.WindowState:
                return Filter.FilterType.Search;
            case ExtendedProperties.WindowStart:
            case ExtendedProperties.WindowEnd:
                return Filter.FilterType.DateTime;
            default:
                return Filter.FilterType.SortOnly;
        }
    }
}
