// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./browse.html" />
/// <amd-dependency path="css!./browse.css" />

import ko = require("knockout");
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import manager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;

export var template: string = require("text!./browse.html");

export class viewModel {
    private dispose: () => void;

    resx = resx;
    searchResult = manager.searchResult;
    centerComponent = manager.centerComponent;

    constructor() {
        logger.logInfo("viewing the browse page");

        var subscription = manager.multiSelected.subscribe(() => layoutManager.rightComponent(this.getRightComponentName()));

        this.dispose = () => subscription.dispose();

        layoutManager.centerComponent(this.centerComponent());
        manager.firstRun = false;
    }

    rightComponent = this.getRightComponentName();

    private getRightComponentName() {
        return manager.multiSelected().length > 1
            ? "datacatalog-browse-batchproperties"
            : "datacatalog-browse-properties";
    }
}