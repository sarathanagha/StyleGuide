// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./batchmanagement.html" />
/// <amd-dependency path="css!./batchmanagement.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import batchManagementManager = Microsoft.DataStudio.DataCatalog.Managers.BatchManagementManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;

export var template: string = require("text!./batchmanagement.html");

export class viewModel {
    resx = resx;
    multiSelected = browseManager.multiSelected;
    snapshot = batchManagementManager.snapshot;

    canChangeVisibility = batchManagementManager.canChangeVisibility;
    canTakeOwnership = batchManagementManager.canTakeOwnership;
    doesOwnAll = batchManagementManager.doesOwnAll;
    atLeastOneIsOwned = batchManagementManager.atLeastOneIsOwned;
    allAreVisibleToEveryone = batchManagementManager.allAreVisibleToEveryone;
    isMixedVisibility = batchManagementManager.isMixedVisibility;
    someAreOwnedByOthersAndNotMe = batchManagementManager.someAreOwnedByOthersAndNotMe;

    onValidateUpns = batchManagementManager.onValidateUpns;
    invalidOwners = batchManagementManager.invalidOwners;
    invalidUsers = batchManagementManager.invalidUsers;
    failedOwners = batchManagementManager.failedOwners;
    failedUsers = batchManagementManager.failedUsers;
    duplicatedOwners = batchManagementManager.duplicatedOwners;
    duplicatedUsers = batchManagementManager.duplicatedUsers;

    //#region state flags
    isResolvingObjectIds = batchManagementManager.isResolvingObjectIds;
    validatingOwners = batchManagementManager.validatingOwners;
    validatingUsers = batchManagementManager.validatingUsers;
    //#endregion

    private dispose: () => void;

    constructor() {
        batchManagementManager.init();

        var subscription = browseManager.multiSelected.subscribe(() => {
            // Setup snapshots for comparing during commit
            if (browseManager.multiSelected().length > 1) {
                // This is batch management so don't do any work we don't need to
                batchManagementManager.init();
            }
        });

        this.dispose = () => {
            subscription.dispose();
        };
    }

    onOwnerRemoved() {
        batchManagementManager.onOwnerRemoved();
    }

    takeOwnership() {
        // Add self to owners on all, and remove from owners on some in snapshot
        this.snapshot().ownersOnAll.push({ name: $tokyo.user.email, readOnly: false });
        this.snapshot().ownersOnSome.remove(o => o.name === $tokyo.user.email);
    }

    changeVisibilityToAll() {
        this.snapshot().usersOnAll.removeAll();
        this.snapshot().usersOnSome.removeAll();
        this.snapshot().visibility("All");
    }

    changeVisibilityToSome() {
        if (this.snapshot().ownersOnAll().length) {
            // You can only have visibility set to Some if there are owners on all
            this.snapshot().visibility("Some");
        }
    }

    showVisibilityInformation = ko.pureComputed<boolean>(() => {
        // I own from 1 to all, and those not owned by me are not owned by anyone
        return (this.canTakeOwnership() &&
                this.atLeastOneIsOwned() &&
                this.snapshot() &&
                (!!this.snapshot().usersOnAll().length || !!this.snapshot().usersOnSome().length)
            ) || this.doesOwnAll();
    });

    invalidUsersText = ko.pureComputed<string>(() => {
        if (this.invalidUsers().length) {
            return util.stringFormat(resx.invalidUsersMessageFormat, "\"" + this.invalidUsers().join("\", \"") + "\"");
        }
        return "";
    });

    invalidOwnersText = ko.pureComputed<string>(() => {
        if (this.invalidOwners().length) {
            return util.stringFormat(resx.invalidUsersMessageFormat, "\"" + this.invalidOwners().join("\", \"") + "\"");
        }
        return "";
    });

    failedUsersText = ko.pureComputed<string>(() => {
        if (this.failedUsers().length) {
            return util.stringFormat(resx.failedUsersMessageFormat, "\"" + this.failedUsers().join("\", \"") + "\"");
        }
        return "";
    });

    failedOwnersText = ko.pureComputed(() => {
        if (this.failedOwners().length) {
            return util.stringFormat(resx.failedUsersMessageFormat, "\"" + this.failedOwners().join("\", \"") + "\"");
        }
        return "";
    });

    duplicatedUsersText = ko.pureComputed(() => {
        if (this.duplicatedUsers().length) {
            return util.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + this.duplicatedUsers().join("\", \"") + "\"");
        }
        return "";
    });

    duplicatedOwnersText = ko.pureComputed(() => {
        if (this.duplicatedOwners().length) {
            return util.stringFormat(resx.duplicatedUsersMessageFormat, "\"" + this.duplicatedOwners().join("\", \"") + "\"");
        }
        return "";
    });
}