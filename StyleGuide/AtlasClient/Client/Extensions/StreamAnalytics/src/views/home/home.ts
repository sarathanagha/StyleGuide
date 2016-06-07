/// <reference path="../../References.d.ts" />
/// <reference path="../../module.d.ts" />
/// <amd-dependency path="text!./home.html" />
/// <amd-dependency path="css!./home.css" />

import ko = require("knockout");

export var template: string = require("text!./home.html");

import Controls = Microsoft.DataStudio.UxShell.Controls;

export class viewModel {

    public greeting: KnockoutComputed<string>;

    public quickLaunchTitle: KnockoutObservable<string>;
    public quickLaunchButtons: KnockoutObservableArray<Microsoft.DataStudio.Model.ICommand>;

    public recentlyOpenedItems: KnockoutObservableArray<Microsoft.DataStudio.Model.ICommand>;
    public recentlyOpenedTitle: KnockoutObservable<string>;

    private user: KnockoutObservable<{ name: string }>;

    constructor(params: any) {

        // TODO get from Service
        this.user = ko.observable({ name: "Juan" });

        // TODO get template from resource;
        this.greeting = ko.computed((): string => "Hi " + this.user().name);

        this.quickLaunchTitle = ko.observable("Quick Launch");

        this.quickLaunchButtons = ko.observableArray([
            {
                name: "New Stream Job",
                action: null
            },
            {
                name: "Event Hub",
                action: null
            },
            {
                name: "Get Data",
                action: null
            },
        ]);

        this.recentlyOpenedTitle = ko.observable("My Recent Jobs");

        // TODO get these from Service
        this.recentlyOpenedItems = ko.observableArray([
            {
                name: "Algorithm Mania",
                action: null
            },
            {
                name: "Fraud Prediction",
                action: null
            },
            {
                name: "Boosted Trees",
                action: null
            },
            {
                name: "Elevator Maintenance",
                action: null
            },
            {
                name: "Wine Recommendations",
                action: null
            },
            {
                name: "Sentiment Analysis",
                action: null
            },
        ]);
    }
}
