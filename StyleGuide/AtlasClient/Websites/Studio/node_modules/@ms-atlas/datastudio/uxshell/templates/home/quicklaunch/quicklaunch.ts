/// <reference path="../../../references.d.ts" />
/// <amd-dependency path="text!./quicklaunch.html" />
/// <amd-dependency path="css!./quicklaunch.css" />

import Model = Microsoft.DataStudio.Model;

export var template: string = require("text!./quicklaunch.html");

export class viewModel {

    public buttons: KnockoutObservableArray<Model.ICommand>;
    public title: KnockoutObservable<string>;

    constructor(params: { buttons: KnockoutObservableArray<Model.ICommand>; title: KnockoutObservable<string> }) {
        this.buttons = params.buttons;
        this.title = params.title;
    }
}