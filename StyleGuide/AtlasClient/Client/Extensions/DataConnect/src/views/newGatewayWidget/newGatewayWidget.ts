/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./newGatewayWidget.html" />
/// <amd-dependency path="css!../stylesheets/main.css" />

import ko = require("knockout");

export var template: string = require("text!./newGatewayWidget.html");
import controls = Microsoft.DataStudio.UxShell.Controls;
import router = Microsoft.DataStudio.Application.Router;
import services = require("./athenaFrontendService");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;

"use strict";

export class NewGatewayFormViewModel {
    public name = ko.observable("");
    public description = ko.observable("");
}

export class viewModel {

    public formFields: KnockoutObservable<NewGatewayFormViewModel>;
    public key: KnockoutObservable<string>;
    public step: KnockoutObservable<number>;
    public that: any;
    public processing = ko.observable(false);
    public connectionManagerUrl: KnockoutObservable<string>;
    public adminKey: KnockoutObservable<string>;
    public finishCallback: any;
    public createdGateway: any;
    
    constructor(params: any) {
        this.connectionManagerUrl = params.connectionManagerUrl;
        this.adminKey = params.adminKey;
        this.finishCallback = params.callback;

        this.formFields = ko.observable(new NewGatewayFormViewModel());

        this.key = ko.observable("");
        this.step = ko.observable(1);
        this.createdGateway = null;
        this.that = this;
    }

    public createGateway(viewModel: any): void {
        viewModel.processing(true);

        var gatewayRequest = {
            name: viewModel.formFields().name(),
            description: viewModel.formFields().description(),
            connectionManagerUrl: this.connectionManagerUrl(),
            adminKey: this.adminKey()
        };

        var svc = new services.AthenaFrontendService();

        svc.createGateway(gatewayRequest)
            .done(result => {
                viewModel.createdGateway = result;
                viewModel.key(result.registerationKey);
                viewModel.step(2);
                viewModel.processing(false);
            })
    }

    public finish(): void {
        if ($.isFunction(this.finishCallback)) {
            this.finishCallback(this.createdGateway);
        } else {
            router.navigate("dataconnect");
        }
    }
}
