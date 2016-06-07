/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.DesignGuide {

    export class DesignGuideModule implements Microsoft.DataStudio.Modules.DataStudioModule {

        name: string = "datastudio-designguide";

        public moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;

        initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void {

            this.moduleContext = moduleContext;
            var configProxy = ko.mapping.fromJS(Microsoft.DataStudio.DesignGuide.ConfigData.moduleConfig);
            moduleContext.moduleConfig(configProxy);
        }

        getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager {
            return null;
        }
    }
}
