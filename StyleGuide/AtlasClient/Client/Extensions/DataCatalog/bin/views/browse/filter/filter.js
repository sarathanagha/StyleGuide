// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./filter.html", "css!./filter.css"], function (require, exports, ko) {
    var manager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
    var SavedSearch = Microsoft.DataStudio.DataCatalog.Models.SavedSearch;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    var utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./filter.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.appliedSearch = manager.appliedSearch;
            this.filterTypes = manager.filterTypes;
            this.selectedFilters = manager.selectedFilters;
            this.previousSearchText = manager.previousSearchText;
            this.container = manager.container;
            this.resx = resx;
            this.isExpanded = viewModel.isExpanded;
            this.isFilterExpanded = viewModel.isFilterExpanded;
            this.isDefiningSearch = ko.observable(false);
            this.isSavingSearch = ko.observable(false);
            this.searchDefinition = ko.observable("");
            this.additionalSearchTerm = ko.observable();
            this.showClearButton = ko.pureComputed(function () {
                return !!$.trim(_this.additionalSearchTerm());
            });
            this.onFilterChanged = function (data, event) {
                logger.logInfo("filter changed");
                var groupToPreserve = null;
                if (event.target.checked) {
                    // Only preserve the group when selected (not de-selected).
                    groupToPreserve = data.groupType;
                }
                if (!_this.hasCurrentFilter()) {
                    manager.doSearch({ resetPage: true, maxFacetTerms: 100, resetStart: true });
                }
                else {
                    manager.doSearch({ resetPage: true, preserveGroup: groupToPreserve });
                }
            };
            this.hasCurrentFilter = ko.pureComputed(function () {
                return !!_this.searchTerms().length || !!manager.selectedFilters().length || !!manager.container();
            });
            this.onlyFilterIsContainer = ko.pureComputed(function () {
                return !_this.searchTerms().length && !manager.selectedFilters().length && !!manager.container();
            });
            this.searchTerms = ko.pureComputed(function () {
                // NOTE: we _could_ tokenize the search terms via a service call here
                var text = manager.previousSearchText() || "";
                var maxLength = 25;
                if (text.length > maxLength) {
                    text = text.substr(0, maxLength - 3) + "...";
                }
                var tokens = [text];
                return tokens.filter(function (t) { return !!$.trim(t); }).sort();
            });
            this.removeSearchTerm = function (term) {
                logger.logInfo("removing search term", { term: term });
                manager.searchText("");
                manager.searchResult() && (manager.searchResult().query.searchTerms = "");
                if (!!manager.selectedFilters().length) {
                    manager.doSearch({ resetPage: true });
                }
                else {
                    manager.doSearch({ resetPage: true }).then(function () {
                        manager.searchResult(null);
                    });
                }
            };
            this.groupedFilterItems = ko.pureComputed(function () {
                var groupHash = {};
                manager.selectedFilters().forEach(function (f) {
                    if (!groupHash[f.groupType]) {
                        groupHash[f.groupType] = [];
                    }
                    groupHash[f.groupType].push(f.term);
                });
                var groups = [];
                Object.keys(groupHash).forEach(function (k) {
                    groups.push({
                        key: k,
                        value: groupHash[k]
                    });
                });
                return groups;
            });
            this.filterText = ko.pureComputed(function () {
                if (manager.container()) {
                    return utils.stringFormat("{0} {1}", resx.search, manager.container().getContainerName());
                }
                else {
                    return resx.currentSearch;
                }
            });
            this.appliedSearchHasChanges = ko.pureComputed(function () {
                var appliedSearch = manager.appliedSearch();
                var searchText = manager.searchText();
                var selectedFilters = manager.selectedFilters();
                var sortKey = manager.sortField().value;
                var container = manager.container();
                return appliedSearch && (appliedSearch.searchTerms !== searchText ||
                    appliedSearch.sortKey !== sortKey ||
                    (appliedSearch.containerId || "") !== ((container || {}).__id || "") ||
                    appliedSearch.facetFilters.length !== selectedFilters.length ||
                    utils.arrayIntersect(appliedSearch.facetFilters, selectedFilters, function (a, b) { return a.groupType === b.groupType && a.term === b.term; }).length !== appliedSearch.facetFilters.length);
            });
            var outer = $(".browse-filter");
            var scrollContents = $(".body-content-outer-wrapper");
            // We want the current filters to push down the filter checkboxes and the filter
            // checkboxes to scroll when overflowed. Old browsers have difficulty with this
            // so we need to help out with some JS 'hackery'. :(
            // Detect old browsers
            var interval;
            if (scrollContents.height() >= outer.height()) {
                var inner = $(".body-scroll-container");
                var header = $(".browse-filter .table-row.header");
                // Set up an interval to keep these in sync
                interval = setInterval(function () {
                    var outerHeight = outer.height();
                    var headerHeight = header.height();
                    inner.height((outerHeight - headerHeight) + "px");
                }, 250);
            }
            var onAppliedSearchChanged = function (newValue) {
                if (newValue) {
                    _this.searchDefinition(newValue.name);
                }
            };
            onAppliedSearchChanged(this.appliedSearch());
            var appliedSearchSubscription = this.appliedSearch.subscribe(onAppliedSearchChanged);
            this.dispose = function () {
                clearInterval(interval);
                appliedSearchSubscription.dispose();
            };
        }
        viewModel.prototype.addAdditionalSearchTerm = function () {
            var newSearchTerms = manager.searchText() + " " + this.additionalSearchTerm();
            manager.searchText(newSearchTerms);
            manager.doSearch({ resetPage: true });
        };
        viewModel.prototype.removeFilter = function (groupType, term) {
            logger.logInfo("remove filter", { groupType: groupType, term: term });
            manager.selectedFilters.remove(function (fi) { return fi.groupType === groupType && fi.term === term; });
            if (this.hasCurrentFilter()) {
                manager.doSearch({ resetPage: true });
            }
            else {
                manager.doSearch({ resetPage: true }).then(function () {
                    manager.searchResult(null);
                });
            }
        };
        viewModel.prototype.clearAll = function () {
            if (!this.isDefiningSearch()) {
                logger.logInfo("clear all clicked");
                manager.doSearch({ resetFilters: true, resetSearchText: true, resetPage: true }).then(function () {
                    manager.searchResult(null);
                });
            }
        };
        viewModel.prototype.onSearchDefinitionKeyUp = function (data, event) {
            if (event && event.keyCode === constants.KeyCodes.ENTER) {
                logger.logInfo("Enter key pressed for saved search name");
                this.saveSearch();
            }
            return true;
        };
        viewModel.prototype.saveSearch = function () {
            var _this = this;
            if (this.searchDefinition().length > 0) {
                logger.logInfo("save search");
                this.isSavingSearch(true);
                var savedSearch = new SavedSearch(this.searchDefinition());
                userProfileService.getSavedSearches()
                    .done(function (currentSearches) {
                    if (manager.appliedSearch() && manager.appliedSearch().name === _this.searchDefinition()) {
                        // Update
                        var previousSearch = utils.arrayRemove(currentSearches.searches, function (s) { return s.id === manager.appliedSearch().id; });
                        savedSearch.createdDate = previousSearch.createdDate;
                    }
                    else {
                        // Check for name conflicts
                        var noConflicts = false;
                        var nameToCheck = savedSearch.name;
                        var count = 1;
                        while (!noConflicts) {
                            nameToCheck = savedSearch.name;
                            if (count > 1) {
                                nameToCheck = nameToCheck + " (" + count + ")";
                            }
                            noConflicts = currentSearches.searches.filter(function (s) { return s.name === nameToCheck; }).length === 0;
                            count++;
                        }
                        savedSearch.name = nameToCheck;
                    }
                    currentSearches.searches.unshift(savedSearch);
                    userProfileService.setSavedSearches(currentSearches)
                        .done(function () {
                        manager.appliedSearch(savedSearch);
                        var savedSearchesViewModel = _this._getSavedSearchesViewModel();
                        savedSearchesViewModel.refresh();
                        _this.isDefiningSearch(false);
                        _this.isSavingSearch(false);
                    });
                });
            }
        };
        viewModel.prototype._getSavedSearchesViewModel = function () {
            return ko.dataFor($("#browse-filter-browse-savedsearches > *:first")[0]);
        };
        viewModel.isExpanded = ko.observable(true);
        viewModel.isFilterExpanded = ko.observable(true);
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=filter.js.map