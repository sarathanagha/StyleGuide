// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./start.html" />
/// <amd-dependency path="css!./start.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import ITreeMapItem = Microsoft.DataStudio.DataCatalog.Interfaces.ITreeMapItem;
import utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./start.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;

    searchTerm = browseManager.searchText;
    searchResults = browseManager.searchResult;
    isSearching = browseManager.isSearching;

    listLimit = 7;

    constructor(parameters: any) {

    }

    showClearButton = ko.pureComputed(() => {
        return !!$.trim(this.searchTerm());
    });

    doSearch(data?: any, event?: JQueryEventObject) {
        if (event && event.target) {
            logger.logInfo("Mangifying glass clicked for search from first start page");
        }

        var executeSearch =() => {
            browseManager.firstRun = false;
            browseManager.doSearch({ resetPage: true });
        };

        // See if there is a default search
        userProfileService.getSavedSearches()
            .done(savedSearches => {
                var defaultSearch = utils.arrayFirst(savedSearches.searches.filter(s => s.isDefault));
                if (defaultSearch && !this.searchTerm()) {
                    browseManager.firstRun = false;
                    browseManager.applySavedSearch(defaultSearch);
                } else {
                    executeSearch();
                }
            })
            .fail(executeSearch);
    }

    onSearchKeyUp(data, event) {
        if (event.keyCode === 13) {
            logger.logInfo("Enter key pressed for search from first start page");
            this.doSearch();
        }
    }

    clearSearch() {
        logger.logInfo("Search text cleared via clear button from first start page");
        this.searchTerm("");
    }

    tags = ko.pureComputed<ITreeMapItem[]>(() => {
        var items: ITreeMapItem[] = [];

        if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
            var group = browseManager.filterTypes().groups.filter(g => g.groupType === "tags")[0];
            if (group && group.items && group.items.length) {
                group.items.forEach((i) => {
                    items.push({ name: i.term, value: i.count });
                });
            }
        }
        return items;
    });

    experts = ko.pureComputed<string[]>(() => {
        var experts: string[] = [];
        if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
            var group = browseManager.filterTypes().groups.filter(g => g.groupType === "experts")[0];
            if (group && group.items && group.items.length) {
                group.items.forEach((i) => {
                    experts.push(i.term);
                });
            }
        }
        return experts;
    });

    sources = ko.pureComputed<string[]>(() => {
        var sources: string[] = [];
        if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
            var group = browseManager.filterTypes().groups.filter(g => g.groupType === "sourceType")[0];
            if (group && group.items && group.items.length) {
                group.items.forEach((i) => {
                    sources.push(this.formatLabel(i.groupType, i.term));
                });
            }
        }
        return sources;
    });

    types = ko.pureComputed<string[]>(() => {
        var types: string[] = [];
        if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
            var group = browseManager.filterTypes().groups.filter(g => g.groupType === "objectType")[0];
            if (group && group.items && group.items.length) {
                group.items.forEach((i) => {
                    types.push(this.formatLabel(i.groupType, i.term));
                });
            }
        }
        return types;
    });

    selectFacet(groupType: string, data: string) {
        browseManager.selectedFilters().push({
            groupType: groupType,
            term: data,
            count: 0
        });
        browseManager.doSearch({ preserveGroup: groupType, resetPage: true });
    }

    private formatLabel(groupType: string, term: string) {
        var primaryResxKey = (groupType + "_verbose_" + term).replace(/\s/g, "").toLowerCase();
        var secondaryResxKey = (groupType + "_" + term).replace(/\s/g, "").toLowerCase();
        var label = term;
        if (resx[primaryResxKey] || resx[secondaryResxKey]) {
            label = utils.stringCapitalize(resx[primaryResxKey] || resx[secondaryResxKey]);
        }
        return label;
    }
}