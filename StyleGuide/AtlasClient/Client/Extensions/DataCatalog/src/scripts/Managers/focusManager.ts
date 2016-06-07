module Microsoft.DataStudio.DataCatalog.Managers {
    export class FocusManager {
        public static selected = ko.observable<string>(null);

        public static setContainerInteractive(selected: string) {
            var focused = $(":focus");
            FocusManager.selected(selected);
            focused.find("[tabindex='0']").first().focus();
        }

        public static resetContianer() {
            var focused = $(":focus");
            FocusManager.selected(null);
            focused.closest("[tabindex='0']").first().focus();
        }
    }

} 