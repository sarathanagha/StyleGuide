/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./connectorsView.html" />
/// <amd-dependency path="css!../../stylesheets/main.css" />

import ko = require("knockout");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;
import controls = Microsoft.DataStudio.UxShell.Controls;

export var template: string = require("text!./connectorsView.html");

export class viewModel {

	public topTasks: KnockoutObservableArray<controls.IActionItem>;
    public connector: KnockoutObservable<models.Connector>;

	constructor(params: any) {
		this.topTasks = ko.observableArray([
            {
                name: "Test Connection",
                icon: null,
                action: null
            },
            {
                name: "Delete this connection",
                icon: null,
                action: null
            }
        ]);
		
        this.connector = ko.observable({
            name: ko.observable("DataLakeSales"),
            properties: null
        });
	}

}
