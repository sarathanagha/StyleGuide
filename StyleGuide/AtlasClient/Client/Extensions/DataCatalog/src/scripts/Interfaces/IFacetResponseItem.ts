module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IFacetResponseItem {
        displayLabel: string;
        terms: IFacetTerm[];
    }

    export interface IFacetTerm {
        term: string;
        count: number;
    }
}