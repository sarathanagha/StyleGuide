/// <reference path="../../References.d.ts" />
/// <reference path="../../module.d.ts" />
/// <amd-dependency path="text!./home.html" />
/// <amd-dependency path="css!./home.css" />
import ko = require("knockout");
export var template: string = require("text!./home.html");
import Controls = Microsoft.DataStudio.UxShell.Controls;
import Models = Microsoft.DataStudio.Crystal.Models;

export class viewModel {
    public heatmap: Models.Heatmap;
    public rdxContext: Models.RdxContext;
    public settingsPanelOpen: KnockoutObservable<boolean>;

    constructor(params: any) {
        this.rdxContext = new Models.RdxContext();
        this.heatmap = this.rdxContext.heatmap;
        this.settingsPanelOpen = this.rdxContext.settingsPanelOpen;

        // TODO: dont hack starting state like this, this is for demos
        $('.sidePanelExpandedSwitch').hide();
        $(".rightSidePanel").hide();
    }

    public dispose(): void {
        // nuke all subscriptions of all models
        $(".rightSidePanel").show();
    }
}
