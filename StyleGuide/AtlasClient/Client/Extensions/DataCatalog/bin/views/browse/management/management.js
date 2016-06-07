// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "jquery", "text!./management.html", "css!./management.css"], function (require, exports, ko, $) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var userService = Microsoft.DataStudio.DataCatalog.Services.UserService;
    var modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
    var catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    var utils = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./management.html");
    var viewModel = (function () {
        //#endregion
        function viewModel() {
            var _this = this;
            this._upnMap = {}; // Upn -> ObjectId
            this._objectIdMap = {}; // ObjectId -> upn
            this.resx = resx;
            this.entity = browseManager.selected;
            this.ownerAttributes = ko.observableArray([]);
            this.userAttributes = ko.observableArray([]);
            this.invalidOwners = ko.observable([]);
            this.invalidUsers = ko.observable([]);
            this.failedOwners = ko.observable([]);
            this.failedUsers = ko.observable([]);
            this.duplicatedUsers = ko.observable([]);
            this.duplicatedOwners = ko.observable([]);
            //#region state flags
            this.isResolvingObjectIds = ko.observable(true);
            this.validatingOwners = ko.observable(false);
            this.validatingUsers = ko.observable(false);
            this.isSettingOwners = ko.observable(false);
            this.successUpdatingOwners = ko.observable(false);
            this.isSettingUsers = ko.observable(false);
            this.successUpdatingUsers = ko.observable(false);
            this.outstandingOwnerUpdates = 0;
            this.outstandingUserUpdates = 0;
            this.visibleToEveryoneSelected = ko.pureComputed(function () {
                // No one had Read permissions
                var foundReadPermission = false;
                _this.entity().__permissions().forEach(function (p) {
                    var hasReadPermission = p.rights().some(function (r) { return r.right === "Read"; });
                    if (hasReadPermission) {
                        foundReadPermission = true;
                    }
                });
                return !foundReadPermission;
            });
            this.invalidUsersText = ko.pureComputed(function () {
                if (_this.invalidUsers().length) {
                    return utils.stringFormat(resx.invalidUsersMessageFormat, "\"" + _this.invalidUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.invalidOwnersText = ko.pureComputed(function () {
                if (_this.invalidOwners().length) {
                    return utils.stringFormat(resx.invalidUsersMessageFormat, "\"" + _this.invalidOwners().join("\", \"") + "\"");
                }
                return "";
            });
            this.failedUsersText = ko.pureComputed(function () {
                if (_this.failedUsers().length) {
                    return utils.stringFormat(resx.failedUsersMessageFormat, "\"" + _this.failedUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.failedOwnersText = ko.pureComputed(function () {
                if (_this.failedOwners().length) {
                    return utils.stringFormat(resx.failedUsersMessageFormat, "\"" + _this.failedOwners().join("\", \"") + "\"");
                }
                return "";
            });
            this.duplicatedUsersText = ko.pureComputed(function () {
                if (_this.duplicatedUsers().length) {
                    return utils.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + _this.duplicatedUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.duplicatedOwnersText = ko.pureComputed(function () {
                if (_this.duplicatedOwners().length) {
                    return utils.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + _this.duplicatedOwners().join("\", \"") + "\"");
                }
                return "";
            });
            var onSelectedChanged = function (newValue) {
                if (browseManager.selected()) {
                    _this.isResolvingObjectIds(true);
                    _this._objectIdMap[$tokyo.user.objectId] = $tokyo.user.email;
                    _this._upnMap[$tokyo.user.email] = $tokyo.user.objectId;
                    _this.resolveObjectIds()
                        .then(function (result) {
                        if (result && result.valid && result.valid.length) {
                            result.valid.forEach(function (r) {
                                _this._objectIdMap[r.objectId] = r.upn;
                                _this._upnMap[r.upn] = r.objectId;
                            });
                        }
                        _this.isResolvingObjectIds(false);
                        _this.entity() && _this.setManagementAttributes();
                    });
                }
            };
            onSelectedChanged(browseManager.selected());
            var subscription = browseManager.selected.subscribe(onSelectedChanged);
            this.dispose = function () {
                subscription.dispose();
            };
        }
        viewModel.prototype.resolveObjectIds = function () {
            var deferred = $.Deferred();
            var objectIds = [];
            (this.entity().__roles() || []).forEach(function (r) {
                objectIds = objectIds.concat(r.members().map(function (m) { return m.objectId; }));
            });
            (this.entity().__permissions() || []).forEach(function (p) {
                objectIds.push(p.principal.objectId);
            });
            objectIds = utils.arrayDistinct(objectIds);
            if (objectIds.length) {
                userService.resolveObjectIds(objectIds)
                    .done(deferred.resolve);
            }
            else {
                deferred.resolve();
            }
            return deferred.promise();
        };
        viewModel.prototype.setManagementAttributes = function () {
            var _this = this;
            this.ownerAttributes([]);
            this.userAttributes([]);
            var owners = utils.arrayFirst(this.entity().__roles().filter(function (r) { return r.role === "Owner"; }));
            if (owners && owners.members && owners.members()) {
                var ownerAttributes = owners.members().map(function (m) {
                    return {
                        name: _this._objectIdMap[m.objectId],
                        readOnly: !_this.entity().hasChangeOwnershipRight()
                    };
                });
                this.ownerAttributes(ownerAttributes);
            }
            if (this.entity().__permissions()) {
                this.entity().__permissions().filter(function (p) { return p.principal.objectId !== constants.Users.NOBODY; }).forEach(function (p) {
                    var hasReadPermission = p.rights().some(function (r) { return r.right === "Read"; });
                    if (hasReadPermission) {
                        _this.userAttributes.push({
                            name: _this._objectIdMap[p.principal.objectId],
                            readOnly: false
                        });
                    }
                });
            }
        };
        viewModel.prototype.takeOwnership = function () {
            var _this = this;
            logger.logInfo("auth mgmt: taking ownership");
            var owners = utils.arrayFirst(this.entity().__roles().filter(function (r) { return r.role === "Owner"; }));
            if (!owners) {
                owners = {
                    role: "Owner",
                    members: ko.observableArray([])
                };
                this.entity().__roles.push(owners);
            }
            owners.members.push({
                upn: $tokyo.user.email,
                objectId: $tokyo.user.objectId
            });
            this.updateOwnerRoles(this.entity())
                .done(function () {
                _this.ownerAttributes.push({ name: $tokyo.user.email, readOnly: false });
            });
        };
        viewModel.prototype.addOwners = function (upns) {
            var _this = this;
            logger.logInfo("auth mgmt: adding owners");
            var owners = utils.arrayFirst(this.entity().__roles().filter(function (r) { return r.role === "Owner"; }));
            if (!owners) {
                owners = {
                    role: "Owner",
                    members: ko.observableArray([])
                };
            }
            (upns || []).forEach(function (upn) {
                owners.members.push({
                    upn: upn,
                    objectId: _this._upnMap[upn]
                });
            });
            this.updateOwnerRoles(this.entity());
        };
        viewModel.prototype.removeOwner = function (upn) {
            var _this = this;
            logger.logInfo("auth mgmt: removing owner");
            var ownerRole = utils.arrayFirst(this.entity().__roles().filter(function (r) { return r.role === "Owner"; }));
            var membersBeforeRemoval = ownerRole.members().slice();
            ownerRole.members.remove(function (m) { return m.objectId === _this._upnMap[upn]; });
            var anyOwnersLeft = !!ownerRole.members().length;
            if (!anyOwnersLeft && !this.visibleToEveryoneSelected()) {
                // Just removed the last owner with readers defined, make sure this is what the user wants to do
                return modalService.show({ title: resx.confirmUnrestrictAssetTitle, bodyText: resx.confirmUnrestrictAssetBody })
                    .done(function (modal) {
                    modal.close();
                    // The owner has already been removed
                    _this.removeAllReadPermissions();
                })
                    .fail(function () {
                    // Revert owners back
                    ownerRole.members(membersBeforeRemoval);
                });
            }
            this.updateOwnerRoles(this.entity());
            return null;
        };
        viewModel.prototype.addUser = function (upn, objectId) {
            this.entity().__permissions(this.entity().__permissions() || []);
            // Does the user already exist, if so give them read permission
            var userPerms = utils.arrayFirst(this.entity().__permissions().filter(function (p) { return p.principal.objectId === objectId; }));
            if (userPerms) {
                if (!userPerms.rights().filter(function (r) { return r.right === "Read"; }).first()) {
                    userPerms.rights.push({ right: "Read" });
                }
            }
            else {
                this.entity().__permissions.push({
                    rights: ko.observableArray([{ right: "Read" }]),
                    principal: {
                        objectId: objectId,
                        upn: upn
                    }
                });
            }
        };
        viewModel.prototype.addUsers = function (upns) {
            var _this = this;
            logger.logInfo("auth mgmt: adding users");
            (upns || []).forEach(function (upn) {
                var objectId = _this._upnMap[upn];
                _this.addUser(upn, objectId);
            });
            this.updateUserPermissions(this.entity());
        };
        viewModel.prototype.removeAllReadPermissions = function () {
            this.userAttributes([]);
            var removedReadPermissions = false;
            // Remove all "Read" rights
            this.entity().__permissions().forEach(function (p) {
                removedReadPermissions = !!(p.rights.remove(function (r) { return r.right === "Read"; }) || []).length;
            });
            // Remove all permissions without any rights
            var newPermissions = this.entity().__permissions().filter(function (p) { return p.rights().length > 0; });
            this.entity().__permissions(newPermissions);
            if (removedReadPermissions) {
                logger.logInfo("auth mgmt: changing visibility to everyone");
                this.updateUserPermissions(this.entity());
            }
        };
        viewModel.prototype.removeUser = function (upn) {
            var _this = this;
            // Remove "Read" rights from user
            this.entity().__permissions().filter(function (p) { return p.principal.objectId === _this._upnMap[upn]; }).forEach(function (p) {
                p.rights.remove(function (r) { return r.right === "Read"; });
            });
            // Remove all permissions without any rights
            var newPermissions = this.entity().__permissions().filter(function (p) { return p.rights().length > 0; });
            this.entity().__permissions(newPermissions);
            this.updateUserPermissions(this.entity());
        };
        viewModel.prototype.updateUserPermissions = function (dataEntity) {
            var _this = this;
            this.isSettingUsers(true);
            this.outstandingUserUpdates++;
            var deferred = this.updateRolesAndPermissions(dataEntity);
            deferred
                .always(function () {
                _this.outstandingUserUpdates--;
                if (_this.outstandingUserUpdates === 0) {
                    _this.isSettingUsers(false);
                    if (deferred.state() === "resolved") {
                        _this.successUpdatingUsers(true);
                        _this.successUpdatingUsers(false); // Reset to false
                    }
                }
            });
            return deferred;
        };
        viewModel.prototype.updateOwnerRoles = function (dataEntity) {
            var _this = this;
            this.isSettingOwners(true);
            this.outstandingOwnerUpdates++;
            var deferred = this.updateRolesAndPermissions(dataEntity);
            deferred
                .always(function () {
                _this.outstandingOwnerUpdates--;
                if (_this.outstandingOwnerUpdates === 0) {
                    _this.isSettingOwners(false);
                    if (deferred.state() === "resolved") {
                        _this.successUpdatingOwners(true);
                        _this.successUpdatingOwners(false); // Reset to false
                    }
                }
            });
            return deferred;
        };
        viewModel.prototype.updateRolesAndPermissions = function (bindableDataEntity) {
            var permissions = ko.toJS(bindableDataEntity.__permissions());
            var roles = ko.toJS(bindableDataEntity.__roles());
            return catalogService.updateRolesAndPermissions(bindableDataEntity, roles, permissions, function () { browseManager.rebindView(); });
        };
        viewModel.prototype.onValidateUpns = function (upns, userType) {
            var _this = this;
            var deferred = jQuery.Deferred();
            var validatingObservable = userType === "users" ? this.validatingUsers : this.validatingOwners;
            validatingObservable(true);
            userService.resolveUpns(upns, "Allow")
                .then(function (result) {
                var validUpns = [];
                (result.valid || []).forEach(function (user) {
                    validUpns.push(user.upn);
                    _this._upnMap[user.upn] = user.objectId;
                });
                deferred.resolve(validUpns);
                if (userType === "users") {
                    _this.invalidUsers(result.invalid || []);
                    _this.failedUsers(result.failed || []);
                    _this.duplicatedUsers(result.duplicated || []);
                }
                else if (userType === "owners") {
                    _this.invalidOwners(result.invalid || []);
                    _this.failedOwners(result.failed || []);
                    _this.duplicatedOwners(result.duplicated || []);
                }
            })
                .fail(function (e) {
                logger.logError("failed to validate upns", e);
            })
                .always(function () {
                validatingObservable(false);
            });
            return deferred.promise();
        };
        viewModel.prototype.changeVisibilityToAll = function () {
            var _this = this;
            // Deleting perms, modal confirmation before update
            if (this.userAttributes().length) {
                modalService.show({ title: resx.confirmResetVisibilityTitle, bodyText: resx.confirmResetVisibilityBody })
                    .done(function (modal) {
                    _this.removeAllReadPermissions();
                    modal.close();
                });
            }
            else {
                this.removeAllReadPermissions();
            }
        };
        viewModel.prototype.changeVisibilityToSome = function () {
            logger.logInfo("auth mgmt: changing visibility to restricted");
            this.addUser(constants.Users.NOBODY, constants.Users.NOBODY);
            this.updateUserPermissions(this.entity());
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=management.js.map