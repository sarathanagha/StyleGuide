module Microsoft.DataStudio.Crystal.Knockout {
    export class FadeVisibleBindingHandler implements KnockoutBindingHandler {
        public static BindingName: string = "fadeVisible";
        public init = (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        }
        public update(element, valueAccessor, allBindings) {
            var value = valueAccessor();
            var valueUnwrapped = ko.unwrap(value);
            if (valueUnwrapped)
                $(element).css('opacity', 1);
            else {
                $(element).css('opacity', 0);
            }
        }
    }
}