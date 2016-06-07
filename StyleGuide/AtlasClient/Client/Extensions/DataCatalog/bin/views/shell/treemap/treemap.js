/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./treemap.html", "css!./treemap.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var Logging = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    exports.template = require("text!./treemap.html");
    var viewModel = (function () {
        function viewModel(params) {
            var _this = this;
            this.resx = resx;
            this.minValue = 0;
            this.maxValue = 0;
            this.normalizeValue = 2;
            this.sizes = ["small", "medium", "large"];
            this.callback = function (groupType, data) { };
            this.clickable = ko.observable(false);
            this.tileItems = ko.observable([]);
            this.listItems = ko.observable([]);
            this.expanded = ko.observable(false);
            this.expandable = ko.observable(false);
            this.logger = Logging.getLogger({ category: "Shell Components" });
            this.expandedText = ko.pureComputed(function () {
                return _this.expanded() ? resx.seeLess : resx.seeMore;
            });
            this.onItemSelected = function (data) {
                if (_this.clickable()) {
                    _this.logger.logInfo("Discovery start page: selected tag: " + data);
                    _this.callback("tags", data);
                }
            };
            this.onTileSelected = function (data) {
                if (_this.clickable()) {
                    _this.logger.logInfo("Discovery start page: selected tag tile: " + data.name);
                    _this.callback("tags", data.name);
                }
            };
            this.getMinMax(params.items);
            this.normalizeValues(params.items);
            this.buildLists(params.items);
            this.expandable(this.listItems().length > 0);
            if (params.click) {
                this.callback = params.click;
                this.clickable(true);
            }
        }
        viewModel.prototype.getMinMax = function (items) {
            var _this = this;
            if (items.length) {
                this.minValue = items[0].value;
                this.maxValue = items[0].value;
                items.forEach(function (item) {
                    if (item.value > _this.maxValue) {
                        _this.maxValue = item.value;
                    }
                    if (item.value < _this.minValue) {
                        _this.minValue = item.value;
                    }
                });
            }
        };
        viewModel.prototype.normalizeValues = function (items) {
            var _this = this;
            var range = (this.maxValue - this.minValue) || 1;
            items.forEach(function (item) {
                item.normalizedValue = Math.ceil(((item.value - _this.minValue) / range) * _this.normalizeValue);
                item.css = _this.sizes[item.normalizedValue];
            });
        };
        viewModel.prototype.buildLists = function (items) {
            var _this = this;
            var count = 0;
            items.forEach(function (item) {
                if (count + item.normalizedValue + 1 <= 16) {
                    _this.tileItems().push(item);
                    if (item.normalizedValue === 2) {
                        count += 4;
                    }
                    else {
                        count += item.normalizedValue + 1;
                    }
                }
                else {
                    _this.listItems().push(item.name);
                }
            });
            // Make sure the remaining items fit evenly into four columns.
            var over = this.listItems().length % 4;
            var listItems = this.listItems();
            listItems = listItems.slice(0, listItems.length - over);
            this.listItems(listItems);
        };
        viewModel.prototype.onSeeMore = function () {
            this.expanded(!this.expanded());
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=treemap.js.map