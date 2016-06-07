/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./helpBubble.html" />
/// <amd-dependency path="text!./legendFilter.html" />
/// <amd-dependency path="text!./predicateInfo.html" />
/// <amd-dependency path="css!./helpBubble.css" />

export var template: string = require("text!./helpBubble.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public message: KnockoutObservable<string>;
    public showMessage: KnockoutObservable<boolean> = ko.observable(false);
    public direction: KnockoutObservable<string> = ko.observable('right');

    constructor(params: any) {
        var helpMessage: string = require('text!./' + params.messageType + '.html')
        this.message = ko.observable(helpMessage);
        this.direction(params.direction);

        this.message.subscribe(message => {
            if (message) {
                this.showMessage(true);
                setTimeout(() => { this.showMessage(false) }, 5000);
            }
            else {
                this.showMessage(false);
            }
        });

        $(window).on('click.closeHelpBubble', () => { this.showMessage(false); });
    }
}