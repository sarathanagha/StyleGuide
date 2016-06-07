// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./schemaitemeditor.html", "css!./schemaitemeditor.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    exports.template = require("text!./schemaitemeditor.html");
    var viewModel = (function () {
        function viewModel(params) {
            var _this = this;
            this.resx = resx;
            this.rowSelected = ko.observable(false);
            this.columnName = ko.observable("");
            this.columnType = ko.observable("");
            this.tags = ko.observableArray([]);
            this.description = ko.observable("");
            this.bindableColumn = ko.observable(null);
            this.descriptionEnabled = ko.observable(false);
            this.includeCheckbox = ko.observable(true);
            this.duplicateErrorBorder = ko.observable(false);
            this.duplicateErrorMessage = ko.observable(false);
            this.addedInline = false;
            this.isChangingName = ko.observable(false);
            this.successUpdatingName = ko.observable(false);
            this.isChangingType = ko.observable(false);
            this.successUpdatingType = ko.observable(false);
            this.isChangingDescription = ko.observable(false);
            this.successUpdatingDescription = ko.observable(false);
            this.onUpdateColumn = function (event) {
                if ($.trim(_this.columnName()) !== "" && $.trim(_this.columnType()) !== "") {
                    _this.descriptionEnabled(false);
                    if (!_this.bindableColumn()) {
                        _this.updateColumn(_this.bindableColumn(), _this.columnName(), _this.columnType(), _this);
                    }
                    else {
                        _this.updateColumn(_this.bindableColumn(), _this.columnName(), _this.columnType(), _this);
                    }
                }
                else if ($.trim(_this.columnName()) === "" && $.trim(_this.columnType()) === "" && _this.duplicateErrorBorder()) {
                    _this.duplicateErrorBorder(false);
                    _this.duplicateErrorMessage(false);
                    _this.isChangingName(false);
                    _this.isChangingType(false);
                    _this.isChangingDescription(false);
                    _this.duplicateName("");
                }
            };
            this.onUpdateDescription = function (event) {
                _this.updateDescription(_this.bindableColumn(), _this.originalColumnName, _this.description(), _this);
            };
            this.onRowSelect = function (model, event) {
                if (_this.checkBoxChanged) {
                    _this.checkBoxChanged();
                }
                return true;
            };
            if (params.column && params.column.columnName) {
                this.bindableColumn(params.column);
                this.columnName(utilities.plainText(params.column.columnName));
                this.columnType((this.getColumnByName(params.column.columnName) || {}).type);
                this.tags(params.column.tagAttributes());
                this.description(utilities.plainText(params.column.description()));
                this.originalColumnName = params.column.columnName;
                this.descriptionEnabled($.trim(params.column.columnName) !== "");
            }
            if (params.checkBoxChanged) {
                this.checkBoxChanged = params.checkBoxChanged;
            }
            this.updateColumn = params.updateColumn;
            this.updateDescription = params.updateDescription;
            this.includeCheckbox(params.includeCheckbox);
            if (params.includeCheckbox && !params.column) {
                this.addedInline = true;
            }
            this.duplicateName = params.duplicateName;
            var duplicateSubscription = this.duplicateName.subscribe(function (newValue) {
                if ($.trim(newValue) !== "") {
                    _this.duplicateErrorBorder(newValue === _this.columnName());
                    _this.isChangingName(false);
                    _this.isChangingType(false);
                }
                else {
                    _this.duplicateErrorMessage(false);
                    _this.duplicateErrorBorder(false);
                }
            });
            this.dispose = function () {
                duplicateSubscription.dispose();
            };
        }
        viewModel.prototype.updateComplete = function () {
            if (this.bindableColumn()) {
                this.originalColumnName = this.columnName();
                this.descriptionEnabled(true);
            }
            else {
                this.columnName("");
                this.columnType("");
            }
            this.duplicateErrorBorder(false);
            this.duplicateErrorMessage(false);
            this.isChangingName(false);
            this.isChangingType(false);
            this.isChangingDescription(false);
        };
        viewModel.prototype.isValidColumn = function () {
            var valid = false;
            if (this.bindableColumn() && $.trim(this.columnName()) !== "" && $.trim(this.columnType()) !== "") {
                valid = true;
            }
            return valid;
        };
        viewModel.prototype.getColumnByName = function (columnName) {
            var match = null;
            if (browseManager.selected() && browseManager.selected().schema) {
                match = utilities.arrayFirst((browseManager.selected().schema.columns || []).filter(function (c) { return c.name === columnName; }));
                if (!match) {
                    logger.logWarning("unabled to get column by name", { columnName: columnName, columns: browseManager.selected().schema.columns });
                }
            }
            return match;
        };
        viewModel.prototype.removeUserTag = function (bindableColumn, tag) {
            var removedItems = bindableColumn.tags.remove(function (t) { return t.toUpperCase() === tag.toUpperCase(); });
            if (removedItems.length) {
                this.updateDescription(bindableColumn, this.originalColumnName, this.description(), this);
            }
        };
        viewModel.prototype.addUserTags = function (bindableColumn, tags) {
            var foundChange = false;
            tags.forEach(function (tag) {
                if (!bindableColumn.tags().some(function (a) { return a.toUpperCase() === tag.toUpperCase(); }) && $.trim(tag)) {
                    foundChange = true;
                    bindableColumn.tags().unshift(tag);
                }
            });
            if (foundChange && this.isValidColumn()) {
                this.updateDescription(bindableColumn, this.originalColumnName, this.description(), this);
            }
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=schemaitemeditor.js.map