module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IUserResolution {
        upn: string;
        objectId: string;
        objectType: string;
        containsDistributionLists?: boolean;
    }
}  