/// <reference path="Bindings/ContextMenuBindingHandler.ts" />
/// <reference path="Bindings/TabControlBinding.ts" />
/// <reference path="Utils/KnockoutHelper.ts" />

module Microsoft.DataStudio.Application.Knockout {
    
    class jqueryUIBinding implements KnockoutBindingHandler {
        public update(element: any,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): void {

            var config = ko.unwrap(valueAccessor());
            
            for (var name in config) {
                var options = config[name] || {};
                (<any>$(element))[name](options);
            }
        }
    }
    
     class initHTMLBinding implements KnockoutBindingHandler {
        public init(element:any,
                      valueAccessor:() => any,
                      allBindingsAccessor?:KnockoutAllBindingsAccessor,
                      viewModel?:any,
                      bindingContext?:KnockoutBindingContext): void {

            var handler = ko.unwrap(valueAccessor());
            
            if(handler){
               handler(element);
            }
        }
    }
    
    class collapseBinding implements KnockoutBindingHandler {
        private static _switchDefaultSelector: string = ".switch";
        private static _collapsableClass: string = "collapsed";

        public update(
            element: any,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): void {

            var value: any = valueAccessor();
            var switchSelector: string = value && value.switch ? value.switch : collapseBinding._switchDefaultSelector;
            var switchElement: JQuery = $(element).find(switchSelector);
            var collapsableElement: JQuery = (value && value.element) ? $(value.element) : $(element);
            var expandOnClick: boolean = (value && value.expandOnClick) ? true : false;

            var collapsedSwitchClass: string = value && value.collapsedSwitch ? value.collapsedSwitch : null;
            var expandedSwitchClass: string = value && value.expandedSwitch ? value.expandedSwitch : null;
            var collapsableClass: string = value && value.collapsableClass ? value.collapsableClass : collapseBinding._collapsableClass;
            
            var isCollapsed: boolean = collapsableElement.hasClass(collapsableClass);

            var collapseObservable: KnockoutObservable<boolean> = value && value.isExpanded ? value.isExpanded : null;

            if (ko.isObservable(collapseObservable)) {
                if (collapseObservable()) {
                    collapseBinding.showPanel(collapsableElement, switchElement, collapsableClass, collapsedSwitchClass, expandedSwitchClass);
                } else {
                    collapseBinding.hidePanel(collapsableElement, switchElement, collapsableClass, collapsedSwitchClass, expandedSwitchClass);
                }
            } else {
                if (isCollapsed && collapsedSwitchClass) {
                    switchElement.addClass(collapsedSwitchClass);
                } else if (!isCollapsed && expandedSwitchClass) {
                    switchElement.addClass(expandedSwitchClass);
                }

            switchElement.click((event) => {
                event.stopPropagation();
                    collapseBinding.triggerPanel(collapsableElement, switchElement, collapsableClass, collapsedSwitchClass, expandedSwitchClass);
            });

            if (expandOnClick) {
                collapsableElement.click(() => {
                        collapseBinding.showPanel(collapsableElement, switchElement, collapsableClass, collapsedSwitchClass, expandedSwitchClass);
                });
            }
        }
        }

        private static triggerPanel(elementSelector: JQuery, switchSelector: JQuery, collapsableClass: string, collapsedSwitchClass: string, expandedSwitchClass: string): void {
            elementSelector.toggleClass(collapsableClass);
            
            if (collapsedSwitchClass) {
                switchSelector.toggleClass(collapsedSwitchClass);
        }

            if (expandedSwitchClass) {
                switchSelector.toggleClass(expandedSwitchClass);
            }
        }

        private static showPanel(elementSelector: JQuery, switchSelector: JQuery, collapsableClass: string, collapsedSwitchClass: string, expandedSwitchClass: string): void {
            if (elementSelector.hasClass(collapsableClass)) {
                elementSelector.removeClass(collapsableClass);

                if (collapsedSwitchClass) {
                    switchSelector.removeClass(collapsedSwitchClass);
            }
            
                if (expandedSwitchClass) {
                    switchSelector.addClass(expandedSwitchClass);
        }
            }


        }

        private static hidePanel(elementSelector: JQuery, switchSelector: JQuery, collapsableClass: string, collapsedSwitchClass: string, expandedSwitchClass: string): void {
            if (!elementSelector.hasClass(collapsableClass)) {
                elementSelector.addClass(collapsableClass);

                if (expandedSwitchClass) {
                    switchSelector.removeClass(expandedSwitchClass);
            }
            
                if (collapsedSwitchClass) {
                    switchSelector.addClass(collapsedSwitchClass);
                }
            }
        }
    }

    class shellComponentBinding implements KnockoutBindingHandler {
        public init(element: any,
                    valueAccessor: () => any,
                    allBindingsAccessor?: KnockoutAllBindingsAccessor,
                    viewModel?: any,
                    bindingContext?: KnockoutBindingContext): void {

            var div: HTMLDivElement = Utils.KnockoutHelper.CreateComponentNode(valueAccessor());

            $(element).append(div);
        }
    }

    class jsTreeBinding implements KnockoutBindingHandler {

        private static defaultConfig = {
            'core': {
                'check_callback': true,
                'themes': { 'responsive': true }
            },
            'types': {
                'default': {
                    'icon': 'none',
                    'valid_children': ['default', 'level_1', 'server']
                },
                'server': { 'icon': 'none' }
            },
            'plugins': ['state', 'types', 'wholerow']
        };

        public update(element: any,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): void {

            var treeData = ko.unwrap(valueAccessor());
            var data = treeData.data();
            var config = treeData.config ? treeData.config() : null;
            var handlers = treeData.handlers;

            // if just one handler was specified, assume it's the select node handler
            if (treeData.handler) {
                handlers = { "select_node": treeData.handler };
            }

            jsTreeBinding.buildTree(element, data, handlers, config);
        }

        private static buildTree(element: JQuery, treeData: any, handlers: { [event: string]: (event: Event, data: any) => void }, treeConfig?: any): void {
            $(element).jstree('destroy');
            var data = $.extend({}, { 'core': { 'data': treeData } });
            var config = $.extend({}, jsTreeBinding.defaultConfig, data, treeConfig);

            var jstree = $(element).jstree(config)
                .on("ready.jstree", () => {
                    if (config.datastudio && config.datastudio.open_all) {
                        $(element).jstree('open_all');
                    }
                });

            for (var event in handlers) {
                jstree.on(event + ".jstree", handlers[event]);
            }
        }
    }

    class slideBinding implements KnockoutBindingHandler {

        public init(element: any,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): void {

            var value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(value));
        }
        public update(element: any,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): void {

            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).slideDown("slow") : $(element).hide();

        }
    }

    class chartControlBinding implements KnockoutBindingHandler {

        public update(element: any,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): void {

            var dataObj = ko.unwrap(valueAccessor());
            var chartData = dataObj.chartData();

            // container needs to be a htmlelement type
            var container = $(element).get(0);
        }
    }

    export class BindingHandler {
        public static initialize() {
            ko.bindingHandlers["slide"] = new slideBinding();
            ko.bindingHandlers["collapse"] = new collapseBinding();
            ko.bindingHandlers["jqueryUI"] = new jqueryUIBinding();
            ko.bindingHandlers["shellComponent"] = new shellComponentBinding();
            ko.bindingHandlers["tabControl"] = new Bindings.TabControlBinding();
            ko.bindingHandlers["jsTree"] = new jsTreeBinding();
            ko.bindingHandlers["chartControl"] = new chartControlBinding();
            ko.bindingHandlers["initHTML"] = new initHTMLBinding();
            ko.bindingHandlers[Bindings.ContextMenuBindingHandler.BindingName] = new Bindings.ContextMenuBindingHandler();

        }
    }
}
