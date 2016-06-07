// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./connectionstrings.html", "css!./connectionstrings.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var SourceTypes = Microsoft.DataStudio.DataCatalog.Core.SourceTypes;
    exports.template = require("text!./connectionstrings.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.connectionStrings = ko.pureComputed(function () {
                var strings = [];
                if (browseManager.selected() && browseManager.selected().dataSource) {
                    strings = SourceTypes.getConnectionStrings(browseManager.selected().dataSource.sourceType) || [];
                    _this.sourceType = browseManager.selected().dataSource.sourceType;
                }
                return strings;
            });
        }
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=connectionstrings.js.map