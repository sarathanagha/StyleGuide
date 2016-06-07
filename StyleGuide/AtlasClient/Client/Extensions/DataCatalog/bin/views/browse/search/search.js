// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "jquery", "text!./search.html", "css!./search.css"], function (require, exports, ko, $) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
    var connectService = Microsoft.DataStudio.DataCatalog.Services.ConnectService;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    var router = Microsoft.DataStudio.Application.Router;
    var focusManager = Microsoft.DataStudio.DataCatalog.Managers.FocusManager;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./search.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            //userProfileService.getBrowseSettings().done(settings => {
            //    this.pageSize(settings.settings.resultsPerPage);
            //    this.showHighlight(<boolean>settings.settings.highlight);
            //});
            var _this = this;
            this.svgPaths = constants.svgPaths;
            this.pageSize = browseManager.pageSize;
            this.searchTerm = browseManager.searchText;
            this.sortFields = browseManager.sortFields;
            this.sortField = browseManager.sortField;
            this.resultsType = layoutManager.centerComponent;
            this.showHighlight = browseManager.showHighlight;
            this.resx = resx;
            this.id = "search";
            this.onSectionSelect = function (d, e) {
                var key = e.which || e.keyCode;
                if (util.isSelectAction(e)) {
                    focusManager.setContainerInteractive(_this.id);
                }
                else if (key === constants.KeyCodes.ESCAPE) {
                    focusManager.resetContianer();
                }
            };
            this.isSelectedSection = ko.pureComputed(function () {
                return focusManager.selected() === _this.id;
            });
            this.onToggleHighlightKeyUp = function (d, e) {
                if (util.isSelectAction(e)) {
                    _this.toggleHightlight();
                }
            };
            this.onToggleShowResultKeyUp = function (d, e) {
                if (util.isSelectAction(e)) {
                    _this.toggleShowResult();
                }
            };
            this.isSingleAssetSelected = ko.pureComputed(function () {
                return browseManager.selected();
            });
            this.isAnyDeletableAssetSelected = ko.pureComputed(function () {
                return browseManager.multiSelected().some(function (e) { return e.hasDeleteRight(); });
            });
            this.getConnectionTypes = ko.pureComputed(function () {
                return connectService.getConnectionTypes(browseManager.selected());
            });
            // Menu settings for page size dropdown
            var pageSizes = [
                { label: '10 ' + this.resx.assetsLabel, value: 10 },
                { label: '20 ' + this.resx.assetsLabel, value: 20 },
                { label: '30 ' + this.resx.assetsLabel, value: 30 },
            ];
            this.selectedPageSize = ko.observable(pageSizes[0]);
            // Update the pageSize to match the browseManager setting
            pageSizes.some(function (option) {
                if (browseManager.pageSize() === option.value) {
                    _this.selectedPageSize(option);
                    return true;
                }
                return false;
            });
            this.pageSizeLabel = ko.computed(function () {
                return _this.selectedPageSize().label || 'No selection';
            });
            this.availablePageSizes = {
                options: pageSizes,
                selected: this.selectedPageSize
            };
            this.selectedPageSize.subscribe(function (pageSizeOption) {
                _this.updatePageSize(pageSizeOption.value);
            });
            // "Open with" menu drop down settings getConnectionTypes
            this.openWithOptions = ko.observableArray([]);
            this.getConnectionTypes.subscribe(function (connectionTypes) {
                var options = connectionTypes.map(function (type) {
                    return {
                        label: util.stringCapitalize(type.text), value: null, action: function () {
                            connectService.connect(browseManager.selected(), type);
                        }
                    };
                });
                _this.openWithOptions(options);
            });
            this.openWithMenuParams = {
                options: this.openWithOptions,
                selected: ko.observable(null)
            };
        }
        viewModel.prototype.navigateBack = function () {
            router.navigate("datacatalog/home");
        };
        viewModel.prototype.doSearch = function () {
            var searchTerm = $.trim(this.searchTerm());
            if (searchTerm || !!browseManager.previousSearchText()) {
                browseManager.doSearch({ resetPage: true });
            }
        };
        viewModel.prototype.updateSortBy = function (sortField) {
            logger.logInfo("SortOrder changed", sortField);
            this.sortField(sortField);
            browseManager.doSearch();
        };
        viewModel.prototype.toggleShowResult = function () {
            if (layoutManager.centerComponent() !== "datacatalog-browse-tiles") {
                this.showTiles();
            }
            else {
                this.showList();
            }
        };
        viewModel.prototype.showTiles = function () {
            if (layoutManager.centerComponent() !== "datacatalog-browse-tiles") {
                //userProfileService.getBrowseSettings().done(settings => {
                //    settings.settings.browseComponent = "datacatalog-browse-tiles";
                //    userProfileService.updateBrowseSettings(settings);
                //});
                logger.logInfo("Switching view to show tiles");
                layoutManager.centerComponent("datacatalog-browse-tiles");
                browseManager.centerComponent("datacatalog-browse-tiles");
            }
        };
        viewModel.prototype.showList = function () {
            if (layoutManager.centerComponent() !== "datacatalog-browse-list") {
                //userProfileService.getBrowseSettings().done(settings => {
                //    settings.settings.browseComponent = "datacatalog-browse-list";
                //    userProfileService.updateBrowseSettings(settings);
                //});
                logger.logInfo("Switching view to show list");
                layoutManager.centerComponent("datacatalog-browse-list");
                browseManager.centerComponent("datacatalog-browse-list");
            }
        };
        viewModel.prototype.connect = function (data) {
            logger.logInfo("Connect to data from search bar.");
            var dataEntity = browseManager.selected();
            connectService.connect(dataEntity, data);
        };
        viewModel.prototype.deleteSelected = function () {
            logger.logInfo("Deleting asset from search bar.");
            browseManager.deleteSelected();
        };
        viewModel.prototype.updatePageSize = function (pageSize) {
            //userProfileService.getBrowseSettings().done(settings => {
            //    settings.settings.resultsPerPage = pageSize;
            //    userProfileService.updateBrowseSettings(settings);
            //});
            var searchTerm = $.trim(this.searchTerm());
            browseManager.pageSize(pageSize);
            if (searchTerm || !!browseManager.previousSearchText()) {
                browseManager.doSearch({ resetPage: true });
            }
        };
        viewModel.prototype.toggleHightlight = function () {
            browseManager.showHighlight(!browseManager.showHighlight());
            //userProfileService.getBrowseSettings().done(settings => {
            //    settings.settings.highlight = browseManager.showHighlight();
            //    userProfileService.updateBrowseSettings(settings);
            //});
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=search.js.map