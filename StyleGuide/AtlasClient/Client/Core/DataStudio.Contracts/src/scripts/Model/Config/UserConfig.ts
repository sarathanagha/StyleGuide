/// <reference path="../../references.ts" />

module Microsoft.DataStudio.Model.Config {

    export interface ShellConfig {
        defaultModuleName: string;
        shellName?: string;
        modules: Microsoft.DataStudio.Model.Config.ModulePackageConfig[];
        useExternalAPI?: boolean;
    }
}
