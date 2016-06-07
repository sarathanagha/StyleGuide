/// <reference path="../src/References.d.ts" />
/// <reference path="../src/scripts/typings/utilities.d.ts" />
declare module Microsoft.DataStudio.DataCatalog {
    class DataCatalogModule implements Microsoft.DataStudio.Modules.DataStudioModule {
        name: string;
        moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;
        initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void;
        getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager;
    }
}
declare module Microsoft.DataStudio.DataCatalog {
    import Logging = Microsoft.DataStudio.Diagnostics.Logging;
    class LoggerFactory {
        private static loggerFactory;
        static getLogger(data: Logging.LoggerData): Logging.Logger;
    }
    var ComponentLogger: Logging.Logger;
    var BindingLogger: Logging.Logger;
}
declare module Microsoft.DataStudio.DataCatalog.Managers {
    class FocusManager {
        static selected: KnockoutObservable<string>;
        static setContainerInteractive(selected: string): void;
        static resetContianer(): void;
    }
}
declare var $tokyo: Microsoft.DataStudio.DataCatalog.Interfaces.IGlobalContext;
declare module Microsoft.DataStudio.DataCatalog.Core {
    class Constants {
        static KeyCodes: {
            BACKSPACE: number;
            TAB: number;
            ESCAPE: number;
            DELETE: number;
            ENTER: number;
            SPACEBAR: number;
            A: number;
            END: number;
            LEFT_ARROW: number;
            UP_ARROW: number;
            RIGHT_ARROW: number;
            DOWN_ARROW: number;
            ZER0: number;
            NINE: number;
            NUMPAD_0: number;
            NUMPAD_9: number;
        };
        static HttpStatusCodes: {
            OK: number;
            CREATED: number;
            ACCEPTED: number;
            NOCONTENT: number;
            BADREQUEST: number;
            UNAUTHORIZED: number;
            FORBIDDEN: number;
            NOTFOUND: number;
            CONFLICT: number;
            REQUESTENTITYTOOLARGE: number;
            INTERNALSERVERERROR: number;
            SERVICEUNAVAILABLE: number;
        };
        static Highlighting: {
            OPEN_TAG: string;
            CLOSE_TAG: string;
        };
        static Users: {
            NOBODY: string;
            EVERYONE: string;
        };
        static HttpRegex: RegExp;
        static EmailRegex: RegExp;
        static ManualEntryID: string;
        static svgPath: string;
        static svgPaths: {
            chevronDown: string;
        };
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    enum DataSourceType {
        Unknown = 0,
        Container = 1,
        KPI = 2,
        Table = 3,
        Measure = 4,
        Report = 5,
    }
}
declare module Microsoft.DataStudio.DataCatalog.Core {
    class Utilities {
        static stringFormat: (formatStr: string, ...args: any[]) => string;
        static stringCapitalize: (formatStr: string) => string;
        static arrayChunk: (arr: any[], chunkSize: number) => any[];
        static arrayFirst: (arr: any[]) => any;
        static arrayLast: (arr: any[]) => any;
        static arrayIntersect: (arr: any[], otherArray: any[], comparator?: (a: any, b: any) => boolean) => any[];
        static arrayExcept: (arr: any[], otherArray: any[], comparator?: (a: any, b: any) => boolean) => any[];
        static arrayRemove: (arr: any[], predicate: (a: any) => boolean) => any;
        static arrayDistinct: (arr: any[], hashFn?: (a: any) => string) => any[];
        static regexEscape: (str: any) => any;
        private static _span;
        static getCookieValue(name: string): string;
        static setCookie(name: string, value: string, expiresInDays?: number): void;
        static convertDateTimeStringToISOString(dateTime: string): string;
        static plainText(value: string): string;
        static removeHtmlTags(value: string): string;
        static escapeHtml(value: string): string;
        static removeScriptTags(value: string): string;
        static extractHighlightedWords(value: any): any[];
        static addValueToObject(obj: {}, path: string, value: any): void;
        static applyHighlighting(words: string[], target: string, regExpOptions?: string): string;
        static reloadWindow(path?: string): void;
        static getTypeFromString(typeString: string): Models.DataSourceType;
        static setAssetAsMine(asset: {
            __creatorId?: string;
            __roles?: Interfaces.IRole[];
        }, everyOneIsContributor?: boolean): void;
        static getMyAsset<T extends Interfaces.IAsset>(assets: T[]): T;
        static getLatestModifiedAsset<T extends Interfaces.IAsset>(assets: T[]): T;
        static validateEmails(emails: string[]): JQueryPromise<string[]>;
        static isValidEmail(email: string): boolean;
        static createID(): string;
        static centerTruncate(value: string, max: number): string;
        static asBindable<T>(item: any): T;
        static isSelectAction(e: KeyboardEvent): boolean;
    }
}
declare class BootstrapPopover {
    init(element: any, valueAccessor: any): void;
    update(element: any, valueAccessor: any): void;
}
declare class Spinner {
    init(element: any, valueAccessor: any): void;
    update(element: any, valueAccessor: any, allBindings: any): void;
}
declare class LoadingIndicator {
    init(element: any, valueAccessor: any): void;
    update(element: any, valueAccessor: any, allBindings: any): void;
}
declare class HighlightBinding {
    init(element: any, valueAccessor: any): {
        controlsDescendantBindings: boolean;
    };
    update(element: any, valueAccessor: any, allBindings: any): void;
}
declare class NumericBinding {
    init(element: any, valueAccessor: any): void;
}
declare class DropdownReposition {
    init(element: any, valueAccessor: any): void;
}
declare class KendoEditor {
    init(element: any, valueAccessor: any, allBindings: any, viewModel: any, bindingContext: any): void;
    update(element: any, valueAccessor: any, allBindings: any, viewModel: any, bindingContext: any): void;
}
declare module Microsoft.DataStudio.DataCatalog.Bindings {
    class LayoutPanelBindingHander {
        update(element: any, valueAccessor: any, allBindings: any): void;
    }
    class LayoutResizeableBindingHander {
        update(element: any, valueAccessor: any, allBindings: any): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog {
    class ConfigData {
        private static leftPanel;
        private static rightPanel;
        static datacatalogImagePath: string;
        static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Core {
    var Resx: IResx;
}
declare module Microsoft.DataStudio.DataCatalog.Core {
    class ConnectionStringUtilities {
        private static keyWords;
        private static getProperty(key, entity);
        private static getKeyWordValue(key);
        static parse(base: string, entity: any): string;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Core {
    class SourceTypes {
        static serverField: Interfaces.IFieldType;
        static databaseField: Interfaces.IFieldType;
        static schemaField: Interfaces.IFieldType;
        static objectField: Interfaces.IFieldType;
        static objectTypeField: Interfaces.IFieldType;
        static modelField: Interfaces.IFieldType;
        static pathField: Interfaces.IFieldType;
        static versionField: Interfaces.IFieldType;
        static domainField: Interfaces.IFieldType;
        static accountField: Interfaces.IFieldType;
        static containerField: Interfaces.IFieldType;
        static nameField: Interfaces.IFieldType;
        static urlField: Interfaces.IFieldType;
        static portField: Interfaces.IFieldType;
        static viewField: Interfaces.IFieldType;
        static resourceField: Interfaces.IFieldType;
        static loginServerField: Interfaces.IFieldType;
        static classField: Interfaces.IFieldType;
        static itemNameField: Interfaces.IFieldType;
        private static sources;
        static getSourceTypes(): string[];
        static getSourceTypesArray(): Interfaces.ISourceType[];
        static getObjectTypes(sourceName: string): string[];
        static getObjectTypesArray(sourceName: string): Interfaces.IObjectType[];
        static getSourceType(sourceName: string): Interfaces.ISourceType;
        static getObjectType(sourceName: string, objectName: string): Interfaces.IObjectType;
        static getEditFields(sourceName: string, objectName: string): Interfaces.IFieldType[];
        static supportsSchema(sourceName: string, objectName: string): boolean;
        static hasConnectionsString(sourceName: string): boolean;
        static getConnectionStrings(sourceName: string): Interfaces.IConnectionString[];
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IAllSettledResult {
        state: string;
        value?: any;
        reason?: any;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IAssetChanges {
        description?: string;
        expertsToAdd?: string[];
        expertsToRemove?: string[];
        tagsToAdd?: string[];
        tagsToRemove?: string[];
        requestAccess?: string;
    }
    interface IAssetSchemaChange {
        columnName: string;
        description?: string;
        tagsToAdd?: string[];
        tagsToRemove?: string[];
    }
    interface ISchemaSnapshotData {
        name: string;
        type: string;
        description: string;
        myTagsOnAll: string[];
        myTagsOnSome: string[];
        tagsOnAll: string[];
        tagsOnSome: string[];
    }
    interface IBindableSharedColumn {
        name: string;
        type: string;
        description: KnockoutObservable<string>;
        tagsOnSome: KnockoutObservableArray<IAttributeInfo>;
        tagsOnAll: KnockoutObservableArray<IAttributeInfo>;
    }
    interface IAuthorizationSnapshotData {
        visibility: string;
        ownersOnAll: string[];
        ownersOnSome: string[];
        usersOnAll: string[];
        usersOnSome: string[];
    }
    interface IBindableAuthorizationSnapshotData {
        visibility: KnockoutObservable<string>;
        ownersOnAll: KnockoutObservableArray<IAttributeInfo>;
        ownersOnSome: KnockoutObservableArray<IAttributeInfo>;
        usersOnAll: KnockoutObservableArray<IAttributeInfo>;
        usersOnSome: KnockoutObservableArray<IAttributeInfo>;
    }
    interface IAuthorizationChanges {
        visibility?: string;
        ownersToAdd?: {
            upn: string;
            objectId: string;
        }[];
        ownersToRemove?: {
            upn: string;
            objectId: string;
        }[];
        usersToAdd?: {
            upn: string;
            objectId: string;
        }[];
        usersToRemove?: {
            upn: string;
            objectId: string;
        }[];
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IAttributeInfo {
        name: string;
        readOnly: boolean;
        tooltips?: ITooltipInfo[];
    }
    interface ITooltipInfo {
        email: string;
    }
    interface IAttributeParameters {
        attributesOnAll: KnockoutObservableArray<IAttributeInfo>;
        attributesOnSome: KnockoutObservableArray<IAttributeInfo>;
        placeholderText: string;
        groupTypeName?: string;
        onAdd?: (attributes: string[]) => void;
        onRemove?: (attribute: string) => void;
        onRemoved: (attribute: string) => void;
        onValidate?: (attributes: string[]) => JQueryPromise<string[]>;
        hideAddButton?: boolean;
        showTooltip?: boolean;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IBindableResult {
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
    interface IQueryResult {
        id: string;
        searchTerms: string;
        startIndex: number;
        startPage: number;
        count: number;
    }
    interface IBindableDataEntity {
        updated: string;
        __id: string;
        __type: string;
        __creatorId: string;
        __effectiveRights: KnockoutObservableArray<string>;
        __permissions: KnockoutObservableArray<IBindablePermission>;
        __roles: KnockoutObservableArray<IBindableRole>;
        DataSourceType: number;
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
        setColumnProfiles: (columnProfile: IColumnProfileArray) => void;
    }
    interface IBindableSchema {
        __id: string;
        __creatorId: string;
        columns: IColumn[];
        modifiedTime: string;
    }
    interface IBindableSchemaDescription {
        __id: string;
        __creatorId: string;
        modifiedTime: KnockoutObservable<string>;
        columnDescriptions: IBindableColumn[];
        ensureAllColumns: (columnNames: IColumn[]) => void;
        addOtherData: (schemaDescriptions: ISchemaDescription[]) => void;
        getBindableColumnByName: (columnName: string) => IBindableColumn;
        removeColumnDescription: (columnName: string) => void;
    }
    interface IBindableColumn {
        columnName: string;
        tags: KnockoutObservableArray<string>;
        description: KnockoutObservable<string>;
        otherInfo: IBindableOtherColumnInfo[];
        addOtherInfo: (creatorId: string, modifiedTime: string, columnDescription: IColumnDescription) => void;
        tagAttributes: KnockoutObservableArray<IAttributeInfo>;
        tagCreators: {
            [tag: string]: ITooltipInfo[];
        };
        isSettingTags: KnockoutObservable<boolean>;
        successUpdatingTags: KnockoutObservable<boolean>;
        isChangingDesc: KnockoutObservable<boolean>;
        isSettingDesc: KnockoutObservable<boolean>;
        successUpdatingDesc: KnockoutObservable<boolean>;
    }
    interface IBindableOtherColumnInfo {
        __creatorId: string;
        modifiedTime: string;
        tags: string[];
        description: string;
    }
    interface IBindableColumnProfile {
        name: string;
        type: string;
        distinct: number;
        nullcount: number;
        min: string;
        max: string;
        avg?: string;
        stdev?: string;
    }
    interface IBindableExpert {
        __creatorId: string;
        __id: string;
        modifiedTime: KnockoutObservable<string>;
        experts: KnockoutObservableArray<string>;
    }
    interface IBindableDescription {
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
    interface IBindableRole {
        role: string;
        members: KnockoutObservableArray<IPrincipal>;
    }
    interface IBindablePermission {
        rights: KnockoutObservableArray<IRight>;
        principal: IPrincipal;
    }
    interface IBindableDataProfile {
        rowDataLastUpdated: string;
        schema: string;
        tableName: string;
        numberOfRows: number;
        size: number;
        schemaLastModified: string;
        columns: IBindableColumnProfile[];
    }
    interface IBindableDocumentation extends IAsset {
        mimeType: KnockoutObservable<string>;
        content: KnockoutObservable<string>;
    }
    interface IBindableOfficeTelemetry {
        __id: string;
        __type: string;
        __creatorId: string;
        categories: KnockoutObservableArray<IAttributeInfo>;
        scopeQuery: KnockoutObservable<string>;
    }
    interface IBindableOfficeTelemetryRule {
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
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IBindableSnapshot {
        description: KnockoutObservable<string>;
        expertsOnSome: KnockoutObservableArray<IAttributeInfo>;
        expertsOnAll: KnockoutObservableArray<IAttributeInfo>;
        tagsOnSome: KnockoutObservableArray<IAttributeInfo>;
        tagsOnAll: KnockoutObservableArray<IAttributeInfo>;
        requestAccessMode: KnockoutObservable<string>;
        requestAccess: KnockoutObservable<string>;
        locations: KnockoutObservableArray<string>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IBrowseSettingsList {
        browseComponent?: string;
        resultsPerPage?: number;
        highlight?: boolean;
    }
    interface IBrowseSettings {
        version: string;
        settings: IBrowseSettingsList;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface ICheckboxListParameters {
        data: IFilterItem[];
        selected: KnockoutObservableArray<any>;
        numberInitiallyVisible: number;
        onChange: (data: any, event: Event) => {};
        max: number;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IConnectApplication {
        applicationId: string;
        protocols: Array<string>;
        limit?: number;
        text?: string;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IConnectionString {
        driver: string;
        label: string;
        baseString: string;
    }
    interface IConnectionStringParams extends IConnectionString {
        sourceType: string;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface ICreateCatalog {
        name: string;
        subscription?: string;
        subscriptionId: string;
        location: string;
        resourceGroupName?: string;
        sku: string;
        units?: number;
        users: {
            upn: string;
            objectId: string;
        }[];
        admins: {
            upn: string;
            objectId: string;
        }[];
        enableAutomaticUnitAdjustment?: boolean;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IItemEditor {
        updateComplete: () => void;
        originalColumnName: string;
        rowSelected: KnockoutObservable<boolean>;
        columnName: KnockoutObservable<string>;
        columnType: KnockoutObservable<string>;
        duplicateErrorMessage: KnockoutObservable<boolean>;
        includeCheckbox: KnockoutObservable<boolean>;
        bindableColumn: KnockoutObservable<IBindableColumn>;
        addedInline: boolean;
    }
    interface IEditColumnData {
        column: IBindableColumn;
        includeCheckbox: boolean;
        duplicateName: KnockoutObservable<string>;
        updateColumn: (bindableColumn: IBindableColumn, columnName: string, columnType: string, itemEditor: IItemEditor) => void;
        updateDescription: (bindableColumn: IBindableColumn, columnName: string, description: string, itemEditor: IItemEditor) => void;
        checkBoxChanged?: () => void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IErrorNotice {
        title?: string;
        bodyText: string;
        cancelAction: () => JQueryPromise<any>;
        retryAction: () => JQueryPromise<any>;
        okAction: () => JQueryPromise<any>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IFacetResponseItem {
        displayLabel: string;
        terms: IFacetTerm[];
    }
    interface IFacetTerm {
        term: string;
        count: number;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IFilterCollection {
        groups: IFilterGroup[];
        findGroup(groupType: string): IFilterGroup;
        replaceGroup(group: IFilterGroup): any;
        createItem(groupType: string, term: string, count?: number): IFilterItem;
        findItem(groupType: string, term: string): IFilterItem;
        totalItems(): number;
    }
    interface IFilterGroup {
        groupType: string;
        label: string;
        items: IFilterItem[];
        findItem(term: string): IFilterItem;
    }
    interface IFilterItem {
        groupType: string;
        term: string;
        count: number;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IAuthenicatedUser {
        ipAddress: string;
        upn: string;
        objectId: string;
        email: string;
        lastName: string;
        firstName: string;
        tenantUuid: string;
        tenantDirectory: string;
        armToken: string;
        tenantFacets: string[];
    }
    interface IAppInfo {
        version: string;
        sessionUuid: string;
        authenticationSessionUuid: string;
        catalogApiVersionString: string;
        searchApiVersionString: string;
    }
    interface ILoggingInfo {
        level: number;
        enabled: boolean;
    }
    interface IServerConstants {
        tenantDirectoryHeaderName: string;
        requestVerificationTokenHeaderName: string;
        armTokenHeaderName: string;
        nextPortalActivityId: string;
        azureStandardActivityIdHeader: string;
        azureStandardResponseActivityIdHeader: string;
        catalogResponseStatusCodeHeaderName: string;
        searchResponseStatusCodeHeaderName: string;
        catalogApiVersionStringHeaderName: string;
        searchApiVersionStringHeaderName: string;
        latestPortalVersionHeaderName: string;
        additionalSearchParametersHeaderName: string;
    }
    interface IGlobalContext {
        user: IAuthenicatedUser;
        app: IAppInfo;
        logging: ILoggingInfo;
        publishingLink: string;
        isIntEnvironment: boolean;
        applications: Array<IConnectApplication>;
        overrides?: any;
        constants: IServerConstants;
        additionalSearchParameters?: string;
    }
}
declare var $tokyo: Microsoft.DataStudio.DataCatalog.Interfaces.IGlobalContext;
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IHomeListTile {
        title: string;
        popover: string;
        max: number;
        emptyMessage: string;
    }
    interface IPinnableListItem {
        label: string;
        friendlyName?: string;
        pinned: KnockoutObservable<boolean>;
        id: string;
    }
    interface IHomePinnableTile extends IHomeListTile {
        items: KnockoutObservableArray<IPinnableListItem>;
        grayUnpinned: boolean;
        onPinToggled?: () => void;
        idPrefix: string;
    }
    interface IHomeAttributeListItem {
        term: string;
    }
    interface IHomeAttributeList extends IHomeListTile {
        group: string;
        attributes: KnockoutObservableArray<IHomeAttributeListItem>;
    }
    interface IHomeStatsListItem {
        label: string;
        value: KnockoutObservable<number>;
        popup: string;
        annotate?: KnockoutObservable<string>;
    }
    interface IHomeStatsList {
        items: KnockoutObservableArray<IHomeStatsListItem>;
    }
    interface IComponent {
        name: string;
        params?: any;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IInput {
        value: KnockoutObservable<string>;
        isValid: KnockoutObservable<boolean>;
        validate: () => boolean;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IBindableInputParameters {
        label: string;
        placeholderText: string;
        bindingPath: string;
        validatePattern?: RegExp;
        value?: string;
    }
    interface ITextfieldParameters extends IBindableInputParameters {
    }
    interface ITextareaParameters extends IBindableInputParameters {
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IKeyValue<TKey, TValue> {
        key: TKey;
        value: TValue;
    }
    interface IStringKeyValue extends IKeyValue<string, string> {
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IListParameters {
        title: string;
        data: string[];
        click?: (groupType: string, data: string) => {};
        numberInitiallyVisible: number;
        groupType?: string;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface ILoggingService {
        start: () => void;
        stop: () => void;
        flush: () => void;
        activityId(activityId?: string): string;
        setSearchActivityId(activityId: string): void;
        info(message: () => string, data?: any): void;
        debug(message: () => string, data?: any): void;
        warn(message: () => string, data?: any): void;
        error(message: () => string, data?: any): void;
        fatal(message: () => string, data?: any): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface ISelectableItem {
        name: string;
        label: string;
    }
    interface IEntryLastRegisteredBy {
        upn: string;
        firstName: string;
        lastName: string;
    }
    interface IEntryDataSource {
        sourceType: string;
        objectType: string;
        formatType: string;
    }
    interface IEntryDescription {
        __creatorId: string;
        modifiedTime: Date;
        description: string;
        tags: string[];
        friendlyName?: string;
    }
    interface IEntryExperts {
        __creatorId: string;
        modifiedTime: Date;
        experts: string[];
    }
    interface IEntryAccessInstructions {
        __creatorId: string;
        modifiedTime: Date;
        mimeType: string;
        content: string;
    }
    interface IEntryConnectionInfo {
        modifiedTime: Date;
        description: string;
    }
    interface IEntryDataSourceLocation {
        protocol: string;
        authentication?: string;
        address: {};
    }
    interface IManualEntry {
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
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IModalParameters {
        title: string;
        confirmButtonText?: string;
        component?: string;
        bodyText?: string;
        hideCancelButton?: boolean;
        cancelButtonText?: string;
        buttons?: IModalButton[];
        modalContainerClass?: string;
    }
    interface IModalButton {
        id: string;
        text: string;
        isDefault: boolean;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IModalResolver {
        close: () => void;
        button: () => string;
        reset: () => JQueryPromise<IModalResolver>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface INameIdPair {
        id: string;
        name: string;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IPagingParameters {
        totalResults: number;
        currentPage: number;
        itemsPerPage: number;
        onPagingChanged: (newPage: number) => void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IPin extends ITemporalUserData {
        id: string;
        assetId: string;
        name: string;
    }
    interface IPins {
        version: string;
        pins: IPin[];
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IRecentItem extends ITemporalUserData {
        id: string;
        assetId: string;
        name: string;
    }
    interface IRecentItems {
        version: string;
        items: IRecentItem[];
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface ITemporalUserData {
        lastUsedDate: string;
        createdDate: string;
    }
    interface ISavedSearches {
        version: string;
        searches: ISavedSearch[];
    }
    interface ISavedSearch extends ITemporalUserData {
        id: string;
        name: string;
        isDefault: boolean;
        searchTerms: string;
        containerId: string;
        sortKey: string;
        facetFilters: ISavedFacet[];
    }
    interface ISavedFacet {
        groupType: string;
        term: string;
    }
    interface IBindableSavedSearch {
        id: KnockoutObservable<string>;
        name: KnockoutObservable<string>;
        lastUsedDate: KnockoutObservable<string>;
        createdDate: KnockoutObservable<string>;
        isDefault: KnockoutObservable<boolean>;
        searchTerms: KnockoutObservable<string>;
        containerId: KnockoutObservable<string>;
        sortKey: KnockoutObservable<string>;
        facetFilters: ISavedFacet[];
    }
    interface ISearchTerms {
        version: string;
        terms: ISearchTerm[];
    }
    interface ISearchTerm extends ITemporalUserData {
        term: string;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface ISearchBoxParameters {
        placeholderText?: string;
        text: KnockoutObservable<string>;
        onChange?: () => void;
        onClear?: () => void;
        onSavedSearchApplied?: () => void;
        focusId?: string;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface ISearchOptions {
        resetPage?: boolean;
        resetFilters?: boolean;
        resetSearchText?: boolean;
        resetSelected?: boolean;
        preserveGroup?: string;
        disableQueryStringUpdate?: boolean;
        preventSelectedFromUpdating?: boolean;
        maxFacetTerms?: number;
        resetStart?: boolean;
        captureSearchTerm?: boolean;
    }
    interface ISearchQueryOptions {
        searchTerms?: string;
        searchFilters?: string[];
        facetFilters?: IFilterItem[];
        startPage?: number;
        pageSize?: number;
        sortKey?: string;
        containerId?: string;
        capture?: boolean;
        captureSearchTerm?: boolean;
        facets?: string[];
        maxFacetTerms?: number;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface ISearchResult {
        query: IQueryResult;
        id: string;
        totalResults: number;
        startIndex: number;
        itemsPerPage: number;
        facets: IFacetResponseItem[];
        results: ISearchEntity[];
        __error: any;
    }
    interface ISearchEntity {
        updated: string;
        content: IDataEntity;
        hitProperties: IHitProperty[];
        searchRelevanceInfo: ISearchRelevanceInfo;
    }
    interface ISearchRelevanceInfo {
        tablePropertyCount: number;
        columnPropertyCount: number;
    }
    interface IHitProperty {
        fieldPath: string;
        highlightDetail: IHighlightFragment[];
    }
    interface IHighlightFragment {
        highlightedFragment: string;
        highlightedWords: IHighlightWord[];
    }
    interface IHighlightWord {
        word: string;
    }
    interface IPrincipal {
        objectId: string;
    }
    interface IRight {
        right: string;
    }
    interface IRole {
        role: string;
        members: IPrincipal[];
    }
    interface IPermission {
        rights: IRight[];
        principal: IPrincipal;
    }
    interface IAsset {
        __id: string;
        __creatorId: string;
        modifiedTime: string;
        __roles: IRole[];
    }
    interface IPreview extends IAsset {
        preview: any[];
    }
    interface IDataEntity {
        __id: string;
        __type: string;
        __creatorId: string;
        __effectiveRights: string[];
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
    interface IUserPrincipal {
        firstName: string;
        lastName: string;
        upn: string;
    }
    interface ISchema {
        __id: string;
        __creatorId: string;
        modifiedTime: string;
        columns: IColumn[];
        schemaDescriptions: ISchemaDescription[];
    }
    interface IColumn {
        id?: string;
        name: string;
        type: string;
        maxLength: string;
        precision: string;
        isNullable: string;
    }
    interface ISchemaDescription {
        __id: string;
        __creatorId: string;
        modifiedTime: string;
        columnDescriptions: IColumnDescription[];
    }
    interface IColumnDescription {
        columnName: string;
        tags: string[];
        description: string;
    }
    interface IExpert {
        __id: string;
        __creatorId: string;
        experts: string[];
        modifiedTime: string;
    }
    interface IDataSource {
        sourceType: string;
        objectType: string;
        formatType: string;
    }
    interface IAccessInstruction {
        __id: string;
        __creatorId: string;
        modifiedTime: string;
        mimeType: string;
        content: string;
    }
    interface IDescription {
        __id: string;
        __creatorId: string;
        friendlyName: string;
        modifiedTime: string;
        tags: string[];
        description: string;
    }
    interface IDocumentation extends IAsset {
        mimeType: string;
        content: string;
    }
    interface IDataSourceLocation {
        protocol: string;
        authentication: string;
        address: IDataSourceAddress;
    }
    interface IDataSourceAddress {
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
    interface IDataProfile extends IAsset {
        dataModifiedTime?: string;
        numberOfRows: number;
        size: number;
        schemaModifiedTime: string;
    }
    interface IColumnProfileArray extends IAsset {
        columns: IColumnProfile[];
    }
    interface IColumnProfile {
        columnName: string;
        type: string;
        nullCount: number;
        distinctCount: number;
        min: string;
        max: string;
        avg: string;
        stdev?: number;
    }
    interface IOfficeTelemetry extends IAsset {
        __type: string;
        categories: string[];
        scopeQuery: string;
    }
    interface IOfficeTelemetryRule extends IAsset {
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
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IFieldType {
        editForm: string;
        editFormParams: {};
    }
    interface IAuthenticationType {
        name: string;
        label: string;
    }
    interface IObjectType {
        objectType: string;
        label: string;
        rootType: string;
        editLabel: string;
        defaults?: any;
        protocol?: string;
        editFields: IFieldType[];
    }
    interface ISourceType {
        sourceType: string;
        label: string;
        editLabel: string;
        protocol: string;
        formatType: string;
        authentication: IAuthenticationType[];
        connectionStrings?: IConnectionString[];
        objectTypes: {
            [key: string]: IObjectType;
        };
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface ITreeMapItem {
        name: string;
        value: number;
        normalizedValue?: number;
        css?: string;
    }
    interface ITreeMapParameters {
        items: ITreeMapItem[];
        click?: (groupType: string, data: string) => {};
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IUserResolution {
        upn: string;
        objectId: string;
        objectType: string;
        containsDistributionLists?: boolean;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Interfaces {
    interface IBrowseSavedSearch {
        refresh: () => {};
    }
}
declare module Microsoft.DataStudio.DataCatalog.Knockout {
    class BindingHandler {
        static initialize(): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Managers {
    class AppManager {
        private static _showUpdgradeOverride;
        private static _latestVersion;
        static showUpgradeIsAvailable: KnockoutComputed<boolean>;
        static setLatestVersion(latestVersion: string): void;
        static hideUpgradeNotice(): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Managers {
    class BatchManagementManager {
        private static _upnMap;
        private static _objectIdMap;
        static snapshotData: Interfaces.IAuthorizationSnapshotData;
        static snapshot: KnockoutObservable<Interfaces.IBindableAuthorizationSnapshotData>;
        static invalidOwners: KnockoutObservable<string[]>;
        static invalidUsers: KnockoutObservable<string[]>;
        static failedOwners: KnockoutObservable<string[]>;
        static failedUsers: KnockoutObservable<string[]>;
        static duplicatedOwners: KnockoutObservable<string[]>;
        static duplicatedUsers: KnockoutObservable<string[]>;
        static isResolvingObjectIds: KnockoutObservable<boolean>;
        static validatingOwners: KnockoutObservable<boolean>;
        static validatingUsers: KnockoutObservable<boolean>;
        static hasChanges(): boolean;
        static init(): void;
        static cancel(): void;
        static getChanges(): Interfaces.IAuthorizationChanges;
        private static takeSnapshot();
        private static getSnapshot();
        private static resolveObjectIds();
        static onOwnerRemoved(): void;
        static onValidateUpns(upns: string[], userType: string): JQueryPromise<{}>;
        static canChangeVisibility: KnockoutComputed<boolean>;
        static canTakeOwnership: KnockoutComputed<boolean>;
        static doesOwnAll: KnockoutComputed<boolean>;
        static atLeastOneIsOwned: KnockoutComputed<boolean>;
        static allAreVisibleToEveryone: KnockoutComputed<boolean>;
        static isMixedVisibility: KnockoutComputed<boolean>;
        static someAreOwnedByOthersAndNotMe: KnockoutComputed<boolean>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Managers {
    class BatchSchemaManager {
        static snapshotData: Interfaces.ISchemaSnapshotData[];
        static snapshot: KnockoutObservableArray<Interfaces.IBindableSharedColumn>;
        static tagCreators: {
            [tag: string]: Interfaces.ITooltipInfo[];
        };
        static hasChanges(): boolean;
        static init(): void;
        static cancel(): void;
        static getChanges(): Interfaces.IAssetSchemaChange[];
        private static takeSnapshot();
        private static getColumnIntersections();
        private static getSnapshot();
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class FilterCollection implements Interfaces.IFilterCollection {
        groups: Interfaces.IFilterGroup[];
        constructor(facetResponse?: Interfaces.IFacetResponseItem[]);
        createItem(groupType: string, term: string, count?: number): Interfaces.IFilterItem;
        findItem(groupType: string, term: string): any;
        findGroup(groupType: string): Interfaces.IFilterGroup;
        replaceGroup(group: Interfaces.IFilterGroup): void;
        totalItems(): number;
    }
    class FilterGroup implements Interfaces.IFilterGroup {
        label: string;
        groupType: string;
        items: Interfaces.IFilterItem[];
        constructor(group: Interfaces.IFacetResponseItem);
        findItem(term: string): Interfaces.IFilterItem;
    }
    class FilterItem implements Interfaces.IFilterItem {
        groupType: string;
        term: string;
        count: number;
        constructor(termObj: Interfaces.IFacetTerm, groupType: string);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Managers {
    class BrowseManager {
        static appliedSearch: KnockoutObservable<Interfaces.ISavedSearch>;
        static previousSearchText: KnockoutObservable<string>;
        static searchText: KnockoutObservable<string>;
        static currentPage: number;
        static pageSize: KnockoutObservable<number>;
        static centerComponent: KnockoutObservable<string>;
        static searchResult: KnockoutObservable<Models.BindableResult>;
        static firstRun: boolean;
        static sortFields: KnockoutObservableArray<Interfaces.IStringKeyValue>;
        static sortField: KnockoutObservable<Interfaces.IStringKeyValue>;
        static filterTypes: KnockoutObservable<Interfaces.IFilterCollection>;
        static selectedFilters: KnockoutObservableArray<Interfaces.IFilterItem>;
        static showHighlight: KnockoutObservable<boolean>;
        static multiSelected: KnockoutObservableArray<Interfaces.IBindableDataEntity>;
        static selected: KnockoutComputed<Interfaces.IBindableDataEntity>;
        static isSearching: KnockoutObservable<boolean>;
        private static _searchCounter;
        static doSearch(options?: Interfaces.ISearchOptions): JQueryPromise<Interfaces.ISearchResult>;
        static applySavedSearch(savedSearch: Interfaces.ISavedSearch): JQueryPromise<Interfaces.ISearchResult>;
        private static highlightHits(results);
        private static getRelevanceInfo(results);
        private static updateQueryStringSearchTerms(searchTerms);
        static initialize(): void;
        static deletedItems: KnockoutObservableArray<string>;
        static deleteSelected(): void;
        static isAssetDeleted(dataEntity: Interfaces.IBindableDataEntity): boolean;
        static rebindView(): void;
        static returnFromContainerQuery: () => JQueryPromise<Interfaces.ISearchResult>;
        static returnFromContainerFilters: Interfaces.IFilterCollection;
        static returnFromContainerSelectedFilters: Interfaces.IFilterItem[];
        static returnFromContainerSelectedIds: string[];
        static returnFromContainerSearchText: string;
        static container: KnockoutObservable<Interfaces.IBindableDataEntity>;
        static exploreContainer(dataEntity: Interfaces.IBindableDataEntity, onBeforeAnimate?: () => void, searchOptions?: Interfaces.ISearchOptions): JQueryPromise<Interfaces.ISearchResult>;
        static returnFromContainer(): void;
        static updatePinned(id: string, pinned: boolean): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Managers {
    class DetailsManager {
        static activeComponent: KnockoutObservable<string>;
        static showSchema(): void;
        static showEditSchema(): void;
        static isShowingSchema: KnockoutComputed<boolean>;
        static showPreview(): void;
        static isShowingPreview: KnockoutComputed<boolean>;
        static showDocs(): void;
        static isShowingDocs: KnockoutComputed<boolean>;
        static showDataProfile(): void;
        static isShowingDataProfile: KnockoutComputed<boolean>;
        static isEmpty: KnockoutComputed<boolean>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Managers {
    class HomeManager {
        static isSearching: KnockoutObservable<boolean>;
        static myAssetsLabel: KnockoutObservable<string>;
        static statsLabel: KnockoutObservable<string>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Managers {
    class LayoutManager {
        static leftTitle: KnockoutObservable<string>;
        static leftComponent: KnockoutObservable<string>;
        static leftExpanded: KnockoutObservable<boolean>;
        static leftWidth: KnockoutObservable<string>;
        static leftDuration: KnockoutObservable<number>;
        static centerComponent: KnockoutObservable<string>;
        static rightTitle: KnockoutObservable<string>;
        static rightComponent: KnockoutObservable<string>;
        static rightExpanded: KnockoutObservable<boolean>;
        static rightWidth: KnockoutObservable<string>;
        static rightDuration: KnockoutObservable<number>;
        static bottomTitle: KnockoutObservable<string>;
        static bottomComponent: KnockoutObservable<string>;
        static bottomExpanded: KnockoutObservable<boolean>;
        static bottomHeight: KnockoutObservable<string>;
        static bottomDuration: KnockoutObservable<number>;
        static showLeft: KnockoutObservable<boolean>;
        static showRight: KnockoutObservable<boolean>;
        static showCenter: KnockoutObservable<boolean>;
        static showBottom: KnockoutObservable<boolean>;
        static leftFocus: KnockoutObservable<string>;
        static rightFocus: KnockoutObservable<string>;
        static centerFocus: KnockoutObservable<string>;
        static bottomFocus: KnockoutObservable<string>;
        private static adjustmentTimer;
        static init(): void;
        static getCenterPanelContent(): JQuery;
        static isMasked: KnockoutObservable<boolean>;
        static unmask(): void;
        static maskRight(): void;
        static maskBottom(): void;
        static slideCenterToTheLeft(onBeforeAnimate?: () => void): void;
        static slideCenterToTheRight(onBeforeAnimate?: () => void): void;
        static adjustAsset(): void;
        private static _slideCenter(leftOperation, rightOperation, onBeforeAnimate?);
        private static adjustScrollIfNecessary();
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableColumn implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableColumn {
        private dispose;
        experts: KnockoutComputed<string[]>;
        columnName: string;
        tags: KnockoutObservableArray<string>;
        description: KnockoutObservable<string>;
        plainDescription: KnockoutObservable<string>;
        descExpanded: KnockoutObservable<boolean>;
        otherInfo: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOtherColumnInfo[];
        tagAttributes: KnockoutObservableArray<Interfaces.IAttributeInfo>;
        isSettingTags: KnockoutObservable<boolean>;
        successUpdatingTags: KnockoutObservable<boolean>;
        isChangingDesc: KnockoutObservable<boolean>;
        isSettingDesc: KnockoutObservable<boolean>;
        successUpdatingDesc: KnockoutObservable<boolean>;
        tagCreators: {
            [tag: string]: Microsoft.DataStudio.DataCatalog.Interfaces.ITooltipInfo[];
        };
        constructor(experts: KnockoutComputed<string[]>, columnDesc: Microsoft.DataStudio.DataCatalog.Interfaces.IColumnDescription);
        addOtherInfo(creatorId: string, modifiedTime: string, columnDescription: Microsoft.DataStudio.DataCatalog.Interfaces.IColumnDescription): void;
        private setTagAttributes();
        otherDescriptions: KnockoutComputed<Interfaces.IBindableDescription[]>;
        private getOtherDescriptions(predicate);
        expandText: KnockoutComputed<string>;
        expandable: KnockoutComputed<boolean>;
        onSeeMore(): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    var logger: Diagnostics.Logging.Logger;
    class BindableDataEntity implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDataEntity {
        private dispose;
        static DISPLAY_LENGTH: number;
        updated: string;
        __id: string;
        __type: string;
        __creatorId: string;
        __effectiveRights: KnockoutObservableArray<string>;
        __effectiveRightsLookup: {
            [right: string]: boolean;
        };
        __permissions: KnockoutObservableArray<Interfaces.IBindablePermission>;
        __roles: KnockoutObservableArray<Interfaces.IBindableRole>;
        DataSourceType: Microsoft.DataStudio.DataCatalog.Models.DataSourceType;
        modifiedTime: string;
        name: string;
        containerId: string;
        lastRegisteredTime: string;
        lastRegisteredBy: Microsoft.DataStudio.DataCatalog.Interfaces.IUserPrincipal;
        dataSource: Microsoft.DataStudio.DataCatalog.Interfaces.IDataSource;
        dsl: Microsoft.DataStudio.DataCatalog.Interfaces.IDataSourceLocation;
        accessInstructions: Microsoft.DataStudio.DataCatalog.Interfaces.IAccessInstruction[];
        descriptions: KnockoutObservableArray<Interfaces.IBindableDescription>;
        experts: KnockoutObservableArray<Interfaces.IBindableExpert>;
        documentation: KnockoutObservable<Interfaces.IBindableDocumentation>;
        schema: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchema;
        schemaDescription: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchemaDescription;
        measure: Microsoft.DataStudio.DataCatalog.Interfaces.IColumn;
        dataProfile: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDataProfile;
        columnProfileId: string;
        officeTelemetry: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOfficeTelemetry;
        officeTelemetryRule: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOfficeTelemetryRule;
        previewId: string;
        preview: KnockoutObservable<Interfaces.IPreview>;
        metadataLastUpdated: KnockoutObservable<Date>;
        metadataLastUpdatedBy: KnockoutObservable<string>;
        searchRelevanceInfo: Microsoft.DataStudio.DataCatalog.Interfaces.ISearchRelevanceInfo;
        pinned: KnockoutObservable<boolean>;
        constructor(searchEntity: Microsoft.DataStudio.DataCatalog.Interfaces.ISearchEntity);
        setColumnProfiles(columnProfile: Microsoft.DataStudio.DataCatalog.Interfaces.IColumnProfileArray): void;
        private ensureMyAccessInstruction();
        private ensureMyExpert();
        private ensureMyDescription(allDescriptions);
        private static findMaxDate(object, maxSoFar);
        private getDescriptionsByEmails(emails, predicate?);
        private getColumnProfileId(content);
        private getPreviewId(content);
        allExperts: KnockoutComputed<string[]>;
        firstExpertDisplay: KnockoutComputed<string>;
        hasDocumentation(): boolean;
        hasPreviewLink(): boolean;
        hasPreviewData(): boolean;
        hasSchema(): boolean;
        hasDataProfile(): boolean;
        hasTelemetry(): boolean;
        hasUpdateRight: KnockoutComputed<boolean>;
        hasDeleteRight: KnockoutComputed<boolean>;
        hasTakeOwnershipRight: KnockoutComputed<boolean>;
        hasChangeOwnershipRight: KnockoutComputed<boolean>;
        hasChangeVisibilityRight: KnockoutComputed<boolean>;
        hasAuthorizationManagement: KnockoutComputed<boolean>;
        displayDescription: KnockoutComputed<string>;
        displayName: KnockoutComputed<string>;
        displayTags: KnockoutComputed<any[]>;
        getMostRecentAccessInstruction(): Microsoft.DataStudio.DataCatalog.Interfaces.IAccessInstruction;
        getContainerName(): string;
        pinEntity: () => void;
        unpinEntity: () => void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableDescription implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription {
        private dispose;
        __id: string;
        __creatorId: string;
        experts: KnockoutComputed<string[]>;
        friendlyName: KnockoutObservable<string>;
        modifiedTime: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        plainDescription: KnockoutObservable<string>;
        tags: KnockoutObservableArray<string>;
        requestAccess: KnockoutObservable<string>;
        constructor(experts: KnockoutComputed<string[]>, desc?: Microsoft.DataStudio.DataCatalog.Interfaces.IDescription);
        displayDate: KnockoutComputed<string>;
        displayCreatedBy(): string;
        isUserCreated(): boolean;
        isExpertDesc: KnockoutComputed<boolean>;
        linkedDescription: KnockoutComputed<string>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableDocumentation implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDocumentation {
        __creatorId: string;
        __id: string;
        __roles: Microsoft.DataStudio.DataCatalog.Interfaces.IRole[];
        modifiedTime: string;
        mimeType: KnockoutObservable<string>;
        content: KnockoutObservable<string>;
        constructor(documentation?: Microsoft.DataStudio.DataCatalog.Interfaces.IDocumentation);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableExpert implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableExpert {
        __creatorId: string;
        __id: string;
        modifiedTime: KnockoutObservable<string>;
        experts: KnockoutObservableArray<string>;
        constructor(expert?: Microsoft.DataStudio.DataCatalog.Interfaces.IExpert);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableOfficeTelemetry implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOfficeTelemetry {
        __id: string;
        __type: string;
        __creatorId: string;
        categories: KnockoutObservableArray<Interfaces.IAttributeInfo>;
        scopeQuery: KnockoutObservable<string>;
        constructor(params: Microsoft.DataStudio.DataCatalog.Interfaces.IOfficeTelemetry);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableOfficeTelemetryRule implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOfficeTelemetryRule {
        __id: string;
        __type: string;
        apps: KnockoutObservableArray<Interfaces.IAttributeInfo>;
        platforms: KnockoutObservableArray<Interfaces.IAttributeInfo>;
        builds: KnockoutObservableArray<Interfaces.IAttributeInfo>;
        flights: KnockoutObservableArray<Interfaces.IAttributeInfo>;
        ruleReference: KnockoutObservable<string>;
        ruleHealthReportDogfood: KnockoutObservable<string>;
        ruleHealthReportProduction: KnockoutObservable<string>;
        splunkLink: KnockoutObservable<string>;
        constructor(params: Microsoft.DataStudio.DataCatalog.Interfaces.IOfficeTelemetryRule);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindablePermission implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindablePermission {
        principal: Microsoft.DataStudio.DataCatalog.Interfaces.IPrincipal;
        rights: KnockoutObservableArray<Interfaces.IRight>;
        constructor(permission: Microsoft.DataStudio.DataCatalog.Interfaces.IPermission);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindablePinnableListItem {
        label: string;
        friendlyName: KnockoutObservable<string>;
        pinned: KnockoutObservable<boolean>;
        id: string;
        maxStringSize: number;
        constructor(params: Interfaces.IPinnableListItem);
        displayLabel: KnockoutComputed<string>;
        setFriendlyName(value: string): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableResult implements Interfaces.IBindableResult {
        query: Interfaces.IQueryResult;
        id: string;
        totalResults: number;
        startIndex: number;
        itemsPerPage: number;
        facets: any[];
        results: Interfaces.IBindableDataEntity[];
        batchedResults: KnockoutObservableArray<Interfaces.IBindableDataEntity>;
        isBatchLoading: KnockoutObservable<boolean>;
        constructor(searchResult: Interfaces.ISearchResult);
        private _chain(parent, fn, async?);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableRole implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableRole {
        role: string;
        members: KnockoutObservableArray<Interfaces.IPrincipal>;
        constructor(roleResult: Microsoft.DataStudio.DataCatalog.Interfaces.IRole);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableSchema implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchema {
        __id: string;
        __creatorId: string;
        columns: Interfaces.IColumn[];
        modifiedTime: string;
        constructor(schema: Microsoft.DataStudio.DataCatalog.Interfaces.ISchema);
        static getSchemaForDisplay(schemas: Microsoft.DataStudio.DataCatalog.Interfaces.ISchema[]): Microsoft.DataStudio.DataCatalog.Interfaces.ISchema;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class BindableSchemaDescription implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchemaDescription {
        __id: string;
        __creatorId: string;
        modifiedTime: KnockoutObservable<string>;
        columnDescriptions: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableColumn[];
        experts: KnockoutComputed<string[]>;
        private columnLookup;
        constructor(experts: KnockoutComputed<string[]>, schemaDesc?: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription);
        ensureAllColumns(columnNames: Microsoft.DataStudio.DataCatalog.Interfaces.IColumn[]): void;
        addOtherData(schemaDescriptions: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription[]): void;
        getBindableColumnByName(columnName: string): Microsoft.DataStudio.DataCatalog.Interfaces.IBindableColumn;
        removeColumnDescription(columnName: string): void;
        static mergeSchemaDescriptions(schemaDescriptions: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription[]): Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription[];
        static getMyBindableSchemaDescription(schemaDescriptions: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription[], columns: Microsoft.DataStudio.DataCatalog.Interfaces.IColumn[], experts: KnockoutComputed<string[]>): Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchemaDescription;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Models {
    class SavedSearch implements Interfaces.ISavedSearch {
        version: string;
        id: string;
        name: string;
        lastUsedDate: string;
        createdDate: string;
        isDefault: boolean;
        searchTerms: string;
        containerId: string;
        sortKey: string;
        facetFilters: Interfaces.ISavedFacet[];
        constructor(name: string);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Services {
    var logger: Diagnostics.Logging.Logger;
    class BaseService {
        static useMock: boolean;
        static catalogName: string;
        static stringify(value: any): string;
        static ensureAuth(): JQueryPromise<any>;
        static getNewCorrelationId(): string;
        static logAjaxError(jqueryXhr: JQueryXHR, logObject: Object, logAsWarning?: boolean): void;
        static ajax<T>(url: string, settings?: JQueryAjaxSettings, cancelAction?: () => JQueryPromise<any>, showModalOnError?: boolean, onUnauthorized?: (correlationId) => JQueryPromise<any>): JQueryPromise<T>;
        static allSettled<T>(promises: JQueryPromise<T>[]): JQueryPromise<Microsoft.DataStudio.DataCatalog.Interfaces.IAllSettledResult[]>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Services {
    class CatalogService extends BaseService {
        static API_VERSION: string;
        static createCatalogEntry(typeName: string, body: Interfaces.IManualEntry): JQueryPromise<string>;
        static updateDocumentation(containerId: string, documentation: Interfaces.IBindableDocumentation, viewRebinder: () => void): JQueryPromise<any>;
        static updateAccessInstruction(containerId: string, accessInstruction: Interfaces.IAccessInstruction, viewRebinder: () => void): JQueryPromise<any>;
        static updateUserDescription(containerId: string, desc: Interfaces.IBindableDescription, viewRebinder: () => void): JQueryPromise<any>;
        static updateUserExperts(containerId: string, bindableExpert: Interfaces.IBindableExpert, viewRebinder: () => void): JQueryPromise<any>;
        static updateUserSchemaDescription(containerId: string, bindableSchemaDesc: Interfaces.IBindableSchemaDescription, viewRebinder: () => void): JQueryPromise<{}>;
        static updateSchema(containerId: string, bindableSchema: Interfaces.IBindableSchema, viewRebinder: () => void): JQueryPromise<{}>;
        static deleteAssets(ids: string[]): JQueryPromise<string[]>;
        static saveBatchChanges(propertyChanges: Interfaces.IAssetChanges, schemaChanges: Interfaces.IAssetSchemaChange[], authChanges: Interfaces.IAuthorizationChanges, assets: Interfaces.IBindableDataEntity[], viewRebinder: () => void): JQueryPromise<Interfaces.IAllSettledResult[]>;
        private static applyAuthChanges(authChanges, asset, viewRebinder);
        static updateRolesAndPermissions(asset: Interfaces.IBindableDataEntity, roles: Interfaces.IRole[], permissions: Interfaces.IPermission[], viewRebinder: () => void): JQueryPromise<string[]>;
        static getAsset<T>(id: string, cancelAction?: () => JQueryPromise<any>, showModalOnError?: boolean, onUnauthorized?: (correlationId) => JQueryPromise<any>): JQueryPromise<T>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Services {
    class ConnectService extends BaseService {
        static getConnectionTypes(dataEntity: Interfaces.IBindableDataEntity): Interfaces.IConnectApplication[];
        static connect(dataEntity: Interfaces.IBindableDataEntity, data: Interfaces.IConnectApplication): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Services {
    class ErrorService {
        private static _errorQueue;
        private static _isShowingError;
        static addError(error: Interfaces.IErrorNotice): JQueryPromise<any>;
        private static _checkQueue();
        private static _proccessError(errorEntry);
    }
}
declare module Microsoft.DataStudio.DataCatalog.Services {
    class ModalService {
        static component: KnockoutObservable<string>;
        static bodyText: KnockoutObservable<string>;
        static title: KnockoutObservable<string>;
        static isWorking: KnockoutObservable<boolean>;
        static cancelButtonText: KnockoutObservable<string>;
        static hideCancelButton: KnockoutObservable<boolean>;
        static activeModalActions: DataStudioUX.Interfaces.IModalActions;
        static confirmButtons: KnockoutObservableArray<Interfaces.IModalButton>;
        private static _isShowing;
        private static _deferred;
        static show(parameters?: Interfaces.IModalParameters): JQueryPromise<Interfaces.IModalResolver>;
        static onConfirm(button: Interfaces.IModalButton, modalActions: DataStudioUX.Interfaces.IModalActions): void;
        static resetModalService(): void;
        static isShowing(): boolean;
        static forceClose(): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Services {
    class ProvisioningService extends BaseService {
        private static executeAsyncPoll(asyncFn, keyMapper, pollingEndKey);
        private static onUnauthorized(correlationId);
        static getSubscriptions(): JQueryPromise<any>;
        static getLocations(subscriptionId: string): JQueryPromise<any>;
        static registerSubscription(subscriptionId: string): JQueryPromise<any>;
        static createResourceGroup(subscriptionId: string, location: string): JQueryPromise<any>;
        static createCatalog(catalog: Interfaces.ICreateCatalog): JQueryPromise<any>;
        static updateCatalog(catalog: Interfaces.ICreateCatalog): JQueryPromise<any>;
        static updateCatalogRp(catalog: Interfaces.ICreateCatalog): JQueryPromise<any>;
        static deleteCatalog(subscriptionId: string, catalogName: string, location: string, resourceGroupName: string): JQueryPromise<{}>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Services {
    class SearchService extends BaseService {
        static API_VERSION: string;
        private static getQueryParameters(options);
        static research: () => JQueryPromise<Interfaces.ISearchResult>;
        static search(options: Interfaces.ISearchQueryOptions): JQueryPromise<Interfaces.ISearchResult>;
        static getNumberOfItems(): JQueryPromise<Object>;
        static getNumberOfAnnotatedItems(): JQueryPromise<number>;
        static getNumberOfPublishers(): JQueryPromise<number>;
        static getAssets(searchFilters: string[]): JQueryPromise<Interfaces.ISearchResult>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Services {
    class UserProfileService extends BaseService {
        private static _savedSearchesUrl;
        private static _savedSearchesPromise;
        private static _searchTermsUrl;
        private static _searchTermsPromise;
        private static _pinsUrl;
        private static _pinsPromise;
        private static _recentItemsUrl;
        private static _recentItemsPromise;
        private static _browseSettingsUri;
        private static _browseSettingsPromise;
        static getSavedSearches(): JQueryPromise<Interfaces.ISavedSearches>;
        static setSavedSearches(savedSearches: Interfaces.ISavedSearches): JQueryPromise<any>;
        static getSearchTerms(): JQueryPromise<Interfaces.ISearchTerms>;
        static setSearchTerms(searchTerms: Interfaces.ISearchTerms): JQueryPromise<any>;
        static addSearchTerm(termToAdd: any): JQueryPromise<any>;
        static getPins(): JQueryPromise<Interfaces.IPins>;
        static setPins(pins: Interfaces.IPins): JQueryPromise<any>;
        static getRecentItems(): JQueryPromise<Interfaces.IRecentItems>;
        static addRecentItems(items: Interfaces.IRecentItem[]): void;
        static resetRecentItems(): void;
        static getBrowseSettings(): JQueryPromise<Interfaces.IBrowseSettings>;
        static updateBrowseSettings(settings: Interfaces.IBrowseSettings): void;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Services {
    class UserService extends BaseService {
        private static _upnCache;
        private static _objectIdCache;
        private static _invalidObjectIds;
        private static _failedObjectIds;
        private static _userCountPromise;
        static init(): void;
        private static _getUnitsForAutoUnitAdjustCatalogCache;
        static getUnitsForAutoUnitAdjustCatalog(objectIds: string[]): JQueryPromise<{
            value: number;
        }>;
        static resolveUpns(upns: string[], groupBehavior: any): JQueryPromise<{
            valid: Interfaces.IUserResolution[];
            invalid: string[];
            failed: string[];
            duplicated: string[];
        }>;
        static resolveObjectIds(objectIds: string[]): JQueryPromise<{
            valid: Interfaces.IUserResolution[];
            invalid: string[];
            failed: string[];
        }>;
        static waitUntilAllowed(): JQueryPromise<any>;
        static waitUntilNotAllowed(): JQueryPromise<any>;
        static getTotalUsers(): JQueryPromise<any>;
    }
}
declare module Microsoft.DataStudio.DataCatalog.Core {
    interface IResx {
        account: string;
        add: string;
        addAdmins: string;
        addAnExpert: string;
        addCatalogName: string;
        addFriendlyName: string;
        addOwners: string;
        addOwnersAndGroups: string;
        addPins: string;
        addRecent: string;
        addSavedSearches: string;
        addSearchName: string;
        addToAll: string;
        addUsers: string;
        addUsersAndGroups: string;
        addYourDesc: string;
        addYourTags: string;
        address_account: string;
        address_assetId: string;
        address_container: string;
        address_database: string;
        address_domain: string;
        address_name: string;
        address_object: string;
        address_path: string;
        address_schema: string;
        address_server: string;
        address_sourceName: string;
        address_url: string;
        address_version: string;
        all: string;
        anErrorHasOccurred: string;
        annotatedAssetHoverText: string;
        annotatedAssetsLabel: string;
        askAQuestion: string;
        askAQuestionBody: string;
        askAQuestionSubject: string;
        assetHoverText: string;
        assetsLabel: string;
        authentication: string;
        authentication_azure: string;
        authentication_basic: string;
        authentication_hdinsight: string;
        authentication_none: string;
        authentication_oauth: string;
        authentication_protocol: string;
        authentication_sql: string;
        authentication_username: string;
        authentication_windows: string;
        average: string;
        azuredatalakestore_datalake: string;
        azuredatalakestore_directory: string;
        azuredatalakestore_file: string;
        azurestorage_azurestorage: string;
        azurestorage_blob: string;
        azurestorage_container: string;
        azurestorage_directory: string;
        azurestorage_table: string;
        backToCatalog: string;
        blog: string;
        brand: string;
        briefTime: string;
        browse_byexpert: string;
        browse_byobject: string;
        browse_bysource: string;
        browse_searchbrowse: string;
        browser_: string;
        cancel: string;
        cancelUpdate: string;
        cannotFindContainerBodyFormat: string;
        cannotFindContainerTitleFormat: string;
        catalog: string;
        catalogAdministrators: string;
        catalogAdministratorsSettingTitle: string;
        catalogLocation: string;
        catalogNameIsNotValid: string;
        catalogSettingTitle: string;
        catalogSettings: string;
        catalogUsers: string;
        catalogUsersSettingTitle: string;
        class_label: string;
        clear: string;
        clearAll: string;
        clearSearchHistory: string;
        clickTileToAddADescription: string;
        close: string;
        cluster: string;
        columnName: string;
        columnProfile: string;
        columnPropertiesCountFormat: string;
        comingSoon: string;
        commandBar_copyData: string;
        commandBar_data: string;
        commandBar_delete: string;
        commandBar_glossary: string;
        commandBar_highlight: string;
        commandBar_navigateBack: string;
        commandBar_open: string;
        commandBar_publishData: string;
        commandBar_searchResults: string;
        commandBar_show: string;
        confirmDeleteCatalogFormat: string;
        confirmDeleteSavedSearchFormat: string;
        confirmDeleteTitle: string;
        confirmMultipleDelete: string;
        confirmPreviewDelete: string;
        confirmPreviewDeleteTitle: string;
        confirmResetVisibilityBody: string;
        confirmResetVisibilityTitle: string;
        confirmSingleDelete: string;
        confirmUnrestrictAssetBody: string;
        confirmUnrestrictAssetTitle: string;
        congratulations: string;
        congratulationsMessage: string;
        connect: string;
        connectionInfo: string;
        connectionStringInfo: string;
        connectionStringPopover: string;
        connectionString_ado_net: string;
        connectionString_jdbc: string;
        connectionString_odbc: string;
        connectionString_oledb: string;
        connectionStrings: string;
        containedIn: string;
        containedInFormat: string;
        container: string;
        continueStr: string;
        contributedUsersLabel: string;
        copy: string;
        cosmos_: string;
        cosmos_stream: string;
        cosmos_streamset: string;
        cosmos_table: string;
        cosmos_view: string;
        createAndViewPortal: string;
        createCatalog: string;
        createManualEntry: string;
        createMoreAssets: string;
        creatingCatalog: string;
        currentFilters: string;
        currentSearch: string;
        dataCatalogName: string;
        dataProfile: string;
        dataSource: string;
        dataType: string;
        database: string;
        databaseName: string;
        datalake: string;
        datePublished: string;
        db2_database: string;
        db2_table: string;
        db2_view: string;
        defaultSearchTip: string;
        defaultStr: string;
        deleteCatalog: string;
        deleteCatalogSettingTitleFormat: string;
        deleteMultipleRowsMessageFormat: string;
        deleteRow: string;
        deleteRowsTitle: string;
        deleteSingleRowMessageFormat: string;
        deleteStr: string;
        demonstrateAzureDataCatalog: string;
        description: string;
        details: string;
        didYouKnow: string;
        discover: string;
        discoverButton: string;
        discoverDataMessage: string;
        discoverMicrosoftAssets: string;
        disjointLocationAccessWarningMessage: string;
        distinctValues: string;
        docs: string;
        documentation: string;
        domain: string;
        driver: string;
        duplicateColumnName: string;
        duplicatedUsersMessageFormat: string;
        edit: string;
        editSchema: string;
        enableGroupsLabel: string;
        encounteredError: string;
        encounteredErrorLong: string;
        enterSettingsHeader: string;
        error: string;
        errorAddingUsersCatalog: string;
        errorCreatingCatalog: string;
        errorDetails: string;
        errorFetchingColumnData: string;
        errorFetchingPreviewData: string;
        errorUpdatingCatalog: string;
        errorUpdatingUsersCatalog: string;
        everyone: string;
        excel: string;
        excel_: string;
        excel_1000: string;
        excel_1000_hive: string;
        excel_1000_teradata: string;
        exitEditSchema: string;
        expert: string;
        experts: string;
        experts_na: string;
        expiredSession: string;
        expiredSessionTitle: string;
        exploreContainerFormat: string;
        failedUsersMessageFormat: string;
        favorites: string;
        filesystem_file: string;
        filter: string;
        filters: string;
        folder: string;
        forum: string;
        freeEdition: string;
        freePricingTermsAssets: string;
        freePricingTermsUsers: string;
        friendlyName: string;
        from: string;
        fromExpert: string;
        fromYourData: string;
        ftp_directory: string;
        ftp_file: string;
        get: string;
        getADemo: string;
        getADemoBody: string;
        getADemoSubject: string;
        getAccessLongText: string;
        getSetupWith: string;
        getStartedLongText: string;
        giveFeedback: string;
        giveFeedbackBody: string;
        giveFeedbackSubject: string;
        hadoopdistributedfilesystem_cluster: string;
        hadoopdistributedfilesystem_directory: string;
        hadoopdistributedfilesystem_file: string;
        highlight: string;
        hive_database: string;
        hive_table: string;
        hive_view: string;
        home: string;
        homePageMessage1: string;
        homePageMessage2: string;
        http_endpoint: string;
        http_file: string;
        http_report: string;
        http_site: string;
        iAgreeToTheTerms: string;
        iWantTo: string;
        imageAlt: string;
        important: string;
        insertAbove: string;
        invalidAzureSubscription: string;
        invalidConnectionString: string;
        invalidLogin: string;
        invalidPricingUpdate: string;
        invalidUsersMessageFormat: string;
        itemName: string;
        kendo_editor_addColumnLeft: string;
        kendo_editor_addColumnRight: string;
        kendo_editor_addRowAbove: string;
        kendo_editor_addRowBelow: string;
        kendo_editor_arial: string;
        kendo_editor_backColor: string;
        kendo_editor_bold: string;
        kendo_editor_courierNew: string;
        kendo_editor_createLink: string;
        kendo_editor_createTable: string;
        kendo_editor_deleteColumn: string;
        kendo_editor_deleteFile: string;
        kendo_editor_deleteRow: string;
        kendo_editor_dialogButtonSeparator: string;
        kendo_editor_dialogCancel: string;
        kendo_editor_dialogInsert: string;
        kendo_editor_dialogUpdate: string;
        kendo_editor_directoryNotFound: string;
        kendo_editor_emptyFolder: string;
        kendo_editor_fileTitle: string;
        kendo_editor_fileWebAddress: string;
        kendo_editor_fontName: string;
        kendo_editor_fontNameInherit: string;
        kendo_editor_fontSize: string;
        kendo_editor_fontSizeInherit: string;
        kendo_editor_foreColor: string;
        kendo_editor_formatBlock: string;
        kendo_editor_formatting: string;
        kendo_editor_georgia: string;
        kendo_editor_heading1: string;
        kendo_editor_heading2: string;
        kendo_editor_heading3: string;
        kendo_editor_heading4: string;
        kendo_editor_heading5: string;
        kendo_editor_heading6: string;
        kendo_editor_imageAltText: string;
        kendo_editor_imageHeight: string;
        kendo_editor_imageWebAddress: string;
        kendo_editor_imageWidth: string;
        kendo_editor_impact: string;
        kendo_editor_indent: string;
        kendo_editor_insertFile: string;
        kendo_editor_insertHtml: string;
        kendo_editor_insertImage: string;
        kendo_editor_insertOrderedList: string;
        kendo_editor_insertUnorderedList: string;
        kendo_editor_invalidFileType: string;
        kendo_editor_italic: string;
        kendo_editor_justifyCenter: string;
        kendo_editor_justifyFull: string;
        kendo_editor_justifyLeft: string;
        kendo_editor_justifyRight: string;
        kendo_editor_linkOpenInNewWindow: string;
        kendo_editor_linkText: string;
        kendo_editor_linkToolTip: string;
        kendo_editor_linkWebAddress: string;
        kendo_editor_lucida: string;
        kendo_editor_orderBy: string;
        kendo_editor_orderByName: string;
        kendo_editor_orderBySize: string;
        kendo_editor_outdent: string;
        kendo_editor_overwriteFile: string;
        kendo_editor_paragraph: string;
        kendo_editor_quotation: string;
        kendo_editor_strikethrough: string;
        kendo_editor_style: string;
        kendo_editor_subscript: string;
        kendo_editor_superscript: string;
        kendo_editor_tahoma: string;
        kendo_editor_timesNewRoman: string;
        kendo_editor_trebuchetMS: string;
        kendo_editor_underline: string;
        kendo_editor_unlink: string;
        kendo_editor_uploadFile: string;
        kendo_editor_verdana: string;
        kendo_editor_viewHtml: string;
        kpi: string;
        lastRegistered: string;
        lastRegisteredBy: string;
        lastUpdated: string;
        lastUpdatedBy: string;
        launch: string;
        loadingLocations: string;
        loadingSubscriptions: string;
        locationDisclaimer: string;
        loggedInAs: string;
        loginServer: string;
        management: string;
        manualEntry: string;
        manualEntryInvalid: string;
        manualEntryTitle: string;
        maxLength: string;
        maximum: string;
        measure: string;
        message: string;
        minimum: string;
        model: string;
        modelName: string;
        moreValue: string;
        multiSelectedTextFormat: string;
        myAssets: string;
        myPins: string;
        mysql_database: string;
        mysql_table: string;
        mysql_view: string;
        name: string;
        next: string;
        noAccessLongText: string;
        noCommonColumns: string;
        noPreviewData: string;
        noResults: string;
        noSchema: string;
        noSubscriptionsFound: string;
        noTags: string;
        none: string;
        nullCount: string;
        nullable: string;
        numSelectedFormat: string;
        numberOfRows: string;
        objectName: string;
        objectType: string;
        objectType_na: string;
        objecttype_azurestorage: string;
        objecttype_blob: string;
        objecttype_cluster: string;
        objecttype_container: string;
        objecttype_database: string;
        objecttype_datalake: string;
        objecttype_dimension: string;
        objecttype_directory: string;
        objecttype_endpoint: string;
        objecttype_entitycontainer: string;
        objecttype_entityset: string;
        objecttype_file: string;
        objecttype_function: string;
        objecttype_kpi: string;
        objecttype_list: string;
        objecttype_measure: string;
        objecttype_model: string;
        objecttype_object: string;
        objecttype_other: string;
        objecttype_report: string;
        objecttype_server: string;
        objecttype_site: string;
        objecttype_table: string;
        objecttype_tablevaluedfunction: string;
        objecttype_view: string;
        odata_entitycontainer: string;
        odata_entityset: string;
        odata_function: string;
        odbc_database: string;
        odbc_table: string;
        odbc_view: string;
        ok: string;
        on: string;
        onAll: string;
        onSome: string;
        options: string;
        oracledatabase_database: string;
        oracledatabase_table: string;
        oracledatabase_view: string;
        originalRegistrationDate: string;
        other_connectionPlaceholderText: string;
        other_other: string;
        owners: string;
        ownersAndTheseUsers: string;
        package: string;
        path: string;
        pin: string;
        pinTilePopover: string;
        pleaseSaveOrCancel: string;
        pleaseTryAgain: string;
        popular_tags: string;
        port: string;
        postgresql_database: string;
        postgresql_table: string;
        postgresql_view: string;
        powerbi_: string;
        precision: string;
        preview: string;
        previous: string;
        pricing: string;
        pricingSettingTitle: string;
        privacyPlusTerms: string;
        privacyStatement: string;
        productName: string;
        properties: string;
        propertiesCountFormat: string;
        provisioningTenant: string;
        publish: string;
        publishBlurb: string;
        publishButton: string;
        publishDataMessage: string;
        publishMessage: string;
        publishersHoverText: string;
        recentAssets: string;
        recentTilePopover: string;
        registerMicrosoftAssets: string;
        relevance: string;
        removePreview: string;
        rename: string;
        reportingservices_: string;
        requestAccess: string;
        requestAccessBody: string;
        requestAccessEmailTooltipFormat: string;
        requestAccessMixedMessage: string;
        requestAccessPlaceholder: string;
        requestAccessSubject: string;
        requestAccessToAssetEmailBodyFormat: string;
        requestAccessToAssetEmailSubject: string;
        requestAccessToBatchAssetEmailBodyFormat: string;
        requestAccessToDataSource: string;
        requestAccessToMicrosoftDemoTenant: string;
        requestAccessToMicrosoftProductionCatalog: string;
        requestAccessTooltip: string;
        requestAccessTooltipFormat: string;
        requestAccessUrlToolTipFormat: string;
        requestAccessVerboseTooltip: string;
        required: string;
        resetQuery: string;
        resource: string;
        resultsPerPage: string;
        retry: string;
        rowDataLastUpdated: string;
        salesforce_object: string;
        saphana_server: string;
        saphana_view: string;
        save: string;
        saveAs: string;
        saveAsDefault: string;
        saveCatalog: string;
        saveErrorNotice: string;
        saveErrorTooLargeNoticeFormat: string;
        saveSearch: string;
        savedSearchTilePopover: string;
        savedSearches: string;
        scheduledForDelete: string;
        schema: string;
        schemaLastModified: string;
        schemaName: string;
        search: string;
        searchDataCatalog: string;
        searchTerm: string;
        searchTermMatchedIn: string;
        searchTerms: string;
        searches: string;
        securityGroupsWithDistributionListsErrorFormat: string;
        seeAll: string;
        seeAllCountFormat: string;
        seeLess: string;
        seeMore: string;
        selectAll: string;
        selectForDetails: string;
        selectForProperties: string;
        serverName: string;
        settingUpCatalog: string;
        settings: string;
        settingsForYourHeader: string;
        settingsLongText: string;
        sharepoint_list: string;
        signOut: string;
        somethingOfSomethingFormat: string;
        sortBy: string;
        sourceName: string;
        sourceType: string;
        sourceType_na: string;
        sourcetype_azuredatalakestore: string;
        sourcetype_azurestorage: string;
        sourcetype_cosmos: string;
        sourcetype_db2: string;
        sourcetype_filesystem: string;
        sourcetype_ftp: string;
        sourcetype_hadoopdistributedfilesystem: string;
        sourcetype_hive: string;
        sourcetype_http: string;
        sourcetype_id: string;
        sourcetype_mysql: string;
        sourcetype_odata: string;
        sourcetype_odbc: string;
        sourcetype_oracledatabase: string;
        sourcetype_other: string;
        sourcetype_postgresql: string;
        sourcetype_salesforce: string;
        sourcetype_saphana: string;
        sourcetype_sharepoint: string;
        sourcetype_sqldatawarehouse: string;
        sourcetype_sqlserver: string;
        sourcetype_sqlserveranalysisservices: string;
        sourcetype_sqlserveranalysisservices_editlabel: string;
        sourcetype_sqlserveranalysisservicesmultidimensional: string;
        sourcetype_sqlserveranalysisservicesmultidimensional_editlabel: string;
        sourcetype_sqlserverreportingservices: string;
        sourcetype_teradata: string;
        sourcetype_verbose_sqldatawarehouse: string;
        sourcetype_verbose_sqlserveranalysisservices: string;
        sourcetype_verbose_sqlserveranalysisservicesmultidimensional: string;
        sqldatawarehouse_database: string;
        sqldatawarehouse_table: string;
        sqldatawarehouse_view: string;
        sqlserver_database: string;
        sqlserver_table: string;
        sqlserver_tablevaluedfunction: string;
        sqlserver_view: string;
        sqlserveranalysisservices_dimension: string;
        sqlserveranalysisservices_table: string;
        sqlserveranalysisservicesmultidimensional_dimension: string;
        sqlserveranalysisservicesmultidimensional_kpi: string;
        sqlserveranalysisservicesmultidimensional_measure: string;
        sqlserveranalysisservicesmultidimensional_model: string;
        sqlserveranalysisservicestabular_dimension: string;
        sqlserveranalysisservicestabular_kpi: string;
        sqlserveranalysisservicestabular_measure: string;
        sqlserveranalysisservicestabular_model: string;
        sqlserveranalysisservicestabular_table: string;
        sqlserverreportingservices_report: string;
        sqlserverreportingservices_server: string;
        standardEdition: string;
        standardPricingTermsAssets: string;
        standardPricingTermsUsers: string;
        standardSkuRequired: string;
        stddev: string;
        subcriptionSuspendedHeaderLineOne: string;
        subcriptionSuspendedHeaderLineTwo: string;
        subcriptionSuspendedMessageLong: string;
        subscription: string;
        tableProfile: string;
        tableSize: string;
        tagAndExpertTooltip: string;
        tagAndExpertTooltipMultiple: string;
        tagMicrosoftAssets: string;
        tags: string;
        takeOwnership: string;
        teradata_database: string;
        teradata_table: string;
        teradata_view: string;
        termsOfUse: string;
        thisMonth: string;
        thisWeek: string;
        thisYear: string;
        today: string;
        topExpert: string;
        topObject: string;
        topSource: string;
        topTags: string;
        totalResultsFormat: string;
        totalUsersHoverText: string;
        tracingId: string;
        type: string;
        unauthorizedSubscription: string;
        unavailableVisibilityInfo: string;
        unitsUnitsFormat: string;
        unpin: string;
        unsupportedDslPropertyName: string;
        updatingCatalog: string;
        upgradeNotice: string;
        upgradeNow: string;
        url: string;
        user: string;
        userGroupsDisclaimer: string;
        userNameHere: string;
        usersAddedFormat: string;
        usersLabel: string;
        validEmailErrorMessage: string;
        version: string;
        view: string;
        viewConnectionStrings: string;
        viewSearchTermMatches: string;
        virtualCluster: string;
        visibility: string;
        weAreSorry: string;
        welcome: string;
        welcomeMessage: string;
        workInSharedDemoEnvironment: string;
        yourDataNow: string;
        yourPasswordHere: string;
    }
}
