// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "text!./browse.html", "css!./browse.css"], function (require, exports) {
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var manager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
    exports.template = require("text!./browse.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.searchResult = manager.searchResult;
            this.centerComponent = manager.centerComponent;
            this.rightComponent = this.getRightComponentName();
            logger.logInfo("viewing the browse page");
            var subscription = manager.multiSelected.subscribe(function () { return layoutManager.rightComponent(_this.getRightComponentName()); });
            this.dispose = function () { return subscription.dispose(); };
            layoutManager.centerComponent(this.centerComponent());
            manager.firstRun = false;
        }
        viewModel.prototype.getRightComponentName = function () {
            return manager.multiSelected().length > 1
                ? "datacatalog-browse-batchproperties"
                : "datacatalog-browse-properties";
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=browse.js.map