module Microsoft.DataStudio.DataCatalog.Services {

    export class UserService extends BaseService {
        private static _upnCache: { [upn: string]: Interfaces.IUserResolution } = {};

        private static _objectIdCache: { [objectId: string]: Interfaces.IUserResolution } = {};
        private static _invalidObjectIds: { [objectId: string]: boolean } = {};
        private static _failedObjectIds: { [objectId: string]: boolean } = {};
        private static _userCountPromise: JQueryPromise<any>;

        static init() {
            this._objectIdCache[Core.Constants.Users.NOBODY] = {
                upn: <string>Core.Constants.Users.NOBODY,
                objectId: <string>Core.Constants.Users.NOBODY,
                objectType: "User"
            };
            this._objectIdCache[$tokyo.user.objectId] = {
                upn: $tokyo.user.upn,
                objectId: $tokyo.user.objectId,
                objectType: "User"
            };
            this._upnCache[$tokyo.user.upn] = {
                upn: $tokyo.user.upn,
                objectId: $tokyo.user.objectId,
                objectType: "User"
            };
        }

        private static _getUnitsForAutoUnitAdjustCatalogCache = {};
        static getUnitsForAutoUnitAdjustCatalog(objectIds: string[]): JQueryPromise<{ value: number }> {
            var deferred = $.Deferred();
            deferred.resolve({ value: 0 });
            return deferred.promise();

            objectIds = Core.Utilities.arrayDistinct((objectIds || [])).sort();
            if (!objectIds.length) {
                return $.Deferred().resolve({ value: 1 }).promise();
            }

            var cacheKey = objectIds.join("&");
            if (this._getUnitsForAutoUnitAdjustCatalogCache[cacheKey]) {
                return this._getUnitsForAutoUnitAdjustCatalogCache[cacheKey];
            }

            var promise = this.ajax("/api/users/getUnitsForAutoUnitAdjustCatalog", { method: "PUT", data: this.stringify(objectIds), contentType: "application/json" });
            this._getUnitsForAutoUnitAdjustCatalogCache[cacheKey] = promise;

            promise.done(() => {
                // Clear the cache after a minute
                setTimeout(() => {
                    this._getUnitsForAutoUnitAdjustCatalogCache[cacheKey] = null;
                }, 1000 * 60);
            });

            return promise;
        }

        static resolveUpns(upns: string[], groupBehavior): JQueryPromise<{ valid: Interfaces.IUserResolution[]; invalid: string[]; failed: string[]; duplicated: string[]; }> {
            var deferred = $.Deferred();
            deferred.resolve({ valid: [], invalid: [], failed: [], duplicated: [] });
            return deferred.promise();

            upns = (upns || []).filter(upn => !!$.trim(upn));

            // Find upns not in the cache
            var cacheMisses: string[] = [];
            var cacheHits: Interfaces.IUserResolution[] = [];
            upns.forEach(upn => {
                var cacheHit = this._upnCache[upn];
                if (cacheHit) {
                    cacheHits.push(cacheHit);
                } else {
                    cacheMisses.push(upn);
                }
            });

            var resolveFromCache = () => {
                deferred.resolve({
                    valid: cacheHits,
                    invalid: cacheMisses,
                    failed: [],
                    duplicated: []
                });
            };

            if (!cacheMisses.length) {
                resolveFromCache();
            } else {
                this.ajax("/api/users/resolveupns", { data: { upns: cacheMisses, groupBehavior: groupBehavior } })
                    .done((result: { valid: Interfaces.IUserResolution[]; invalid: string[]; failed: string[]; duplicated: string[]; }) => {
                    if (result) {
                        result.valid = result.valid || [];
                        // Add to cache
                        result.valid.forEach(r => {
                            this._objectIdCache[r.objectId] = r;
                            this._upnCache[r.upn] = r;
                        });

                        // Add cache hits to response
                        result.valid = result.valid.concat(cacheHits);

                        deferred.resolve(result);
                    } else {
                        resolveFromCache();
                    }
                })
                    .fail(() => {
                    deferred.resolve({
                        valid: cacheHits,
                        invalid: [],
                        failed: cacheMisses,
                        duplicated: []
                    });
                });
            }

            return deferred.promise();
        }

        static resolveObjectIds(objectIds: string[]): JQueryPromise<{ valid: Interfaces.IUserResolution[]; invalid: string[]; failed: string[] }> {
            var deferred = $.Deferred();
            deferred.resolve({ valid: [], invalid: [], failed: [] });
            return deferred.promise();

            objectIds = (objectIds || []).filter(objectId => !!$.trim(objectId));

            // Find objectIds not in the cache
            var cacheMisses = [];
            objectIds.forEach(objectId => {
                if (!this._objectIdCache[objectId]) {
                    cacheMisses.push(objectId);
                }
            });

            var resolveFromCache = () => {
                var valid: { upn: string; objectId: string }[] = [];
                var invalid: string[] = [];
                var failed: string[] = [];

                objectIds.forEach(objectId => {
                    valid.push(this._objectIdCache[objectId]);

                    if (this._invalidObjectIds[objectId]) {
                        invalid.push(objectId);
                    }

                    if (this._failedObjectIds[objectId]) {
                        failed.push(objectId);
                    }
                });

                deferred.resolve({
                    valid: valid,
                    invalid: invalid,
                    failed: failed
                });
            };

            // Did everything get resolved?
            if (!cacheMisses.length) {
                resolveFromCache();
            } else {
                this.ajax("api/users/resolveobjectids", { method: "PUT", data: this.stringify(cacheMisses), contentType: "application/json" }, null, false)
                    .done((result: { valid: Interfaces.IUserResolution[]; invalid: string[]; failed: string[] }) => {
                    if (result) {
                        // Add to caches
                        (result.valid || []).forEach(r => {
                            this._objectIdCache[r.objectId] = r;
                            this._upnCache[r.upn] = r;
                        });

                        (result.invalid || []).forEach(objectId => {
                            this._invalidObjectIds[objectId] = true;
                        });

                        (result.failed || []).forEach(objectId => {
                            this._failedObjectIds[objectId] = true;
                        });
                    }
                })
                    .always(() => {

                    cacheMisses.forEach(objectId => {
                        if (!this._objectIdCache[objectId]) {
                            
                            // Add it to the valid list with a placeholder upn
                            this._objectIdCache[objectId] = {
                                objectId: objectId,
                                upn: objectId,
                                objectType: "User"
                            }

                            // Make sure, if nothing else, I'm resolved
                            if (objectId === $tokyo.user.objectId) {
                                this._objectIdCache[objectId].upn = $tokyo.user.upn;
                            }
                        }
                    });

                    resolveFromCache();
                });
            }

            return deferred.promise();
        }

        static waitUntilAllowed(): JQueryPromise<any> {
            var deferred = $.Deferred();
            var correlationId = this.getNewCorrelationId();
            var requiredConsecutivePass = 2;
            var currentPassCount = 0;
            var url = "/home/isallowed";

            var timeout = setTimeout(() => {
                deferred.reject("timeout");
            }, 1000 * 60 * 5); // 5 minutes

            logger.logInfo("starting to wait if user is allowed", { correlationId: correlationId });

            var check = () => {
                $.ajax(url)
                    .done(function () {
                    if (currentPassCount < requiredConsecutivePass) {
                        currentPassCount++;
                        logger.logInfo( "user is allowed - checking again", { correlationId: correlationId, currentPassCount: currentPassCount, requiredConsecutivePass: requiredConsecutivePass });
                        setTimeout(check, 1500);
                    } else {
                        logger.logInfo("user is now allowed", { correlationId: correlationId, currentPassCount: currentPassCount, requiredConsecutivePass: requiredConsecutivePass });
                        deferred.resolveWith(deferred, arguments);
                    }
                })
                    .fail(function (jqXhr: JQueryXHR) {
                    if ((jqXhr.status === 401 || jqXhr.status === 403) && (deferred.state() === "pending")) {
                        logger.logInfo("user is not allowed yet", { correlationId: correlationId });
                        setTimeout(check, 1500);
                    } else {
                        deferred.rejectWith(deferred, arguments);
                    }
                });
            };

            deferred
                .done(() => {
                clearTimeout(timeout);
                logger.logInfo("user is now allowed", { correlationId: correlationId });
            })
                .fail((jqueryXhr: JQueryXHR) => {
                this.logAjaxError(jqueryXhr, { url: url, correlationId: correlationId });
            })
                .always(() => {
                clearTimeout(timeout);
            });

            check();

            return deferred.promise();
        }

        static waitUntilNotAllowed(): JQueryPromise<any> {
            var deferred = $.Deferred();
            var correlationId = this.getNewCorrelationId();
            var url = "/home/isallowed";

            var timeout = setTimeout(() => {
                deferred.reject("timeout");
            }, 1000 * 60 * 5); // 5 minutes

            logger.logInfo("starting to wait if user is not allowed", { correlationId: correlationId });

            var check = () => {
                $.ajax(url)
                    .done(() => {
                    logger.logInfo("user is still allowed", { correlationId: correlationId });
                    setTimeout(check, 1500);
                })
                    .fail(function (jqXhr: JQueryXHR) {
                    if ((jqXhr.status === 401 || jqXhr.status === 403) && (deferred.state() === "pending")) {
                        deferred.resolve();
                    } else {
                        deferred.rejectWith(deferred, arguments);
                    }
                });
            };

            deferred
                .done(() => {
                clearTimeout(timeout);
                logger.logInfo("user is now not allowed", { correlationId: correlationId });
            })
                .fail((jqueryXhr: JQueryXHR) => {
                this.logAjaxError(jqueryXhr, { url: url, correlationId: correlationId });
            })
                .always(() => {
                clearTimeout(timeout);
            });

            check();

            return deferred.promise();
        }

        static getTotalUsers(): JQueryPromise<any> {
            var deferred = $.Deferred();
            deferred.resolve(0);
            return deferred.promise();

            if (!this._userCountPromise) {
                var url = "api/users/TotalUserCount";
                this._userCountPromise = $.ajax(url);
            }
            return this._userCountPromise;
        }
    }

}
//UserService.init();