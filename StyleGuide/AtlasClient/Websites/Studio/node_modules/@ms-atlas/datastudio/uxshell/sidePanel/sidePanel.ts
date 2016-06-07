/// <reference path="../references.d.ts" />
/// <amd-dependency path="text!./sidePanel.html" />
/// <amd-dependency path="css!./sidePanel.css" />

import Model = Microsoft.DataStudio.Model;
import Application = Microsoft.DataStudio.Application;

export var template: string = require("text!./sidePanel.html");

export class viewModel {
    public sidePanelConfig: KnockoutComputed<Model.Config.SidePanelProxy>;

    constructor(params: any) {
        this.sidePanelConfig = ko.computed(()=>Application.ShellContext.CurrentModuleContext().moduleConfig().sidePanel);
    }
}
