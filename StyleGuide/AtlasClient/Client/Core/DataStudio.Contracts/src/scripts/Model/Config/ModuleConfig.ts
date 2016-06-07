/// <reference path="../../references.ts" />

module Microsoft.DataStudio.Model.Config {

    export interface ModuleConfig {
        name: string;
        text?: string;
        symbol?: string;
        url?: string;
        isMenuItem?: boolean;
        defaultViewName: string;
        sidePanel?: SidePanel;
        globalLeftPanel?: Microsoft.DataStudio.Model.Config.ElementConfig[];
        moduleLeftPanel?: Microsoft.DataStudio.Model.Config.ElementConfig[];
        views: ViewConfig[];
    }

    export interface ModuleConfigProxy {
        name: KnockoutObservable<string>;
        text?: KnockoutObservable<string>;
        symbol?: KnockoutObservable<string>;
        url?: KnockoutObservable<string>;
        isMenuItem?: KnockoutObservable<boolean>;
        defaultViewName: KnockoutObservable<string>;
        sidePanel?: SidePanelProxy;
        globalLeftPanel?: KnockoutObservableArray<ShellElementConfigProxy>;
        moduleLeftPanel?: KnockoutObservableArray<ShellElementConfigProxy>;
        views: KnockoutObservableArray<ViewConfigProxy>;
    }

    export interface SidePanel {
        top?: ElementConfig[];
        bottom?: ElementConfig[];
        cssClass?: string;
    }

    export interface SidePanelProxy {
        top?: KnockoutObservableArray<ShellElementConfigProxy>;
        bottom?: KnockoutObservableArray<ShellElementConfigProxy>;
        cssClass?: KnockoutObservable<string>;
    }

    export interface ViewConfig {
        name: string;
        leftPanel?: ElementConfig[];
        componentName?: string;
        commandBarComponentName?: string;
        rightPanel?: ElementConfig[];
        isFullScreen?: boolean;
        drawerPanel?: ElementConfig[];
    }

    export interface ViewConfigProxy {
        name: KnockoutObservable<string>;
        leftPanel?: KnockoutObservableArray<ShellElementConfigProxy>;
        commandBarComponentName?: KnockoutObservable<string>;
        componentName?: KnockoutObservable<string>;
        rightPanel?: KnockoutObservableArray<ShellElementConfigProxy>;
        isFullScreen?: KnockoutObservable<boolean>;
        drawerPanel?: KnockoutObservableArray<ShellElementConfigProxy>;
    }

    export interface ElementConfig {
        icon?: string;
        iconResource?: string;
        text?: string;
        componentName: string;
        isDefault?: boolean;
        callback?: () => any;
    }

    export interface ShellElementConfigProxy {
        icon?: KnockoutObservable<string>;
        text?: KnockoutObservable<string>;
        componentName: KnockoutObservable<string>;
        isDefault?: KnockoutObservable<boolean>;
        callback?: () => any;
    }
}
