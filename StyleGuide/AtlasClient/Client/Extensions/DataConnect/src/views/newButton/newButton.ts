/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./newButton.html" />
/// <amd-dependency path="css!../stylesheets/main.css" />

import ko = require("knockout");

export var template: string = require("text!./newButton.html");

"use strict";

export class viewModel {
	public componentConfig: KnockoutObservable<Microsoft.DataStudio.Model.Config.ElementConfig>;

    constructor(params: any) {

        this.componentConfig = params.componentConfig && ko.isObservable(params.componentConfig) ?
            params.componentConfig :
            ko.observable(params.componentConfig);
    }
}
