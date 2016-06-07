import ko = require("knockout");
import $ = require("jquery");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import DataSourceType = Microsoft.DataStudio.DataCatalog.Models.DataSourceType;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export class BaseBrowseResultsViewModel {
    private dispose: () => void;

    DataSourceType = DataSourceType;
    resx = resx;
    searchResult = browseManager.searchResult;
    isSearching = browseManager.isSearching;
    numResults = ko.pureComputed(() => {
        return util.stringFormat(resx.totalResultsFormat, this.searchResult().totalResults) +
            (browseManager.multiSelected().length
                ? (", " + util.stringFormat(resx.numSelectedFormat, browseManager.multiSelected().length))
                : "");
    });
    selected = browseManager.selected;
    container = browseManager.container;
    exploreContainer = (asset: Interfaces.IBindableDataEntity) => {
        browseManager.exploreContainer(asset);
    };

    constructor() {
        var centerPanelContent = layoutManager.getCenterPanelContent();

        var clearSelection = (event) => {
            var $target = $(event.target);
            var tileWasClicked = $target.parents(".tile").length || $target.hasClass("tile");
            var tableWasClicked = $target.parents(".browse-table").length || $target.hasClass("browse-table");
            var selectAllWasClicked = $target.parents(".select-all").length || $target.hasClass("select-all");
            var pagingWasClicked = $target.parents(".paging").length || $target.hasClass("paging");
            var containerWasClicked = $target.parents(".browse-container").length || $target.hasClass("browse-container");
            var scrollBarWasClicked = event.offsetX > (centerPanelContent.width() - 20) || event.offsetY > (centerPanelContent.height() + centerPanelContent.scrollTop() - 20);

            if (!tileWasClicked && !tableWasClicked && !selectAllWasClicked && !pagingWasClicked && !scrollBarWasClicked && !containerWasClicked) {
                layoutManager.rightExpanded(false);
                layoutManager.bottomExpanded(false);
                browseManager.multiSelected([]);
            }
        };
        
        centerPanelContent.mousedown(clearSelection);

        this.dispose = () => {
            centerPanelContent.unbind("mousedown", clearSelection);
        };
    }

    isDeleted(dataEntity: Interfaces.IBindableDataEntity) {
        return browseManager.isAssetDeleted(dataEntity);
    }

    isSelected(dataEntity: Interfaces.IBindableDataEntity) {
        return browseManager.multiSelected().some(s => s.__id === dataEntity.__id);
    }

    multiSelectAsset(dataEntity: Interfaces.IBindableDataEntity, event: JQueryEventObject) {
        event.ctrlKey = true;
        this.selectAsset(dataEntity, event);
    }

    selectAsset(dataEntity: Interfaces.IBindableDataEntity, event: JQueryEventObject) {
        if (this.isDeleted(dataEntity)) {
            return;
        }

        if (event.ctrlKey) {
            // Multi select mode
            if (browseManager.multiSelected().some(a => a.__id === dataEntity.__id)) {
                // Selected an already selected multi selection => remove from select list
                var filtered = browseManager.multiSelected().filter(s => s.__id !== dataEntity.__id);
                browseManager.multiSelected(filtered);
            } else {
                // Continuation of multi select
                browseManager.multiSelected.push(dataEntity);
            }

        } else if (event.shiftKey) {
            // Multi select mode
            var toAsset = dataEntity;
            var fromAsset;
            var toIndex = browseManager.searchResult().results.indexOf(dataEntity);
            var fromIndex = -1;
            if (browseManager.multiSelected().length) {
                fromAsset = util.arrayLast(browseManager.multiSelected());
                if (fromAsset === browseManager.container()) {
                    fromIndex = 0;
                } else {
                    fromIndex = browseManager.searchResult().results.indexOf(fromAsset);
                }
            }

            if (fromIndex >= 0 || fromIndex === toIndex) {
                var normalizedFrom = Math.max(Math.min(fromIndex, toIndex), 0);
                var normalizedTo = Math.max(fromIndex, toIndex, 0);
                var newSelections = [];
                for (var i = normalizedFrom; i <= normalizedTo; i++) {
                    var current = browseManager.searchResult().results[i];
                    if (!this.isDeleted(current)) {
                        current && newSelections.push(current);
                    }
                }

                // If the container was one of the selected assets, add it explicitly since it won't be in the searchResults
                var containerAsset = toAsset === browseManager.container() 
                                            ? toAsset 
                                            : (fromAsset === browseManager.container() ? fromAsset : null);
                if (containerAsset) {
                    if (!this.isDeleted(dataEntity)) {
                        containerAsset && newSelections.push(containerAsset);
                    }
                }
                browseManager.multiSelected(newSelections);

            } else {
                browseManager.multiSelected([]);
                browseManager.multiSelected.push(dataEntity);
            }

        } else {
            // Single selected item
            if (!browseManager.multiSelected().some(a => a.__id === dataEntity.__id)) {
                browseManager.multiSelected([]);
                browseManager.multiSelected.push(dataEntity);
            }
        }

        if (browseManager.selected()) {
            if (detailsManager.isEmpty() ||
                (detailsManager.isShowingSchema() && !dataEntity.hasSchema()) ||
                (detailsManager.isShowingPreview() && !dataEntity.hasPreviewLink())) {
                //// Default to showing preview if available
                if (dataEntity.hasPreviewLink()) {
                    detailsManager.showPreview();
                } else if (dataEntity.hasSchema()) {
                    detailsManager.showSchema();
                }
            }
        } else if (browseManager.multiSelected().length > 1) {
            detailsManager.showSchema();
        }

        layoutManager.rightExpanded(!!browseManager.multiSelected().length);

        if (!browseManager.multiSelected().length) {
            layoutManager.bottomExpanded(false);
        }


        logger.logInfo("asset selected from " + layoutManager.centerComponent(), {
            id: dataEntity.__id,
            isShowingSchema: detailsManager.isShowingSchema() && layoutManager.bottomExpanded(),
            isShowingPreview: detailsManager.isShowingPreview() && layoutManager.bottomExpanded()
        });
        this.saveRecentlySelected();
        
    }

    private saveRecentlySelected() {
        if (browseManager.multiSelected().length) {
            var selectedItems: Interfaces.IRecentItem[] = [];
            var created = new Date().toISOString();
            browseManager.multiSelected().forEach(i => {
                var item: Interfaces.IRecentItem = {
                    assetId: i.__id,
                    createdDate: created,
                    id: util.createID(),
                    lastUsedDate: created,
                    name: util.plainText(i.name)
                };
                selectedItems.push(item);
            });
            userProfileService.addRecentItems(selectedItems);
        }
    }

    private _getAssetKey(dataEntity: Interfaces.IBindableDataEntity): string {
        // Make a copy to strip out any highlighted strings
        var dataEntityCopy = JSON.parse(util.plainText(JSON.stringify(dataEntity)));

        var key = "";
        if (dataEntityCopy.dataSource) {
            key = (dataEntityCopy.dataSource.sourceType + "_" + dataEntityCopy.dataSource.objectType).replace(/\W/g, "").toLowerCase();
        } else if (dataEntityCopy.dsl.address.objectType) {
            key = dataEntityCopy.dsl.address.objectType.replace(/\W/g, "").toLowerCase();
        }
        return key;
    }

    formatWatermark(dataEntity: Interfaces.IBindableDataEntity) {
        switch (util.plainText(dataEntity.dataSource.sourceType).toLowerCase()) {
            case "sql server reporting services":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/sql server reporting services.png";
            case "sap hana":
            case "sql server analysis services":
            case "sql server analysis services multidimensional":
            case "sql server analysis services tabular":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/sql server analysis services.png";
            case "cosmos":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/cosmos.png";
            case "oracle database":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/oracle.png";
            case "sql server":
            case "sql data warehouse":
            case "teradata":
            case "mysql":
            case "odata":
            case "db2":
            case "postgresql":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/sql server.png";
            case "azure storage":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/azure.png";
            case "hadoop distributed file system":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/hdfs.png";
            case "hive":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/hive.png";
            case "azure data lake store":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/data lake.png";
            case "other":
            case "file system":
            case "ftp":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/Other.png";
            case "sharepoint":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/sharepoint.png";
            case "salesforce":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/salesforce.png";
            case "http":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/sourceTypes/http.png";
            default:
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "pixel.gif";
        }
    }

    formatObjectType(dataEntity: Interfaces.IBindableDataEntity) {
        var key = this._getAssetKey(dataEntity);
        switch (key) {
            case "sqlserverreportingservices_report":
            case "http_report":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/report.png";
            case "saphana_view":
            case "oracledatabase_view":
            case "sqlserver_view":
            case "cosmos_view":
            case "hive_view":
            case "sqldatawarehouse_view":
            case "teradata_view":
            case "mysql_view":
            case "db2_view":
            case "postgresql_view":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/view.png";
            case "hive_table":
            case "oracledatabase_table":
            case "sqlserver_table":
            case "sqlserveranalysisservices_table":
            case "sqlserveranalysisservicestabular_table":
            case "sqldatawarehouse_table":
            case "teradata_table":
            case "mysql_table":
            case "odata_entityset":
            case "sharepoint_list":
            case "azurestorage_table":
            case "db2_table":
            case "postgresql_table":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/table.png";
            case "sqlserver_tablevaluedfunction":
            case "odata_function":
            case "http_endpoint":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/table_v_function.png";
            case "hadoopdistributedfilesystem_file":
            case "azurestorage_blob":
            case "cosmos_stream":
            case "azuredatalakestore_file":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/stream.png";
            case "cosmos_streamset":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/streamset.png";
            case "sqlserveranalysisservicestabular_dimension":
            case "sqlserveranalysisservicesmultidimensional_dimension":
            case "sqlserveranalysisservices_dimension":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/dimension.png";
            case "measure":
            case "sqlserveranalysisservicestabular_measure":
            case "sqlserveranalysisservicesmultidimensional_measure":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/measure.png";
            case "kpi":
            case "sqlserveranalysisservicestabular_kpi":
            case "sqlserveranalysisservicesmultidimensional_kpi":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/kpi.png";
            case "hadoopdistributedfilesystem_directory":
            case "azurestorage_directory":
            case "azuredatalakestore_directory":
            case "ftp_directory":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/directory.png";
            case "other_other":
            case "http_file":
            case "filesystem_file":
            case "ftp_file":
            case "salesforce_object":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/Other.png";
            default:
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "pixel.gif";
        }
    }

    getSourceTypeImage(dataEntity: Interfaces.IBindableDataEntity) {
        switch (util.plainText(dataEntity.dataSource.sourceType).toLowerCase()) {
            case "sap hana":
            case "sql server analysis services":
            case "sql server analysis services multidimensional":
            case "sql server analysis services tabular":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/a_s_list.png";
            case "cosmos":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/cosmos_list.png";
            case "oracle database":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/oracle_list.png";
            case "sql server reporting services":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/ssrs_list.png";
            case "sql server":
            case "sql data warehouse":
            case "teradata":
            case "mysql":
            case "odata":
            case "db2":
            case "postgresql":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/sql_list.png";
             case "azure storage":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/azure.png";
            case "hadoop distributed file system":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/hdfs.png";
            case "hive":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/hive.png";
            case "azure data lake store":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/data_lake.png";
            case "http":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/http.png";
            case "sharepoint":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/sharepoint.png";
            case "salesforce":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "list/sourceTypes/salesforce.png";
            case "other":
            case "file system":
            case "ftp":
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "tiles/objectTypes/Other.png"; // This will need to be updated.
            default:
                return Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "pixel.gif";
        }
    }

    formatContainedInUrl(dataEntity: Interfaces.IBindableDataEntity) {
        if (!dataEntity.dsl.address.url) { return ""; }
        var url = util.plainText(dataEntity.dsl.address.url);

        switch (util.plainText(dataEntity.dataSource.sourceType).toLowerCase()) {
            case "azure data lake store":
            case "hadoop distributed file system":
                var parser = document.createElement("a");
                parser.href = url;
                return parser.hostname;
            default:
                return url.split("/").pop();
        }
    }

    getContainedInName(dataEntity: Interfaces.IBindableDataEntity): string {
        var address = dataEntity.dsl.address;
        if (address.database) {
            return address.database;
        } else if (address.url) {
            return this.formatContainedInUrl(dataEntity);
        } else if (address.path) {
            return $.trim(address.path.replace(dataEntity.name, ""));
        } else if (address.container) {
            return address.container;
        } else if (address.server) {
            return address.server;
        }
        return "";
    }

    formatSourceAndObjectTypeText(dataEntity: Interfaces.IBindableDataEntity) {
        // Extract highlighted words
        var highlightedWords = util.extractHighlightedWords(dataEntity.dataSource);

        var key = this._getAssetKey(dataEntity);
        var value = resx[key] || "";

        // Add highlights back
        value = util.applyHighlighting(highlightedWords, value, "gi");

        return value;
    }

    getExploreContainerText(dataEntity: Interfaces.IBindableDataEntity): string {
        var sourceTypeLabel = dataEntity.getContainerName() || resx.container;
        return util.stringFormat(resx.exploreContainerFormat, sourceTypeLabel);
    }

    formatSourceTypeText(dataEntity: Interfaces.IBindableDataEntity) {
        var dataSourceString = JSON.stringify(dataEntity.dataSource || { sourceType: "" });
        dataSourceString = util.plainText(dataSourceString);
        var dataSource = JSON.parse(dataSourceString);
        var key = ("sourcetype_" + dataSource.sourceType).replace(/\W/g, "").toLowerCase();
        return resx[key];
    }

    formatObjectTypeText(dataEntity: Interfaces.IBindableDataEntity) {
        var dataSourceString = JSON.stringify(dataEntity.dataSource || { objectType: "" });
        dataSourceString = util.plainText(dataSourceString);
        var dataSource = JSON.parse(dataSourceString);
        var key = ("objecttype_" + (dataSource.objectType)).replace(/\W/g, "").toLowerCase();
        var value = resx[key];
        return this.detectAcronyms(value);
    }

    // Detect acronyms from known set
    private detectAcronyms(label: string) {
        var knownAcronyms = ["kpi", "sql"];
        var re = new RegExp("\\b(" + knownAcronyms.join("|") + ")\\b", "ig");
        return (label || "").replace(re,(match: string) => { return match.toLocaleUpperCase(); });
    }

    onPagingChanged(newPage: number) {
        logger.logInfo("updating paging from " + layoutManager.centerComponent(), { newPage: newPage });
        browseManager.currentPage = newPage;
        browseManager.doSearch();
    }

    clearSearch() {
        browseManager.container(null);
        browseManager.doSearch({
            resetPage: true,
            resetFilters: true,
            resetSearchText: true,
            resetSelected: true,
            resetStart: true
        });
    }

    toggleSelectAll(d, event: JQueryEventObject) {
        event.stopImmediatePropagation();

        if (this.allSelected()) {
            browseManager.multiSelected([]);
        } else {
            var pageItems = this.searchResult().results.filter(r => !this.isDeleted(r));
            if (browseManager.container() && !this.isDeleted(browseManager.container())) {
                pageItems.push(browseManager.container());
            }
            browseManager.multiSelected(pageItems);
            this.saveRecentlySelected();
        }
    }

    allSelected = ko.pureComputed(() => {
        var pageItems = this.searchResult().results.filter(r => !this.isDeleted(r));
        if (browseManager.container() && !this.isDeleted(browseManager.container())) {
            pageItems.push(browseManager.container());
        }
        return browseManager.multiSelected().length === pageItems.length && pageItems.length > 0;
    });

    isHighlighted(value: string) {
        return (value || "").indexOf("tokyo-highlight") > 0;
    }
}