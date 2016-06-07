/// <reference path="../references.d.ts" />
/// <amd-dependency path="text!./commonHeader.html" />

export var template: string = require("text!./commonHeader.html");

interface WorkspaceDefinition
{
    workspaceName: string;
    workspaceIconSymbol: string;
    navigationUrl: string;
    //TODO: This should be a part of internal shell implementation.
    moduleName: string;
}

import Controls = Microsoft.DataStudio.Application.Knockout.Components;
import Resx = Microsoft.DataStudio.Application.Resx;

export class viewModel
{
    menu: Controls.IMenu;
    menuItems: KnockoutObservable<Controls.IMenuItem[]>;
    activeWorkspace: KnockoutObservable<Controls.IMenuItem>;
    userOptions: WorkspaceDefinition[];
    public resx = Resx;
    private loginStatusMenuText: string;
    private loginStatusUrl: string;

    constructor(params: any)
    {
        var userName = Microsoft.DataStudio.Managers.AuthenticationManager.instance.getCurrentUser().name;
        this.loginStatusMenuText = userName == this.resx.guest ? this.resx.signIn : this.resx.signOut;
        this.loginStatusUrl = userName == this.resx.guest ? this.resx.blueprint + "/" + this.resx.signIn : "";

        this.menuItems = ko.observableArray(this.getMenuItems());

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

        this.activeWorkspace = ko.computed(() =>
        {
            //TODO: This should be a part of internal shell implementation.
            var moduleConfig = Microsoft.DataStudio.Application.ShellContext.CurrentModuleContext().moduleConfig();
            if (moduleConfig.name) {
                var moduleName = moduleConfig.name();
                for (var i = 0; i < this.menuItems().length; i++)
                {
                    if (this.menuItems()[i].activeMenuMatchKey == moduleName)
                    {
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

    private getMenuItems(): Controls.IMenuItem[]{
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
    public getaccesstoken(): void
    {
        //console.log(Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken());
    }

    public login(): void
    {
        Microsoft.DataStudio.Managers.AuthenticationManager.instance.login();
    }

    public logout(): void
    {
       Microsoft.DataStudio.Managers.AuthenticationManager.instance.logout();
    }

    public menuItemAction(menuitem: Controls.IMenuItem): void
    {
        Microsoft.DataStudio.Application.Router.navigate(menuitem.navigationUrl);
    }

    public navigateWorkspace(workspace: WorkspaceDefinition): void
    {
        this.navigateUrl(workspace.navigationUrl);
    }

    public navigateUrl(url: string): void
    {
        Microsoft.DataStudio.Application.Router.navigate(url);
    }
}
