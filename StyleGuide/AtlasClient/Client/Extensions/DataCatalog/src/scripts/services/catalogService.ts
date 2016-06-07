module Microsoft.DataStudio.DataCatalog.Services {

    export class CatalogService extends BaseService {

        public static API_VERSION: string = "2015-07.1.0-Preview";

        static createCatalogEntry(typeName: string, body: Interfaces.IManualEntry): JQueryPromise<string> {
            var url = Core.Utilities.stringFormat("/views/{0}?api-version={1}", encodeURIComponent(typeName), CatalogService.API_VERSION);
            var deferred = $.Deferred();

            this.ajax(url, { method: "POST", data: this.stringify(body), contentType: "application/json" })
                .done((data, textStatus, jqXhr) => {
                var location = jqXhr.getResponseHeader("Location");
                deferred.resolve(location);
            })
                .fail(deferred.reject);
            return deferred.promise();
        }

        static updateDocumentation(containerId: string, documentation: Interfaces.IBindableDocumentation, viewRebinder: () => void): JQueryPromise<any> {
            var baseUrl = "/views/{0}?api-version={1}";
            var method = "", url = "";

            if (documentation.__id) {
                method = "PUT";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(documentation.__id), CatalogService.API_VERSION);
            } else {
                method = "POST";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/documentation"), CatalogService.API_VERSION);
            }

            var doc = <Interfaces.IDocumentation>ko.toJS(documentation);
            delete (<any>doc).__creatorId;
            delete (<any>doc).__effectiveRights;
            delete (<any>doc).__type;
            delete (<any>doc).experts;

            var previousModifiedTime = doc.modifiedTime;
            doc.modifiedTime = documentation.modifiedTime = new Date().toISOString();

            var logData = $.extend({}, doc);
            logger.logInfo("Update documentation", { data: logData });

            return this.ajax(url, { method: method, data: JSON.stringify(doc), contentType: "application/json" }, () => {
                documentation.modifiedTime = previousModifiedTime;
                if (!documentation.__id) {
                    documentation.content("");
                    viewRebinder();
                    return $.Deferred().resolve().promise();
                }
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(documentation.__id));
                return this.ajax(url, { method: "GET" })
                    .done((response: Interfaces.IDocumentation) => {
                    documentation.content(response.content);
                    documentation.modifiedTime = response.modifiedTime;
                    viewRebinder();
                });
            })
                .done((data, textStatus, jqXhr) => {
                logger.logInfo("Update documentation complete", { data: logData });
                // Get location from headers if this was a POST
                var location = jqXhr.getResponseHeader("Location");
                if (location && !documentation.__id) {
                    documentation.__id = location;
                }
            });
        }

        static updateAccessInstruction(containerId: string, accessInstruction: Interfaces.IAccessInstruction, viewRebinder: () => void): JQueryPromise<any> {
            var baseUrl = "/views/{0}?api-version={1}";
            var method = "", url = "";

            if (accessInstruction.__id) {
                method = "PUT";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(accessInstruction.__id), CatalogService.API_VERSION);
            } else {
                method = "POST";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/accessInstructions"), CatalogService.API_VERSION);
            }

            var ai = <Interfaces.IAccessInstruction>ko.toJS(accessInstruction);
            delete (<any>ai).__effectiveRights;
            delete (<any>ai).__roles;
            delete (<any>ai).__type;

            var previousModifiedTime = ai.modifiedTime;
            ai.modifiedTime = accessInstruction.modifiedTime = new Date().toISOString();

            var logData = $.extend({}, ai);
            delete logData.__creatorId;
            logger.logInfo("Update access instruction", { data: logData });

            return this.ajax(url, { method: method, data: this.stringify(ai), contentType: "application/json" }, () => {
                accessInstruction.modifiedTime = previousModifiedTime;
                if (!accessInstruction.__id) {
                    accessInstruction.content = "";
                    viewRebinder();
                    return $.Deferred().resolve().promise();
                }
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(accessInstruction.__id));
                return this.ajax(url, { method: "GET" })
                    .done((response: Interfaces.IAccessInstruction) => {
                    accessInstruction.content = response.content;
                    accessInstruction.modifiedTime = response.modifiedTime;
                    viewRebinder();
                });
            })
                .done((data, textStatus, jqXhr) => {
                logger.logInfo("Update access instruction complete", { data: logData });
                // Get location from headers if this was a POST
                var location = jqXhr.getResponseHeader("Location");
                if (location && !accessInstruction.__id) {
                    accessInstruction.__id = location;
                }
            });
        }

        static updateUserDescription(containerId: string, desc: Interfaces.IBindableDescription, viewRebinder: () => void): JQueryPromise<any> {
            var baseUrl = "/views/{0}?api-version={1}";
            var method = "", url = "";

            if (desc.__id) {
                method = "PUT";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(desc.__id), CatalogService.API_VERSION);
            } else {
                method = "POST";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/descriptions"), CatalogService.API_VERSION);
            }

            var previousModifiedTime = desc.modifiedTime();
            desc.modifiedTime(new Date().toISOString());

            var description = {
                friendlyName: desc.friendlyName(),
                description: desc.description(),
                tags: desc.tags(),
                modifiedTime: desc.modifiedTime(),
                __creatorId: desc.__creatorId
            };

            var logData = $.extend({}, description);
            delete logData.__creatorId;
            logger.logInfo("Update description", { data: logData });

            return this.ajax(url, { method: method, data: this.stringify(description), contentType: "application/json" }, () => {
                desc.modifiedTime(previousModifiedTime);
                if (!desc.__id) {
                    desc.friendlyName("");
                    desc.description("");
                    desc.tags([]);
                    viewRebinder();
                    return $.Deferred().resolve().promise();
                }
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(desc.__id));
                return this.ajax(url, { method: "GET" })
                    .done((response: Interfaces.IDescription) => {
                    desc.friendlyName(response.friendlyName);
                    desc.description(response.description);
                    desc.tags(response.tags);
                    viewRebinder();
                });
            })
                .done((data, textStatus, jqXhr) => {
                    logger.logInfo("Update description complete", { data: logData });
                // Get location from headers if this was a POST
                var location = jqXhr.getResponseHeader("Location");
                if (location && !desc.__id) {
                    desc.__id = location;
                }
            });
        }

        static updateUserExperts(containerId: string, bindableExpert: Interfaces.IBindableExpert, viewRebinder: () => void): JQueryPromise<any> {
            var baseUrl = "/views/{0}?api-version={1}";
            var method = "", url = "";

            if (bindableExpert.__id) {
                method = "PUT";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableExpert.__id), CatalogService.API_VERSION);
            } else {
                method = "POST";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/experts"), CatalogService.API_VERSION);
            }

            var expert = {
                experts: bindableExpert.experts() || [],
                modifiedTime: new Date().toISOString(),
                __creatorId: $tokyo.user.email
            };

            var logData = $.extend({}, expert);
            delete logData.__creatorId;
            logger.logInfo("Update expert", { data: logData });

            var previousModifiedTime = bindableExpert.modifiedTime();
            bindableExpert.modifiedTime(new Date().toISOString());
            return this.ajax(url, { method: method, data: this.stringify(expert), contentType: "application/json" }, () => {
                bindableExpert.modifiedTime(previousModifiedTime);
                if (!bindableExpert.__id) {
                    bindableExpert.experts([]);
                    viewRebinder();
                    return $.Deferred().resolve().promise();
                }
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableExpert.__id));
                return this.ajax(url, { method: "GET" })
                    .done((response: Interfaces.IExpert) => {
                    bindableExpert.experts(response.experts);
                    viewRebinder();
                });
            })
                .done((data, textStatus, jqXhr) => {
                    logger.logInfo("Update expert complete", { data: logData });
                // Get location from headers if this was a POST
                var location = jqXhr.getResponseHeader("Location");
                if (location && !bindableExpert.__id) {
                    bindableExpert.__id = location;
                }
            });
        }

        static updateUserSchemaDescription(containerId: string, bindableSchemaDesc: Interfaces.IBindableSchemaDescription, viewRebinder: () => void) {
            var baseUrl = "/views/{0}?api-version={1}";
            var method = "", url = "";

            if (bindableSchemaDesc.__id) {
                method = "PUT";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableSchemaDesc.__id), CatalogService.API_VERSION);
            } else {
                method = "POST";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/schemaDescriptions"), CatalogService.API_VERSION);
            }

            bindableSchemaDesc.modifiedTime(new Date().toISOString());

            var schemaDescription: any = {
                __id: bindableSchemaDesc.__id,
                __creatorId: $tokyo.user.email,
                modifiedTime: bindableSchemaDesc.modifiedTime(),
                columnDescriptions: []
            };

            $.each(bindableSchemaDesc.columnDescriptions || [], (i, columnDesc: Interfaces.IBindableColumn) => {
                schemaDescription.columnDescriptions.push({
                    tags: columnDesc.tags(),
                    description: columnDesc.description(),
                    columnName: columnDesc.columnName
                });
            });

            var logData = $.extend({}, schemaDescription);
            delete logData.__creatorId;
            logger.logInfo("Update schema description", { data: logData });

            return this.ajax(url, { method: method, data: this.stringify(schemaDescription), contentType: "application/json" }, () => {
                if (!bindableSchemaDesc.__id) {
                    (bindableSchemaDesc.columnDescriptions || []).forEach(cd => {
                        cd.tags([]);
                        cd.description("");
                    });
                    viewRebinder();
                    return $.Deferred().resolve().promise();
                }
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableSchemaDesc.__id));
                return this.ajax(url, { method: "GET" })
                    .done((response: Interfaces.ISchemaDescription) => {
                    (response.columnDescriptions || []).forEach(cd => {
                        var columnName = cd.columnName;
                        var bindableColumn = bindableSchemaDesc.getBindableColumnByName(columnName);
                        if (bindableColumn) {
                            bindableColumn.tags(cd.tags);
                            bindableColumn.description(cd.description);
                        }
                    });
                    viewRebinder();
                });
            })
                .done((data, textStatus, jqXhr) => {
                    logger.logInfo("Update schema description complete", { data: logData });
                // Get location from headers if this was a POST
                var location = jqXhr.getResponseHeader("Location");
                if (location) {
                    bindableSchemaDesc.__id = location;
                }
            });
        }

        static updateSchema(containerId: string, bindableSchema: Interfaces.IBindableSchema, viewRebinder: () => void) {
            var baseUrl = "/views/{0}?api-version={1}";
            var method = "";
            var url = "";

            if (bindableSchema.__id && bindableSchema.__id !== undefined) {
                method = "PUT";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableSchema.__id), CatalogService.API_VERSION);
            }
            else {
                method = "POST";
                url = Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/schemas"), CatalogService.API_VERSION);
            }

            bindableSchema.modifiedTime = new Date().toISOString();

            var schema: any = {
                __id: bindableSchema.__id,
                __creatorId: bindableSchema.__creatorId || $tokyo.user.email,
                modifiedTime: bindableSchema.modifiedTime,
                columns: []
            };

            $.each(bindableSchema.columns || [], (i, column: Interfaces.IColumn) => {
                if ($.trim(column.name) !== "") {
                    schema.columns.push({
                        name: column.name,
                        type: column.type
                    });
                }
            });

            var logData = $.extend({}, schema);
            delete logData.__creatorId;
            logger.logInfo("Update schema", { data: logData });

            return this.ajax(url, { method: method, data: this.stringify(schema), contentType: "application/json" }, () => {
                return $.Deferred().resolve().promise();
            })
                .done((data, textStatus, jqXhr) => {
                    logger.logInfo("Update schema complete", { data: logData });
                var location = jqXhr.getResponseHeader("Location");
                if (location) {
                    bindableSchema.__id = location;
                }
            });
        }

        static deleteAssets(ids: string[]): JQueryPromise<string[]> {
            var outerDeferred = $.Deferred<string[]>();

            var promises = [];
            var failedIds: string[] = [];

            $.each(ids, (i, id) => {
                var url = Core.Utilities.stringFormat("/views/{0}?api-version={1}", encodeURIComponent(id), CatalogService.API_VERSION);
                var promise = this.ajax(url, { method: "DELETE" });
                promises.push(promise);
            });

            this.allSettled(promises)
                .progress(() => {
                outerDeferred.notify();
            })
                .done((results) => {
                $.each(results, (i, result) => {
                    if (result.state !== "fulfilled") {
                        failedIds.push(ids[i]);
                    }
                });
                outerDeferred.resolve(failedIds);
            });

            return outerDeferred.promise();
        }

        static saveBatchChanges(propertyChanges: Interfaces.IAssetChanges, schemaChanges: Interfaces.IAssetSchemaChange[], authChanges: Interfaces.IAuthorizationChanges, assets: Interfaces.IBindableDataEntity[], viewRebinder: () => void): JQueryPromise<Interfaces.IAllSettledResult[]> {
            var deferred = $.Deferred<Interfaces.IAllSettledResult[]>();

            var promises = [];

            (assets || []).forEach(asset => {
                var foundDescChange = false;
                var foundExpertChange = false;
                var foundSchemaChange = false;
                var foundAccessInstructionChange = false;
                var myAccessInstruction = Core.Utilities.arrayFirst(asset.accessInstructions.filter(ai => ai.__creatorId === $tokyo.user.email));
                var myDesc = Core.Utilities.arrayFirst(asset.descriptions().filter(d => d.__creatorId === $tokyo.user.email));
                var myExpert = Core.Utilities.arrayFirst(asset.experts().filter(d => d.__creatorId === $tokyo.user.email));
                var mySchemaDesc = asset.schemaDescription;

                if (propertyChanges.description !== undefined) {
                    myDesc.description(propertyChanges.description);
                    foundDescChange = true;
                }

                if (propertyChanges.tagsToAdd) {
                    var tagPreCount = myDesc.tags().length;
                    var tagsToAddHere = Core.Utilities.arrayExcept(propertyChanges.tagsToAdd, myDesc.tags(), (a, b) => {
                        return $.trim(a.toLowerCase()) === $.trim(b.toLowerCase());
                    });
                    myDesc.tags(Core.Utilities.arrayDistinct(tagsToAddHere.concat(myDesc.tags())));
                    foundDescChange = foundDescChange || (tagPreCount < myDesc.tags().length);
                }

                if (propertyChanges.tagsToRemove) {
                    var removedTags = myDesc.tags.removeAll(propertyChanges.tagsToRemove);
                    foundDescChange = foundDescChange || (removedTags.length > 0);
                }

                if (propertyChanges.expertsToAdd) {
                    var expertPreCount = myExpert.experts().length;
                    var expertsToAddHere = Core.Utilities.arrayExcept(propertyChanges.expertsToAdd, myExpert.experts(), (a, b) => {
                        return $.trim(a.toLowerCase()) === $.trim(b.toLowerCase());
                    });
                    myExpert.experts(Core.Utilities.arrayDistinct(expertsToAddHere.concat(myExpert.experts())));
                    foundExpertChange = foundExpertChange || (expertPreCount < myExpert.experts().length);
                }

                if (propertyChanges.expertsToRemove) {
                    var removedExperts = myExpert.experts.removeAll(propertyChanges.expertsToRemove);
                    foundExpertChange = foundExpertChange || (removedExperts.length > 0);
                }

                if (propertyChanges.requestAccess !== myAccessInstruction.content) {
                    myAccessInstruction.content = propertyChanges.requestAccess;
                    foundAccessInstructionChange = true;
                }

                schemaChanges.forEach(sc => {

                    var myColumnDesc = mySchemaDesc.getBindableColumnByName(sc.columnName);

                    if (sc.tagsToAdd) {
                        var schemaTagPreCount = myColumnDesc.tags().length;
                        myColumnDesc.tags(Core.Utilities.arrayDistinct(sc.tagsToAdd.concat(myColumnDesc.tags())));
                        foundSchemaChange = foundSchemaChange || (schemaTagPreCount < myColumnDesc.tags().length);
                    }

                    if (sc.tagsToRemove) {
                        var schemaDescRemovedTags = myColumnDesc.tags.removeAll(sc.tagsToRemove);
                        foundSchemaChange = foundSchemaChange || (schemaDescRemovedTags.length > 0);
                    }

                    if ((sc.description || "") !== myColumnDesc.description()) {
                        foundSchemaChange = true;
                        myColumnDesc.description(sc.description || "");
                    }
                });

                if (foundDescChange) {
                    asset.metadataLastUpdated(new Date());
                    asset.metadataLastUpdatedBy($tokyo.user.email);
                    var descPromise = this.updateUserDescription(asset.__id, myDesc, viewRebinder);
                    promises.push(descPromise);
                }

                if (foundExpertChange) {
                    asset.metadataLastUpdated(new Date());
                    asset.metadataLastUpdatedBy($tokyo.user.email);
                    var expertPromise = this.updateUserExperts(asset.__id, myExpert, viewRebinder);
                    promises.push(expertPromise);
                }

                if (foundSchemaChange) {
                    asset.metadataLastUpdated(new Date());
                    asset.metadataLastUpdatedBy($tokyo.user.email);
                    var schemaDescPromise = this.updateUserSchemaDescription(asset.__id, mySchemaDesc, viewRebinder);
                    promises.push(schemaDescPromise);
                }

                if (foundAccessInstructionChange) {
                    asset.metadataLastUpdated(new Date());
                    asset.metadataLastUpdatedBy($tokyo.user.email);
                    var accessInstructionPromise = this.updateAccessInstruction(asset.__id, myAccessInstruction, viewRebinder);
                    promises.push(accessInstructionPromise);
                }

                var authResult = this.applyAuthChanges(authChanges, asset, viewRebinder);
                if (authResult.foundChange) {
                    promises.push(authResult.promise);
                }
            });

            this.allSettled(promises).done(results => {
                deferred.resolve(results);
            });

            return deferred.promise();
        }

        private static applyAuthChanges(authChanges: Interfaces.IAuthorizationChanges, asset: Interfaces.IBindableDataEntity, viewRebinder: () => void): { foundChange: boolean; promise?: JQueryPromise<any> } {
            var foundChange = false;
            var promise: JQueryPromise<any> = null;

            if (authChanges.visibility === "All" && asset.__permissions()) {
                // Updating visibility to all
                var removedReadPermissions = false;
                // Remove all "Read" rights
                asset.__permissions().forEach(p => {
                    removedReadPermissions = !!(p.rights.remove(r => r.right === "Read") || []).length;
                });

                if (removedReadPermissions) {
                    foundChange = true;
                }

                // Remove all permissions without any rights
                var newPermissions = asset.__permissions().filter(p => p.rights().length > 0);
                asset.__permissions(newPermissions);
            }

            if (authChanges.visibility === "Some") {
                if (!asset.__permissions()) {
                    asset.__permissions([]);
                }
                var foundReadPermission = false;
                asset.__permissions().forEach(p => {
                    var hasReadPermission = p.rights().some(r => r.right === "Read");
                    if (hasReadPermission) {
                        foundReadPermission = true;
                    }
                });

                if (!foundReadPermission) {
                    foundChange = true;
                    asset.__permissions.push({
                        rights: ko.observableArray([{ right: "Read" }]),
                        principal: {
                            objectId: Core.Constants.Users.NOBODY,
                            upn: Core.Constants.Users.NOBODY
                        }
                    });
                }
            }

            var owners = Core.Utilities.arrayFirst(asset.__roles().filter(r => r.role === "Owner"));
            (authChanges.ownersToAdd || []).forEach(o => {
                if (owners && owners.members && owners.members()) {
                    var preExistingOwner = Core.Utilities.arrayFirst(owners.members().filter(m => m.objectId === o.objectId));
                    if (!preExistingOwner) {
                        foundChange = true;
                        owners.members.push({
                            upn: o.upn,
                            objectId: o.objectId
                        });
                    }
                } else {
                    if (!owners) {
                        owners = {
                            role: "Owner",
                            members: ko.observableArray<Interfaces.IPrincipal>([])
                        };
                        asset.__roles.push(owners);
                    }
                    foundChange = true;
                    owners.members.push({
                        upn: o.upn,
                        objectId: o.objectId
                    });

                }
            });

            (authChanges.ownersToRemove || []).forEach(o => {
                if (owners && owners.members && owners.members()) {
                    var removedOwner = !!(owners.members.remove(m => m.objectId === o.objectId) || []).length;
                    if (removedOwner) {
                        foundChange = true;
                    }
                }
            });

            (authChanges.usersToAdd || []).forEach(u => {
                if (!asset.__permissions()) {
                    asset.__permissions([]);
                }
                var userPerms = Core.Utilities.arrayFirst(asset.__permissions().filter(p => p.principal.objectId === u.objectId));
                if (userPerms && !Core.Utilities.arrayFirst(userPerms.rights().filter(r => r.right === "Read"))) {
                    foundChange = true;
                    userPerms.rights.push({ right: "Read" });
                } else if (!userPerms) {
                    foundChange = true;
                    asset.__permissions.push({
                        rights: ko.observableArray([{ right: "Read" }]),
                        principal: {
                            objectId: u.objectId,
                            upn: u.upn
                        }
                    });
                }
            });

            (authChanges.usersToRemove || []).forEach(u => {
                if (asset.__permissions()) {
                    // Remove "Read" rights from user
                    asset.__permissions().filter(p => p.principal.objectId === u.objectId).forEach(p => {
                        var removedRight = p.rights.remove(r => r.right === "Read");
                        if (removedRight) {
                            foundChange = true;
                        }
                    });

                    // Remove all permissions without any rights
                    var newPermissions = asset.__permissions().filter(p => p.rights().length > 0);
                    asset.__permissions(newPermissions);
                }
            });

            if (foundChange) {
                var permissions = ko.toJS(asset.__permissions());
                var roles = ko.toJS(asset.__roles());
                promise = this.updateRolesAndPermissions(asset, roles, permissions, viewRebinder);
            }

            return {
                foundChange: foundChange,
                promise: promise
            };
        }

        static updateRolesAndPermissions(asset: Interfaces.IBindableDataEntity, roles: Interfaces.IRole[], permissions: Interfaces.IPermission[], viewRebinder: () => void): JQueryPromise<string[]> {
            var url = Core.Utilities.stringFormat("api/catalog?idPath={0}", encodeURIComponent(asset.__id));
            var deferred = $.Deferred();

            // Go get the asset to do a diff on properties so as to only update those that have changed
            this.ajax(url, { method: "GET" })
                .done((result: Interfaces.IDataEntity) => {

                var rolesAndPermissions = {
                    // Only update Owner roles
                    __roles: (roles || []).filter(r => r.role === "Owner"),
                    __permissions: permissions || []
                };

                //#region Diff check roles
                var existingOwners = [];
                (result.__roles || []).forEach(r => {
                    if (r.role === "Owner") {
                        (r.members || []).forEach(m => {
                            $.trim(m.objectId) && existingOwners.push(m.objectId);
                        });
                    }
                });

                var newOwners = [];
                rolesAndPermissions.__roles.forEach(r => {
                    if (r.role === "Owner") {
                        (r.members || []).forEach(m => {
                            $.trim(m.objectId) && newOwners.push(m.objectId);
                        });
                    }
                });

                // Tidy up
                existingOwners = Core.Utilities.arrayDistinct(existingOwners.map($.trim)).sort();
                newOwners = Core.Utilities.arrayDistinct(newOwners.map($.trim)).sort();

                // If there is no change, delete the __roles
                var existingOwnersString = existingOwners.join(";");
                var newOwnersString = newOwners.join(";");
                if (existingOwnersString === newOwnersString) {
                    // No change
                    delete rolesAndPermissions.__roles;
                }
                //#endregion

                //#region Diff check permissions
                var existingReaders = [];
                (result.__permissions || []).forEach(p => {
                    var hasReadPermission = (p.rights || []).some(r => r.right === "Read");
                    if (hasReadPermission) {
                        p.principal && $.trim(p.principal.objectId) && existingReaders.push(p.principal.objectId);
                    }
                });

                var newReaders = [];
                rolesAndPermissions.__permissions.forEach(p => {
                    var hasReadPermission = (p.rights || []).some(r => r.right === "Read");
                    if (hasReadPermission) {
                        p.principal && $.trim(p.principal.objectId) && newReaders.push(p.principal.objectId);
                    }
                });

                // Tidy up
                existingReaders = Core.Utilities.arrayDistinct(existingReaders.map($.trim)).sort();
                newReaders = Core.Utilities.arrayDistinct(newReaders.map($.trim)).sort();

                // If there is no change, delete the __permissions
                var existingReadersString = existingReaders.join(";");
                var newReadersString = newReaders.join(";");
                if (existingReadersString === newReadersString) {
                    // No change
                    delete rolesAndPermissions.__permissions;
                }
                //#endregion

                if (!rolesAndPermissions.__roles && !rolesAndPermissions.__permissions) {
                    // No changes at all, this is odd.
                    logger.logInfo("Call to update roles and permission, but no changes found.", { data: asset.__id });
                    deferred.resolve();
                } else {
                    logger.logInfo("Updating roles and permissions", { data: asset.__id });

                    this.ajax(url, { method: "PUT", data: this.stringify(rolesAndPermissions), contentType: "application/json" }, () => {
                        asset.__roles((result.__roles || []).map(r => new Models.BindableRole(r)));
                        asset.__permissions((result.__permissions || []).map(p => new Models.BindablePermission(p)));
                        viewRebinder();
                        return $.Deferred().resolve().promise();
                    })
                        .done(() => {
                        // Now go get the updated effective rights
                        this.ajax(url, { method: "GET" })
                            .done((result: Interfaces.IDataEntity) => {
                            logger.logInfo("Getting updated effective rights", { data: asset.__id });
                            var effectiveRights = (result || { __effectiveRights: null }).__effectiveRights;
                            // Apply the updated effective rights to the asset
                            asset.__effectiveRights(effectiveRights);
                            deferred.resolve(effectiveRights);
                        })
                            .fail(deferred.reject);
                    })
                        .fail(deferred.reject);
                }
            })
                .fail(deferred.reject);

            return deferred.promise();
        }

        static getAsset<T>(id: string, cancelAction?: () => JQueryPromise<any>, showModalOnError?: boolean, onUnauthorized?: (correlationId) => JQueryPromise<any>): JQueryPromise<T> {
            var url = Core.Utilities.stringFormat("api/catalog?idPath={0}", encodeURIComponent(id));
            return this.ajax<T>(url, { method: "GET" }, cancelAction, showModalOnError, onUnauthorized);
        }
    }
}