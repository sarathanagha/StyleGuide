module Microsoft.DataStudio.Modules {

    export interface ModuleCatalog {

        getModule(moduleName: string): DataStudioModule;

        getModules(): DataStudioModule[];

        getModuleRootUrl(moduleName: string): string;

        isModuleRegistered(moduleName: string): boolean;

        registerModule(moduleInstance: DataStudioModule): void;
    }
}
