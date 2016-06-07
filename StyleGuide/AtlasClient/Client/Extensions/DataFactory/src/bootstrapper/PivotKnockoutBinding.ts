/// <amd-dependency path="css!./CSS/Pivot.css" />
/// <amd-dependency path="text!./Templates/PivotTemplate.html" />

export interface IPivotItem {
    header: string;
    viewModel: Object;
    template: string;
}

interface IDisplayPivotItem extends IPivotItem {
    selected: KnockoutObservable<boolean>;
}

export interface IPivotValueAccessor {
    pivotItems: IPivotItem[];
    initialSelection?: number;
}

class PivotViewModel {
    public displayPivotItems: IDisplayPivotItem[];
    public existingSelection: KnockoutObservable<IDisplayPivotItem>;

    constructor(pivotItems: IPivotItem[], initialSelection: number) {
        this.displayPivotItems = pivotItems.map((pivotItem: IPivotItem, index: number) => {
            return {
                header: pivotItem.header,
                viewModel: pivotItem.viewModel,
                template: pivotItem.template,
                selected: ko.observable(index === initialSelection ? true : false)
            };
        });
        this.existingSelection = ko.observable(this.displayPivotItems[initialSelection]);
    }
}

export class PivotKnockoutBinding implements KnockoutBindingHandler {
    public static className = "pivot";
    // TODO tilarden: [accessibility] Add tabIndex="i" attributes to pivot headers in the HTML template.
    public static template: string = require("text!./Templates/PivotTemplate.html");

    public handlePivotItemSelection: (selectedItem: IDisplayPivotItem) => void;

    public init(
        element: HTMLElement,
        valueAccessor: () => IPivotValueAccessor,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        let initialSelection = valueAccessor().initialSelection ? valueAccessor().initialSelection : 0;
        let pivotViewModel = new PivotViewModel(valueAccessor().pivotItems, initialSelection);

        this.handlePivotItemSelection = (selectedItem: IDisplayPivotItem): void => {
            if (selectedItem !== pivotViewModel.existingSelection()) {
                pivotViewModel.existingSelection().selected(false);
                selectedItem.selected(true);
                pivotViewModel.existingSelection(selectedItem);
            }
        };

        element.innerHTML = PivotKnockoutBinding.template;
        ko.applyBindingsToDescendants(pivotViewModel, element);
        return { controlsDescendantBindings: true };
    }
}
