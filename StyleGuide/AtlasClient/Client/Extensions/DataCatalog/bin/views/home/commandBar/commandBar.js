// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "text!./commandBar.html", "css!./commandBar.css"], function (require, exports) {
    /// <amd-dependency path="text!./commandBar.html" />
    /// <amd-dependency path="css!./commandBar.css" />
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var router = Microsoft.DataStudio.Application.Router;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
    var focusManager = Microsoft.DataStudio.DataCatalog.Managers.FocusManager;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    exports.template = require("text!./commandBar.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.searchTerm = browseManager.searchText;
            this.resx = resx;
            this.id = "home-commandbar";
            this.onSectionSelect = function (d, e) {
                var key = e.which || e.keyCode;
                if (util.isSelectAction(e)) {
                    focusManager.setContainerInteractive(_this.id);
                }
                else if (key === constants.KeyCodes.ESCAPE) {
                    focusManager.resetContianer();
                }
            };
            this.isSelectedSection = ko.pureComputed(function () {
                return focusManager.selected() === _this.id;
            });
            this.redirectToPublishUrl = function () {
                logger.logInfo("launch publisher button");
                window.location.assign($tokyo.publishingLink);
            };
            this.openManualEntry = function () {
                logger.logInfo("open manual entry dialog");
                var buttons = [
                    { id: "create-more", isDefault: false, text: resx.createMoreAssets },
                    { id: "navigate", isDefault: false, text: resx.createAndViewPortal }
                ];
                modalService.show({ title: resx.manualEntryTitle, component: "datacatalog-publish-manualentry", modalContainerClass: 'datacatalog-manualentry-modal-override', buttons: buttons }).done(function (modal) {
                    _this.resolveManualEntry(modal);
                });
            };
            var publishItems = [
                { label: util.stringCapitalize(this.resx.launch), value: null, action: this.redirectToPublishUrl },
                { label: util.stringCapitalize(this.resx.manualEntry), value: null, action: this.openManualEntry },
            ];
            this.selectedPublishOption = ko.observable(null);
            this.publishOptions = {
                options: publishItems,
                selected: this.selectedPublishOption
            };
        }
        viewModel.prototype.doSearch = function () {
            if (this.searchTerm().length > 0) {
                browseManager.doSearch({ resetPage: true });
                router.navigate("datacatalog/browse/?searchTerms=" + this.searchTerm());
            }
        };
        viewModel.prototype.resolveManualEntry = function (modal) {
            var _this = this;
            logger.logInfo("resolve manual entry dialog");
            var entry = ko.dataFor(document.getElementById("manual-entry"));
            if (entry.isValid()) {
                entry.submitEntry().done(function (id) {
                    if (modal.button() === "navigate") {
                        var time = entry.assetCreatedTime.toLocaleDateString();
                        var searchTerm = util.stringFormat("upn={0} AND lastRegisteredTime > '{1}'", $tokyo.user.upn, time);
                        modal.close();
                        browseManager.searchText(searchTerm);
                        browseManager.doSearch().done(function () {
                            router.navigate("datacatalog/browse/?searchTerms=" + searchTerm);
                        });
                    }
                    else if (modal.button() === "create-more") {
                        modal.reset().done(function (rModal) {
                            _this.resolveManualEntry(rModal);
                        });
                    }
                    else {
                        logger.logInfo("cancel manual entry dialog");
                        modal.close();
                    }
                });
            }
            else {
                modal.reset().done(function (rModal) {
                    _this.resolveManualEntry(rModal);
                });
            }
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=commandBar.js.map