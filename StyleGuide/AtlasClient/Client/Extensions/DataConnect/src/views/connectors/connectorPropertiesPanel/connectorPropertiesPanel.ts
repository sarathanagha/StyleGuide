/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./connectorPropertiesPanel.html" />
/// <amd-dependency path="css!../../stylesheets/main.css" />

import ko = require("knockout");

export var template: string = require("text!./connectorPropertiesPanel.html");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;
import controls = Microsoft.DataStudio.UxShell.Controls;

"use strict";

export class viewModel {
	
	public connector: KnockoutObservable<models.Connector>;
	public properties: KnockoutObservableArray<{ name: string; value: string }>;
	
	constructor(params: any) {
		this.connector = ko.observable({
			name: ko.observable("DataLakeSales"),
			properties: ko.observable({
				description: ko.observable("Data Lake Sales"),
				type: ko.observable("SQL Server Connector"),
                accessUrl: ko.observable("https://juanConnectionManager.dataconnect.azure.com/$connectors/juanConnector"),
        		server: ko.observable("juan-server"),
        		database: ko.observable("juan-sqldb"),
        		credentials: ko.observable("*******"),
        		gateway: ko.observable("juanGateway")
			})
		});
		
		this.properties = ko.observableArray([
            { name: "Name", value: this.connector().name() },
			{ name: "Description", value: this.connector().properties().description() },
			{ name: "Type", value: this.connector().properties().type() },
			{ name: "Server", value: this.connector().properties().server() },
			{ name: "Database", value: this.connector().properties().database() },
			{ name: "Gateway", value: this.connector().properties().gateway() },
			{ name: "Access URL", value: this.connector().properties().accessUrl() }
        ]);
	}
}
