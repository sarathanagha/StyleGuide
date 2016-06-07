/// <reference path="../references.d.ts" />
/// <amd-dependency path="text!./authoringHeader.html" />
/// <amd-dependency path="css!./authoringHeader.css" />

export var template: string = require("text!./authoringHeader.html");

interface WorkspaceDefinition {
    workspaceName: string;
    workspaceIconSymbol: string;
    navigationUrl: string;
    //TODO: This should be a part of internal shell implementation.
    moduleName: string;
}

import Controls = Microsoft.DataStudio.Application.Knockout.Components;
import Resx = Microsoft.DataStudio.Application.Resx;

export interface ITab {
    name: string;
    module?: string;
    view?: string;
}

export class viewModel {
    public resx = Resx;
    public tabs: KnockoutObservableArray<ITab> = ko.observableArray(<ITab[]>[]);
    public activeTab: KnockoutObservable<ITab> = ko.observable(null);
    public deployText: KnockoutObservable<string> = ko.observable<string>(this.resx.deploy);
    private deploying: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    private dots: KnockoutObservable<number> = ko.observable<number>(1);
    

    menu: Controls.IMenu;
    menuItems: KnockoutObservable<Controls.IMenuItem[]>;
    activeWorkspace: KnockoutObservable<Controls.IMenuItem>;
    userOptions: WorkspaceDefinition[];
    private loginStatusMenuText: string;
    private loginStatusUrl: string;

    public tabClicked = (tab: ITab) => {
        if (!tab.module && !tab.view) return;

        this.activeTab(tab);

        Microsoft.DataStudio.Application.Router.navigate(tab.module + (tab.view ? '/' + tab.view : ''));
        return false; // return false to prevent default
    }

    constructor(params: any) {
        var userName = Microsoft.DataStudio.Managers.AuthenticationManager.instance.getCurrentUser().name;
        this.loginStatusMenuText = userName == this.resx.guest ? this.resx.signIn : this.resx.signOut;
        this.loginStatusUrl = userName == this.resx.guest ? this.resx.blueprint + "/" + this.resx.signIn : "";

        this.menuItems = ko.observableArray(this.getMenuItems());

        //this.tabs([{ name: "Home" }, { name: "Find + Explore" }, { name: "Transform + Cleanse" }, { name: "Experiment + Play" }, { name: "Build + Deploy", view: "build_and_deploy" }, { name: "Manage + Monitor" }]);
        this.tabs([{ name: this.resx.data, module: "datacatalog", view: "home" }, { name: this.resx.projects, module: "studio", view: "build_and_deploy" }, { name: this.resx.resources }]);
        // set the active tab if the current view is selected
        var currModule: string = Microsoft.DataStudio.Application.Router.currentModule();
        var currView = Microsoft.DataStudio.Application.Router.currentView();
        this.tabs().some((tab) => {
            if (tab.module && tab.module === currModule) {
                this.activeTab(tab);
                return true;
            }

            return false;
        });
        
        this.userOptions = [
            {
                workspaceName: "Profile",
                workspaceIconSymbol: "",
                navigationUrl: "",
                moduleName: "",
            },
            {
                workspaceName: this.loginStatusMenuText,
                workspaceIconSymbol: "",
                navigationUrl: this.loginStatusUrl,
                moduleName: "",
            }
        ];

        this.activeWorkspace = ko.computed(() => {
            //TODO: This should be a part of internal shell implementation.
            var moduleConfig = Microsoft.DataStudio.Application.ShellContext.CurrentModuleContext().moduleConfig();
            if (moduleConfig.name) {
                var moduleName = moduleConfig.name();
                for (var i = 0; i < this.menuItems().length; i++) {
                    if (this.menuItems()[i].activeMenuMatchKey == moduleName) {
                        return this.menuItems()[i];
                    }
                }
            }

            return null;
        });

        this.menu = {
            menuItems: this.menuItems,
            activeMenuItem: this.activeWorkspace,
            action: null
        };
    }

    private menuItemComparator(first: Controls.IMenuItem, second: Controls.IMenuItem): number {
        if (first.text === second.text) return 0;
        return (first.text < second.text) ? -1 : 1;
    }

    private getMenuItems(): Controls.IMenuItem[] {
        var modules: Microsoft.DataStudio.Modules.DataStudioModule[] = ModuleCatalog.getModules();
        var menuItems: Controls.IMenuItem[] = [];

        for (var i = 0; i < modules.length; i++) {
            var context: Microsoft.DataStudio.Model.Config.ModuleConfigProxy = modules[i].moduleContext.moduleConfig();
            if (context && (!ko.isObservable(context.isMenuItem) || context.isMenuItem())) {
                menuItems.push({
                    text: context.text(),
                    iconSymbol: (context.symbol && ko.isObservable(context.symbol)) ? context.symbol() : "\ue609",
                    navigationUrl: (context.url && ko.isObservable(context.url)) ? context.url() : context.name(),
                    activeMenuMatchKey: context.name(),
                    action: this.menuItemAction
                });
            }
        }

        menuItems.sort(this.menuItemComparator);

        // Push gallery after sort to maintain position in list
        /*
        menuItems.push({
            //TODO: Should be a Windows logo
            text: "Gallery",
            iconSymbol: "\ue60f",
            navigationUrl: "",
            activeMenuMatchKey: "moduleless-stub",
            action: this.menuItemAction
        });
        */
        return menuItems;
    }

    /// this function is kept as a place holder - will be removed
    public getaccesstoken(): void {
        console.log(Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken());
    }

    public login(): void {
        Microsoft.DataStudio.Managers.AuthenticationManager.instance.login();
    }

    public logout(): void {
        Microsoft.DataStudio.Managers.AuthenticationManager.instance.logout();
    }

    public menuItemAction(menuitem: Controls.IMenuItem): void {
        Microsoft.DataStudio.Application.Router.navigate(menuitem.navigationUrl);
    }

    public navigateWorkspace(workspace: WorkspaceDefinition): void {
        this.navigateUrl(workspace.navigationUrl);
    }

    public navigateUrl(url: string): void {
        Microsoft.DataStudio.Application.Router.navigate(url);
    }

    public deploy = () => {
        this.deploying(true);

        let addDots = () => {
            if (this.deploying()) {
                setTimeout(() => {
                    let text = this.resx.deploying;
                    for (var i = 0; i < this.dots(); i++) {
                        text += ".";
                    }
                    this.deployText(text);
                    this.dots((this.dots()) % 5 + 1);
                    addDots();
                }, 1000);
            } else {
                this.deployText(this.resx.deploy);
            }
        };

        (<Microsoft.DataStudio.Application.IShellV2ContextStatic>Microsoft.DataStudio.Application.ShellContext).deploy().then((success) => {
            this.deploying(false);
            console.log(success);
        }, (error) => {
            this.deploying(false);
            console.log(error);
        });

        addDots();
    }
}
