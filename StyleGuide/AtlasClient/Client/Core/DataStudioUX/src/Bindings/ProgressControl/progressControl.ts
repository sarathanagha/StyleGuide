/// <reference path="../../references.d.ts" />
/// <amd-dependency path="text!./progressControlDeterminateBar.html" />
/// <amd-dependency path="text!./progressControlDeterminateBarTextSmall.html" />
/// <amd-dependency path="text!./progressControlDeterminateBarTextLarge.html" />
/// <amd-dependency path="text!./progressControlIndeterminateSpinner.html" />

require(["text!datastudio.controls/Bindings/ProgressControl/progressControlDeterminateBar.html"]);
require(["text!datastudio.controls/Bindings/ProgressControl/progressControlDeterminateBarTextSmall.html"]);
require(["text!datastudio.controls/Bindings/ProgressControl/progressControlDeterminateBarTextLarge.html"]);
require(["text!datastudio.controls/Bindings/ProgressControl/progressControlIndeterminateSpinner.html"]);
//TODO: Add indeterminate progress styles

module Microsoft.DataStudioUX.Knockout.Bindings {
    "use strict";

    /* Progress types. */
    export enum ProgressType {
        DeterminateBar,
        DeterminateBarTextSmall,
        DeterminateBarTextLarge,
        IndeterminateInline,
        IndeterminatePage
    }

    export interface ProgressOptions {
        type: ProgressType;
        visible?: KnockoutObservable<boolean>;
        percentComplete?: KnockoutObservable<number>;
    }

    export class ProgressControlBinding implements KnockoutBindingHandler {

        private static templateHTML: string;

        private static toggleElementVisibility($element: JQuery, options: ProgressOptions): void {
            var isVisible: boolean = options.visible && ko.isObservable(options.visible) ? options.visible() : true;
            isVisible ? $element.show() : $element.hide();
        }

        public init(element: HTMLElement, valueAccessor: () => ProgressOptions, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext): void {

            var options: ProgressOptions = valueAccessor();

            var progressHtml: string;
            switch (options.type) {
                case ProgressType.DeterminateBar:
                    progressHtml = require("text!datastudio.controls/Bindings/ProgressControl/progressControlDeterminateBar.html");
                    break;
                case ProgressType.DeterminateBarTextSmall:
                    progressHtml = require("text!datastudio.controls/Bindings/ProgressControl/progressControlDeterminateBarTextSmall.html");
                    break;
                case ProgressType.DeterminateBarTextLarge:
                    progressHtml = require("text!datastudio.controls/Bindings/ProgressControl/progressControlDeterminateBarTextLarge.html");
                    break;
                case ProgressType.IndeterminateInline:
                    progressHtml = require("text!datastudio.controls/Bindings/ProgressControl/progressControlIndeterminateSpinner.html");
                    break;
                case ProgressType.IndeterminatePage:
                    progressHtml = "";
                    break;
                default:
                    console.error("Unknown progress type " + options.type);
            }
            ko.applyBindingsToNode(element, {
                html: progressHtml
            });
        }

        public update(element: HTMLElement, valueAccessor: () => ProgressOptions, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext): void {

            var $element: JQuery = $(element);
            var options: ProgressOptions = valueAccessor();

            if (options.type == ProgressType.DeterminateBar 
                || options.type == ProgressType.DeterminateBarTextSmall 
                || options.type == ProgressType.DeterminateBarTextLarge) {
                if (options.percentComplete) {
                    var newWidth = options.percentComplete();
                      
                    if (newWidth < 0 || newWidth > 100) {
                        console.log("Provided percentage of " + newWidth + " is outside the allowed range of 0-100");
                    }

                    var progressBar = $element.find(".progress-bar > span");
                    var prevWidth = 100*progressBar.width()/progressBar.offsetParent().width();
                    // Stop any existing animations
                    progressBar.stop(true);
                    if (prevWidth >= newWidth)
                    {
                        // Don't animate backwards
                        progressBar.css({ width: newWidth + "%" });
                    }
                    else
                    {
                        // Animate 10% for every 100 milliseconds
                        var speed = Math.abs(newWidth - prevWidth) * 10;
                        progressBar.animate({ width: newWidth + "%" }, speed);
                    }
                } else {
                    console.error("Missing determinate progress loader parameter \"percentComplete\"");
                }
            }

            ProgressControlBinding.toggleElementVisibility($element, options);
        }
    }

    ko.bindingHandlers["datastudio-ux-progress"] = new ProgressControlBinding();

}

