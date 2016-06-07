/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./app.html", "css!./app.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var search = Microsoft.DataStudio.DataCatalog.Services.SearchService;
    //import router = require("core/router");
    var appManager = Microsoft.DataStudio.DataCatalog.Managers.AppManager;
    var userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
    var Logging = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./app.html");
    var viewModel = (function () {
        function viewModel() {
            this.showUpgradeIsAvailable = appManager.showUpgradeIsAvailable;
            this.hideUpgradeNotice = appManager.hideUpgradeNotice;
            //route: any;
            this.navigationLinks = ko.observableArray();
            this.resx = resx;
            this.publishedItems = ko.observable(false);
            this.showUserInfo = ko.observable(false);
            this.isClearingSearchHistory = ko.observable(false);
            this.successClearingSearchHistory = ko.observable(false);
            this.logger = Logging.getLogger({ category: "Shell Components" });
            var self = this;
            //self.route = router.currentRoute;
            this.navigationLinks([
                { name: "home", text: self.resx.home, route: "home", image: "edd_home_18.png", enabled: ko.observable(true) },
                { name: "browse", text: self.resx.discover, route: "browse", image: "edd_browse_18.png", enabled: ko.observable(true) },
                { name: "publish", text: self.resx.publish, route: "publish", image: "edd_publish_18.png", enabled: ko.observable(true) }
            ]);
            var catalogInfo = $tokyo.catalogInfo;
            if (catalogInfo) {
                self.navigationLinks.push({ name: "admin", text: self.resx.settings, route: "admin", image: "edd_admin_18.png", enabled: ko.observable(true) });
            }
            userProfileService.getBrowseSettings().done(function (settings) {
                browseManager.pageSize(settings.settings.resultsPerPage);
                browseManager.centerComponent(settings.settings.browseComponent);
                self.hasItems();
            });
            var subscription = self.showUserInfo.subscribe(function (newValue) {
                self.logger.logInfo("show user info changed to " + newValue);
            });
            self.dispose = function () {
                subscription.dispose();
            };
        }
        viewModel.prototype.hasItems = function () {
            var _this = this;
            search.getNumberOfItems()
                .done(function (num) {
                if (num) {
                    browseManager.doSearch({ maxFacetTerms: 100, resetStart: true });
                }
                else {
                    //router.reload("/#/publish?zeroresults=true");
                    _this.toggleNavigation("home", false);
                    _this.toggleNavigation("browse", false);
                    _this.hasNewPublishes();
                }
            }).always(function () {
                _this.publishedItems(true);
            });
        };
        viewModel.prototype.toggleNavigation = function (name, enabled) {
            var navItem = utils.arrayFirst(this.navigationLinks().filter(function (n) { return n.name === name; }));
            if (navItem) {
                navItem.enabled(enabled);
            }
        };
        viewModel.prototype.hasNewPublishes = function () {
            /*
            var pollForPublishes = () => {
                search.getNumberOfItems()
                    .done(num => {
                        if (num) {
                    this.toggleNavigation("home", true);
                    this.toggleNavigation("browse", true);
                    browseManager.doSearch();
                        } else {
                    setTimeout(pollForPublishes, 1000 * 30);
                        }
                    })
                    .fail(() => {
                        this.toggleNavigation("home", true);
                        this.toggleNavigation("browse", true);
                });
            }
    
            pollForPublishes();
            */
        };
        viewModel.prototype.clearSearchHistory = function () {
            var _this = this;
            this.isClearingSearchHistory(true);
            userProfileService.getSearchTerms()
                .fail(function () { _this.isClearingSearchHistory(false); })
                .done(function (searchTerms) {
                searchTerms.terms = [];
                var promise = userProfileService.setSearchTerms(searchTerms);
                promise
                    .always(function () {
                    _this.isClearingSearchHistory(false);
                    _this.successClearingSearchHistory(promise.state() === "resolved");
                });
            });
        };
        viewModel.prototype.signOut = function () {
            this.logger.logInfo("sign out");
            window.location = "home/signOut";
        };
        viewModel.prototype.userInfoMouseLeave = function (data, event) {
            var _this = this;
            clearInterval(this.userInfoInterval);
            this.userInfoInterval = setTimeout(function () {
                _this.showUserInfo(false);
            }, 200);
        };
        viewModel.prototype.userInfoMouseEnter = function (data, event) {
            clearInterval(this.userInfoInterval);
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=app.js.map