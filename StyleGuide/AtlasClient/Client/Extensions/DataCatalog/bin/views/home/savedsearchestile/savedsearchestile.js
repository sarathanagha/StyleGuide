// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./savedsearchestile.html", "css!./savedsearchestile.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
    var homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
    var LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./savedsearchestile.html");
    var viewModel = (function () {
        function viewModel(params) {
            var _this = this;
            this.resx = resx;
            this.logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            this.searches = ko.observableArray([]);
            this.max = ko.observable(0);
            this.title = ko.observable("");
            this.titlePopover = ko.observable("");
            this.emptyMessage = ko.observable("");
            this.seeAll = ko.observable("");
            this.listID = ko.observable("");
            this.allSearches = [];
            this._collapseTimer = 0;
            this.onSeeMore = function (d, e) {
                _this.searches(_this.allSearches);
                var scroll = $(".pinnable-item").height() * 5; // Scroll the list so the next few items are visible
                $("#" + _this.listID()).animate({ scrollTop: scroll }, 250);
            };
            this.onMouseLeaveTile = function (d, e) {
                clearTimeout(_this._collapseTimer);
                _this._collapseTimer = setTimeout(_this.collapseList.bind(_this), 1000);
            };
            this.onMouseEnterTile = function (d, e) {
                clearTimeout(_this._collapseTimer);
            };
            this.max(params.max);
            this.title(params.title);
            this.titlePopover(params.popover);
            this.emptyMessage(params.emptyMessage);
            this.listID(utilities.createID());
            userProfileService.getSavedSearches()
                .done(function (result) {
                var sorter = function (a, b) {
                    var favorDefault = function (a, b) {
                        if (a.isDefault === b.isDefault) {
                            return 0;
                        }
                        if (a.isDefault) {
                            return -1;
                        }
                        if (b.isDefault) {
                            return 1;
                        }
                        return 0;
                    };
                    var newestFirst = function (a, b) {
                        return new Date(b.lastUsedDate).getTime() - new Date(a.lastUsedDate).getTime();
                    };
                    return favorDefault(a, b) || newestFirst(a, b);
                };
                var sorted = result.searches.sort(sorter);
                var bindableSearches = sorted.map(function (s) { return utilities.asBindable(s); });
                _this.allSearches = bindableSearches;
                _this.searches(bindableSearches.slice(0, 5));
                _this.seeAll(utilities.stringFormat(resx.seeAllCountFormat, _this.allSearches.length));
            });
            homeManager.myAssetsLabel(resx.myAssets);
        }
        viewModel.prototype.applySearch = function (bindableSearch) {
            bindableSearch.lastUsedDate(new Date().toISOString());
            homeManager.isSearching(true);
            this.logger.logInfo("Applied saved search from home page.", { search: bindableSearch.name });
            this.updateSearches()
                .done(function () {
                var savedSearch = ko.toJS(bindableSearch);
                browseManager.applySavedSearch(savedSearch).done(function () {
                    homeManager.isSearching(false);
                    window.location.hash = "/browse";
                });
            });
        };
        viewModel.prototype.updateSearches = function () {
            var _this = this;
            var deferred = $.Deferred();
            userProfileService.getSavedSearches()
                .done(function (savedSearches) {
                savedSearches.searches = _this.allSearches.map(function (s) { return ko.toJS(s); });
                userProfileService.setSavedSearches(savedSearches)
                    .always(function () {
                    deferred.resolve();
                });
            });
            return deferred.promise();
        };
        viewModel.prototype.collapseList = function () {
            clearTimeout(this._collapseTimer);
            if (this.searches().length > this.max()) {
                this.searches(this.allSearches.slice(0, 5));
            }
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=savedsearchestile.js.map