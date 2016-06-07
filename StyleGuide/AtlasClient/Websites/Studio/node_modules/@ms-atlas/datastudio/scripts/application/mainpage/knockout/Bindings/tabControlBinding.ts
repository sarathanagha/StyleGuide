/// <reference path="../Utils/KnockoutHelper.ts" />

module Microsoft.DataStudio.Application.Knockout.Bindings {

    export interface ITabControlBindingOptions {
        tabElementsGroups: ITabControlBindingElements[];
        drawer?: ITabControlBindingDrawerOptions;
        contentContainerSelector: string;
        contentContainerClass?: string;
        tabIsExpanded?: KnockoutObservable<boolean>;
    }

    export interface ITabControlBindingElements {
        id: string;
        tabsContainerSelector: string;
        tabsClass?: string;
        tabElements: KnockoutObservable<Microsoft.DataStudio.Model.Config.ShellElementConfigProxy[]>;
    }

    export interface ITabControlBindingDrawerOptions {
        tabsContainerSelector: string;
        tabsSelector: string;
        contentContainerSelector: string;
    }

    export class TabControlBinding implements KnockoutBindingHandler {
        public init(
            element: any,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): void | { controlsDescendantBindings: boolean; } {

            var controlConfig: ITabControlBindingOptions = valueAccessor();

            var controlContainer: JQuery = $(element);
            var contentContainer: JQuery = controlContainer.find(controlConfig.contentContainerSelector);
            var bindingSubscriptions: KnockoutSubscription<any>[] = [];

            if (controlConfig.drawer) {
                var drawerContainer: JQuery = controlContainer.find(controlConfig.drawer.tabsContainerSelector);
                var drawerTabElement: JQuery = drawerContainer.find(controlConfig.drawer.tabsSelector);
                if (drawerTabElement.length > 0) {
                    drawerTabElement.attr('title', `New`);
                    drawerTabElement.click({ value: 'New' }, (event: JQueryEventObject) => {
                        TabControlBinding.showDrawer(drawerTabElement, controlContainer, controlConfig);
                    });

                    ko.utils.domData.clear(drawerTabElement[0]);
                    ko.applyBindings(viewModel, drawerTabElement[0]);
                }
            }

            for (var i: number = 0; i < controlConfig.tabElementsGroups.length; i++) {
                var tabElementsGroupConfig: ITabControlBindingElements = controlConfig.tabElementsGroups[i];

                var tabsContainer: JQuery = controlContainer.find(tabElementsGroupConfig.tabsContainerSelector);

                ko.utils.domData.clear(tabsContainer[0]);
                ko.applyBindings(viewModel, tabsContainer[0]);

                var tabElementsProxy: KnockoutObservable<Microsoft.DataStudio.Model.Config.ShellElementConfigProxy[]> = tabElementsGroupConfig.tabElements;

                TabControlBinding.updateTabGroup(tabsContainer, contentContainer, controlContainer, tabElementsProxy(), viewModel, tabElementsGroupConfig, controlConfig);
                bindingSubscriptions.push(
                    tabElementsProxy.subscribe(TabControlBinding.tabGroupCallback(tabsContainer, contentContainer, controlContainer, viewModel, tabElementsGroupConfig, controlConfig))
                );
            }

            var tabs: JQuery = controlContainer.find(".tab");
            if (tabs.length > 0 && tabs.filter(".active").length < 1) {
                if (controlConfig.drawer) {
                    tabs = tabs.not(controlConfig.drawer.tabsSelector);
                }

                var firstTab: JQuery = tabs.first();
                if (firstTab) {
                    firstTab.addClass("active");
                }

                var firstPanel: JQuery = contentContainer.find(".panelContent").first();
                if (firstPanel) {
                    firstPanel.removeClass("hide");
                }
            }
            
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                bindingSubscriptions.forEach((subscription: KnockoutSubscription<any>) => subscription.dispose());
            });

            return { controlsDescendantBindings: true };
        }

        private static tabGroupCallback = (tabsContainer, contentContainer, controlContainer, viewModel, tabElementsGroupConfig, controlConfig) => {
            return (newValue: Microsoft.DataStudio.Model.Config.ShellElementConfigProxy[]) => {
                TabControlBinding.updateTabGroup(tabsContainer, contentContainer, controlContainer, newValue, viewModel, tabElementsGroupConfig, controlConfig);
            };
        }

        private static updateTabGroup(
            tabsContainer: JQuery,
            contentContainer: JQuery,
            controlContainer: JQuery,
            tabElements: Microsoft.DataStudio.Model.Config.ShellElementConfigProxy[],
            viewModel: any,
            tabElementsGroupConfig: ITabControlBindingElements,
            controlConfig: ITabControlBindingOptions) {

            tabsContainer.empty();
            ko.cleanNode(contentContainer[0]);

            var defaultClick: () => void = null;
            if (tabElements && tabElements.length > 0) {
                for (var i: number = 0; i < tabElements.length; i++) {
                    let tabElement = tabElements[i];
                    var tabElementConfig: Microsoft.DataStudio.Model.Config.ElementConfig = ko.mapping.toJS(tabElements[i]);
                    var tabId: string = `tab${tabElementsGroupConfig.id}_${i}`;

                    // Render tabs
                    var tabDiv: HTMLDivElement = document.createElement("div");
                    var tabDivElement: JQuery = $(tabDiv);
                    tabDivElement.addClass(`${tabElementsGroupConfig.tabsClass} ${tabId} ${tabElementConfig.icon}`);
                    tabDivElement.attr('title', `${tabElementConfig.text}`);
                    tabDivElement.wrapInner(tabElementConfig.iconResource);
                    tabsContainer.append(tabDiv);

                    // Render content
                    if (tabElementConfig.componentName) {
                        var panelContentElement: JQuery = $(document.createElement("div"));
                        panelContentElement.addClass(controlConfig.contentContainerClass);
                        panelContentElement.addClass(tabId);
                        panelContentElement.addClass("hide");

                        var panelContentComponent: HTMLDivElement = Utils.KnockoutHelper.CreateComponentNode(tabElement);
                        panelContentElement.append(panelContentComponent);
                        ko.applyBindings(viewModel, panelContentElement[0]);

                        contentContainer.find("." + tabId).remove();
                        contentContainer.append(panelContentElement);
                    }

                    let onClickCreator = (tabId, callback, tabsContainer, contentContainer, controlContainer, controlConfig) => {
                        return () => {
                            if (controlConfig.tabIsExpanded) controlConfig.tabIsExpanded(true);
                            TabControlBinding.showPanel(`.${tabId}`, tabsContainer, contentContainer, controlContainer);
                            TabControlBinding.hideDrawer(controlConfig);
                            if (callback) {
                                callback();
                            }
                        };
                    };

                    let onClick = onClickCreator(tabId, tabElementConfig.callback, tabsContainer, contentContainer, controlContainer, controlConfig);

                    tabDivElement.click(onClick);

                    if (!defaultClick || tabElementConfig.isDefault) {
                        defaultClick = onClick;
                    }
                }
                
                // we don't want to trigger a click event, just the callback
                defaultClick();
            }

            var tabs: JQuery = controlContainer.find(".tab");
            // [TODO: stpryor] This is a hack to hide the left side panel when there are no values. This needs better native support.
            if (tabs.length > 0) {
                controlContainer.closest('.leftSidePanel:hidden').show();
            } else {
                controlContainer.closest('.leftSidePanel').hide();
            }
        }

        private static showPanel(tabSelector: string, tabContainerElement: JQuery, contentContainerElement: JQuery, controlContainerElement: JQuery): void {

            var targetTabElement: JQuery = tabContainerElement.find(tabSelector);

            if (!targetTabElement.hasClass("active")) {
                controlContainerElement.find(".tab").removeClass("active"); // TODO get tab class (".tab") from control config.
                targetTabElement.addClass("active");

                contentContainerElement.children().addClass("hide");
                contentContainerElement.find(tabSelector).removeClass("hide");
            }
        }
        
        private static showDrawer(drawerTabElement: JQuery, tabContainerElement: JQuery, controlConfig: ITabControlBindingOptions): void {

            if (controlConfig.drawer) {
                var drawerContainerElement: JQuery = $(controlConfig.drawer.contentContainerSelector);

                if (!drawerTabElement.hasClass("active")) {
                    tabContainerElement.children().removeClass("active");
                    drawerTabElement.addClass("active");
                    drawerContainerElement.addClass('open');
                    TabControlBinding.hideDrawerButtonClick(drawerContainerElement, drawerTabElement, tabContainerElement, controlConfig);
                } else {
                    tabContainerElement.children().first().addClass("active");
                    TabControlBinding.hideDrawer(controlConfig);
                }
            }
        }

        private static hideDrawer(controlConfig: ITabControlBindingOptions): void {
            if (controlConfig.drawer) {
                var drawerContainerElement: JQuery = $(controlConfig.drawer.contentContainerSelector);
                var drawerTabElement: JQuery = $(controlConfig.drawer.tabsSelector);

                drawerTabElement.removeClass("active");
                drawerContainerElement.removeClass('open');
            }
        }
        
        private static hideDrawerButtonClick(drawerContainerElement: JQuery, drawerTabElement: JQuery, tabContainerElement: JQuery, controlConfig: ITabControlBindingOptions) {
            if (drawerContainerElement && drawerContainerElement.length > 0) {
                drawerContainerElement.find('.switch').click({ value: 'Close' }, (event: JQueryEventObject) => {
                    TabControlBinding.hideDrawer(controlConfig);
                    tabContainerElement.children().first().addClass("active");
                });
            }
        }
    }
}