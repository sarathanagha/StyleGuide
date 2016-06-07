// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
/// <reference path="../manualentry/manualentry.ts" />
define(["require", "exports", "knockout", "text!./publish.html", "css!./publish.css"], function (require, exports, ko) {
    var LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var searchService = Microsoft.DataStudio.DataCatalog.Services.SearchService;
    var utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var router = Microsoft.DataStudio.Application.Router;
    exports.template = require("text!./publish.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.resx = resx;
            this.logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            this.showNotification = ko.observable(false);
            this.showMessage = ko.pureComputed(function () {
                return _this.isInitial() || _this.hasZeroResults();
            });
            this.logger.logInfo("viewing the publish page");
            if (this.showMessage()) {
                this.showNotification(true);
            }
        }
        viewModel.prototype.closeNotification = function () {
            this.logger.logInfo("closing notification");
            this.showNotification(false);
        };
        viewModel.prototype.redirectToUrl = function () {
            this.logger.logInfo("launch publisher button");
            window.location.assign($tokyo.publishingLink);
        };
        viewModel.prototype.openManualEntry = function () {
            var _this = this;
            this.logger.logInfo("open manual entry dialog");
            var buttons = [
                { id: "create-more", isDefault: false, text: resx.createMoreAssets },
                { id: "navigate", isDefault: false, text: resx.createAndViewPortal }
            ];
            modalService.show({ title: resx.manualEntryTitle, component: "datacatalog-publish-manualentry", buttons: buttons }).done(function (modal) {
                _this.resolveManualEntry(modal);
            });
        };
        viewModel.prototype.resolveManualEntry = function (modal) {
            var _this = this;
            this.logger.logInfo("resolve manual entry dialog");
            var entry = ko.dataFor(document.getElementById("manual-entry"));
            if (entry.isValid()) {
                entry.submitEntry().done(function (id) {
                    if (modal.button() === "navigate") {
                        var time = entry.assetCreatedTime.toLocaleDateString();
                        var searchTerm = utils.stringFormat("upn={0} AND lastRegisteredTime > '{1}'", $tokyo.user.upn, time);
                        var deferred = $.Deferred();
                        var timeout = setTimeout(function () {
                            deferred.reject("timeout");
                        }, 1000 * 60 * 5);
                        var key = id.split("/")[1];
                        var checkTerm = key + " and upn=" + $tokyo.user.upn;
                        var check = function () {
                            searchService.search({ searchTerms: checkTerm, capture: false }).done(function (result) {
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
                            .always(function () {
                            clearTimeout(timeout);
                            _this.logger.logInfo("close manual entry dialog");
                            modal.close();
                            browseManager.searchText(searchTerm);
                            browseManager.doSearch().done(function () {
                                router.navigate("datacatalog/browse/?searchTerms=" + searchTerm);
                            });
                        });
                    }
                    else if (modal.button() === "create-more") {
                        modal.reset().done(function (rModal) {
                            _this.resolveManualEntry(rModal);
                        });
                    }
                    else {
                        _this.logger.logInfo("cancel manual entry dialog");
                        modal.close();
                    }
                });
            }
            else {
                modal.reset().done(function (rModal) {
                    _this.resolveManualEntry(rModal);
                });
            }
        };
        viewModel.prototype.isInitial = function () {
            return this.getQueryStrings()["initial"] === "true";
        };
        viewModel.prototype.hasZeroResults = function () {
            return this.getQueryStrings()["zeroresults"] === "true";
        };
        viewModel.prototype.getQueryStrings = function () {
            var queryStringPairs = [], queryString;
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
        };
        return viewModel;
    })();
});
//# sourceMappingURL=publish.js.map