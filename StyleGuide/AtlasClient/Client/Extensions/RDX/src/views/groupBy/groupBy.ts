/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./groupBy.html" />
/// <amd-dependency path="css!./groupBy.css" />

export var template: string = require("text!./groupBy.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public rdxContext: Models.RdxContext;

    constructor(params: any) {
        this.rdxContext = params.rdxContext;
    }

    public handleEnter = (d, e) => {
        if (e.keyCode == 13)
            this.rdxContext.streamEventSourceHits();
        return true;
    }
}