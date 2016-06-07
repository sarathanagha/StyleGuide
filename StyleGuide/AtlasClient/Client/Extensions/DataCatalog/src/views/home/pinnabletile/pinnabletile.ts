// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./pinnabletile.html" />
/// <amd-dependency path="css!./pinnabletile.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import searchService = Microsoft.DataStudio.DataCatalog.Services.SearchService;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import BindableResult = Microsoft.DataStudio.DataCatalog.Models.BindableResult;
import BindableDataEntity = Microsoft.DataStudio.DataCatalog.Models.BindableDataEntity;
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import BindablePinnableListItem = Microsoft.DataStudio.DataCatalog.Models.BindablePinnableListItem;
import LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;
import utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./pinnabletile.html");

export class viewModel {
    dispose: () => void;
    resx = resx;
    logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });

    title = ko.observable<string>("");
    titlePopover = ko.observable<string>("");
    items = ko.observableArray<BindablePinnableListItem>([]);
    baseItems = ko.observableArray<BindablePinnableListItem>([]);
    emptyMessage = ko.observable<string>("");
    max = ko.observable<number>(0);
    seeAll = ko.observable<string>("");
    listID = ko.observable<string>("");

    originalMax: number;
    grayUnpinned: boolean;
    onPinToggled: () => void;
    idPrefix: string;

    private _collapseTimer = 0;

    pinnableItems = ko.observableArray<Interfaces.IPinnableListItem>([]);

    constructor(params: Interfaces.IHomePinnableTile) {
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
            this.onPinToggled = () => { }
        }

        var subscription = this.pinnableItems.subscribe((newValue) => {
            // Only call 'buildFullList' if the list has changed, otherwise 'friendlyName' should already be stored.
            if (this.pinnableItems().length !== this.baseItems().length) {
                this.buildFullList();
            }
            this.buildItems();
            this.seeAll(utils.stringFormat(resx.seeAllCountFormat, this.baseItems().length));
        });

        this.dispose = () => {
            subscription.dispose();
        }
    }

    // Build the full list of bindable items, then retrieve the friendly names for the items.
    private buildFullList() {
        var items: BindablePinnableListItem[] = [];
        var searchFilters: string[] = [];
        this.pinnableItems().forEach((value, i) => {
            items.push(new BindablePinnableListItem(value));
            searchFilters.push(`__id=${value.id}`);
        });
        this.baseItems(items);
        if (items.length) {
            searchService.getAssets(searchFilters).done(results => {
                results.results.forEach(i => {
                    var result = i.content;
                    if (result.descriptions && result.descriptions.length) {
                        var friendlyName: string = null;
                        result.descriptions.forEach(desc => {
                            if (desc.friendlyName && !!$.trim(desc.friendlyName)) {
                                friendlyName = desc.friendlyName;
                            }
                        });
                        if (friendlyName) {
                            var listItem = this.baseItems().filter(i => { return i.id === result.__id });
                            var pinItem = this.pinnableItems().filter(i => { return i.id === result.__id });
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
    }

    private buildItems() {
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
    }

    onSelect = (d: BindablePinnableListItem, e:Event) => {
        var id = d.id;
        homeManager.isSearching(true);
        this.logger.logInfo("Asset selected from home page.", { assetId: id });
        userProfileService.getPins().done(pins => {
            var current = pins.pins.filter(p => { return p.assetId === id });
            if (current.length) {
                current[0].lastUsedDate = new Date().toISOString();
                var updated = pins.pins.filter(p => { return p.assetId !== id });
                updated.unshift(current[0]);
                pins.pins = updated;
                userProfileService.setPins(pins);
            }
        });
        browseManager.searchText(utils.stringFormat("__id={0}", id));
        browseManager.doSearch({
            captureSearchTerm: false
        }).done(result => {
            var bindableResult = new BindableResult(result);
            browseManager.searchResult(bindableResult);
            var entities = (result.results.length) ? [new BindableDataEntity(result.results[0])] : [];
            var entity = entities[0]
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
    }

    onUnpin = (d: BindablePinnableListItem, e:Event) => {
        d.pinned(false);
        this.logger.logInfo("Asset unpinned from home page.", { assetId: d.id });
        userProfileService.getPins().done(pins => {
            var pinned = pins.pins.filter(p => { return p.assetId !== d.id });
            pins.pins = pinned;
            userProfileService.setPins(pins).done(() => {
                this.onPinToggled();
                browseManager.updatePinned(d.id, false);
            });
        });
    }

    onPin = (d: BindablePinnableListItem, e:Event) => {
        d.pinned(true);
        this.logger.logInfo("Asset pinned on home page.", { assetId: d.id });
        userProfileService.getPins().done(pins => {
            var created = new Date().toISOString();
            var pin: Interfaces.IPin = {
                lastUsedDate: created,
                createdDate: created,
                id: "",
                assetId: d.id,
                name: d.label
            };
            pins.pins.unshift(pin);
            userProfileService.setPins(pins).done(() => {
                this.onPinToggled();
                browseManager.updatePinned(d.id, true);
            });
        });
    }

    onSeeMore = (d: viewModel, e:Event) => {
        this.max(this.baseItems().length);
        this.buildItems();
        var scroll = $(".pinnable-item").height() * 5; // Scroll the list so the next few items are visible
        $("#" + this.listID()).animate({ scrollTop: scroll }, 250);
    }

    onMouseLeaveTile = (d: viewModel, e:Event) => {
        clearTimeout(this._collapseTimer);

        this._collapseTimer = setTimeout(this.collapseList.bind(this), 1000);
    }

    onMouseEnterTile = (d: viewModel, e: Event) => {
        clearTimeout(this._collapseTimer);
    }

    private collapseList() {
        clearTimeout(this._collapseTimer);
        if (this.max() !== this.originalMax) {
            this.max(this.originalMax);
            this.buildItems();
        }
    }
}