// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./connectionstringdisplay.html", "css!./connectionstringdisplay.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var ConnectionStringUtilities = Microsoft.DataStudio.DataCatalog.Core.ConnectionStringUtilities;
    var utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    exports.template = require("text!./connectionstringdisplay.html");
    var viewModel = (function () {
        function viewModel(params) {
            var _this = this;
            this.resx = resx;
            this.connectionString = ko.observable("");
            this.textFieldId = ko.observable("");
            this.label = ko.observable("");
            this.onCopy = function (d, e) {
                $("#" + _this.textFieldId()).select();
                document.execCommand("copy");
                var assetId = "";
                if (browseManager.selected()) {
                    assetId = browseManager.selected().__id;
                }
                logger.logInfo("Copy connection string button clicked", { data: { sourceType: _this.sourceType, driver: _this.driver, assetId: assetId } });
            };
            this.onStringCopied = function (d, e) {
                var assetId = "";
                if (browseManager.selected()) {
                    assetId = browseManager.selected().__id;
                }
                logger.logInfo("Connection string copied", { data: { sourceType: _this.sourceType, driver: _this.driver, assetId: assetId } });
                return true;
            };
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
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=connectionstringdisplay.js.map