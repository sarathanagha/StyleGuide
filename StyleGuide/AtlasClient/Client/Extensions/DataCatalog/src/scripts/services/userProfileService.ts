module Microsoft.DataStudio.DataCatalog.Services {

    export class UserProfileService extends BaseService {
        private static _savedSearchesUrl = "/api/user/profile/searches";
        private static _savedSearchesPromise: JQueryPromise<Interfaces.ISavedSearches>;

        private static _searchTermsUrl = "/api/user/profile/searchTerms";
        private static _searchTermsPromise: JQueryPromise<Interfaces.ISearchTerms>;

        private static _pinsUrl = "/api/user/profile/pins";
        private static _pinsPromise: JQueryPromise<Interfaces.IPins>;

        private static _recentItemsUrl = "/api/user/profile/recentItems";
        private static _recentItemsPromise: JQueryPromise<Interfaces.IRecentItems>;

        private static _browseSettingsUri = "/api/user/profile/browseSettings";
        private static _browseSettingsPromise: JQueryPromise<Interfaces.IBrowseSettings>;

        //#region Saved Searches
        static getSavedSearches(): JQueryPromise<Interfaces.ISavedSearches> {

            // Mock Data
            var deferred = jQuery.Deferred();
            var searches: Interfaces.ISavedSearches = {
                version: "0.1",
                searches: []
            };
            deferred.resolve(searches);
            return deferred.promise();

            if (!this._savedSearchesPromise) {
                this._savedSearchesPromise = this.ajax(this._savedSearchesUrl);
            }
            return this._savedSearchesPromise;
        }

        static setSavedSearches(savedSearches: Interfaces.ISavedSearches): JQueryPromise<any> {
            return this.ajax(this._savedSearchesUrl, { method: "PUT", data: JSON.stringify(savedSearches), contentType: "application/json" })
                .done(() => {
                this._savedSearchesPromise = $.Deferred().resolve(savedSearches).promise();
            });
        }
        //#endregion

        //#region Search Terms
        static getSearchTerms(): JQueryPromise<Interfaces.ISearchTerms> {

            // Mock Data
            var deferred = jQuery.Deferred();
            var terms: Interfaces.ISearchTerms = {
                version: "0.1",
                terms: []
            };
            deferred.resolve(terms);
            return deferred.promise();

            if (!this._searchTermsPromise) {
                this._searchTermsPromise = this.ajax(this._searchTermsUrl);
            }
            return this._searchTermsPromise;
        }

        static setSearchTerms(searchTerms: Interfaces.ISearchTerms): JQueryPromise<any> {
            // Mock Data
            var deferred = jQuery.Deferred();
            deferred.resolve([]);
            return deferred.promise();

            return this.ajax(this._searchTermsUrl, { method: "PUT", data: JSON.stringify(searchTerms), contentType: "application/json" })
                .done(() => {
                this._searchTermsPromise = $.Deferred().resolve(searchTerms).promise();
            });
        }

        static addSearchTerm(termToAdd): JQueryPromise<any> {
            return;
            termToAdd = $.trim(termToAdd);
            if (!termToAdd || termToAdd === "*") {
                return $.Deferred().reject().promise();
            }

            var deferred = $.Deferred();

            this.getSearchTerms()
                .fail(deferred.reject)
                .done(searchTerms => {
                var preexisting = Core.Utilities.arrayRemove(searchTerms.terms, s => s.term.toLowerCase() === termToAdd.toLowerCase());
                var searchTermToAdd = preexisting || <Interfaces.ISearchTerm>{ createdDate: (new Date()).toISOString() };
                searchTermToAdd.lastUsedDate = (new Date()).toISOString();
                searchTermToAdd.term = termToAdd;

                searchTerms.terms.unshift(searchTermToAdd);

                this.setSearchTerms(searchTerms)
                    .then(deferred.resolve, deferred.reject);
            });

            return deferred.promise();
        }
        //#endregion

        //#region Pins
        static getPins(): JQueryPromise<Interfaces.IPins> {

            // Mock Data
            var deferred = jQuery.Deferred();
            var pins: Interfaces.IPins = {
                version: "0.1",
                pins: []
            };
            deferred.resolve(pins);
            return deferred.promise();

            if (!this._pinsPromise) {
                this._pinsPromise = this.ajax(this._pinsUrl);
            }
            return this._pinsPromise;
        }

        static setPins(pins: Interfaces.IPins): JQueryPromise<any> {
            return this.ajax(this._pinsUrl, { method: "PUT", data: JSON.stringify(pins), contentType: "application/json" })
                .done(() => {
                this._pinsPromise = $.Deferred().resolve(pins).promise();
            });
        }
        //#endregion

        //#region Recent items
        static getRecentItems(): JQueryPromise<Interfaces.IRecentItems> {

            // Mock Data
            var deferred = jQuery.Deferred();
            var recentItems: Interfaces.IRecentItems = {
                version: "0.1",
                items: []
            };
            deferred.resolve(recentItems);
            return deferred.promise();

            if (!this._recentItemsPromise) {
                this._recentItemsPromise = this.ajax(this._recentItemsUrl);
            }
            return this._recentItemsPromise;
        }

        static addRecentItems(items: Interfaces.IRecentItem[]) {
            return;
            var maxRecentItems = 25;
            this.getRecentItems().done(recentItems => {
                var recent = recentItems.items.filter(i => { return !items.some(s => s.assetId === i.assetId); });
                items.forEach(i => {
                    recent.unshift(i);
                });
                if (recent.length > maxRecentItems) {
                    recent = recent.slice(0, maxRecentItems);
                }
                recentItems.items = recent;
                this.ajax(this._recentItemsUrl, { method: "PUT", data: JSON.stringify(recentItems), contentType: "application/json" })
                    .done(() => {
                    this._recentItemsPromise = $.Deferred().resolve(recentItems).promise();
                });
            });
        }

        static resetRecentItems() {
            return;
            var items: Interfaces.IRecentItems = {
                version: "1.0.0",
                items: []
            };
            this.ajax(this._recentItemsUrl, { method: "PUT", data: JSON.stringify(items), contentType: "application/json" })
                .done(() => {
                this._recentItemsPromise = $.Deferred().resolve(items).promise();
            });
        }
        //#endregion

        //#region Browse Settings
        static getBrowseSettings(): JQueryPromise<Interfaces.IBrowseSettings> {

            // Mock Data
            var deferred = jQuery.Deferred();
            var browseSettings: Interfaces.IBrowseSettings = {
                version: "0.1",
                settings: []
            };
            deferred.resolve(browseSettings);
            return deferred.promise();

            if (!this._browseSettingsPromise) {
                this._browseSettingsPromise = this.ajax(this._browseSettingsUri);
            }
            return this._browseSettingsPromise;
        }

        static updateBrowseSettings(settings: Interfaces.IBrowseSettings) {
            return;
            this.ajax(this._browseSettingsUri, { method: "PUT", data: JSON.stringify(settings), contentType: "application/json" }).done(() => {
                this._browseSettingsPromise = $.Deferred().resolve(settings).promise();
            });
        }
        //#endregion
    }
}