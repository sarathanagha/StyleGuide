// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./dataprofile.html" />
/// <amd-dependency path="css!./dataprofile.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./dataprofile.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;
    selected = browseManager.selected;

    columnProfiles = ko.observable<Interfaces.IBindableColumnProfile[]>();
    errorFetchingColumnData = ko.observable<boolean>(false);
    showSpinner = ko.observable<boolean>(true);

    constructor(parameters: any) {
        var subscription = this.selected.subscribe(() => {
            this.setupHorizontalScrolling();
            this.fetchColumnData();
        });

        this.dispose = () => {
            subscription.dispose();
        };

        this.fetchColumnData();
    }

    private setupHorizontalScrolling() {
        setTimeout(() => {
            $(".scrollable-table.column-data-content").scroll(function(){
                var l = $(".scrollable-table.column-data-content table").position().left;
                $(".scrollable-table.column-data-header").css("left", l - parseInt($(this).css("paddingLeft"), 10));
            });
        });
    }

    numberOfRows = ko.pureComputed<string>(() => {
        var numRows: string = "0";
        if (this.selected().dataProfile.numberOfRows) {
            numRows = this.selected().dataProfile.numberOfRows.toString(10);
        }
        return numRows;
    });

    lastModifiedDate = ko.pureComputed<string>(() => {
        var lastModified: string = "";
        if (this.selected().dataProfile.schemaLastModified) {
            var d: Date = new Date(this.selected().dataProfile.schemaLastModified);
            lastModified = d.toLocaleDateString();
        }
        
        return lastModified;
    });

    lastUpdatedDate = ko.pureComputed<string>(() => {
        var lastModified: string = "";
        if (this.selected().dataProfile.rowDataLastUpdated) {
            var d: Date = new Date(this.selected().dataProfile.rowDataLastUpdated);
            lastModified = d.toLocaleDateString();
        }
        
        return lastModified; 
    });

    tableSize = ko.pureComputed<string>(() => {
        var unit: string = " KB";
        var size: number = this.selected().dataProfile.size || 0;
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
        var sizeValue: string = (this.selected().dataProfile.size) ? size.toString() + unit : "";
        return sizeValue;
    });

    fetchColumnData() {
        if (!this.selected()) { return; }
        this.columnProfiles(null);
        this.errorFetchingColumnData(false);
        var getColumns: () => JQueryPromise<Interfaces.IColumnProfileArray>;
        if (this.selected().dataProfile && this.selected().dataProfile.columns && !this.selected().dataProfile.columns.length && this.selected().columnProfileId) {
            getColumns = () => { return <JQueryPromise<Interfaces.IColumnProfileArray>>catalogService.getAsset(this.selected().columnProfileId); }
        }
        else if (this.selected().dataProfile && this.selected().dataProfile.columns && this.selected().dataProfile.columns.length) {
            getColumns = () => { return $.Deferred().resolve(this.selected().dataProfile.columns).promise(); }
        }
        else if (this.selected().dataProfile && this.selected().dataProfile.columns && !this.selected().dataProfile.columns.length && !this.selected().columnProfileId) {
            getColumns = () => { return $.Deferred().resolve(null).promise(); }
        }
        else {
            getColumns = () => { return $.Deferred().reject().promise(); }
        }

        getColumns()
            .fail(() => {
            this.columnProfiles(null);
            this.errorFetchingColumnData(true);
        })
            .done(columns => {
            if (columns && !this.selected().dataProfile.columns.length) {
                this.selected().setColumnProfiles(columns);
                this.columnProfiles(this.selected().dataProfile.columns);
            }
            else if (this.selected().dataProfile.columns.length) {
                this.columnProfiles(this.selected().dataProfile.columns);
            }
            if (!columns) {
                this.columnProfiles(null);
            }
            this.errorFetchingColumnData(false);
            this.setupHorizontalScrolling();
        }).always(() => {
            this.showSpinner(false);
        });
    }
}
