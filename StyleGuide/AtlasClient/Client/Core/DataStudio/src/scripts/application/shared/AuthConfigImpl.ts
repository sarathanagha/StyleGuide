/// <reference path="../../../references.d.ts" />
module Microsoft.DataStudio.Application {
    export class AuthConfigImpl implements IAdalConfigEntry {
        constructor(
            public instance: string, 
            public clientId: string, 
            public tenant: string,
            public redirectUri: string, 
            public postLogoutRedirectUri: string, 
            public cacheLocation: string) {
        }
    }
}