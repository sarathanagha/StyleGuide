// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./design.html" />
/// <amd-dependency path="css!./design.css" />

require(["css!datastudio.controls/Stylesheets/color.css"]);
require(["css!datastudio.controls/Stylesheets/mixin/color.css"]);
import ko = require("knockout");

export var template: string = require("text!./design.html");

export class viewModel {
 
    constructor(parameters:any) {
       
    }
   
   

} 

