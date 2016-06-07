module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IPin extends ITemporalUserData {
        id: string;
        assetId: string;
        name: string;
    } 

    export interface IPins {
        version: string;
        pins: IPin[];
    }
}