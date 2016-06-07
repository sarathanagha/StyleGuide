/// <reference path="../references.d.ts" />

module Microsoft.DataStudioUX.Knockout.Bindings {
    "use strict";

    export class MenuBinding implements KnockoutBindingHandler {

        public static menuId: string = "datastudio-ux-menubinding";
        public static initMenuCounter: number = 0;
        private static checkmark: string = '<span class="checkmark left" data-bind="datastudio-ux-svgloader:\'node_modules/@ms-atlas/datastudio-controls/Images/checkmark.svg\'" ></span>';
                
        private static removeMenuBinding(element?: JQuery) {
            var element: JQuery = element ? element : $('div[id^="' + MenuBinding.menuId + '"]');
            if (element.length > 0) {
                $.each(element.children(), (index: number) => {
                    ko.cleanNode(element[index]);
                });
                element.remove();
            }
        }

        public init(element: HTMLElement, valueAccessor: () => Interfaces.IMenuBindingParams, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext) :void {

            var $element: JQuery = $(element);
            var params: Interfaces.IMenuBindingParams = valueAccessor();

            if (MenuBinding.initMenuCounter++ < 1) {
                $(document).keyup((event: JQueryKeyEventObject) => {
                    if (event.keyCode === Helpers.Keycodes.Escape) MenuBinding.removeMenuBinding();
                });

                $(document).click((event: Event) => {
                    if (!$(event.target).closest($('div[id^="' + MenuBinding.menuId + '"]')).length && !$(event.target).is($('div[id^="' + MenuBinding.menuId + '"]'))) {
                        MenuBinding.removeMenuBinding();
                    }
                });

                // Remove the menu on page resize since the position will be incorrect
                $(window).resize(() => MenuBinding.removeMenuBinding());

                // Remove the menu if the user scrolls the page
                $(document).scroll((event: any) => MenuBinding.removeMenuBinding());
                
            }

            if (params.scrollClass) {
                $element.closest('.' + params.scrollClass).scroll((event: any) => {
                    MenuBinding.removeMenuBinding();
                });
            }

            $element.click((event: Event) => {
                event.preventDefault();
                event.stopPropagation();
                // Remove any already open menu
                var removableMenusSelector: string = 'div[id^="' + MenuBinding.menuId + '"]';
                if (!params.level) {
                    MenuBinding.removeMenuBinding($('#' + MenuBinding.menuId+"0"));
                } else {
                    MenuBinding.removeMenuBinding($('#' + MenuBinding.menuId + (params.level - 1)).nextAll(removableMenusSelector));
                }
                var menuLevelId = params.level ? MenuBinding.menuId + params.level : MenuBinding.menuId + 0;
                // Adjust for any offset overrides
                var newSelectMenu: JQuery = $('<div id="' + menuLevelId + '"></div>');
                var offset: { left: number; top: number } = $element.offset();
                var newLeft = offset.left + (params.leftOffset ? $element.outerWidth() : 0);
                var newTop = offset.top + $element.outerHeight() + (params.topOffset ? -$element.height() : 0);
                newSelectMenu.css({ left: newLeft, top: newTop });

                var contents = $('<div class="contents"></div>');
                var options: Interfaces.IMenuBindingOption[];
                var tempOptions: any = params.options;
                if (ko.isObservable(tempOptions)) {
                    options = tempOptions();
                } else {
                    options = tempOptions;
                }
                options = options || [];
                // Don't show a memu with no options
                if (options.length < 1) return;

                options.forEach((option: Interfaces.MenuBindingGenericOption) => {
                    var className: string = '';
                    if (typeof option === 'string') {
                        var menuItem = (option === '-') ? $('<hr>') : $('<span class="header">' + option + '</span>');
                    } else {
                        var menuItem = $('<a href="#">' + option.label + '</a>');
                        if (option.isDisabled) menuItem.addClass('disabled');
                        if (option.options) {
                            if (menuItem.find('.caretright').length === 0) {
                                var rightArrow: JQuery = $('<span class="caretright checkmark right" data-bind="datastudio-ux-svgloader:\'node_modules/@ms-atlas/datastudio-controls/Images/chevron-right.svg\'" > </span>');
                                menuItem.append(rightArrow);
                                ko.applyBindings(option, rightArrow[0]);
                            }
                            var optionViewModel = {
                                options: option.options,
                                leftOffset: $element.width(),
                                topOffset: -$element.height(),
                                level: params.level ? (params.level + 1) : 1
                            };
                            ko.bindingHandlers['datastudio-ux-menubinding'].init(menuItem[0],  () => { return optionViewModel });
                     }
                   
                        if (option.iconPath) {
                        var iconImage: JQuery = $('<span class="menu-icon left" data-bind="datastudio-ux-svgloader:\'' + option.iconPath+'\'"></span>');
                        menuItem.prepend(iconImage);
                        ko.applyBindings(option, iconImage[0]);
                    }

                    if (option.description) {
                        var description: any = option.description;
                        var desc: string;
                        if (ko.isObservable(description)) {
                            desc = description();
                        } else {
                            desc = description;
                        }
                        menuItem.append("<section>" + desc +"</section>");
                    }
                    if (!option.isDisabled) {
                        menuItem.click((event: Event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (params.selected) {
                                if (!params.isMultiselect) {
                                    params.selected()[0] = option;
                                }
                                else {
                                    var existingIndex: number = params.selected.indexOf(option);
                                    if (existingIndex >= 0) {
                                        // Deselect case
                                        params.selected.splice(existingIndex, 1);
                                        menuItem.find('.checkmark').remove();
                                    } else {
                                        // New selection case
                                        params.selected.push(option);
                                        var checkmark: JQuery = $(MenuBinding.checkmark);
                                        menuItem.prepend(checkmark);
                                        ko.applyBindings(option, checkmark[0]);
                                    }                                   
                                    return false;
                                }
                            }
                         //   if (option.action) option.action();
                            if (!option.options)
                                MenuBinding.removeMenuBinding($('div[id^="' + MenuBinding.menuId + '"]'));
                            return false;

                        });
                    }

                    if (params.selected) {
                        var checkmark: JQuery = $(MenuBinding.checkmark);
                        if (!params.isMultiselect) {
                            if (params.selected()[0].value == option.value) {
                                menuItem.prepend(checkmark);
                            }
                        }
                        else {
                            params.selected().forEach((param) => {
                                if (param.value == option.value) {
                                    menuItem.prepend(checkmark);
                                }
                            });
                        }
                        ko.applyBindings({}, checkmark[0]);
                    }
                    
                }
                    contents.append(menuItem);
                });


                newSelectMenu.append(contents).appendTo('body');
               
                // Check if the menu drops off the bottom of the page, if so, move it up
                var currWindow: JQuery = $(window);
                if (currWindow.scrollTop() + currWindow.height() <= (newSelectMenu.offset().top + newSelectMenu.outerHeight())) {
                    offset = $element.offset();
                    newTop = offset.top - newSelectMenu.outerHeight() + (params.topOffset ? -1 * params.topOffset : 0);
                    newSelectMenu.css({ top: newTop });
                }
                
                var rightEdge :number = newSelectMenu.width() + newSelectMenu.offset().left;
                if (currWindow.width() < newSelectMenu.offset().left + newSelectMenu.width()) {
                    newSelectMenu.css({left: newSelectMenu.offset().left - newSelectMenu.width()});
                }

                // Animate the contents after appending so the height is known
                contents.css({ top: -1 * (contents.height() - 1) }).animate({ top: 0 }, 150);

                
            });
           
           
        }
    }

    ko.bindingHandlers["datastudio-ux-menubinding"] = new MenuBinding();
}

