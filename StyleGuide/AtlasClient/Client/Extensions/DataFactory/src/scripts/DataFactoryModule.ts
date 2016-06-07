/// <reference path="../References.d.ts" />

import DataFactoryConfig = require("./Config/DataFactoryConfig");
import NotificationManager = require("./Managers/NotificationManager");

export = DataFactoryModule;

class DataFactoryModule implements Microsoft.DataStudio.Modules.DataStudioModule {
    name: string = "datastudio-datafactory";

    public moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;

    private notificationManager: Microsoft.DataStudio.Managers.INotificationManager = null;

    // TODO consider changing to initializeAsync(...)
    initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void {
        // TODO Consider move this init logic to DataStudio and make WinJS first-class citizen so all modules can use it.
        WinJS.Application.start();

        this.moduleContext = moduleContext;

        let configProxy = ko.mapping.fromJS(DataFactoryConfig.ConfigData.moduleConfig);
        this.moduleContext.moduleConfig(configProxy);
    }

    getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager {
        if (this.notificationManager == null) {
            this.notificationManager = NotificationManager.createNotificationManager(null);
        }

        return this.notificationManager;
    }
}
