// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
/// <reference path="../manualentry/manualentry.ts" />

/// <amd-dependency path="text!./publish.html" />
/// <amd-dependency path="css!./publish.css" />

import ko = require("knockout");
import LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import ManualEntry = require("../manualentry/manualentry");
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import searchService = Microsoft.DataStudio.DataCatalog.Services.SearchService
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;
import utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import router = Microsoft.DataStudio.Application.Router;

export var template: string = require("text!./publish.html");

class viewModel {
    resx = resx;
    logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
    showNotification = ko.observable<boolean>(false);

    constructor(parameters: any) {
        this.logger.logInfo("viewing the publish page");
        if (this.showMessage()) {
            this.showNotification(true);
        }
    }

    closeNotification() {
        this.logger.logInfo("closing notification");
        this.showNotification(false);
    }

    redirectToUrl() {
        this.logger.logInfo("launch publisher button");
        window.location.assign($tokyo.publishingLink);
    }

    openManualEntry() {
        this.logger.logInfo("open manual entry dialog");
        var buttons: Interfaces.IModalButton[] = [
            { id: "create-more", isDefault: false, text: resx.createMoreAssets },
            { id: "navigate", isDefault: false, text: resx.createAndViewPortal }
        ];
        modalService.show({ title: resx.manualEntryTitle, component: "datacatalog-publish-manualentry", buttons: buttons }).done((modal) => {
            this.resolveManualEntry(modal);
        });
    }

    private resolveManualEntry(modal: Interfaces.IModalResolver) {
        this.logger.logInfo("resolve manual entry dialog");
        var entry = (<ManualEntry.viewModel>ko.dataFor(document.getElementById("manual-entry")));
        if (entry.isValid()) {
            entry.submitEntry().done((id) => {
                if (modal.button() === "navigate") {
                    var time = entry.assetCreatedTime.toLocaleDateString();
                    var searchTerm = utils.stringFormat("upn={0} AND lastRegisteredTime > '{1}'", $tokyo.user.upn, time);

                    var deferred = $.Deferred();
                    var timeout = setTimeout(() => {
                        deferred.reject("timeout");
                    }, 1000 * 60 * 5);

                    var key = id.split("/")[1];
                    var checkTerm = key + " and upn=" + $tokyo.user.upn;

                    var check = () => {
                        searchService.search({ searchTerms: checkTerm, capture: false }).done((result) => {
                            if (result.results.length > 0) {
                                clearTimeout(timeout);
                                deferred.resolve();
                            }
                            else {
                                setTimeout(check, 1500);
                            }
                        }).fail(deferred.reject);
                    };
                    check();

                    deferred
                        .always(() => {
                            clearTimeout(timeout);
                            this.logger.logInfo("close manual entry dialog");
                            modal.close();
                            browseManager.searchText(searchTerm);

                            browseManager.doSearch().done(() => {
                                router.navigate("datacatalog/browse/?searchTerms=" + searchTerm);
                            });
                        });
                }
                else if (modal.button() === "create-more") {
                    modal.reset().done((rModal) => {
                        this.resolveManualEntry(rModal);
                    });
                }
                else {
                    this.logger.logInfo("cancel manual entry dialog");
                    modal.close();
                }
            });
        }
        else {
            modal.reset().done((rModal) => {
                this.resolveManualEntry(rModal);
            });
        }
    }

    showMessage = ko.pureComputed(() => {
        return this.isInitial() || this.hasZeroResults();
    });

    isInitial() {
        return this.getQueryStrings()["initial"] === "true";
    }

    hasZeroResults() {
        return this.getQueryStrings()["zeroresults"] === "true";
    }

    getQueryStrings() {
        var queryStringPairs = [], queryString: string[];
        var hashUrl = window.location.hash.substring(1);
        var queryParameters = hashUrl.split("?");
        if (queryParameters && queryParameters.length > 1) {
            var queryStrings = queryParameters[1].split("&");
            for (var i = 0; i < queryStrings.length; i++) {
                queryString = queryStrings[i].split("=");
                queryStringPairs.push(queryString[0]);
                queryStringPairs[queryString[0]] = queryString[1];
            }
        }
        return queryStringPairs;
    }
}