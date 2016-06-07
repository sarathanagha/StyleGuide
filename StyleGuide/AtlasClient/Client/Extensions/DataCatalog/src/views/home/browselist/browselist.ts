// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./browselist.html" />
/// <amd-dependency path="css!./browselist.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;

export var template: string = require("text!./browselist.html");

export class viewModel {
    resx = resx;
    logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });

    listLimit = 5;

    constructor() {

    }

    experts = ko.pureComputed<string[]>(() => {
        var experts: string[] = [];
        if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
            var group = browseManager.filterTypes().groups.filter(g => g.groupType === "experts")[0];
            if (group && group.items && group.items.length) {
                group.items.forEach(i => {
                    experts.push(i.term);
                });
                experts = experts.slice(0, this.listLimit);
            }
        }
        return experts;
    });

    sources = ko.pureComputed<string[]>(() => {
        var sources: string[] = [];
        if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
            var group = browseManager.filterTypes().groups.filter(g => g.groupType === "sourceType")[0];
            if (group && group.items && group.items.length) {
                group.items.forEach(i => {
                    sources.push(i.term);
                });
                sources = sources.slice(0, this.listLimit);
            }
        }
        return sources;
    });

    types = ko.pureComputed<string[]>(() => {
        var types: string[] = [];
        if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
            var group = browseManager.filterTypes().groups.filter(g => g.groupType === "objectType")[0];
            if (group && group.items && group.items.length) {
                group.items.forEach(i => {
                    types.push(i.term);
                });
                types = types.slice(0, this.listLimit);
            }
        }
        return types;
    });

    selectFacet(groupType: string, data: string) {
        this.logger.logInfo("Facet search from home page.", { facet: groupType, term: data });
        homeManager.isSearching(true);
        browseManager.selectedFilters([]);
        browseManager.selectedFilters().push({
            groupType: groupType,
            term: data,
            count: 0
        });
        browseManager.doSearch({ preserveGroup: groupType, resetPage: true }).done(() => {
            homeManager.isSearching(false);
            window.location.hash = "/browse";
        });
    }
}