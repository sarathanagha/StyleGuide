/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./newConnectorWidget.html" />
/// <amd-dependency path="css!../../stylesheets/main.css" />

import ko = require("knockout");

export var template: string = require("text!./newConnectorWidget.html");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;
import controls = Microsoft.DataStudio.UxShell.Controls;
import router = Microsoft.DataStudio.Application.Router;
import services = require("../newGatewayWidget/athenaFrontendService");

"use strict";

export class ConnectionSettings {
    name: KnockoutObservable<string>;
    description: KnockoutObservable<string>;
    server: KnockoutObservable<string>;
    database: KnockoutObservable<string>;
    username: KnockoutObservable<string>;
    password: KnockoutObservable<string>;
    encryptedCredentials: KnockoutObservable<string>;
    authenticationType: KnockoutObservable<string>;
    gatewayUrl: KnockoutObservable<string>;
    account: KnockoutObservable<string>;    // AzureBlob, AzureTable
    
    constructor() {
        this.name = ko.observable("");
        this.description = ko.observable("");
        this.server = ko.observable("");
        this.database = ko.observable("");
        this.username = ko.observable("");
        this.password = ko.observable("");
        this.encryptedCredentials = ko.observable("");
        this.authenticationType = ko.observable("");
        this.gatewayUrl = ko.observable("");
        this.account = ko.observable("");
    }
}

export class viewModel {

    public currentStep: KnockoutObservable<number>;
    public datasourceType: KnockoutObservable<string>;
    public gatewaySelected: KnockoutObservable<any>;
    public connectionSettings: ConnectionSettings;
    public connectionManagerUrl: KnockoutObservable<string>;
    public adminKey: KnockoutObservable<string>;
    public frontendService: services.AthenaFrontendService;
    public processingText = ko.observable("");
    public gatewayList: KnockoutObservableArray<any>;
    public finishCallback: any;
    public connectorSchema: KnockoutComputed<any>;
    public computedConnectionSettings: KnockoutComputed<any>;
    public allConnectorTypes: KnockoutObservableArray<any>;

    constructor(params: any) {
        this.connectionManagerUrl = ko.observable(params.connectionManagerUrl());
        this.adminKey = ko.observable(params.adminKey());
        this.currentStep = ko.observable(0);
        this.datasourceType = params.datasourceType;
        this.gatewaySelected = ko.observable();
        this.connectionSettings = new ConnectionSettings();
        this.frontendService = new services.AthenaFrontendService();
        this.finishCallback = params.callback;

        this.gatewayList = ko.observableArray([]);
        this.allConnectorTypes = ko.observableArray([]);

        this.frontendService.listGateway({
            connectionManagerUrl: this.connectionManagerUrl(),
            adminKey: this.adminKey(),
        }).done(result => {
            this.gatewayList(result);
        });

        this.frontendService.getConnectorSchema({
            connectionManagerUrl: this.connectionManagerUrl(),
            adminKey: this.adminKey()
        }).done(result => {
            $.each(result,(idx, item) => {
                switch (item.name) {
                    case "SqlServer":
                    case "MySql":
                    case "Oracle":
                    case "DB2":
                    case "PostgreSQL":
                    case "Sybase":
                    case "Teradata":
                    case "File":
                    case "Folder":
                        item.isOnPremises = true;
                        break;

                    default:
                        break;
                }

            });
            this.allConnectorTypes(result);
        });

        this.connectorSchema = ko.computed(() => {
            var selected = $.grep(this.allConnectorTypes(),(item, idx) => {
                return item.name === this.datasourceType();
            });
            return selected[0];
        });

        this.computedConnectionSettings = ko.computed(() => {
            var result = {
                name: "",
                address: [],
                authentication: [],
                selectedAuthenticationType: ko.observable(""),
                isOnPremises: false,
                credentialFields: null
            };

            result.credentialFields = ko.computed(() => {
                switch (result.selectedAuthenticationType()) {
                    case "":
                    case "none":
                        return [];
                        break;

                    case "basic":
                    case "windows":
                    case "oauth":
                        return [
                            {
                                propertyValue: ko.observable(""),
                                displayName: "username",
                                name: "username",
                                isPassword: false
                            },
                            {
                                propertyValue: ko.observable(""),
                                displayName: "password",
                                name: "password",
                                isPassword: true
                            }
                        ];
                        break;

                    case "azure-access-key":
                    case "api-key":
                        return [
                            {
                                propertyValue: ko.observable(""),
                                displayName: "key",
                                name: "password",    // storage account key is put in "password" field when calling Athena API.
                                isPassword: true
                            }
                        ];
                        break;

                    default:
                        return [];
                }
            });

            if (!this.connectorSchema())
                return result;

            result.name = this.connectorSchema().name;
            result.isOnPremises = this.connectorSchema().isOnPremises;

            if (this.connectorSchema().connectionSchema) {
                var properties = this.connectorSchema().connectionSchema.properties;

                if (properties.address) {
                    $.each(Object.keys(properties.address.properties),(idx, item) => {
                        result.address.push({
                            propertyValue: ko.observable(""),
                            displayName: item,
                            name: item,
                            required: properties.address.properties[item].required
                        });
                    });
                }

                if (properties.authentication) {
                    $.each(properties.authentication.enum,(idx, item) => {
                        result.authentication.push({
                            displayName: item,
                            name: item
                        });
                    });
                }
            }

            return result;
        });
    }

    public testConnection(viewModel: any): void {
        viewModel.processingText("Testing connection...");

        var connectorRequest = {
            type: this.datasourceType(),
            server: this.connectionSettings.server(),
            database: this.connectionSettings.database(),
            username: this.connectionSettings.username(),
            password: this.connectionSettings.password(),
            account: this.connectionSettings.account(),
            isCredentialEncrypted: false,
            anthenticationType: "basic",
            connectionManagerUrl: this.connectionManagerUrl(),
            adminKey: this.adminKey(),
            gatewayUrl: this.computedConnectionSettings().isOnPremises ? this.gatewaySelected() : null,
            connectionSettings: this.computedConnectionSettings()
        };

        this.frontendService.testConnection(connectorRequest)
            .done(result => {
            if (result.isValid) {
                viewModel.processingText("Test connection succeeded");
                if ($.isFunction(this.finishCallback)) {
                    this.finishCallback();
                }
            } else {
                viewModel.processingText("Test connection failed");
            }
        })
            .fail(result => {
            viewModel.processingText("Test connection failed");
        });
    }

    public gotoNewGateway(viewModel: any): void {
        viewModel.currentStep(1);
    }

    public newGatewayCallback = (createdGateway: any) => {
        this.frontendService.listGateway({
            connectionManagerUrl: this.connectionManagerUrl(),
            adminKey: this.adminKey(),
        }).done(result=> {
            this.gatewayList(result);
            this.gatewaySelected(createdGateway.url);
        });

        this.currentStep(0);
    }
}
