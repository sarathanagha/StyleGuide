/// <reference path="./references.d.ts" />
module Microsoft.DataStudio.Studio {

    export class StudioModule implements Microsoft.DataStudio.Modules.DataStudioModule {

        name: string = "datastudio-studio";

        public moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;

        // TODO consider changing to initializeAsync(...)
        initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void {

            this.moduleContext = moduleContext;
            var configProxy = ko.mapping.fromJS(Microsoft.DataStudio.Studio.ConfigData.moduleConfig);
            moduleContext.moduleConfig(configProxy);
        }

        getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager {
            return null;
        }
    }
}

/**
 * Register module in ModuleCatalog.
 */
var moduleInstance = new Microsoft.DataStudio.Studio.StudioModule();
ModuleCatalog.registerModule(moduleInstance);
