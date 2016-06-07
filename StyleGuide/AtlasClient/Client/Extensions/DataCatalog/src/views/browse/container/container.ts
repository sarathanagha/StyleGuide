// <reference path="../../../References.d.ts" />
// <reference path="../../../../bin/Module.d.ts" />
// <reference path="../BaseBrowseResultsViewModel.ts" />

/// <amd-dependency path="text!./container.html" />
/// <amd-dependency path="css!./container.css" />

import ko = require("knockout");
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import BaseBrowseResultsViewModel = require("../BaseBrowseResultsViewModel");

export var template: string = require("text!./container.html");

export class viewModel extends BaseBrowseResultsViewModel.BaseBrowseResultsViewModel {
    public resx = resx;
    public util = util;

    public container = browseManager.container;
    public isSearching = browseManager.isSearching;

    public objectTypes = ko.pureComputed<Microsoft.DataStudio.DataCatalog.Interfaces.IFilterItem[]>(() => {
        var filterTypes = browseManager.filterTypes();
        var searchResult = browseManager.searchResult();
        if (filterTypes && searchResult.totalResults > 1) {
            var group = browseManager.filterTypes().findGroup("objectType");
            return group ? group.items : [];
        }
        return [];
    });

    public backToCatalog() {
        browseManager.returnFromContainer();
    }
}