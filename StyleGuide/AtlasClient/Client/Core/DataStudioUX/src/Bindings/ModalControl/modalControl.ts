/// <reference path="../../references.d.ts" />
/**
POC: Stephen Pryor (stpryor)

Description:
A knockout binding intended to allow a user to use part if their component template as the contents of a modal while retaining access to their view modal scope.

Input (Type - IModalBindingParams):
    isVisible: A KnockoutObservable returning a boolean. If it returns true, show the modal, if false, hide the modal.
    modalContainerClass (Optional): This class will be applied to the modalContainer allowing customized styles.
    disableFadeClose (Optional): If this boolean is set to true, clicking the fade area will NOT close the modal. Defaults to false.
    useSmallModal (Optional): If true, the modal will appear as the small variant rather than the default
    template (Optional): A string containing the contents of the modal. If this string is not provided, the contents of the bound DOM element will be the contents.

Example Usage:
    (viewModel)
    public isModalVisible: KnockoutObservable<boolean> = ko.obsevable(true);
    public exampleText: KnockoutObservable<string> = ko.obsevable("example text");

    (template)
    <div data-bind="datastudio-ux-modal: { isVisible: isModalVisible }">
        I still have access to the parent view model scope
       <span data-bind="text: exampleText"></span>
    </div>
*/

module Microsoft.DataStudioUX.Knockout.Bindings
{
    "use strict";

    // Modal Control Binding
    export class ModalControlBinding implements KnockoutBindingHandler
    {
        public static modalIdAttr: string = "data-modalid";

        // When the modal is first bound, hide the bound element and stop compiling Knockout for its child elements
        public init(element: HTMLElement, valueAccessor: () => Interfaces.IModalBindingParams, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext): any
        {

            var $element: JQuery = $(element);
            $element.hide();

            // If the element with the modal bindings is ever destroyed, destroy the modal as well
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                var modalId: string = $element.attr(ModalControlBinding.modalIdAttr);
                Helpers.ModalHelper.removeModal($("#" + modalId))
            });

            // Stop knockout from compiling the internal html
            return { controlsDescendantBindings: true };
        }

        public update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext): void
        {

            var $element: JQuery = $(element);
            var params: Interfaces.IModalBindingParams = valueAccessor();
            var modalId: string = $element.attr(ModalControlBinding.modalIdAttr);
            var isVisible: KnockoutObservable<boolean> = params.isVisible;

            if (isVisible())
            {
                var modalContainerClass: string = params.modalContainerClass;
                var disableFadeClose: boolean = params.disableFadeClose;

                // Create a new modal
                (new Helpers.ModalHelper())
                    .addContent(params.template || $element.html())
                    .chooseSize(params.useSmallModal ? Helpers.ModalSizes.small : null)
                    .edit((modal: Helpers.ModalHelper) => {
                        $element.attr(ModalControlBinding.modalIdAttr, modal.modalId);
                        if (modalContainerClass) modal.modalContainer.addClass(modalContainerClass);
                        if (!disableFadeClose) {
                            modal.fadeBoxClickAction(() => isVisible(false));
                        }
                        ko.applyBindings(viewModel, modal.modalContent[0]);
                    })
                    .construct()
                    //.edit((modal: Helpers.ModalHelper) => {
                    //    // Special case handling for the close button
                    //    modal.addCloseIcon(() => isVisible(false));
                    //    modal.modalCloseIcon.prependTo(modal.modalContent);
                    //})
                    .show();

                Managers.ModalManager.openModalCloseFunctions.push(() => isVisible(false));
            }
            else
            {
                // Destroy the associated modal if it exists
                Helpers.ModalHelper.removeModal($("#" + modalId));
            }
        }
    }

    ko.bindingHandlers["datastudio-ux-modal"] = new ModalControlBinding();
}

