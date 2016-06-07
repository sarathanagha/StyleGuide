/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./app.html" />
/// <amd-dependency path="css!./app.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import search = Microsoft.DataStudio.DataCatalog.Services.SearchService;
//import router = require("core/router");
import appManager = Microsoft.DataStudio.DataCatalog.Managers.AppManager;
import userProfileService = Microsoft.DataStudio.DataCatalog.Services.UserProfileService;
import Logging = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./app.html");

export class viewModel {
    private dispose: () => void;
    showUpgradeIsAvailable = appManager.showUpgradeIsAvailable;
    hideUpgradeNotice = appManager.hideUpgradeNotice;

    //route: any;
    navigationLinks = ko.observableArray<any>();
    public resx = resx;
    publishedItems = ko.observable<boolean>(false);
    showUserInfo = ko.observable<boolean>(false);

    isClearingSearchHistory = ko.observable(false);
    successClearingSearchHistory = ko.observable(false);

    userInfoInterval: number;
    
    private logger = Logging.getLogger({ category: "Shell Components" });

    constructor() {
        var self = this;

        //self.route = router.currentRoute;

        this.navigationLinks([
            { name: "home", text: self.resx.home, route: "home", image: "edd_home_18.png", enabled: ko.observable(true) },
            { name: "browse", text: self.resx.discover, route: "browse", image: "edd_browse_18.png", enabled: ko.observable(true) },
            { name: "publish", text: self.resx.publish, route: "publish", image: "edd_publish_18.png", enabled: ko.observable(true) }
        ]);
        
        var catalogInfo = (<any>$tokyo).catalogInfo;
        if (catalogInfo) {
            self.navigationLinks.push({ name: "admin", text: self.resx.settings, route: "admin", image: "edd_admin_18.png", enabled: ko.observable(true) });
        }

        userProfileService.getBrowseSettings().done(settings => {
            browseManager.pageSize(settings.settings.resultsPerPage);
            browseManager.centerComponent(settings.settings.browseComponent);
            self.hasItems();
        });

        var subscription = self.showUserInfo.subscribe(newValue => {
            self.logger.logInfo("show user info changed to " + newValue);
        });

        self.dispose = () => {
            subscription.dispose();
        };
    }

    hasItems() {
        search.getNumberOfItems()
            .done((num) => {
                if (num) {
                    browseManager.doSearch({ maxFacetTerms: 100, resetStart: true });
                } else {
            //router.reload("/#/publish?zeroresults=true");
            this.toggleNavigation("home", false);
            this.toggleNavigation("browse", false);
            this.hasNewPublishes();
                }
        }).always(() => {
            this.publishedItems(true);
        });
    }

    toggleNavigation(name: string, enabled: boolean) {
        var navItem = utils.arrayFirst(this.navigationLinks().filter(n => n.name === name));
        if (navItem) {
            navItem.enabled(enabled);
        }
    }

    hasNewPublishes() {
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
    }


    clearSearchHistory() {
        this.isClearingSearchHistory(true);

        userProfileService.getSearchTerms()
            .fail(() => { this.isClearingSearchHistory(false); })
            .done(searchTerms => {
                searchTerms.terms = [];
                var promise = userProfileService.setSearchTerms(searchTerms);
                promise
                    .always(() => {
                        this.isClearingSearchHistory(false);
                        this.successClearingSearchHistory(promise.state() === "resolved");
                    });
            });
    }

    signOut() {
        this.logger.logInfo("sign out");
        window.location = <any>"home/signOut";
    }

    userInfoMouseLeave(data, event: JQueryEventObject) {
        clearInterval(this.userInfoInterval);
        this.userInfoInterval = setTimeout(() => {
            this.showUserInfo(false);
        }, 200);
    }

    userInfoMouseEnter(data, event: JQueryEventObject) {
        clearInterval(this.userInfoInterval);
    }
}