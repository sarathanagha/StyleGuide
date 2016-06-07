/**
POC: Stephen pryor (stpryor)

Description:
The ModalHelper is, as the name suggests, intended to help create modals.
This class provides a single source to store the html and css definitions for what constitues a modal.
This class also provides an abstract, function chaining approach to constructing modals.

Example Usage:
    var modalBtns: Interfaces.IModalButton[] = [
            {
                label: "Ok",
                isPrimary: true,
                action: (actions: Interfaces.IModalActions) => actions.remove()
            }
        ];
    var modal: ModalHelper = new ModalHelper();
    modal.addHeader("Header")
        .addMessage("This is a modal message")
        .addButtons(modalBtns)
        .show();
*/
module Microsoft.DataStudioUX.Helpers
{
    export enum ModalSizes {
        small
    }

    export class ModalHelper {

        /* Static variables*/
        private static uniqueModalCounter: number = 0;
        private static modalStandardId: string = "datastudio-ux-modal";

        public static modalContainerClass: string = "modal-container";
        public static modalContentClass: string = "modal-content";
        public static modalCloseIconClass: string = "close-wizard-btn";

        public static modalHeaderClass: string = "modal-header";
        public static modalMessageClass: string = "modal-message";
        public static modalActionBtnsClass: string = "modal-action-btns";

        public static modalDefaultContentClass: string = "default-content";
        public static modalSmallContentClass: string = "small-content";

        /* Public variables*/
        public modalId: string;

        public modalContainer: JQuery;
        public modalContent: JQuery;

        public modalCloseIcon: JQuery;
        public modalHeader: JQuery;
        public modalMessage: JQuery;
        public modalActionButtons: JQuery;

        // The contructor initializes the modal elements
        public constructor() {
            // Generate a unique modal ID
            this.modalId = ModalHelper.modalStandardId + ModalHelper.uniqueModalCounter++;
            this.modalContainer = $('<div class="' + ModalHelper.modalContainerClass + '" id="' + this.modalId + '"></div>');
            this.modalContent = $('<div class="' + ModalHelper.modalContentClass + '"></div>');
        }

        // Allow a choice between the default and the small modal
        public chooseSize(size: ModalSizes): ModalHelper {
            switch (size) {
                case ModalSizes.small:
                    this.modalContent.addClass(ModalHelper.modalSmallContentClass);
                    break;
            }
            return this;
        }

        // Assigns an action to a click event on the modal fade box
        public fadeBoxClickAction(callback: (actions: Interfaces.IModalActions) => any): ModalHelper  {
            this.modalContainer.click((eventObject: JQueryEventObject) => {
                var target: JQuery = $(eventObject.target);
                if (target.attr('id') === this.modalId && callback) {
                    callback(this.getActions());
                }
            });
            return this;
        }

        // Creates and updates the header contents
        public addHeader(header: string): ModalHelper {
            if (this.modalHeader) {
                this.modalHeader.html(header);
            } else {
                this.modalHeader = $('<div class="' + ModalHelper.modalHeaderClass + '">' + header + '</div>');
            }
            return this;
        }

        // Creates and updates the message contents
        public addMessage(message: string): ModalHelper {
            if (this.modalMessage) {
                this.modalMessage.html(message);
            } else {
                this.modalMessage = $('<div class="' + ModalHelper.modalMessageClass + '">' + message + '</div>');
            }
            return this;
        }

        // Creates the modal buttons
        public addButtons(buttons: Interfaces.IModalButton[]) {
            if (buttons.length > 0) {
                this.modalActionButtons = $('<div class="' + ModalHelper.modalActionBtnsClass + '"></div>');
                buttons.forEach((btnParams: Interfaces.IModalButton) => {
                    var btnHTML: JQuery = $('<button class="btn' + (btnParams.isPrimary ? ' btn-primary' : '') + '">' + btnParams.label + '</button>');
                    btnHTML.click((eventObject: JQueryEventObject) => btnParams.action(this.getActions(), eventObject));
                    btnHTML.appendTo(this.modalActionButtons);
                });
            }
        }

        // Updates the modal content, overriding any existing contents
        public addContent(content: string): ModalHelper {
            this.modalContent.html(content);
            return this;
        }

        // Constructs the modal and appends it to the page body tag
        public show(): ModalHelper {
            this.modalContainer.hide().appendTo('body').fadeIn(200);
            return this;
        }

        // Provides a raw edit mode for adding custom functionality while still supporting chaining
        public edit(editFunc: (ModalHelper) => any): ModalHelper {
            editFunc(this);
            return this;
        }

        // Adds a cross close icon to the modal content
        public addCloseIcon(closeCallback: (actions: Interfaces.IModalActions) => any): ModalHelper {
            this.modalCloseIcon = $('<a class="' + ModalHelper.modalCloseIconClass + '"></a>');
            this.modalCloseIcon.click(() => {
                closeCallback(this.getActions());
            });
            return this;
        }

        // Remove the modal assocaited with the current class instance
        public remove(): void {
            ModalHelper.removeModal($('#' + this.modalId));
        }

        // Generic method to remove modals
        public static removeModal(element: JQuery): void {
            if (element.length > 0) {
                ko.cleanNode(element[0]);
                element.remove();
            }
        }

        // Returns the list of available actions for the current model class instance
        public getActions(): Interfaces.IModalActions {
            return {
                remove: () => this.remove(),
                getId: () => this.modalId
            };
        }

        // Appends all the partial DOM elements into a completed modal.
        // Note: If addContent is called, any headers, messages, or buttons will be skipped
        public construct(): ModalHelper {
            if (!this.modalContent.html()) {
                if (this.modalCloseIcon) this.modalCloseIcon.appendTo(this.modalContent);
                if (this.modalHeader) this.modalHeader.appendTo(this.modalContent);
                if (this.modalMessage) this.modalMessage.appendTo(this.modalContent);
                if (this.modalActionButtons) this.modalActionButtons.appendTo(this.modalContent);
            }
            this.modalContainer.append(this.modalContent);
            return this;
        }
    }
}