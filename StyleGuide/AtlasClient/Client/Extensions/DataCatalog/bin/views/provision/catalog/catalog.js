// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./catalog.html", "css!./catalog.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var provisioningService = Microsoft.DataStudio.DataCatalog.Services.ProvisioningService;
    var userService = Microsoft.DataStudio.DataCatalog.Services.UserService;
    var LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
    var utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./catalog.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            this.dataCatalogName = ko.observable("");
            this.catalogNameIsValid = ko.observable(true);
            this.selectedPricing = ko.observable("Free");
            this.numberOfUnits = ko.observable(2);
            this.pricingExpanded = ko.observable(false);
            this.loadingSubscriptions = ko.observable(true);
            this.loadingLocations = ko.observable(true);
            this.noSubscriptionsFound = ko.observable(false);
            this.subscriptions = ko.observable();
            this.subscription = ko.observable({ displayName: resx.loadingSubscriptions + "...", subscriptionId: null });
            this.locations = ko.observable();
            this.location = ko.observable(resx.loadingLocations + "...");
            this.usersExpanded = ko.observable(false);
            this.adminsExpanded = ko.observable(false);
            this.users = ko.observableArray([]);
            this.invalidUsers = ko.observable([]);
            this.validatingUsers = ko.observable(false);
            this.admins = ko.observableArray([]);
            this.invalidAdmins = ko.observable([]);
            this.validatingAdmins = ko.observable(false);
            this.creatingCatalog = ko.observable(false);
            this.unitsText = ko.pureComputed(function () {
                return utils.stringFormat(resx["unitsUnitsFormat"], _this.numberOfUnits(), _this.numberOfUnits() * 100);
            });
            this.pricingSummary = ko.pureComputed(function () {
                return utils.stringFormat("{0} - {1}. {2}.", resx[_this.selectedPricing().toLowerCase() + "Edition"], resx[_this.selectedPricing().toLowerCase() + "PricingTermsUsers"], resx[_this.selectedPricing().toLowerCase() + "PricingTermsAssets"]);
            });
            this.catalogUsersSummary = ko.pureComputed(function () {
                var users = _this.users().map(function (attr) { return attr.name; });
                var ellipsis = "";
                if (users.length > 4) {
                    users = users.slice(0, 4);
                    ellipsis = "...";
                }
                return utils.stringFormat(resx.usersAddedFormat, _this.users().length, users.join(", ") + ellipsis);
            });
            this.catalogAdministratorsSummary = ko.pureComputed(function () {
                var admins = _this.admins().map(function (attr) { return attr.name; });
                var ellipsis = "";
                if (admins.length > 4) {
                    admins = admins.slice(0, 4);
                    ellipsis = "...";
                }
                return utils.stringFormat(resx.usersAddedFormat, _this.admins().length, admins.join(", ") + ellipsis);
            });
            this._upnMap = {};
            this.invalidUsersText = ko.pureComputed(function () {
                if (_this.invalidUsers().length) {
                    return utils.stringFormat(resx.invalidUsersMessageFormat, "\"" + _this.invalidUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.invalidAdminsText = ko.pureComputed(function () {
                if (_this.invalidAdmins().length) {
                    return utils.stringFormat(resx.invalidUsersMessageFormat, "\"" + _this.invalidAdmins().join("\", \"") + "\"");
                }
                return "";
            });
            this.isCreateable = ko.pureComputed(function () {
                return _this.testCatalogName() &&
                    _this.subscription() && _this.subscription().subscriptionId &&
                    _this.location() && !new RegExp("^" + resx.loadingLocations).test(_this.location()) &&
                    (_this.selectedPricing() === "Free" || (_this.selectedPricing() === "Standard" && _this.numberOfUnits() > 0)) &&
                    _this.users() && _this.users().length &&
                    _this.admins() && _this.admins().length;
            });
            this.logger.logInfo("provision new data catalog");
            this.loadingSubscriptions(true);
            // Add current user as user and admin
            this.onValidateUsers([$tokyo.user.email], "users")
                .done(function () {
                _this.users.push({ name: $tokyo.user.email, readOnly: true });
                _this.admins.push({ name: $tokyo.user.email, readOnly: true });
            })
                .fail(function (e) {
                _this.logger.logError("failed to resolve current user for provisioning", e);
            })
                .always(function () {
                provisioningService.getSubscriptions()
                    .done(function (result) {
                    if (result && result.value && result.value.length) {
                        _this.subscriptions(result.value);
                        _this.subscription(result.value.first());
                    }
                    else {
                        _this.logger.logInfo("no subscriptions found");
                        _this.noSubscriptionsFound(true);
                    }
                })
                    .fail(function (e) {
                    _this.logger.logError("failed to get subscriptions", e);
                })
                    .always(function () {
                    _this.loadingSubscriptions(false);
                });
            });
            var subscription = this.subscription.subscribe(function (subscription) {
                _this.loadingLocations(true);
                _this.location(resx.loadingLocations + "...");
                provisioningService.getLocations(subscription.subscriptionId)
                    .done(function (result) {
                    if (result && result.value && result.value.length) {
                        _this.locations(result.value);
                        _this.location(result.value.first());
                    }
                })
                    .fail(function (e) {
                    _this.logger.logError("failed to get locations", e);
                })
                    .always(function () {
                    _this.loadingLocations(false);
                });
            });
            this.dispose = function () {
                subscription.dispose();
            };
        }
        viewModel.prototype.testCatalogName = function () {
            var isValid = /^[a-zA-Z0-9-]{2,26}$/.test(this.dataCatalogName());
            return isValid;
        };
        viewModel.prototype.validateCatalogName = function () {
            var isValid = this.testCatalogName();
            this.catalogNameIsValid(isValid);
        };
        viewModel.prototype.onValidateUsers = function (upns, userType) {
            var _this = this;
            var deferred = jQuery.Deferred();
            var validatingObservable = userType === "users" ? this.validatingUsers : this.validatingAdmins;
            validatingObservable(true);
            userService.resolveUpns(upns, "Expand")
                .then(function (result) {
                var validUpns = [];
                (result.valid || []).forEach(function (user) {
                    validUpns.push(user.upn);
                    _this._upnMap[user.upn] = user.objectId;
                });
                deferred.resolve(validUpns);
                if (userType === "users") {
                    _this.invalidUsers(result.invalid || []);
                }
                else if (userType === "admins") {
                    _this.invalidAdmins(result.invalid || []);
                }
            })
                .fail(function (e) {
                _this.logger.logError("failed to validate upns", e);
            })
                .always(function () {
                validatingObservable(false);
            });
            return deferred.promise();
        };
        viewModel.prototype.createCatalog = function () {
            var _this = this;
            if (this.isCreateable()) {
                this.creatingCatalog(true);
                var catalog = {
                    name: this.dataCatalogName(),
                    subscription: this.subscription().displayName,
                    subscriptionId: this.subscription().subscriptionId,
                    location: this.location(),
                    sku: this.selectedPricing(),
                    units: this.numberOfUnits(),
                    users: this.users().map(function (user) { return { upn: user.name, objectId: _this._upnMap[user.name] }; }),
                    admins: this.admins().map(function (admin) { return { upn: admin.name, objectId: _this._upnMap[admin.name] }; })
                };
                var logData = $.extend({}, catalog);
                logData.numberOfAdmins = (logData.admins || []).length;
                logData.numberOfUsers = (logData.users || []).length;
                delete logData.admins;
                delete logData.users;
                this.logger.logInfo("creating catalog", logData);
                var onFail = function (e, logMessage, modalBody) {
                    _this.logger.logError(logMessage, e);
                    modalService.show({ title: resx.error, bodyText: modalBody, hideCancelButton: true })
                        .done(function (modal) {
                        modal.close();
                        _this.creatingCatalog(false);
                    });
                };
                provisioningService.registerSubscription(catalog.subscriptionId)
                    .done(function () {
                    provisioningService.createResourceGroup(catalog.subscriptionId, catalog.location)
                        .done(function () {
                        provisioningService.createCatalog(catalog)
                            .done(function () {
                            /*
                            // TODO (stpryor): Find out why the addUsersToCatalog method is missing from the service
                            provisioningService.addUsersToCatalog(catalog.users)
                                .done(() => {
                                    this.creatingCatalog(false);
                                    //router.reload("/home/InitialPublish");
                                })
                                .fail(e => { onFail(e, "failed to add users to catalog", resx.errorAddingUsersCatalog)});
*/
                        })
                            .fail(function (e) { onFail(e, "failed to create catalog", resx.errorCreatingCatalog); });
                    })
                        .fail(function (e) { onFail(e, "failed to create resource group", resx.errorCreatingCatalog); });
                })
                    .fail(function (e) { onFail(e, "failed to register subscription", resx.errorCreatingCatalog); });
            }
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=catalog.js.map