// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./schema.html" />
/// <amd-dependency path="css!./schema.css" />

import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
import SourceTypes = Microsoft.DataStudio.DataCatalog.Core.SourceTypes;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./schema.html");

export class viewModel {
    private dispose: () => void;
    public resx = resx;
    public selected = browseManager.selected;
    public multiSelected = browseManager.multiSelected;

    constructor(parameters: any) {
        this.setupHorizontalScrolling();
        var subscription = this.selected.subscribe(() => {
            this.setupHorizontalScrolling();
        });

        this.dispose = () => {
            subscription.dispose();
        };
    }

    private setupHorizontalScrolling() {
        setTimeout(() => {
            $(".scrollable-table.content").scroll(function () {
                var l = $(".scrollable-table.content table").position().left;
                $(".scrollable-table.header").css("left", l - parseInt($(this).css("paddingLeft"), 10));
            });
        });
    }

    applicableColumns = ko.pureComputed<Interfaces.IBindableColumn[]>(() => {
        if (!this.selected()) {
            return [];
        }
        var columnNames = this.selected().schema.columns.map(c => c.name);
        return this.selected().schemaDescription.columnDescriptions.filter(d => columnNames.some(n => n === d.columnName));
    });

    showEditMessage = ko.pureComputed<boolean>(() => {
        var show = false;
        if (this.selected() && this.selected().hasSchema() && this.selected().schema.columns.length === 0) {
            if (this.selected().__creatorId === constants.ManualEntryID || utilities.isValidEmail(this.selected().__creatorId)) {
                show = true;
            }
        }
        return show;
    });

    onEditSchema(){
        logger.logInfo("Enter Edit Schema");
        detailsManager.showEditSchema();
    }

    getColumnByName(columnName: string) {
        var match: Interfaces.IColumn;
        $.each(this.selected() && this.selected().schema && this.selected().schema.columns ? this.selected().schema.columns : [], (i, column: Interfaces.IColumn) => {
            if (column.name === columnName) {
                match = column;
                return false;
            }
        });
        return match;
    }

    removeUserTag(bindableColumn: Interfaces.IBindableColumn, tag: string) {
        var removedItems = bindableColumn.tags.remove(t => t.toUpperCase() === tag.toUpperCase());
        if (removedItems.length) {
            this.updateUserSchemaDesc(bindableColumn, bindableColumn.isSettingTags, bindableColumn.successUpdatingTags);
        }
    }

    addUserTags(bindableColumn: Interfaces.IBindableColumn, tags: string[]) {
        // Let's see if we have any changes so we don't do an update if not necessary
        var foundChange = false;
        tags.forEach((tag) => {
            if (!bindableColumn.tags().some(a => a.toUpperCase() === tag.toUpperCase()) && $.trim(tag)) {
                foundChange = true;
                bindableColumn.tags().unshift(tag);
            }
        });

        if (foundChange) {
            this.updateUserSchemaDesc(bindableColumn,bindableColumn.isSettingTags, bindableColumn.successUpdatingTags);
        }
    }

    updateUserSchemaDesc(bindableColumn: Interfaces.IBindableColumn, isWorking: KnockoutObservable<boolean>,  isSuccess: KnockoutObservable<boolean>) {
        this.selected().metadataLastUpdated(new Date());
        this.selected().metadataLastUpdatedBy($tokyo.user.email);
        var mySchemaDesc = this.selected().schemaDescription;
        isWorking(true);
        catalogService.updateUserSchemaDescription(this.selected().__id, mySchemaDesc, () => { browseManager.rebindView(); })
            .done(() => {
                isSuccess(true);
                isSuccess(false); // Reset to false
            })
            .always(() => {
                isWorking(false);
            });
    }
}

