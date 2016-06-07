// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./home.html" />
/// <amd-dependency path="css!./home.css" />

import ko = require("knockout");
import LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import manager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import searchService = Microsoft.DataStudio.DataCatalog.Services.SearchService;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import userService = Microsoft.DataStudio.DataCatalog.Services.UserService;
import homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./home.html");

export class viewModel {
    searchTerm = manager.searchText;
    resx = resx;

    logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });

    pins = ko.observableArray<Interfaces.IPinnableListItem>([]);
    recent = ko.observableArray<Interfaces.IPinnableListItem>([]);

    isSearching = homeManager.isSearching;

    // Number of items to show for each tile.
    tileMax: number = 5;

    // Observables for stats tiles
    totalAssets = ko.observable<number>(NaN);
    annotatedAssets = ko.observable<number>(NaN);
    totalUsers = ko.observable<number>(NaN);
    contributedUsers = ko.observable<number>(NaN);
    contributedUsersAnnotation = ko.observable<string>(null);

    assetStats = ko.observableArray<Interfaces.IHomeStatsListItem>(null);
    userStats = ko.observableArray<Interfaces.IHomeStatsListItem>(null);

    pinnedEmptyTileMessage = util.stringFormat(resx.addPins, "<img src='node_modules/@ms-atlas-module/datastudio-datacatalog/images/home/pin_off.svg' width='16' height='16' style='margin: 0px 3px;' />");

    // Determine what parts should be shown
    showMessage = ko.observable<boolean>(false);
    showMyAssets = ko.observable<boolean>(false || true);
    showStats = ko.observable<boolean>(false || true);
    showFacets = ko.observable<boolean>(false || true);

    myAssetsLabel = homeManager.myAssetsLabel;
    statsLabel = homeManager.statsLabel;
    private minAssets = 20;

    constructor(parameters: any) {
        // Start with '<br />' to maintain line spacing while the tiles are rendering.
        // This is to prevent the labels from showing before the tiles render.
        this.myAssetsLabel("<br />");
        this.statsLabel("<br />");
        this.logger.logInfo("viewing the home page");
        var promises = [
            <JQueryPromise<any>>searchService.getNumberOfItems(),
            <JQueryPromise<Interfaces.IRecentItems>>userProfileService.getRecentItems(),
            <JQueryPromise<Interfaces.IPins>>userProfileService.getPins()
        ];
        searchService.allSettled(promises).done(returned => {
            if (returned.length === 3) {
                this.totalAssets(returned[0].value);
                var recent = <Interfaces.IRecentItems>returned[1].value;
                var pins = <Interfaces.IPins>returned[2].value;

                // Set up recent items list.
                var recentItems: Interfaces.IPinnableListItem[] = [];
                recent.items.forEach(i => {
                    var pinned = pins.pins.some(s => s.assetId === i.assetId);
                    recentItems.push({
                        id: i.assetId,
                        label: i.name,
                        pinned: ko.observable<boolean>(pinned)
                    });
                });
                this.recent(recentItems);

                // Set up pinned list
                var pinnedItems: Interfaces.IPinnableListItem[] = [];
                pins.pins.forEach(p => {
                    pinnedItems.push({
                        id: p.assetId,
                        label: p.name,
                        pinned: ko.observable<boolean>(true)
                    });
                });
                this.pins(pinnedItems);

                // Determine which parts of the home page to show.
                //this.showMessage(this.totalAssets() < this.minAssets || recentItems.length === 0);
                this.showMessage(true);
                // this.showMyAssets(recentItems.length > 0);
                this.showMyAssets(true);
                //this.showStats(this.totalAssets() >= this.minAssets);
                this.showStats(true);                
                //this.showFacets(this.totalAssets() >= this.minAssets);
                this.showFacets(true);
            }
            else {
                this.showMessage(true);
            }
        }).fail(() => {
            this.showMessage(true);
        });

        searchService.getNumberOfAnnotatedItems().done(count => {
            this.annotatedAssets(<number>count);
        });

        searchService.getNumberOfPublishers().done(count => {
                var users = count;
                if (users > 100) {
                    users = 100;
                    this.contributedUsersAnnotation("+");
                }
                this.contributedUsers(users);
        });
        
        this.assetStats([
                { label: resx.assetsLabel, value: this.totalAssets, popup: resx.assetHoverText },
                { label: resx.annotatedAssetsLabel, value: this.annotatedAssets, popup: resx.annotatedAssetHoverText }
            ]);

        this.userStats([
                { label: resx.usersLabel, value: this.totalUsers, popup: resx.totalUsersHoverText },
                { label: resx.contributedUsersLabel, value: this.contributedUsers, popup: resx.publishersHoverText, annotate: this.contributedUsersAnnotation }
        ]);

        userService.getTotalUsers().done((count: any) => {
            this.totalUsers(count.value);
        });
    }

    syncPinned = () => {
        userProfileService.getPins().done(pins => {
            var pinList = this.pins();
            pinList.forEach(p => {
                p.pinned(pins.pins.some(s => s.assetId === p.id));
            });
            pins.pins.forEach(p => {
                if (!pinList.some(s => s.id === p.assetId)) {
                    var newPin: Interfaces.IPinnableListItem = {
                        label: p.name,
                        pinned: ko.observable<boolean>(true),
                        id: p.assetId
                    };
                    pinList.unshift(newPin);
                }
            });
            this.pins(pinList);
        });
    }

    syncRecent = () => {
        userProfileService.getPins().done(pins => {
            var recentList = this.recent();
            recentList.forEach(r => {
                r.pinned(pins.pins.some(s => s.assetId === r.id));
            });
        });
    }

    redirectToBrowsePage() {
        this.redirectToUrl("#/browse?searchTerms=" + this.searchTerm());
    }

    doSearch() {
        this.redirectToUrl("?datacatalog/browse?searchTerms=" + this.searchTerm());
        //var searchAndNavigate =() => {
        //    manager.doSearch({ resetPage: true });
        //    this.redirectToBrowsePage();
        //};

        //// See if there is a default search
        //userProfileService.getSavedSearches()
        //    .done(savedSearches => {
        //        var defaultSearch = util.arrayFirst(savedSearches.searches.filter(s => s.isDefault));
        //        if (defaultSearch && !this.searchTerm()) {
        //            manager.applySavedSearch(defaultSearch);
        //            this.redirectToUrl("datacatalog/browse?searchTerms=" + defaultSearch.searchTerms);
        //        } else {
        //            searchAndNavigate();
        //        }
        //    })
        //    .fail(searchAndNavigate);
    }

    onSearchKeyDown(date, event) {
        if (event.keyCode === 13) {
            this.logger.logInfo("Enter key pressed for search");
            this.doSearch();
        }
        return true;
    }

    redirectToUrl(hash: string) {
        this.logger.logInfo("changing url from home to " + hash);
        window.location.hash = hash;
    }

    publishMessage = ko.pureComputed<string>(() => {
        return resx.publishDataMessage;
    });

    tags = ko.pureComputed<Array<Interfaces.IHomeAttributeListItem>>(() => {
        var tags: Array<Interfaces.IHomeAttributeListItem> = [];
        if (manager.filterTypes() && manager.filterTypes().groups && manager.filterTypes().groups.length) {
            var group = manager.filterTypes().groups.filter(g => g.groupType === "tags")[0];
            if (group && group.items && group.items.length) {
                group.items.forEach((i) => {
                    tags.push({ term: i.term });
                });
                if (tags.length > 4) {
                    tags = tags.slice(0, 4);
                }
            }
        }
        return tags;
    });


}