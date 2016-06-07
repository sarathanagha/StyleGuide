/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.SolutionAccelerator {

    export class SolutionAcceleratorModule implements Microsoft.DataStudio.Modules.DataStudioModule {

        name: string = "datastudio-solutionaccelerator";

        public moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;

        initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void {

            this.moduleContext = moduleContext;
            var configProxy = ko.mapping.fromJS(Microsoft.DataStudio.SolutionAccelerator.ConfigData.moduleConfig);
            moduleContext.moduleConfig(configProxy);
        }

        getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager {
            return null;
        }
    }
}
