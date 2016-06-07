// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./filter.html" />
/// <amd-dependency path="css!./filter.css" />

import ko = require("knockout");
import manager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import SavedSearch = Microsoft.DataStudio.DataCatalog.Models.SavedSearch;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;
import utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./filter.html");

export class viewModel {
    private dispose: () => void;
    appliedSearch = manager.appliedSearch;
    filterTypes = manager.filterTypes;
    selectedFilters = manager.selectedFilters;
    previousSearchText = manager.previousSearchText;
    container = manager.container;
    resx = resx;
    static isExpanded = ko.observable<boolean>(true);
    static isFilterExpanded = ko.observable<boolean>(true);
    isExpanded = viewModel.isExpanded;
    isFilterExpanded = viewModel.isFilterExpanded;
    isDefiningSearch = ko.observable<boolean>(false);
    isSavingSearch = ko.observable<boolean>(false);
    searchDefinition = ko.observable<string>("");

    additionalSearchTerm = ko.observable<string>();
    showClearButton = ko.pureComputed(() => {
        return !!$.trim(this.additionalSearchTerm());
    });

    addAdditionalSearchTerm() {
        var newSearchTerms = manager.searchText() + " " + this.additionalSearchTerm();
        manager.searchText(newSearchTerms);
        manager.doSearch({ resetPage: true });
    }

    constructor(parameters: any) {
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
            interval = setInterval(() => {
                var outerHeight = outer.height();
                var headerHeight = header.height();
                inner.height((outerHeight - headerHeight) + "px");
            }, 250);
        }

        var onAppliedSearchChanged = (newValue: Interfaces.ISavedSearch) => {
            if (newValue) {
                this.searchDefinition(newValue.name);
            }
        };

        onAppliedSearchChanged(this.appliedSearch());
        var appliedSearchSubscription = this.appliedSearch.subscribe(onAppliedSearchChanged);

        this.dispose = () => {
            clearInterval(interval);
            appliedSearchSubscription.dispose();
        };
    }

    onFilterChanged = (data: Interfaces.IFilterItem, event) => {
        logger.logInfo("filter changed");
        var groupToPreserve = null;
        if (event.target.checked) {
            // Only preserve the group when selected (not de-selected).
            groupToPreserve = data.groupType;
        }
        if (!this.hasCurrentFilter()) {
            manager.doSearch({ resetPage: true, maxFacetTerms: 100, resetStart: true });
        }
        else {
            manager.doSearch({ resetPage: true, preserveGroup: groupToPreserve });
        }
    }

    hasCurrentFilter = ko.pureComputed<boolean>(() => {
        return !!this.searchTerms().length || !!manager.selectedFilters().length || !!manager.container();
    });

    onlyFilterIsContainer = ko.pureComputed<boolean>(() => {
        return !this.searchTerms().length && !manager.selectedFilters().length && !!manager.container();
    });

    searchTerms = ko.pureComputed<string[]>(() => {
        // NOTE: we _could_ tokenize the search terms via a service call here
        var text = manager.previousSearchText() || "";
        var maxLength = 25;
        if (text.length > maxLength) {
            text = text.substr(0, maxLength-3) + "...";
        }
        var tokens = [text];
        return tokens.filter(t => !!$.trim(t)).sort();
    });

    removeSearchTerm = (term) => {
        logger.logInfo("removing search term", { term: term });

        manager.searchText("");
        manager.searchResult() && (manager.searchResult().query.searchTerms = "");
        if (!!manager.selectedFilters().length) {
            manager.doSearch({ resetPage: true });
        }
        else {
            manager.doSearch({ resetPage: true }).then(() => {
                manager.searchResult(null);
            });

        }
    }

    groupedFilterItems = ko.pureComputed(() => {
        var groupHash = {};
        manager.selectedFilters().forEach(f => {
            if (!groupHash[f.groupType]) {
                groupHash[f.groupType] = [];
            }
            groupHash[f.groupType].push(f.term);
        });

        var groups = [];
        Object.keys(groupHash).forEach(k => {
            groups.push({
                key: k,
                value: groupHash[k]
            });
        });
        return groups;
    });

    removeFilter(groupType, term) {
        logger.logInfo("remove filter", { groupType: groupType, term: term });

        manager.selectedFilters.remove(fi => fi.groupType === groupType && fi.term === term);
        if (this.hasCurrentFilter()) {
            manager.doSearch({ resetPage: true });
        }
        else {
            manager.doSearch({ resetPage: true }).then(() => {
                manager.searchResult(null);
            });
        }
    }

    clearAll() {
        if (!this.isDefiningSearch()) {
            logger.logInfo("clear all clicked");

            manager.doSearch({ resetFilters: true, resetSearchText: true, resetPage: true }).then(() => {
                manager.searchResult(null);
            });
        }
    }

    onSearchDefinitionKeyUp(data: viewModel, event: JQueryEventObject) {
        if (event && event.keyCode === constants.KeyCodes.ENTER) {
            logger.logInfo("Enter key pressed for saved search name");
            this.saveSearch();
        } 
        return true;
    }

    saveSearch() {
        if (this.searchDefinition().length > 0) {
            logger.logInfo("save search");
            this.isSavingSearch(true);

            var savedSearch = new SavedSearch(this.searchDefinition());
            
            userProfileService.getSavedSearches()
                .done(currentSearches => {
                    
                    if (manager.appliedSearch() && manager.appliedSearch().name === this.searchDefinition()) {
                        // Update
                        var previousSearch = utils.arrayRemove(currentSearches.searches, s => s.id === manager.appliedSearch().id);
                        savedSearch.createdDate = previousSearch.createdDate;
                    } else {
                        // Check for name conflicts
                        var noConflicts = false;
                        var nameToCheck = savedSearch.name;
                        var count = 1;
                        while (!noConflicts) {
                            nameToCheck = savedSearch.name;
                            if (count > 1) {
                                nameToCheck = nameToCheck + " (" + count + ")";
                            }
                            noConflicts = currentSearches.searches.filter(s => s.name === nameToCheck).length === 0;
                            count++;
                        }
                        savedSearch.name = nameToCheck;
                    }

                    currentSearches.searches.unshift(savedSearch);

                    userProfileService.setSavedSearches(currentSearches)
                        .done(() => {
                            manager.appliedSearch(savedSearch);
                            var savedSearchesViewModel = this._getSavedSearchesViewModel();
                            savedSearchesViewModel.refresh();
                            this.isDefiningSearch(false);
                            this.isSavingSearch(false);
                        });

                });
        }
    }

    private _getSavedSearchesViewModel(): Interfaces.IBrowseSavedSearch  {
        return <Interfaces.IBrowseSavedSearch>ko.dataFor($("#browse-filter-browse-savedsearches > *:first")[0]);
    }

    filterText = ko.pureComputed(() => {
        if (manager.container()) {
            return utils.stringFormat("{0} {1}", resx.search, manager.container().getContainerName());
        } else {
            return resx.currentSearch;
        }
    });

    appliedSearchHasChanges = ko.pureComputed(() => {
        var appliedSearch = manager.appliedSearch();

        var searchText = manager.searchText();
        var selectedFilters = manager.selectedFilters();
        var sortKey = manager.sortField().value;
        var container = manager.container();

        return appliedSearch && (
               appliedSearch.searchTerms !== searchText ||
               appliedSearch.sortKey !== sortKey ||
               (appliedSearch.containerId || "") !== ((container || <any>{}).__id || "") ||
               appliedSearch.facetFilters.length !== selectedFilters.length ||
               utils.arrayIntersect(appliedSearch.facetFilters, selectedFilters, (a, b) => a.groupType === b.groupType && a.term === b.term).length !== appliedSearch.facetFilters.length);
    });
} 