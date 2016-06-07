/// <reference path="../References.d.ts" />
/// <amd-dependency path="css!./CSS/Callout.css"/>

import AppContext = require("../scripts/AppContext");
import WinJSHandlers = require("../scripts/Handlers/WinJSHandlers");
/* tslint:disable:no-unused-variable */
import Framework = require("../_generated/Framework");
/* tslint:enable:no-unused-variable */
import Flyout = Framework.HoverFlyout;

export interface ICalloutValueAccessor {
    innerHtml: string | KnockoutObservable<string>;
    placement?: string;
}

export class CalloutKnockoutBinding implements KnockoutBindingHandler {
    public static className: string = "callout";

    public init(
        element: HTMLElement,
        valueAccessor: () => ICalloutValueAccessor,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        let showFlyout = () => {
            let value = ko.unwrap(valueAccessor());
            let html = ko.utils.unwrapObservable(value.innerHtml);
            let calloutRequest: WinJSHandlers.ICalloutRequest = {
                anchor: element,
                innerHTML: html,
                autohide: true,
                placement: value.placement || "auto"
            };

            WinJS.UI.disableAnimations();
            // Only show nonempty callouts
            if (html) {
                AppContext.AppContext.getInstance().calloutHandler.addRequest(calloutRequest);
            }
            WinJS.UI.enableAnimations();
        };

        ko.utils.registerEventHandler(element, Flyout.ACTION_FOR_SHOW, showFlyout);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            element.removeEventListener(Flyout.ACTION_FOR_SHOW, showFlyout);
            Flyout.removeListenersForElement(element);
        });

        return { controlsDescendantBindings: false };
    }
}
