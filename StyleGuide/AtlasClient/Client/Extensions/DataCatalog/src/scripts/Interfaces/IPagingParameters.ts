module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IPagingParameters {
        totalResults: number;
        currentPage: number;
        itemsPerPage: number;

        onPagingChanged: (newPage: number) => void;
    }
}