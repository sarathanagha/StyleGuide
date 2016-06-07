module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface ICreateCatalog {
        name: string;
        subscription?: string;
        subscriptionId: string;
        location: string;
        resourceGroupName?: string;
        sku: string;
        units?: number;
        users: { upn: string; objectId: string }[];
        admins: { upn: string; objectId: string}[];
        enableAutomaticUnitAdjustment?: boolean;
    } 
}