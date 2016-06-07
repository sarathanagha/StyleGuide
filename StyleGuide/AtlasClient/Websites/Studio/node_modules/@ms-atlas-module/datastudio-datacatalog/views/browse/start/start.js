// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./start.html", "css!./start.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
    var utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./start.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.resx = resx;
            this.searchTerm = browseManager.searchText;
            this.searchResults = browseManager.searchResult;
            this.isSearching = browseManager.isSearching;
            this.listLimit = 7;
            this.showClearButton = ko.pureComputed(function () {
                return !!$.trim(_this.searchTerm());
            });
            this.tags = ko.pureComputed(function () {
                var items = [];
                if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
                    var group = browseManager.filterTypes().groups.filter(function (g) { return g.groupType === "tags"; })[0];
                    if (group && group.items && group.items.length) {
                        group.items.forEach(function (i) {
                            items.push({ name: i.term, value: i.count });
                        });
                    }
                }
                return items;
            });
            this.experts = ko.pureComputed(function () {
                var experts = [];
                if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
                    var group = browseManager.filterTypes().groups.filter(function (g) { return g.groupType === "experts"; })[0];
                    if (group && group.items && group.items.length) {
                        group.items.forEach(function (i) {
                            experts.push(i.term);
                        });
                    }
                }
                return experts;
            });
            this.sources = ko.pureComputed(function () {
                var sources = [];
                if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
                    var group = browseManager.filterTypes().groups.filter(function (g) { return g.groupType === "sourceType"; })[0];
                    if (group && group.items && group.items.length) {
                        group.items.forEach(function (i) {
                            sources.push(_this.formatLabel(i.groupType, i.term));
                        });
                    }
                }
                return sources;
            });
            this.types = ko.pureComputed(function () {
                var types = [];
                if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
                    var group = browseManager.filterTypes().groups.filter(function (g) { return g.groupType === "objectType"; })[0];
                    if (group && group.items && group.items.length) {
                        group.items.forEach(function (i) {
                            types.push(_this.formatLabel(i.groupType, i.term));
                        });
                    }
                }
                return types;
            });
        }
        viewModel.prototype.doSearch = function (data, event) {
            var _this = this;
            if (event && event.target) {
                logger.logInfo("Mangifying glass clicked for search from first start page");
            }
            var executeSearch = function () {
                browseManager.firstRun = false;
                browseManager.doSearch({ resetPage: true });
            };
            // See if there is a default search
            userProfileService.getSavedSearches()
                .done(function (savedSearches) {
                var defaultSearch = utils.arrayFirst(savedSearches.searches.filter(function (s) { return s.isDefault; }));
                if (defaultSearch && !_this.searchTerm()) {
                    browseManager.firstRun = false;
                    browseManager.applySavedSearch(defaultSearch);
                }
                else {
                    executeSearch();
                }
            })
                .fail(executeSearch);
        };
        viewModel.prototype.onSearchKeyUp = function (data, event) {
            if (event.keyCode === 13) {
                logger.logInfo("Enter key pressed for search from first start page");
                this.doSearch();
            }
        };
        viewModel.prototype.clearSearch = function () {
            logger.logInfo("Search text cleared via clear button from first start page");
            this.searchTerm("");
        };
        viewModel.prototype.selectFacet = function (groupType, data) {
            browseManager.selectedFilters().push({
                groupType: groupType,
                term: data,
                count: 0
            });
            browseManager.doSearch({ preserveGroup: groupType, resetPage: true });
        };
        viewModel.prototype.formatLabel = function (groupType, term) {
            var primaryResxKey = (groupType + "_verbose_" + term).replace(/\s/g, "").toLowerCase();
            var secondaryResxKey = (groupType + "_" + term).replace(/\s/g, "").toLowerCase();
            var label = term;
            if (resx[primaryResxKey] || resx[secondaryResxKey]) {
                label = utils.stringCapitalize(resx[primaryResxKey] || resx[secondaryResxKey]);
            }
            return label;
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=start.js.map