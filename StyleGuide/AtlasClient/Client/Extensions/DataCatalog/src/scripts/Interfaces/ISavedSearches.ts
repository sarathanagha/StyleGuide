module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface ITemporalUserData {
        lastUsedDate: string;
        createdDate: string;
    }

    export interface ISavedSearches {
        version: string;
        searches: ISavedSearch[];
    }

    export interface ISavedSearch extends ITemporalUserData {
        id: string;
        name: string;
        isDefault: boolean;

        searchTerms: string;
        containerId: string;
        sortKey: string;
        facetFilters: ISavedFacet[];
    }

    export interface ISavedFacet {
        groupType: string;
        term: string;
    }

    export interface IBindableSavedSearch {
        id: KnockoutObservable<string>;
        name: KnockoutObservable<string>;
        lastUsedDate: KnockoutObservable<string>;
        createdDate: KnockoutObservable<string>;

        isDefault: KnockoutObservable<boolean>;

        searchTerms: KnockoutObservable<string>;
        containerId: KnockoutObservable<string>;
        sortKey: KnockoutObservable<string>;
        facetFilters: ISavedFacet[];
    }

    export interface ISearchTerms {
        version: string;
        terms: ISearchTerm[];
    }

    export interface ISearchTerm extends ITemporalUserData{
        term: string;
    }
}