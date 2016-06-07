/// <reference path="../references.d.ts" />
/// <amd-dependency path="text!./mainArea.html" />
/// <amd-dependency path="css!./mainArea.css" />

import Model = Microsoft.DataStudio.Model;
import ShellContext = Microsoft.DataStudio.Application.ShellContext;

export var template: string = require("text!./mainArea.html");

export class viewModel {
    public viewConfig: KnockoutComputed<Model.Config.ViewConfigProxy>;

    public inputValue: KnockoutComputed<string>;
    public showInputValue: KnockoutComputed<boolean>;

    // TODO Enforce strong typing
    public actionButtons: KnockoutObservableArray<{ operationName: string; operationIcon: string; operationId: string }>;
    public hasActionButtons: KnockoutComputed<boolean>;
    public drawerPanelElements: KnockoutComputed<Microsoft.DataStudio.Model.Config.ShellElementConfigProxy[][]>;

    public isSidePanelsVisible: KnockoutComputed<boolean>;
    public leftPanelEnabled: KnockoutComputed<boolean>;
    public mainAreaComponent: KnockoutComputed<string>;
    public leftPanelElementsConfig: KnockoutComputed<Microsoft.DataStudio.Application.Knockout.Bindings.ITabControlBindingOptions>;
    public rightPanelElementsConfig: KnockoutComputed<Microsoft.DataStudio.Application.Knockout.Bindings.ITabControlBindingOptions>;

    public leftPanelIsExpanded: KnockoutObservable<boolean>;
    public rightPanelIsExpanded: KnockoutObservable<boolean>;

    public rightPanelEnabled: KnockoutObservable<boolean>;

    public toggleLeftPanel = (data: any, event: any) => {
        event.stopPropagation();
        this.leftPanelIsExpanded(!this.leftPanelIsExpanded());
    }

    public toggleRightPanel = (data: any, event: any) => {
        event.stopPropagation();
        this.rightPanelIsExpanded(!this.rightPanelIsExpanded());
    }

    public showLeftPanel = (data: any, event: any) => {
        event.stopPropagation();
        this.leftPanelIsExpanded(true);
    }

    public showRightPanel = (data: any, event: any) => {
        event.stopPropagation();
        this.rightPanelIsExpanded(true);
    }

    constructor(params: any) {

        // TODO add computed update handler
        this.inputValue = ko.computed(() => ShellContext.CurrentModuleContext().mainInputValue());
        this.showInputValue = ko.computed(() => this.inputValue() !== typeof "undefined" && this.inputValue() !== null);

        this.actionButtons = ShellContext.CurrentModuleContext().mainActionButtons;
        this.viewConfig = ShellContext.CurrentModuleViewConfig;

        this.isSidePanelsVisible = ko.pureComputed(() => {
            return !this.viewConfig || !this.viewConfig() || !this.viewConfig().isFullScreen || (this.viewConfig().isFullScreen && !this.viewConfig().isFullScreen());
        }).extend({
            rateLimit: {
                timeout: 10,
                method: "notifyWhenChangesStop"
            }
        });

        this.rightPanelEnabled = ko.observable(false);

        this.leftPanelIsExpanded = ShellContext.LeftPanelIsExpanded;
        this.rightPanelIsExpanded = ShellContext.RightPanelIsExpanded;

        this.mainAreaComponent = ko.computed(() => this.viewConfig() && this.viewConfig().componentName && this.viewConfig().componentName() ? this.viewConfig().componentName() : "");

        this.leftPanelElementsConfig = ko.computed(() => {
            if (!this.isSidePanelsVisible()) {
                return null;
            }
            var globalTabElementsGroup: Microsoft.DataStudio.Application.Knockout.Bindings.ITabControlBindingElements = {
                id: "global-tabs",
                tabsClass: "row center tab global-tab",
                tabsContainerSelector: ".global-tabs",
                tabElements: ko.computed(() => ShellContext.GlobalLeftPanelElements ? ShellContext.GlobalLeftPanelElements() : null)
            }

            var moduleTabElementsGroup: Microsoft.DataStudio.Application.Knockout.Bindings.ITabControlBindingElements = {
                id: "module-tabs",
                tabsClass: "row center tab module-tab",
                tabsContainerSelector: ".module-tabs",
                tabElements: ko.computed(() => ShellContext.CurrentModuleContext().moduleConfig().moduleLeftPanel ? ShellContext.CurrentModuleContext().moduleConfig().moduleLeftPanel() : null)
            }

            var viewTabElements = ko.observable(null);

            var viewTabElementsComputed = ko.computed(() => {
                let elements = (this.viewConfig() && this.viewConfig().leftPanel) ? this.viewConfig().leftPanel() : null;

                // we need to check that each element in the array is the same object
                let sameElements = viewTabElements() && elements && elements.length === viewTabElements().length && elements.some((element: Object, index: number) => {
                    return element === viewTabElements()[index];
                });

                // only trigger an update if the array is different
                if (!sameElements) {
                    viewTabElements(elements);
                }
            });

            var viewTabElementsGroup: Microsoft.DataStudio.Application.Knockout.Bindings.ITabControlBindingElements = {
                id: "view-tabs",
                tabsClass: "row center tab",
                tabsContainerSelector: ".view-tabs",
                tabElements: viewTabElements
            }

            var drawerOptions: Microsoft.DataStudio.Application.Knockout.Bindings.ITabControlBindingDrawerOptions = {
                tabsSelector: ".drawer-tab",
                tabsContainerSelector: ".drawer-tabs",
                contentContainerSelector: ".drawer"
            }

            var config: Microsoft.DataStudio.Application.Knockout.Bindings.ITabControlBindingOptions = {
                contentContainerClass: "col grow panelContent",
                contentContainerSelector: ".panels",
                tabElementsGroups: [globalTabElementsGroup, moduleTabElementsGroup, viewTabElementsGroup],
                tabIsExpanded: ShellContext.LeftPanelIsExpanded,
                drawer: drawerOptions
            };

            return config;
        }).extend({
            rateLimit: {
                timeout: 10,
                method: "notifyWhenChangesStop"
            }
        });

        this.rightPanelElementsConfig = ko.computed(() => {
            if (!this.isSidePanelsVisible()) {
                return null;
            }

            var viewTabElementsGroup: Microsoft.DataStudio.Application.Knockout.Bindings.ITabControlBindingElements = {
                id: "view-tabs",
                tabsClass: "col tab center",
                tabsContainerSelector: ".view-tabs",
                tabElements: ko.computed(() => {
                    if (this.viewConfig() && this.viewConfig().rightPanel) {
                        this.rightPanelEnabled(true);
                        return this.viewConfig().rightPanel();
                    } else {
                        this.rightPanelEnabled(false);
                        return null;
                    }
                })
            }

            var config: Microsoft.DataStudio.Application.Knockout.Bindings.ITabControlBindingOptions = {
                contentContainerClass: "row grow panelContent",
                contentContainerSelector: ".panels",
                tabElementsGroups: [viewTabElementsGroup]
            };

            return config;
        }).extend({
            rateLimit: {
                timeout: 10,
                method: "notifyWhenChangesStop"
            }
        });

        this.drawerPanelElements = ko.computed(() => {

            var drawerElements: Microsoft.DataStudio.Model.Config.ShellElementConfigProxy[][] = null;
            if (this.viewConfig() && this.viewConfig().drawerPanel) {
                drawerElements = [this.viewConfig().drawerPanel()];
            }

            return drawerElements;
        });

        this.hasActionButtons = ko.computed(() => this.actionButtons.length > 0);
    }
}
