/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./checkboxlist.html", "css!./checkboxlist.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./checkboxlist.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            this.resx = resx;
            var self = this;
            self.max = parameters.max;
            self.data = parameters.data || [];
            self.selected = parameters.selected;
            self.expanded = ko.observable(false);
            var windowSize = Math.min(parameters.numberInitiallyVisible || 4, self.max);
            self.expandable = ko.pureComputed(function () {
                if (self.data.length > 0) {
                    var groupType = self.data[0].groupType;
                    var selected = (self.selected() || []).filter(function (s) { return s.groupType === groupType; });
                    return Math.min(self.data.length, self.max) > Math.max(windowSize, selected.length);
                }
                return false;
            });
            self.computedData = ko.pureComputed(function () {
                var all = [];
                if (self.data.length > 0) {
                    var groupType = self.data[0].groupType;
                    var sorter = function (a, b) {
                        var compareNumbers = function (a, b) {
                            return b - a;
                        };
                        var compareStrings = function (a, b) {
                            if (a > b) {
                                return 1;
                            }
                            if (a < b) {
                                return -1;
                            }
                            return 0;
                        };
                        // Sort highest counts first and then alphabetically
                        return compareNumbers(a.count, b.count) || compareStrings(a.term, b.term);
                    };
                    all = self.data.sort(sorter);
                    all = all.slice(0, self.expanded()
                        ? self.max
                        : windowSize);
                }
                return all;
            });
            self.expandText = ko.pureComputed(function () {
                return self.expanded() ? resx.seeLess : resx.seeMore;
            });
            self.onChange = function (data, event) {
                // Let knockout binding occur prior to calling change method
                setTimeout(function () {
                    parameters.onChange(data, event);
                }, 0);
            };
        }
        viewModel.prototype.onSeeMore = function () {
            this.expanded(!this.expanded());
        };
        viewModel.prototype.formatLabel = function (item) {
            var primaryResxKey = (item.groupType + "_verbose_" + item.term).replace(/\s/g, "").toLowerCase();
            var secondaryResxKey = (item.groupType + "_" + item.term).replace(/\s/g, "").toLowerCase();
            var label = item.term;
            if (resx[primaryResxKey] || resx[secondaryResxKey]) {
                label = util.stringCapitalize(resx[primaryResxKey] || resx[secondaryResxKey]);
            }
            var countString = item.count !== undefined ? util.stringFormat(" ({0})", item.count) : "";
            return util.removeHtmlTags(label + countString);
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=checkboxlist.js.map