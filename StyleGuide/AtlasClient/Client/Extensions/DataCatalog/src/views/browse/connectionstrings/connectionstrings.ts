// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./connectionstrings.html" />
/// <amd-dependency path="css!./connectionstrings.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import SourceTypes = Microsoft.DataStudio.DataCatalog.Core.SourceTypes;
import IConnectionString = Microsoft.DataStudio.DataCatalog.Interfaces.IConnectionString;

export var template: string = require("text!./connectionstrings.html");

export class viewModel {
    resx = resx;

    sourceType: string;

    connectionStrings = ko.pureComputed<Array<IConnectionString>>(() => {
        var strings: Array<IConnectionString> = [];
        if (browseManager.selected() && browseManager.selected().dataSource) {
            strings = SourceTypes.getConnectionStrings(browseManager.selected().dataSource.sourceType) || [];
            this.sourceType = browseManager.selected().dataSource.sourceType;
        }
        return strings;
    });
}