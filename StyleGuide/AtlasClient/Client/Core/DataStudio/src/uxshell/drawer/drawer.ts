/// <reference path="../references.d.ts" />
/// <amd-dependency path="text!./drawer.html" />
/// <amd-dependency path="css!./drawer.css" />

import Model = Microsoft.DataStudio.Model;
import Application = Microsoft.DataStudio.Application;
export var template: string = require("text!./drawer.html");
export class viewModel {
    
    public viewConfig: KnockoutComputed<Model.Config.ViewConfigProxy>;

    public inputValue: KnockoutComputed<string>;
    public showInputValue: KnockoutComputed<boolean>;

    // TODO Enforce strong typing
    public drawerPanelElements: KnockoutComputed<Microsoft.DataStudio.Model.Config.ShellElementConfigProxy[][]>;
    public panelComponentName: KnockoutComputed<KnockoutObservable<string>>;

    constructor(params: any) {

        // TODO add computed update handler
        this.inputValue = ko.computed(() => Application.ShellContext.CurrentModuleContext().mainInputValue());
        this.showInputValue = ko.computed(()=>this.inputValue() !== typeof "undefined" && this.inputValue() !== null);

        this.viewConfig = Application.ShellContext.CurrentModuleViewConfig;

        this.panelComponentName = ko.pureComputed(()=>{
            var componentName: KnockoutObservable<string> = null;
            var drawerElements: Microsoft.DataStudio.Model.Config.ShellElementConfigProxy[][] = null;
            if (this.viewConfig() && this.viewConfig().drawerPanel && this.viewConfig().drawerPanel()) {
                drawerElements = [this.viewConfig().drawerPanel()];
                componentName = drawerElements[0][0].componentName;
            }
            return componentName;
        });

        this.drawerPanelElements = ko.pureComputed(()=>{
            var drawerElements: Microsoft.DataStudio.Model.Config.ShellElementConfigProxy[][] = null;
            if (this.viewConfig().drawerPanel) {
                drawerElements = [this.viewConfig().drawerPanel()];
            }
            return drawerElements;
        }, this);
        
        
    }

    
}


