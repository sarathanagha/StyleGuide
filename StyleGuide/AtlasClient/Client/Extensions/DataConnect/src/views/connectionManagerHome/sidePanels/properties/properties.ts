/// <reference path="../../../../References.d.ts" />
/// <amd-dependency path="text!./properties.html" />

import ko = require("knockout");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;

export var template: string = require("text!./properties.html");

export interface propertyPair {
    name: KnockoutObservable<string>;
    value: KnockoutObservable<string>;
}

export class viewModel {
    public connectionManager: KnockoutObservable<models.ConnectionManager>;
    public Name: KnockoutObservable<string>;
    public Location: KnockoutObservable<string>;
    public Subscription: KnockoutObservable<string>;
    public ResourceGroup: KnockoutObservable<string>;
    public ProvisionState: KnockoutObservable<string>;
    public Url: KnockoutObservable<string>;
    public AccessKey: KnockoutObservable<string>;

    public properties: KnockoutObservableArray<{name: string, value: string}>;

    constructor(params: any) {
        this.connectionManager = ko.observable({
            name: ko.observable("juanConnectionManager"),
            location: ko.observable("westus"),
            subscription: ko.observable("a7f4d17c-45ca-4165-ac20-7c34fe9ad30a"),
            resourceGroup: ko.observable("JuanRG"),
            properties: ko.observable({
                description: ko.observable("Juan's Connection Manager"),
                provisionState: ko.observable("Succeeded"),
                url: ko.observable("https://juanConnectionManager.dataconnect.azure.com")
            }),
            connectors: ko.observableArray([
                {
                    name: ko.observable("connection-01"),
                    properties: ko.observable({
                        description: ko.observable("connection 1"),
                        type: ko.observable("Azure Table"),
                        accessUrl: ko.observable(""),
                		server: ko.observable(""),
                		database: ko.observable(""),
                		credentials: ko.observable(""),
                		gateway: ko.observable("")
                    })
                },
                {
                    name: ko.observable("connection-02"),
                    properties: ko.observable({
                        description: ko.observable("connection 2"),
                        type: ko.observable("SQL Server"),
                        accessUrl: ko.observable(""),
                		server: ko.observable(""),
                		database: ko.observable(""),
                		credentials: ko.observable(""),
                		gateway: ko.observable("")
                    })
                }
            ]),
            gateways: ko.observableArray([
                {
                    name: ko.observable("gateway-01"),
                    description: ko.observable("connection 2"),
                    properties: ko.observable({
                        description: ko.observable("Juan's Default Gateway"),
                        version: ko.observable("1.5.5699.1"),
                        status: ko.observable("Online"),
                        hostServiceUrl: ko.observable("https://juan-server:8085/$hostService"),
                        accessUrl: ko.observable("https://juanConnectionManager.dataconnect.azure.com/$gateways/juanGateway")
                    })
                }
            ])
        });

        this.properties = ko.observableArray([
            { name: "Name", value: this.connectionManager().name() },
            { name: "Location", value: this.connectionManager().location() },
            { name: "Subscription", value: this.connectionManager().subscription() },
            { name: "ResourceGroup", value: this.connectionManager().resourceGroup() },
            { name: "ProvisionState", value: this.connectionManager().properties().provisionState() },
            { name: "Url", value: this.connectionManager().properties().url() }
        ]);
    }
}