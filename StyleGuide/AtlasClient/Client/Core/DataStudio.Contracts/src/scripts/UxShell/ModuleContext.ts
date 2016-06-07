module Microsoft.DataStudio.UxShell {

    export interface ModuleContext {

        moduleConfig: KnockoutObservable<Model.Config.ModuleConfigProxy>;
        mainInputValue: KnockoutObservable<string>;
        mainActionButtons: KnockoutObservableArray<any>;
    }
}