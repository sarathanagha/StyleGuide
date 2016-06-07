module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IErrorNotice {
        title?: string;
        bodyText: string;
        cancelAction: () => JQueryPromise<any>;
        retryAction: () => JQueryPromise<any>;
        okAction: () => JQueryPromise<any>;
    }
}