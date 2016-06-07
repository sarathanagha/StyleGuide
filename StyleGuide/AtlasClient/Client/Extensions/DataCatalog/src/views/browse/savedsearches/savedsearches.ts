// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./savedsearches.html" />
/// <amd-dependency path="css!./savedsearches.css" />

import ko = require("knockout");
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./savedsearches.html");

export class viewModel implements Interfaces.IBrowseSavedSearch {
    private dispose: () => void;
    resx = resx;
    searches = ko.observableArray<Interfaces.IBindableSavedSearch>();
    static isExpanded = ko.observable<boolean>(false);
    isExpanded = viewModel.isExpanded;
    isApplyingSearch = ko.observable<boolean>(false);

    appliedSearchId = ko.pureComputed<string>(() => {
        if (browseManager.appliedSearch()) {
            return browseManager.appliedSearch().id;
        }
        return "";
    });

    idOfSearchBeingRenamed = ko.observable<string>();
    isUpdatingName = ko.observable<boolean>(false);

    //#region paging
    private itemsPerPage = 5;
    currentSearchesPage = ko.pureComputed<Interfaces.IBindableSavedSearch[]>(() => {
        var currentPage = this.currentPage();
        if (this.searches().length <= 6) {
            return this.searches();
        } else {
            var start = (currentPage-1) * this.itemsPerPage;
            var end = start + this.itemsPerPage;
            return this.searches().slice(start, end);
        }
    });

    hasPaging = ko.pureComputed<boolean>(() => {
        return this.searches().length > (this.itemsPerPage + 1);
    });
    currentPage = ko.observable<number>(1);
    nextPageArrowIsEnabled = ko.pureComputed<boolean>(() => {
        return this.searches().length > (this.currentPage() * this.itemsPerPage);
    });
    prevPageArrowIsEnabled = ko.pureComputed<boolean>(() => {
        return this.currentPage() > 1;
    });
    pagingDisplayText = ko.pureComputed(() => {
        var totalPages = Math.ceil(this.searches().length / this.itemsPerPage);
        return utilities.stringFormat(resx.somethingOfSomethingFormat, this.currentPage(), totalPages);
    });
    //#endregion

    constructor() {
        this.refresh(true);

        var subscription = this.isExpanded.subscribe(newValue => {
            if (newValue) {
                this.refresh(true);
            }
        });

        this.dispose = () => {
            subscription.dispose();
        };
    }

    refresh(isInitialRefresh?: boolean): JQueryPromise<Interfaces.ISavedSearches> {
        this.currentPage(1);
        return userProfileService.getSavedSearches()
            .done(result => {
                // Sort default first(only initially) then lastUsedDate newest -> oldest 
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

                var sorted = result.searches;
                if (isInitialRefresh) {
                    sorted = result.searches.sort(sorter);
                }
                var bindableSearches = sorted.map(s => utilities.asBindable<Interfaces.IBindableSavedSearch>(s));
                this.searches(bindableSearches);
            });
    }

    applySearch(bindableSearch: Interfaces.IBindableSavedSearch) {
        logger.logInfo("applying search", { id: bindableSearch.id() });
        this.isApplyingSearch(true);

        // Update last used time on search
        bindableSearch.lastUsedDate(new Date().toISOString());
        this.updateSearches()
            .done(() => {
                var savedSearch = <Interfaces.ISavedSearch>ko.toJS(bindableSearch);
                browseManager.applySavedSearch(savedSearch)
                    .done(() => { this.isApplyingSearch(false); });
            });
    }

    saveAsDefault(bindableSearch: Interfaces.IBindableSavedSearch) {
        logger.logInfo("setting search as default", { id: bindableSearch.id() });
        this.searches().forEach(s => {
            s.isDefault(s.id === bindableSearch.id);
        });

        this.updateSearches();
    }

    deleteSearch(bindableSearch: Interfaces.IBindableSavedSearch) {
        var confirmText = utilities.stringFormat(resx.confirmDeleteSavedSearchFormat, bindableSearch.name());
        modalService.show({ title: resx.confirmDeleteTitle, bodyText: confirmText })
            .done(modal => {
                logger.logInfo("deleting search", { id: bindableSearch.id() });
                this.searches.remove(bindableSearch);
                this.updateSearches()
                    .always(() => {
                        modal.close();
                    });
            });
    }

    updateSearchName(bindableSearch: Interfaces.IBindableSavedSearch) {
        logger.logInfo("update search name", { id: bindableSearch.id() });
        this.isUpdatingName(true);
        this.updateSearches()
            .always(() => {

                var applyUpdatePromise = $.Deferred().resolve().promise();
                if (browseManager.appliedSearch() && browseManager.appliedSearch().id === bindableSearch.id()) {
                    var savedSearch = <Interfaces.ISavedSearch>ko.toJS(bindableSearch);
                    applyUpdatePromise = browseManager.applySavedSearch(savedSearch);
                }

                applyUpdatePromise.always(() => {
                    this.isUpdatingName(false);
                    this.idOfSearchBeingRenamed(null);
                });
            });
    }

    onRenameKeyUp(bindableSearch: Interfaces.IBindableSavedSearch, event) {
        if (event.keyCode === constants.KeyCodes.ENTER) {
             this.updateSearchName(bindableSearch);
        } 
        return true;
    }

    private updateSearches(): JQueryPromise<any> {
        var deferred = $.Deferred();

        userProfileService.getSavedSearches()
            .done(savedSearches => {
                savedSearches.searches = this.searches().map(s => <Interfaces.ISavedSearch>ko.toJS(s));
                userProfileService.setSavedSearches(savedSearches)
                    .always(() => {
                        this.refresh()
                            .always(() => {
                                deferred.resolve();
                            });
                    });
            });

        return deferred.promise();
    }
}