// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
/// <amd-dependency path="text!./home.html" />
/// <amd-dependency path="css!./home.css" />
"use strict";
var ko = require("knockout");
exports.template = require("text!./home.html");
var view = require('./navmodel');
var shouter = require("./scrollSpy");
var viewModel = (function () {
    function viewModel() {
        var _this = this;
        this.shouter = new ko.subscribable();
        this.currentView = ko.observable('designguide-home-about');
        this.currentTab = ko.observable('About');
        this.previousLabel = ko.observable('');
        this.nextLabel = ko.observable('Design');
        this.currentSubTab = ko.observable('');
        this.currentIndex = ko.observable(0);
        console.log(shouter);
        this.views = new view.DesignGuideModel().views();
        this.shouter.subscribe(function (newValue) {
            _this.views.forEach(function (view) {
                if (_this.currentTab() === view.name) {
                    (view.children[newValue] != undefined) ? _this.currentSubTab(view.children[newValue].name) : _this.currentSubTab('');
                }
            }, _this);
        }, this, viewModel.messageToPublish);
        this.currentIndex.subscribe(function (index) {
            _this.shouter.notifySubscribers(index, viewModel.message);
        }, this);
        this.currentTab.subscribe(function (newText) {
            var index = 0;
            _this.views.forEach(function (view) {
                if (newText === view.name) {
                    _this.shouter.notifySubscribers(newText, viewModel.Reset);
                    //lastScrollTop = undefined;
                    ($('.editorArea')).scrollTop(0);
                    _this.views[index + 1] ? _this.nextLabel(_this.views[index + 1].name) : _this.nextLabel('');
                    _this.views[index - 1] ? _this.previousLabel(_this.views[index - 1].name) : _this.previousLabel('');
                    _this.currentView(view.component);
                    _this.views[index].visible(true);
                    if (view.children.length > 0) {
                        _this.currentSubTab(view.children[0].name);
                    }
                    else {
                        _this.currentSubTab('');
                    }
                }
                else {
                    _this.views[index].visible(false);
                }
                index++;
            }, _this);
        }, this);
    }
    viewModel.prototype.navigate = function (data, event) {
        var _this = this;
        var index = 0;
        this.views.forEach(function (view) {
            if (_this.currentTab() == view.name) {
                (event.currentTarget.className == 'prev') ? _this.currentTab(_this.views[index - 1].name) : _this.currentTab(_this.views[index + 1].name);
                //lastScrollTop = undefined;
                _this.shouter.notifySubscribers({}, viewModel.Reset);
                ($('.editorArea')).scrollTop(0);
                return;
            }
            index++;
        }, this);
    };
    viewModel.messageToPublish = 'messageToPublish';
    viewModel.message = 'message';
    viewModel.Reset = 'Reset';
    return viewModel;
}());
exports.viewModel = viewModel;
