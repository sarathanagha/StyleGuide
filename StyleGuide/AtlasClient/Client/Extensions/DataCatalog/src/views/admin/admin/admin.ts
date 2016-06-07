///<dic// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./admin.html" />
/// <amd-dependency path="css!./admin.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import provisioningService = Microsoft.DataStudio.DataCatalog.Services.ProvisioningService;
import userService = Microsoft.DataStudio.DataCatalog.Services.UserService;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./admin.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;
    logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });

    dataCatalogName = ko.observable<string>("");
    subscription = ko.observable<string>("");
    location = ko.observable<string>("");
    resourceGroupName = ko.observable<string>("");

    selectedPricing = ko.observable<string>("Free");
    numberOfUnits = ko.observable<number>(1);
    pricingExpanded = ko.observable<boolean>(true);

    usersExpanded = ko.observable(true);
    adminsExpanded = ko.observable(true);
    deleteExpanded = ko.observable(false);

    users = ko.observableArray<Interfaces.IAttributeInfo>([]);
    invalidUsers = ko.observable<string[]>([]);
    failedUsers = ko.observable<string[]>([]);
    duplicatedUsers = ko.observable<string[]>([]);
    validatingUsers = ko.observable<boolean>(false);
    admins = ko.observableArray<Interfaces.IAttributeInfo>([]);
    invalidAdmins = ko.observable<string[]>([]);
    failedAdmins = ko.observable<string[]>([]);
    validatingAdmins = ko.observable<boolean>(false);
    duplicatedAdmins = ko.observable<string[]>([]);
    securityGroupsWithDistributionLists = ko.observableArray<string>([]);

    updatingCatalog = ko.observable<boolean>(false);
    deletingCatalog = ko.observable<boolean>(false);
    
    loadingAdmins = ko.observable<boolean>(true);
    loadingUsers = ko.observable<boolean>(true);
    calculatingNumberOfUnits = ko.observable<boolean>(false);
    calculatedNumberOfUnits = ko.observable<number>();

    catalogInfoSnapshot = ko.observable<Interfaces.ICreateCatalog>(null);

    enableUserGroups = ko.observable<boolean>(false);

    constructor() {
        this.logger.logInfo("update catalog settings");
        var subscription = this.selectedPricing.subscribe((newValue: string) => {
            if (newValue.toLowerCase() === "free") {
                this.enableUserGroups(false);
                this.numberOfUnits(0);
            }
            else {
                this.numberOfUnits((this.catalogInfoSnapshot() && this.catalogInfoSnapshot().units) || 1);
            }
        });

        var enabledGroupsSubscription = this.enableUserGroups.subscribe((newValue: boolean) => {
            if (newValue) {
                this.updateUnitCounts(this.allObjectIds());
            }
        });

        var usersSubscription = this.users.subscribe(() => {
            this.updateUnitCounts(this.allObjectIds());
        });

        var adminsSubscription = this.admins.subscribe(() => {
            this.updateUnitCounts(this.allObjectIds());
        });

        this.dispose = () => {
            subscription.dispose();
            enabledGroupsSubscription.dispose();
            usersSubscription.dispose();
            adminsSubscription.dispose();
        };
        this.initialize();
    }

    unitsText = ko.pureComputed(() => {
        var groupsEnabled = this.enableUserGroups();
        var calculatedNumberOfUnits = this.calculatedNumberOfUnits() || 0;
        var userEnteredNumberOfUnits = this.numberOfUnits() || 0;

        if (groupsEnabled) {
            return util.stringFormat(resx.unitsUnitsFormat, calculatedNumberOfUnits, calculatedNumberOfUnits * 100);
        } 
        return util.stringFormat(resx.unitsUnitsFormat, userEnteredNumberOfUnits, userEnteredNumberOfUnits * 100);
    });

    allObjectIds = ko.pureComputed<string[]>(() => {
        var usersObjectIds = this.users().map(user => this._upnMap[user.name]);
        var adminObjectIds = this.admins().map(admin => this._upnMap[admin.name]);
        return util.arrayDistinct(usersObjectIds.concat(adminObjectIds));
    });

    pricingSummary = ko.pureComputed(() => {
        return util.stringFormat("{0} - {1}. {2}.", resx[this.selectedPricing().toLowerCase() + "Edition"],
            resx[this.selectedPricing().toLowerCase() + "PricingTermsUsers"],
            resx[this.selectedPricing().toLowerCase() + "PricingTermsAssets"]);
    });

    catalogUsersSummary = ko.pureComputed(() => {
        var users = this.users().map(attr => attr.name);
        var ellipsis = "";
        if (users.length > 4) {
            users = users.slice(0, 4);
            ellipsis = "...";
        }
        return util.stringFormat(resx.usersAddedFormat, this.users().length, users.join(", ") + ellipsis);
    });

    deleteCatalogSettingsTitle = ko.pureComputed(() => {
        return util.stringFormat(resx.deleteCatalogSettingTitleFormat, this.dataCatalogName());
    });

    catalogAdministratorsSummary = ko.pureComputed(() => {
        var admins = this.admins().map(attr => attr.name);
        var ellipsis = "";
        if (admins.length > 4) {
            admins = admins.slice(0, 4);
            ellipsis = "...";
        }
        return util.stringFormat(resx.usersAddedFormat, this.admins().length, admins.join(", ") + ellipsis);
    });

    private _upnMap: { [upn: string]: string; } = {};
    private _objectIdMap: { [objectId: string]: string; } = {};

    onValidateUsers(upns: string[], userType: string) {
        var deferred = jQuery.Deferred();
        var validatingObservable = userType === "users" ? this.validatingUsers : this.validatingAdmins;

        var groupBehavior = userType === "users"
            ? this.enableUserGroups() ? "Allow" : "Expand"
            : "Expand";

        validatingObservable(true);
        userService.resolveUpns(upns, groupBehavior)
            .then(result => {
                var validUpns = [];

                (result.valid || []).forEach(user => {
                    validUpns.push(user.upn);
                    this._upnMap[user.upn] = user.objectId;
                    this._objectIdMap[user.objectId] = user.upn;
                    if (user.containsDistributionLists) {
                         this.securityGroupsWithDistributionLists.push(user.upn);
                    }
                });

                deferred.resolve(validUpns);

                if (userType === "users") {
                    this.invalidUsers(result.invalid || []);
                    this.failedUsers(result.failed || []);
                    this.duplicatedUsers(result.duplicated || []);
                } else if (userType === "admins") {
                    this.invalidAdmins(result.invalid || []);
                    this.failedAdmins(result.failed || []);
                    this.duplicatedAdmins(result.duplicated || []);
                }

            })
            .fail(e => {
                this.logger.logError("failed to validate upns", e);
            })
            .always(() => {
                validatingObservable(false);
            });

        return deferred.promise();
    }

    invalidUsersText = ko.pureComputed(() => {
        if (this.invalidUsers().length) {
            return util.stringFormat(resx.invalidUsersMessageFormat, "\"" + this.invalidUsers().join("\", \"") + "\"");
        }
        return "";
    });

    invalidAdminsText = ko.pureComputed(() => {
        if (this.invalidAdmins().length) {
            return util.stringFormat(resx.invalidUsersMessageFormat, "\"" + this.invalidAdmins().join("\", \"") + "\"");
        }
        return "";
    });

    securityGroupsWarningText = ko.pureComputed(() => {
        var currentUserUpns = this.users().map(u => u.name);
        var allSecurityGroupsWithDistributionGroups = this.securityGroupsWithDistributionLists();
        var currentSecurityGroupsWithDistributionGroups = util.arrayIntersect(currentUserUpns, allSecurityGroupsWithDistributionGroups);

        if (currentSecurityGroupsWithDistributionGroups.length) {
            return util.stringFormat(resx.securityGroupsWithDistributionListsErrorFormat, "\"" + currentSecurityGroupsWithDistributionGroups.join("\", \"") + "\"");
        }
        return "";
    });

    duplicatedUsersText = ko.pureComputed(() => {
        if (this.duplicatedUsers().length) {
            return util.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + this.duplicatedUsers().join("\", \"") + "\"");
        }
        return "";
    });

    duplicatedAdminsText = ko.pureComputed(() => {
        if (this.duplicatedAdmins().length) {
            return util.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + this.duplicatedAdmins().join("\", \"") + "\"");
        }
        return "";
    });

    failedUsersText = ko.pureComputed(() => {
        if (this.failedUsers().length) {
            return util.stringFormat(resx.failedUsersMessageFormat, "\"" + this.failedUsers().join("\", \"") + "\"");
        }
        return "";
    });

    failedAdminsText = ko.pureComputed(() => {
        if (this.failedAdmins().length) {
            return util.stringFormat(resx.failedUsersMessageFormat, "\"" + this.failedAdmins().join("\", \"") + "\"");
        }
        return "";
    });

    private compareArrays(current: Array<string>, snapshot: Array<string>): boolean {
        var arraysEqual: boolean = true;
        current = current || [];
        snapshot = snapshot || [];
        if (current.length !== snapshot.length) {
            arraysEqual = false;
        }

        if (arraysEqual) {
            var currentHash = {};
            current.forEach(s => {
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
    }

    isUpdatable = ko.pureComputed(() => {
        if (!this.catalogInfoSnapshot()) {
            return false;
        }
        var users = util.arrayDistinct(this.users().map(u => u.name));
        var snapUsers = util.arrayDistinct(this.catalogInfoSnapshot().users.map(s => s.upn)); 
        var admins = util.arrayDistinct(this.admins().map(a => a.name));
        var snapAdmins = util.arrayDistinct(this.catalogInfoSnapshot().admins.map(s => s.upn));
        var snapEnabledGroups = this.catalogInfoSnapshot().enableAutomaticUnitAdjustment;
        return ((this.selectedPricing() === "Free" || (this.selectedPricing() === "Standard" && (this.numberOfUnits() > 0 || this.enableUserGroups()))) &&
            this.users() && this.users().length &&
            this.admins() && this.admins().length &&
            (this.catalogInfoSnapshot() && (
                    this.selectedPricing() !== this.catalogInfoSnapshot().sku ||
                    this.numberOfUnits() !== this.catalogInfoSnapshot().units ||
                   !this.compareArrays(admins, snapAdmins) || 
                   !this.compareArrays(users, snapUsers) ||
                    this.enableUserGroups() !== snapEnabledGroups
                )
            )
        );
    });

    updateCatalog() {
        if (this.isUpdatable()) {
            this.updatingCatalog(true);
            
            var catalog: Interfaces.ICreateCatalog = {
                name: this.dataCatalogName(),
                subscriptionId: this.subscription(),
                location: this.location(),
                resourceGroupName: this.resourceGroupName(),
                sku: this.selectedPricing(),
                units: this.enableUserGroups() ? 0 : this.numberOfUnits(),
                users: this.users().map(user => { return { upn: user.name, objectId: this._upnMap[user.name] }; }),
                admins: this.admins().map(admin => { return { upn: admin.name, objectId: this._upnMap[admin.name] }; }),
                enableAutomaticUnitAdjustment: this.enableUserGroups()
            };

            var logData = $.extend({}, catalog);
            logData.numberOfAdmins = (logData.admins || []).length;
            logData.numberOfUsers = (logData.users || []).length;
            delete logData.admins;
            delete logData.users;
            this.logger.logInfo("updating catalog", logData);

            var onFail = (e: any, logMessage: string, modalBody: string) => {
                this.logger.logWarning(logMessage, e);
                modalService.show({ title: resx.error, bodyText: modalBody, hideCancelButton: true })
                    .done((modal) => {
                        modal.close();
                        this.updatingCatalog(false);
                });
            };
            
            //// check users update
            var usersUpdated = false;
            var currentUsers = [];
            var updatedUsers = [];

            this.catalogInfoSnapshot().users.forEach(u => {
                currentUsers.push(u.objectId);
            });

            catalog.users.forEach(u => {
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

            this.catalogInfoSnapshot().admins.forEach(u => {
                currentAdmins.push(u.objectId);
            });

            catalog.admins.forEach(u => {
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
            
            var updateCatalogArm = enableGroupsUpdated || skuUpdated ? () => { return provisioningService.updateCatalog(catalog); } : () => { return $.Deferred().resolve().promise(); }
            var updateCatalogRp = (adminsUpdated || usersUpdated) && !skuUpdated ? () => { return provisioningService.updateCatalogRp(catalog); } : () => { return $.Deferred().resolve().promise(); }

            updateCatalogArm()
                .done(() => {
                    updateCatalogRp()
                        .done(() => {
                            (<any>$tokyo).catalogInfo.sku = this.selectedPricing();
                            (<any>$tokyo).catalogInfo.units = this.numberOfUnits();
                            (<any>$tokyo).catalogInfo.administrators = this.admins().map(attributeInfo => { return { upn: attributeInfo.name, objectId: this._upnMap[attributeInfo.name] } });
                            (<any>$tokyo).catalogInfo.users = this.users().map(attributeInfo => { return { upn: attributeInfo.name, objectId: this._upnMap[attributeInfo.name] } });
                            (<any>$tokyo).catalogInfo.enableAutomaticUnitAdjustment = this.enableUserGroups();
                            this.updatingCatalog(false);
                            this.initialize();
                        })
                        .fail(e => { onFail(e, "failed to update the catalog", resx.errorUpdatingCatalog) });
                })
                .fail((jqXhr: JQueryXHR) => {
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
    }

    deleteCatalog() {
        var catalogInfo = (<any>$tokyo).catalogInfo;
        if (catalogInfo) {
            var body = util.stringFormat(resx.confirmDeleteCatalogFormat, util.plainText(catalogInfo.name));
            modalService.show({ title: resx.confirmDeleteTitle, bodyText: body })
                .done((modal) => {
                    this.deletingCatalog(true);
                    provisioningService.deleteCatalog(catalogInfo.subscriptionId, catalogInfo.name, catalogInfo.location, catalogInfo.resourceGroupName)
                        .done(() => {
                            userService.waitUntilNotAllowed()
                                .done(() => {
                                    modal.close();
                                    this.deletingCatalog(false);
                                    //router.reload();
                                })
                                .fail(() => {
                                    modal.close();
                                    this.deletingCatalog(false);
                                });
                        })
                        .fail(() => {
                            modal.close();
                            this.deletingCatalog(false);
                        });
                });
        }
    }

    cancel() {
        this.users([]);
        this.admins([]);
        this.initialize();
    }

    updateUnitCounts(objectIds: string[]) {
        var loadingUsers = this.loadingUsers();
        var loadingAdmins = this.loadingAdmins();

        if (this.enableUserGroups() && !loadingUsers && !loadingAdmins) {
            this.calculatingNumberOfUnits(true);
            userService.getUnitsForAutoUnitAdjustCatalog(objectIds)
                .done(result => {
                    this.calculatedNumberOfUnits(result.value);
                })
                .always(() => {
                    this.calculatingNumberOfUnits(false);
                });
        } 
    }

    initialize() {
        var catalogInfo = (<any>$tokyo).catalogInfo;
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
                admins.forEach(a => {
                    objectIds.push(a.objectId);
                });
            }

            if (users) {
                users.forEach(u => {
                    objectIds.push(u.objectId);
                });
            }

            this.admins([]);
            this.users([]);

            this.loadingAdmins(true);
            this.loadingUsers(true);

            userService.resolveObjectIds(objectIds)
                .then(result => {
                    result.valid.forEach(r => {
                        this._upnMap[r.upn] = r.objectId;
                        this._objectIdMap[r.objectId] = r.upn;

                        if (r.containsDistributionLists) {
                            this.securityGroupsWithDistributionLists.push(r.upn);
                        }
                    });

                    if (admins) {
                        admins.forEach(a => {
                            this.admins.push({ name: this._objectIdMap[a.objectId], readOnly: a.objectId === $tokyo.user.objectId });
                        });
                    }

                    this.loadingAdmins(false);
                    
                    if (users) {
                        users.forEach(u => {
                            this.users.push({ name: this._objectIdMap[u.objectId], readOnly: u.objectId === $tokyo.user.objectId });
                        });
                    }

                    this.loadingUsers(false);

                    this.updateUnitCounts(objectIds);

                    this.catalogInfoSnapshot({
                        name: this.dataCatalogName(),
                        subscriptionId: this.subscription(),
                        location: this.location(),
                        resourceGroupName: this.resourceGroupName(),
                        sku: this.selectedPricing(),
                        units: this.enableUserGroups() ? 0 : this.numberOfUnits(),
                        users: this.users().map(user => { return { upn: user.name, objectId: this._upnMap[user.name] }; }),
                        admins: this.admins().map(admin => { return { upn: admin.name, objectId: this._upnMap[admin.name] }; }),
                        enableAutomaticUnitAdjustment: this.enableUserGroups()
                    });
            });
        }
    }
}