/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./predicatePanel.html" />
/// <amd-dependency path="css!./predicatePanel.css" />

export var template: string = require("text!./predicatePanel.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public rdxContext: Models.RdxContext;

    constructor(params: any) {
        this.rdxContext = params.rdxContext;
    }

    public handleEnterEsc = () => {
        var event2 = <any>event;
        if (event2.keyCode == 13) {
            this.rdxContext.streamEventSourceHits();
            return false;
        }
        return true;
    }
}