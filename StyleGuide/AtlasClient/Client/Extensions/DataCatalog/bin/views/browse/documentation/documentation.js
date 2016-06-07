// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./documentation.html", "css!./documentation.css", "css!../../../styles/kendoStyles/kendo.common.min.css", "css!../../../styles/kendoStyles/kendo.common-office365.min.css", "css!../../../styles/kendoStyles/kendo.office365.min.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
    var catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
    exports.template = require("text!./documentation.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.selected = browseManager.selected;
            this.isChangingDocumentation = ko.observable(false);
            this.successChangingDocumentation = ko.observable(false);
            var beforeChange = function () {
                if (_this.isChangingDocumentation()) {
                    var editor = $("#browse-documentation-editor").data("kendoEditor");
                    editor && editor.keyboard.stopTyping();
                    editor && editor.keyboard.startTyping();
                    editor && editor.keyboard.stopTyping();
                    var value = editor && editor.value && editor.value();
                    _this.selected().documentation().content(value);
                    catalogService.updateDocumentation(_this.selected().__id, _this.selected().documentation(), function () { browseManager.rebindView(); });
                    _this.isChangingDocumentation(false);
                }
            };
            var selectedSubscription = browseManager.selected.subscribe(beforeChange, null, "beforeChange");
            var bottomPanelSubscription = detailsManager.activeComponent.subscribe(beforeChange, null, "beforeChange");
            this.dispose = function () {
                selectedSubscription.dispose();
                bottomPanelSubscription.dispose();
            };
        }
        viewModel.prototype.onContentChanged = function () {
            var _this = this;
            this.isChangingDocumentation(true);
            var deferred = catalogService.updateDocumentation(this.selected().__id, this.selected().documentation(), function () { browseManager.rebindView(); });
            deferred.always(function () {
                var success = deferred.state() === "resolved";
                _this.isChangingDocumentation(false);
                _this.successChangingDocumentation(success);
                if (success) {
                    _this.selected().metadataLastUpdated(new Date());
                    _this.selected().metadataLastUpdatedBy($tokyo.user.email);
                }
            });
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=documentation.js.map