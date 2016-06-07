/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./alertIcon.html" />
/// <amd-dependency path="css!./alertIcon.css" />

export var template: string = require("text!./alertIcon.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public message: KnockoutObservable<string>;
    public showMessage: KnockoutObservable<boolean> = ko.observable(false);
    public isSuccessMessage: KnockoutObservable<boolean> = ko.observable(false);

    constructor(params: any) {
        this.message = params.message;
        this.isSuccessMessage(params.isSuccessMessage ? params.isSuccessMessage : false);

        this.message.subscribe(message => {
            if (message) {
                this.showMessage(true);
                setTimeout(() => { this.showMessage(false) }, 3000);
            }
            else {
                this.showMessage(false);
            }
        });
    }
}