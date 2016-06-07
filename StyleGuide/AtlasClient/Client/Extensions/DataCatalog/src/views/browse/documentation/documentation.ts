// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./documentation.html" />
/// <amd-dependency path="css!./documentation.css" />

// Load Kendo Styles
/// <amd-dependency path="css!../../../styles/kendoStyles/kendo.common.min.css" />
/// <amd-dependency path="css!../../../styles/kendoStyles/kendo.common-office365.min.css" />
/// <amd-dependency path="css!../../../styles/kendoStyles/kendo.office365.min.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./documentation.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;
    selected = browseManager.selected;

    isChangingDocumentation: KnockoutObservable<boolean>;
    successChangingDocumentation: KnockoutObservable<boolean>;

    constructor() {
        this.isChangingDocumentation = ko.observable<boolean>(false);
        this.successChangingDocumentation = ko.observable<boolean>(false);

        var beforeChange = () => {
            if (this.isChangingDocumentation()) {
                var editor = <any>$("#browse-documentation-editor").data("kendoEditor");
                editor && editor.keyboard.stopTyping();
                editor && editor.keyboard.startTyping();
                editor && editor.keyboard.stopTyping();
                var value = editor && editor.value && editor.value();
                this.selected().documentation().content(value);
                catalogService.updateDocumentation(this.selected().__id, this.selected().documentation(), () => { browseManager.rebindView(); });
                this.isChangingDocumentation(false);
            }
        };

        var selectedSubscription = browseManager.selected.subscribe(beforeChange, null, "beforeChange");
        var bottomPanelSubscription = detailsManager.activeComponent.subscribe(beforeChange, null, "beforeChange");

        this.dispose = () => {
            selectedSubscription.dispose();
            bottomPanelSubscription.dispose();
        };
    }

    onContentChanged() {
        this.isChangingDocumentation(true);
        var deferred = catalogService.updateDocumentation(this.selected().__id, this.selected().documentation(), () => { browseManager.rebindView(); });
        deferred.always(() => {
            var success = deferred.state() === "resolved";
            this.isChangingDocumentation(false);
            this.successChangingDocumentation(success);
            if (success) {
                this.selected().metadataLastUpdated(new Date());
                this.selected().metadataLastUpdatedBy($tokyo.user.email);
            }
        });
    }

}