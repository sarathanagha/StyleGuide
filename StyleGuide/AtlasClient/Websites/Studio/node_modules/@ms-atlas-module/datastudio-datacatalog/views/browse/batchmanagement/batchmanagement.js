// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./batchmanagement.html", "css!./batchmanagement.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var batchManagementManager = Microsoft.DataStudio.DataCatalog.Managers.BatchManagementManager;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./batchmanagement.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.multiSelected = browseManager.multiSelected;
            this.snapshot = batchManagementManager.snapshot;
            this.canChangeVisibility = batchManagementManager.canChangeVisibility;
            this.canTakeOwnership = batchManagementManager.canTakeOwnership;
            this.doesOwnAll = batchManagementManager.doesOwnAll;
            this.atLeastOneIsOwned = batchManagementManager.atLeastOneIsOwned;
            this.allAreVisibleToEveryone = batchManagementManager.allAreVisibleToEveryone;
            this.isMixedVisibility = batchManagementManager.isMixedVisibility;
            this.someAreOwnedByOthersAndNotMe = batchManagementManager.someAreOwnedByOthersAndNotMe;
            this.onValidateUpns = batchManagementManager.onValidateUpns;
            this.invalidOwners = batchManagementManager.invalidOwners;
            this.invalidUsers = batchManagementManager.invalidUsers;
            this.failedOwners = batchManagementManager.failedOwners;
            this.failedUsers = batchManagementManager.failedUsers;
            this.duplicatedOwners = batchManagementManager.duplicatedOwners;
            this.duplicatedUsers = batchManagementManager.duplicatedUsers;
            //#region state flags
            this.isResolvingObjectIds = batchManagementManager.isResolvingObjectIds;
            this.validatingOwners = batchManagementManager.validatingOwners;
            this.validatingUsers = batchManagementManager.validatingUsers;
            this.showVisibilityInformation = ko.pureComputed(function () {
                // I own from 1 to all, and those not owned by me are not owned by anyone
                return (_this.canTakeOwnership() &&
                    _this.atLeastOneIsOwned() &&
                    _this.snapshot() &&
                    (!!_this.snapshot().usersOnAll().length || !!_this.snapshot().usersOnSome().length)) || _this.doesOwnAll();
            });
            this.invalidUsersText = ko.pureComputed(function () {
                if (_this.invalidUsers().length) {
                    return util.stringFormat(resx.invalidUsersMessageFormat, "\"" + _this.invalidUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.invalidOwnersText = ko.pureComputed(function () {
                if (_this.invalidOwners().length) {
                    return util.stringFormat(resx.invalidUsersMessageFormat, "\"" + _this.invalidOwners().join("\", \"") + "\"");
                }
                return "";
            });
            this.failedUsersText = ko.pureComputed(function () {
                if (_this.failedUsers().length) {
                    return util.stringFormat(resx.failedUsersMessageFormat, "\"" + _this.failedUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.failedOwnersText = ko.pureComputed(function () {
                if (_this.failedOwners().length) {
                    return util.stringFormat(resx.failedUsersMessageFormat, "\"" + _this.failedOwners().join("\", \"") + "\"");
                }
                return "";
            });
            this.duplicatedUsersText = ko.pureComputed(function () {
                if (_this.duplicatedUsers().length) {
                    return util.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + _this.duplicatedUsers().join("\", \"") + "\"");
                }
                return "";
            });
            this.duplicatedOwnersText = ko.pureComputed(function () {
                if (_this.duplicatedOwners().length) {
                    return util.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + _this.duplicatedOwners().join("\", \"") + "\"");
                }
                return "";
            });
            batchManagementManager.init();
            var subscription = browseManager.multiSelected.subscribe(function () {
                // Setup snapshots for comparing during commit
                if (browseManager.multiSelected().length > 1) {
                    // This is batch management so don't do any work we don't need to
                    batchManagementManager.init();
                }
            });
            this.dispose = function () {
                subscription.dispose();
            };
        }
        viewModel.prototype.onOwnerRemoved = function () {
            batchManagementManager.onOwnerRemoved();
        };
        viewModel.prototype.takeOwnership = function () {
            // Add self to owners on all, and remove from owners on some in snapshot
            this.snapshot().ownersOnAll.push({ name: $tokyo.user.email, readOnly: false });
            this.snapshot().ownersOnSome.remove(function (o) { return o.name === $tokyo.user.email; });
        };
        viewModel.prototype.changeVisibilityToAll = function () {
            this.snapshot().usersOnAll.removeAll();
            this.snapshot().usersOnSome.removeAll();
            this.snapshot().visibility("All");
        };
        viewModel.prototype.changeVisibilityToSome = function () {
            if (this.snapshot().ownersOnAll().length) {
                // You can only have visibility set to Some if there are owners on all
                this.snapshot().visibility("Some");
            }
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=batchmanagement.js.map