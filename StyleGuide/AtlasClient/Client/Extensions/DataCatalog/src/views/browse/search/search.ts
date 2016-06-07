// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./search.html" />
/// <amd-dependency path="css!./search.css" />

import ko = require("knockout");
import $ = require("jquery");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
import connectService = Microsoft.DataStudio.DataCatalog.Services.ConnectService;
import searchService = Microsoft.DataStudio.DataCatalog.Services.SearchService;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import router = Microsoft.DataStudio.Application.Router;
import focusManager = Microsoft.DataStudio.DataCatalog.Managers.FocusManager;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;
import dsuxInterfaces = Microsoft.DataStudioUX.Interfaces;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./search.html");

export class viewModel {
    public svgPaths = constants.svgPaths;
    public pageSize = browseManager.pageSize;
    public searchTerm = browseManager.searchText;
    public sortFields = browseManager.sortFields;
    public sortField = browseManager.sortField;
    public resultsType = layoutManager.centerComponent;
    public showHighlight = browseManager.showHighlight;

    public isSingleAssetSelected: KnockoutComputed<any>;
    public isAnyDeletableAssetSelected: KnockoutComputed<any>;
    public getConnectionTypes: KnockoutComputed<any>;

    public availablePageSizes: dsuxInterfaces.SelectMenuParams;
    public selectedPageSize: KnockoutObservable<dsuxInterfaces.SelectMenuOption>;
    public pageSizeLabel: KnockoutComputed<string>;

    public openWithOptions: KnockoutObservableArray<dsuxInterfaces.SelectMenuOption>;
    public openWithMenuParams: dsuxInterfaces.SelectMenuParams;
   
    public resx = resx;
    public id = "search";

    constructor(parameters: any) {
        //userProfileService.getBrowseSettings().done(settings => {
        //    this.pageSize(settings.settings.resultsPerPage);
        //    this.showHighlight(<boolean>settings.settings.highlight);
        //});

        this.isSingleAssetSelected = ko.pureComputed(() => {
            return browseManager.selected();
        });

        this.isAnyDeletableAssetSelected = ko.pureComputed(() => {
            return browseManager.multiSelected().some(e => e.hasDeleteRight());
        });

        this.getConnectionTypes = ko.pureComputed(() => {
            return connectService.getConnectionTypes(browseManager.selected());
        });

        // Menu settings for page size dropdown
        var pageSizes: dsuxInterfaces.SelectMenuOption[] = [
            { label: '10 ' + this.resx.assetsLabel, value: 10 },
            { label: '20 ' + this.resx.assetsLabel, value: 20 },
            { label: '30 ' + this.resx.assetsLabel, value: 30 },
        ];

        this.selectedPageSize = ko.observable(pageSizes[0]);

        // Update the pageSize to match the browseManager setting
        pageSizes.some((option: dsuxInterfaces.SelectMenuOption) => {
            if (browseManager.pageSize() === option.value) {
                this.selectedPageSize(option);
                return true;
            }
            return false;
        });

        this.pageSizeLabel = ko.computed(() => {
            return this.selectedPageSize().label || 'No selection';
        });

        this.availablePageSizes = {
            options: pageSizes,
            selected: this.selectedPageSize
        };

        this.selectedPageSize.subscribe((pageSizeOption: dsuxInterfaces.SelectMenuOption) => {
            this.updatePageSize(pageSizeOption.value);
        });

        // "Open with" menu drop down settings getConnectionTypes
        this.openWithOptions = ko.observableArray([]);
        this.getConnectionTypes.subscribe((connectionTypes: Interfaces.IConnectApplication[]) => {
            var options: dsuxInterfaces.SelectMenuOption[] = connectionTypes.map((type: Interfaces.IConnectApplication) => {
                return {
                    label: util.stringCapitalize(type.text), value: null, action: () => {
                        connectService.connect(browseManager.selected(), type);
                    }
                };
            });
            this.openWithOptions(options);
        });

        this.openWithMenuParams = {
            options: this.openWithOptions,
            selected: ko.observable(null)
        };
    }

    public onSectionSelect = (d, e: KeyboardEvent) => {
        var key = e.which || e.keyCode;
        if (util.isSelectAction(e)) {
            focusManager.setContainerInteractive(this.id);
        }
        else if (key === constants.KeyCodes.ESCAPE) {
            focusManager.resetContianer();
        }
    }

    public isSelectedSection = ko.pureComputed<boolean>(() => {
        return focusManager.selected() === this.id;
    });

    navigateBack() {
        router.navigate("datacatalog/home");
    }

    doSearch() {
        var searchTerm = $.trim(this.searchTerm());
        if (searchTerm || !!browseManager.previousSearchText()) {
            browseManager.doSearch({ resetPage: true });
        }
    }

    updateSortBy(sortField: Interfaces.IStringKeyValue) {
        logger.logInfo("SortOrder changed", sortField);
        this.sortField(sortField);
        browseManager.doSearch();
    }

    public toggleShowResult(): void {
        if (layoutManager.centerComponent() !== "datacatalog-browse-tiles") {
            this.showTiles();
        } else {
            this.showList();
        }
    }

    showTiles() {
        if (layoutManager.centerComponent() !== "datacatalog-browse-tiles") {
            //userProfileService.getBrowseSettings().done(settings => {
            //    settings.settings.browseComponent = "datacatalog-browse-tiles";
            //    userProfileService.updateBrowseSettings(settings);
            //});
            logger.logInfo("Switching view to show tiles");
            layoutManager.centerComponent("datacatalog-browse-tiles");
            browseManager.centerComponent("datacatalog-browse-tiles");
        }
    }

    showList() {
        if (layoutManager.centerComponent() !== "datacatalog-browse-list") {
            //userProfileService.getBrowseSettings().done(settings => {
            //    settings.settings.browseComponent = "datacatalog-browse-list";
            //    userProfileService.updateBrowseSettings(settings);
            //});
            logger.logInfo("Switching view to show list");
            layoutManager.centerComponent("datacatalog-browse-list");
            browseManager.centerComponent("datacatalog-browse-list");
        }
    }

    connect(data: Interfaces.IConnectApplication) {
        logger.logInfo("Connect to data from search bar.");
        var dataEntity = browseManager.selected();
        connectService.connect(dataEntity, data);
    }

    deleteSelected() {
        logger.logInfo("Deleting asset from search bar.");
        browseManager.deleteSelected();
    }

    updatePageSize(pageSize: number) {
        //userProfileService.getBrowseSettings().done(settings => {
        //    settings.settings.resultsPerPage = pageSize;
        //    userProfileService.updateBrowseSettings(settings);
        //});
        var searchTerm = $.trim(this.searchTerm());
        browseManager.pageSize(pageSize);
        if (searchTerm || !!browseManager.previousSearchText()) {
            browseManager.doSearch({ resetPage: true });
        }
    }

    toggleHightlight() {
        browseManager.showHighlight(!browseManager.showHighlight());
        //userProfileService.getBrowseSettings().done(settings => {
        //    settings.settings.highlight = browseManager.showHighlight();
        //    userProfileService.updateBrowseSettings(settings);
        //});
    }

    public onToggleHighlightKeyUp = (d, e: KeyboardEvent) => {
        if (util.isSelectAction(e)) {
            this.toggleHightlight();
        }
    }

    public onToggleShowResultKeyUp = (d, e: KeyboardEvent) => {
        if (util.isSelectAction(e)) {
            this.toggleShowResult();
        }
    }
} 