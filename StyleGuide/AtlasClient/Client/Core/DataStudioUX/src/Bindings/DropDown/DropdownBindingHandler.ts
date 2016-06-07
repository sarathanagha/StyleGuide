/// <reference path="../../references.d.ts" />
/// <reference path="../../Common/EventListner.ts" />
module Microsoft.DataStudio.Application.Knockout.Bindings
{
    export class DropdownBindingHandler implements KnockoutBindingHandler
    {
        static BindingName: string = "dropdown";

        update(element: HTMLElement, valueAccessor: () => any): void
        {
            var dropdownElementOld = DropdownBindingHandler.accessorDropdownElement(element);
            var dropdownElementNew = document.getElementById(ko.unwrap(valueAccessor()));

            if (dropdownElementOld != dropdownElementNew)
            {
                DropdownBindingHandler.accessorDropdownElement(element, dropdownElementNew);

                if (dropdownElementOld)
                {
                    DropdownBindingHandler.unregisterEventHandlers(element, dropdownElementOld);
                }

                if (dropdownElementNew)
                {
                    DropdownBindingHandler.registerEventHandlers(element, dropdownElementNew);
                }
            }
        }

        private static accessorDropdownElement(targetElement: HTMLElement, value?: HTMLElement): HTMLElement
        {
            if (value !== undefined)
            {
                ko.utils.domData.set(targetElement, "dropdown_dropdownElement", value);
                return value;
            } else
            {
                return ko.utils.domData.get(targetElement, "dropdown_dropdownElement");
            }
        }

        private static accessorEventHandlers(targetElement: HTMLElement): DataStudioControlsEventListenerBag
        {
            var handlers: DataStudioControlsEventListenerBag = ko.utils.domData.get(targetElement, "dropdown_eventHandlers");

            if (handlers === undefined)
            {
                handlers = new DataStudioControlsEventListenerBag();
                ko.utils.domData.set(targetElement, "dropdown_eventHandlers", handlers);
            }

            return handlers;
        }

        private static accessorCloseHandlers(targetElement: HTMLElement): DataStudioControlsEventListenerBag
        {
            var handlers: DataStudioControlsEventListenerBag = ko.utils.domData.get(targetElement, "dropdown_closeHandlers");

            if (handlers === undefined)
            {
                handlers = new DataStudioControlsEventListenerBag();
                ko.utils.domData.set(targetElement, "dropdown_closeHandlers", handlers);
            }

            return handlers;
        }

        private static accessorOpened(targetElement: HTMLElement, value?: boolean): boolean
        {
            if (value !== undefined)
            {
                ko.utils.domData.set(targetElement, "dropdown_opened", value);
                return value;
            } else
            {
                return ko.utils.domData.get(targetElement, "dropdown_opened");
            }
        }

        private static registerEventHandlers(targetElement: HTMLElement, dropdownElement: HTMLElement): void
        {
            var eventHandlers = DropdownBindingHandler.accessorEventHandlers(targetElement);

            eventHandlers.addEventListener(targetElement, "click", (event: Event) =>
            {
                DropdownBindingHandler.targetClick(targetElement, dropdownElement, event);
            });

            eventHandlers.addEventListener(dropdownElement, "click", (event: Event) =>
            {
                event.stopPropagation();
            });
        }

        private static unregisterEventHandlers(targetElement: HTMLElement, dropdownElement: HTMLElement): void
        {
            var eventHandlers = DropdownBindingHandler.accessorEventHandlers(targetElement);
            eventHandlers.removeEventListeners();
            DropdownBindingHandler.closeDropdown(targetElement, dropdownElement);
        }

        private static registerCloseHandlers(targetElement: HTMLElement, dropdownElement: HTMLElement): void
        {
            var closeHandlers = DropdownBindingHandler.accessorCloseHandlers(targetElement);

            closeHandlers.addEventListener(document, "click", () =>
            {
                DropdownBindingHandler.closeDropdown(targetElement, dropdownElement);
            });

            var closeElements = dropdownElement.querySelectorAll(".click-close");
            for (var i = 0; i < closeElements.length; i++)
            {
                closeHandlers.addEventListener(closeElements[i], "click", () =>
                {
                    DropdownBindingHandler.closeDropdown(targetElement, dropdownElement);
                })
            }
        }

        private static unregisterCloseHandlers(targetElement: HTMLElement): void
        {
            var closeHandlers = DropdownBindingHandler.accessorCloseHandlers(targetElement);
            closeHandlers.removeEventListeners();
        }

        private static targetClick(targetElement: HTMLElement, dropdownElement: HTMLElement, event: Event): void
        {
            event.preventDefault();
            event.stopPropagation();

            if (DropdownBindingHandler.accessorOpened(targetElement))
            {
                DropdownBindingHandler.closeDropdown(targetElement, dropdownElement);
            } else
            {
                DropdownBindingHandler.openDropdown(targetElement, dropdownElement);
            }
        }

        private static openDropdown(targetElement: HTMLElement, dropdownElement: HTMLElement): void
        {
            if (DropdownBindingHandler.accessorOpened(targetElement))
                return;

            // Calculate drop-down position
            var targetRect = targetElement.getBoundingClientRect();

            dropdownElement.style.left = targetRect.left + "px";
            dropdownElement.style.top = targetRect.bottom + "px";

            // Open drop-down
            dropdownElement.style.display = "block";

            DropdownBindingHandler.registerCloseHandlers(targetElement, dropdownElement);
            DropdownBindingHandler.accessorOpened(targetElement, true);
        }

        private static closeDropdown(targetElement: HTMLElement, dropdownElement: HTMLElement): void
        {
            if (!DropdownBindingHandler.accessorOpened(targetElement))
                return;

            // Close drop-down
            dropdownElement.style.display = "none";

            DropdownBindingHandler.unregisterCloseHandlers(targetElement);
            DropdownBindingHandler.accessorOpened(targetElement, false);
        }
    }

    ko.bindingHandlers["dropdown"] = new DropdownBindingHandler();
}

