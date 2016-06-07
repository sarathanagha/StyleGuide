module Microsoft.DataStudio.DataCatalog.Managers {

    var logger = Microsoft.DataStudio.DataCatalog.LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Managers" });

    export class BatchManagementManager {
        private static _upnMap: { [upn: string]: string; } = {}; // Upn -> ObjectId
        private static _objectIdMap: { [objectId: string]: string; } = {}; // ObjectId -> upn

        static snapshotData: Interfaces.IAuthorizationSnapshotData;
        static snapshot = ko.observable<Interfaces.IBindableAuthorizationSnapshotData>();

        static invalidOwners = ko.observable<string[]>([]);
        static invalidUsers = ko.observable<string[]>([]);
        static failedOwners = ko.observable<string[]>([]);
        static failedUsers = ko.observable<string[]>([]);
        static duplicatedOwners = ko.observable<string[]>([]);
        static duplicatedUsers = ko.observable<string[]>([]);

        //#region state flags
        static isResolvingObjectIds = ko.observable(true);
        static validatingOwners = ko.observable<boolean>(false);
        static validatingUsers = ko.observable<boolean>(false);
        //#endregion

        static hasChanges() {
            var hasChanges = !!Object.keys(this.getChanges()).length;
            if (this.snapshotData && !this.isResolvingObjectIds()) {
                return hasChanges;
            }
            return false;
        }

        static init() {
            this.isResolvingObjectIds(true);
            this.invalidOwners([]);
            this.invalidUsers([]);
            this.failedOwners([]);
            this.failedUsers([]);
            this.validatingOwners(false);
            this.validatingUsers(false);

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
                    this.takeSnapshot();
                });
        }

        static cancel() {
            BatchManagementManager.init();
        }

        static getChanges(): Interfaces.IAuthorizationChanges {
            var changes: Interfaces.IAuthorizationChanges = {};

            if (this.snapshot()) {
                // Determine visibility change
                var endingVisibility = this.snapshot().visibility();
                if (endingVisibility !== this.snapshotData.visibility) {
                    changes.visibility = endingVisibility;
                }

                // Determine owner deltas
                var endingOwnersOnAll = this.snapshot().ownersOnAll().map(t => t.name);
                var endingOwnersOnSome = this.snapshot().ownersOnSome().map(t => t.name);

                var ownersToAdd = Core.Utilities.arrayExcept(endingOwnersOnAll, this.snapshotData.ownersOnAll);
                var ownersToRemoveFromAll = Core.Utilities.arrayExcept(this.snapshotData.ownersOnAll, endingOwnersOnAll);
                var ownersToRemoveFromSome = Core.Utilities.arrayExcept(this.snapshotData.ownersOnSome, endingOwnersOnSome);
                    ownersToRemoveFromSome = Core.Utilities.arrayExcept(ownersToRemoveFromSome, ownersToAdd);
                var ownersToRemove = ownersToRemoveFromAll.concat(ownersToRemoveFromSome);

                if (ownersToAdd.length) {
                    changes.ownersToAdd = ownersToAdd.map(upn => { return { upn: upn, objectId: this._upnMap[upn] }; });
                }
                if (ownersToRemove.length) {
                    changes.ownersToRemove = ownersToRemove.map(upn => { return { upn: upn, objectId: this._upnMap[upn] }; });
                }

                // Determine user deltas
                var endingUsersOnAll = this.snapshot().usersOnAll().map(t => t.name);
                var endingUsersOnSome = this.snapshot().usersOnSome().map(t => t.name);

                var usersToAdd = Core.Utilities.arrayExcept(endingUsersOnAll, this.snapshotData.usersOnAll);
                var usersToRemoveFromAll = Core.Utilities.arrayExcept(this.snapshotData.usersOnAll, endingUsersOnAll);
                var usersToRemoveFromSome = Core.Utilities.arrayExcept(this.snapshotData.usersOnSome, endingUsersOnSome);
                    usersToRemoveFromSome = Core.Utilities.arrayExcept(usersToRemoveFromSome, usersToAdd);
                var usersToRemove = usersToRemoveFromAll.concat(usersToRemoveFromSome);

                if (usersToAdd.length) {
                    changes.usersToAdd = usersToAdd.map(upn => { return { upn: upn, objectId: this._upnMap[upn] }; });
                }
                if (usersToRemove.length) {
                    changes.usersToRemove = usersToRemove.map(upn => { return { upn: upn, objectId: this._upnMap[upn] }; });
                }
            }

            return changes;
        }

        private static takeSnapshot() {
            this.snapshotData = this.getSnapshot();
            var copy = <Interfaces.IAuthorizationSnapshotData>$.extend(true, {}, this.snapshotData);

            var doesOwnAll = !!copy.ownersOnAll.filter(o => o === $tokyo.user.email).length;
            var isMixedVisibility = copy.visibility === "Mixed";

            var ownersOnAll = copy.ownersOnAll.map(upn => { return { name: upn, readOnly: !doesOwnAll } }).sort();
            var ownersOnSome = copy.ownersOnSome.map(upn => { return { name: upn, readOnly: !doesOwnAll } }).sort();
            var usersOnAll = copy.usersOnAll.map(upn => { return { name: upn, readOnly: !doesOwnAll || isMixedVisibility } }).sort();
            var usersOnSome = copy.usersOnSome.map(upn => { return { name: upn, readOnly: !doesOwnAll || isMixedVisibility } }).sort();

            if (isMixedVisibility) {
                usersOnSome.push({
                    name: Core.Resx.everyone,
                    readOnly: true
                });
            }

            this.snapshot({
                visibility: ko.observable<string>(copy.visibility),
                ownersOnAll: ko.observableArray<Interfaces.IAttributeInfo>(ownersOnAll),
                ownersOnSome: ko.observableArray<Interfaces.IAttributeInfo>(ownersOnSome),
                usersOnAll: ko.observableArray<Interfaces.IAttributeInfo>(usersOnAll),
                usersOnSome: ko.observableArray<Interfaces.IAttributeInfo>(usersOnSome)
            });
        }

        private static getSnapshot(): Interfaces.IAuthorizationSnapshotData {
            var ownerObjectIdsOnAll = null;
            var allOwnerObjectIds = [];
            var userObjectIdsOnAll = null;
            var allUserObjectIds = [];

            var numberVisibleToAll = 0;
            var numberVisibleToSome = 0;

            (BrowseManager.multiSelected() || []).forEach(a => {
                var owners = Core.Utilities.arrayFirst(a.__roles().filter(r => r.role === "Owner"));
                var assetOwnerObjectIds = [];
                if (owners && owners.members && owners.members()) {
                    assetOwnerObjectIds = owners.members().map(m => m.objectId);
                    allOwnerObjectIds = allOwnerObjectIds.concat(assetOwnerObjectIds);
                }
                if (!ownerObjectIdsOnAll) {
                    ownerObjectIdsOnAll = assetOwnerObjectIds;
                } else {
                    ownerObjectIdsOnAll = Core.Utilities.arrayIntersect(ownerObjectIdsOnAll, assetOwnerObjectIds);
                }

                var assetUserObjectIds = [];
                var foundReadPermission = false;
                a.__permissions().forEach(p => {
                    var hasReadPermission = p.rights().some(r => r.right === "Read");
                    if (hasReadPermission) {
                        foundReadPermission = true;
                        assetUserObjectIds.push(p.principal.objectId);
                        allUserObjectIds.push(p.principal.objectId);
                    }
                });

                if (foundReadPermission) {
                    numberVisibleToSome++;
                } else {
                    numberVisibleToAll++;
                }

                if (!userObjectIdsOnAll) {
                    userObjectIdsOnAll = assetUserObjectIds;
                } else {
                    userObjectIdsOnAll = Core.Utilities.arrayIntersect(userObjectIdsOnAll, assetUserObjectIds);
                }

            });

            var visibility = numberVisibleToSome === 0
                ? "All"
                : numberVisibleToAll === 0
                ? "Some"
                : "Mixed";
            ownerObjectIdsOnAll = Core.Utilities.arrayDistinct(ownerObjectIdsOnAll || []);
            userObjectIdsOnAll = Core.Utilities.arrayDistinct(userObjectIdsOnAll || []);

            var nobody = objectId => objectId !== Core.Constants.Users.NOBODY;

            return {
                visibility: visibility,
                ownersOnAll: ownerObjectIdsOnAll.map(oid => this._objectIdMap[oid]),
                ownersOnSome: Core.Utilities.arrayDistinct(Core.Utilities.arrayExcept(allOwnerObjectIds, ownerObjectIdsOnAll)).map(oid => this._objectIdMap[oid]),
                usersOnAll: userObjectIdsOnAll.filter(nobody).map(oid => this._objectIdMap[oid]),
                usersOnSome: Core.Utilities.arrayDistinct(Core.Utilities.arrayExcept(allUserObjectIds.filter(nobody), userObjectIdsOnAll)).map(oid => this._objectIdMap[oid])
            };
        }

        private static resolveObjectIds() {
            var deferred = $.Deferred();

            var objectIds = [];
            (BrowseManager.multiSelected() || []).forEach(a => {
                (a.__roles() || []).forEach(r => {
                    objectIds = objectIds.concat(r.members().map(m => m.objectId));
                });
                (a.__permissions() || []).forEach(p => {
                    objectIds.push(p.principal.objectId);
                });
            });

            objectIds = Core.Utilities.arrayDistinct(objectIds);

            if (objectIds.length) {
                Services.UserService.resolveObjectIds(objectIds)
                    .done(deferred.resolve)
                    .fail(e => {
                        deferred.resolve();
                    });
            } else {
                deferred.resolve();
            }

            return deferred.promise();
        }

        static onOwnerRemoved() {
            if (BatchManagementManager.snapshot() && !BatchManagementManager.snapshot().ownersOnAll().length) {
                BatchManagementManager.snapshot().visibility("All");
            }
        }

        static onValidateUpns(upns: string[], userType: string) {
            var deferred = jQuery.Deferred();
            var validatingObservable = userType === "users" ? BatchManagementManager.validatingUsers : BatchManagementManager.validatingOwners;

            validatingObservable(true);
            Services.UserService.resolveUpns(upns, "Allow")
                .then(result => {
                    var validUpns = [];
                    (result.valid || []).forEach(user => {
                        validUpns.push(user.upn);
                        BatchManagementManager._upnMap[user.upn] = user.objectId;
                    });
                    deferred.resolve(validUpns);

                    if (userType === "users") {
                        BatchManagementManager.invalidUsers(result.invalid || []);
                        BatchManagementManager.failedUsers(result.failed || []);
                        BatchManagementManager.duplicatedUsers(result.duplicated || []);
                    } else if (userType === "owners") {
                        BatchManagementManager.invalidOwners(result.invalid || []);
                        BatchManagementManager.failedOwners(result.failed || []);
                        BatchManagementManager.duplicatedOwners(result.duplicated || []);
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

        static canChangeVisibility = ko.pureComputed<boolean>(() => {
            var _canChangeVisibility = true;
            (BrowseManager.multiSelected() || []).forEach(a => {
                if (!a.hasChangeVisibilityRight()) {
                    _canChangeVisibility = false;
                }
            });
            return _canChangeVisibility;
        });

        static canTakeOwnership = ko.pureComputed<boolean>(() => {
            var _canTakeOwnership = true;
            (BrowseManager.multiSelected() || []).forEach(a => {
                if (!a.hasTakeOwnershipRight() && !a.hasChangeOwnershipRight()) {
                    _canTakeOwnership = false;
                }
            });
            // If I own all selected, then I can't take ownership of what I already completely own
            return _canTakeOwnership && !BatchManagementManager.doesOwnAll();
        });

        static doesOwnAll = ko.pureComputed<boolean>(() => {
            if (!BatchManagementManager.snapshot()) {
                return false;
            }
            return !!BatchManagementManager.snapshot().ownersOnAll().filter(o => o.name === $tokyo.user.email).length;
        });

        static atLeastOneIsOwned = ko.pureComputed<boolean>(() => {
            if (!BatchManagementManager.snapshot()) {
                return false;
            }
            return !!BatchManagementManager.snapshot().ownersOnAll().length || !!BatchManagementManager.snapshot().ownersOnSome().length;
        });

        static allAreVisibleToEveryone = ko.pureComputed<boolean>(() => {
            if (!BatchManagementManager.snapshot()) {
                return false;
            }
            return BatchManagementManager.snapshot().visibility() === "All";
        });

        static isMixedVisibility = ko.pureComputed<boolean>(() => {
            if (!BatchManagementManager.snapshot()) {
                return true;
            }
            return BatchManagementManager.snapshot().visibility() === "Mixed";
        });

        static someAreOwnedByOthersAndNotMe = ko.pureComputed<boolean>(() => {
            var _someAreOwnedByOthersAndNotMe = false;
            (BrowseManager.multiSelected() || []).forEach(a => {
                if (!a.hasTakeOwnershipRight() && !a.hasChangeOwnershipRight()) {
                    _someAreOwnedByOthersAndNotMe = true;
                }
            });
            return _someAreOwnedByOthersAndNotMe;
        });
    }
}