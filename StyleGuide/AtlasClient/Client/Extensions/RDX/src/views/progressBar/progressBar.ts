/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./progressBar.html" />
/// <amd-dependency path="css!./progressBar.css" />

export var template: string = require("text!./progressBar.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public progressMessage: KnockoutObservable<string>;
    public progressPercentage: KnockoutObservable<number>;

    constructor(params: any) {
        this.progressMessage = params.progressMessage;
        this.progressPercentage = params.progressPercentage;
    }
}