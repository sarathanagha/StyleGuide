module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IAssetChanges {
        description?: string;
        expertsToAdd?: string[];
        expertsToRemove?: string[];
        tagsToAdd?: string[];
        tagsToRemove?: string[];
        requestAccess?: string;
    }

    export interface IAssetSchemaChange {
        columnName: string;
        description?: string;
        tagsToAdd?: string[];
        tagsToRemove?: string[];
    }

    export interface ISchemaSnapshotData {
        name: string;
        type: string;
        description: string;
        myTagsOnAll: string[];
        myTagsOnSome: string[];
        tagsOnAll: string[];
        tagsOnSome: string[];
    }

    export interface IBindableSharedColumn {
        name: string;
        type: string;
        description: KnockoutObservable<string>;
        tagsOnSome: KnockoutObservableArray<IAttributeInfo>;
        tagsOnAll: KnockoutObservableArray<IAttributeInfo>;
    }

    export interface IAuthorizationSnapshotData {
        visibility: string; // All, Some, Mixed
        ownersOnAll: string[];
        ownersOnSome: string[];
        usersOnAll: string[];
        usersOnSome: string[];
    }

    export interface IBindableAuthorizationSnapshotData {
        visibility: KnockoutObservable<string>;
        ownersOnAll: KnockoutObservableArray<IAttributeInfo>;
        ownersOnSome: KnockoutObservableArray<IAttributeInfo>;
        usersOnAll: KnockoutObservableArray<IAttributeInfo>;
        usersOnSome: KnockoutObservableArray<IAttributeInfo>;
    }

    export interface IAuthorizationChanges {
        visibility?: string; // All, Some
        ownersToAdd?: { upn: string; objectId: string }[];
        ownersToRemove?: { upn: string; objectId: string }[];
        usersToAdd?: { upn: string; objectId: string }[];
        usersToRemove?: { upn: string; objectId: string }[];
    }
}