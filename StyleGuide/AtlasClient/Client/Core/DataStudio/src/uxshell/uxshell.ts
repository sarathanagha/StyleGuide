/// <reference path="references.d.ts" />

/// <amd-dependency path="text!./uxshell.html" />

import Model = Microsoft.DataStudio.Model;
import Application = Microsoft.DataStudio.Application;

export var template: string = require("text!./uxshell.html");

const shellV2Name: string = "ShellV2";

export class viewModel {
    private moduleConfig: KnockoutComputed<Model.Config.ModuleConfigProxy>;

    public isCommonHeaderVisible: KnockoutComputed<boolean>;
    public commonHeader: string;
    public isStudioPanelVisible: boolean;

    public currentExtensionId: KnockoutComputed<string>;
        
    constructor(params: any) {
        this.moduleConfig = ko.computed(() => Application.ShellContext.CurrentModuleContext().moduleConfig());
        this.currentExtensionId = ko.computed(() => this.moduleConfig().name() ? this.moduleConfig().name() + '-container': '');

        this.isCommonHeaderVisible = ko.computed(()=> this.isCommonHeaderVisibleImpl());
        
        this.commonHeader = Application.ShellContext.ShellName === shellV2Name ? "uxshell-authoringHeader" : "uxshell-commonHeader";
        this.isStudioPanelVisible = Application.ShellContext.ShellName === shellV2Name;
    }

    public isCommonHeaderVisibleImpl(): boolean {
        //TODO: Revisit this hardcoding. For now, we don't want to show common header for blueprint sign in view

        var viewConfig = Application.ShellContext.CurrentModuleViewConfig;

        var moduleName = this.moduleConfig && this.moduleConfig() && this.moduleConfig().name ? this.moduleConfig().name() : "";
        var viewName = viewConfig && viewConfig() && viewConfig().name ? viewConfig().name(): "";

        return moduleName !== "blueprint" || viewName !== "signin";
    }
}