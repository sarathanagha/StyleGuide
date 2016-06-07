module Microsoft.DataStudio.UxShell {

    export class ModuleContextImpl implements ModuleContext {

        public moduleConfig: KnockoutObservable<Model.Config.ModuleConfigProxy> = ko.observable(<any>{});
        public mainInputValue: KnockoutObservable<string> = ko.observable(null);
        public mainActionButtons: KnockoutObservableArray<any> = ko.observableArray([]);

        private _moduleInstance: Microsoft.DataStudio.Modules.DataStudioModule;

        constructor(moduleInstance: Microsoft.DataStudio.Modules.DataStudioModule) {
            this._moduleInstance = moduleInstance;
        }
    }
}