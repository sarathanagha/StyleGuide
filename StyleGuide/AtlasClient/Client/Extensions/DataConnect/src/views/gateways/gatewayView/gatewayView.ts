/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./gatewayView.html" />
/// <amd-dependency path="css!../../stylesheets/main.css" />

import ko = require("knockout");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;
import controls = Microsoft.DataStudio.UxShell.Controls;

export var template: string = require("text!./gatewayView.html");

export class viewModel {

	public gateway: KnockoutObservable<models.Gateway>;
	public topTasks: KnockoutObservableArray<controls.IActionItem>;
	public certificateTasks: KnockoutObservableArray<controls.IActionItem>;

	constructor(params: any) {
		this.gateway = ko.observable({
			name: ko.observable("DataLakeCentralGateway"),
			properties: ko.observable({
				description: ko.observable("Data Lake Central Gateway"),
				version: ko.observable("1.5.5699.1"),
				status: ko.observable("Online"),
				hostServiceUrl: ko.observable("https://juan-server:8085/$hostService"),
				accessUrl: ko.observable("https://juanConnectionManager.dataconnect.azure.com/$gateways/juanGateway")
			})
		});
		
		this.topTasks = ko.observableArray([
            {
                name: "Update Gateway",
                icon: null,
                action: null
            },
            {
                name: "Delete Gateway",
                icon: null,
                action: null
            }
        ]);
		
		this.certificateTasks = ko.observableArray([
            {
                name: "View Certificate",
                icon: null,
                action: null
            },
            {
                name: "Export Certificate",
                icon: null,
                action: null
            }
        ]);
	}

}
