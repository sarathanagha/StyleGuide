/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./connectionManagerHome.html" />

import ko = require("knockout");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;
import controls = Microsoft.DataStudio.UxShell.Controls;
import router = Microsoft.DataStudio.Application.Router;

export var template: string = require("text!./connectionManagerHome.html");

export class viewModel {
    public connectionManager: KnockoutObservable<models.ConnectionManager>;
    public topTasks: KnockoutObservableArray<controls.IActionItem>;
    public ConnectorSectionHeader: KnockoutObservable<string>;
    public GatewaySectionHeader: KnockoutObservable<string>;
    public ConnectorViewAllText: KnockoutObservable<string>;
    public GatewayViewAllText: KnockoutObservable<string>;
        
    constructor(params: any) {
        // TODO: get this data from data model.
        this.connectionManager = ko.observable({
            name: ko.observable("juanConnectionManager"),
            location: ko.observable("westus"),
            properties: ko.observable({
                description: ko.observable("Juan's Connection Manager")
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

        this.topTasks = ko.observableArray([
            {
                name: "+ Add a connection",
                icon: null,
                action: null
            },
            {
                name: "+ Add a gateway",
                icon: null,
                action: ()=> { router.navigate("dataconnect/newgateway"); }
            },
            {
                name: "- Delete this connection manager",
                icon: null,
                action: null
            }
        ]);

        this.ConnectorSectionHeader = ko.observable("Connectors (" + this.connectionManager().connectors().length + ")");
        this.GatewaySectionHeader = ko.observable("Gateways (" + this.connectionManager().gateways().length + ")");

        this.ConnectorViewAllText = ko.observable("View all " + this.connectionManager().connectors().length + " connectors");
        this.GatewayViewAllText = ko.observable("View all " + this.connectionManager().gateways().length + " gateways");        
    }
}