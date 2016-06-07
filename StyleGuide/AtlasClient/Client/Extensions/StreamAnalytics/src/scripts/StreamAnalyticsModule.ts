/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.StreamAnalytics {

    export class StreamAnalyticsModule implements Microsoft.DataStudio.Modules.DataStudioModule {

        name: string = "datastudio-streamanalytics";

        public moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;

        initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void {

            this.moduleContext = moduleContext;

            var configProxy = ko.mapping.fromJS(Microsoft.DataStudio.StreamAnalytics.ConfigData.moduleConfig);
            moduleContext.moduleConfig(configProxy);
        }

        getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager {
            return null;
        }
    }
}
