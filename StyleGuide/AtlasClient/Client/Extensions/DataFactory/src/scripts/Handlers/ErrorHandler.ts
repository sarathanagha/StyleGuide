import WinJSHandlers = require("./WinJSHandlers");
import AppContext = require("../AppContext");
import Log = require("../Framework/Util/Log");

"use strict";
let logger = Log.getLogger({
    loggerName: "ErrorHandler"
});

export class ErrorHandler {
    public makeResourceFailedHandler = (resource: string, url?: string, deferred?: Q.Deferred<Object>) => {
        return (error: JQueryXHRExtended) => {
            let title: string = null, html: string = null, handler: (result: WinJSHandlers.DismissalResult) => void = null;

            // either we get the url from the arguments, the XHR object, or we log that we didn't have one
            url = url || error.requestUrl || "No url specified in handler!";
            let isUserError: boolean = false;

            // try to display a specific error from the backend.
            if (error.responseJSON) {
                let code: string = error.responseJSON.code || error.responseJSON.error.code;

                if (code) {
                    switch (code) {
                        case "InvalidSubscriptionId":
                        case "SubscriptionNotFound":
                            title = ClientResources.subscriptionNotFound;
                            html = ClientResources.subscriptionNotFoundErrorMessageText.format(this._appContext.splitFactoryId().subscriptionId);
                            handler = (result) => {
                                // if they gave us a bad subscription, for now we can only reload
                                window.location.reload();
                            };
                            break;

                        case "AuthenticationFailed":
                            if (this._permissionDenied) {
                                return;
                            } else {
                                this._permissionDenied = true;
                                title = ClientResources.permissionDenied;
                                html = ClientResources.resourcePermissionFaliedMessageText.format(this._appContext.splitFactoryId().dataFactoryName);
                                break;
                            }

                        case "ResourceNotFound":
                            title = ClientResources.resourceNotFound;
                            html = ClientResources.resourceNotFoundMessageText.format(resource, this._appContext.splitFactoryId().dataFactoryName);
                            break;

                        case "TableSliceOutOfRange":
                            title = ClientResources.tableSliceOutOfRange;
                            html = error.responseJSON.message || error.responseJSON.error.message;
                            break;

                        default:
                            title = ClientResources.errorOccurredTitle;
                            html = error.responseJSON.message || error.responseJSON.error.message ||
                                ClientResources.resourceUnknownErrorMessageText.format(resource, this._appContext.splitFactoryId().dataFactoryName);

                            logger.logError("Unhandled backend error code: " + code);
                    }
                    if (isUserError) {
                        logger.logInfo("User error (code: {0}, url: {1}): {2}".format(error.status, url, error.response));
                    } else {
                        logger.logError("ADF backend error (code: {0}, url: {1}): {2}".format(error.status, url, error.response));
                    }
                }
            }

            // We need to handle the error generically
            if (!title) {
                switch (error.status) {
                    case 401:
                    case 403:
                        if (this._permissionDenied) {
                            return;
                        } else {
                            this._permissionDenied = true;
                            title = ClientResources.permissionDenied;
                            html = ClientResources.resourcePermissionFaliedMessageText.format(this._appContext.splitFactoryId().dataFactoryName);
                            break;
                        }

                    case 404:
                        title = ClientResources.resourceNotFound;
                        html = ClientResources.resourceNotFoundMessageText.format(resource, this._appContext.splitFactoryId().dataFactoryName);
                        break;

                    default:
                        title = ClientResources.unknownError;
                        html = ClientResources.resourceUnknownErrorMessageText.format(resource, this._appContext.splitFactoryId().dataFactoryName);
                        break;
                }
            }

            if (!handler) {
                handler = (result) => {
                    // TODO iannight: figure out something to do
                };
            }
            if (isUserError) {
                logger.logInfo("Resource error shown to user: {title: \"{0}\", message: \"{1}\", url: {2}}".format(title, html, url));
            } else {
                logger.logError("Resource error shown to user: {title: \"{0}\", message: \"{1}\", url: {2}}".format(title, html, url));
            }

            // fix newlines
            html = html.replace(/\n/g, "<br/>");

            this._appContext.dialogHandler.addRequest({
                title: title,
                innerHTML: html,
                dismissalHandler: handler,
                primaryCommandText: ClientResources.ok
            }, true);

            // reject the deferred if it exists
            if (deferred) {
                deferred.reject(error);
            }
        };
    };

    private _appContext: AppContext.AppContext;
    private _permissionDenied: boolean = false;

    constructor(appContext: AppContext.AppContext) {
        this._appContext = appContext;
    }
}
