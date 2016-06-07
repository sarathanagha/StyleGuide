module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IModalResolver {
        close: () => void;
        button: () => string;
        reset: () => JQueryPromise<IModalResolver>;
    }
}