/// <amd-dependency path="text!./Templates/Breadcrumbs.html" name="template"/>
import Framework = require("../_generated/Framework");
declare let template: string;

export class BreadcrumbKnockoutBinding implements KnockoutBindingHandler {
    static className: string = "breadcrumbs";

    public init(
        element: HTMLElement,
        valueAccessor: () => KnockoutObservable<Framework.Breadcrumbs.Breadcrumbs>,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        element.innerHTML = template;
        ko.applyBindingsToDescendants(valueAccessor(), element);
        return { controlsDescendantBindings: true };
    }
}
