/// <reference path="../../References.d.ts" />
import ActivityRunDetails= require("./ActivityRunDetails");
import Encodable = require("../../scripts/Framework/Model/Contracts/Encodable");
import ActivityRunCommands = require("../../scripts/Services/Commands/ActivityRunCommands");
import Framework = require("../../_generated/Framework");
import ActivityWindowCache = require("../../scripts/Framework/Model/ActivityWindowCache");

export class ActivityRunDetailsToolbarViewModel extends Framework.Toolbar.ToolbarViewModelBase {
    public updateActivityRunHandler: KnockoutObservable<(activityRun: Encodable.ActivityRunEncodable) => () => void>;

    constructor(lifetimeManager: Framework.Disposable.IDisposableLifetimeManager, activityRunDetailsViewModel: ActivityRunDetails.viewModel) {
        super(lifetimeManager);

        let observableArray: KnockoutObservableArray<ActivityWindowCache.Encodable> = <KnockoutObservableArray<ActivityWindowCache.Encodable>>ko.observableArray();

        this._lifetimeManager.registerForDispose(ko.computed(() => {
            observableArray((!activityRunDetailsViewModel.isEmpty() ? [new ActivityWindowCache.Encodable(activityRunDetailsViewModel.activityWindow())] : []));
        }));

        let activityRunCommands = new ActivityRunCommands.ActivityRunCommands(this._lifetimeManager, observableArray);
        this.addMenuButton(activityRunCommands.rerunCommand, activityRunCommands.rerunMenu);

        let refreshCommand = new Framework.Command.ObservableCommand({
            onclick: () => {
                activityRunDetailsViewModel.cancelTimeout();
                activityRunDetailsViewModel.refreshPane();
            },
            icon: Framework.Svg.refresh,
            tooltip: ClientResources.activityRunDetailsRefreshTooltip,
            disabled: false
        });

        this.addButton(refreshCommand);
    }
}
