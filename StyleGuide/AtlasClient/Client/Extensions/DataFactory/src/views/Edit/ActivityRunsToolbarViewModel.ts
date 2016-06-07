/// <reference path="../../References.d.ts" />
import AppContext = require("../../scripts/AppContext");
import ActivityRunsListViewModel = require("./ActivityRunsListViewModel");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import MonitoringViewHandler = require("../../scripts/Handlers/MonitoringViewHandler");
import Encodable = require("../../scripts/Framework/Model/Contracts/Encodable");

import ActivityRunCommands = require("../../scripts/Services/Commands/ActivityRunCommands");

import Framework = require("../../_generated/Framework");

let logger = Framework.Log.getLogger({
    loggerName: "ActivityRunsToolbarViewModel"
});

export class ActivityRunsToolbarViewModel extends Framework.Toolbar.ToolbarViewModelBase {
    private static className: string = "ActivityRunsToolbarViewModel";

    // whether or not this toolbar is making any ajax requests
    public makingRequest: KnockoutObservable<boolean>;

    public monitoringViewHandler: MonitoringViewHandler.MonitoringViewHandler;
    public monitoringViewSubscription: MessageHandler.IMessageSubscription<string>;
    public updateActivityRunHandler: KnockoutObservable<(activityRun: Encodable.ActivityRunEncodable) => () => void>;

    public clearFilterCommand: Framework.Command.ObservableCommand;

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();

    /* Other Event Handlers */

    private processFilterChange = () => {
        this.clearFilterCommand.disabled(this.monitoringViewHandler.getSelectedView().filter.isEmpty());
    };

    private clearFilterHandler = () => {
        let currentView = this.monitoringViewHandler.getSelectedView();
        if (!currentView.filter.isEmpty()) {
            this.monitoringViewHandler.clearFilter();
        }
    };

    constructor(lifetimeManager: Framework.Disposable.IDisposableLifetimeManager, activityRunsListViewModel: ActivityRunsListViewModel.ActivityRunsListViewModel) {
        super(lifetimeManager);

        logger.logDebug("Begin create ActivityRunsToolbarViewModel...");

        this.monitoringViewHandler = this._appContext.monitoringViewHandler;
        this.monitoringViewSubscription = {
            name: ActivityRunsToolbarViewModel.className,
            callback: this.processFilterChange
        };
        this.monitoringViewHandler.register(this.monitoringViewSubscription);

        let activityRunCommands = new ActivityRunCommands.ActivityRunCommands(this._lifetimeManager, activityRunsListViewModel.selectedActivityWindowsEncodables);
        this.makingRequest = activityRunCommands.makingRequest;

        this.addMenuButton(activityRunCommands.rerunCommand, activityRunCommands.rerunMenu);

        let refreshCommand = new Framework.Command.ObservableCommand({
            onclick: () => { activityRunsListViewModel.fetchActivityWindows(false); },
            icon: Framework.Svg.refresh,
            tooltip: ClientResources.activityRunsListRefreshTooltip
        });

        this.addButton(refreshCommand);

        this.clearFilterCommand = new Framework.Command.ObservableCommand({
            onclick: () => { this.clearFilterHandler(); },
            icon: Framework.Svg.filter_clear_all,
            tooltip: ClientResources.activityWindowsClearFilterTooltip,
            disabled: this.monitoringViewHandler.getSelectedView().filter.isEmpty()
        });

        this.addButton(this.clearFilterCommand);

        logger.logDebug("End create ActivityRunsToolbarViewModel.");
    }

    public dispose() {
        this.monitoringViewHandler.unregister(this.monitoringViewSubscription);
    }
}
