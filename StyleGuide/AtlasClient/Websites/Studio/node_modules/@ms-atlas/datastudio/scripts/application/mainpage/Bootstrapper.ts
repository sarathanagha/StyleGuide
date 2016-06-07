/// <reference path="references.ts" />
/// <reference path="Resx.ts"/>
/// <reference path="knockout/BindingHandler.ts"/>
/// <reference path="knockout/ShellComponentLoader.ts"/>
/// <reference path="Router.ts"/>
/// <reference path="ShellContexts/ShellContext.ts"/>
/// <reference path="ShellContexts/ShellV2Context.ts"/>
/// <reference path="../shared/LoggerFactory.ts"/>
/// <reference path="../shared/AuthHelpers.ts"/>


import DiagnosticsHub = Microsoft.DataStudio.Diagnostics.Hub.DiagnosticsHub;
import Logging = Microsoft.DataStudio.Diagnostics.Logging;
import ObjectUtils = Microsoft.DataStudio.Diagnostics.ObjectUtils;
import Resx = Microsoft.DataStudio.Application.Resx;
module Microsoft.DataStudio.Application {

    export class Bootstrapper {

        public static updateSplashStatus(status: string): void {
            document.getElementById('splash-status').innerText = status;
        }

        public static initializeAsync(config: Microsoft.DataStudio.Model.Config.ShellConfig): Promise<any> {
            // Do auth related stuff before anything else.
            let appLoadDeferred = Q.defer<any>();
            var configMgr: Microsoft.DataStudio.Managers.IConfigurationManager = Microsoft.DataStudio.Managers.ConfigurationManager.instance;
            var authMgr: Microsoft.DataStudio.Managers.IAuthenticationManager = Microsoft.DataStudio.Managers.AuthenticationManager.instance;
            var configMgrPromise: Q.Promise<any> = configMgr.initializeAsync(config);
            Bootstrapper.updateSplashStatus(Resx.splashauthorizing);
            authMgr.initializeAsync(Bootstrapper.getTenantIdFromUrl(window.location.href)).then(() => {
                configMgrPromise.then(() => {
                    this.initializeDiagnostics(authMgr, config); // Initialize diagnostics early so that logs can be uploaded to server
                    var logger: Logging.Logger = LoggerFactory.getLogger({ loggerName: "Bootstrapper" });
                    try {
                        var coreInitializer: Promise<any> = this.coreInitialize(logger, config);
                        coreInitializer.then((value: any) => {
                            logger.logInfo("Application bootstrapper promise succeeded!");
                        }, (e: any) => {
                                logger.logError("Application bootstrapper promise failed!", { error: e });
                            });
                        appLoadDeferred.resolve(coreInitializer);
                    } catch (e) {
                        logger.logError("Application bootstrapping failed!", { error: e });
                        appLoadDeferred.reject(e);
                        throw e;
                    }
                });
            }, (reason) => {
                if (reason === true) {
                    return;
                }
                console.error("Could not initialize authentication workflow.", reason);
                appLoadDeferred.reject(reason);
            });
            return appLoadDeferred.promise;
        }

        private static coreInitialize(logger: Logging.Logger, config: Microsoft.DataStudio.Model.Config.ShellConfig): Promise<any> {
            logger.logInfo("BEGIN Application.Bootstrapper.coreInitialize()");
            //TODO: Pass the logger down to other initialize methods...
            Knockout.BindingHandler.initialize();
            Knockout.ComponentLoader.initialize();
            var initPromise: Promise<any> = new Promise(function (resolve, reject) {
                requirejs.config(<RequireConfig>{ packages: config.modules });
                var moduleResxPaths: string[] = [];
                var moduleNames: string[] = [];
                config.modules.forEach((module: Microsoft.DataStudio.Model.Config.ModulePackageConfig) => {
                    if (module.resxPath) moduleResxPaths.push(module.resxPath);
                    moduleNames.push(module.name);
                });
                // use the config to decide which ShellImpl we want
                if (config.shellName === ShellV2ContextImpl.ShellName)
                {
                    ShellContext = ShellV2ContextImpl;
                } else
                {
                    ShellContext = ShellContextImpl;
                }
                // Loading historyjs now to avoid conflict with Adal
                moduleNames.push("history");
                Bootstrapper.updateSplashStatus(Resx.splashloadingmodules);
                requirejs(moduleResxPaths, (): void => {
                    requirejs(moduleNames, (): void => {
                        Historyjs = <any>History;
                        ShellContext.initialize(config);
                        Router.initialize(config);
                        ko.applyBindings({ route: Router.currentRoute });
                        resolve();
                    });
                });
                // Remove splash screen
                var splashContainer: JQuery = $("#splash-container");
                splashContainer.fadeOut(100, () => {
                    splashContainer.remove();
                });
            });
            logger.logInfo("END Application.Bootstrapper.coreInitialize()");
            return initPromise;
        }

        private static initializeDiagnostics(authMgr: Microsoft.DataStudio.Managers.IAuthenticationManager, 
            config: Microsoft.DataStudio.Model.Config.ShellConfig): void {
                
            DiagnosticsHub.configureEndpoint(Microsoft.DataStudio.Application.Environment.getAPIUrl("diagnosticshub/publish",
                config.useExternalAPI));
            DiagnosticsHub.configureSession({
                sessionId: authMgr.getCurrentUser().sessionId || "",
                userId: authMgr.getCurrentUser().puid || "",
            });
            DiagnosticsHub.configureSusbscription({ subscriptionId: "00000000-0000-0000-0000-000000000000", resourceGroupName: "", resourceName: "", provider: "" }); //let defaults prevail till modules provide real values..
        }

        // We can't use Router to get the query string, because Router has HistoryJS as a dependency, which is messing up the
        // adal.js flow. For some reason (perhaps because of our configuration) its removing the "#" returned in token urls.
        private static getTenantIdFromUrl(queryString: string) {
            let tenantId: string;
            if (queryString) {
                let match = queryString.match(/[\?&]tenantId=([^\?&\s]*)/);
                if (match && match[1]) {
                    tenantId = match[1];
                }
            }
            return tenantId;
        }
    }
        
    // returns the build number from msbuild
    export function BuildNumber() {
        let versionInfo = $("[data-version]").attr("data-version");
        let parsed = /(\d+)\.(\d+)$/.exec(versionInfo);

        // not the format we were expecting
        if (!parsed) {
            return "Unexpected format: " + versionInfo;
        }

        return moment("4/7/2007").add(parsed[1], "days").format("YYYYMMDD") + "." + parsed[2];
    }
}
