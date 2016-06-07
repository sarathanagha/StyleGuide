///<dic// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./admin.html", "css!./admin.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var provisioningService = Microsoft.DataStudio.DataCatalog.Services.ProvisioningService;
    var userService = Microsoft.DataStudio.DataCatalog.Services.UserService;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
    exports.template = require("text!./admin.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            this.dataCatalogName = ko.observable("");
            this.subscription = ko.observable("");
            this.location = ko.observable("");
            this.resourceGroupName = ko.observable("");
            this.selectedPricing = ko.observable("Free");
            this.numberOfUnits = ko.observable(1);
            this.pricingExpanded = ko.observable(true);
            this.usersExpanded = ko.observable(true);
            this.adminsExpanded = ko.observable(true);
            this.deleteExpanded = ko.observable(false);
            this.users = ko.observableArray([]);
            this.invalidUsers = ko.observable([]);
            this.failedUsers = ko.observable([]);
            this.duplicatedUsers = ko.observable([]);
            this.validatingUsers = ko.observable(false);
            this.admins = ko.observableArray([]);
            this.invalidAdmins = ko.observable([]);
            this.failedAdmins = ko.observable([]);
            this.validatingAdmins = ko.observable(false);
            this.duplicatedAdmins = ko.observable([]);
            this.securityGroupsWithDistributionLists = ko.observableArray([]);
            this.updatingCatalog = ko.observable(false);
            this.deletingCatalog = ko.observable(false);
            this.loadingAdmins = ko.observable(true);
            this.loadingUsers = ko.observable(true);
            this.calculatingNumberOfUnits = ko.observable(false);
            this.calculatedNumberOfUnits = ko.observable();
            this.catalogInfoSnapshot = ko.observable(null);
            this.enableUserGroups = ko.observable(false);
            this.unitsText = ko.pureComputed(function () {
                var groupsEnabled = _this.enableUserGroups();
                var calculatedNumberOfUnits = _this.calculatedNumberOfUnits() || 0;
                var userEnteredNumberOfUnits = _this.numberOfUnits() || 0;
                if (groupsEnabled) {
                    return util.stringFormat(resx.unitsUnitsFormat, calculatedNumberOfUnits, calculatedNumberOfUnits * 100);
                }
                return util.stringFormat(resx.unitsUnitsFormat, userEnteredNumberOfUnits, userEnteredNumberOfUnits * 100);
            });
            this.allObjectIds = ko.pureComputed(function () {
                var usersObjectIds = _this.users().map(function (user) { return _this._upnMap[user.name]; });
                var adminObjectIds = _this.admins().map(function (admin) { return _this._upnMap[admin.name]; });
                return util.arrayDistinct(usersObjectIds.concat(adminObjectIds));
            });
            this.pricingSummary = ko.pureComputed(function () {
                return util.stringFormat("{0} - {1}. {2}.", resx[_this.selectedPricing().toLowerCase() + "Edition"], resx[_this.selectedPricing().toLowerCase() + "PricingTermsUsers"], resx[_this.selectedPricing().toLowerCase() + "PricingTermsAssets"]);
            });
            this.catalogUsersSummary = ko.pureComputed(function () {
                var users = _this.users().map(function (attr) { return attr.name; });
                var ellipsis = "";
                if (users.length > 4) {
                    users = users.slice(0, 4);
                    ellipsis = "...";
                }
                return util.stringFormat(resx.usersAddedFormat, _this.users().length, users.join(", ") + ellipsis);
            });
            this.deleteCatalogSettingsTitle = ko.pureComputed(function () {
                return util.stringFormat(resx.deleteCatalogSettingTitleFormat, _this.dataCatalogName());
            });
            this.catalogAdministratorsSummary = ko.pureComputed(function () {
                var admins = _this.admins().map(function (attr) { return attr.name; });
                var ellipsis = "";
                if (admins.length > 4) {
                    admins = admins.slice(0, 4);
                    ellipsis = "...";
                }
                return util.stringFormat(resx.usersAddedFormat, _this.admins().length, admins.join(", ") + ellipsis);
            });
            this._upnMap = {};
            this._objectIdMap = {};
            this.invalidUsersText = ko.pureComputed(function () {
                if (_this.invalidUsers().length) {
                    return util.stringFormat(resx.invalidUsersMessageFormat, "\"" + _this.invalidUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.invalidAdminsText = ko.pureComputed(function () {
                if (_this.invalidAdmins().length) {
                    return util.stringFormat(resx.invalidUsersMessageFormat, "\"" + _this.invalidAdmins().join("\", \"") + "\"");
                }
                return "";
            });
            this.securityGroupsWarningText = ko.pureComputed(function () {
                var currentUserUpns = _this.users().map(function (u) { return u.name; });
                var allSecurityGroupsWithDistributionGroups = _this.securityGroupsWithDistributionLists();
                var currentSecurityGroupsWithDistributionGroups = util.arrayIntersect(currentUserUpns, allSecurityGroupsWithDistributionGroups);
                if (currentSecurityGroupsWithDistributionGroups.length) {
                    return util.stringFormat(resx.securityGroupsWithDistributionListsErrorFormat, "\"" + currentSecurityGroupsWithDistributionGroups.join("\", \"") + "\"");
                }
                return "";
            });
            this.duplicatedUsersText = ko.pureComputed(function () {
                if (_this.duplicatedUsers().length) {
                    return util.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + _this.duplicatedUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.duplicatedAdminsText = ko.pureComputed(function () {
                if (_this.duplicatedAdmins().length) {
                    return util.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + _this.duplicatedAdmins().join("\", \"") + "\"");
                }
                return "";
            });
            this.failedUsersText = ko.pureComputed(function () {
                if (_this.failedUsers().length) {
                    return util.stringFormat(resx.failedUsersMessageFormat, "\"" + _this.failedUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.failedAdminsText = ko.pureComputed(function () {
                if (_this.failedAdmins().length) {
                    return util.stringFormat(resx.failedUsersMessageFormat, "\"" + _this.failedAdmins().join("\", \"") + "\"");
                }
                return "";
            });
            this.isUpdatable = ko.pureComputed(function () {
                if (!_this.catalogInfoSnapshot()) {
                    return false;
                }
                var users = util.arrayDistinct(_this.users().map(function (u) { return u.name; }));
                var snapUsers = util.arrayDistinct(_this.catalogInfoSnapshot().users.map(function (s) { return s.upn; }));
                var admins = util.arrayDistinct(_this.admins().map(function (a) { return a.name; }));
                var snapAdmins = util.arrayDistinct(_this.catalogInfoSnapshot().admins.map(function (s) { return s.upn; }));
                var snapEnabledGroups = _this.catalogInfoSnapshot().enableAutomaticUnitAdjustment;
                return ((_this.selectedPricing() === "Free" || (_this.selectedPricing() === "Standard" && (_this.numberOfUnits() > 0 || _this.enableUserGroups()))) &&
                    _this.users() && _this.users().length &&
                    _this.admins() && _this.admins().length &&
                    (_this.catalogInfoSnapshot() && (_this.selectedPricing() !== _this.catalogInfoSnapshot().sku ||
                        _this.numberOfUnits() !== _this.catalogInfoSnapshot().units ||
                        !_this.compareArrays(admins, snapAdmins) ||
                        !_this.compareArrays(users, snapUsers) ||
                        _this.enableUserGroups() !== snapEnabledGroups)));
            });
            this.logger.logInfo("update catalog settings");
            var subscription = this.selectedPricing.subscribe(function (newValue) {
                if (newValue.toLowerCase() === "free") {
                    _this.enableUserGroups(false);
                    _this.numberOfUnits(0);
                }
                else {
                    _this.numberOfUnits((_this.catalogInfoSnapshot() && _this.catalogInfoSnapshot().units) || 1);
                }
            });
            var enabledGroupsSubscription = this.enableUserGroups.subscribe(function (newValue) {
                if (newValue) {
                    _this.updateUnitCounts(_this.allObjectIds());
                }
            });
            var usersSubscription = this.users.subscribe(function () {
                _this.updateUnitCounts(_this.allObjectIds());
            });
            var adminsSubscription = this.admins.subscribe(function () {
                _this.updateUnitCounts(_this.allObjectIds());
            });
            this.dispose = function () {
                subscription.dispose();
                enabledGroupsSubscription.dispose();
                usersSubscription.dispose();
                adminsSubscription.dispose();
            };
            this.initialize();
        }
        viewModel.prototype.onValidateUsers = function (upns, userType) {
            var _this = this;
            var deferred = jQuery.Deferred();
            var validatingObservable = userType === "users" ? this.validatingUsers : this.validatingAdmins;
            var groupBehavior = userType === "users"
                ? this.enableUserGroups() ? "Allow" : "Expand"
                : "Expand";
            validatingObservable(true);
            userService.resolveUpns(upns, groupBehavior)
                .then(function (result) {
                var validUpns = [];
                (result.valid || []).forEach(function (user) {
                    validUpns.push(user.upn);
                    _this._upnMap[user.upn] = user.objectId;
                    _this._objectIdMap[user.objectId] = user.upn;
                    if (user.containsDistributionLists) {
                        _this.securityGroupsWithDistributionLists.push(user.upn);
                    }
                });
                deferred.resolve(validUpns);
                if (userType === "users") {
                    _this.invalidUsers(result.invalid || []);
                    _this.failedUsers(result.failed || []);
                    _this.duplicatedUsers(result.duplicated || []);
                }
                else if (userType === "admins") {
                    _this.invalidAdmins(result.invalid || []);
                    _this.failedAdmins(result.failed || []);
                    _this.duplicatedAdmins(result.duplicated || []);
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
        viewModel.prototype.compareArrays = function (current, snapshot) {
            var arraysEqual = true;
            current = current || [];
            snapshot = snapshot || [];
            if (current.length !== snapshot.length) {
                arraysEqual = false;
            }
            if (arraysEqual) {
                var currentHash = {};
                current.forEach(function (s) {
                    currentHash[s] = true;
                });
                for (var i = 0; i < snapshot.length; i++) {
                    if (!currentHash[snapshot[i]]) {
                        arraysEqual = false;
                        break;
                    }
                }
            }
            return arraysEqual;
        };
        viewModel.prototype.updateCatalog = function () {
            var _this = this;
            if (this.isUpdatable()) {
                this.updatingCatalog(true);
                var catalog = {
                    name: this.dataCatalogName(),
                    subscriptionId: this.subscription(),
                    location: this.location(),
                    resourceGroupName: this.resourceGroupName(),
                    sku: this.selectedPricing(),
                    units: this.enableUserGroups() ? 0 : this.numberOfUnits(),
                    users: this.users().map(function (user) { return { upn: user.name, objectId: _this._upnMap[user.name] }; }),
                    admins: this.admins().map(function (admin) { return { upn: admin.name, objectId: _this._upnMap[admin.name] }; }),
                    enableAutomaticUnitAdjustment: this.enableUserGroups()
                };
                var logData = $.extend({}, catalog);
                logData.numberOfAdmins = (logData.admins || []).length;
                logData.numberOfUsers = (logData.users || []).length;
                delete logData.admins;
                delete logData.users;
                this.logger.logInfo("updating catalog", logData);
                var onFail = function (e, logMessage, modalBody) {
                    _this.logger.logWarning(logMessage, e);
                    modalService.show({ title: resx.error, bodyText: modalBody, hideCancelButton: true })
                        .done(function (modal) {
                        modal.close();
                        _this.updatingCatalog(false);
                    });
                };
                //// check users update
                var usersUpdated = false;
                var currentUsers = [];
                var updatedUsers = [];
                this.catalogInfoSnapshot().users.forEach(function (u) {
                    currentUsers.push(u.objectId);
                });
                catalog.users.forEach(function (u) {
                    updatedUsers.push(u.objectId);
                });
                currentUsers = util.arrayDistinct(currentUsers.map($.trim)).sort();
                updatedUsers = util.arrayDistinct(updatedUsers.map($.trim)).sort();
                var currentUsersString = currentUsers.join(";");
                var updatedUsersString = updatedUsers.join(";");
                if (currentUsersString !== updatedUsersString) {
                    usersUpdated = true;
                }
                //// check admins update
                var adminsUpdated = false;
                var currentAdmins = [];
                var updatedAdmins = [];
                this.catalogInfoSnapshot().admins.forEach(function (u) {
                    currentAdmins.push(u.objectId);
                });
                catalog.admins.forEach(function (u) {
                    updatedAdmins.push(u.objectId);
                });
                currentAdmins = util.arrayDistinct(currentAdmins.map($.trim)).sort();
                updatedAdmins = util.arrayDistinct(updatedAdmins.map($.trim)).sort();
                var currentAdminsString = currentAdmins.join(";");
                var updatedAdminsString = updatedAdmins.join(";");
                if (currentAdminsString !== updatedAdminsString) {
                    adminsUpdated = true;
                }
                //// check sku update
                var skuUpdated = (catalog.sku !== this.catalogInfoSnapshot().sku) || (catalog.units !== this.catalogInfoSnapshot().units);
                var enableGroupsUpdated = catalog.enableAutomaticUnitAdjustment !== this.catalogInfoSnapshot().enableAutomaticUnitAdjustment;
                var updateCatalogArm = enableGroupsUpdated || skuUpdated ? function () { return provisioningService.updateCatalog(catalog); } : function () { return $.Deferred().resolve().promise(); };
                var updateCatalogRp = (adminsUpdated || usersUpdated) && !skuUpdated ? function () { return provisioningService.updateCatalogRp(catalog); } : function () { return $.Deferred().resolve().promise(); };
                updateCatalogArm()
                    .done(function () {
                    updateCatalogRp()
                        .done(function () {
                        $tokyo.catalogInfo.sku = _this.selectedPricing();
                        $tokyo.catalogInfo.units = _this.numberOfUnits();
                        $tokyo.catalogInfo.administrators = _this.admins().map(function (attributeInfo) { return { upn: attributeInfo.name, objectId: _this._upnMap[attributeInfo.name] }; });
                        $tokyo.catalogInfo.users = _this.users().map(function (attributeInfo) { return { upn: attributeInfo.name, objectId: _this._upnMap[attributeInfo.name] }; });
                        $tokyo.catalogInfo.enableAutomaticUnitAdjustment = _this.enableUserGroups();
                        _this.updatingCatalog(false);
                        _this.initialize();
                    })
                        .fail(function (e) { onFail(e, "failed to update the catalog", resx.errorUpdatingCatalog); });
                })
                    .fail(function (jqXhr) {
                    var isClientError = Math.floor(jqXhr.status / 100) === 4;
                    var msg = resx.errorUpdatingCatalog;
                    if (isClientError && jqXhr && jqXhr.responseJSON && jqXhr.responseJSON.error && jqXhr.responseJSON.error.message) {
                        msg = jqXhr.responseJSON.error.message;
                    }
                    if (jqXhr.status === 403) {
                        msg = resx.invalidPricingUpdate;
                    }
                    onFail(jqXhr, "failed to update catalog", msg);
                });
            }
        };
        viewModel.prototype.deleteCatalog = function () {
            var _this = this;
            var catalogInfo = $tokyo.catalogInfo;
            if (catalogInfo) {
                var body = util.stringFormat(resx.confirmDeleteCatalogFormat, util.plainText(catalogInfo.name));
                modalService.show({ title: resx.confirmDeleteTitle, bodyText: body })
                    .done(function (modal) {
                    _this.deletingCatalog(true);
                    provisioningService.deleteCatalog(catalogInfo.subscriptionId, catalogInfo.name, catalogInfo.location, catalogInfo.resourceGroupName)
                        .done(function () {
                        userService.waitUntilNotAllowed()
                            .done(function () {
                            modal.close();
                            _this.deletingCatalog(false);
                            //router.reload();
                        })
                            .fail(function () {
                            modal.close();
                            _this.deletingCatalog(false);
                        });
                    })
                        .fail(function () {
                        modal.close();
                        _this.deletingCatalog(false);
                    });
                });
            }
        };
        viewModel.prototype.cancel = function () {
            this.users([]);
            this.admins([]);
            this.initialize();
        };
        viewModel.prototype.updateUnitCounts = function (objectIds) {
            var _this = this;
            var loadingUsers = this.loadingUsers();
            var loadingAdmins = this.loadingAdmins();
            if (this.enableUserGroups() && !loadingUsers && !loadingAdmins) {
                this.calculatingNumberOfUnits(true);
                userService.getUnitsForAutoUnitAdjustCatalog(objectIds)
                    .done(function (result) {
                    _this.calculatedNumberOfUnits(result.value);
                })
                    .always(function () {
                    _this.calculatingNumberOfUnits(false);
                });
            }
        };
        viewModel.prototype.initialize = function () {
            var _this = this;
            var catalogInfo = $tokyo.catalogInfo;
            if (catalogInfo) {
                this.dataCatalogName(catalogInfo.name);
                this.subscription(catalogInfo.subscriptionId);
                this.location(catalogInfo.location);
                this.resourceGroupName(catalogInfo.resourceGroupName);
                this.selectedPricing(catalogInfo.sku);
                this.numberOfUnits(catalogInfo.units);
                this.enableUserGroups(catalogInfo.enableAutomaticUnitAdjustment);
                this.calculatingNumberOfUnits(this.enableUserGroups());
                var admins = catalogInfo.administrators;
                var users = catalogInfo.users;
                var objectIds = [];
                if (admins) {
                    admins.forEach(function (a) {
                        objectIds.push(a.objectId);
                    });
                }
                if (users) {
                    users.forEach(function (u) {
                        objectIds.push(u.objectId);
                    });
                }
                this.admins([]);
                this.users([]);
                this.loadingAdmins(true);
                this.loadingUsers(true);
                userService.resolveObjectIds(objectIds)
                    .then(function (result) {
                    result.valid.forEach(function (r) {
                        _this._upnMap[r.upn] = r.objectId;
                        _this._objectIdMap[r.objectId] = r.upn;
                        if (r.containsDistributionLists) {
                            _this.securityGroupsWithDistributionLists.push(r.upn);
                        }
                    });
                    if (admins) {
                        admins.forEach(function (a) {
                            _this.admins.push({ name: _this._objectIdMap[a.objectId], readOnly: a.objectId === $tokyo.user.objectId });
                        });
                    }
                    _this.loadingAdmins(false);
                    if (users) {
                        users.forEach(function (u) {
                            _this.users.push({ name: _this._objectIdMap[u.objectId], readOnly: u.objectId === $tokyo.user.objectId });
                        });
                    }
                    _this.loadingUsers(false);
                    _this.updateUnitCounts(objectIds);
                    _this.catalogInfoSnapshot({
                        name: _this.dataCatalogName(),
                        subscriptionId: _this.subscription(),
                        location: _this.location(),
                        resourceGroupName: _this.resourceGroupName(),
                        sku: _this.selectedPricing(),
                        units: _this.enableUserGroups() ? 0 : _this.numberOfUnits(),
                        users: _this.users().map(function (user) { return { upn: user.name, objectId: _this._upnMap[user.name] }; }),
                        admins: _this.admins().map(function (admin) { return { upn: admin.name, objectId: _this._upnMap[admin.name] }; }),
                        enableAutomaticUnitAdjustment: _this.enableUserGroups()
                    });
                });
            }
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=admin.js.map