declare module Microsoft.DataStudio.Application {
    var EnvironmentType: {
        DOGFOOD: number;
        CATFOOD: number;
        PRODUCTION: number;
    };

    var Environment: {
        getConstant: (defaultConstant: string, map: { [environmentType: number]: string }) => string;
        getAPIUrl: (method: string, useExternal: boolean) => string;
    };

    var ResourceConstants: {
        AZURE_RESOURCE_URL: string;
    };
}

// We need this as a global variable so we can set it before any DataStudio scripts are loaded
declare var MICROSOFT_DATASTUDIO_CURRENT_ENVIRONMENT: string;