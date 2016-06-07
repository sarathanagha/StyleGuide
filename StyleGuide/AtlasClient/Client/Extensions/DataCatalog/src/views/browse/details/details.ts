// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./details.html" />
/// <amd-dependency path="css!./details.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;

export var template: string = require("text!./details.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;
    selected = browseManager.selected;
    multiSelected = browseManager.multiSelected;
    activeComponent = detailsManager.activeComponent;
    detailsManager = detailsManager;

    constructor(parameters: any) {
        var selectedSubscription = this.selected.subscribe(() => {
            // Return to "read only" display when selecting a new asset.
            if (this.activeComponent() === "datacatalog-browse-editschema") {
                this.activeComponent("datacatalog-browse-schema");
            }
        });

        this.dispose = () => {
            selectedSubscription.dispose();
        };
    }

    updateDetails(componentName: string, data: any, event: Event) {
        logger.logInfo("updating to see " + componentName + " from bottom panel");
        layoutManager.bottomExpanded(this.activeComponent() !== componentName || !layoutManager.bottomExpanded());
        this.activeComponent(componentName);
    }
}