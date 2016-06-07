module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IFieldType {
        editForm: string;
        editFormParams: {};
    } 

    export interface IAuthenticationType {
        name: string;
        label: string;
    }

    export interface IObjectType {
        objectType: string;
        label: string;
        rootType: string;
        editLabel: string;
        defaults?: any;
        protocol?: string;
        editFields: IFieldType[];
    }

    export interface ISourceType {
        sourceType: string;
        label: string;
        editLabel: string;
        protocol: string;
        formatType: string;
        authentication: IAuthenticationType[];
        connectionStrings?: IConnectionString[];
        objectTypes: {[key: string]: IObjectType;};
    }
}