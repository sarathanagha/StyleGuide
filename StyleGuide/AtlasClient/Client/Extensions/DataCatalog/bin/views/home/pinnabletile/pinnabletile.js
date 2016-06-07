// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./pinnabletile.html", "css!./pinnabletile.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var searchService = Microsoft.DataStudio.DataCatalog.Services.SearchService;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var BindableResult = Microsoft.DataStudio.DataCatalog.Models.BindableResult;
    var BindableDataEntity = Microsoft.DataStudio.DataCatalog.Models.BindableDataEntity;
    var detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
    var layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
    var userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
    var BindablePinnableListItem = Microsoft.DataStudio.DataCatalog.Models.BindablePinnableListItem;
    var LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
    var utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./pinnabletile.html");
    var viewModel = (function () {
        function viewModel(params) {
            var _this = this;
            this.resx = resx;
            this.logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            this.title = ko.observable("");
            this.titlePopover = ko.observable("");
            this.items = ko.observableArray([]);
            this.baseItems = ko.observableArray([]);
            this.emptyMessage = ko.observable("");
            this.max = ko.observable(0);
            this.seeAll = ko.observable("");
            this.listID = ko.observable("");
            this._collapseTimer = 0;
            this.pinnableItems = ko.observableArray([]);
            this.onSelect = function (d, e) {
                var id = d.id;
                homeManager.isSearching(true);
                _this.logger.logInfo("Asset selected from home page.", { assetId: id });
                userProfileService.getPins().done(function (pins) {
                    var current = pins.pins.filter(function (p) { return p.assetId === id; });
                    if (current.length) {
                        current[0].lastUsedDate = new Date().toISOString();
                        var updated = pins.pins.filter(function (p) { return p.assetId !== id; });
                        updated.unshift(current[0]);
                        pins.pins = updated;
                        userProfileService.setPins(pins);
                    }
                });
                browseManager.searchText(utils.stringFormat("__id={0}", id));
                browseManager.doSearch({
                    captureSearchTerm: false
                }).done(function (result) {
                    var bindableResult = new BindableResult(result);
                    browseManager.searchResult(bindableResult);
                    var entities = (result.results.length) ? [new BindableDataEntity(result.results[0])] : [];
                    var entity = entities[0];
                    browseManager.multiSelected(entities);
                    browseManager.firstRun = false;
                    if (layoutManager.centerComponent() === "datacatalog-browse-start") {
                        layoutManager.centerComponent("datacatalog-browse-tiles");
                    }
                    layoutManager.bottomExpanded(true);
                    layoutManager.rightExpanded(true);
                    if (entity && entity.hasPreviewData()) {
                        detailsManager.showPreview();
                    }
                    else if (entity && entity.hasSchema()) {
                        detailsManager.showSchema();
                    }
                    else if (entity && entity.hasDataProfile()) {
                        detailsManager.showDataProfile();
                    }
                    else {
                        detailsManager.showDocs();
                    }
                    homeManager.isSearching(false);
                    window.location.hash = "/browse";
                });
            };
            this.onUnpin = function (d, e) {
                d.pinned(false);
                _this.logger.logInfo("Asset unpinned from home page.", { assetId: d.id });
                userProfileService.getPins().done(function (pins) {
                    var pinned = pins.pins.filter(function (p) { return p.assetId !== d.id; });
                    pins.pins = pinned;
                    userProfileService.setPins(pins).done(function () {
                        _this.onPinToggled();
                        browseManager.updatePinned(d.id, false);
                    });
                });
            };
            this.onPin = function (d, e) {
                d.pinned(true);
                _this.logger.logInfo("Asset pinned on home page.", { assetId: d.id });
                userProfileService.getPins().done(function (pins) {
                    var created = new Date().toISOString();
                    var pin = {
                        lastUsedDate: created,
                        createdDate: created,
                        id: "",
                        assetId: d.id,
                        name: d.label
                    };
                    pins.pins.unshift(pin);
                    userProfileService.setPins(pins).done(function () {
                        _this.onPinToggled();
                        browseManager.updatePinned(d.id, true);
                    });
                });
            };
            this.onSeeMore = function (d, e) {
                _this.max(_this.baseItems().length);
                _this.buildItems();
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
            this.title(params.title);
            this.titlePopover(params.popover);
            this.max(params.max);
            this.originalMax = params.max;
            this.grayUnpinned = params.grayUnpinned;
            this.emptyMessage(params.emptyMessage);
            this.pinnableItems = params.items;
            this.idPrefix = params.idPrefix;
            this.buildFullList();
            this.buildItems();
            this.seeAll(utils.stringFormat(resx.seeAllCountFormat, this.baseItems().length));
            this.listID(this.idPrefix + "-items-list");
            if (params.onPinToggled) {
                this.onPinToggled = params.onPinToggled;
            }
            else {
                this.onPinToggled = function () { };
            }
            var subscription = this.pinnableItems.subscribe(function (newValue) {
                // Only call 'buildFullList' if the list has changed, otherwise 'friendlyName' should already be stored.
                if (_this.pinnableItems().length !== _this.baseItems().length) {
                    _this.buildFullList();
                }
                _this.buildItems();
                _this.seeAll(utils.stringFormat(resx.seeAllCountFormat, _this.baseItems().length));
            });
            this.dispose = function () {
                subscription.dispose();
            };
        }
        // Build the full list of bindable items, then retrieve the friendly names for the items.
        viewModel.prototype.buildFullList = function () {
            var _this = this;
            var items = [];
            var searchFilters = [];
            this.pinnableItems().forEach(function (value, i) {
                items.push(new BindablePinnableListItem(value));
                searchFilters.push("__id=" + value.id);
            });
            this.baseItems(items);
            if (items.length) {
                searchService.getAssets(searchFilters).done(function (results) {
                    results.results.forEach(function (i) {
                        var result = i.content;
                        if (result.descriptions && result.descriptions.length) {
                            var friendlyName = null;
                            result.descriptions.forEach(function (desc) {
                                if (desc.friendlyName && !!$.trim(desc.friendlyName)) {
                                    friendlyName = desc.friendlyName;
                                }
                            });
                            if (friendlyName) {
                                var listItem = _this.baseItems().filter(function (i) { return i.id === result.__id; });
                                var pinItem = _this.pinnableItems().filter(function (i) { return i.id === result.__id; });
                                if (listItem.length) {
                                    listItem[0].setFriendlyName(friendlyName);
                                }
                                if (pinItem.length) {
                                    pinItem[0].friendlyName = friendlyName;
                                }
                            }
                        }
                    });
                });
            }
        };
        viewModel.prototype.buildItems = function () {
            if (this.baseItems().length <= this.max() || this.max() === 0) {
                this.items(this.baseItems());
            }
            else {
                var items = this.baseItems();
                var listItems = [];
                for (var i = 0; i < this.max(); i++) {
                    listItems.push(items[i]);
                }
                this.items(listItems);
            }
        };
        viewModel.prototype.collapseList = function () {
            clearTimeout(this._collapseTimer);
            if (this.max() !== this.originalMax) {
                this.max(this.originalMax);
                this.buildItems();
            }
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=pinnabletile.js.map