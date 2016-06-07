/// <reference path="../references.ts" />

module Microsoft.DataStudio.Application {
    export var Router: IRouterStatic;

    export interface IRouterStatic {
        currentRoute: KnockoutObservable<IRouteEntry>;
        currentModule: KnockoutObservable<string>;
        currentView: KnockoutObservable<string>;
        currentArguments: KnockoutObservable<string>;
        currentViewSubscriptions: KnockoutObservable<any>;
        currentQuery: KnockoutObservable<string>;
        initialize(config: Microsoft.DataStudio.Model.Config.ShellConfig): void;
        registerViewSubscription(name: string, observable: KnockoutObservable<any>, subscriptionFunc: any): void;
        emptyViewSubscriptions(): void;
        navigate(url: string): void;
    }

    export interface IRouteSegmentDefinition {
        url: string;
    }

    export interface IRouteEntry {
        module: string;
        view: string;
        arguments: string;
        url: string;
        query: string;
    }

}
