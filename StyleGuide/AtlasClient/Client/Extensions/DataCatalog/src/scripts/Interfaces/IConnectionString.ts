module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IConnectionString {
        driver: string;
        label: string;
        baseString: string;
    }

    export interface IConnectionStringParams extends IConnectionString {
        sourceType: string;
    }
}