module Microsoft.DataStudio.DataCatalog.Services {

    export var logger = Microsoft.DataStudio.DataCatalog.LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC service Components" });
    var authenticationManager: Microsoft.DataStudio.Managers.IAuthenticationManager = Microsoft.DataStudio.Managers.AuthenticationManager.instance;
    var configurationManager: Microsoft.DataStudio.Managers.IConfigurationManager = Microsoft.DataStudio.Managers.ConfigurationManager.instance;

    export class BaseService {

        static useMock: boolean = true;
        public static catalogName: string = "DefaultCatalog";

        static stringify(value: any): string {
            var jsonString = JSON.stringify(value);
            // Remove any HTML lingering around
            jsonString = Core.Utilities.plainText(jsonString);
            return jsonString;
        }

        static ensureAuth(): JQueryPromise<any> {
            return this.ajax("/api/ensureauthorized", { method: "GET" });
        }

        static getNewCorrelationId() {
            return (parseInt(Math.random() * Math.pow(2, 32) + "", 10)).toString(36).toUpperCase();
        }

        static logAjaxError(jqueryXhr: JQueryXHR, logObject: Object, logAsWarning?: boolean) {
            jqueryXhr = jqueryXhr || <JQueryXHR>{};
            logObject = logObject || {};

            if (jqueryXhr.getResponseHeader) {
                var tracingId = jqueryXhr.getResponseHeader($tokyo.constants.azureStandardResponseActivityIdHeader);
                var clientTracingId = jqueryXhr.getResponseHeader($tokyo.constants.azureStandardActivityIdHeader);
                var catalogResponseCode = jqueryXhr.getResponseHeader($tokyo.constants.catalogResponseStatusCodeHeaderName);
                var searchResponseCode = jqueryXhr.getResponseHeader($tokyo.constants.searchResponseStatusCodeHeaderName);
                logObject = $.extend({
                    tracingId: tracingId,
                    clientTracingId: clientTracingId,
                    catalogResponseCode: catalogResponseCode,
                    searchResponseCode: searchResponseCode
                }, logObject);
            }

            var stackTrace = "";
            try {
                var error = new Error();
                stackTrace = (<any>error).stack;
            } catch (e) {
            }

            logObject = $.extend({ responseText: jqueryXhr.responseText, stackTrace: stackTrace }, logObject);
            logAsWarning
                ? logger.logWarning(Core.Utilities.stringFormat("Ajax Warn: {0} - {1}", jqueryXhr.status, jqueryXhr.statusText), logObject)
                : logger.logError(Core.Utilities.stringFormat("Ajax Error: {0} - {1}", jqueryXhr.status, jqueryXhr.statusText), logObject);
        }

        static ajax<T>(url: string, settings?: JQueryAjaxSettings, cancelAction?: () => JQueryPromise<any>, showModalOnError?: boolean, onUnauthorized?: (correlationId) => JQueryPromise<any>): JQueryPromise<T> {
            var deferred = $.Deferred();
            var correlationId = this.getNewCorrelationId();
            var urlAction = /[^?]*/.exec(url.split("/").pop())[0];
            // Try again after transient error
            var reTry = () => {
                var retryDeferred = $.Deferred();
                var numFails = 0;
                var maxFails = 3;

                var execute = () => {

                    authenticationManager.getAccessTokenADC().then((token) => {

                        $.ajax(buildRequestUrl(token), $.extend({
                            beforeSend: (xhr, settings) => {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                            }
                        }, settings))
                            .done(() => {
                                logger.logInfo(Core.Utilities.stringFormat("successful ajax call after retry ({0})", urlAction), { correlationId: correlationId });
                            })
                            .done(retryDeferred.resolve)
                            .fail(function (r: JQueryXHR, textStatus: string, thrownError: any) {
                                r = r || <JQueryXHR>{};

                                logger.logWarning(Core.Utilities.stringFormat("unsuccessful ajax call during retry: ({0}) {1} - {2}", urlAction, r.status, r.statusText), { url: url, settings: settings, responseText: r.responseText, correlationId: correlationId });
                                numFails++;
                                if (numFails > maxFails) {
                                    retryDeferred.reject.apply(retryDeferred, arguments);
                                } else {
                                    setTimeout(execute, 500 * numFails);
                                }
                            });
                    });
                };

                setTimeout(execute, 1000);

                return retryDeferred.promise();
            };

            // Try to reauthenticate the user
            var reAuth = (() => {
                var authFrameId = "renew-auth-frame";
                var timeout: number;
                var executingKillSwitch = false;

                return (): JQueryPromise<any> => {
                    logger.logInfo(Core.Utilities.stringFormat("reauthenticating user ({0})", urlAction), { correlationId: correlationId });

                    var authDeferred = $.Deferred();
                    $("#" + authFrameId).remove();

                    var executeKillSwitch = () => {
                        if (!executingKillSwitch) {
                            executingKillSwitch = true;
                            // Just in case, let's arm a kill switch
                            logger.logWarning(Core.Utilities.stringFormat("failed to automatically reauthenticate user ({0})", urlAction), { correlationId: correlationId });
                            if (ModalService.isShowing()) {
                                var response = confirm(Core.Resx.expiredSession);
                                if (response) {
                                    window.location.reload();
                                }
                            } else {
                                ModalService.show({ title: Core.Resx.expiredSessionTitle, bodyText: Core.Resx.expiredSession })
                                    .done((modal) => {
                                    modal.close();
                                    window.location.reload();
                                });
                            }
                        }

                    };

                    var frame = $("<iframe>")
                        .css({ width: 0, height: 0, borderWidth: 0, position: "absolute", visibility: "hidden" })
                        .attr("id", authFrameId)
                        .attr("src", "/home/reauthenticate")
                        .load(() => {
                        try {
                            var responseBody = $("#" + authFrameId).contents().find("body").html();
                            if (responseBody === "reauthenticated") {
                                // We are re-authenticated
                                logger.logInfo(Core.Utilities.stringFormat("successfully automatically re-authenticated user ({0})", urlAction), { correlationId: correlationId });
                                // De-arm the kill switch
                                clearTimeout(timeout);
                                authDeferred.resolve();
                            } else {
                                logger.logWarning(Core.Utilities.stringFormat("bad response from reauthenticate endpoint ({0})", urlAction), { correlationId: correlationId, responseBody: responseBody });
                                executeKillSwitch();
                            }

                        } catch (e) {
                            // Cross origin frame
                            timeout = setTimeout(executeKillSwitch, 3000);
                        }
                    });

                    $("body").append(frame);

                    return authDeferred.promise();
                };
            })();

            // Try to update the csrf token
            var tryToUpdateCsrf = () => {
                var csrfDeferred = $.Deferred();
                var csrfFrameId = "csrf-frame";

                logger.logInfo(Core.Utilities.stringFormat("starting to update csrf for user ({0})", urlAction), { correlationId: correlationId });

                $("#" + csrfFrameId).remove();
                var frame = $("<iframe>")
                    .css({ width: 0, height: 0, borderWidth: 0, position: "absolute", visibility: "hidden" })
                    .attr("id", csrfFrameId)
                    .attr("src", "/home/csrfrefresh")
                    .load(() => {
                    try {
                        var contents = $("#" + csrfFrameId).contents();
                        var token = contents.find("input[name='__RequestVerificationToken']").val();
                        var version = contents.find("input[name='__AzureDataCatalogVersion']").val();
                        if (token && version && version !== $tokyo.app.version) {
                            // We have updated the csrf 
                            $("input[name='__RequestVerificationToken']").val(token);
                            logger.logInfo(Core.Utilities.stringFormat("successfully udpated csrf for user ({0})", urlAction), { correlationId: correlationId });
                        } else if (!token || !version) {
                            var responseBody = contents.find("body").html();
                            logger.logInfo(Core.Utilities.stringFormat("bad response from csrfrefresh endpoint ({0})", urlAction), { correlationId: correlationId, responseBody: responseBody });
                        } else {
                            logger.logInfo(Core.Utilities.stringFormat("no need to udpate csrf for user ({0})", urlAction), { correlationId: correlationId });
                        }

                        csrfDeferred.resolve();

                    } catch (e) {
                        logger.logWarning(Core.Utilities.stringFormat("failed to automatically update csrf for user ({0})", urlAction), { correlationId: correlationId });
                        if (ModalService.isShowing()) {
                            var response = confirm(Core.Resx.expiredSession);
                            if (response) {
                                window.location.reload();
                            }
                        } else {
                            ModalService.show({ title: Core.Resx.expiredSessionTitle, bodyText: Core.Resx.expiredSession })
                                .done((modal) => {
                                modal.close();
                                window.location.reload();
                            });
                        }
                    }
                });

                $("body").append(frame);

                return csrfDeferred.promise();
            };

            var onFailure = function (jqXhr: JQueryXHR, textStatus: string, thrownError: any) {
                var isClientError = Math.floor(jqXhr.status / 100) === 4;
                var isAuthError = jqXhr.status === Core.Constants.HttpStatusCodes.UNAUTHORIZED || jqXhr.status === Core.Constants.HttpStatusCodes.FORBIDDEN;
                var isTooLargeError = jqXhr.status === Core.Constants.HttpStatusCodes.REQUESTENTITYTOOLARGE;

                if (showModalOnError === void 0) {
                    // Default behavior is not to show modal error for GET requests unless auth error
                    showModalOnError = (settings && (settings.type || "GET").toUpperCase() !== "GET") || isAuthError;
                }

                if (!showModalOnError) {
                    deferred.reject.apply(deferred, arguments);
                    return;
                }
                var tracingId = jqXhr.getResponseHeader("x-ms-request-id");
                var clientTracingId = jqXhr.getResponseHeader("x-ms-client-request-id");

                var bodyText = Core.Resx.saveErrorNotice;
                isAuthError && (bodyText = Core.Resx.expiredSession);

                if (isTooLargeError) {
                    var maxEntitySizeKb = (256000 / 1000);
                    var currentSizeKb = ((settings || <any>{}).data || "").toString().length / 1000;
                    currentSizeKb = Math.max(currentSizeKb, maxEntitySizeKb + 1);
                    bodyText = Core.Utilities.stringFormat(Core.Resx.saveErrorTooLargeNoticeFormat, maxEntitySizeKb.toFixed(0) + "KB", currentSizeKb.toFixed(0) + "KB");
                }

                if (isClientError && jqXhr && jqXhr.responseJSON && jqXhr.responseJSON.error && jqXhr.responseJSON.error.message) {
                    bodyText = jqXhr.responseJSON.error.message;
                }

                if (tracingId || clientTracingId) {
                    bodyText += "<br><div class='small'>";
                }
                if (tracingId) {
                    bodyText += Core.Utilities.stringFormat("<br>Tracing ID: {0}", tracingId);
                }
                if (clientTracingId) {
                    bodyText += Core.Utilities.stringFormat("<br>Tracing Client ID: {0}", clientTracingId);
                }
                if (tracingId || clientTracingId) {
                    bodyText += "</div>";
                }

                var reloadWindowAction = () => {
                    window.location.reload();
                    return $.Deferred().resolve().promise();
                };

                ErrorService.addError({
                    title: isAuthError ? Core.Resx.expiredSessionTitle : Core.Resx.anErrorHasOccurred,
                    bodyText: bodyText,
                    cancelAction: isTooLargeError ? null : cancelAction,
                    okAction: isClientError ? reloadWindowAction : null,
                    retryAction: isClientError ? null : () => { return reTry(); }
                })
                    .done(deferred.resolve)
                    .fail(() => {
                    deferred.reject(jqXhr, textStatus, thrownError);
                });
            };

            var buildRequestUrl = (token) => {
                return Core.Utilities.stringFormat(configurationManager.getADCEndpoint(), jwt.decode(token).tid, this.catalogName, url);
            };

            logger.logInfo(Core.Utilities.stringFormat("pre ajax call ({0})", urlAction), { url: url, settings: settings, correlationId: correlationId });

            authenticationManager.getAccessTokenADC().then((token) => {

                $.ajax(buildRequestUrl(token), $.extend({
                    beforeSend: (xhr, settings) => {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }, settings))
                    .done(() => {
                        logger.logInfo(Core.Utilities.stringFormat("successful ajax call ({0})", urlAction), { correlationId: correlationId });
                    })
                    .done(deferred.resolve)
                    .fail((jqXhr: JQueryXHR, textStatus: string, thrownError: any) => {
                        if (jqXhr.status === Core.Constants.HttpStatusCodes.UNAUTHORIZED || jqXhr.status === Core.Constants.HttpStatusCodes.FORBIDDEN) {
                            var tryToReAuth = onUnauthorized ? onUnauthorized : reAuth;
                            tryToReAuth(correlationId)
                                .done(() => {
                                    tryToUpdateCsrf()
                                        .always(() => {
                                            logger.logInfo(Core.Utilities.stringFormat("attempting ajax call again after auth refresh ({0})", urlAction), { url: url, settings: settings, correlationId: correlationId });
                                            reTry()
                                                .then(deferred.resolve, onFailure);

                                            deferred.done(() => {
                                                logger.logInfo(Core.Utilities.stringFormat("successful ajax call after auth and csrf refresh ({0})", urlAction), { correlationId: correlationId });
                                            });
                                        });
                                });
                        } else if (Math.floor(jqXhr.status / 100) === 5) {
                            reTry()
                                .then(deferred.resolve, onFailure);
                        } else {
                            onFailure(jqXhr, textStatus, thrownError);
                        }
                    })
                    .always((jqXhr: JQueryXHR, textStatus: string, jqXhr2: JQueryXHR) => {
                        jqXhr = jqXhr || <JQueryXHR>{};
                        jqXhr2 = jqXhr2 || <JQueryXHR>{};
                        var status = jqXhr.status || jqXhr2.status;
                        var statusText = jqXhr.statusText || jqXhr2.statusText;
                        logger.logInfo(Core.Utilities.stringFormat("ajax call complete ({0}) {1} - {2}", urlAction, status, statusText), { correlationId: correlationId, textStatus: textStatus });
                    });
            });

            deferred.fail((jqueryXhr: JQueryXHR) => {
                var isError = jqueryXhr && Math.floor(jqueryXhr.status / 100) === 5;
                this.logAjaxError(jqueryXhr, { url: url, settings: settings, correlationId: correlationId }, !isError);
            });

            return deferred.promise();
        }

        static allSettled<T>(promises: JQueryPromise<T>[]): JQueryPromise<Microsoft.DataStudio.DataCatalog.Interfaces.IAllSettledResult[]> {
            promises = promises || [];
            var internalPromises = [];
            var outerDeferred = $.Deferred<Microsoft.DataStudio.DataCatalog.Interfaces.IAllSettledResult[]>();
            var results = new Array<Microsoft.DataStudio.DataCatalog.Interfaces.IAllSettledResult>(promises.length);

            $.each(promises, (i, promise) => {
                var innerDeferred = $.Deferred();
                promise
                    .done((v) => {
                    results[i] = {
                        state: "fulfilled",
                        value: v
                    }
                })
                    .fail((r) => {
                    results[i] = {
                        state: "failed",
                        reason: r
                    }
                })
                    .always(() => {
                    outerDeferred.notify(results[i]);
                    innerDeferred.resolve();
                });

                var innerPromise = innerDeferred.promise();
                internalPromises.push(innerPromise);
            });

            $.when.apply($, internalPromises)
                .done(() => { outerDeferred.resolve(results); });

            return outerDeferred.promise();
        }
    }
}
