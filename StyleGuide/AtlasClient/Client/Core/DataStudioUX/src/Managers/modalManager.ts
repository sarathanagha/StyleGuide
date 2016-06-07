/**
POC: Stephen Pryor (stpryor)

Description:
The Modal Manager allows the user to create modal dialogs using only javascript.

Input (Type - IModalManagerParams):
(Note: All parameters in the modal parameters are optional for customizability)
    content: Overrides the internal contents of the modal for custom configurations 
    header: The modal header string
    message: The modal message string
    buttons: An array of buttons to be added to the modal
    modalContainerClass: This class will be applied to the modalContainer allowing customized styles.
    disableFadeClose: If this boolean is set to true, clicking the fade area will NOT close the modal. Defaults to false.
    viewModel: A view model to be bound to the contents of the modal
    closeModalText: A shortcut for adding a single button that closes the modal. 
                    If a string is provided, a button with the given text will appear after any already added buttons.
    closeCallback: A callback function to be called whenever the modal is closed with a close icon or the fade box is clicked
    useSmallModal: If true, the modal will appear as the small variant rather than the default

Example usage:
    // Define the modal buttons
    var modalBtns: Interfaces.IModalButton[] = [
            {
                label: "Ok",
                isPrimary: true,
                action: (actions: Interfaces.IModalActions) => actions.remove()
            }
        ];
    // Create the modal parameters
    var modalParams: Interfaces.IModalManagerParams = {
            header: "Header text",
            message: "Message text",
            buttons: modalBtns
        };
    // Create and display the modal
    Microsoft.DataStudioUX.Managers.ModalManager.show(modalParams);
*/
module Microsoft.DataStudioUX.Managers {

    // Modal Control Manager
    export class ModalManager {

        public static openModalCloseFunctions: any = [];

        // Method: show
        // Given a set of modal input parameters, the show method creates and displays a modal on the screen
        // Returns: An object of type IModalActions for the newly associated modal
        public static show(params: Interfaces.IModalManagerParams): Interfaces.IModalActions {
            var modalContainerClass: string = params.modalContainerClass;
            var disableFadeClose: boolean = params.disableFadeClose;

            // Create a new modal
            var newModal: Helpers.ModalHelper = new Helpers.ModalHelper();
            // Add the contents
            if (params.useSmallModal) newModal.chooseSize(Helpers.ModalSizes.small);
            if (params.content) {
                newModal.addContent(params.content);
            } else {
                if (params.header) newModal.addHeader(params.header);
                if (params.message) newModal.addMessage(params.message);

                var buttons: Interfaces.IModalButton[] = params.buttons ? params.buttons.slice(0) : [];
                if (params.closeModalText) {
                    buttons.push({
                        label: params.closeModalText,
                        isPrimary: true,
                        action: (actions: Interfaces.IModalActions) => {
                            if (params.closeCallback) params.closeCallback();
                            actions.remove();
                        }
                    });
                }
                newModal.addButtons(buttons);
            }
            // Add any override classes and enable default close functionality and show the modal
            newModal
                .addCloseIcon((actions: Interfaces.IModalActions) => {
                    if (params.closeCallback) params.closeCallback();
                    actions.remove();
                })
                .edit((modal: Helpers.ModalHelper) => {
                    if (modalContainerClass) modal.modalContainer.addClass(modalContainerClass);
                    if (!disableFadeClose) {
                        modal.fadeBoxClickAction((actions: Interfaces.IModalActions) => {
                            if (params.closeCallback) params.closeCallback();
                            actions.remove();
                        });
                    }
                })
                .construct()
                .edit((modal: Helpers.ModalHelper) => {
                    if (params.viewModel) {
                        ko.applyBindings(params.viewModel, modal.modalContent[0]);
                    }
                })
                .show();

            ModalManager.openModalCloseFunctions.push(() => {
                if (params.closeCallback) params.closeCallback();
                newModal.remove();
            });
;
            return newModal.getActions();
        }

        // The initialize functions enables pressing ESC to close any modals
        public static initialize() {
            $(document).keyup((event: JQueryKeyEventObject) => {
                if (event.keyCode === Helpers.Keycodes.Escape) {
                    ModalManager.openModalCloseFunctions.forEach(closeFunc => closeFunc());
                    ModalManager.openModalCloseFunctions = [];
                }
            });
        }
    }
}

Microsoft.DataStudioUX.Managers.ModalManager.initialize();