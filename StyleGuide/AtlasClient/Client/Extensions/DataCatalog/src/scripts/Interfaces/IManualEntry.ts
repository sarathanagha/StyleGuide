module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface ISelectableItem {
        name: string;
        label: string;
    } 

    export interface IEntryLastRegisteredBy {
        upn: string;
        firstName: string;
        lastName: string;
    }

    export interface IEntryDataSource {
        sourceType: string;
        objectType: string;
        formatType: string;
    }

    export interface IEntryDescription {
        __creatorId: string;
        modifiedTime: Date;
        description: string;
        tags: string[];
        friendlyName?: string;
    }

    export interface IEntryExperts {
        __creatorId: string;
        modifiedTime: Date;
        experts: string[];
    }

    export interface IEntryAccessInstructions {
        __creatorId: string;
        modifiedTime: Date;
        mimeType: string;
        content: string;
    }

    export interface IEntryConnectionInfo {
        modifiedTime: Date;
        description: string;
    }

    export interface IEntryDataSourceLocation {
        protocol: string;
        authentication?: string;
        address: {};
    }

    export interface IManualEntry {
        __creatorId: string;
        lastRegisteredBy: IEntryLastRegisteredBy;
        modifiedTime: Date;
        lastRegisteredTime: Date;
        name: string;
        dataSource: IEntryDataSource;
        descriptions: IEntryDescription[];
        experts: IEntryExperts[];
        accessInstructions?: IEntryAccessInstructions[];
        dsl?: IEntryDataSourceLocation;
        connectionInfos?: IEntryConnectionInfo[];
    }
}