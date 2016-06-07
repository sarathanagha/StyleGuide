// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./attributetile.html" />
/// <amd-dependency path="css!./attributetile.css" />

import ko = require("knockout");
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./attributetile.html");

export class viewModel {

    title = ko.observable<string>("");
    attributes = ko.observableArray<Interfaces.IHomeAttributeListItem>([]);
    emptyMessage = ko.observable<string>("");

    logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });

    private groupType: string;

    constructor(params: Interfaces.IHomeAttributeList) {
        this.title(params.title);
        this.emptyMessage(params.emptyMessage);
        this.attributes = params.attributes;
        this.groupType = params.group;
    }

    onSelect = (d: Interfaces.IHomeAttributeListItem, e:Event) => {
        if (d && d.term) {
            homeManager.isSearching(true);
            this.logger.logInfo("Facet search from home page.", { facet: this.groupType, term: d.term });
            var term = d.term;
            browseManager.selectedFilters([]);
            browseManager.searchText("");
            browseManager.selectedFilters().push({
                groupType: this.groupType,
                term: term,
                count: 0
            });
            browseManager.doSearch({ preserveGroup: this.groupType, resetPage: true }).done(() => {
                homeManager.isSearching(false);
                window.location.hash = "/browse";
            });
        }
    }

}