/// <reference path="../../datastudio.application.mainpage.d.ts" />
/// <reference path="../application/shared/AuthConfigImpl.ts" />
/// <reference path="../application/shared/Environment.ts" />

/// <reference path="ModuleCatalogImpl.ts" />

ModuleCatalog = new Microsoft.DataStudio.Modules.ModuleCatalogImpl();
declare var crossroads: CrossroadsJs.CrossRoadsStatic;
declare var GLOBAL_APP_NAME: string;

module Microsoft.DataStudio {

    export class Bootstrapper {

        private static baseUrl: string = ModuleCatalog.getModuleRootUrl('datastudio');
        public static initializeAsync(modulesConfig: any): void {
            // pavema Disabling historyjs as it does not work correctly with jquery. A known issue.

            requirejs.config(<RequireConfig>{
                config: {
                    i18n: {
                        locale: 'en-en'
                    }
                },
                baseUrl: '',
                paths: {
                    "srcMap": Bootstrapper.getDependancyPath("scripts/application/sourceMapper"),
                    "datastudio.application.shared": Bootstrapper.getDependancyPath("datastudio.application.shared"),
                    "datastudio.application.mainpage": Bootstrapper.getDependancyPath("datastudio.application.mainpage"),
                    "datastudio.diagnostics": Bootstrapper.getDependancyPath("../datastudio-diagnostics/lib/datastudio.diagnostics"),
                    "crossroads": Bootstrapper.getDependancyPath("ExternalLibraries/crossroads.min"),
                    "history": Bootstrapper.getDependancyPath("ExternalLibraries/jquery.history"),
                    "hammer": Bootstrapper.getDependancyPath("ExternalLibraries/hammer"),
                    "es6-promise": Bootstrapper.getDependancyPath("ExternalLibraries/es6-promise.min"),
                    "jquery": Bootstrapper.getDependancyPath("ExternalLibraries/jquery.min"),
                    "jquery.jstree": Bootstrapper.getDependancyPath("ExternalLibraries/"),
                    "Q": Bootstrapper.getDependancyPath("ExternalLibraries/q"),
                    "signals": Bootstrapper.getDependancyPath("ExternalLibraries/signals.min"),
                    "moment": Bootstrapper.getDependancyPath("ExternalLibraries/moment"),
                    "jqueryModal": Bootstrapper.getDependancyPath("ExternalLibraries/jquery.modal"),
                    "WinJS": Bootstrapper.getDependancyPath("ExternalLibraries/WinJS.min"),
                    "jquery.mockjax": Bootstrapper.getDependancyPath("ExternalLibraries/jquery.mockjax.min"),
                    "d3": Bootstrapper.getDependancyPath("ExternalLibraries/d3.min"),
                    "jquery.ui": Bootstrapper.getDependancyPath("ExternalLibraries/jquery-ui"),
                    "jquery-ui-timepicker": Bootstrapper.getDependancyPath("ExternalLibraries/jquery-ui-timepicker-addon.min"),
                    "Hulljs": Bootstrapper.getDependancyPath("ExternalLibraries/hull"),
                    "node-uuid": Bootstrapper.getDependancyPath("ExternalLibraries/uuid"),
                    "i18n": Bootstrapper.getDependancyPath("ExternalLibraries/i18n.min"),
                    "twitterbootstrap": Bootstrapper.getDependancyPath("ExternalLibraries/bootstrap.min"),
                    "kendo": Bootstrapper.getDependancyPath("ExternalLibraries/kendo.all.min"),
                },
                shim: {
                    "datastudio.application.mainpage": {
                        deps: [
                            "datastudio.application.shared"
                        ]
                    },
                    "datastudio.application.shared": {
                        deps: [
                            "srcMap",
                            "crossroads",
                            "jquery",
                            "Q",
                            "moment",
                            "WinJS",
                            "datastudio.diagnostics",
                            "d3",
                        ]
                    },
                    "jquery.jstree/jstree": {
                        deps: [
                            "jquery",
                            "css!" + Bootstrapper.getDependancyPath("ExternalLibraries/jstree.style.css")
                        ]
                    },
                    "jquery.mockjax": { deps: ["jquery"] },
                    "crossroads": { exports: "crossroads" },
                    "history": { exports: "Historyjs", deps: ["jquery"] },
                    "jquery": { exports: "$" },
                    "Q": { exports: "Q" },
                    "jqueryModal": { exports: "jqueryModal" },
                    "moment": { exports: "moment" },
                    "WinJS": {
                        deps: ["css!" + Bootstrapper.getDependancyPath("ExternalLibraries/ui-light.css")],
                        exports: "WinJS"
                    },
                    "jquery.ui": {
                        deps: [
                            "jquery",
                            "css!" + Bootstrapper.getDependancyPath("ExternalLibraries/jquery-ui.min.css")
                        ]
                    },
                    "jquery-ui-timepicker": {
                        deps: [
                            "jquery",
                            "jquery.ui",
                            "css!" + Bootstrapper.getDependancyPath("ExternalLibraries/jquery-ui-timepicker-addon.min.css")
                        ]
                    }
                },
            });

                requirejs.onResourceLoad = (context: Object, map: RequireMap, depArray: RequireMap[]) => {
                    console.log("RequireJS.onResourceLoad:", map.name);
                };
                // Load the localization strings first so they can be used in the splash screen
                require(["i18n!" + Bootstrapper.getDependancyPath("nls/resx") ], (resx): void => {
                    Microsoft.DataStudio.Application.Resx = resx;
                    var appName: string = Microsoft.DataStudio.Application.Resx.cortanaanalytics;
                    if (GLOBAL_APP_NAME && GLOBAL_APP_NAME in Microsoft.DataStudio.Application.Resx) {
                        appName = Microsoft.DataStudio.Application.Resx[GLOBAL_APP_NAME];
                    }

                    var titleTag: NodeListOf<HTMLTitleElement> = document.getElementsByTagName("title");
                    if (titleTag.length > 0) {
                        titleTag[0].innerHTML = appName;
                    }
                    document.getElementById("splash-title").innerHTML = appName;
                    document.getElementById("splash-status").innerHTML = Microsoft.DataStudio.Application.Resx.splashinitializing;
                    
                    requirejs([
                        "es6-promise",
                        "jquery",
                        "hammer",
                        "WinJS",
                        "Q",
                        "moment",
                        "d3",
                        "crossroads",
                        "jquery.mockjax",
                        "jquery.jstree/jstree",
                        "datastudio.diagnostics",
                        "jquery.ui",
                        "jquery-ui-timepicker",
                        "jqueryModal",
                        "twitterbootstrap",
                        "kendo"
                    ], (promise: any, $): void => {

                            // Applying polyfills for browser compatibility.
                            promise.polyfill();

                            (<any>window).Q = require("Q");
                            (<any>window).moment = require("moment");
                            (<any>window).Hammer = require("hammer");

                            crossroads = require("crossroads");
                            jwt = { "decode": (<any>window).jwt_decode };

                            // Ibiza/C# like string.format implementation.
                            if ((<any>String).prototype.format) {
                                console.warn("String.format method already exists. Please check for compatibility.");
                            } else {
                                (<any>String).prototype.format = function (...args: string[]): string {
                                    return this.valueOf().replace(/{(\d+)}/g, (matchedString: string, index: string) => {
                                        return args[parseInt(index, 10)];
                                    });
                                };
                            }

                    // Detect and add browser class.
                    let isChrome = !!(<any>window).chrome && !!(<any>window).chrome.webstore;
                            if (isChrome) {
                                $("body").addClass("chrome");
                            }

                        require(["datastudio.application.shared", "datastudio.application.mainpage"], (): void => {
                                // Initializing the application.
                                Microsoft.DataStudio.Application.Bootstrapper.initializeAsync(modulesConfig);
                            });
                        });
                });
            
        }

        private static getDependancyPath(relativePath: string): string {
            return Bootstrapper.baseUrl + relativePath;
        }
    }
}
