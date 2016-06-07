module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IConnectApplication {
        applicationId: string;
        protocols: Array<string>;
        limit?: number;
        text?: string;
    }
}