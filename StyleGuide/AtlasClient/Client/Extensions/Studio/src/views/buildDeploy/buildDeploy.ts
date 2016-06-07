/// <reference path="../references.d.ts" />

/// <amd-dependency path="text!./buildDeploy.html" />
/// <amd-dependency path="css!./buildDeploy.css" />

import ko = require("knockout");
import AppContext = require("../../scripts/AppContext");
import ADF = require("../../scripts/Framework/ADF");

export var template: string = require("text!./buildDeploy.html");

export interface IStatusTile {
    icon: KnockoutObservable<string>;
    title: KnockoutObservable<string>;
    count: KnockoutObservable<number>;
}

export class viewModel extends ADF.Framework.Disposable.RootDisposable {

    public modules: KnockoutObservableArray<StudioExtension.DataModels.StudioModule> = ko.observableArray(<StudioExtension.DataModels.StudioModule[]>[]);
    public activeModule: KnockoutObservable<StudioExtension.DataModels.StudioModule> = ko.observable(null);

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();

    public moduleClicked = (module: StudioExtension.DataModels.StudioModule) => {
        this.activeModule(module);
    }

    constructor(params: any) {
        super();
        
        //TODO: Get the subscriptionId from dropdown and get the module name from activeModule
        this._appContext.subscriptionId("4e3d943e-5a1e-4be7-a4ca-1a87181aff2d");
        this._appContext.selectedModuleName("ADF");
        
        //TODO: Change api url for GetAvailableModules to be consistent with GetPrimitives
        this._appContext.studioCache.GetAvailableModules(
            { subscriptionId: this._appContext.subscriptionId() }, 
            { subscriptionId: this._appContext.subscriptionId() }, 
            this.ListModules, 
            true
        );  
    }
    
    private ListModules = (data :StudioExtension.DataModels.StudioModule[]): void => {
        this.modules(data);
        if (data.length > 0) {
            this.activeModule(this.modules()[0]);
        }
    }
}
