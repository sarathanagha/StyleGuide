/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./list.html", "css!./list.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    exports.template = require("text!./list.html");
    var viewModel = (function () {
        function viewModel(params) {
            var _this = this;
            this.resx = resx;
            this.callback = function (groupType, data) { };
            this.onItemSelected = function (data) {
                if (_this.clickable()) {
                    _this.callback(_this.groupType(), data);
                }
            };
            this.computedList = ko.pureComputed(function () {
                var list = _this.list();
                if (_this.expandable() && !_this.expanded() && _this.showCount() > 0) {
                    list = list.slice(0, _this.showCount());
                }
                return list;
            });
            this.expandedText = ko.pureComputed(function () {
                return _this.expanded() ? resx.seeLess : resx.seeMore;
            });
            var self = this;
            self.title = ko.observable(params.title);
            self.list = ko.observableArray(params.data);
            self.showCount = ko.observable(params.numberInitiallyVisible);
            self.callback = params.click || self.callback;
            self.expanded = ko.observable(false);
            self.expandable = ko.observable(false);
            self.clickable = ko.observable(!!self.callback);
            self.groupType = ko.observable(params.groupType || '');
            self.expandable(params.data.length > params.numberInitiallyVisible && self.showCount() > 0);
        }
        viewModel.prototype.onSeeMore = function () {
            this.expanded(!this.expanded());
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=list.js.map