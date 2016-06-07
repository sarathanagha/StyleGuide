module Microsoft.DataStudio.Crystal.Knockout {
    export class BindingHandler {
        public static initialize() {
            ko.bindingHandlers[FadeVisibleBindingHandler.BindingName] = new FadeVisibleBindingHandler();
            ko.bindingHandlers[SlideVisibleBindingHandler.BindingName] = new SlideVisibleBindingHandler();
            ko.bindingHandlers[ToastBindingHandler.BindingName] = new ToastBindingHandler();
        }
    }
}