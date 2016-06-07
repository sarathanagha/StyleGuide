/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.DataCatalog {

    export class DataCatalogModule implements Microsoft.DataStudio.Modules.DataStudioModule {

        name: string = "datastudio-datacatalog";

        public moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;

        initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void {

            this.moduleContext = moduleContext;
            var configProxy = ko.mapping.fromJS(Microsoft.DataStudio.DataCatalog.ConfigData.moduleConfig);
            moduleContext.moduleConfig(configProxy);
        }

        getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager {
            return null;
        }
    }
}
