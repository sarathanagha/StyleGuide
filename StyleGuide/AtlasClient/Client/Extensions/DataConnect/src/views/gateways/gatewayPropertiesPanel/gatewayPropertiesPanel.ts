/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./gatewayPropertiesPanel.html" />
/// <amd-dependency path="css!../../stylesheets/main.css" />

import ko = require("knockout");

export var template: string = require("text!./gatewayPropertiesPanel.html");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;
import controls = Microsoft.DataStudio.UxShell.Controls;

"use strict";

export class viewModel {
	
	public gateway: KnockoutObservable<models.Gateway>;
	public properties: KnockoutObservableArray<{ name: string; value: string }>;
	
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
		
		this.properties = ko.observableArray([
            { name: "Name", value: this.gateway().name() },
			{ name: "Description", value: this.gateway().properties().description() },
			{ name: "Version", value: this.gateway().properties().version() },
			{ name: "Status", value: this.gateway().properties().status() },
			{ name: "Host Service URL", value: this.gateway().properties().hostServiceUrl() },
			{ name: "Access URL", value: this.gateway().properties().accessUrl() }
        ]);
	}
}
