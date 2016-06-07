// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./savedsearches.html", "css!./savedsearches.css"], function (require, exports, ko) {
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
    var modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    var utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./savedsearches.html");
    var viewModel = (function () {
        //#endregion
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.searches = ko.observableArray();
            this.isExpanded = viewModel.isExpanded;
            this.isApplyingSearch = ko.observable(false);
            this.appliedSearchId = ko.pureComputed(function () {
                if (browseManager.appliedSearch()) {
                    return browseManager.appliedSearch().id;
                }
                return "";
            });
            this.idOfSearchBeingRenamed = ko.observable();
            this.isUpdatingName = ko.observable(false);
            //#region paging
            this.itemsPerPage = 5;
            this.currentSearchesPage = ko.pureComputed(function () {
                var currentPage = _this.currentPage();
                if (_this.searches().length <= 6) {
                    return _this.searches();
                }
                else {
                    var start = (currentPage - 1) * _this.itemsPerPage;
                    var end = start + _this.itemsPerPage;
                    return _this.searches().slice(start, end);
                }
            });
            this.hasPaging = ko.pureComputed(function () {
                return _this.searches().length > (_this.itemsPerPage + 1);
            });
            this.currentPage = ko.observable(1);
            this.nextPageArrowIsEnabled = ko.pureComputed(function () {
                return _this.searches().length > (_this.currentPage() * _this.itemsPerPage);
            });
            this.prevPageArrowIsEnabled = ko.pureComputed(function () {
                return _this.currentPage() > 1;
            });
            this.pagingDisplayText = ko.pureComputed(function () {
                var totalPages = Math.ceil(_this.searches().length / _this.itemsPerPage);
                return utilities.stringFormat(resx.somethingOfSomethingFormat, _this.currentPage(), totalPages);
            });
            this.refresh(true);
            var subscription = this.isExpanded.subscribe(function (newValue) {
                if (newValue) {
                    _this.refresh(true);
                }
            });
            this.dispose = function () {
                subscription.dispose();
            };
        }
        viewModel.prototype.refresh = function (isInitialRefresh) {
            var _this = this;
            this.currentPage(1);
            return userProfileService.getSavedSearches()
                .done(function (result) {
                // Sort default first(only initially) then lastUsedDate newest -> oldest 
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
                var sorted = result.searches;
                if (isInitialRefresh) {
                    sorted = result.searches.sort(sorter);
                }
                var bindableSearches = sorted.map(function (s) { return utilities.asBindable(s); });
                _this.searches(bindableSearches);
            });
        };
        viewModel.prototype.applySearch = function (bindableSearch) {
            var _this = this;
            logger.logInfo("applying search", { id: bindableSearch.id() });
            this.isApplyingSearch(true);
            // Update last used time on search
            bindableSearch.lastUsedDate(new Date().toISOString());
            this.updateSearches()
                .done(function () {
                var savedSearch = ko.toJS(bindableSearch);
                browseManager.applySavedSearch(savedSearch)
                    .done(function () { _this.isApplyingSearch(false); });
            });
        };
        viewModel.prototype.saveAsDefault = function (bindableSearch) {
            logger.logInfo("setting search as default", { id: bindableSearch.id() });
            this.searches().forEach(function (s) {
                s.isDefault(s.id === bindableSearch.id);
            });
            this.updateSearches();
        };
        viewModel.prototype.deleteSearch = function (bindableSearch) {
            var _this = this;
            var confirmText = utilities.stringFormat(resx.confirmDeleteSavedSearchFormat, bindableSearch.name());
            modalService.show({ title: resx.confirmDeleteTitle, bodyText: confirmText })
                .done(function (modal) {
                logger.logInfo("deleting search", { id: bindableSearch.id() });
                _this.searches.remove(bindableSearch);
                _this.updateSearches()
                    .always(function () {
                    modal.close();
                });
            });
        };
        viewModel.prototype.updateSearchName = function (bindableSearch) {
            var _this = this;
            logger.logInfo("update search name", { id: bindableSearch.id() });
            this.isUpdatingName(true);
            this.updateSearches()
                .always(function () {
                var applyUpdatePromise = $.Deferred().resolve().promise();
                if (browseManager.appliedSearch() && browseManager.appliedSearch().id === bindableSearch.id()) {
                    var savedSearch = ko.toJS(bindableSearch);
                    applyUpdatePromise = browseManager.applySavedSearch(savedSearch);
                }
                applyUpdatePromise.always(function () {
                    _this.isUpdatingName(false);
                    _this.idOfSearchBeingRenamed(null);
                });
            });
        };
        viewModel.prototype.onRenameKeyUp = function (bindableSearch, event) {
            if (event.keyCode === constants.KeyCodes.ENTER) {
                this.updateSearchName(bindableSearch);
            }
            return true;
        };
        viewModel.prototype.updateSearches = function () {
            var _this = this;
            var deferred = $.Deferred();
            userProfileService.getSavedSearches()
                .done(function (savedSearches) {
                savedSearches.searches = _this.searches().map(function (s) { return ko.toJS(s); });
                userProfileService.setSavedSearches(savedSearches)
                    .always(function () {
                    _this.refresh()
                        .always(function () {
                        deferred.resolve();
                    });
                });
            });
            return deferred.promise();
        };
        viewModel.isExpanded = ko.observable(false);
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=savedsearches.js.map