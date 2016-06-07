module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface ISearchResult {
        query: IQueryResult;
        id: string;
        totalResults: number;
        startIndex: number;
        itemsPerPage: number;
        facets: IFacetResponseItem[];
        results: ISearchEntity[];

        __error: any;
    }

    export interface ISearchEntity {
        updated: string;
        content: IDataEntity;
        hitProperties: IHitProperty[];

        // Calculated property
        searchRelevanceInfo: ISearchRelevanceInfo;
    }

    export interface ISearchRelevanceInfo {
        tablePropertyCount: number;
        columnPropertyCount: number;
    }

    export interface IHitProperty {
        fieldPath: string;
        highlightDetail: IHighlightFragment[];
    }

    export interface IHighlightFragment {
        highlightedFragment: string;
        highlightedWords: IHighlightWord[];
    }

    export interface IHighlightWord {
        word: string;
    }

    export interface IPrincipal {
        objectId: string;
    }

    export interface IRight {
        right: string;
    }

    export interface IRole {
        role: string; // Contributor, Owner
        members: IPrincipal[];
    }

    export interface IPermission {
        rights: IRight[];
        principal: IPrincipal;
    }

    export interface IAsset {
        __id: string;
        __creatorId: string;
        modifiedTime: string;
        __roles: IRole[];
    }

    export interface IPreview extends IAsset {
        preview: any[];
    }

    export interface IDataEntity {
        __id: string;
        __type: string;
        __creatorId: string;

        // Authorization
        __effectiveRights: string[]; // Read, Update, Delete, ViewPermissions, ViewRoles, TakeOwnership, ChangeOwnership, ChangeVisibility
        __permissions: IPermission[];
        __roles: IRole[];

        modifiedTime: string;
        name: string;
        experts: IExpert[];
        containerId: string;
        dataSource: IDataSource;
        accessInstructions: IAccessInstruction[];
        descriptions: IDescription[];
        documentation: IDocumentation;
        dsl: IDataSourceLocation;
        measure: IColumn;
        lastRegisteredTime: string;
        lastRegisteredBy: IUserPrincipal;
        tableDataProfiles?: IDataProfile[];
        columnsDataProfiles?: IColumnProfileArray[];
        columnsDataProfileLinks?: IAsset[];
        
        officeTelemetrys?: IOfficeTelemetry[];
        officeTelemetryRules?: IOfficeTelemetryRule[];

        schemas: ISchema[];
        schemaDescriptions: ISchemaDescription[];

        previewLinks: IAsset[];
        previews: IPreview[];
    }

    export interface IUserPrincipal {
        firstName: string;
        lastName: string;
        upn: string;
    }

    export interface ISchema {
        __id: string;
        __creatorId: string;
        modifiedTime: string;
        columns: IColumn[];
        schemaDescriptions: ISchemaDescription[];
    }

    export interface IColumn {
        id?: string;
        name: string;
        type: string;
        maxLength: string;
        precision: string;
        isNullable: string;
    }

    export interface ISchemaDescription {
        __id: string;
        __creatorId: string;
        modifiedTime: string;
        columnDescriptions: IColumnDescription[];
    }

    export interface IColumnDescription {
        columnName: string;
        tags: string[];
        description: string;
    }

    export interface IExpert {
        __id: string;
        __creatorId: string;
        experts: string[];
        modifiedTime: string;
    }

    export interface IDataSource {
        sourceType: string;
        objectType: string;
        formatType: string;
    }

    export interface IAccessInstruction {
        __id: string;
        __creatorId: string;
        modifiedTime: string;
        mimeType: string;
        content: string;
    }

    export interface IDescription {
        __id: string;
        __creatorId: string;
        friendlyName: string;
        modifiedTime: string;
        tags: string[];
        description: string;
    }

    export interface IDocumentation extends IAsset {
        mimeType: string;
        content: string;
    }

    export interface IDataSourceLocation {
        protocol: string;
        authentication: string;
        address: IDataSourceAddress;
    }

    export interface IDataSourceAddress {
        server: string;
        database: string;
        schema: string;
        object: string;
        model: string;
        objectType: string;
        url: string;
        path: string;
        version: string;
        container: string;
    }

    export interface IDataProfile extends IAsset {
        dataModifiedTime?: string;
        numberOfRows: number;
        size: number;
        schemaModifiedTime: string;
    }

    export interface IColumnProfileArray extends IAsset {
        columns: IColumnProfile[];
    }

    export interface IColumnProfile {
        columnName: string;
        type: string;
        nullCount: number;
        distinctCount: number;
        min: string; // Usually a number, but could be a date.
        max: string; // Same.
        avg: string;
        stdev?: number;
    }
    
    export interface IOfficeTelemetry extends IAsset {
        __type: string;
        categories: string[];
        scopeQuery: string;
    }
    
    export interface IOfficeTelemetryRule extends IAsset {
        __type: string;
        apps: string[];
        platforms: string[];
        builds: string[];
        flights: string[];
        ruleReference: string;
        ruleHealthReportDogfood: string;
        ruleHealthReportProduction: string;
        splunkLink: string;
    }
}