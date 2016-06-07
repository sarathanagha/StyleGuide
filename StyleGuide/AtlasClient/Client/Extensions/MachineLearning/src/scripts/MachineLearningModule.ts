/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.MachineLearning {

    export class MachineLearningModule implements Microsoft.DataStudio.Modules.DataStudioModule {

        name: string = "datastudio-machinelearning";

        public moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;

        initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void {

            this.moduleContext = moduleContext;
            var configProxy = ko.mapping.fromJS(Microsoft.DataStudio.MachineLearning.ConfigData.moduleConfig);
            moduleContext.moduleConfig(configProxy);
        }

        getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager {
            return null;
        }
    }
}
