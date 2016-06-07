/// <reference path="../../../references.d.ts" />

module Microsoft.DataStudio.Application {
    export enum EnvironmentTypeImpl {
        // INT/PPE client and backend
        DOGFOOD = 0,
        // PROD staging client (not exposed to users) with PROD backend
        CATFOOD = 1,
        // PROD client and backend
        PRODUCTION = 2
    }

    export class EnvironmentImpl {
        private static Current: EnvironmentTypeImpl = null;
        private static CurrentEndpoint: string = null;

        public static getAPIUrl = (method: string, useExternal: boolean) => {
            if (EnvironmentImpl.CurrentEndpoint === null) {
                // For calls to the same domain, CurrentEndpoint is blank
               EnvironmentImpl.CurrentEndpoint = useExternal ?
                    EnvironmentImpl.getConstant("https://AtlasPlatformAPI.cloudapp.net", {
                        [EnvironmentTypeImpl.DOGFOOD]: "https://AtlasPlatformAPIInt.cloudapp.net",
                        [EnvironmentTypeImpl.CATFOOD]: "https://AtlasPlatformAPITest.cloudapp.net"
                    }) : "";
            }

            return EnvironmentImpl.CurrentEndpoint + "/api/" + method;
        };

        public static getConstant = (defaultConstant: string, map: { [environmentType: number]: string }) => {
            return map[EnvironmentImpl.getCurrent()] || defaultConstant;
        };

        private static getCurrent = () => {
            if (EnvironmentImpl.Current === null) {
                EnvironmentImpl.Current = EnvironmentTypeImpl[MICROSOFT_DATASTUDIO_CURRENT_ENVIRONMENT];
                if (typeof EnvironmentImpl.Current === "undefined") {
                    EnvironmentImpl.Current = EnvironmentTypeImpl.PRODUCTION;
                }
            }
            return EnvironmentImpl.Current;
        };
    }
}

// TODO remove contracts so we don't need anything like this anymore
Microsoft.DataStudio.Application.Environment = Microsoft.DataStudio.Application.EnvironmentImpl;
Microsoft.DataStudio.Application.EnvironmentType = Microsoft.DataStudio.Application.EnvironmentTypeImpl; 