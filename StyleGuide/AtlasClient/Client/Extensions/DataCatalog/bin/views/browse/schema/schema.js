// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "text!./schema.html", "css!./schema.css"], function (require, exports) {
    /// <amd-dependency path="text!./schema.html" />
    /// <amd-dependency path="css!./schema.css" />
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    var utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    exports.template = require("text!./schema.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.resx = resx;
            this.selected = browseManager.selected;
            this.multiSelected = browseManager.multiSelected;
            this.applicableColumns = ko.pureComputed(function () {
                if (!_this.selected()) {
                    return [];
                }
                var columnNames = _this.selected().schema.columns.map(function (c) { return c.name; });
                return _this.selected().schemaDescription.columnDescriptions.filter(function (d) { return columnNames.some(function (n) { return n === d.columnName; }); });
            });
            this.showEditMessage = ko.pureComputed(function () {
                var show = false;
                if (_this.selected() && _this.selected().hasSchema() && _this.selected().schema.columns.length === 0) {
                    if (_this.selected().__creatorId === constants.ManualEntryID || utilities.isValidEmail(_this.selected().__creatorId)) {
                        show = true;
                    }
                }
                return show;
            });
            this.setupHorizontalScrolling();
            var subscription = this.selected.subscribe(function () {
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
        viewModel.prototype.onEditSchema = function () {
            logger.logInfo("Enter Edit Schema");
            detailsManager.showEditSchema();
        };
        viewModel.prototype.getColumnByName = function (columnName) {
            var match;
            $.each(this.selected() && this.selected().schema && this.selected().schema.columns ? this.selected().schema.columns : [], function (i, column) {
                if (column.name === columnName) {
                    match = column;
                    return false;
                }
            });
            return match;
        };
        viewModel.prototype.removeUserTag = function (bindableColumn, tag) {
            var removedItems = bindableColumn.tags.remove(function (t) { return t.toUpperCase() === tag.toUpperCase(); });
            if (removedItems.length) {
                this.updateUserSchemaDesc(bindableColumn, bindableColumn.isSettingTags, bindableColumn.successUpdatingTags);
            }
        };
        viewModel.prototype.addUserTags = function (bindableColumn, tags) {
            // Let's see if we have any changes so we don't do an update if not necessary
            var foundChange = false;
            tags.forEach(function (tag) {
                if (!bindableColumn.tags().some(function (a) { return a.toUpperCase() === tag.toUpperCase(); }) && $.trim(tag)) {
                    foundChange = true;
                    bindableColumn.tags().unshift(tag);
                }
            });
            if (foundChange) {
                this.updateUserSchemaDesc(bindableColumn, bindableColumn.isSettingTags, bindableColumn.successUpdatingTags);
            }
        };
        viewModel.prototype.updateUserSchemaDesc = function (bindableColumn, isWorking, isSuccess) {
            this.selected().metadataLastUpdated(new Date());
            this.selected().metadataLastUpdatedBy($tokyo.user.email);
            var mySchemaDesc = this.selected().schemaDescription;
            isWorking(true);
            catalogService.updateUserSchemaDescription(this.selected().__id, mySchemaDesc, function () { browseManager.rebindView(); })
                .done(function () {
                isSuccess(true);
                isSuccess(false); // Reset to false
            })
                .always(function () {
                isWorking(false);
            });
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=schema.js.map