// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "text!./batchschema.html", "css!./batchschema.css"], function (require, exports) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var batchSchemaManager = Microsoft.DataStudio.DataCatalog.Managers.BatchSchemaManager;
    exports.template = require("text!./batchschema.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.multiSelected = browseManager.multiSelected;
            this.snapshot = batchSchemaManager.snapshot;
            batchSchemaManager.init();
            var subscription = browseManager.multiSelected.subscribe(function () {
                // Setup snapshots for comparing during commit
                if (browseManager.multiSelected().length > 1) {
                    // This is batch properties so don't do any work we don't need to
                    batchSchemaManager.init();
                }
            });
            this.setupHorizontalScrolling();
            var scrollingSubscription = this.multiSelected.subscribe(function () {
                _this.setupHorizontalScrolling();
            });
            this.dispose = function () {
                subscription.dispose();
                scrollingSubscription.dispose();
            };
        }
        viewModel.prototype.setupHorizontalScrolling = function () {
            setTimeout(function () {
                $(".scrollable-table.content").scroll(function () {
                    var l = $(".scrollable-table.content table").position().left;
                    $(".scrollable-table.header").css("left", l - parseInt($(this).css("paddingLeft"), 10));
                });
            });
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=batchschema.js.map