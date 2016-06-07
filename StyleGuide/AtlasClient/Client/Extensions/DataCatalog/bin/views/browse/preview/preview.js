// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./preview.html", "css!./preview.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
    var catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./preview.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.resx = resx;
            this.selected = browseManager.selected;
            this.previewData = ko.observable();
            this.errorFetchingPreviewData = ko.observable(false);
            this.fetchPreviewData();
            this.setupHorizontalScrolling();
            var subscription = this.selected.subscribe(function () {
                _this.fetchPreviewData();
                _this.setupHorizontalScrolling();
            });
            this.dispose = function () {
                subscription.dispose();
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
        viewModel.prototype.fetchPreviewData = function () {
            var _this = this;
            if (!this.selected()) {
                return;
            }
            this.previewData(null);
            this.errorFetchingPreviewData(false);
            var getPreview;
            if (!this.selected().preview() && this.selected().previewId) {
                getPreview = function () { return catalogService.getAsset(_this.selected().previewId); };
            }
            else if (this.selected().preview()) {
                getPreview = function () { return $.Deferred().resolve(_this.selected().preview()).promise(); };
            }
            else {
                getPreview = function () { return $.Deferred().reject().promise(); };
            }
            var selected = this.selected();
            getPreview()
                .fail(function () {
                _this.previewData({ keys: [], data: [] });
                _this.errorFetchingPreviewData(true);
            })
                .done(function (preview) {
                var keys = [];
                var data = [];
                if (_this.selected() === selected && preview) {
                    _this.selected().preview(preview);
                    data = preview.preview;
                    if (data && data.length) {
                        var first = data[0];
                        $.each(first, function (key, value) {
                            keys.push(key);
                        });
                    }
                }
                _this.previewData({ keys: keys, data: data });
            });
        };
        viewModel.prototype.removePreview = function () {
            var _this = this;
            modalService.show({
                title: resx.confirmPreviewDeleteTitle,
                bodyText: util.stringFormat(resx.confirmPreviewDelete, util.plainText(this.selected().displayName()))
            }).then(function (modal) {
                var previewId = _this.selected().previewId;
                logger.logInfo("deleting preview data", previewId);
                catalogService.deleteAssets([previewId])
                    .done(function () {
                    _this.selected().previewId = null;
                    _this.selected().preview(null);
                    _this.selected.notifySubscribers(_this.selected());
                    if (_this.selected().hasSchema()) {
                        detailsManager.showSchema();
                    }
                })
                    .always(function () {
                    modal.close();
                });
            });
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=preview.js.map