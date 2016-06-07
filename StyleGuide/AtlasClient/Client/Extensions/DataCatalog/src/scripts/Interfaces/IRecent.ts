module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IRecentItem extends ITemporalUserData {
        id: string;
        assetId: string;
        name: string;
    }

    export interface IRecentItems {
        version: string;
        items: IRecentItem[];
    }
}