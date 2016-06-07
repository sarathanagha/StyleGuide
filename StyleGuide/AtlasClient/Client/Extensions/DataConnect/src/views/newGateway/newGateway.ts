/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./newGateway.html" />
/// <amd-dependency path="css!../stylesheets/main.css" />

import ko = require("knockout");

export var template: string = require("text!./newGateway.html");

"use strict";

export class viewModel {
    public that: any;
    public connectionManagerUrl: KnockoutObservable<string>;
    public adminKey: KnockoutObservable<string>;
    
    constructor(params: any) {
        this.connectionManagerUrl = ko.observable("https://querytest.dataconnect.clouddatahub-int.net");
        this.adminKey = ko.observable("YWRjIzEyNDk5NGRlLTQ2NTQtNDdhMi04NTM3LTkyNDQwOTEyOWFmYyMxMTFmNzdiZS0yODAyLTQxYTctOTE4MS0wNDQ3NTdkYWVhYjQjNy84a0R0aFZZSDdZZVpyWmdpUlZ6SGwrbHJ5VmNUUTRTRzNYc2Zwc3Vubz0=");     
      
        this.that = this;
    }

}
