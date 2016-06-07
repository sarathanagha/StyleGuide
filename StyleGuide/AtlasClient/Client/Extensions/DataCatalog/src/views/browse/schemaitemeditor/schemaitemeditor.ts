// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./schemaitemeditor.html" />
/// <amd-dependency path="css!./schemaitemeditor.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./schemaitemeditor.html");

export class viewModel implements Interfaces.IItemEditor {
    dispose: () => void;
    resx = resx;

    rowSelected = ko.observable<boolean>(false);
    columnName = ko.observable<string>("");
    columnType = ko.observable<string>("");
    originalColumnName: string;
    tags = ko.observableArray<Interfaces.IAttributeInfo>([]);
    description = ko.observable<string>("");
    bindableColumn = ko.observable<Interfaces.IBindableColumn>(null);

    updateColumn: (bindableColumn: Interfaces.IBindableColumn, columnName: string, columnType: string, itemEditor: Interfaces.IItemEditor) => void;
    updateDescription: (bindableColumn: Interfaces.IBindableColumn, columnName: string, description: string, itemEditor: Interfaces.IItemEditor) => void;
    checkBoxChanged: () => void;

    duplicateName: KnockoutObservable<string>;
    descriptionEnabled = ko.observable<boolean>(false);
    includeCheckbox = ko.observable<boolean>(true);
    duplicateErrorBorder = ko.observable<boolean>(false);
    duplicateErrorMessage = ko.observable<boolean>(false);
    addedInline = false;

    isChangingName = ko.observable<boolean>(false);
    successUpdatingName = ko.observable<boolean>(false);
    isChangingType = ko.observable<boolean>(false);
    successUpdatingType = ko.observable<boolean>(false);
    isChangingDescription = ko.observable<boolean>(false);
    successUpdatingDescription = ko.observable<boolean>(false);

    constructor(params: Interfaces.IEditColumnData) {
        if (params.column && params.column.columnName) {
            this.bindableColumn(params.column);
            this.columnName(utilities.plainText(params.column.columnName));
            this.columnType((this.getColumnByName(params.column.columnName) || <any>{}).type);
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

        var duplicateSubscription = this.duplicateName.subscribe((newValue) => {
            if ($.trim(newValue) !== "") {
                this.duplicateErrorBorder(newValue === this.columnName());
                this.isChangingName(false);
                this.isChangingType(false);
            }
            else {
                this.duplicateErrorMessage(false);
                this.duplicateErrorBorder(false);
            }
        });

        this.dispose = () => {
            duplicateSubscription.dispose();
        }
    }

    updateComplete() {
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
    }

    isValidColumn(): boolean {
        var valid = false;
        if (this.bindableColumn() && $.trim(this.columnName()) !== "" && $.trim(this.columnType()) !== "") {
            valid = true;
        }
        return valid;
    }

    getColumnByName(columnName: string) {
        var match: Interfaces.IColumn = null;
        if (browseManager.selected() && browseManager.selected().schema) {
            match = utilities.arrayFirst((browseManager.selected().schema.columns || []).filter(c => { return c.name === columnName; }));
            if (!match) {
                logger.logWarning("unabled to get column by name", { columnName: columnName, columns: browseManager.selected().schema.columns });
            }
        }
        return match;
    }

    removeUserTag(bindableColumn: Interfaces.IBindableColumn, tag: string) {
        var removedItems = bindableColumn.tags.remove(t => t.toUpperCase() === tag.toUpperCase());
        if (removedItems.length) {
            this.updateDescription(bindableColumn, this.originalColumnName, this.description(), this);
        }
    }

    addUserTags(bindableColumn: Interfaces.IBindableColumn, tags: string[]) {
        var foundChange = false;
        tags.forEach((tag) => {
            if (!bindableColumn.tags().some(a => a.toUpperCase() === tag.toUpperCase()) && $.trim(tag)) {
                foundChange = true;
                bindableColumn.tags().unshift(tag);
            }
        });
        if (foundChange && this.isValidColumn()) {
            this.updateDescription(bindableColumn, this.originalColumnName, this.description(), this);
        }
    }

    onUpdateColumn = (event) => {
        if ($.trim(this.columnName()) !== "" && $.trim(this.columnType()) !== "") {
            this.descriptionEnabled(false);
            if (!this.bindableColumn()) {
                this.updateColumn(this.bindableColumn(), this.columnName(), this.columnType(), this);
            }
            else {
                this.updateColumn(this.bindableColumn(), this.columnName(), this.columnType(), this);
            }
        }
        else if ($.trim(this.columnName()) === "" && $.trim(this.columnType()) === "" && this.duplicateErrorBorder()) {
            this.duplicateErrorBorder(false);
            this.duplicateErrorMessage(false);
            this.isChangingName(false);
            this.isChangingType(false);
            this.isChangingDescription(false);
            this.duplicateName("");
        }
    };

    onUpdateDescription = (event) => {
        this.updateDescription(this.bindableColumn(), this.originalColumnName, this.description(), this);
    }

    onRowSelect = (model: any, event: Event) => {
        if (this.checkBoxChanged) {
            this.checkBoxChanged();
        }
        return true;
    }
}
