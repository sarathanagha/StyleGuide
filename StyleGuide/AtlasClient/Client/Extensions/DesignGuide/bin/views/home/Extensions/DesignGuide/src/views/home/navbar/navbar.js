// <reference path="../../../References.d.ts" />
// <reference path="../scripts/knockout/BindingHandler.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
"use strict";
/// <amd-dependency path="text!./navbar.html" />
var ko = require("knockout");
exports.template = require("text!./navbar.html");
var viewModel = (function () {
    function viewModel(parameters) {
        var _this = this;
        this.currentTab = ko.observable();
        this.currentSubTab = ko.observable();
        this.heightnav = ko.observable(false);
        this.currentIndex = ko.observable();
        this.enabledetails = function (data, event) {
            _this.views.forEach(function (view) {
                if (data.name == view.name && _this.currentTab() == data.name) {
                    view.visible(!view.visible());
                }
            }, _this);
            _this.currentTab(data.name);
            if (($('#Sidemenu')).height() - ($('.waveBlueDark')).height() - 28 > ($('#nav')).height()) {
                _this.heightnav(true);
            }
            else {
                _this.heightnav(false);
            }
        };
        this.enableChildView = function (data, index) {
            console.log("Child:::", data, _this, index());
            _this.currentIndex(index());
        };
        this.currentTab = parameters.currentTab;
        this.currentSubTab = parameters.currentSubTab;
        this.views = parameters.views;
        this.currentIndex = parameters.currentIndex;
        this.heightnav(false);
    }
    return viewModel;
}());
exports.viewModel = viewModel;
ko.bindingHandlers['stopBubble'] = {
    init: function (element) {
        ko.utils.registerEventHandler(element, "click", function (event) {
            event.cancelBubble = true;
            if (event.stopPropagation) {
                event.stopPropagation();
            }
        });
    }
};
