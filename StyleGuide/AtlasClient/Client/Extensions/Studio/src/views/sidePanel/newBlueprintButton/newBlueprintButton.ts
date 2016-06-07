/// <reference path="../../references.d.ts" />

/// <amd-dependency path="text!./newBlueprintButton.html" />

import ko = require("knockout");

export var template: string = require("text!./newBlueprintButton.html");

export class viewModel {
    public componentConfig: KnockoutObservable<Microsoft.DataStudio.Model.Config.ElementConfig>;

    // TODO make .ctor type strongly typed.
    constructor(params: any) {

        this.componentConfig = params.componentConfig && ko.isObservable(params.componentConfig) ?
            params.componentConfig :
            ko.observable(params.componentConfig);
    }
}
