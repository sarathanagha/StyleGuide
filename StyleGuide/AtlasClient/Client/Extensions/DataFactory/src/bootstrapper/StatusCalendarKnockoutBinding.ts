/// <reference path="../References.d.ts" />

import {StatusCalendar} from "../_generated/Framework";

interface IStatusCalendarValueAccessor {
    id: string;
    viewModel: StatusCalendar.StatusCalendar;
}

export class StatusCalendarKnockoutBinding implements KnockoutBindingHandler {
    static className: string = "statusCalendar";

    public init(
        element: HTMLElement,
        valueAccessor: () => IStatusCalendarValueAccessor,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {
        let value = valueAccessor();

        let statusCalendar = ko.utils.unwrapObservable(value.viewModel);
        element.innerHTML = StatusCalendar.StatusCalendar.template;
        ko.applyBindings(statusCalendar, element.firstChild);
        StatusCalendar.StatusCalendar.statusCalendars[value.id] = statusCalendar;

        return { controlsDescendantBindings: true };
    }
}

export class StatusBoxKnockoutBinding implements KnockoutBindingHandler {
    static className: string = "statusBox";

    public init(
        element: HTMLElement,
        valueAccessor: () => StatusCalendar.IStatusBox,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {
        let statusBox = ko.utils.unwrapObservable(valueAccessor());
        let jQueryElement = $(element);

        let childNode = document.createElement("div");
        element.appendChild(childNode);

        ko.applyBindingsToNode(childNode, {
            css: statusBox.status,
            text: statusBox.boxLabel
        });
        jQueryElement.children().addClass("center row");

        ko.applyBindingsToNode(element, {
            css: ko.pureComputed(() => {
                return statusBox.highlight && statusBox.highlight() ? "highlight" : "";
            }),
            attr: {
                title: statusBox.tooltip ? statusBox.tooltip : statusBox.boxLabel
            },
            style: {
                cursor: (statusBox.clickCallback || statusBox.doubleClickCallback) ? "pointer" : "default"
            }
        });
        jQueryElement.addClass("dataFactory-statusCalendar-statusBox dataFactory-statusCalendar-label grow no-shrink col");

        let dblClickTimeout = 400;
        let isDblClick = false;
        let numberOfClicks = 0;     // Number of single clicks can either be 1 or 2.

        let singleClickHandler = null;
        if (statusBox.clickCallback) {
            singleClickHandler = () => {
                numberOfClicks++;
                setTimeout(() => {
                    if (!isDblClick) {
                        statusBox.clickCallback(statusBox);
                    }
                    numberOfClicks--;
                    if (numberOfClicks === 0) {
                        isDblClick = false;
                    }
                }, dblClickTimeout);
            };
            jQueryElement.on("click", singleClickHandler);
        }

        let doubleClickHandler = null;
        if (statusBox.doubleClickCallback) {
            doubleClickHandler = () => {
                isDblClick = true;
                statusBox.doubleClickCallback(statusBox);
            };
            jQueryElement.on("dblclick", doubleClickHandler);
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            if (singleClickHandler) {
                jQueryElement.off("click", singleClickHandler);
            }
            if (doubleClickHandler) {
                jQueryElement.off("dblclick", doubleClickHandler);
            }
        });

        return { controlsDescendantBindings: true };
    }
}
