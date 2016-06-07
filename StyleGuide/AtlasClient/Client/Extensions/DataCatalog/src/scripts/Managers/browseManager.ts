/// <reference path="../models/FilterCollection.ts" />

module Microsoft.DataStudio.DataCatalog.Managers {

    var logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC managers" });

    export class BrowseManager {
        static appliedSearch = ko.observable<Interfaces.ISavedSearch>();

        static previousSearchText = ko.observable<string>(null);

        static searchText = ko.observable("");

        static currentPage = 1;
        static pageSize = ko.observable(10);
        static centerComponent = ko.observable<string>("datacatalog-browse-tiles");

        static searchResult = ko.observable<Models.BindableResult>();
        static firstRun = true;

        ////http://www.opensearch.org/Community/Proposal/Specifications/OpenSearch/Extensions/SRU/1.0/Draft_1#The_.22sortKeys.22_parameter
        static sortFields = ko.observableArray<Interfaces.IStringKeyValue>([
            {
                key: Core.Resx.relevance,
                value: null
            },
            {
                key: Core.Resx.lastRegistered,
                value: "modifiedTime,,0"
            },
            {
                key: Core.Resx.name,
                value: "name,,1"
            }
        ]);

        static sortField = ko.observable<Interfaces.IStringKeyValue>(BrowseManager.sortFields()[0]);

        static filterTypes = ko.observable<Interfaces.IFilterCollection>(new Models.FilterCollection());
        static selectedFilters = ko.observableArray<Interfaces.IFilterItem>();

        static showHighlight = ko.observable(true);

        static multiSelected = ko.observableArray<Interfaces.IBindableDataEntity>([]);
        static selected = ko.computed<Interfaces.IBindableDataEntity>(() => {
            return BrowseManager.multiSelected().length === 1
                ? Core.Utilities.arrayFirst(BrowseManager.multiSelected())
                : null;
        });

        static isSearching = ko.observable(false);

        private static _searchCounter = 0;
        static doSearch(options?: Interfaces.ISearchOptions): JQueryPromise<Interfaces.ISearchResult> {
            this._searchCounter++;
            var myCapturedCounter = this._searchCounter;
            options = options || {};
            options.resetPage && (this.currentPage = 1);
            options.resetFilters && (this.selectedFilters([]));
            options.resetSearchText && (this.searchText(""));
            options.maxFacetTerms = options.maxFacetTerms || 10;
            options.resetStart && (options.maxFacetTerms = 100);
            
            if (options.resetStart) {
                this.firstRun = true;
                this.searchResult(null);
                Managers.LayoutManager.centerComponent("datacatalog-browse-start");
            }
            
            if (!options.disableQueryStringUpdate) {
                this.updateQueryStringSearchTerms(this.searchText());
            }

            var selectedIds: string[] = [];
            if (!options.resetSelected && this.multiSelected()) {
                selectedIds = this.multiSelected().map(s => s.__id);
            }

            var groupToPreserve = this.filterTypes().findGroup(options.preserveGroup);

            var containerId: string = null;
            if (this.container()) {
                containerId = this.container().__id;
            }

            this.isSearching(true);
            var searchOptions: Interfaces.ISearchOptions = {
                searchTerms: this.searchText(),
                facetFilters: this.selectedFilters(),
                startPage: this.currentPage,
                pageSize: this.pageSize(),
                sortKey: this.sortField().value,
                containerId: containerId,
                maxFacetTerms: options.maxFacetTerms,
                captureSearchTerm: options.captureSearchTerm
            };
            var startTime = new Date().getTime();
            logger.logInfo(Core.Utilities.stringFormat("executing search request (counter={0})", myCapturedCounter), $.extend({ startTime: startTime }, searchOptions));
            var promise = Services.SearchService.search(searchOptions);

            promise.then((result) => {
                var endTime = new Date().getTime();
                logger.logInfo(Core.Utilities.stringFormat("receiving search response (counter={0} totalTime={1}sec)", myCapturedCounter, (endTime-startTime)/1000), $.extend({ startTime: startTime, endTime: endTime }, searchOptions));
                
                // If the search counter that was used is the same as when the search was executed - go ahead and bind the results.
                // However, if the counter doesn't match there is no need to bind the results as a new result response will be returned shortly.
                if (this._searchCounter !== myCapturedCounter) {
                    logger.logInfo(Core.Utilities.stringFormat("not applying search results because a newer search request has taken place (counter={0}, currentCounter={1})", myCapturedCounter, this._searchCounter), searchOptions);
                    return;
                }

                this.previousSearchText(BrowseManager.searchText());
                result = $.extend({}, result);

                var incomingFilterCollection = new Models.FilterCollection(result.facets);

                // If we currently have selected items that appear in the filter collection
                // let's add them in so the user can see the accurate query.
                incomingFilterCollection.replaceGroup(groupToPreserve);
                var selectedFilters = this.selectedFilters();
                this.selectedFilters([]);
                $.each(selectedFilters,(i, filterItem) => {
                    var item = incomingFilterCollection.findItem(filterItem.groupType, filterItem.term);
                    if (item) {
                        this.selectedFilters.push(item);
                    } else {
                        this.selectedFilters.push(incomingFilterCollection.createItem(filterItem.groupType, filterItem.term));
                    }
                });

                this.filterTypes(incomingFilterCollection);

                this.highlightHits(result.results);

                var bindableResult = new Models.BindableResult(result);

                if (!options.resetStart) {
                    this.firstRun = false;
                    if (Managers.LayoutManager.centerComponent() === "datacatalog-browse-start") {
                        Managers.LayoutManager.centerComponent(this.centerComponent());
                    }
                }

                this.searchResult(bindableResult);
                if (!options.preventSelectedFromUpdating) {
                    this.multiSelected(bindableResult.results.filter(e => selectedIds.some(s => s === e.__id)));
                }

                !this.multiSelected().length && Managers.LayoutManager.rightExpanded(false);
            })
            .always(() => {
                if (this._searchCounter === myCapturedCounter) {
                    this.isSearching(false);
                }
            });

            return promise;
        }

        static applySavedSearch(savedSearch: Interfaces.ISavedSearch): JQueryPromise<Interfaces.ISearchResult> {
            logger.logInfo("applying saved search", savedSearch);
            this.appliedSearch(savedSearch);

            var _applySavedSearch = () => {
                this.searchText(savedSearch.searchTerms);

                var sortField = Core.Utilities.arrayFirst(this.sortFields().filter(sf => sf.value === savedSearch.sortKey));
                if (sortField) {
                    this.sortField(sortField);
                } else {
                    this.sortField(BrowseManager.sortFields()[0]);
                }

                var selectedFilters = [];
                (savedSearch.facetFilters || []).forEach(f => {
                    var filterItem = this.filterTypes().findItem(f.groupType, f.term);
                    if (filterItem) {
                        selectedFilters.push(filterItem);
                    } else {
                        var newItem = this.filterTypes().createItem(f.groupType, f.term);
                        selectedFilters.push(newItem);
                    }
                });
                this.selectedFilters(selectedFilters);
            };

            if (savedSearch.containerId) {
                return this.exploreContainer(<Interfaces.IBindableDataEntity>{ containerId: savedSearch.containerId }, 
                _applySavedSearch, {
                    resetPage: true,
                    disableQueryStringUpdate: true,
                    preserveSelected: true,
                    preventSelectedFromUpdating: true,
                    captureSearchTerm: false
                });
            } else {
                _applySavedSearch();
                this.container(null);
                return this.doSearch({ resetPage: true, captureSearchTerm: false });
            }
        }

        private static highlightHits(results: Interfaces.ISearchEntity[]) {
            var excludedProps = {
                statusExpression: true,
                trendExpression: true,
                documentation: true
            };
            var sanitize = (obj) => {
                $.each(obj,(key, value) => {
                    if (excludedProps[key]) {
                        return;
                    }
                    if (typeof value === "string") {
                        // Sanitize html in string
                        if (value.indexOf("<") >= 0) {
                            obj[key] = Core.Utilities.escapeHtml(value);
                        }
                    }
                    if ($.isPlainObject(value)) {
                        sanitize(value);
                    }
                    if ($.isArray(value)) {
                        sanitize(value);
                    }
                });
            };
            var applyHighlighting = () => {
                results.forEach(result => {
                    // Filter out matches on excluded properties
                    var hitProperties = (result.hitProperties || []).filter(hp => !excludedProps[Core.Utilities.arrayFirst((hp.fieldPath || "").split("."))]);
                    // Filter out matches on system properties
                    hitProperties = hitProperties.filter(hp => !/__/.test(hp.fieldPath));
                    // Filter out matches on containerId
                    hitProperties = hitProperties.filter(hp => !/^containerId$/.test(hp.fieldPath));

                    $.each(hitProperties,(i, hitProperty: Interfaces.IHitProperty) => {
                        var prev = [];
                        var current = [<any>result.content];
                        var lastPart = "";

                        (hitProperty.fieldPath || "").split(".").forEach(part => {
                            prev = current;

                            var newCurrent = [];
                            current.forEach(c => {
                                c[part] && (newCurrent = newCurrent.concat(c[part]));
                            });
                            current = newCurrent;
                            lastPart = part;
                        });

                        var wrapWord = (str, word) => {
                            var wrappedWord = Core.Constants.Highlighting.OPEN_TAG + word + Core.Constants.Highlighting.CLOSE_TAG;
                            var regExpForAlreadyWrapped = Core.Utilities.regexEscape(wrappedWord);
                            return new RegExp(regExpForAlreadyWrapped, "g").test(str)
                                ? str
                                : str.replace(new RegExp(word, "g"), wrappedWord);
                        };

                        if (current.length) {
                            prev.forEach(p => {
                                if (typeof p[lastPart] === "string") {

                                    hitProperty.highlightDetail.forEach(hd => {
                                        hd.highlightedWords.forEach(hw => {
                                            p[lastPart] = wrapWord(p[lastPart], hw.word);
                                        });
                                    });
                                }

                                if ($.isArray(p[lastPart]) && p[lastPart].length && typeof p[lastPart][0] === "string") {
                                    for (var a = 0; a < p[lastPart].length; a++) {

                                        hitProperty.highlightDetail.forEach(hd => {
                                            hd.highlightedWords.forEach(hw => {
                                                p[lastPart][a] = wrapWord(p[lastPart][a], hw.word);
                                            });
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            };
            
            // We always need to sanitize
            sanitize(results);

            // But we will only apply highlights if enabled
            try {
                BrowseManager.showHighlight() && applyHighlighting();
                BrowseManager.getRelevanceInfo(results);
            } catch (e) {
                logger.logError("error applying highlighting", e);
            }
        }

        private static getRelevanceInfo(results: Interfaces.ISearchEntity[]) {
            var tableProperties = ["name", "descriptions", "dsl", "lastRegisteredBy", "experts"];
            var columnProperties = ["schemas"];
            // We don't want to count matches on columnName twice
            var negativeColumnProperties = ["schemas.schemaDescriptions.columnDescriptions.columnName"];

            results.forEach(result => {
                var tablePropertyCount = 0;
                var columnPropertyCount = 0;

                (result.hitProperties || []).forEach((hp: Interfaces.IHitProperty) => {
                    var fieldPath = hp.fieldPath || "";
                    var endsWithNa = /_na$/.test(fieldPath);
                    var hasFUnderscore = /\.f_/.test(fieldPath);
                    var ignoreHitProperty = endsWithNa || hasFUnderscore;
                    if (!ignoreHitProperty) { // Filter out the extra stuff we don't care about
                        tableProperties.forEach(tp => {
                            if (fieldPath.indexOf(tp) === 0) {
                                tablePropertyCount++;
                            }
                        });
                        columnProperties.forEach(tp => {
                            if (fieldPath.indexOf(tp) === 0) {
                                columnPropertyCount++;
                            }
                        });
                        negativeColumnProperties.forEach(tp => {
                            if (fieldPath.indexOf(tp) === 0) {
                                columnPropertyCount--;
                            }
                        });
                    }
                });

                // Only set the property if there are search matches
                if (tablePropertyCount || columnPropertyCount) {
                    result.searchRelevanceInfo = { tablePropertyCount: tablePropertyCount, columnPropertyCount: columnPropertyCount }
                }
            });
        }

        // Add the search term to the URL for shareability
        private static updateQueryStringSearchTerms(searchTerms: string): void {
            var isTestEnv = document && (<any>document).origin && (<any>document).origin === "null";
            if (isTestEnv) { return; }

            // Update searchTerms on URL
            var newUrl = window.document.URL.replace(/searchTerms=[^&]*/, "") // Remove pre-existing search terms
                                            .replace(/\?&/, "?")              // Remove an ampersand following a question mark
                                            .replace(/[?&]$/, "");            // Remove any trailing ampersand or question mark  

            var separator = newUrl.indexOf("?") !== -1 ? "&" : "?";
            newUrl += (separator + "searchTerms=" + encodeURIComponent(searchTerms));
            
            if (history && history.pushState) {
                var hashPart = newUrl.replace(/[^#]+/, "");
                history.pushState({}, $("title").text(), hashPart);
            } else {
                window.location = <any>newUrl;
            }

            // Try to assign focus back to the search input
            setTimeout(() => { $(".search-box input").focus(); }, 100);
        }

        // If searchTerms is defined on the URL, set the state appropriately
        static initialize(): void {
            // Setup search state
            if (location.hash.indexOf("searchTerms=") !== -1) {
                var searchTerm = location.hash.replace(/.*searchTerms=([^&]*)/, "$1");
                searchTerm = decodeURIComponent(searchTerm);
                this.searchText(searchTerm);
            }

            // Bind delete key press
            $(window).keyup((event: JQueryEventObject) => {
                var focusedElement = $(document.activeElement);
                if (!focusedElement.is("input") && !focusedElement.is("textarea") && !Managers.LayoutManager.isMasked() && event.which === Core.Constants.KeyCodes.DELETE){
                    this.deleteSelected();
                }
            });

            BrowseManager.showHighlight.subscribe(() => {
                if (Services.SearchService.research) {
                    Services.SearchService.research()
                        .done(result => {
                            this.highlightHits(result.results);
                            var bindableResult = new Models.BindableResult(result);
                            this.searchResult(bindableResult);
                            var selectedIds = this.multiSelected().map(s => s.__id);
                            this.multiSelected(bindableResult.results.filter(e => selectedIds.some(s => s === e.__id)));
                        });
                }
            });
        }

        static deletedItems = ko.observableArray<string>([]);

        static deleteSelected() {
            var deletableAssets = this.multiSelected().filter(a => a.hasDeleteRight());
            if (deletableAssets.length) {

                var doneCount = 0;
                var confirmText = deletableAssets.length === 1
                    ? Core.Utilities.stringFormat(Core.Resx.confirmSingleDelete, Core.Utilities.plainText(deletableAssets[0].displayName()))
                    : Core.Utilities.stringFormat(Core.Resx.confirmMultipleDelete, deletableAssets.length);

                // Define the modal buttons
                var modalBtns: Microsoft.DataStudioUX.Interfaces.IModalButton[] = [
                    {
                        label: Core.Resx.ok,
                        isPrimary: false,
                        action: function (actions: Microsoft.DataStudioUX.Interfaces.IModalActions) {
                            var ids = deletableAssets.map(s => s.__id);
                            Services.CatalogService.deleteAssets(ids)
                                .progress(() => {
                                    doneCount++;
                                })
                                .done((failedIds) => {
                                    failedIds = failedIds || [];
                                    Managers.LayoutManager.rightExpanded(false);

                                    BrowseManager.multiSelected().filter(s => !failedIds.some(f => f === s.__id)).forEach(a => {
                                        BrowseManager.deletedItems.push(a.__id + a.lastRegisteredTime);
                                    });
                                    BrowseManager.multiSelected([]);
                                })
                                .always(() => {
                                    actions.remove();
                                });
                        }
                    },
                    {
                        label: Core.Resx.cancel,
                        isPrimary: true,
                        action: function (actions: Microsoft.DataStudioUX.Interfaces.IModalActions) {
                            actions.remove();
                        }
                    }
                ];
                // Create the modal parameters
                var modalParams: Microsoft.DataStudioUX.Interfaces.IModalManagerParams = {
                    header: Core.Utilities.stringCapitalize(Core.Resx.confirmDeleteTitle),
                    message: confirmText,
                    buttons: modalBtns
                };
                // Create and display the modal
                Microsoft.DataStudioUX.Managers.ModalManager.show(modalParams);

            }
        }

        static isAssetDeleted(dataEntity: Interfaces.IBindableDataEntity) {
            return BrowseManager.deletedItems().some(d => d === dataEntity.__id + dataEntity.lastRegisteredTime);
        }

        static rebindView() {
            this.selected.notifySubscribers(this.selected());
        }


        static returnFromContainerQuery: () => JQueryPromise<Interfaces.ISearchResult>;
        static returnFromContainerFilters: Interfaces.IFilterCollection;
        static returnFromContainerSelectedFilters: Interfaces.IFilterItem[];
        static returnFromContainerSelectedIds: string[];
        static returnFromContainerSearchText: string;
        static container = ko.observable<Interfaces.IBindableDataEntity>();

        static exploreContainer(dataEntity: Interfaces.IBindableDataEntity, onBeforeAnimate?: () => void, searchOptions?: Interfaces.ISearchOptions): JQueryPromise<Interfaces.ISearchResult> {
            var deferred = $.Deferred();
            var enterContainerMode = (container: Interfaces.IBindableDataEntity) => {
                this.returnFromContainerQuery = Services.SearchService.research;
                this.returnFromContainerFilters = $.extend(true, {}, this.filterTypes());
                this.returnFromContainerSelectedFilters = $.extend(true, [], this.selectedFilters());
                this.returnFromContainerSelectedIds = this.multiSelected().map(a => a.__id);
                this.returnFromContainerSearchText = this.searchText();

                var slideEffect = this.firstRun ? (fn: ()=> {}) => { fn(); } : Managers.LayoutManager.slideCenterToTheLeft.bind(Managers.LayoutManager);

                slideEffect(() => {
                    searchOptions = searchOptions || {
                        resetPage: true,
                        resetFilters: true,
                        resetSearchText: true,
                        disableQueryStringUpdate: true,
                        preserveSelected: true,
                        preventSelectedFromUpdating: true
                    };

                    this.searchResult().totalResults = 1;
                    this.searchResult().results = [];
                    this.searchResult.notifySubscribers();
                    this.multiSelected([container]);
                    this.container(container);

                    if ($.isFunction(onBeforeAnimate)) {
                        onBeforeAnimate();
                    }

                    this.doSearch(searchOptions)
                        .done(deferred.resolve)
                        .fail(deferred.reject);

                });
            };

            if (dataEntity.DataSourceType === Models.DataSourceType.Container) {
                enterContainerMode(dataEntity);
            } else if (!!dataEntity.containerId) {

                var onFailedToGetContainer = () => {
                    Services.ModalService.show({
                            title: Core.Utilities.stringFormat(Core.Resx.cannotFindContainerTitleFormat, dataEntity.getContainerName()), 
                            bodyText: Core.Utilities.stringFormat(Core.Resx.cannotFindContainerBodyFormat, dataEntity.getContainerName()), 
                            hideCancelButton: true
                        })
                        .done(modal => modal.close());
                };

                Services.SearchService.search({
                        searchFilters: [`__id=${dataEntity.containerId}`],
                        capture: false
                    })
                    .done(result => {
                        if (result.totalResults === 1) {
                            var bindableResult = new Models.BindableResult(result);
                            enterContainerMode(bindableResult.results[0]);
                        } else {
                            onFailedToGetContainer();
                        }
                        
                    })
                    .fail(onFailedToGetContainer);
            }

            return deferred.promise();
        }

        static returnFromContainer() {
            var returnToDefaultState = this.appliedSearch() && this.appliedSearch().containerId;
            if (this.returnFromContainerQuery || returnToDefaultState) {
                
                Managers.LayoutManager.slideCenterToTheRight(() => {
                    this.container(null);
                    this.searchResult().totalResults = 1;
                    this.searchResult().results = [];
                    this.searchResult.notifySubscribers();
                    this.isSearching(true);

                    var backToCatalogAction = returnToDefaultState 
                        ? () => {
                            this.appliedSearch(null);
                            return this.doSearch({ resetFilters: true, resetSearchText: true, resetPage: true });
                          } 
                        : this.returnFromContainerQuery;

                    backToCatalogAction()
                        .done(result => {
                            this.isSearching(false);
                            Services.SearchService.research = this.returnFromContainerQuery;
                            this.highlightHits(result.results);
                            var bindableResult = new Models.BindableResult(result);
                            var selectedIds = this.returnFromContainerSelectedIds || [];

                            // Set page state
                            if (!returnToDefaultState) {
                                this.searchResult(bindableResult);
                                this.multiSelected(bindableResult.results.filter(e => selectedIds.some(s => s === e.__id)));
                                this.filterTypes(this.returnFromContainerFilters);
                                this.selectedFilters(this.returnFromContainerSelectedFilters);
                                this.searchText(this.returnFromContainerSearchText);
                                this.previousSearchText(this.returnFromContainerSearchText);
                            }

                            // Allow GC
                            this.returnFromContainerQuery = null;
                            this.returnFromContainerFilters = null;
                            this.returnFromContainerSelectedFilters = null;
                            this.returnFromContainerSelectedIds = null;
                            this.returnFromContainerSearchText = null;
                        });
                });
            }
        }

        static updatePinned(id: string, pinned: boolean) {
            var asset = this.searchResult().batchedResults().filter(r => { return r.__id === id });
            if (asset.length) {
                asset[0].pinned(pinned);
            }
        }
    }
}

Microsoft.DataStudio.DataCatalog.Managers.BrowseManager.initialize();