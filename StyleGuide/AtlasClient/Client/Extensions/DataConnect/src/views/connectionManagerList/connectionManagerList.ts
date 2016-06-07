/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./connectionManagerList.html" />

import ko = require("knockout");
import models = Microsoft.DataStudio.Modules.DataConnect.Models;
import router = Microsoft.DataStudio.Application.Router;

export var template: string = require("text!./connectionManagerList.html");

export class viewModel {

    public connectionManagersTreeData: KnockoutObservableArray<any>;
    public connectionManagersTreeConfig: KnockoutObservable<any>;

    constructor(params: any) {

        this.connectionManagersTreeConfig = ko.observable({});

        var connectionManagers = [
            {
                name: ko.observable("juanConnectionManager"),
                location: ko.observable("westus"),
                properties: ko.observable({
                    description: ko.observable("Juan's Connection Manager")
                }),
                connectors: ko.observableArray([
                    {
                        name: ko.observable("connection-01")
                    }
                ]),
                gateways: ko.observableArray([
                    {
                        name: ko.observable("gateway-01")
                    }
                ])
            },
            {
                name: ko.observable("juanConnectionManager2"),
                location: ko.observable("westus"),
                properties: ko.observable({
                    description: ko.observable("Juan's second Connection Manager")
                }),
                connectors: ko.observableArray([
                    {
                        name: ko.observable("connection-02")
                    }
                ]),
                gateways: ko.observableArray([
                    {
                        name: ko.observable("gateway-02")
                    }
                ])
            }
        ];

        this.connectionManagersTreeData = ko.observableArray([
            {
                id: "root",
                text: "Azure Data Connect",
                children: [
                    {
                        id: "connectors/" + connectionManagers[0].name(),
                        text: "Connectors",
                        children: connectionManagers[0].connectors().map(connector=> ({
                            id: "connector/" + connector.name(),
                            text: connector.name()
                        }))
                    },
                    {
                        id: "gateways/" + connectionManagers[0].name(),
                        text: "Gateways",
                        children: connectionManagers[0].gateways().map(gateway=> ({
                            id: "gateway/" + gateway.name(),
                            text: gateway.name()
                        }))
                    }
                ]
            }
        ]);
    }

    public onSelectNode(sender: any, args: { node: any; selected: any[]; event: Event }): void {
        var id = args.node.id.split("/");

        if (id.length < 2) {
            router.navigate("dataconnect"); // default to connection manager home page
            return;
        }

        switch (id[0]) {
            case "connectionManagers":
                router.navigate("dataconnect/connectionManagers/" + args.node.text);
                break;
            case "connectors":
                router.navigate("dataconnect/connectors/");
                break;
            case "gateways":
                router.navigate("dataconnect/gateways/");
                break;
            case "connector":
                router.navigate("dataconnect/connectors/" + args.node.text);
                break;
            case "gateway":
                router.navigate("dataconnect/gateways/" + args.node.text);
                break;
            default:
                break;
        }
    }
}