// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./batchschema.html" />
/// <amd-dependency path="css!./batchschema.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import batchSchemaManager = Microsoft.DataStudio.DataCatalog.Managers.BatchSchemaManager
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;

export var template: string = require("text!./batchschema.html");

export class viewModel {
    resx = resx;
    multiSelected = browseManager.multiSelected;
    snapshot = batchSchemaManager.snapshot;

    private dispose: () => void;

    constructor() {
        batchSchemaManager.init();

        var subscription = browseManager.multiSelected.subscribe(() => {
            // Setup snapshots for comparing during commit
            if (browseManager.multiSelected().length > 1) {
                // This is batch properties so don't do any work we don't need to
                batchSchemaManager.init();
            }
        });

        this.setupHorizontalScrolling();
        var scrollingSubscription = this.multiSelected.subscribe(() => {
            this.setupHorizontalScrolling();
        });

        this.dispose = () => {
            subscription.dispose();
            scrollingSubscription.dispose();
        };
    }

    private setupHorizontalScrolling() {
        setTimeout(() => {
            $(".scrollable-table.content").scroll(function() {
                var l = $(".scrollable-table.content table").position().left;
                $(".scrollable-table.header").css("left", l - parseInt($(this).css("paddingLeft"),10));
            });
        });
    }
}