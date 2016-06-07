/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./searchbox.html" />
/// <amd-dependency path="css!./searchbox.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import Logging = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import ISearchBoxParameters = Microsoft.DataStudio.DataCatalog.Interfaces.ISearchBoxParameters;
import ISearchTerm = Microsoft.DataStudio.DataCatalog.Interfaces.ISearchTerm;
import ISavedSearch = Microsoft.DataStudio.DataCatalog.Interfaces.ISavedSearch;
import ITemporalUserData = Microsoft.DataStudio.DataCatalog.Interfaces.ITemporalUserData;
import ISearchResult = Microsoft.DataStudio.DataCatalog.Interfaces.ISearchResult;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import browserManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import focusManager = Microsoft.DataStudio.DataCatalog.Managers.FocusManager;
import utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./searchbox.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;
    text: KnockoutObservable<string>;
    placeholderText: string;
    onChange: () => void;
    onClear: () => void;
    onSavedSearchApplied: () => void;

    showSuggestions = ko.observable<boolean>(false);
    inputFocus = ko.observable<boolean>(false);
    searchMatches = ko.observableArray<ISearchTerm>();
    savedSearchMatches = ko.observableArray<ISavedSearch>();
    public focusId = ko.observable<string>(null);

    selectedItem = ko.observable<ITemporalUserData>();

    private logger = Logging.getLogger({ category: "Shell Components" });

    constructor(parameters: ISearchBoxParameters) {
        this.text = parameters.text;
        this.placeholderText = parameters.placeholderText || "";
        this.onChange = parameters.onChange || (() => {});
        this.onClear = parameters.onClear || (() => {});
        this.onSavedSearchApplied = parameters.onSavedSearchApplied || (() => {});
        // If the search box is inside a container, let the container decide when this component gets keyboard focus.
        this.focusId(parameters.focusId || null);

        this._updateMatches();

        var subscription = this.inputFocus.subscribe(newValue => {
            newValue && this._updateMatches();
            !newValue && this.showSuggestions(false);
        });

        this.dispose = () => {
            subscription.dispose();
        };
    }

    public tabIndex = ko.pureComputed<string>(() => {
        var index = "0";
        if (this.focusId() && this.focusId() !== focusManager.selected()) {
            index = "-1";
        }
        return index;
    });

    applySavedSearch(savedSearch: ISavedSearch): JQueryPromise<ISearchResult> {
        var deferred = $.Deferred();
        userProfileService.getSavedSearches()
            .done(savedSearches => {
                savedSearch.lastUsedDate = new Date().toISOString();
                var matchingSavedSearch = utils.arrayFirst(savedSearches.searches.filter(s => s.id === savedSearch.id));
                if (matchingSavedSearch) {
                    matchingSavedSearch.lastUsedDate = savedSearch.lastUsedDate;
                }
                userProfileService.setSavedSearches(savedSearches)
                    .always(() => {
                        //browserManager.applySavedSearch(savedSearch)
                        //    .done(deferred.resolve)
                        //    .fail(deferred.reject);
                        this.onSavedSearchApplied();
                    });
            });
        
        return deferred.promise();
    }

    onSearchBoxKeyUp(data, event) {
        if (event.keyCode === constants.KeyCodes.ENTER) {
            var selectedItemIsSavedSearch = this.selectedItem() && (<ISavedSearch>this.selectedItem()).name;

            if (selectedItemIsSavedSearch) {
                this.logger.logInfo(utils.stringFormat("Enter key pressed for searchbox saved search ({0})", this.placeholderText));
                this.applySavedSearch(<ISavedSearch>this.selectedItem());
            } else {
                this.logger.logInfo(utils.stringFormat("Enter key pressed for searchbox suggested term ({0})", this.placeholderText));
                this.onChange();
            }
            
        } else if (!$.trim(this.text())) {
            this.logger.logInfo(utils.stringFormat("Text cleared for searchbox ({0})", this.placeholderText));
            this.onClear();
        }

        if (event.keyCode === constants.KeyCodes.UP_ARROW) {
            this._selectNextSuggestion(true);

        } else if (event.keyCode === constants.KeyCodes.DOWN_ARROW) {
            this._selectNextSuggestion();

        } else {
            this._updateMatches();
        }

        if (event.keyCode !== constants.KeyCodes.ENTER) {
            this.showSuggestions(true);
        }

        return true;
    }

    clear() {
        this.logger.logInfo(utils.stringFormat("Text cleared for searchbox ({0})", this.placeholderText));
        this.text("");
        this.showSuggestions(true);
        this.onClear();
    }

    doSearch(data?: any, event?: JQueryEventObject) {
        this.logger.logInfo(utils.stringFormat("Magnifying glass clicked for searchbox ({0})", this.placeholderText));
        this.onChange();
    }

    showClearButton = ko.pureComputed(() => {
        return !!$.trim(this.text());
    });

    selectSearchTerm(searchTerm: ISearchTerm) {
        this.text(searchTerm.term);
        this.logger.logInfo(utils.stringFormat("Term chosen from recent list for searchbox ({0})", this.placeholderText));
        this.onChange();
        return true;
    }

    private _textSnapshot = "";
    private _selectNextSuggestion(isBackwards = false) {
        var clearSelected = () => {
            this.selectedItem(null);
            this.text(this._textSnapshot);
            this._textSnapshot = "";
        };

        if (!this.selectedItem()) {
            this._textSnapshot = this.text();
            var item = isBackwards 
                            ? utils.arrayLast(this.savedSearchMatches()) || utils.arrayLast(this.searchMatches())
                            : utils.arrayFirst(this.searchMatches()) ||  utils.arrayFirst(this.savedSearchMatches());

            this.selectedItem(item);
        } else {

            var indexOfSearchMatches = this.searchMatches.indexOf(<ISearchTerm>this.selectedItem());
            var indexOfSavedSearch = this.savedSearchMatches.indexOf(<ISavedSearch>this.selectedItem());

            var lastSearchMatch = utils.arrayLast(this.searchMatches());
            var firstSavedSearch = utils.arrayFirst(this.savedSearchMatches());

            if (indexOfSearchMatches >= 0) {
                var next =  isBackwards 
                                ? indexOfSearchMatches - 1
                                : indexOfSearchMatches + 1;

                if (next >= 0 && next < this.searchMatches().length) {
                    this.selectedItem(this.searchMatches()[next]);
                } else if (!isBackwards && firstSavedSearch) {
                    this.selectedItem(firstSavedSearch);
                } else {
                    clearSelected();
                }
            }
            else if (indexOfSavedSearch >= 0) {
                var nextSavedIndex = isBackwards 
                                ? indexOfSavedSearch - 1
                                : indexOfSavedSearch + 1;

                if (nextSavedIndex >= 0 && nextSavedIndex < this.savedSearchMatches().length) {
                    this.selectedItem(this.savedSearchMatches()[nextSavedIndex]);
                } else if (isBackwards && lastSearchMatch) {
                    this.selectedItem(lastSearchMatch);
                } else {
                    clearSelected();
                }
            }
        }

        if (this.selectedItem()) {
            var selectedItem = <any>this.selectedItem();
            this.text(selectedItem.term || selectedItem.name);
        }
    }

    private _updateMatches() {
        this.selectedItem(null);
        var regExpText = utils.regexEscape($.trim(this.text()));
        var regexp = new RegExp("^" + regExpText, "i");

        var newestFirst = (a: ITemporalUserData, b: ITemporalUserData) => {
            return new Date(b.lastUsedDate).getTime() - new Date(a.lastUsedDate).getTime();
        };

        var getAlphabeticalSort = (mapper: (object: any) => string) => {
            var alphabetically = (a, b) => {
                    if(mapper(a) < mapper(b)) { return -1;}
                    if(mapper(a) > mapper(b)) { return 1;}
                    return 0;
                };
            return alphabetically;
        };

        userProfileService.getSearchTerms()
            .done(searchTerms => {
                var sorter = getAlphabeticalSort((searchTerm: ISearchTerm) => searchTerm.term);
                if (!regExpText) { sorter = newestFirst; }
                var m = searchTerms.terms.filter(t => regexp.test(t.term)).sort(sorter).slice(0,5);
                this.searchMatches(m);
            });

        userProfileService.getSavedSearches()
            .done(savedSearches => {
                var sorter = getAlphabeticalSort((savedSearch: ISavedSearch) => savedSearch.name);
                if (!regExpText) { sorter = newestFirst; }
                var m = savedSearches.searches.filter(s => regexp.test(s.name)).sort(sorter).slice(0,5);
                this.savedSearchMatches(m);
            });
    }
}