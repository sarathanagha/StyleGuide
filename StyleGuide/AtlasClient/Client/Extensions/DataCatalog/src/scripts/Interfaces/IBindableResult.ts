module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IBindableResult {
        query: IQueryResult;
        id: string;
        totalResults: number;
        startIndex: number;
        itemsPerPage: number;
        facets: any[];
        results: IBindableDataEntity[];
        batchedResults: KnockoutObservableArray<IBindableDataEntity>;
        isBatchLoading: KnockoutObservable<boolean>;
    } 

    export interface IQueryResult {
        id: string;
        searchTerms: string;
        startIndex: number;
        startPage: number;
        count: number;
    }

    export interface IBindableDataEntity {
        updated: string;
        __id: string;
        __type: string;
        __creatorId: string;

        __effectiveRights: KnockoutObservableArray<string>;
        __permissions: KnockoutObservableArray<IBindablePermission>;
        __roles: KnockoutObservableArray<IBindableRole>;

        DataSourceType: number; //enum DataSourceType 

        pinned: KnockoutObservable<boolean>;

        modifiedTime: string;
        name: string;
        containerId: string;
        lastRegisteredTime: string;
        lastRegisteredBy: IUserPrincipal;
        dataSource: IDataSource;
        accessInstructions: IAccessInstruction[];
        descriptions: KnockoutObservableArray<IBindableDescription>;
        experts: KnockoutObservableArray<IBindableExpert>;
        documentation: KnockoutObservable<IBindableDocumentation>;
        dsl: IDataSourceLocation;

        schema: IBindableSchema;
        schemaDescription: IBindableSchemaDescription;
        dataProfile: IBindableDataProfile;
        columnProfileId: string;

        hasDocumentation: () => boolean;
        hasSchema: () => boolean;
        hasPreviewLink: () => boolean;
        hasPreviewData: () => boolean;
        hasDataProfile: () => boolean;

        previewId: string;
        preview: KnockoutObservable<IPreview>;

        hasAuthorizationManagement: () => boolean;
        hasUpdateRight: () => boolean;
        hasDeleteRight: () => boolean;
        hasTakeOwnershipRight: () => boolean;
        hasChangeOwnershipRight: () => boolean;
        hasChangeVisibilityRight: () => boolean;

        metadataLastUpdated: KnockoutObservable<Date>;
        metadataLastUpdatedBy: KnockoutObservable<string>;

        displayName: KnockoutComputed<string>;
        allExperts: KnockoutComputed<string[]>;
        firstExpertDisplay: KnockoutComputed<string>;

        searchRelevanceInfo: ISearchRelevanceInfo;
        getMostRecentAccessInstruction: () => IAccessInstruction;
        getContainerName: () => string;
        setColumnProfiles: (columnProfile:IColumnProfileArray) => void;
    }

    export interface IBindableSchema {
        __id: string;
        __creatorId: string;
        columns: IColumn[];
        modifiedTime: string;
    }

    export interface IBindableSchemaDescription {
        __id: string;
        __creatorId: string;
        modifiedTime: KnockoutObservable<string>;
        columnDescriptions: IBindableColumn[];

        ensureAllColumns: (columnNames: IColumn[]) => void;
        addOtherData: (schemaDescriptions: ISchemaDescription[]) => void;
        getBindableColumnByName: (columnName: string) => IBindableColumn;
        removeColumnDescription: (columnName: string) => void;
    }

    export interface IBindableColumn {
        columnName: string;
        tags: KnockoutObservableArray<string>;
        description: KnockoutObservable<string>;

        otherInfo: IBindableOtherColumnInfo[];
        addOtherInfo: (creatorId: string, modifiedTime: string, columnDescription: IColumnDescription) => void;

        tagAttributes: KnockoutObservableArray<IAttributeInfo>;
        tagCreators: { [tag: string]: ITooltipInfo[]; };

        //#region indicator observables
        isSettingTags: KnockoutObservable<boolean>;
        successUpdatingTags: KnockoutObservable<boolean>;

        isChangingDesc: KnockoutObservable<boolean>;
        isSettingDesc: KnockoutObservable<boolean>;
        successUpdatingDesc: KnockoutObservable<boolean>;
        //#endregion
    }

    export interface IBindableOtherColumnInfo {
        __creatorId: string;
        modifiedTime: string;
        tags: string[];
        description: string;
    }

    export interface IBindableColumnProfile {
        name: string;
        type: string;
        distinct: number;
        nullcount: number;
        min: string;
        max: string;
        avg?: string;
        stdev?: string;
    }

    export interface IBindableExpert {
        __creatorId: string;
        __id: string;
        modifiedTime: KnockoutObservable<string>;
        experts: KnockoutObservableArray<string>;
    }

    export interface IBindableDescription {
        __id: string;
        __creatorId: string;
        friendlyName: KnockoutObservable<string>;
        modifiedTime: KnockoutObservable<string>;
        tags: KnockoutObservableArray<string>;
        description: KnockoutObservable<string>;
        plainDescription: KnockoutObservable<string>;

        displayDate: KnockoutComputed<string>;
        displayCreatedBy: () => string;

        linkedDescription: KnockoutComputed<string>;
    }

    export interface IBindableRole {
        role: string;
        members: KnockoutObservableArray<IPrincipal>;
    }

    export interface IBindablePermission {
        rights: KnockoutObservableArray<IRight>;
        principal: IPrincipal;
    }

    export interface IBindableDataProfile {
        rowDataLastUpdated: string;
        schema: string;
        tableName: string;
        numberOfRows: number;
        size: number;
        schemaLastModified: string;
        columns: IBindableColumnProfile[];
    }

    export interface IBindableDocumentation extends IAsset {
        mimeType: KnockoutObservable<string>;
        content: KnockoutObservable<string>;
    }
    
    export interface IBindableOfficeTelemetry {
        __id: string;
        __type: string;
        __creatorId: string;
        categories: KnockoutObservableArray<IAttributeInfo>;
        scopeQuery: KnockoutObservable<string>;
    }
    
    export interface IBindableOfficeTelemetryRule {
        __id: string;
        __type: string;
        apps: KnockoutObservableArray<IAttributeInfo>;
        platforms: KnockoutObservableArray<IAttributeInfo>;
        builds: KnockoutObservableArray<IAttributeInfo>;
        flights: KnockoutObservableArray<IAttributeInfo>;
        ruleReference: KnockoutObservable<string>;
        ruleHealthReportDogfood: KnockoutObservable<string>;
        ruleHealthReportProduction: KnockoutObservable<string>;
        splunkLink: KnockoutObservable<string>;
    }
}