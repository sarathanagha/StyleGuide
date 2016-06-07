/// <reference path="../references.d.ts" />
/// <amd-dependency path="text!./labelButton.html" />
/// <amd-dependency path="css!./labelButton.css" />

import Model = Microsoft.DataStudio.Model;

export var template: string = require("text!./labelButton.html");

export class viewModel {

    public componentConfig: KnockoutObservable<Model.Config.ElementConfig>;

    constructor(params: any) {
        this.componentConfig = ko.isObservable(params.componentConfig)?
            params.componentConfig :
            ko.observable(params.componentConfig);
    }
}