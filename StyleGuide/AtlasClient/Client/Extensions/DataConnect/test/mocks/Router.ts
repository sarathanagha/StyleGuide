/// <reference path="../references.d.ts" />

module Microsoft.DataStudio.Application {
    export class RouterImpl {
        public static currentRoute: KnockoutObservable<IRouteEntry> = ko.observable(<IRouteEntry>{}).extend({ throttle: 1 });
        public static currentModule: KnockoutObservable<string> = ko.observable(null).extend({ throttle: 1 });
        public static currentView: KnockoutObservable<string> = ko.observable(null).extend({ throttle: 1 });
        public static currentArguments: KnockoutObservable<string> = ko.observable(null).extend({ throttle: 1 });

        public static initialize(config: Microsoft.DataStudio.Model.Config.ShellConfig): void {
            var defaultModule: string = config.defaultModuleName;

            var allRoutes: IRouteSegmentDefinition[] = [
                { url: "?:module:/:view:/:arguments*:" },
                { url: ":module:/:view:/:arguments*:" }
            ];

            // Register routes with crossroads.js
            allRoutes.forEach((route: IRouteSegmentDefinition): void => {
                crossroads.addRoute(route.url, (module: string, view: string, args: string): void => {

                    var requestParams: IRouteEntry = {
                        module: module, view: view, arguments: args, url: document.location.pathname + document.location.search
                    };

                    if (!requestParams.module || requestParams.module.indexOf("id_token") === 0) {
                        requestParams.module = defaultModule; /* extract this to some settings file */
                    }

                    if (!requestParams.view) {
                        requestParams.view = ModuleCatalog.getModule("datastudio-" + requestParams.module)
                            .moduleContext.moduleConfig().defaultViewName();
                    }

                    Router.currentModule(requestParams.module);
                    Router.currentView(requestParams.view);
                    Router.currentArguments(requestParams.arguments);

                    Router.currentRoute(requestParams);
                });
            });

            // Parse landing route
            crossroads.parse(document.location.pathname + document.location.search);

            Historyjs.Adapter.bind(window, "statechange",() => {
                crossroads.parse(document.location.pathname + document.location.search);
            })

            $("body").on("click","a", RouterImpl.onAnchorNavigated);
        }

        public static navigate(url: string, data?: string, title?: string): void {

            if (url.indexOf('?')!==0) {
                url = "?".concat(url);
            }

            Historyjs.pushState(data, title, url);
        }

        private static onAnchorNavigated(e: Event): boolean {
            var urlPath: string = $(this).attr("href");

            if (!urlPath || urlPath === "" || urlPath.indexOf("#") === 0 || /^http(s?):\/\//.test(urlPath)) { // probably some js function we don't want to mess with or an external link
                return true;
            }

            e.preventDefault();
            e.stopPropagation();
            
            Router.navigate(urlPath);
        }
    }

    Router = RouterImpl;
}
