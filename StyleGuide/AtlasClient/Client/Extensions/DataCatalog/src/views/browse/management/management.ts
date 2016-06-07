// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./management.html" />
/// <amd-dependency path="css!./management.css" />

import ko = require("knockout");
import $ = require("jquery");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import userService = Microsoft.DataStudio.DataCatalog.Services.UserService;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;
import utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./management.html");

export class viewModel {
    private dispose: () => void;
    private _upnMap: { [upn: string]: string; } = {}; // Upn -> ObjectId
    private _objectIdMap: { [objectId: string]: string; } = {}; // ObjectId -> upn

    resx = resx;
    entity = browseManager.selected;

    ownerAttributes = ko.observableArray<Interfaces.IAttributeInfo>([]);
    userAttributes = ko.observableArray<Interfaces.IAttributeInfo>([]);
    invalidOwners = ko.observable<string[]>([]);
    invalidUsers = ko.observable<string[]>([]);
    failedOwners = ko.observable<string[]>([]);
    failedUsers = ko.observable<string[]>([]);
    duplicatedUsers = ko.observable<string[]>([]);
    duplicatedOwners = ko.observable<string[]>([]);

    //#region state flags
    isResolvingObjectIds = ko.observable(true);
    validatingOwners = ko.observable<boolean>(false);
    validatingUsers = ko.observable<boolean>(false);

    isSettingOwners = ko.observable(false);
    successUpdatingOwners = ko.observable(false);

    isSettingUsers = ko.observable(false);
    successUpdatingUsers = ko.observable(false);

    private outstandingOwnerUpdates = 0;
    private outstandingUserUpdates = 0;
    //#endregion

    constructor() {
        var onSelectedChanged = (newValue: Interfaces.IBindableDataEntity) => {
            if (browseManager.selected()) {
                this.isResolvingObjectIds(true);
                this._objectIdMap[$tokyo.user.objectId] = $tokyo.user.email;
                this._upnMap[$tokyo.user.email] = $tokyo.user.objectId;

                this.resolveObjectIds()
                    .then((result: any) => {
                        if (result && result.valid && result.valid.length) {
                            result.valid.forEach(r => {
                                this._objectIdMap[r.objectId] = r.upn;
                                this._upnMap[r.upn] = r.objectId;
                            });
                        }
                        this.isResolvingObjectIds(false);
                        this.entity() && this.setManagementAttributes();
                    });
            }
        };

        onSelectedChanged(browseManager.selected());
        var subscription = browseManager.selected.subscribe(onSelectedChanged);

        this.dispose = () => {
            subscription.dispose();
        };
    }

    resolveObjectIds() {
        var deferred = $.Deferred();

        var objectIds = [];
        (this.entity().__roles() || []).forEach(r => {
            objectIds = objectIds.concat(r.members().map(m => m.objectId));
        });
        (this.entity().__permissions() || []).forEach(p => {
            objectIds.push(p.principal.objectId);
        });
        objectIds = utils.arrayDistinct(objectIds);

        if (objectIds.length) {
            userService.resolveObjectIds(objectIds)
                .done(deferred.resolve);
        } else {
            deferred.resolve();
        }

        return deferred.promise();
    }

    setManagementAttributes() {
        this.ownerAttributes([]);
        this.userAttributes([]);

        var owners = utils.arrayFirst(this.entity().__roles().filter(r => r.role === "Owner"));
        if (owners && owners.members && owners.members()) {
            var ownerAttributes = owners.members().map(m => {
                return {
                    name: this._objectIdMap[m.objectId],
                    readOnly: !this.entity().hasChangeOwnershipRight()
                }
            });
            this.ownerAttributes(ownerAttributes);
        }

        if (this.entity().__permissions()) {
            this.entity().__permissions().filter(p => p.principal.objectId !== constants.Users.NOBODY).forEach(p => {
                var hasReadPermission = p.rights().some(r => r.right === "Read");
                if (hasReadPermission) {
                    this.userAttributes.push({
                        name: this._objectIdMap[p.principal.objectId],
                        readOnly: false
                    });
                }
            });
        } 
    }

    takeOwnership() {
        logger.logInfo("auth mgmt: taking ownership");
        var owners = utils.arrayFirst(this.entity().__roles().filter(r => r.role === "Owner"));
        if (!owners) {
            owners = {
                role: "Owner",
                members: ko.observableArray<Interfaces.IPrincipal>([])
            };
            this.entity().__roles.push(owners);
        }
        owners.members.push({
            upn: $tokyo.user.email,
            objectId: $tokyo.user.objectId
        });

        this.updateOwnerRoles(this.entity())
            .done(() => {
                this.ownerAttributes.push({ name: $tokyo.user.email, readOnly: false });
            });
    }

    addOwners(upns: string[]) {
        logger.logInfo("auth mgmt: adding owners");
        var owners = utils.arrayFirst(this.entity().__roles().filter(r => r.role === "Owner"));
        if (!owners) {
            owners = {
                role: "Owner",
                members: ko.observableArray<Interfaces.IPrincipal>([])
            };
        }
        (upns || []).forEach(upn => {
            owners.members.push({
                upn: upn,
                objectId: this._upnMap[upn]
            });
        });

        this.updateOwnerRoles(this.entity());
    }

    removeOwner(upn: string) {
        logger.logInfo("auth mgmt: removing owner");
        var ownerRole = utils.arrayFirst(this.entity().__roles().filter(r => r.role === "Owner"));
        var membersBeforeRemoval = ownerRole.members().slice();
        ownerRole.members.remove(m => m.objectId === this._upnMap[upn]);

        var anyOwnersLeft = !!ownerRole.members().length;
        if (!anyOwnersLeft && !this.visibleToEveryoneSelected()) {
            // Just removed the last owner with readers defined, make sure this is what the user wants to do
            return modalService.show({ title: resx.confirmUnrestrictAssetTitle, bodyText: resx.confirmUnrestrictAssetBody })
                .done(modal => {
                    modal.close();
                    // The owner has already been removed
                    this.removeAllReadPermissions();
                })
                .fail(() => {
                    // Revert owners back
                    ownerRole.members(membersBeforeRemoval);
                });
        }

        this.updateOwnerRoles(this.entity());
        return null;
    }

    private addUser(upn: string, objectId: string) {
        this.entity().__permissions(this.entity().__permissions() || []);
        // Does the user already exist, if so give them read permission
        var userPerms = utils.arrayFirst(this.entity().__permissions().filter(p => p.principal.objectId === objectId));
        if (userPerms) {
            if (!userPerms.rights().filter(r => r.right === "Read").first()) {
                userPerms.rights.push({ right: "Read" });
            }
        } else {
            this.entity().__permissions.push({
                rights: ko.observableArray([{ right: "Read" }]),
                principal: <Microsoft.DataStudio.DataCatalog.Interfaces.IPrincipal>{
                    objectId: objectId,
                    upn: upn
                }
            });
        }
    }

    addUsers(upns: string[]) {
        logger.logInfo("auth mgmt: adding users");
        (upns || []).forEach(upn => {
            var objectId = this._upnMap[upn];
            this.addUser(upn, objectId);
        });

        this.updateUserPermissions(this.entity());
    }

    removeAllReadPermissions() {
        this.userAttributes([]);

        var removedReadPermissions = false;
        // Remove all "Read" rights
        this.entity().__permissions().forEach(p => {
            removedReadPermissions = !!(p.rights.remove(r => r.right === "Read") || []).length;
        });

        // Remove all permissions without any rights
        var newPermissions = this.entity().__permissions().filter(p => p.rights().length > 0);
        this.entity().__permissions(newPermissions);

        if (removedReadPermissions) {
            logger.logInfo("auth mgmt: changing visibility to everyone");
            this.updateUserPermissions(this.entity());
        }
    }

    removeUser(upn: string) {
        // Remove "Read" rights from user
        this.entity().__permissions().filter(p => p.principal.objectId === this._upnMap[upn]).forEach(p => {
            p.rights.remove(r => r.right === "Read");
        });

        // Remove all permissions without any rights
        var newPermissions = this.entity().__permissions().filter(p => p.rights().length > 0);
        this.entity().__permissions(newPermissions);

        this.updateUserPermissions(this.entity());
    }

    private updateUserPermissions(dataEntity: Interfaces.IBindableDataEntity): JQueryPromise<any> {
        this.isSettingUsers(true);
        this.outstandingUserUpdates++;
        var deferred = this.updateRolesAndPermissions(dataEntity);
        deferred
            .always(() => {
                this.outstandingUserUpdates--;
                if (this.outstandingUserUpdates === 0) {
                    this.isSettingUsers(false);
                    if (deferred.state() === "resolved") {
                        this.successUpdatingUsers(true);
                        this.successUpdatingUsers(false); // Reset to false
                    }
                }
            });
        return deferred;
    }

    private updateOwnerRoles(dataEntity: Interfaces.IBindableDataEntity): JQueryPromise<any> {
        this.isSettingOwners(true);
        this.outstandingOwnerUpdates++;
        var deferred = this.updateRolesAndPermissions(dataEntity);
        deferred
            .always(() => {
                this.outstandingOwnerUpdates--;
                if (this.outstandingOwnerUpdates === 0) {
                    this.isSettingOwners(false);
                    if (deferred.state() === "resolved") {
                        this.successUpdatingOwners(true);
                        this.successUpdatingOwners(false); // Reset to false
                    }
                }
            });
        return deferred;
    }

    private updateRolesAndPermissions(bindableDataEntity: Interfaces.IBindableDataEntity): JQueryPromise<any> {
        var permissions = ko.toJS(bindableDataEntity.__permissions());
        var roles = ko.toJS(bindableDataEntity.__roles());

        return catalogService.updateRolesAndPermissions(bindableDataEntity, roles, permissions, () => { browseManager.rebindView(); });
    }

    onValidateUpns(upns: string[], userType: string) {
        var deferred = jQuery.Deferred();
        var validatingObservable = userType === "users" ? this.validatingUsers : this.validatingOwners;

        validatingObservable(true);
        userService.resolveUpns(upns, "Allow")
            .then(result => {
                var validUpns = [];
                (result.valid || []).forEach(user => {
                    validUpns.push(user.upn);
                    this._upnMap[user.upn] = user.objectId;
                });
                deferred.resolve(validUpns);

                if (userType === "users") {
                    this.invalidUsers(result.invalid || []);
                    this.failedUsers(result.failed || []);
                    this.duplicatedUsers(result.duplicated || []);
                } else if (userType === "owners") {
                    this.invalidOwners(result.invalid || []);
                    this.failedOwners(result.failed || []);
                    this.duplicatedOwners(result.duplicated || []);
                }
            })
            .fail(e => {
                logger.logError("failed to validate upns", e);
            })
            .always(() => {
                validatingObservable(false);
            });

        return deferred.promise();
    }

    visibleToEveryoneSelected = ko.pureComputed(() => {
        // No one had Read permissions
        var foundReadPermission = false;
        this.entity().__permissions().forEach(p => {
            var hasReadPermission = p.rights().some(r => r.right === "Read");
            if (hasReadPermission) {
                foundReadPermission = true;
            }
        });

        return !foundReadPermission;
    });

    changeVisibilityToAll() {
        // Deleting perms, modal confirmation before update
        if (this.userAttributes().length) {
            modalService.show({ title: resx.confirmResetVisibilityTitle, bodyText: resx.confirmResetVisibilityBody })
                .done(modal => {
                    this.removeAllReadPermissions();
                    modal.close();
                });
        } else {
            this.removeAllReadPermissions();
        }
    }

    changeVisibilityToSome() {
        logger.logInfo("auth mgmt: changing visibility to restricted");
        this.addUser(constants.Users.NOBODY, constants.Users.NOBODY);
        this.updateUserPermissions(this.entity());
    }

    invalidUsersText = ko.pureComputed(() => {
        if (this.invalidUsers().length) {
            return utils.stringFormat(resx.invalidUsersMessageFormat, "\"" + this.invalidUsers().join("\", \"") + "\"");
        }
        return "";
    });

    invalidOwnersText = ko.pureComputed(() => {
        if (this.invalidOwners().length) {
            return utils.stringFormat(resx.invalidUsersMessageFormat, "\"" + this.invalidOwners().join("\", \"") + "\"");
        }
        return "";
    });

    failedUsersText = ko.pureComputed(() => {
        if (this.failedUsers().length) {
            return utils.stringFormat(resx.failedUsersMessageFormat, "\"" + this.failedUsers().join("\", \"") + "\"");
        }
        return "";
    });

    failedOwnersText = ko.pureComputed(() => {
        if (this.failedOwners().length) {
            return utils.stringFormat(resx.failedUsersMessageFormat, "\"" + this.failedOwners().join("\", \"") + "\"");
        }
        return "";
    });

    duplicatedUsersText = ko.pureComputed(() => {
        if (this.duplicatedUsers().length) {
            return utils.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + this.duplicatedUsers().join("\", \"") + "\"");
        }
        return "";
    });

    duplicatedOwnersText = ko.pureComputed(() => {
        if (this.duplicatedOwners().length) {
            return utils.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + this.duplicatedOwners().join("\", \"") + "\"");
        }
        return "";
    });
}
