/// <reference path="../../References.d.ts" />
import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");

import ViewConfig = require("../../scripts/Config/ViewConfig");
import Routing = require("../../scripts/Handlers/RoutingHandler");

export class NavToolbarViewModel extends Framework.Toolbar.ToolbarViewModelBase {
    public static className: string = "NavToolbarViewModel";

    public switchTabCommand: Framework.Command.ObservableCommand;
    public dashboardShowing: KnockoutObservable<boolean>;

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();

    constructor(lifetimeManager: Framework.Disposable.IDisposableLifetimeManager) {
        super(lifetimeManager);

        this.dashboardShowing = ko.pureComputed(() => {
            return Microsoft.DataStudio.Application.ShellContext.CurrentRoute().view === ViewConfig.views.homeView;
        });

        this.switchTabCommand = new Framework.Command.ObservableCommand({ icon: Framework.Svg.dashboard, buttonType: "toggle", onclick: this._diagramToggleClicked });

        this.switchTabCommand.tooltip = ko.pureComputed(() => {
            return this.dashboardShowing() ? ClientResources.hideDashboardTooltip : ClientResources.showDashboardTooltip;
        });

        // it's always selected when the dashboard is showing
        this.switchTabCommand.selected = this.dashboardShowing;

        this.addButton(this.switchTabCommand);
    }

    private _diagramToggleClicked = () => {
        let newUrlParams: StringMap<string> = {};
        if (!this.dashboardShowing()) {
            newUrlParams[Routing.urlKeywords.moduleView.value] = Routing.viewName.home;
        } else {
            newUrlParams[Routing.urlKeywords.moduleView.value] = Routing.viewName.edit;
        }
        this._appContext.routingHandler.pushState(NavToolbarViewModel.className, newUrlParams);
    };
}
