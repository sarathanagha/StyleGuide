//import logger = require("../services/loggingService");
//import util = require("../core/utilities");
//import modalService = require("../services/modalService");

"use strict";
module Microsoft.DataStudio.DataCatalog.Services {

    interface IErrorQueueEntry {
        deferred: JQueryDeferred<any>;
        errorNotice: Interfaces.IErrorNotice;
    }

    export class ErrorService {
        private static _errorQueue: IErrorQueueEntry[] = [];
        private static _isShowingError = false;

        static addError(error: Interfaces.IErrorNotice): JQueryPromise<any> {
            var deferred = $.Deferred();

            this._errorQueue.push({
                deferred: deferred,
                errorNotice: error
            });

            this._checkQueue();

            return deferred.promise();
        }

        private static _checkQueue() {
            var nextError = this._errorQueue.shift();
            if (nextError) {
                if (ModalService.isShowing()) {
                    // If the modal is showing, but it isn't an error, force it closed to show the error
                    if (!this._isShowingError) {
                        ModalService.forceClose();
                    }

                    var interval = setInterval(() => {
                        if (!ModalService.isShowing()) {
                            clearInterval(interval);
                            this._proccessError(nextError);
                        }
                    }, 250);
                } else {
                    this._proccessError(nextError);
                }
            }
        }

        private static _proccessError(errorEntry: IErrorQueueEntry) {
            var error = errorEntry.errorNotice;
            var deferred = errorEntry.deferred;

            this._isShowingError = true;

            var buttons = [];
            if (error.retryAction) {
                buttons.push({
                    id: "retry",
                    text: Core.Resx.retry,
                    isDefault: false
                });
            }

            if (error.okAction) {
                buttons.push({
                    id: "ok",
                    text: Core.Resx.ok,
                    isDefault: false
                });
            }

            buttons.push({
                id: "cancel",
                text: Core.Resx.cancel,
                isDefault: true
            });

            ModalService.show({
                bodyText: error.bodyText,
                title: error.title || Core.Resx.anErrorHasOccurred,
                hideCancelButton: true,
                buttons: buttons
            })
                .done(modal => {
                if (modal.button() === "retry") {
                    error.retryAction()
                        .done(function () {
                        modal.close();
                        deferred.resolve.apply(deferred, arguments);
                    })
                        .fail(() => {
                        this._errorQueue.push(errorEntry);
                    })
                        .always(() => {
                        modal.close();
                        this._isShowingError = false;
                        this._checkQueue();
                    });
                }
                if (modal.button() === "ok") {
                    var okAction = error.okAction || (() => $.Deferred().resolve().promise());
                    okAction()
                        .always(() => {
                        deferred.reject();
                        modal.close();
                        this._isShowingError = false;
                    });
                }
                if (modal.button() === "cancel") {
                    var cancelAction = error.cancelAction || (() => $.Deferred().resolve().promise());
                    cancelAction()
                        .always(() => {
                        deferred.reject();
                        modal.close();
                        this._isShowingError = false;
                    });
                }
            })
                .fail(() => {
                deferred.reject();
                this._isShowingError = false;
            });
        }
    }
}