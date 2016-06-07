// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./editschema.html", "css!./editschema.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
    var modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./editschema.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.selected = browseManager.selected;
            this.columns = ko.observableArray([]);
            this.addButtonEnabled = ko.observable(false);
            this.deleteButtonEnabled = ko.observable(false);
            this.exitButtonEnabled = ko.observable(true);
            this.duplicateName = ko.observable("");
            this.selectAll = ko.observable(false);
            this.checkBoxChanged = function () {
                var checked = 0;
                var selectable = 0;
                _this.forEachEditor(function (editor, i) {
                    if (editor.rowSelected()) {
                        checked++;
                    }
                    if (editor.includeCheckbox()) {
                        selectable++;
                    }
                });
                _this.addButtonEnabled(checked === 1);
                _this.deleteButtonEnabled(checked > 0);
                _this.selectAll(checked !== 0 && checked === selectable);
            };
            this.onSelectAll = function (data, event) {
                _this.forEachEditor(function (editor, i) {
                    if (editor.includeCheckbox()) {
                        editor.rowSelected(_this.selectAll());
                    }
                });
                _this.addButtonEnabled(false);
                _this.deleteButtonEnabled(_this.selectAll());
                return true;
            };
            this.exitEditSchema = function (event) {
                if (_this.exitButtonEnabled()) {
                    logger.logInfo("Exit edit schema");
                    _this.clearEmptyColumns();
                    detailsManager.activeComponent("datacatalog-browse-schema");
                }
            };
            this.updateColumn = function (bindableColumn, columnName, columnType, itemEditor) {
                if (_this.selected() && (!_this.selected().schema.columns.some(function (c) { return c.name === columnName; }) || columnName === itemEditor.originalColumnName)) {
                    logger.logInfo("Updated column info", { data: { name: columnName, type: columnType } });
                    _this.duplicateName("");
                    itemEditor.duplicateErrorMessage(false);
                    if (bindableColumn) {
                        var descriptions = _this.selected().schemaDescription.columnDescriptions.filter(function (d) { return d.columnName === itemEditor.originalColumnName; });
                        var columns = _this.selected().schema.columns.filter(function (c) { return c.name === itemEditor.originalColumnName; });
                        if (columns.length) {
                            columns[0].name = columnName;
                            columns[0].type = columnType;
                        }
                        if (descriptions.length) {
                            descriptions[0].columnName = columnName;
                        }
                        catalogService.updateSchema(_this.selected().__id, _this.selected().schema, function () { }).done(function () {
                            _this.selected().schemaDescription.ensureAllColumns(_this.selected().schema.columns);
                            catalogService.updateUserSchemaDescription(_this.selected().__id, _this.selected().schemaDescription, function () { }).done(function () {
                                _this.updateColumns();
                                itemEditor.updateComplete();
                            });
                        });
                    }
                    else {
                        if (itemEditor.addedInline) {
                            var index;
                            _this.forEachEditor(function (editor, i) {
                                if (editor.columnName() === columnName) {
                                    index = i;
                                }
                            });
                            _this.selected().schema.columns[index].name = columnName;
                            _this.selected().schema.columns[index].type = columnType;
                            _this.selected().schema.columns[index].id = null;
                        }
                        else {
                            var newColumn = {
                                name: columnName,
                                type: columnType,
                                maxLength: "",
                                precision: "",
                                isNullable: ""
                            };
                            _this.selected().schema.columns.push(newColumn);
                        }
                        catalogService.updateSchema(_this.selected().__id, _this.selected().schema, function () { }).done(function () {
                            _this.selected().schemaDescription.ensureAllColumns(_this.selected().schema.columns);
                            _this.remapSchemaDescriptions();
                            catalogService.updateUserSchemaDescription(_this.selected().__id, _this.selected().schemaDescription, function () { }).done(function () {
                                _this.updateColumns();
                                itemEditor.updateComplete();
                                if (itemEditor.includeCheckbox()) {
                                    itemEditor.bindableColumn(_this.selected().schemaDescription.getBindableColumnByName(columnName));
                                }
                            });
                        });
                    }
                }
                else {
                    logger.logInfo("Entered duplicate column name", { data: { name: columnName } });
                    _this.duplicateName(columnName);
                    itemEditor.duplicateErrorMessage(true);
                }
            };
            this.insertRow = function () {
                logger.logInfo("Insert new schema item");
                var selected;
                var index;
                _this.forEachEditor(function (editor, i) {
                    if (editor.rowSelected()) {
                        selected = editor.columnName();
                        index = i;
                    }
                });
                var column = {
                    id: utilities.createID(),
                    name: "",
                    type: "",
                    precision: "",
                    maxLength: "",
                    isNullable: ""
                };
                var columns = _this.selected().schema.columns.splice(index, 0, column);
                _this.updateColumns();
            };
            this.deleteRows = function (event) {
                logger.logInfo("Delete schema item selected");
                if (!_this.deleteButtonEnabled()) {
                    return;
                }
                var selected = [];
                var emptySelected = [];
                _this.forEachEditor(function (editor, i) {
                    if (editor.rowSelected()) {
                        if (editor.bindableColumn()) {
                            selected.push(editor.originalColumnName);
                        }
                        else {
                            emptySelected.push(_this.selected().schema.columns[i].id);
                        }
                    }
                });
                var message = (selected.length === 1) ?
                    utilities.stringFormat(resx.deleteSingleRowMessageFormat, selected[0]) :
                    utilities.stringFormat(resx.deleteMultipleRowsMessageFormat, selected.length + emptySelected.length);
                modalService.show({ bodyText: message, title: resx.deleteRowsTitle }).done(function (modal) {
                    emptySelected.forEach(function (id) {
                        var index = -1;
                        _this.selected().schema.columns.forEach(function (column, i) {
                            if (column.id === id) {
                                index = i;
                            }
                        });
                        _this.selected().schema.columns.splice(index, 1);
                    });
                    var columns = browseManager.selected().schema.columns.filter(function (c) { return !selected.some(function (s) { return s === c.name; }); });
                    _this.selected().schema.columns = columns;
                    catalogService.updateSchema(_this.selected().__id, browseManager.selected().schema, function () { }).done(function () {
                        selected.forEach(function (name) {
                            _this.selected().schemaDescription.removeColumnDescription(name);
                        });
                        _this.remapSchemaDescriptions();
                        catalogService.updateUserSchemaDescription(_this.selected().__id, _this.selected().schemaDescription, function () { }).done(function () {
                            logger.logInfo("Schema columns deleted", { data: { columns: selected, empty: emptySelected.length } });
                            _this.updateColumns();
                            _this.duplicateName("");
                            _this.addButtonEnabled(false);
                            _this.deleteButtonEnabled(false);
                            _this.exitButtonEnabled(true);
                            modal.close();
                        });
                    });
                });
            };
            this.clearEmptyColumns();
            this.updateColumns();
            var duplicateSubscription = this.duplicateName.subscribe(function (newValue) {
                _this.exitButtonEnabled($.trim(newValue) === "");
            });
            this.dispose = function () {
                duplicateSubscription.dispose();
            };
        }
        viewModel.prototype.updateColumns = function () {
            var _this = this;
            var columns = [];
            if (this.selected() && this.selected().schema) {
                (this.selected().schema.columns || []).forEach(function (c) {
                    if (c.name === "") {
                        columns.push(null);
                    }
                    else {
                        if (_this.selected().schemaDescription) {
                            var description = _this.selected().schemaDescription.getBindableColumnByName(c.name);
                            if (description) {
                                columns.push(description);
                            }
                        }
                    }
                });
            }
            this.columns(columns);
        };
        viewModel.prototype.remapSchemaDescriptions = function () {
            var _this = this;
            if (this.selected() && this.selected().schema) {
                var columnNames = (this.selected().schema.columns || []).map(function (c) { return c.name; });
                var descriptions = [];
                columnNames.forEach(function (c) {
                    var d = _this.selected().schemaDescription.getBindableColumnByName(c);
                    if (d) {
                        descriptions.push(d);
                    }
                });
                this.selected().schemaDescription.columnDescriptions = descriptions;
                this.updateColumns();
            }
        };
        viewModel.prototype.forEachEditor = function (callback) {
            $.each(document.getElementsByClassName("schema-column-editor") || [], function (i, element) {
                var model = ko.dataFor(element);
                callback(model, i);
            });
        };
        viewModel.prototype.clearEmptyColumns = function () {
            if (this.selected()) {
                this.selected().schema.columns = this.selected().schema.columns.filter(function (c) { return (!c.id || $.trim(c.name) !== ""); });
            }
        };
        viewModel.prototype.updateDescription = function (bindableColumn, columnName, description, itemEditor) {
            var descriptions = this.selected().schemaDescription.columnDescriptions.filter(function (d) { return d.columnName === columnName; });
            if (descriptions.length) {
                descriptions[0].tags = bindableColumn.tags;
                descriptions[0].description(description);
            }
            catalogService.updateUserSchemaDescription(this.selected().__id, this.selected().schemaDescription, function () { }).done(function () {
                itemEditor.updateComplete();
            });
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=editschema.js.map