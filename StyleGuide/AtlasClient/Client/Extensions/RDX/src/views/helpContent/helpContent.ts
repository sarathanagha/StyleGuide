/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./helpContent.html" />
/// <amd-dependency path="css!./helpContent.css" />

export var template: string = require("text!./helpContent.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public rdxContext: Models.RdxContext;

    constructor(params: any) {
        this.rdxContext = params.rdxContext;
    }

}