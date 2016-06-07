/// <reference path="../../../references.d.ts" />
/// <reference path="./Environment.ts" />

module Microsoft.DataStudio.Application {
    export class ResourceConstantsImpl {
        public static AZURE_RESOURCE_URL = Microsoft.DataStudio.Application.Environment.getConstant("https://management.azure.com",
            {[Microsoft.DataStudio.Application.EnvironmentType.DOGFOOD]: "https://api-dogfood.resources.windows-int.net/"});
    }

    export class AuthConstants {
        public static AUTH_INSTANCE_URL: string = Microsoft.DataStudio.Application.Environment.getConstant("https://login.windows.net/",
            {[Microsoft.DataStudio.Application.EnvironmentType.DOGFOOD]: "https://login.windows-ppe.net/"});
        public static AUTH_CLIENTID: string = "16f9b8e9-d20b-45a1-ab9e-db2e8254508b";
        public static AUTH_TENANT: string = "common";
        public static AUTH_SIGNOUT_URL: string = "";
        public static AUTH_STORAGE_MODE: string = "sessionStorage";
        public static AUTH_RESOURCE_NAME: string = "https://management.core.windows.net/";

        public static AUTH_SUCCESS_POSTLOGIN_PAGE: string = "";
        public static AUTH_FAILURE_POSTLOGIN_PAGE: string = "";

    }
}

// TODO remove contracts so we don't need anything like this anymore
Microsoft.DataStudio.Application.ResourceConstants = Microsoft.DataStudio.Application.ResourceConstantsImpl;