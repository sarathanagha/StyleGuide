/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./noResults.html" />
/// <amd-dependency path="css!./noResults.css" />

export var template: string = require("text!./noResults.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public rdxContext: Models.RdxContext;

    constructor(params: any) {
        this.rdxContext = params.rdxContext;
    }

}