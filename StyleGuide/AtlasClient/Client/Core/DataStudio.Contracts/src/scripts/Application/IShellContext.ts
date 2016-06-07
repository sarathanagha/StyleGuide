/// <reference path="../references.ts" />

module Microsoft.DataStudio.Application {
    export var ShellContext: IShellContextStatic;

    export interface IShellContextStatic {
        CurrentRoute: KnockoutObservable<IRouteEntry>;
        CurrentModuleContext: KnockoutComputed<Microsoft.DataStudio.UxShell.ModuleContext>;
        CurrentModuleViewConfig: KnockoutComputed<Microsoft.DataStudio.Model.Config.ViewConfigProxy>;
        GlobalLeftPanelElements: KnockoutObservableArray<Microsoft.DataStudio.Model.Config.ShellElementConfigProxy>;
        AuthModuleConfig: KnockoutObservable<IAdalConfigEntry>;
        LeftPanelIsExpanded: KnockoutObservable<boolean>;
        RightPanelIsExpanded: KnockoutObservable<boolean>;
        initialize(config: Microsoft.DataStudio.Model.Config.ShellConfig): void;
        globalSubscriptions: KnockoutSubscribable<any>;
        ShellName: string;
    }

    export interface IShellV2ContextStatic extends IShellContextStatic {
        deploy: () => Q.Promise<any>;
        registerDeployCallback: (callback: () => Q.Promise<any>) => void;
    }

    export interface IAdalConfigEntry {
        tenant: string;
        instance: string;
        clientId: string;
        postLogoutRedirectUri: string;
        cacheLocation: string;
    }
}
