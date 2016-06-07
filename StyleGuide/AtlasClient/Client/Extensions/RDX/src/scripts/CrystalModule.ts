/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.Crystal {

    export class CrystalModule implements Microsoft.DataStudio.Modules.DataStudioModule {

        name: string = "datastudio-rdx";

        public moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;

        initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void {

            this.moduleContext = moduleContext;

            var configProxy = ko.mapping.fromJS(Microsoft.DataStudio.Crystal.ConfigData.moduleConfig);
            moduleContext.moduleConfig(configProxy);
        }

        getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager {
            return null;
        }
    }
}
