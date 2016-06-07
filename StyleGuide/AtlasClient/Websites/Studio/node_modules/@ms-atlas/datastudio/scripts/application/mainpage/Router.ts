/// <reference path="references.ts" />
ko = require("knockout");
module Microsoft.DataStudio.Application {
    export type IRoute = RegExp | string

    export class RouterImpl {
        public static currentRoute: KnockoutObservable<IRouteEntry> = ko.observable(<IRouteEntry>{}).extend({ throttle: 1 });
        public static currentModule: KnockoutObservable<string> = ko.observable(null).extend({ throttle: 1 });
        public static currentView: KnockoutObservable<string> = ko.observable(null).extend({ throttle: 1 });
        public static currentArguments: KnockoutObservable<string> = ko.observable(null).extend({ throttle: 1 });
        public static currentQuery: KnockoutObservable<string> = ko.observable(null).extend({ throttle: 1 });
        public static currentViewSubscriptions: KnockoutObservable<any> = ko.observable({});
        public static initialize(config: Microsoft.DataStudio.Model.Config.ShellConfig): void {
            var defaultModule: string = config.defaultModuleName;

            /*
             * matches the following url formats:
             * ?:module:/:view:/:arguments*:
             * :module:/:view:/:arguments*:
             * As well as both of the previous with a query url ("?key=value&key2=value2") at the end, with or without a trailing slash
             *
             * This regex assumes that module and arguments do not contain a '?' anywhere inside of them. 
             */

            var defaultRoute: RegExp = /^\/\??([^\/?]+)\/([^\/]+)\/?([^\?]*)\/?(\?.*?)?$/;

            var emptyRoute: string = "";

            var allRoutes: IRoute[] = [defaultRoute, emptyRoute];

            allRoutes.forEach((route) => {
                // Register route with crossroads.js
                crossroads.addRoute(route, (module: string, view: string, args: string, query: string): void => {
                    var requestParams: IRouteEntry = {
                        module: module, view: view,
                        arguments: args,
                        url: document.location.pathname + document.location.search,
                        query: query || null
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
                    // TODO parse the query string into an actual object
                    Router.currentQuery(requestParams.query);

                    Router.currentRoute(requestParams);
                });
            });

            // When the view changes, remove any subscriptions specific to that view
            Router.currentView.subscribe(Router.emptyViewSubscriptions);

            // Parse landing route
            crossroads.parse(document.location.pathname + document.location.search);

            
            Historyjs.Adapter.bind(window, "statechange", () => {
                crossroads.parse(document.location.pathname + document.location.search);
            })
            
            $("body").on("click", "a", RouterImpl.onAnchorNavigated);
        }

        public static registerViewSubscription(name: string, observable: KnockoutObservable<any>, subscriptionFunc: any): void {
            if (!(name in Router.currentViewSubscriptions())) {
                Router.currentViewSubscriptions()[name] = observable.subscribe(subscriptionFunc);
            }
        }

        public static emptyViewSubscriptions(): void {
            Object.keys(Router.currentViewSubscriptions()).forEach(function(name) {
                Router.currentViewSubscriptions()[name].dispose();
            });
            Router.currentViewSubscriptions({});
        }

        public static navigate(url: string, data?: string, title?: string): void {
            // checks if we haven't initialized the Router yet
            if (!(<any>window).Historyjs) {
                return;
            }

            // if there is no leading quesitonmark, add it
            if (url[0] !== "?") {
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
