// <reference path="../../../References.d.ts" />
// <reference path="../../../../bin/Module.d.ts" />
// <reference path="../BaseBrowseResultsViewModel.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "knockout", "../BaseBrowseResultsViewModel", "text!./container.html", "css!./container.css"], function (require, exports, ko, BaseBrowseResultsViewModel) {
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./container.html");
    var viewModel = (function (_super) {
        __extends(viewModel, _super);
        function viewModel() {
            _super.apply(this, arguments);
            this.resx = resx;
            this.util = util;
            this.container = browseManager.container;
            this.isSearching = browseManager.isSearching;
            this.objectTypes = ko.pureComputed(function () {
                var filterTypes = browseManager.filterTypes();
                var searchResult = browseManager.searchResult();
                if (filterTypes && searchResult.totalResults > 1) {
                    var group = browseManager.filterTypes().findGroup("objectType");
                    return group ? group.items : [];
                }
                return [];
            });
        }
        viewModel.prototype.backToCatalog = function () {
            browseManager.returnFromContainer();
        };
        return viewModel;
    })(BaseBrowseResultsViewModel.BaseBrowseResultsViewModel);
    exports.viewModel = viewModel;
});
//# sourceMappingURL=container.js.map