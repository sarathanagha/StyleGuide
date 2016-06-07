/// <reference path="../references.d.ts" />

/// <amd-dependency path="text!./landingPage.html" />
/// <amd-dependency path="text!./landingPage.svg" />
/// <amd-dependency path="css!./landingPage.css" />

import ko = require("knockout");

export var template: string = require("text!./landingPage.html");
export var svg: string = require("text!./landingPage.svg");

export interface IStatusTile {
    icon: KnockoutObservable<string>;
    title: KnockoutObservable<string>;
    count: KnockoutObservable<number>;
}

export class viewModel {

    public greeting: KnockoutComputed<string>;
    public svg: string = svg;
    public message: string;
    public title: string;

    private user: KnockoutObservable<Microsoft.DataStudio.Model.IUser>;

    constructor(params:any) {

        this.user = ko.observable(Microsoft.DataStudio.Managers.AuthenticationManager.instance.getCurrentUser());
        this.greeting = ko.computed((): string =>"Hi " + this.user().name);
        this.title = "Welcome to Cortana Analytics Studio";
        this.message = "Click on a tab to explore. (<a href='studio/editor'>Editor</a>)";
    }
}
