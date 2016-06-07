
/// <reference path="../../references.d.ts" />
/// <amd-dependency path="css!./singleContextualMenuControl.css" />

require(["css!datastudio.controls/Bindings/SingleContextualMenu/singleContextualMenuControl.css"]);

module Microsoft.DataStudioUX.Knockout.Bindings
{
    "use strict";

    export interface ContextualMenuOption
    {
        name: string;
        action: () => any;
        isDisabled?: any;
        isSelected?: any;
    };

    export interface ContextualMenuParams
    {
        options: ContextualMenuOption[];
        leftOffset?: number;
        topOffset?: number;
    };

    export class ContextualMenuControlBinding implements KnockoutBindingHandler
    {
        public static menuId: string = "datastudio-ux-contextual-menu";
        public static menuCounter: number = 0;

        private static removeEventFunc(e) {
            var container = $('#' + ContextualMenuControlBinding.menuId);
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                ContextualMenuControlBinding.removeMenu(container);
            }
        }

        public init(element: HTMLElement, valueAccessor: () => ContextualMenuParams, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext): void
        {
            var $element: JQuery = $(element);
            var params: ContextualMenuParams = valueAccessor();

            if (ContextualMenuControlBinding.menuCounter++ < 1)
            {
                // Remove the menu if the user clicks outside it, hits ESC, or scrolls the page
                // Click case
                var idString: string = '#' + ContextualMenuControlBinding.menuId;
                $(document).click((event: Event) => {
                    if (!$(event.target).closest(idString).length && !$(event.target).is(idString)) {
                        ContextualMenuControlBinding.removeMenu();
                    }
                });

                // ESC case
                $(document).keyup((event: JQueryKeyEventObject) => {
                    if (event.keyCode === Helpers.Keycodes.Escape) ContextualMenuControlBinding.removeMenu();
                });

                // Document scroll case
                // TODO (stpryor): Local scroll events are not handled here (e.g. scroll the div with the open menu link), handler these cases
                $(document).scroll((event: any) => ContextualMenuControlBinding.removeMenu());

                // Remove the menu on page resize since the position will be incorrect
                $(window).resize(() => ContextualMenuControlBinding.removeMenu());
            }

            $element.click((event: Event) => {
                event.stopPropagation();
                // Remove any already open menu
                ContextualMenuControlBinding.removeMenu();
                var newMenu: JQuery = $('<div id="' + ContextualMenuControlBinding.menuId + '"></div>');
                var offset: { left: number; top: number } = $element.offset();
                var newLeft = offset.left + (params.leftOffset ? params.leftOffset : 0);
                var newTop = offset.top + $element.outerHeight() + (params.topOffset ? params.topOffset : 0);
                newMenu.css({ left: newLeft, top: newTop });

                var contents = $("<div class=\"contents\"></div>");
                params.options.forEach((option: ContextualMenuOption) => {
                    var menuItem = $('<a href="#" data-bind="css: {selected: isSelected, disabled: isDisabled}">' + option.name + '</a>');
                    var optionViewModal = {
                        isDisabled: ko.isObservable(option.isDisabled) ? option.isDisabled : !!option.isDisabled,
                        isSelected: ko.isObservable(option.isSelected) ? option.isSelected : !!option.isSelected,
                    }; 
                    ko.applyBindings(optionViewModal, menuItem[0]);
                    menuItem.click((event: Event) => {
                        event.stopPropagation();
                        if (!(ko.isObservable(option.isDisabled) ? option.isDisabled() : !!option.isDisabled))
                        {
                            option.action();
                            ContextualMenuControlBinding.removeMenu();
                        }
                        return false;
                    });
                    contents.append(menuItem);
                });
                newMenu.append(contents).appendTo('body');
                // Check if the menu drops off the bottom of the page, if so, move it up
                var currWindow: JQuery = $(window);
                if (currWindow.scrollTop() + currWindow.height() <= (newMenu.offset().top + newMenu.outerHeight()))
                {
                    offset = $element.offset();
                    newTop = offset.top - newMenu.outerHeight() + (params.topOffset ? -1 * params.topOffset : 0);
                    newMenu.css({ top: newTop });
                }
                // Animate the contents after appending so the height is known
                contents.css({ top: -1 * (contents.height() - 1) }).animate({ top: 0 }, 150);
            });
        }

        private static removeMenu(element?: JQuery) {
            var element: JQuery = element ? element : $('#' + ContextualMenuControlBinding.menuId);
            if (element.length > 0) {
                ko.cleanNode(element[0]);
                element.remove();
            }
        }
    }

    ko.bindingHandlers["datastudio-ux-contextual-menu"] = new ContextualMenuControlBinding();
}

