// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./catalog.html" />
/// <amd-dependency path="css!./catalog.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import provisioningService = Microsoft.DataStudio.DataCatalog.Services.ProvisioningService;
import userService = Microsoft.DataStudio.DataCatalog.Services.UserService;
import LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;
import utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./catalog.html");

export class viewModel {
    private dispose: () => void;
    public resx = resx;

    logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });

    dataCatalogName = ko.observable<string>("");
    catalogNameIsValid = ko.observable<boolean>(true);
    selectedPricing = ko.observable<string>("Free");
    numberOfUnits = ko.observable<number>(2);
    pricingExpanded = ko.observable<boolean>(false);

    loadingSubscriptions = ko.observable<boolean>(true);
    loadingLocations = ko.observable<boolean>(true);
    noSubscriptionsFound = ko.observable(false);
    subscriptions = ko.observable<{ displayName: string; subscriptionId: string}[]>();
    subscription = ko.observable({ displayName: resx.loadingSubscriptions + "...", subscriptionId: null});

    locations = ko.observable<string[]>();
    location = ko.observable<string>(resx.loadingLocations + "...");

    usersExpanded = ko.observable(false);
    adminsExpanded = ko.observable(false);

    users = ko.observableArray<Interfaces.IAttributeInfo>([]);
    invalidUsers = ko.observable<string[]>([]);
    validatingUsers = ko.observable<boolean>(false);
    admins = ko.observableArray<Interfaces.IAttributeInfo>([]);
    invalidAdmins = ko.observable<string[]>([]);
    validatingAdmins = ko.observable<boolean>(false);

    creatingCatalog = ko.observable<boolean>(false);

    constructor() {
        this.logger.logInfo("provision new data catalog");
        this.loadingSubscriptions(true);

        // Add current user as user and admin
        this.onValidateUsers([$tokyo.user.email], "users")
            .done(() => {
                this.users.push({ name: $tokyo.user.email, readOnly: true });
                this.admins.push({ name: $tokyo.user.email, readOnly: true });
            })
            .fail(e => {
                this.logger.logError("failed to resolve current user for provisioning", e);
            })
            .always(() => {
                provisioningService.getSubscriptions()
                    .done(result => {
                        if (result && result.value && result.value.length) {
                            this.subscriptions(result.value);
                            this.subscription(result.value.first());
                        } else {
                            this.logger.logInfo("no subscriptions found");
                            this.noSubscriptionsFound(true);
                        }
                    })
                    .fail(e => {
                        this.logger.logError("failed to get subscriptions", e);
                    })
                    .always(() => {
                    this.loadingSubscriptions(false);
                });
            });

        var subscription = this.subscription.subscribe(subscription => {
            this.loadingLocations(true);
            this.location(resx.loadingLocations + "...");
            provisioningService.getLocations(subscription.subscriptionId)
                .done(result => {
                    if (result && result.value && result.value.length) {
                        this.locations(result.value);
                        this.location(result.value.first());
                    }
                })
                .fail(e => {
                    this.logger.logError("failed to get locations", e);
                })
                .always(() => {
                    this.loadingLocations(false);
                });
        });

        this.dispose = () => {
            subscription.dispose();
        };
    }

    unitsText = ko.pureComputed(() => {
        return utils.stringFormat(resx["unitsUnitsFormat"], this.numberOfUnits(), this.numberOfUnits() * 100);
    });

    pricingSummary = ko.pureComputed(() => {
        return utils.stringFormat("{0} - {1}. {2}.", resx[this.selectedPricing().toLowerCase() + "Edition"],
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
        return utils.stringFormat(resx.usersAddedFormat, this.users().length, users.join(", ") + ellipsis);
    });

    catalogAdministratorsSummary = ko.pureComputed(() => {
        var admins = this.admins().map(attr => attr.name);
        var ellipsis = "";
        if (admins.length > 4) {
            admins = admins.slice(0, 4);
            ellipsis = "...";
        }
        return utils.stringFormat(resx.usersAddedFormat, this.admins().length, admins.join(", ") + ellipsis);
    });

    testCatalogName() {
        var isValid = /^[a-zA-Z0-9-]{2,26}$/.test(this.dataCatalogName());
        return isValid;
    }

    validateCatalogName() {
        var isValid = this.testCatalogName();
        this.catalogNameIsValid(isValid);
    }

    private _upnMap: { [upn: string]: string; } = {};

    onValidateUsers(upns: string[], userType: string) {
        var deferred = jQuery.Deferred();
        var validatingObservable = userType === "users" ? this.validatingUsers : this.validatingAdmins;

        validatingObservable(true);
        userService.resolveUpns(upns, "Expand")
            .then(result => {
                var validUpns = [];
                (result.valid || []).forEach(user => {
                    validUpns.push(user.upn);
                    this._upnMap[user.upn] = user.objectId;
                });
                deferred.resolve(validUpns);
                
                if (userType === "users") {
                    this.invalidUsers(result.invalid || []);
                } else if (userType === "admins") {
                    this.invalidAdmins(result.invalid || []);
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
            return utils.stringFormat(resx.invalidUsersMessageFormat, "\"" + this.invalidUsers().join("\", \"") + "\"");
        }
        return "";
    });

    invalidAdminsText = ko.pureComputed(() => {
        if (this.invalidAdmins().length) {
            return utils.stringFormat(resx.invalidUsersMessageFormat, "\"" + this.invalidAdmins().join("\", \"") + "\"");
        }
        return "";
    });

    isCreateable = ko.pureComputed(() => {
        return this.testCatalogName() &&
            this.subscription() && this.subscription().subscriptionId &&
            this.location() && !new RegExp("^" + resx.loadingLocations).test(this.location()) &&
            (this.selectedPricing() === "Free" || (this.selectedPricing() === "Standard" && this.numberOfUnits() > 0)) &&
            this.users() && this.users().length &&
            this.admins() && this.admins().length;
    });

    createCatalog() {
        if (this.isCreateable()) {
            this.creatingCatalog(true);

            var catalog: Interfaces.ICreateCatalog = {
                name: this.dataCatalogName(),
                subscription: this.subscription().displayName,
                subscriptionId: this.subscription().subscriptionId,
                location: this.location(),
                sku: this.selectedPricing(),
                units: this.numberOfUnits(),
                users: this.users().map(user => { return { upn: user.name, objectId: this._upnMap[user.name] }; }), 
                admins: this.admins().map(admin => { return { upn: admin.name, objectId: this._upnMap[admin.name] }; })
            };

            var logData = $.extend({}, catalog);
            logData.numberOfAdmins = (logData.admins || []).length;
            logData.numberOfUsers = (logData.users || []).length;
            delete logData.admins;
            delete logData.users;
            this.logger.logInfo("creating catalog", logData);

            var onFail = (e: any, logMessage: string, modalBody: string) => {
                this.logger.logError(logMessage, e);
                modalService.show({ title: resx.error, bodyText: modalBody, hideCancelButton: true })
                    .done((modal) => {
                        modal.close();
                        this.creatingCatalog(false);
                    });
            };

            provisioningService.registerSubscription(catalog.subscriptionId)
                .done(() => {
                    provisioningService.createResourceGroup(catalog.subscriptionId, catalog.location)
                        .done(() => {
                            provisioningService.createCatalog(catalog)
                                .done(() => {
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
                                .fail(e => { onFail(e, "failed to create catalog", resx.errorCreatingCatalog) });
                        })
                        .fail(e => { onFail(e, "failed to create resource group", resx.errorCreatingCatalog) });
                })
                .fail(e => { onFail(e, "failed to register subscription", resx.errorCreatingCatalog) });
        }
    }
}
