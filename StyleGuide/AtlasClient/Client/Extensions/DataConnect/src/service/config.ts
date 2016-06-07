/// <reference path="../References.d.ts" />

"use strict";

export class DataConnectConfig {

    static sidePanelConfig: Microsoft.DataStudio.Model.Config.SidePanel = {
        top: [
            {
                icon: "fa fa-plus fa-2x",
                text: "New",
                componentName: "dataconnect-newButton"
            },
            {
                icon: "fa fa-home fa-2x",
                text: "Connection Managers",
                componentName: "dataconnect-connectionManagerList"
            }
        ]
    };

    private static globalLeftPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
        {
            icon: "fa fa-home fa-2x",
            text: "Connection Managers",
            componentName: "dataconnect-connectionManagerList"
        }
    ];

    private static connectionManagerHomeRightPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
        {
            icon: "fa fa-th-list fa-15x",
            text: "Properties",
            componentName: "dataconnect-connectionManagerHome-sidePanels-properties"
        }
    ];

    public static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig = {
        name: "dataconnect",
        text: "Data Connections",
        symbol: "\ue60e",
        url: "dataconnect",
        defaultViewName: "home",
        sidePanel: null,
        drawer: null,
        views: [
            {
                name: "home",
                componentName: "dataconnect-home"
            },
            {
                name: "connectionManagers",
                componentName: "dataconnect-connectionManagerHome",
                rightPanel: DataConnectConfig.connectionManagerHomeRightPanel
            },
            {
                name: "addDataView",
                componentName: "dataconnect-addDataView"
            },
            {
                name: "new",
                componentName: "dataconnect-newConnectionManager"
            },
            {
                name: "newgateway",
                componentName: "dataconnect-newGateway"
            },
            {
                name: "newConnector",
                componentName: "dataconnect-connectors-new"
            },
            {
                name: "gateways",
                componentName: "dataconnect-gateways-gatewayView",
                rightPanel: [
                    {
                        icon: "fa fa-th-list fa-15x",
                        componentName: "dataconnect-gateways-gatewayPropertiesPanel"
                    }
                ]
            },
            {
                name: "connectors",
                componentName: "dataconnect-connectors-connectorsView",
                rightPanel: [
                    {
                        icon: "fa fa-th-list fa-15x",
                        componentName: "dataconnect-connectors-connectorPropertiesPanel"
                    }
                ]
            }
        ]
    };
}
