// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./editschema.html" />
/// <amd-dependency path="css!./editschema.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import BindableColumn = Microsoft.DataStudio.DataCatalog.Models.BindableColumn;
import catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./editschema.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;
    selected = browseManager.selected;

    columns = ko.observableArray<Interfaces.IBindableColumn>([]);
    addButtonEnabled = ko.observable<boolean>(false);
    deleteButtonEnabled = ko.observable<boolean>(false);
    exitButtonEnabled = ko.observable<boolean>(true);
    duplicateName = ko.observable<string>("");
    selectAll = ko.observable<boolean>(false);


    constructor() {
        this.clearEmptyColumns();
        this.updateColumns();

        var duplicateSubscription = this.duplicateName.subscribe((newValue) => {
            this.exitButtonEnabled($.trim(newValue) === "");
        });

        this.dispose = () => {
            duplicateSubscription.dispose();
        }
    }

    private updateColumns() {
        var columns: Array<Interfaces.IBindableColumn> = [];
        if (this.selected() && this.selected().schema) {
            (this.selected().schema.columns || []).forEach((c) => {
                if (c.name === "") {
                    columns.push(null);
                }
                else {
                    if (this.selected().schemaDescription) {
                        var description = this.selected().schemaDescription.getBindableColumnByName(c.name);
                        if (description) {
                            columns.push(description);
                        }
                    }
                }
            });
        }
        this.columns(columns);
    }

    private remapSchemaDescriptions() {
        if (this.selected() && this.selected().schema) {
            var columnNames = (this.selected().schema.columns || []).map(c => c.name);
            var descriptions: Interfaces.IBindableColumn[] = [];
            columnNames.forEach(c => {
                var d = this.selected().schemaDescription.getBindableColumnByName(c);
                if (d) {
                    descriptions.push(d);
                }
            });
            this.selected().schemaDescription.columnDescriptions = descriptions;
            this.updateColumns();
        }
    }

    private forEachEditor(callback: (editor: Interfaces.IItemEditor, index: number) => void) {
        $.each(document.getElementsByClassName("schema-column-editor") || [],(i, element) => {
            var model = <Interfaces.IItemEditor>ko.dataFor(element);
            callback(model, i);
        });
    }

    private clearEmptyColumns() {
        if (this.selected()) {
            this.selected().schema.columns = this.selected().schema.columns.filter((c) => { return (!c.id || $.trim(c.name) !== ""); });
        }
    }

    checkBoxChanged = () => {
        var checked = 0;
        var selectable = 0;
        this.forEachEditor((editor, i) => {
            if (editor.rowSelected()) {
                checked++;
            }
            if (editor.includeCheckbox()) {
                selectable++;
            }
        });
        this.addButtonEnabled(checked === 1);
        this.deleteButtonEnabled(checked > 0);
        this.selectAll(checked !== 0 && checked === selectable);
    }

    onSelectAll = (data, event) => {
        this.forEachEditor((editor, i) => {
            if (editor.includeCheckbox()) {
                editor.rowSelected(this.selectAll());
            }
        });
        this.addButtonEnabled(false);
        this.deleteButtonEnabled(this.selectAll());
        return true;
    }


    exitEditSchema = (event) => {
        if (this.exitButtonEnabled()) {
            logger.logInfo("Exit edit schema");
            this.clearEmptyColumns();
            detailsManager.activeComponent("datacatalog-browse-schema");
        }
    }

    updateColumn = (bindableColumn: Interfaces.IBindableColumn, columnName: string, columnType: string, itemEditor: Interfaces.IItemEditor) => {
        if (this.selected() && (!this.selected().schema.columns.some((c) => { return c.name === columnName; }) || columnName === itemEditor.originalColumnName)) {

            logger.logInfo("Updated column info", { data: { name: columnName, type: columnType } } );
            this.duplicateName("");
            itemEditor.duplicateErrorMessage(false);

            if (bindableColumn) {
                var descriptions = this.selected().schemaDescription.columnDescriptions.filter(d => d.columnName === itemEditor.originalColumnName);
                var columns = this.selected().schema.columns.filter(c => c.name === itemEditor.originalColumnName);
                if (columns.length) {
                    columns[0].name = columnName;
                    columns[0].type = columnType;
                }
                if (descriptions.length) {
                    descriptions[0].columnName = columnName;
                }

                catalogService.updateSchema(this.selected().__id, this.selected().schema,() => { }).done(() => {
                    this.selected().schemaDescription.ensureAllColumns(this.selected().schema.columns);
                    catalogService.updateUserSchemaDescription(this.selected().__id, this.selected().schemaDescription,() => { }).done(() => {
                        this.updateColumns();
                        itemEditor.updateComplete();
                    });
                });
            }
            else {
                if (itemEditor.addedInline) {
                    var index: number;
                    this.forEachEditor((editor, i) => {
                        if (editor.columnName() === columnName) {
                            index = i;
                        }
                    });
                    this.selected().schema.columns[index].name = columnName;
                    this.selected().schema.columns[index].type = columnType;
                    this.selected().schema.columns[index].id = null;
                }
                else {
                    var newColumn: Interfaces.IColumn = {
                        name: columnName,
                        type: columnType,
                        maxLength: "",
                        precision: "",
                        isNullable: ""
                    };
                    this.selected().schema.columns.push(newColumn);
                }

                catalogService.updateSchema(this.selected().__id, this.selected().schema,() => { }).done(() => {
                    this.selected().schemaDescription.ensureAllColumns(this.selected().schema.columns);
                    this.remapSchemaDescriptions();
                    catalogService.updateUserSchemaDescription(this.selected().__id, this.selected().schemaDescription,() => { }).done(() => {
                        this.updateColumns();
                        itemEditor.updateComplete();
                        if (itemEditor.includeCheckbox()) {
                            itemEditor.bindableColumn(this.selected().schemaDescription.getBindableColumnByName(columnName));
                        }
                    });
                });
            }
        }
        else {
            logger.logInfo("Entered duplicate column name", { data: { name: columnName } });
            this.duplicateName(columnName);
            itemEditor.duplicateErrorMessage(true);
        }
    }

    updateDescription(bindableColumn: Interfaces.IBindableColumn, columnName: string, description: string, itemEditor: Interfaces.IItemEditor) {
        var descriptions = this.selected().schemaDescription.columnDescriptions.filter(d => d.columnName === columnName);
        if (descriptions.length) {
            descriptions[0].tags = bindableColumn.tags;
            descriptions[0].description(description);
        }
        catalogService.updateUserSchemaDescription(this.selected().__id, this.selected().schemaDescription,() => { }).done(() => {
            itemEditor.updateComplete();
        });
    }

    insertRow = () => {
        logger.logInfo("Insert new schema item");
        var selected: string;
        var index: number;
        this.forEachEditor((editor, i) => {
            if (editor.rowSelected()) {
                selected = editor.columnName();
                index = i;
            }
        });
        var column: Interfaces.IColumn = {
            id: utilities.createID(),
            name: "",
            type: "",
            precision: "",
            maxLength: "",
            isNullable: ""
        }
        var columns = this.selected().schema.columns.splice(index, 0, column);
        this.updateColumns();
    }

    deleteRows = (event) => {
        logger.logInfo("Delete schema item selected");
        if (!this.deleteButtonEnabled()) { return; }
        var selected: string[] = [];
        var emptySelected: string[] = [];
        this.forEachEditor((editor, i) => {
            if (editor.rowSelected()) {
                if (editor.bindableColumn()) {
                    selected.push(editor.originalColumnName);
                }
                else {
                    emptySelected.push(this.selected().schema.columns[i].id);
                }
            }
        });
        var message = (selected.length === 1) ?
            utilities.stringFormat(resx.deleteSingleRowMessageFormat, selected[0]) :
            utilities.stringFormat(resx.deleteMultipleRowsMessageFormat, selected.length + emptySelected.length);

        modalService.show({ bodyText: message, title: resx.deleteRowsTitle }).done((modal) => {
            emptySelected.forEach(id => {
                var index = -1;
                this.selected().schema.columns.forEach((column, i) => {
                    if (column.id === id) {
                        index = i;
                    }
                });
                this.selected().schema.columns.splice(index, 1);
            });
            var columns = browseManager.selected().schema.columns.filter((c) => { return !selected.some(s => s === c.name); });
            this.selected().schema.columns = columns;
            catalogService.updateSchema(this.selected().__id, browseManager.selected().schema,() => { }).done(() => {
                selected.forEach(name => {
                    this.selected().schemaDescription.removeColumnDescription(name);
                });
                this.remapSchemaDescriptions();
                catalogService.updateUserSchemaDescription(this.selected().__id, this.selected().schemaDescription,() => { }).done(() => {
                    logger.logInfo("Schema columns deleted", { data: { columns: selected, empty: emptySelected.length } });
                    this.updateColumns();
                    this.duplicateName("");
                    this.addButtonEnabled(false);
                    this.deleteButtonEnabled(false);
                    this.exitButtonEnabled(true);
                    modal.close();
                });
            });
        });
    }
}