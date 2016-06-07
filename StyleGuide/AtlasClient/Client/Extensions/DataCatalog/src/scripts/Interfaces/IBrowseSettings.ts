module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IBrowseSettingsList {
        browseComponent?: string;
        resultsPerPage?: number;
        highlight?: boolean;
    }

    export interface IBrowseSettings {
        version: string;
        settings: IBrowseSettingsList;
    }
}