/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.DataCatalog.Services {

    export class ModalService {
        static component = ko.observable<string>();
        static bodyText = ko.observable<string>();
        static title = ko.observable<string>();
        static isWorking = ko.observable<boolean>(false);
        static cancelButtonText = ko.observable<string>(Core.Resx.cancel);
        static hideCancelButton = ko.observable<boolean>(false);
        static activeModalActions: DataStudioUX.Interfaces.IModalActions = null;

        static confirmButtons = ko.observableArray<Interfaces.IModalButton>([]);

        private static _isShowing = false;
        private static _deferred;

        static show(parameters?: Interfaces.IModalParameters): JQueryPromise<Interfaces.IModalResolver> {
            if (this._isShowing) {
                logger.logWarning("must resolve modal prior to opening another", parameters);
                return $.Deferred().reject().promise();
            }
            this._isShowing = true;
            this.isWorking(false);
            this.cancelButtonText(Core.Resx.cancel);
            this.confirmButtons.removeAll();

            if (parameters) {
                this.component(parameters.component);
                this.bodyText(parameters.bodyText);

                logger.logInfo("showing modal", parameters);

                if (parameters.buttons) {
                    this.confirmButtons(parameters.buttons);
                } else {
                    this.confirmButtons.push({
                        id: "ok",
                        text: parameters.confirmButtonText || Core.Resx.ok,
                        isDefault: false
                    });
                }

                this.title(parameters.title);
                this.cancelButtonText(parameters.cancelButtonText || Core.Resx.cancel)
                this.hideCancelButton(!!parameters.hideCancelButton);
            }

            if (this._deferred) {
                this._deferred.reject();
            }

            this._deferred = $.Deferred();
            // Add the confirm buttons
            var modalButtons: DataStudioUX.Interfaces.IModalButton[] = this.confirmButtons().map((button: Interfaces.IModalButton) => {
                return {
                    label: button.text,
                    isPrimary: true,
                    action: (actions: DataStudioUX.Interfaces.IModalActions) => {
                        ModalService.onConfirm(button, actions);
                    }
                };
            });
            // If required, add the hide button
            if (!this.hideCancelButton()) {
                modalButtons.push({
                    label: this.cancelButtonText(),
                    action: (actions: DataStudioUX.Interfaces.IModalActions) => {
                        this.resetModalService();
                        actions.remove();
                    }
                });
            }
            // Create the modal parameters
            var modalViewModel: any = function () {
                this.modalService = ModalService;
            };
            var modalParams: DataStudioUX.Interfaces.IModalManagerParams = {
                header: ModalService.title(),
                message:
                    '<!-- ko if: modalService.component -->' +
                    '<div data-bind="component: { name: modalService.component, params: {} }"></div>' +
                    '<!-- /ko -->' +
                    '<!-- ko if: modalService.bodyText -->' +
                    '<div data-bind="html: modalService.bodyText"></div>' +
                    '<!-- /ko -->',
                buttons: modalButtons, 
                viewModel: new modalViewModel,
                closeCallback: () => ModalService.resetModalService()
            };
            if (parameters.modalContainerClass) {
                modalParams.modalContainerClass = parameters.modalContainerClass;
            }
            // Show the modal
            this.activeModalActions = DataStudioUX.Managers.ModalManager.show(modalParams);
            return this._deferred.promise();
        }

        static onConfirm(button: Interfaces.IModalButton, modalActions: DataStudioUX.Interfaces.IModalActions) {
            var closeDeferred = $.Deferred();
            this.isWorking(true);
            this._deferred.resolve({
                close: () => { closeDeferred.resolve(); },
                button: () => { return button.id; },
                reset: () => {
                    logger.logInfo("resetting modal");
                    this.isWorking(false);
                    this._deferred = $.Deferred();
                    return this._deferred.promise();
                }
            });
            closeDeferred
                .done(() => {
                    logger.logInfo("closing modal");
                    this.resetModalService();
                    modalActions.remove();
            })
            .always(() => {
                this.isWorking(false);
            });
        }

        static resetModalService() {
            this._isShowing = false;
            if (this._deferred && this._deferred.state() === "pending") {
                this._deferred.reject();
            }
        }

        static isShowing() {
            return this._isShowing;
        }

        static forceClose() {
            logger.logInfo("force close modal");
            this.resetModalService();
            if (this.activeModalActions && this.activeModalActions.remove) {
                this.activeModalActions.remove();
            }
        }
    }
}
