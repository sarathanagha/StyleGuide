// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./browselist.html", "css!./browselist.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
    exports.template = require("text!./browselist.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            this.listLimit = 5;
            this.experts = ko.pureComputed(function () {
                var experts = [];
                if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
                    var group = browseManager.filterTypes().groups.filter(function (g) { return g.groupType === "experts"; })[0];
                    if (group && group.items && group.items.length) {
                        group.items.forEach(function (i) {
                            experts.push(i.term);
                        });
                        experts = experts.slice(0, _this.listLimit);
                    }
                }
                return experts;
            });
            this.sources = ko.pureComputed(function () {
                var sources = [];
                if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
                    var group = browseManager.filterTypes().groups.filter(function (g) { return g.groupType === "sourceType"; })[0];
                    if (group && group.items && group.items.length) {
                        group.items.forEach(function (i) {
                            sources.push(i.term);
                        });
                        sources = sources.slice(0, _this.listLimit);
                    }
                }
                return sources;
            });
            this.types = ko.pureComputed(function () {
                var types = [];
                if (browseManager.filterTypes() && browseManager.filterTypes().groups && browseManager.filterTypes().groups.length) {
                    var group = browseManager.filterTypes().groups.filter(function (g) { return g.groupType === "objectType"; })[0];
                    if (group && group.items && group.items.length) {
                        group.items.forEach(function (i) {
                            types.push(i.term);
                        });
                        types = types.slice(0, _this.listLimit);
                    }
                }
                return types;
            });
        }
        viewModel.prototype.selectFacet = function (groupType, data) {
            this.logger.logInfo("Facet search from home page.", { facet: groupType, term: data });
            homeManager.isSearching(true);
            browseManager.selectedFilters([]);
            browseManager.selectedFilters().push({
                groupType: groupType,
                term: data,
                count: 0
            });
            browseManager.doSearch({ preserveGroup: groupType, resetPage: true }).done(function () {
                homeManager.isSearching(false);
                window.location.hash = "/browse";
            });
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=browselist.js.map