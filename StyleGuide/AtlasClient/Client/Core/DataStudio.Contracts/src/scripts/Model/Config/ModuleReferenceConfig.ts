/// <reference path="../../references.ts" />

module Microsoft.DataStudio.Model.Config {

    export interface ModulePackageConfig {
        name: string;
        location: string;
        main: string;
        resxPath?: string;
    }
}
