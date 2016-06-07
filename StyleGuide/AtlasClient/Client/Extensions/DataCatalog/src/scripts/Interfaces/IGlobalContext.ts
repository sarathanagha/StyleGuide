module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IAuthenicatedUser {
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

    export interface IAppInfo {
        version: string;
        sessionUuid: string;
        authenticationSessionUuid: string;
        catalogApiVersionString: string;
        searchApiVersionString: string;
    }

    export interface ILoggingInfo {
        level: number;
        enabled: boolean;
    }

    export interface IServerConstants {
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

    export interface IGlobalContext {
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