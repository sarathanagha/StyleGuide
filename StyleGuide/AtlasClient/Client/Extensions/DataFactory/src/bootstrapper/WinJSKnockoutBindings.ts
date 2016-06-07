import Framework = require("../_generated/Framework");

export interface IWinJSPivotValueAccessor {
    options?: {
        onselectionchanged?: (event: CustomEvent) => void;
        onitemanimationstart?: (event: CustomEvent) => void;
        onitemanimationend?: (event: CustomEvent) => void;
    };
    pivotItems: {
        options: Object;
        viewModel?: Object;
        template: string;
    }[];
}

export class WinJSPivotKnockoutBinding implements KnockoutBindingHandler {
    public static className = "WinJSPivot";

    public init(
        element: HTMLElement,
        valueAccessor: () => IWinJSPivotValueAccessor,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        let value = valueAccessor();
        let lifetimeManager = new Framework.Disposable.DisposableLifetimeManager();

        // Process the child bindings first, becase WinJS Pivot expects its children to be PivotItem.
        if (value.pivotItems) {
            value.pivotItems.forEach((pivotItem) => {
                let pivotItemNode = document.createElement("div");
                pivotItemNode.innerHTML = pivotItem.template;
                element.appendChild(pivotItemNode);
                let pivotItemControl = new WinJS.UI.PivotItem(pivotItemNode, pivotItem.options);
                lifetimeManager.registerForDispose(pivotItemControl);

                if (pivotItem.viewModel) {
                    ko.applyBindings(pivotItem.viewModel, pivotItemNode);
                    if (pivotItem.viewModel["dispose"]) {
                        lifetimeManager.registerForDispose(<Framework.Disposable.IDisposable>pivotItem.viewModel);
                    }
                }
            });
        }

        let winControl = new WinJS.UI.Pivot(element, valueAccessor().options);
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            winControl.dispose();
            lifetimeManager.dispose();
        });
        return { controlsDescendantBindings: true };
    }
}
