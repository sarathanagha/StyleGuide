// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./home.html", "css!./home.css"], function (require, exports, ko) {
    var LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var manager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var searchService = Microsoft.DataStudio.DataCatalog.Services.SearchService;
    var userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
    var userService = Microsoft.DataStudio.DataCatalog.Services.UserService;
    var homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./home.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.searchTerm = manager.searchText;
            this.resx = resx;
            this.logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            this.pins = ko.observableArray([]);
            this.recent = ko.observableArray([]);
            this.isSearching = homeManager.isSearching;
            // Number of items to show for each tile.
            this.tileMax = 5;
            // Observables for stats tiles
            this.totalAssets = ko.observable(NaN);
            this.annotatedAssets = ko.observable(NaN);
            this.totalUsers = ko.observable(NaN);
            this.contributedUsers = ko.observable(NaN);
            this.contributedUsersAnnotation = ko.observable(null);
            this.assetStats = ko.observableArray(null);
            this.userStats = ko.observableArray(null);
            this.pinnedEmptyTileMessage = util.stringFormat(resx.addPins, "<img src='node_modules/@ms-atlas-module/datastudio-datacatalog/images/home/pin_off.svg' width='16' height='16' style='margin: 0px 3px;' />");
            // Determine what parts should be shown
            this.showMessage = ko.observable(false);
            this.showMyAssets = ko.observable(false || true);
            this.showStats = ko.observable(false || true);
            this.showFacets = ko.observable(false || true);
            this.myAssetsLabel = homeManager.myAssetsLabel;
            this.statsLabel = homeManager.statsLabel;
            this.minAssets = 20;
            this.syncPinned = function () {
                userProfileService.getPins().done(function (pins) {
                    var pinList = _this.pins();
                    pinList.forEach(function (p) {
                        p.pinned(pins.pins.some(function (s) { return s.assetId === p.id; }));
                    });
                    pins.pins.forEach(function (p) {
                        if (!pinList.some(function (s) { return s.id === p.assetId; })) {
                            var newPin = {
                                label: p.name,
                                pinned: ko.observable(true),
                                id: p.assetId
                            };
                            pinList.unshift(newPin);
                        }
                    });
                    _this.pins(pinList);
                });
            };
            this.syncRecent = function () {
                userProfileService.getPins().done(function (pins) {
                    var recentList = _this.recent();
                    recentList.forEach(function (r) {
                        r.pinned(pins.pins.some(function (s) { return s.assetId === r.id; }));
                    });
                });
            };
            this.publishMessage = ko.pureComputed(function () {
                return resx.publishDataMessage;
            });
            this.tags = ko.pureComputed(function () {
                var tags = [];
                if (manager.filterTypes() && manager.filterTypes().groups && manager.filterTypes().groups.length) {
                    var group = manager.filterTypes().groups.filter(function (g) { return g.groupType === "tags"; })[0];
                    if (group && group.items && group.items.length) {
                        group.items.forEach(function (i) {
                            tags.push({ term: i.term });
                        });
                        if (tags.length > 4) {
                            tags = tags.slice(0, 4);
                        }
                    }
                }
                return tags;
            });
            // Start with '<br />' to maintain line spacing while the tiles are rendering.
            // This is to prevent the labels from showing before the tiles render.
            this.myAssetsLabel("<br />");
            this.statsLabel("<br />");
            this.logger.logInfo("viewing the home page");
            var promises = [
                searchService.getNumberOfItems(),
                userProfileService.getRecentItems(),
                userProfileService.getPins()
            ];
            searchService.allSettled(promises).done(function (returned) {
                if (returned.length === 3) {
                    _this.totalAssets(returned[0].value);
                    var recent = returned[1].value;
                    var pins = returned[2].value;
                    // Set up recent items list.
                    var recentItems = [];
                    recent.items.forEach(function (i) {
                        var pinned = pins.pins.some(function (s) { return s.assetId === i.assetId; });
                        recentItems.push({
                            id: i.assetId,
                            label: i.name,
                            pinned: ko.observable(pinned)
                        });
                    });
                    _this.recent(recentItems);
                    // Set up pinned list
                    var pinnedItems = [];
                    pins.pins.forEach(function (p) {
                        pinnedItems.push({
                            id: p.assetId,
                            label: p.name,
                            pinned: ko.observable(true)
                        });
                    });
                    _this.pins(pinnedItems);
                    // Determine which parts of the home page to show.
                    //this.showMessage(this.totalAssets() < this.minAssets || recentItems.length === 0);
                    _this.showMessage(true);
                    // this.showMyAssets(recentItems.length > 0);
                    _this.showMyAssets(true);
                    //this.showStats(this.totalAssets() >= this.minAssets);
                    _this.showStats(true);
                    //this.showFacets(this.totalAssets() >= this.minAssets);
                    _this.showFacets(true);
                }
                else {
                    _this.showMessage(true);
                }
            }).fail(function () {
                _this.showMessage(true);
            });
            searchService.getNumberOfAnnotatedItems().done(function (count) {
                _this.annotatedAssets(count);
            });
            searchService.getNumberOfPublishers().done(function (count) {
                var users = count;
                if (users > 100) {
                    users = 100;
                    _this.contributedUsersAnnotation("+");
                }
                _this.contributedUsers(users);
            });
            this.assetStats([
                { label: resx.assetsLabel, value: this.totalAssets, popup: resx.assetHoverText },
                { label: resx.annotatedAssetsLabel, value: this.annotatedAssets, popup: resx.annotatedAssetHoverText }
            ]);
            this.userStats([
                { label: resx.usersLabel, value: this.totalUsers, popup: resx.totalUsersHoverText },
                { label: resx.contributedUsersLabel, value: this.contributedUsers, popup: resx.publishersHoverText, annotate: this.contributedUsersAnnotation }
            ]);
            userService.getTotalUsers().done(function (count) {
                _this.totalUsers(count.value);
            });
        }
        viewModel.prototype.redirectToBrowsePage = function () {
            this.redirectToUrl("#/browse?searchTerms=" + this.searchTerm());
        };
        viewModel.prototype.doSearch = function () {
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
        };
        viewModel.prototype.onSearchKeyDown = function (date, event) {
            if (event.keyCode === 13) {
                this.logger.logInfo("Enter key pressed for search");
                this.doSearch();
            }
            return true;
        };
        viewModel.prototype.redirectToUrl = function (hash) {
            this.logger.logInfo("changing url from home to " + hash);
            window.location.hash = hash;
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=home.js.map