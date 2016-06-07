/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./AddDataView.html" />
/// <amd-dependency path="css!./AddDataView.css" />

import ko = require("knockout");

export var template: string = require("text!./AddDataView.html");

import controls = Microsoft.DataStudio.UxShell.Controls;
import models = Microsoft.DataStudio.Modules.DataConnect.Models;

export class viewModel {

    private searchText: KnockoutObservable<string>;
    private showAzureSubscriptions: KnockoutObservable<boolean>;

    constructor(params: any) {
        this.searchText = ko.observable("");
        this.showAzureSubscriptions = ko.observable(false);
    }

    public mySubmit() {
        // TBD [raghum] to add functionality for search within the resource explorer.
    }

    public ShowAzureSubscriptions() {
        this.showAzureSubscriptions(!this.showAzureSubscriptions());
    }
}
