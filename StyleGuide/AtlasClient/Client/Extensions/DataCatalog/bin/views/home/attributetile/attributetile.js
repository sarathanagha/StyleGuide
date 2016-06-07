// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./attributetile.html", "css!./attributetile.css"], function (require, exports, ko) {
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
    exports.template = require("text!./attributetile.html");
    var viewModel = (function () {
        function viewModel(params) {
            var _this = this;
            this.title = ko.observable("");
            this.attributes = ko.observableArray([]);
            this.emptyMessage = ko.observable("");
            this.logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            this.onSelect = function (d, e) {
                if (d && d.term) {
                    homeManager.isSearching(true);
                    _this.logger.logInfo("Facet search from home page.", { facet: _this.groupType, term: d.term });
                    var term = d.term;
                    browseManager.selectedFilters([]);
                    browseManager.searchText("");
                    browseManager.selectedFilters().push({
                        groupType: _this.groupType,
                        term: term,
                        count: 0
                    });
                    browseManager.doSearch({ preserveGroup: _this.groupType, resetPage: true }).done(function () {
                        homeManager.isSearching(false);
                        window.location.hash = "/browse";
                    });
                }
            };
            this.title(params.title);
            this.emptyMessage(params.emptyMessage);
            this.attributes = params.attributes;
            this.groupType = params.group;
        }
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=attributetile.js.map