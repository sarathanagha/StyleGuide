module Microsoft.DataStudio.Crystal.Knockout {
    export class SlideVisibleBindingHandler implements KnockoutBindingHandler {
        public static BindingName:string = "slideVisible";
        public init = (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        }
        public update (element, valueAccessor, allBindings) {
            var value = valueAccessor();
            var valueUnwrapped = ko.unwrap(value);

            if (typeof valueUnwrapped == 'boolean') {
                valueUnwrapped = { visible: valueUnwrapped, visibleThen: () => { }, hiddenThen: () => { } };
            }
            if (!valueUnwrapped.visibleThen)
                valueUnwrapped.visibleThen = () => { };
            if (!valueUnwrapped.hiddenThen)
                valueUnwrapped.hiddenThen = () => { };

            if (valueUnwrapped.visible == true)
                $(element).slideDown(400, valueUnwrapped.visibleThen);
            else {
                valueUnwrapped.hiddenThen();
                $(element).slideUp(400);
            }
        }
    }
}