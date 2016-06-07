/// <reference path="../references.d.ts" />
/// <amd-dependency path="text!./commandBar.html" />
/// <amd-dependency path="css!./commandBar.css" />

import Model = Microsoft.DataStudio.Model;
import ShellContext = Microsoft.DataStudio.Application.ShellContext;

export var template: string = require("text!./commandBar.html");

export class viewModel {
    public viewConfig: KnockoutComputed<Model.Config.ViewConfigProxy>;
    public commandBarComponnentName: KnockoutComputed<string>;

    constructor(params: any) {
        var self = this;

        self.viewConfig = ShellContext.CurrentModuleViewConfig;

        self.commandBarComponnentName = ko.computed(() => {
            if (self.viewConfig && self.viewConfig() && self.viewConfig().commandBarComponentName && self.viewConfig().commandBarComponentName()) {
                return self.viewConfig().commandBarComponentName();
            }
            return null;
        }).extend({
            rateLimit: {
                timeout: 1,
                method: "notifyWhenChangesStop"
            }
        });
    }
}
