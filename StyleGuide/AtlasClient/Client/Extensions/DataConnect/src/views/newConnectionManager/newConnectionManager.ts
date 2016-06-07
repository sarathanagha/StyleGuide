/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./newConnectionManager.html" />
/// <amd-dependency path="css!../stylesheets/main.css" />

import ko = require("knockout");

export var template: string = require("text!./newConnectionManager.html");
import controls = Microsoft.DataStudio.UxShell.Controls;

"use strict";

export class NewConnectionManagerFormViewModel {
	public name =  ko.observable("");
	public description = ko.observable("");
	public subscriptionId = ko.observable("");
	public resourceGroup = ko.observable("");
	public region = ko.observable("");
}

export class viewModel {
	
	public formFields: KnockoutObservable<NewConnectionManagerFormViewModel>;
	
	constructor(params: any) {
		this.formFields = ko.observable(new NewConnectionManagerFormViewModel());
	}
}
