module Microsoft.DataStudio.DataCatalog.Services {

    export class SearchService extends BaseService {

        public static API_VERSION: string = "2016-03-30";

        private static getQueryParameters(options: Interfaces.ISearchQueryOptions): { searchTerms: string } {
            var searchFilters = options.searchFilters || [];
            var facetFilters = options.facetFilters || [];
            var facets = null;

            if (options.containerId) {
                searchFilters.push("containerId=" + options.containerId);
            }

            if (facetFilters.length) {
                // Group the facet filters by groupType
                var grouping = {};
                $.each(facetFilters, (i, item) => {
                    if (!grouping[item.groupType]) {
                        grouping[item.groupType] = [];
                    }
                    grouping[item.groupType].push(item);
                });

                var andGroup = [];
                $.each(grouping, (key, value: Interfaces.IFilterItem[]) => {
                    var orGroup = [];
                    $.each(value || [], (i, item: Interfaces.IFilterItem) => {
                        orGroup.push(Core.Utilities.stringFormat("{0}=\"{1}\"", item.groupType.replace("_na", ""), item.term));
                    });
                    var orString = "(" + orGroup.join(" OR ") + ")";
                    andGroup.push(orString);
                });
                var facetSearchString = "(" + andGroup.join(" AND ") + ")";
                searchFilters.push(facetSearchString);
            }

            if (options.facets) {
                facets = options.facets.join(",");
            }

            return {
                searchTerms: $.trim(options.searchTerms) || "*",
                pageSize: options.pageSize,
                startPage: options.startPage,
                sortKeys: options.sortKey,
                maxFacetTerms: options.maxFacetTerms,
                searchFilter: searchFilters.join(" AND "),
                facets: facets
            };
        }

        static research: () => JQueryPromise<Interfaces.ISearchResult>;

        static search(options: Interfaces.ISearchQueryOptions): JQueryPromise<Interfaces.ISearchResult> {
            console.log('searchService', 'search');
            var defaults: Interfaces.ISearchQueryOptions = {
                searchTerms: "*",
                searchFilters: [],
                facetFilters: [],
                startPage: 1,
                pageSize: 10,
                sortKey: null,
                containerId: null,
                capture: true,
                facets: ["tags,objectType,sourceType,experts"],
                captureSearchTerm: true
            };
            options = $.extend(defaults, options);
            //options.facets = options.facets.concat($tokyo.user.tenantFacets || []);
            var searchData = this.getQueryParameters(options);

            //if (options.capture && options.captureSearchTerm) {
            //    UserProfileService.addSearchTerm(searchData.searchTerms);
            //}

            logger.logInfo("Search executing", { data: searchData });

            var deferred = jQuery.Deferred();

            var requestData: any = {
                searchTerms: options.searchTerms ? options.searchTerms : '*',
                startPage: options.startPage,
                count: options.pageSize,
                searchFilter: options.searchFilters.join(','),
                sortKeys: options.sortKey,
                facets: options.facets.join(','),
                maxFacetTerms: 10,

                //startIndex: , 
                //language: , 
                //inputEncoding: , 
                //outputEncoding: , 
                //format: , 
                //nextItem: , 
                //azureSearchEnabled: , 
                //searchServiceDeploymentId: , 
            };

            requestData['api-version'] = this.API_VERSION;

            var execute = (queryParameters: { searchTerms: string }) => {
                return this.ajax<Interfaces.ISearchResult>("/search/search", { data: queryParameters })
                    .fail((result) => {
                        var errorResponse = <any>result;
                        var bodyText;
                        var code = "";
                        try {
                            var errorResult = JSON.parse(errorResponse.responseText);
                            logger.logInfo("Search failed", { data: errorResult });
                            code = `: ${errorResult.__error.code}`;
                            bodyText = errorResult.__error.message.value;
                        } catch (e) {
                        }

                        if (bodyText) {
                            ModalService.show({
                                title: Core.Resx.error + code,
                                bodyText: bodyText,
                                hideCancelButton: true
                            }).done(modal => modal.close());
                        }
                    })
                    .done((result) => {
                        // Set current search activityId on logger
                        //logger.setSearchActivityId(result.id);
                        logger.logInfo("Search complete", { data: queryParameters });
                    });
            };

            return execute(requestData)
                .done(() => {
                    if (options.capture) {
                        this.research = () => {
                            return execute(requestData);
                        };
                    }
                });
        }

        static getNumberOfItems(): JQueryPromise<Object> {
            var deferred = jQuery.Deferred();

            var data: any = {
                searchTerms: '*',
                count: 1,
                startPage: 1,
                maxFacetTerms: 10,
                'api-version': this.API_VERSION
            };

            var successFunc = (result) => {
                deferred.resolve((result || {}).totalResults);
            };

            this.ajax("/search/search", { data: data })
                .fail(deferred.reject)
                .done(successFunc);

            return deferred.promise();
        }

        static getNumberOfAnnotatedItems(): JQueryPromise<number> {
            var deferred = jQuery.Deferred();

            // Mock Data
            if (BaseService.useMock) {
                deferred.resolve(0);
                return deferred.promise();
            }

            var annotations = "has:tags || has:experts || has:description || has:friendlyname";
            this.search({ searchFilters: [annotations], pageSize: 1, startPage: 1, capture: false })
                .done((results) => {
                    deferred.resolve(results.totalResults);
                }).fail(deferred.reject);

            return deferred.promise();
        }

        static getNumberOfPublishers(): JQueryPromise<number> {
            var deferred = jQuery.Deferred();

            // Mock Data
            if (BaseService.useMock) {
                deferred.resolve(0);
                return deferred.promise();
            }

            this.search({ searchTerms: "*", capture: false, facets: ["lastRegisteredBy.upn"], maxFacetTerms: 101 }).done(result => {
                var count = 0;
                if (result && result.facets && result.facets.length && result.facets[0].terms) {
                    count = result.facets[0].terms.length;
                }
                deferred.resolve(count);
            }).fail(deferred.reject);
            return deferred.promise();
        }

        static getAssets(searchFilters: string[]): JQueryPromise<Interfaces.ISearchResult> {

            // Mock Data
            if (BaseService.useMock) {
                var deferred = jQuery.Deferred();
                var results: Interfaces.ISearchResult = {
                    query: {
                        id: "test",
                        searchTerms: "test",
                        startIndex: 0,
                        startPage: 0,
                        count: 0,
                    },
                    id: 'test',
                    totalResults: 0,
                    startIndex: 0,
                    itemsPerPage: 0,
                    facets: [],
                    results: [],

                    __error: null
                };
                deferred.resolve(results);
                return deferred.promise();
            }

            var assetIds = searchFilters.join(" OR ");
            return this.search({ searchFilters: [assetIds], pageSize: searchFilters.length, capture: false });
        }
    }
}