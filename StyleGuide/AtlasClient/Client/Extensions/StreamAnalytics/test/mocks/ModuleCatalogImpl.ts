/// <reference path="../references.d.ts" />

module Microsoft.DataStudio.Modules {

    export class ModuleCatalogImpl implements ModuleCatalog {

        private _modules: { [index: string]: DataStudioModule; } = {};

        public getModule(moduleName: string): DataStudioModule {

            if (this._modules.hasOwnProperty(moduleName)) {
                return this._modules[moduleName];
            } else {
                return null;
            }
        }

        public getModules(): DataStudioModule[] {

            var modules: DataStudioModule[] = [];

            for (var moduleName in this._modules) {
                if (this.isModuleRegistered(moduleName)) {
                    modules.push(this._modules[moduleName]);
                }
            }

            return modules;
        }

        public getModuleRootUrl(moduleName: string): string {
            var moduleEntryPoint: string = require.toUrl(moduleName+"/1.js");
            if (moduleEntryPoint.indexOf("./") === 0) {
                moduleEntryPoint = moduleEntryPoint.slice(2);
            }

            var lastSlashIndex: number = moduleEntryPoint.lastIndexOf("/");

            if (lastSlashIndex > 0) {
                moduleEntryPoint = moduleEntryPoint.slice(0,lastSlashIndex+1);
            }

            return moduleEntryPoint;
        }

        public isModuleRegistered(moduleName: string): boolean {
            return this._modules.hasOwnProperty(moduleName);
        }

        public registerModule(moduleInstance: DataStudioModule): void {

            var logger = {
                logError: function(args) {
                },
                logInfo: function(args) {
                }
            };

            if (!moduleInstance) {
                logger.logError("Module registration failed: null reference");
                return;
            }

            if (this._modules.hasOwnProperty(moduleInstance.name)) {
                logger.logError("Module registration failed: module '" + moduleInstance.name + "' has been already registered");
                return;
            }

            this._modules[moduleInstance.name] = moduleInstance;

            logger.logInfo("Module registered: " + moduleInstance.name);
        }
    }
}

ModuleCatalog = new Microsoft.DataStudio.Modules.ModuleCatalogImpl();