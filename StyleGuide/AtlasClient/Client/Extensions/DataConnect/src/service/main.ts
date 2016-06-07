/// <reference path="../References.d.ts" />

import config = require("./config");
import fx = Microsoft.DataStudio;

"use strict";

class DataConnectModule implements fx.Modules.DataStudioModule {
	public name = "datastudio-dataconnect";
    public moduleContext: fx.UxShell.ModuleContext;
	
    public initialize(moduleContext: fx.UxShell.ModuleContext): void {
		this.moduleContext = moduleContext;
        var configProxy = ko.mapping.fromJS(config.DataConnectConfig.moduleConfig);
        moduleContext.moduleConfig(configProxy);
	}

    getNotificationManager(): fx.Managers.INotificationManager {
        return null;
    }
}

ModuleCatalog.registerModule(new DataConnectModule());
