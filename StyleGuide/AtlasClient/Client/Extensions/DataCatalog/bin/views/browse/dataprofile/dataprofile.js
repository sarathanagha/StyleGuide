// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./dataprofile.html", "css!./dataprofile.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
    exports.template = require("text!./dataprofile.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.resx = resx;
            this.selected = browseManager.selected;
            this.columnProfiles = ko.observable();
            this.errorFetchingColumnData = ko.observable(false);
            this.showSpinner = ko.observable(true);
            this.numberOfRows = ko.pureComputed(function () {
                var numRows = "0";
                if (_this.selected().dataProfile.numberOfRows) {
                    numRows = _this.selected().dataProfile.numberOfRows.toString(10);
                }
                return numRows;
            });
            this.lastModifiedDate = ko.pureComputed(function () {
                var lastModified = "";
                if (_this.selected().dataProfile.schemaLastModified) {
                    var d = new Date(_this.selected().dataProfile.schemaLastModified);
                    lastModified = d.toLocaleDateString();
                }
                return lastModified;
            });
            this.lastUpdatedDate = ko.pureComputed(function () {
                var lastModified = "";
                if (_this.selected().dataProfile.rowDataLastUpdated) {
                    var d = new Date(_this.selected().dataProfile.rowDataLastUpdated);
                    lastModified = d.toLocaleDateString();
                }
                return lastModified;
            });
            this.tableSize = ko.pureComputed(function () {
                var unit = " KB";
                var size = _this.selected().dataProfile.size || 0;
                if (size > 1024) {
                    size = size / 1024;
                    size = parseFloat(size.toFixed(2));
                    unit = " MB";
                }
                if (size > 1024) {
                    size = size / 1024;
                    size = parseFloat(size.toFixed(2));
                    unit = " GB";
                }
                if (size > 1024) {
                    size = size / 1024;
                    size = parseFloat(size.toFixed(2));
                    unit = " TB";
                }
                if (size > 1024) {
                    size = size / 1024;
                    size = parseFloat(size.toFixed(2));
                    unit = " PB";
                }
                var sizeValue = (_this.selected().dataProfile.size) ? size.toString() + unit : "";
                return sizeValue;
            });
            var subscription = this.selected.subscribe(function () {
                _this.setupHorizontalScrolling();
                _this.fetchColumnData();
            });
            this.dispose = function () {
                subscription.dispose();
            };
            this.fetchColumnData();
        }
        viewModel.prototype.setupHorizontalScrolling = function () {
            setTimeout(function () {
                $(".scrollable-table.column-data-content").scroll(function () {
                    var l = $(".scrollable-table.column-data-content table").position().left;
                    $(".scrollable-table.column-data-header").css("left", l - parseInt($(this).css("paddingLeft"), 10));
                });
            });
        };
        viewModel.prototype.fetchColumnData = function () {
            var _this = this;
            if (!this.selected()) {
                return;
            }
            this.columnProfiles(null);
            this.errorFetchingColumnData(false);
            var getColumns;
            if (this.selected().dataProfile && this.selected().dataProfile.columns && !this.selected().dataProfile.columns.length && this.selected().columnProfileId) {
                getColumns = function () { return catalogService.getAsset(_this.selected().columnProfileId); };
            }
            else if (this.selected().dataProfile && this.selected().dataProfile.columns && this.selected().dataProfile.columns.length) {
                getColumns = function () { return $.Deferred().resolve(_this.selected().dataProfile.columns).promise(); };
            }
            else if (this.selected().dataProfile && this.selected().dataProfile.columns && !this.selected().dataProfile.columns.length && !this.selected().columnProfileId) {
                getColumns = function () { return $.Deferred().resolve(null).promise(); };
            }
            else {
                getColumns = function () { return $.Deferred().reject().promise(); };
            }
            getColumns()
                .fail(function () {
                _this.columnProfiles(null);
                _this.errorFetchingColumnData(true);
            })
                .done(function (columns) {
                if (columns && !_this.selected().dataProfile.columns.length) {
                    _this.selected().setColumnProfiles(columns);
                    _this.columnProfiles(_this.selected().dataProfile.columns);
                }
                else if (_this.selected().dataProfile.columns.length) {
                    _this.columnProfiles(_this.selected().dataProfile.columns);
                }
                if (!columns) {
                    _this.columnProfiles(null);
                }
                _this.errorFetchingColumnData(false);
                _this.setupHorizontalScrolling();
            }).always(function () {
                _this.showSpinner(false);
            });
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=dataprofile.js.map