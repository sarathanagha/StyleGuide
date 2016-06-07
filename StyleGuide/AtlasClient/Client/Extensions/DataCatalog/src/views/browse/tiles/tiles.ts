// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
// <reference path="../BaseBrowseResultsViewModel.ts" />

/// <amd-dependency path="text!./tiles.html" />
/// <amd-dependency path="css!./tiles.css" />

import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import connectService = Microsoft.DataStudio.DataCatalog.Services.ConnectService;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;
import BaseViewModels = require("../BaseBrowseResultsViewModel");

export var template: string = require("text!./tiles.html");

export class viewModel extends BaseViewModels.BaseBrowseResultsViewModel {
    plainText = util.plainText;
    removeHtmlTags = util.removeHtmlTags;

    test = resx;

    formatContainedIn(dataEntity: Interfaces.IBindableDataEntity) {
        var containerTypeName = dataEntity.getContainerName();
        return util.stringFormat(resx.containedInFormat, containerTypeName);
    }

    getConnectionTypes(dataEntity: Interfaces.IBindableDataEntity) {
        return connectService.getConnectionTypes(dataEntity);
    }

    connect(dataEntity: Interfaces.IBindableDataEntity, data: Interfaces.IConnectApplication) {
        connectService.connect(dataEntity, data);
    }

    showPropertyMatches(dataEntity: Interfaces.IBindableDataEntity) {
        browseManager.multiSelected([dataEntity]);
        layoutManager.rightExpanded(true);
        layoutManager.bottomExpanded(false);
    }

    showColumnMatches(dataEntity: Interfaces.IBindableDataEntity) {
        browseManager.multiSelected([dataEntity]);
        detailsManager.showSchema();
        layoutManager.rightExpanded(false);
        layoutManager.bottomExpanded(true);
    }
}