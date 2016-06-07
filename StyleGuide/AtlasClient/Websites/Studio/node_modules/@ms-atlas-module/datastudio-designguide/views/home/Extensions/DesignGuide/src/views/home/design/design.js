// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
"use strict";
/// <amd-dependency path="text!./design.html" />
/// <amd-dependency path="css!./design.css" />
require(["css!datastudio.controls/Stylesheets/color.css"]);
require(["css!datastudio.controls/Stylesheets/mixin/color.css"]);
exports.template = require("text!./design.html");
var viewModel = (function () {
    function viewModel(parameters) {
    }
    return viewModel;
}());
exports.viewModel = viewModel;
