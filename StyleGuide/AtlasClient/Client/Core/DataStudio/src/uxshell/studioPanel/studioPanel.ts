/// <reference path="../references.d.ts" />
/// <amd-dependency path="text!./studioPanel.html" />
/// <amd-dependency path="css!./studioPanel.css" />

import Model = Microsoft.DataStudio.Model;
import Application = Microsoft.DataStudio.Application;

export var template: string = require("text!./studioPanel.html");

export class viewModel {
    public treeData: KnockoutObservable<any> = ko.observable(null);

    constructor(params: any) {
        let ShellV2: any = Application.ShellContext;
        let module = ModuleCatalog.getModule("datastudio-studio");
        
        // TODO iannight: remove tree placeholder
        this.treeData({
            data: ko.observable(null)
        });
    }
}
