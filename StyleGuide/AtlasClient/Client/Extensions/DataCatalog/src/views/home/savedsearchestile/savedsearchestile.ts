// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./savedsearchestile.html" />
/// <amd-dependency path="css!./savedsearchestile.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
import LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./savedsearchestile.html");

export class viewModel {
    resx = resx;
    logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });

    searches = ko.observableArray<Interfaces.IBindableSavedSearch>([]);
    max = ko.observable<number>(0);
    title = ko.observable<string>("");
    titlePopover = ko.observable<string>("");
    emptyMessage = ko.observable<string>("");
    seeAll = ko.observable<string>("");
    listID = ko.observable<string>("");
    private allSearches: Interfaces.IBindableSavedSearch[] = [];

    private _collapseTimer = 0;

    constructor(params: Interfaces.IHomeListTile) {
        this.max(params.max);
        this.title(params.title);
        this.titlePopover(params.popover);
        this.emptyMessage(params.emptyMessage);
        this.listID(utilities.createID());
        userProfileService.getSavedSearches()
            .done(result => {
                var sorter = (a: Interfaces.ISavedSearch, b: Interfaces.ISavedSearch) => {
                    var favorDefault = (a: Interfaces.ISavedSearch, b: Interfaces.ISavedSearch) => {
                        if (a.isDefault === b.isDefault) { return 0; }
                        if (a.isDefault) { return -1; }
                        if (b.isDefault) { return 1; }
                        return 0;
                    };

                    var newestFirst = (a: Interfaces.ISavedSearch, b: Interfaces.ISavedSearch) => {
                        return new Date(b.lastUsedDate).getTime() - new Date(a.lastUsedDate).getTime();
                    };

                    return favorDefault(a, b) || newestFirst(a, b);
                };

                var sorted = result.searches.sort(sorter);
                var bindableSearches = sorted.map(s => utilities.asBindable<Interfaces.IBindableSavedSearch>(s));
                this.allSearches = bindableSearches;
                this.searches(bindableSearches.slice(0, 5));
                this.seeAll(utilities.stringFormat(resx.seeAllCountFormat, this.allSearches.length));
            });

        homeManager.myAssetsLabel(resx.myAssets);
    }

    applySearch(bindableSearch: Interfaces.IBindableSavedSearch) {
        bindableSearch.lastUsedDate(new Date().toISOString());
        homeManager.isSearching(true);
        this.logger.logInfo("Applied saved search from home page.", { search: bindableSearch.name });
        this.updateSearches()
            .done(() => {
                var savedSearch = <Interfaces.ISavedSearch>ko.toJS(bindableSearch);
                browseManager.applySavedSearch(savedSearch).done(() => {
                    homeManager.isSearching(false);
                    window.location.hash = "/browse";
                });
            });
    }

    private updateSearches(): JQueryPromise<any> {
        var deferred = $.Deferred();

        userProfileService.getSavedSearches()
            .done(savedSearches => {
                savedSearches.searches = this.allSearches.map(s => <Interfaces.ISavedSearch>ko.toJS(s));
                userProfileService.setSavedSearches(savedSearches)
                    .always(() => {
                        deferred.resolve();
                    });
            });

        return deferred.promise();
    }

    onSeeMore = (d, e) => {
        this.searches(this.allSearches);
        var scroll = $(".pinnable-item").height() * 5; // Scroll the list so the next few items are visible
        $("#" + this.listID()).animate({ scrollTop: scroll }, 250);
    }

    onMouseLeaveTile = (d, e) => {
        clearTimeout(this._collapseTimer);

        this._collapseTimer = setTimeout(this.collapseList.bind(this), 1000);
    }

    onMouseEnterTile = (d: viewModel, e: Event) => {
        clearTimeout(this._collapseTimer);
    }

    private collapseList() {
        clearTimeout(this._collapseTimer);
        if (this.searches().length > this.max()) {
            this.searches(this.allSearches.slice(0, 5));
        }
    }

}