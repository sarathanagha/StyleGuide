// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "text!./details.html", "css!./details.css"], function (require, exports) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
    var layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
    exports.template = require("text!./details.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.resx = resx;
            this.selected = browseManager.selected;
            this.multiSelected = browseManager.multiSelected;
            this.activeComponent = detailsManager.activeComponent;
            this.detailsManager = detailsManager;
            var selectedSubscription = this.selected.subscribe(function () {
                // Return to "read only" display when selecting a new asset.
                if (_this.activeComponent() === "datacatalog-browse-editschema") {
                    _this.activeComponent("datacatalog-browse-schema");
                }
            });
            this.dispose = function () {
                selectedSubscription.dispose();
            };
        }
        viewModel.prototype.updateDetails = function (componentName, data, event) {
            logger.logInfo("updating to see " + componentName + " from bottom panel");
            layoutManager.bottomExpanded(this.activeComponent() !== componentName || !layoutManager.bottomExpanded());
            this.activeComponent(componentName);
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=details.js.map