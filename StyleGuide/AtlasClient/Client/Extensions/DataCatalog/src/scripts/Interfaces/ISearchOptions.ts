module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface ISearchOptions {
        resetPage?: boolean;
        resetFilters?: boolean;
        resetSearchText?: boolean;
        resetSelected?: boolean;
        preserveGroup?: string;
        disableQueryStringUpdate?: boolean;
        preventSelectedFromUpdating?: boolean;
        maxFacetTerms?: number;
        resetStart?: boolean;
        captureSearchTerm?: boolean;
    }

    export interface ISearchQueryOptions {
        searchTerms?: string;
        searchFilters?: string[];
        facetFilters?: IFilterItem[];
        startPage?: number;
        pageSize?: number;
        sortKey?: string;
        containerId?: string;
        capture?: boolean;
        captureSearchTerm?: boolean;
        facets?: string[];
        maxFacetTerms?: number;
    }
}