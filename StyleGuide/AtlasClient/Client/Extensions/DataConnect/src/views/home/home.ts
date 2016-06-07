/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./home.html" />
/// <amd-dependency path="css!../stylesheets/main.css" />
/// <amd-dependency path="css!./home.css" />

import ko = require("knockout");

export var template: string = require("text!./home.html");
import Controls = Microsoft.DataStudio.UxShell.Controls;
import router = Microsoft.DataStudio.Application.Router;

export interface IStatusTile {
    icon: KnockoutObservable<string>;
    title: KnockoutObservable<string>;
    count: KnockoutObservable<number>;
}

export class viewModel {

    public greeting: KnockoutComputed<string>;

    public quickLaunchTitle: KnockoutObservable<string>;
    public quickLaunchButtons: KnockoutObservableArray<Microsoft.DataStudio.Model.ICommand>;

    public notificationTitle: KnockoutObservable<string>;
    public notificationItems: KnockoutObservableArray<any>;

    public activityItems: KnockoutObservableArray<Controls.IActionItem>;
    public connectionManagers: KnockoutObservableArray<Controls.IActionItem>;
    public statusTiles: KnockoutObservableArray<IStatusTile>;
    
    private user: KnockoutObservable<{ name: string }>;

    constructor(params: any) {

        // TODO get from Service
        this.user = ko.observable({ name: "Juan" });

        // TODO get template from resource;
        this.greeting = ko.computed((): string => this.user().name + "'s Data Connect Home");

        this.quickLaunchTitle = ko.observable("Top Tasks");

        this.quickLaunchButtons = ko.observableArray([
            //{
            //    name: "New Connection Manager",
            //    action: () => { router.navigate("dataconnect/new"); }
            //},
            {
                name: "New Connection",
                action: () => { router.navigate("dataconnect/newConnector"); }
            },
                        {
                name: "New Gateway",
                action: () => { router.navigate("dataconnect/newgateway"); }
            },   
            {
                name: "+ New Task",
                action: null
            }
        ]);

        this.connectionManagers = ko.observableArray([
            {
                name: "Internal Software",
                icon: "icon-Atlas_DataFactory",
                action: null
            },
            {
                name: "IT-Redmond Gateway",
                icon: "icon-Atlas_DataFactory",
                action: null
            },
            {
                name: "IT-China Gateway",
                icon: "icon-Atlas_DataFactory",
                action: null
            },            
            {
                name: "Investment",
                icon: "icon-Atlas_DataFactory",
                action: null
            },
            {
                name: "Service Requests",
                icon: "icon-Atlas_DataFactory",
                action: null
            }
        ]);

        this.notificationTitle = ko.observable("Notifications");
        this.notificationItems = ko.observableArray<any>([
            {
                icon: "Images/error.svg",
                title: 'SQL Server connection "DataLake Sales" is not available. ',
                time: "Today at 11:15 AM",
                action: () => { router.navigate('blueprint/notifications'); }
            },
            {
                icon: "Images/success.svg",
                title: "The DataLake sales connection is now using the DataLake Shared Gateway.",
                time: "Today at 11:09 AM",
                action: () => { router.navigate('blueprint/notifications'); }
            },
            {
                icon: "Images/warning.svg",
                title: "The Central Shared Gateway is expring in 3 days.",
                time: "Today at 10:49 AM",
                action: () => { router.navigate('blueprint/notifications'); }
            },
            {
                icon: "Images/success.svg",
                title: "DataLake Central Gateway is updated.",
                time: "Today at 10:15 AM",
                action: () => { router.navigate('blueprint/notifications'); }
            }
        ]);


        this.activityItems = ko.observableArray<Controls.IActionItem>([
            {
                name: "Connector 1 edited.",
                icon: "icon-Atlas_DataFactory",
                action: null
            },
            {
                name: "Connector 2 edited.",
                icon: "icon-Atlas_DataFactory",
                action: null
            }
        ]);
        
        this.statusTiles = ko.observableArray<IStatusTile>([
            //{
            //    icon: ko.observable("icon-Atlas_Stream"),
            //    title: ko.observable("CONNECTION MANAGERS"),
            //    count: ko.observable(4),
            //},
            {
                icon: ko.observable("icon-Atlas_Stream"),
                title: ko.observable("CONNECTIONS"),
                count: ko.observable(2),
            },
            {
                icon: ko.observable("icon-Atlas_Stream"),
                title: ko.observable("GATEWAYS"),
                count: ko.observable(1),
            }
        ]);
    }
}