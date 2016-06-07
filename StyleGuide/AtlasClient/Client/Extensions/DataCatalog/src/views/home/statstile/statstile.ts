// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./statstile.html" />
/// <amd-dependency path="css!./statstile.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./statstile.html");

export class viewModel {
    resx = resx;

    stats = ko.observableArray<Interfaces.IHomeStatsListItem>([]);

    constructor(params: Interfaces.IHomeStatsList) {
        this.stats = params.items;
        homeManager.statsLabel(resx.didYouKnow);
    }

}