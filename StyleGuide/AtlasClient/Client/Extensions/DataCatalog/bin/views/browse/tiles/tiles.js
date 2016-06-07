// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
// <reference path="../BaseBrowseResultsViewModel.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../BaseBrowseResultsViewModel", "text!./tiles.html", "css!./tiles.css"], function (require, exports, BaseViewModels) {
    /// <amd-dependency path="text!./tiles.html" />
    /// <amd-dependency path="css!./tiles.css" />
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var connectService = Microsoft.DataStudio.DataCatalog.Services.ConnectService;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
    var detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    exports.template = require("text!./tiles.html");
    var viewModel = (function (_super) {
        __extends(viewModel, _super);
        function viewModel() {
            _super.apply(this, arguments);
            this.plainText = util.plainText;
            this.removeHtmlTags = util.removeHtmlTags;
            this.test = resx;
        }
        viewModel.prototype.formatContainedIn = function (dataEntity) {
            var containerTypeName = dataEntity.getContainerName();
            return util.stringFormat(resx.containedInFormat, containerTypeName);
        };
        viewModel.prototype.getConnectionTypes = function (dataEntity) {
            return connectService.getConnectionTypes(dataEntity);
        };
        viewModel.prototype.connect = function (dataEntity, data) {
            connectService.connect(dataEntity, data);
        };
        viewModel.prototype.showPropertyMatches = function (dataEntity) {
            browseManager.multiSelected([dataEntity]);
            layoutManager.rightExpanded(true);
            layoutManager.bottomExpanded(false);
        };
        viewModel.prototype.showColumnMatches = function (dataEntity) {
            browseManager.multiSelected([dataEntity]);
            detailsManager.showSchema();
            layoutManager.rightExpanded(false);
            layoutManager.bottomExpanded(true);
        };
        return viewModel;
    })(BaseViewModels.BaseBrowseResultsViewModel);
    exports.viewModel = viewModel;
});
//# sourceMappingURL=tiles.js.map