module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IAllSettledResult {
        state: string;
        value?: any;
        reason?: any;
    }
}