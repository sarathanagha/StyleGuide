/// <reference path="../../references.d.ts" />
/// <amd-dependency path="css!./loaderControl.css" />
/// <amd-dependency path="text!./loaderControl.html" />

require(["css!datastudio.controls/Bindings/LoaderControl/loaderControl.css"])
require(["text!datastudio.controls/Bindings/LoaderControl/loaderControl.html"])

module Microsoft.DataStudio.Application.Knockout.Bindings {
    "use strict";

    /* Loader types. */
    export enum LoaderType {
        Page = 1,
        Nested = 2,
        Dialog = 3
    }

    /*
     * Available options for loader
     */
    export interface ILoaderOptions {
        visible?: KnockoutObservable<boolean>;
        type?: LoaderType;
    }

    /**
     * custom loader binding.
     * usage example <div data-bind="loader: { visible: {Observable<boolean>}, type: {LoaderType} }"></div>
     * default {LoaderType} is page loader. It means that it will take the whole screen and will block it.
     */
    export class LoaderControlBinding implements KnockoutBindingHandler {

        /**
         * defines template name used for loader depending on current browser.
         */
        private static templateName: string;
        private static pageLoaderClass: string = "page-loader";
        private static nestedLoaderClass: string = "nested-loader";
        private static dialogLoaderClass: string = "dialog-loader";

       /** 
        * Toggles element visibility state.
        * @param {JQuery} $element: JQuery element for switching visibility .
        * @param {ILoaderOptions} options: Binding options.
        */
        private static toggleElementVisibility($element: JQuery, options: ILoaderOptions): void {
            var isVisible: boolean = $element.is(":visible");
            var optionVisible: boolean = ko.utils.unwrapObservable(options.visible) || false;

            if (optionVisible !== isVisible) {
                $element.toggle();
            }
        }

        /*
         * Implementation of {KnockoutBindingHandler} interface method
         */
        public init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext): void {

            var browserisIE: boolean = !!(navigator.userAgent.match(/edge/i) || navigator.userAgent.match(/trident/i));
            LoaderControlBinding.templateName = browserisIE ? "loader-template-ie" : "loader-template";

            var $element: JQuery = $(element);
            var loaderClass: string;
            var options: ILoaderOptions = ko.utils.unwrapObservable(valueAccessor() || {});
            ko.applyBindingsToNode(element, {
                template: { name: LoaderControlBinding.templateName }
            });

            options.type = options.type || LoaderType.Page;

            switch (options.type) {
                case LoaderType.Page:
                    loaderClass = LoaderControlBinding.pageLoaderClass;
                    break;
                case LoaderType.Nested:
                    loaderClass = LoaderControlBinding.nestedLoaderClass;
                    $element.parent().css("position", "relative");
                    break;
                case LoaderType.Dialog:
                    loaderClass = LoaderControlBinding.dialogLoaderClass;
                    break;
                default:
                    console.error("Unknown loader type " + options.type);
            }

            $element.addClass(loaderClass);
            LoaderControlBinding.toggleElementVisibility($element, options);
        }

        /*
         * Implementation of {KnockoutBindingHandler} interface method
         */
        public update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext): void {

            var $element: JQuery = $(element);
            var options: ILoaderOptions = ko.utils.unwrapObservable(valueAccessor() || {});

            LoaderControlBinding.toggleElementVisibility($element, options);
        }
    }

    ko.bindingHandlers["datastudio-ux-loader"] = new LoaderControlBinding();

}

