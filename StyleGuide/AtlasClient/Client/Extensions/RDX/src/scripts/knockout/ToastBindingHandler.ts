module Microsoft.DataStudio.Crystal.Knockout {
    export class ToastBindingHandler implements KnockoutBindingHandler {
        public static BindingName: string = "toast";
        public init = (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        }
        public update(element, valueAccessor, allBindings) {
            var value = valueAccessor();
            if (value) {
                $(element).css({ display: 'block' });
                $(element).animate({ right: '0px' , opacity: 1}, 800);
                setTimeout(() => {
                    $(element).animate({ right: '-320px', opacity: 0 }, 800, () => { $(element).css({ display: 'none' }); });
                }, 5000);
            }
            else {
                $(element).animate({ right: '-320px', opacity: 0 }, 800, () => { $(element).css({ display: 'none' }); });
            }
        }
    }
}