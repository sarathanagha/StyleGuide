/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./new.html" />
/// <amd-dependency path="css!../../stylesheets/main.css" />

import ko = require("knockout");

export var template: string = require("text!./new.html");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;
import controls = Microsoft.DataStudio.UxShell.Controls;
import router = Microsoft.DataStudio.Application.Router;
import services = require("../../newGatewayWidget/athenaFrontendService");

"use strict";

export interface ConnectorTypeSelectionListItem {
    name: string;
    isOnPremises: boolean;
}

export interface SqlServerConnectionSettings {
    name: KnockoutObservable<string>;
    description: KnockoutObservable<string>;
    server: KnockoutObservable<string>;
}

export class viewModel {

    public currentStep: KnockoutObservable<number>;
    public datasourceType: KnockoutObservable<string>;
    public connectionManagerUrl: KnockoutObservable<string>;
    public adminKey: KnockoutObservable<string>;
    public allConnectorTypes: KnockoutObservableArray<any>;

    constructor(params: any) {
        this.currentStep = ko.observable(0);
        this.datasourceType = ko.observable("");

        this.connectionManagerUrl = ko.observable("https://querytest.dataconnect.clouddatahub-int.net");
        this.adminKey = ko.observable("YWRjIzEyNDk5NGRlLTQ2NTQtNDdhMi04NTM3LTkyNDQwOTEyOWFmYyMxMTFmNzdiZS0yODAyLTQxYTctOTE4MS0wNDQ3NTdkYWVhYjQjNy84a0R0aFZZSDdZZVpyWmdpUlZ6SGwrbHJ5VmNUUTRTRzNYc2Zwc3Vubz0=");

        this.allConnectorTypes = ko.observableArray([]);
        var svc = new services.AthenaFrontendService();

        svc.getConnectorSchema({
            connectionManagerUrl: this.connectionManagerUrl(),
            adminKey: this.adminKey()
        }).done(result => {
            this.allConnectorTypes(result);
        });
    }

    public onDataSourceTypeSelected(selectedItem: ConnectorTypeSelectionListItem): void {
        this.datasourceType(selectedItem.name);
        this.currentStep(1);
    }

    public gotoBack(): void {
        router.navigate("dataconnect");
    }
}
