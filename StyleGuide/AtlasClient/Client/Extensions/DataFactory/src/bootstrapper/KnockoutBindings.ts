/// <reference path="../libs/VivaGraphControl/moduleDefinitions.d.ts" />
/// <reference path="../References.d.ts" />

"use strict";

import VivaGraphWidget = require("Viva.Controls/Controls/Visualization/Graph/GraphWidget");
import VivaUtil = require("Viva.Controls/Util/Util");
import VivaResize = require("Viva.Controls/Util/Resize");
import VivaGraphSvgUtils = require("Viva.Controls/Controls/Visualization/Graph/SvgUtils");

import FilterFlyoutKnockoutBinding = require("./FilterFlyoutKnockoutBinding");
import StatusCalendarFlyoutKnockoutBinding = require("./StatusCalendarFlyoutKnockoutBinding");
import StatusCalendarKnockoutBinding = require("./StatusCalendarKnockoutBinding");
import Wizard = require("./WizardBinding");
import CopyBinding = require("./CopyBinding");
import WinJSButtonKnockoutBinding = require("./WinJSButtonKnockoutBinding");
import LoadingBinding = require("./LoadingBinding");
import TelemetryKnockoutBinding = require("./TelemetryKnockoutBinding");
import Log = require("../scripts/Framework/Util/Log");
import JQueryUIBindings = require("./JQueryUIBindings");
import BreadcrumbsBinding = require("./BreadcrumbsKnockoutBinding");
import CalloutBinding = require("./CalloutBinding");
import {PivotKnockoutBinding} from "./PivotKnockoutBinding";
import WinJSKnockoutBindings = require("./WinJSKnockoutBindings");
import CollapsibleBindings = require("./CollapsibleKnockoutBinding");
import {ParameterGroupsBinding} from "./ParameterGroupsBinding";

import Framework = require("../_generated/Framework");

let logger = Log.getLogger({
    loggerName: "KnockoutBindings"
});

interface IViewModelBindingOptions {
    template: string;
    viewModel: Object;
}

class ViewModelBindingHandler implements KnockoutBindingHandler {
    public init(
        element: HTMLElement,
        valueAccessor: () => KnockoutObservable<IViewModelBindingOptions>,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        let options = ko.unwrap(valueAccessor());

        element.innerHTML = options.template;
        ko.applyBindingsToDescendants(options.viewModel, element);
        return { controlsDescendantBindings: true };
    }
}

class LoadingBindingHandler implements KnockoutBindingHandler {
    public init(
        element: HTMLElement,
        valueAccessor: () => Object,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {
        element.setAttribute("class", "adf-largeSpinner");

        $(element).html(Framework.Svg.progressRing);

        return { controlsDescendantBindings: false };
    }
}

// TODO Consider move these classes and interfaces to DataStudio layer if required by other modules.
interface IWinJSListViewViewModel {
    winJSList: WinJS.Binding.List<Object>;
    winJSListView: WinJS.UI.ListView<Object>;
}

export interface IWinJSListViewOptions {
    footer?: HTMLElement;
    onselectionchanged?: (event: CustomEvent) => void;
    onfootervisibilitychanged?: (event: CustomEvent) => void;
    selectionMode?: WinJS.UI.SelectionMode;
    tapBehavior?: WinJS.UI.TapBehavior;
    layout?: WinJS.UI.ListLayout | WinJS.UI.GridLayout;
    maxLeadingPages?: number;
    maxTrailingPages?: number;
    oniteminvoked?: (event: CustomEvent) => void;
    oncontentanimating?: (event: CustomEvent) => void;
};

export interface IWinJSListViewValueAccessor<T> {
    data: KnockoutObservableArray<T>;
    template: string;
    options?: IWinJSListViewOptions;
    onLoad?: () => void;
    // TODO paverma The logic because of which the double click callback is called with the item value is partly preset in the item template
    // like the one defined in ActivityRunsListViewModel. It needs to be moved out of there.
    onDoubleClick?: (item: T) => void;
    // The footer DOM node will be removed from its location and moved to inside the list's footer container.
    // A good way of ensuring that the knockout bindings have been applied on the footer is to create it before using the winjslist binding.
    // We search throught the parent elements to find the footer, since the footer will probably be a sibling.
    footerSelector?: string;
    customClasses?: KnockoutObservable<string>;
    resizeTrackingParentSelector?: string;
};

class WinJSListBindingHandler<T> implements KnockoutBindingHandler {
    /**
     * Wraps the WinJS ListView control in a knockout custom binding.
     */
    public init(
        element: HTMLElement,
        valueAccessor: () => IWinJSListViewValueAccessor<T>,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: IWinJSListViewViewModel,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        let value = valueAccessor();
        let data = value.data;
        let dataList = new WinJS.Binding.List(ko.unwrap(data));
        viewModel.winJSList = dataList;
        let jQueryElement = $(element);

        // update dataList if changes are made to the underlying ko observable array.
        // TODO: improve this merge, as in many cases selection and scroll position will be lost when list items are added/deleted.
        let dataSubscription: KnockoutSubscription<Object[]> = data.subscribe(() => {
            let newVals = data();

            for (let i = 0; i < newVals.length; i++) {
                if (dataList.getAt(i) !== newVals[i]) {
                    dataList.setAt(i, newVals[i]);
                }
            }

            dataList.splice(newVals.length, dataList.length - newVals.length);
        });

        if (value.footerSelector) {
            let parents = jQueryElement.parents(), footerElement: HTMLElement = null;
            let parentsLength = parents.length;
            for (let i = 0; i < parentsLength; i++) {
                footerElement = <HTMLElement>parents[i].querySelector(value.footerSelector);
                if (footerElement) {
                    break;
                }
            }
            value.options.footer = footerElement;
        }

        if (value.customClasses) {
            ko.applyBindingsToNode(element, {
                css: value.customClasses
            });
        }

        let listView = new WinJS.UI.ListView(element, value.options);
        jQueryElement.addClass("win-selectionstylefilled");     // a winjs class.

        viewModel.winJSListView = listView;
        listView.itemDataSource = dataList.dataSource;
        listView.itemTemplate = (itemPromise, recycled) => {
            return itemPromise.then(function(item) {
                let template: HTMLElement = $.parseHTML(value.template)[0];

                ko.applyBindings({ data: item.data, onDoubleClick: value.onDoubleClick || $.noop }, template);
                WinJS.Utilities.markDisposable(template, function() {
                    ko.cleanNode(template);
                });

                return template;
            });
        };

        // Reliable cross-browser resize event tracker from Viva.
        // The callback resets the width of the list items appropriately.
        let resizeTracker = null;
        if (value.resizeTrackingParentSelector) {
            let parents = jQueryElement.parents(value.resizeTrackingParentSelector);
            if (parents.length > 0) {
                resizeTracker = VivaResize.track($(parents[0]), () => {
                    listView.recalculateItemPosition();
                });
            }
        }

        if (value.onLoad) {
            value.onLoad();
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            listView.dispose();
            dataSubscription.dispose();
            if (resizeTracker) {
                resizeTracker.dispose();
            }
        });

        return { controlsDescendantBindings: true };
    }
}

export interface IWinJSToolbarValueAccessor {
    toolbar?: Framework.Toolbar.ToolbarViewModelBase;
    options?: {
        shownDisplayMode?: string;
    };
}

class WinJSToolbarBindingHandler implements KnockoutBindingHandler {
    /**
     * Wraps the WinJS Toolbar control in a knockout custom binding.
     */
    public init(
        element: HTMLElement,
        valueAccessor: () => IWinJSToolbarValueAccessor,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Framework.Toolbar.ToolbarViewModelBase,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        // Allow the user to also pass in a toolbar viewmodel instead.
        // Otherwise, we default to the viewModel.
        let toolbarViewModel: Framework.Toolbar.ToolbarViewModelBase = valueAccessor().toolbar ? valueAccessor().toolbar : viewModel;
        let toolbarWinControl = new WinJS.UI.ToolBar(element, valueAccessor().options);
        toolbarWinControl.data = toolbarViewModel._dataArray;

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            toolbarWinControl.dispose();
        });

        return { controlsDescendantBindings: true };
    }
}

// Copied over from Ibiza.
class GraphNodeContentBindingHandler implements KnockoutBindingHandler {
    private static getGraphNodeContext(bindingContext: KnockoutBindingContext): VivaGraphWidget.GraphNodeViewModel {
        let i: number,
            graphNodeViewModel: VivaGraphWidget.GraphNodeViewModel = null;

        // We need to get the selected state on the first parent graph node context.
        for (i = 0; i < bindingContext.$parents.length; i++) {
            if (bindingContext.$parents[i] instanceof VivaGraphWidget.GraphNodeViewModel) {
                graphNodeViewModel = bindingContext.$parents[i];
                break;
            }
        }

        if (!graphNodeViewModel) {
            logger.logError("The pcGraphNodeContent binding can only be used in the extension template of a graph node view model.");
        }

        return graphNodeViewModel;
    }

    public init(
        element: HTMLElement,
        valueAccessor: () => Object,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): void {
        let graphNodeViewModel: VivaGraphWidget.GraphNodeViewModel = GraphNodeContentBindingHandler.getGraphNodeContext(bindingContext),
            classList = VivaUtil.getClassList(element),
            styleSkin = ko.utils.unwrapObservable(graphNodeViewModel.styleSkin),
            styleSkinDefinition: VivaGraphSvgUtils.IGraphSkinDefinition = VivaGraphSvgUtils.GraphSkinsCollection[styleSkin];

        classList.add("azc-graph-node-content");
        classList.add(styleSkinDefinition.skinMonikerClass);
        styleSkinDefinition.nodeColorClasses.atRest.forEach((className: string) => {
            classList.add(className);
        });

        VivaUtil.setClassList(element, classList);
    }

    public update(
        element: HTMLElement,
        valueAccessor: () => Object,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): void {
        let graphNodeViewModel: VivaGraphWidget.GraphNodeViewModel = GraphNodeContentBindingHandler.getGraphNodeContext(bindingContext),
            classList = VivaUtil.getClassList(element),
            stateResolutionStrategy: VivaGraphSvgUtils.IStateCompatibilityStrategy = VivaGraphSvgUtils.StateCompatibilityStrategyDefinitions["combineHoveredAndSelected"],
            styleSkinToUse = ko.utils.unwrapObservable(graphNodeViewModel.styleSkin),
            styleSkinDefinitionToUse: VivaGraphSvgUtils.IGraphSkinDefinition = VivaGraphSvgUtils.GraphSkinsCollection[styleSkinToUse],
            selected: boolean = ko.utils.unwrapObservable(graphNodeViewModel.graphNode.selected),
            hovered: boolean = ko.utils.unwrapObservable(graphNodeViewModel.hovered),
            dragSource: boolean = ko.utils.unwrapObservable(graphNodeViewModel.newEdgeDraftSource),
            dragTarget: boolean = ko.utils.unwrapObservable(graphNodeViewModel.newEdgeDraftTarget),
            atRest = !hovered && !selected && !dragSource && !dragTarget,
            stateNameToValueMap: StringMap<boolean> = {
                "atRest": atRest,
                "hovered": hovered,
                "selected": selected,
                "dragSource": dragSource,
                "dragTarget": dragTarget
            },
            addClassesIf = (classesToAdd: string[], condition: boolean = true): boolean => {
                if (condition) {
                    classesToAdd.forEach((className: string) => {
                        classList.add(className);
                    });
                }

                return condition;
            },
            removeClassesIf = (classesToRemove: string[], condition: boolean = true): void => {
                if (condition) {
                    classesToRemove.forEach((className: string) => {
                        classList.remove(className);
                    });
                }
            },
            addRequiredClassesInOrder = (statesResolutionOrder: VivaGraphSvgUtils.IStateCompatibilityStrategy): void => {
                if (addClassesIf(styleSkinDefinitionToUse.nodeColorClasses[statesResolutionOrder.state], stateNameToValueMap[statesResolutionOrder.state])) {
                    if (statesResolutionOrder.compatible) {
                        statesResolutionOrder.compatible.forEach((stateName: string) => {
                            addClassesIf(styleSkinDefinitionToUse.nodeColorClasses[stateName], stateNameToValueMap[stateName]);
                        });
                    }
                } else if (statesResolutionOrder.disjunctive) {
                    addRequiredClassesInOrder(statesResolutionOrder.disjunctive);
                }
            };

        // Setting classes for currently selected skin:
        classList.add(styleSkinDefinitionToUse.skinMonikerClass);

        // At first, remove classes from not-applicable states
        // to have opportunity to set these classes if needed as part of applicable states.
        removeClassesIf(styleSkinDefinitionToUse.nodeColorClasses.atRest, !atRest);
        removeClassesIf(styleSkinDefinitionToUse.nodeColorClasses.selected, !selected);
        removeClassesIf(styleSkinDefinitionToUse.nodeColorClasses.hovered, !hovered);
        removeClassesIf(styleSkinDefinitionToUse.nodeColorClasses.dragSource, !dragSource);
        removeClassesIf(styleSkinDefinitionToUse.nodeColorClasses.dragTarget, !dragTarget);

        // Add classes in order defined by statest compatibility strategy.
        addRequiredClassesInOrder(stateResolutionStrategy);

        VivaUtil.setClassList(element, classList);
    }
}

// Copied over from Ibiza.
class ImageBindingHandler {
    public init() {
        return { controlsDescendantBindings: true };
    }

    public update(
        element: Element,
        /* tslint:disable:no-any */
        valueAccessor: () => any): void {
        /* tslint:enable:no-any */
        let $element = $(element),
            bindingValue = ko.utils.unwrapObservable(valueAccessor()),
            html: string = "";

        if (!bindingValue) {
            $element.html(html);
            return;
        }

        let imageData = bindingValue;
        let options = imageData && imageData.options;
        let title = options && options.title;
        let isLogo = options && options.isLogo;
        let ariaLabelledBy = "aria-labelledBy";
        let ariaLabelledById = "titleID";

        let data = bindingValue.data;
        if (!isLogo) {
            data = data.replace(/fill=\"[^\"]*\"|fill=\'[^\']*\'/ig, "");
        }

        if (!title) {
            // Remove empty title tags in svg.
            data = data.replace("<title></title>", "");

            // If a non-empty tag now exists, add aria info.
            // This scenario will only be reached by a a custom icon with a title defined.
            if (data.indexOf("<title>") > 0) {
                data = data.replace("<title>", "<title id=\"{0}\">".format(ariaLabelledById));
                data = data.replace("<svg ", "<svg {0}=\"{1}\" ".format(ariaLabelledBy, ariaLabelledById));
            }
        }

        $element.html(data);
        $element.children("svg").attr("focusable", 0);
    }
}

interface IKnockoutUtilsExtended extends KnockoutUtils {
    setTextContent(element: HTMLElement, text: string): void;
}

class TitleTextBindingHandler implements KnockoutBindingHandler {
    public init = (
        element: HTMLElement,
        valueAccessor: () => void,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Framework.Toolbar.ToolbarViewModelBase,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } => {

        /*
        // TODO iannight: the tracker seems to mess up the WinJS table layout.
        // I'll have to put this on hold for now until we can find a better solution.

        // check for overflow
        let resizeTracker = VivaResize.track($(element.parentElement), () => {
            if (element["data-alt"] !== element["data-text"]) {
                this.fixResize(element);
                this.updateTitle(element);
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            if (resizeTracker) {
                //resizeTracker.dispose();
            }
        });
        */

        return { controlsDescendantBindings: true };
    };

    public update = (
        element: HTMLElement,
        valueAccessor: () => { text: string, alt?: string } | string): void => {
        let value = ko.unwrap(valueAccessor());

        let text: string, alt: string = "";

        if (value instanceof Object) {
            text = (<{ text: string }>value).text;

            // if we were given a different alt value
            if ((<{ alt?: string }>value).alt) {
                alt = (<{ alt?: string }>value).alt;
                // this.fixResize(element);
            } else {
                alt = text;
            }
        } else {
            text = <string>value;
            alt = text;
        }

        element["data-alt"] = alt;
        element["data-title"] = alt;
        element["data-text"] = text;

        this.updateTitle(element);
        (<IKnockoutUtilsExtended>ko.utils).setTextContent(element, element["data-text"]);
    };

    public fixResize(element: HTMLElement) {
        if (element.offsetHeight < element.scrollHeight ||
            element.offsetWidth < element.scrollWidth) {
            element["data-title"] = element["data-text"] + ", " + element["data-alt"];
        } else {
            element["data-title"] = element["data-alt"];
        }
    }

    public updateTitle(element: HTMLElement) {
        ko.bindingHandlers["attr"].update(element, () => { return { title: element["data-title"] }; });
    }
}

export class ReadonlyBindingHandler implements KnockoutBindingHandler {
    public init = (
        element: HTMLElement,
        valueAccessor: () => void,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Framework.Toolbar.ToolbarViewModelBase,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } => {

        return { controlsDescendantBindings: false };
    };

    public update = (
        element: HTMLElement,
        valueAccessor: () => boolean): void => {
        let value = ko.unwrap(valueAccessor());

        (<HTMLInputElement>element).readOnly = value;
    };
}

export class IndeterminateBindingHandler implements KnockoutBindingHandler {
    public init = (element: HTMLElement,
        valueAccessor: () => boolean,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: () => void,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } => {

        return { controlsDescendantBindings: false };
    };

    public update = (element: HTMLInputElement,
        valueAccessor: () => boolean): void => {
        let value = ko.utils.unwrapObservable(valueAccessor());
        element.indeterminate = value;
    };
}

export interface IHtmlWithBindingHandler {
    template: string;
    viewModel?: Object;
}

export class HtmlWithBindingHandler implements KnockoutBindingHandler {
    public static className = "htmlWith";
    public init = (element: HTMLElement,
        valueAccessor: () => IHtmlWithBindingHandler,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        vm?: () => void,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } => {

        let {template, viewModel} = valueAccessor();
        element.innerHTML = template;
        ko.applyBindingsToDescendants(viewModel || vm, element);

        return { controlsDescendantBindings: true };
    };
}

/* tslint:disable:no-string-literal */
export class Bootstrapper {
    public static initialize() {
        ko.bindingHandlers["indeterminate"] = new IndeterminateBindingHandler();
        ko.bindingHandlers["readonly"] = new ReadonlyBindingHandler;
        ko.bindingHandlers["loading"] = new LoadingBindingHandler();
        ko.bindingHandlers["winjslist"] = new WinJSListBindingHandler();
        ko.bindingHandlers["winjsbutton"] = new WinJSButtonKnockoutBinding.WinJSButtonBindingHandler();
        ko.bindingHandlers["winjstoolbar"] = new WinJSToolbarBindingHandler();
        ko.bindingHandlers["pcGraphNodeContent"] = new GraphNodeContentBindingHandler();
        ko.bindingHandlers["image"] = new ImageBindingHandler();
        ko.bindingHandlers["titleText"] = new TitleTextBindingHandler();
        ko.bindingHandlers["viewModel"] = new ViewModelBindingHandler();
        ko.bindingHandlers[Wizard.WizardBindingHandler.bindingName] = new Wizard.WizardBindingHandler();
        ko.bindingHandlers[FilterFlyoutKnockoutBinding.FilterFlyoutKnockoutBinding.className] = new FilterFlyoutKnockoutBinding.FilterFlyoutKnockoutBinding();
        ko.bindingHandlers[StatusCalendarFlyoutKnockoutBinding.GraphNodeStatusBindingHandler.className] = new StatusCalendarFlyoutKnockoutBinding.GraphNodeStatusBindingHandler();
        ko.bindingHandlers[StatusCalendarKnockoutBinding.StatusCalendarKnockoutBinding.className] = new StatusCalendarKnockoutBinding.StatusCalendarKnockoutBinding();
        ko.bindingHandlers[StatusCalendarKnockoutBinding.StatusBoxKnockoutBinding.className] = new StatusCalendarKnockoutBinding.StatusBoxKnockoutBinding();
        ko.bindingHandlers[LoadingBinding.LoadingBindingHandler.className] = new LoadingBinding.LoadingBindingHandler();
        ko.bindingHandlers[TelemetryKnockoutBinding.TelemetryKnockoutBindingHandler.className] = new TelemetryKnockoutBinding.TelemetryKnockoutBindingHandler();
        ko.bindingHandlers[JQueryUIBindings.DatetimeRangeBindingHandler.className] = new JQueryUIBindings.DatetimeRangeBindingHandler();
        ko.bindingHandlers[CopyBinding.CopyBindingHandler.className] = new CopyBinding.CopyBindingHandler();
        ko.bindingHandlers[BreadcrumbsBinding.BreadcrumbKnockoutBinding.className] = new BreadcrumbsBinding.BreadcrumbKnockoutBinding();
        ko.bindingHandlers[CalloutBinding.CalloutKnockoutBinding.className] = new CalloutBinding.CalloutKnockoutBinding();
        ko.bindingHandlers[PivotKnockoutBinding.className] = new PivotKnockoutBinding();
        ko.bindingHandlers[WinJSKnockoutBindings.WinJSPivotKnockoutBinding.className] = new WinJSKnockoutBindings.WinJSPivotKnockoutBinding();
        ko.bindingHandlers[CollapsibleBindings.CollapsibleKnockoutBinding.className] = new CollapsibleBindings.CollapsibleKnockoutBinding();
        ko.bindingHandlers[HtmlWithBindingHandler.className] = new HtmlWithBindingHandler();
        ko.bindingHandlers[ParameterGroupsBinding.className] = new ParameterGroupsBinding();
    }
}
