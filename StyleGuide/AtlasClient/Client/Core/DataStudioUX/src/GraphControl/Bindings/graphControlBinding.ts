/// <reference path="../../references.d.ts" />

import VivaGraphWidget = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/GraphWidget");
import VivaUtil = require("VivaGraphControl/Content/Scripts/Viva.Controls/Util/Util");
import VivaResize = require("VivaGraphControl/Content/Scripts/Viva.Controls/Util/Resize");
import VivaGraphSvgUtils = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/SvgUtils");
import VivaGraphDisposable = require("VivaGraphControl/Content/Scripts/Viva.Controls/Base/Base.Disposable");
import VivaGraphPromise = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Base/Promise");
import VivaGraphImage = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Base/Image");
import VivaGraphGeometry = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/Geometry");
import VivaGraphLifetimeManager = require("VivaGraphControl/Content/Scripts/Viva.Controls/Base/Base.TriggerableLifetimeManager");
import VivaGraphViewModel = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/GraphViewModel");
import VivaGraphEntityViewModel = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/GraphEntityViewModel");

module Microsoft.DataStudio.Application.Knockout.Bindings {

    export class GraphControlBindingHandler implements KnockoutBindingHandler {    
        public init(element: HTMLElement, valueAccessor: () => any): void | { controlsDescendantBindings: boolean; } {
            var options = valueAccessor() || {};
            
            var widget = new VivaGraphWidget.Widget($(element), options);

            return { controlsDescendantBindings: true };
        }
    }
    
    // Copied over from Ibiza.
    export class GraphNodeContentBindingHandler implements KnockoutBindingHandler {
        public init(element: any,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): void {
            var graphNodeViewModel: VivaGraphWidget.GraphNodeViewModel = GraphNodeContentBindingHandler.getGraphNodeContext(bindingContext),
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
            element: any,
            valueAccessor: () => any,
            allBindingsAccessor?: KnockoutAllBindingsAccessor,
            viewModel?: any,
            bindingContext?: KnockoutBindingContext): void {
            var graphNodeViewModel: VivaGraphWidget.GraphNodeViewModel = GraphNodeContentBindingHandler.getGraphNodeContext(bindingContext),
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
    
        private static getGraphNodeContext(bindingContext: KnockoutBindingContext): VivaGraphWidget.GraphNodeViewModel {
            var i: number,
                graphNodeViewModel: VivaGraphWidget.GraphNodeViewModel = null;
    
            // We need to get the selected state on the first parent graph node context.
            for (i = 0; i < bindingContext.$parents.length; i++) {
                if (bindingContext.$parents[i] instanceof VivaGraphWidget.GraphNodeViewModel) {
                    graphNodeViewModel = bindingContext.$parents[i];
                    break;
                }
            }
    
            if (!graphNodeViewModel) {
                console.log("The pcGraphNodeContent binding can only be used in the extension template of a graph node view model.");
            }
    
            return graphNodeViewModel;
        }
    }
    
    ko.bindingHandlers["graphControl"] = new GraphControlBindingHandler();
    ko.bindingHandlers["graphNode"] = new GraphNodeContentBindingHandler();
}
