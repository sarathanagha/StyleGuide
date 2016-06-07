/// <reference path="../../references.d.ts" />
/**
POC: Stephen Pryor (stpryor)

Description:
A knockout binding to creat eselect menu drop downs

Input (Interfaces.SelectMenuParams):
    options: An array of options for the menu
    select: An observable containing the select option

Example Usage:
    (viewModel)
    var exampleOptions: dsuxInterfaces.SelectMenuOption[] = [
        { label: 'Label 1', value: 1 },
        { label: 'Label 2', value: 2 },
    ];

    var exampleMenuParams = {
            options: exampleOptions,
            selected: ko.observable(options[0])
        };

    (html)
    <a href="#" data-bind="datastudio-ux-selectmenu: exampleMenuParams">
        <span class="text" data-bind="text: exampleMenuParams.selected().label"></span>
        <span class="icon icon-right chevronDown"></span>
    </a>
*/

module Microsoft.DataStudioUX.Knockout.Bindings
{
    "use strict";

    export class SelectMenuBinding implements KnockoutBindingHandler
    {
        public static menuId: string = "datastudio-ux-selectmenu";
        public static menuLabelClass: string = "datastudio-ux-selectmenu-label";
        public static menuCounter: number = 0;

        private static removeEventFunc(e) {
            var container = $('#' + SelectMenuBinding.menuId);
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                SelectMenuBinding.removeSelectMenu(container);
            }
        }

        public init(element: HTMLElement, valueAccessor: () => Interfaces.SelectMenuParams, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext): void
        {
            var $element: JQuery = $(element);
            var params: Interfaces.SelectMenuParams = valueAccessor();

            if (SelectMenuBinding.menuCounter++ < 1)
            {
                // Remove the menu if the user clicks outside it
                var idString: string = '#' + SelectMenuBinding.menuId;
                $(document).click((event: Event) => {
                    if (!$(event.target).closest(idString).length && !$(event.target).is(idString)) {
                        SelectMenuBinding.removeSelectMenu();
                    }
                });

                // Remove the menu if the user hits ESC
                $(document).keyup((event: JQueryKeyEventObject) => {
                    if (event.keyCode === Helpers.Keycodes.Escape) SelectMenuBinding.removeSelectMenu();
                });

                // Remove the menu on page resize since the position will be incorrect
                $(window).resize(() => SelectMenuBinding.removeSelectMenu());

                // Remove the menu if the user scrolls the page
                // TODO (stpryor): Local scroll events are not handled here (e.g. scroll the div with the open menu link), handle these cases
                $(document).scroll((event: any) => SelectMenuBinding.removeSelectMenu());
            }

            $element.click((event: Event) => {
                event.preventDefault();
                event.stopPropagation();
                // Remove any already open menu
                SelectMenuBinding.removeSelectMenu();

                // Adjust for any offset overrides
                var newSelectMenu: JQuery = $('<div id="' + SelectMenuBinding.menuId + '"></div>');
                var offset: { left: number; top: number } = $element.offset();
                var newLeft = offset.left + (params.leftOffset ? params.leftOffset : 0);
                var newTop = offset.top + $element.outerHeight() + (params.topOffset ? params.topOffset : 0);
                newSelectMenu.css({ left: newLeft, top: newTop });

                var contents = $('<div class="contents"></div>');
                var options: Interfaces.SelectMenuOption[];
                var tempOptions: any = params.options;
                if (ko.isObservable(tempOptions)) {
                    options = tempOptions();
                } else {
                    options = tempOptions;
                }
                options = options || [];
                // Don't show a memu with no options
                if (options.length < 1) return;

                options.forEach((option: Interfaces.SelectMenuOption) => {
                    var menuItem = $('<a href="#">' + option.label + '</a>');
                    menuItem.click((event: Event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        params.selected(option);
                        if (option.action) option.action();
                        SelectMenuBinding.removeSelectMenu();
                        return false;
                    });

                    contents.append(menuItem);
                });
                newSelectMenu.append(contents).appendTo('body');

                // Check if the menu drops off the bottom of the page, if so, move it up
                var currWindow: JQuery = $(window);
                if (currWindow.scrollTop() + currWindow.height() <= (newSelectMenu.offset().top + newSelectMenu.outerHeight()))
                {
                    offset = $element.offset();
                    newTop = offset.top - newSelectMenu.outerHeight() + (params.topOffset ? -1 * params.topOffset : 0);
                    newSelectMenu.css({ top: newTop });
                }
                // Animate the contents after appending so the height is known
                contents.css({ top: -1 * (contents.height() - 1) }).animate({ top: 0 }, 150);
            });
        }

        private static removeSelectMenu(element?: JQuery) {
            var element: JQuery = element ? element : $('#' + SelectMenuBinding.menuId);
            if (element.length > 0) {
                ko.cleanNode(element[0]);
                element.remove();
            }
        }
    }

    ko.bindingHandlers["datastudio-ux-selectmenu"] = new SelectMenuBinding();
}

