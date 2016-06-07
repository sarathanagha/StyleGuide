/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./searchbox.html", "css!./searchbox.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var Logging = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    var userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
    var focusManager = Microsoft.DataStudio.DataCatalog.Managers.FocusManager;
    var utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./searchbox.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.resx = resx;
            this.showSuggestions = ko.observable(false);
            this.inputFocus = ko.observable(false);
            this.searchMatches = ko.observableArray();
            this.savedSearchMatches = ko.observableArray();
            this.focusId = ko.observable(null);
            this.selectedItem = ko.observable();
            this.logger = Logging.getLogger({ category: "Shell Components" });
            this.tabIndex = ko.pureComputed(function () {
                var index = "0";
                if (_this.focusId() && _this.focusId() !== focusManager.selected()) {
                    index = "-1";
                }
                return index;
            });
            this.showClearButton = ko.pureComputed(function () {
                return !!$.trim(_this.text());
            });
            this._textSnapshot = "";
            this.text = parameters.text;
            this.placeholderText = parameters.placeholderText || "";
            this.onChange = parameters.onChange || (function () { });
            this.onClear = parameters.onClear || (function () { });
            this.onSavedSearchApplied = parameters.onSavedSearchApplied || (function () { });
            // If the search box is inside a container, let the container decide when this component gets keyboard focus.
            this.focusId(parameters.focusId || null);
            this._updateMatches();
            var subscription = this.inputFocus.subscribe(function (newValue) {
                newValue && _this._updateMatches();
                !newValue && _this.showSuggestions(false);
            });
            this.dispose = function () {
                subscription.dispose();
            };
        }
        viewModel.prototype.applySavedSearch = function (savedSearch) {
            var _this = this;
            var deferred = $.Deferred();
            userProfileService.getSavedSearches()
                .done(function (savedSearches) {
                savedSearch.lastUsedDate = new Date().toISOString();
                var matchingSavedSearch = utils.arrayFirst(savedSearches.searches.filter(function (s) { return s.id === savedSearch.id; }));
                if (matchingSavedSearch) {
                    matchingSavedSearch.lastUsedDate = savedSearch.lastUsedDate;
                }
                userProfileService.setSavedSearches(savedSearches)
                    .always(function () {
                    //browserManager.applySavedSearch(savedSearch)
                    //    .done(deferred.resolve)
                    //    .fail(deferred.reject);
                    _this.onSavedSearchApplied();
                });
            });
            return deferred.promise();
        };
        viewModel.prototype.onSearchBoxKeyUp = function (data, event) {
            if (event.keyCode === constants.KeyCodes.ENTER) {
                var selectedItemIsSavedSearch = this.selectedItem() && this.selectedItem().name;
                if (selectedItemIsSavedSearch) {
                    this.logger.logInfo(utils.stringFormat("Enter key pressed for searchbox saved search ({0})", this.placeholderText));
                    this.applySavedSearch(this.selectedItem());
                }
                else {
                    this.logger.logInfo(utils.stringFormat("Enter key pressed for searchbox suggested term ({0})", this.placeholderText));
                    this.onChange();
                }
            }
            else if (!$.trim(this.text())) {
                this.logger.logInfo(utils.stringFormat("Text cleared for searchbox ({0})", this.placeholderText));
                this.onClear();
            }
            if (event.keyCode === constants.KeyCodes.UP_ARROW) {
                this._selectNextSuggestion(true);
            }
            else if (event.keyCode === constants.KeyCodes.DOWN_ARROW) {
                this._selectNextSuggestion();
            }
            else {
                this._updateMatches();
            }
            if (event.keyCode !== constants.KeyCodes.ENTER) {
                this.showSuggestions(true);
            }
            return true;
        };
        viewModel.prototype.clear = function () {
            this.logger.logInfo(utils.stringFormat("Text cleared for searchbox ({0})", this.placeholderText));
            this.text("");
            this.showSuggestions(true);
            this.onClear();
        };
        viewModel.prototype.doSearch = function (data, event) {
            this.logger.logInfo(utils.stringFormat("Magnifying glass clicked for searchbox ({0})", this.placeholderText));
            this.onChange();
        };
        viewModel.prototype.selectSearchTerm = function (searchTerm) {
            this.text(searchTerm.term);
            this.logger.logInfo(utils.stringFormat("Term chosen from recent list for searchbox ({0})", this.placeholderText));
            this.onChange();
            return true;
        };
        viewModel.prototype._selectNextSuggestion = function (isBackwards) {
            var _this = this;
            if (isBackwards === void 0) { isBackwards = false; }
            var clearSelected = function () {
                _this.selectedItem(null);
                _this.text(_this._textSnapshot);
                _this._textSnapshot = "";
            };
            if (!this.selectedItem()) {
                this._textSnapshot = this.text();
                var item = isBackwards
                    ? utils.arrayLast(this.savedSearchMatches()) || utils.arrayLast(this.searchMatches())
                    : utils.arrayFirst(this.searchMatches()) || utils.arrayFirst(this.savedSearchMatches());
                this.selectedItem(item);
            }
            else {
                var indexOfSearchMatches = this.searchMatches.indexOf(this.selectedItem());
                var indexOfSavedSearch = this.savedSearchMatches.indexOf(this.selectedItem());
                var lastSearchMatch = utils.arrayLast(this.searchMatches());
                var firstSavedSearch = utils.arrayFirst(this.savedSearchMatches());
                if (indexOfSearchMatches >= 0) {
                    var next = isBackwards
                        ? indexOfSearchMatches - 1
                        : indexOfSearchMatches + 1;
                    if (next >= 0 && next < this.searchMatches().length) {
                        this.selectedItem(this.searchMatches()[next]);
                    }
                    else if (!isBackwards && firstSavedSearch) {
                        this.selectedItem(firstSavedSearch);
                    }
                    else {
                        clearSelected();
                    }
                }
                else if (indexOfSavedSearch >= 0) {
                    var nextSavedIndex = isBackwards
                        ? indexOfSavedSearch - 1
                        : indexOfSavedSearch + 1;
                    if (nextSavedIndex >= 0 && nextSavedIndex < this.savedSearchMatches().length) {
                        this.selectedItem(this.savedSearchMatches()[nextSavedIndex]);
                    }
                    else if (isBackwards && lastSearchMatch) {
                        this.selectedItem(lastSearchMatch);
                    }
                    else {
                        clearSelected();
                    }
                }
            }
            if (this.selectedItem()) {
                var selectedItem = this.selectedItem();
                this.text(selectedItem.term || selectedItem.name);
            }
        };
        viewModel.prototype._updateMatches = function () {
            var _this = this;
            this.selectedItem(null);
            var regExpText = utils.regexEscape($.trim(this.text()));
            var regexp = new RegExp("^" + regExpText, "i");
            var newestFirst = function (a, b) {
                return new Date(b.lastUsedDate).getTime() - new Date(a.lastUsedDate).getTime();
            };
            var getAlphabeticalSort = function (mapper) {
                var alphabetically = function (a, b) {
                    if (mapper(a) < mapper(b)) {
                        return -1;
                    }
                    if (mapper(a) > mapper(b)) {
                        return 1;
                    }
                    return 0;
                };
                return alphabetically;
            };
            userProfileService.getSearchTerms()
                .done(function (searchTerms) {
                var sorter = getAlphabeticalSort(function (searchTerm) { return searchTerm.term; });
                if (!regExpText) {
                    sorter = newestFirst;
                }
                var m = searchTerms.terms.filter(function (t) { return regexp.test(t.term); }).sort(sorter).slice(0, 5);
                _this.searchMatches(m);
            });
            userProfileService.getSavedSearches()
                .done(function (savedSearches) {
                var sorter = getAlphabeticalSort(function (savedSearch) { return savedSearch.name; });
                if (!regExpText) {
                    sorter = newestFirst;
                }
                var m = savedSearches.searches.filter(function (s) { return regexp.test(s.name); }).sort(sorter).slice(0, 5);
                _this.savedSearchMatches(m);
            });
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=searchbox.js.map