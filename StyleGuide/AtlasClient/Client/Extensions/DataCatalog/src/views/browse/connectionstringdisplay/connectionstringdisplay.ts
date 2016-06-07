// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./connectionstringdisplay.html" />
/// <amd-dependency path="css!./connectionstringdisplay.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import ConnectionStringUtilities = Microsoft.DataStudio.DataCatalog.Core.ConnectionStringUtilities;
import utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./connectionstringdisplay.html");

export class viewModel {
    resx = resx;

    connectionString = ko.observable<string>("");
    textFieldId = ko.observable<string>("");
    label = ko.observable<string>("");

    private driver: string;
    private sourceType: string;

    constructor(params: Interfaces.IConnectionStringParams) {
        this.textFieldId(utilities.createID());
        if (browseManager.selected()) {
            try {
                var connection = ConnectionStringUtilities.parse(params.baseString, browseManager.selected());
                this.connectionString(connection);
            }
            catch (e) {
                logger.logWarning("Connection string was formatted incorrectly", { data: { connectionString: params.baseString, message: e.message } });
                this.connectionString(resx.invalidConnectionString);
            }
        }
        this.label(params.label);
        this.driver = params.driver;
        this.sourceType = params.sourceType;
    }

    onCopy = (d, e) => {
        $("#" + this.textFieldId()).select();
        document.execCommand("copy");
        var assetId = "";
        if (browseManager.selected()) {
            assetId = browseManager.selected().__id;
        }
        logger.logInfo("Copy connection string button clicked", { data: { sourceType: this.sourceType, driver: this.driver, assetId: assetId } });
    }

    onStringCopied = (d, e) => {
        var assetId = "";
        if (browseManager.selected()) {
            assetId = browseManager.selected().__id;
        }
        logger.logInfo("Connection string copied", { data: { sourceType: this.sourceType, driver: this.driver, assetId: assetId } });
        return true;
    }
}