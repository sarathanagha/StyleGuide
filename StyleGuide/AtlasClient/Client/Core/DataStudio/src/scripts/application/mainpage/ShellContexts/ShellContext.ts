/// <reference path="../references.ts" />
/// <reference path="../Router.ts" />

module Microsoft.DataStudio.Application {

    export class ShellContextImpl {
        public static ShellName: string = "Shell";
        
        // global pubsub variable
        public static globalSubscriptions = new ko.subscribable();
        public static CurrentRoute = Router.currentRoute;
        public static CurrentModuleContext: KnockoutComputed<Microsoft.DataStudio.UxShell.ModuleContext>;
        public static CurrentModuleViewConfig: KnockoutComputed<Microsoft.DataStudio.Model.Config.ViewConfigProxy>;
        public static AuthModuleConfig: KnockoutComputed<IAdalConfigEntry>;
        public static GlobalLeftPanelElements: KnockoutObservableArray<Microsoft.DataStudio.Model.Config.ShellElementConfigProxy> = ko.observableArray([]);

        public static LeftPanelIsExpanded: KnockoutObservable<boolean> = ko.observable(true);
        public static RightPanelIsExpanded: KnockoutObservable<boolean> = ko.observable(true);

        private static moduleContexts: Microsoft.DataStudio.UxShell.ModuleContext[] = [];

        public static initialize(config: Microsoft.DataStudio.Model.Config.ShellConfig) {

            var logger: Logging.Logger = LoggerFactory.getLogger({ loggerName: "ShellModulesInitializer" });

            var registeredModules: Microsoft.DataStudio.Modules.DataStudioModule[] = ModuleCatalog.getModules();

            registeredModules.forEach((module: Microsoft.DataStudio.Modules.DataStudioModule): void => {

                var moduleContext = new Microsoft.DataStudio.UxShell.ModuleContextImpl(module);

                try {
                    module.initialize(moduleContext);
                } catch (e) {
                    logger.logError("Module initialization failed for module: " + module.name, { error: e });
                    throw e; //tsc didn't let me use 'throw' to re-throw the same exception...
                }
                logger.logInfo("Module initialization completed successfully for module: " + module.name);

                ShellContextImpl.moduleContexts.push(moduleContext);

                var globalLeftPanelElementsProxy = moduleContext.moduleConfig().globalLeftPanel;
                if (globalLeftPanelElementsProxy) {
                    ShellContextImpl.GlobalLeftPanelElements(
                        ShellContextImpl.GlobalLeftPanelElements().concat(globalLeftPanelElementsProxy()));
                }
            });

            ShellContext.CurrentModuleContext = ko.computed(() => {

                var moduleContext =  ShellContextImpl.moduleContexts
                    .filter((moduleContext: Microsoft.DataStudio.UxShell.ModuleContext) => {

                        var currentModule = Router.currentModule() || config.defaultModuleName;
                        return moduleContext.moduleConfig().name() === currentModule;
                    })[0];

                if (!moduleContext) {
                    logger.logError("Unable to find context for module:" + Router.currentModule());
                }

                return moduleContext;
            }).extend({
                rateLimit: {
                    timeout: 10,
                    method: "notifyWhenChangesStop"
                }
            });

            ShellContext.CurrentModuleViewConfig = ko.computed(() => {

                var moduleContext = ShellContext.CurrentModuleContext();

                var viewConfig =  moduleContext.moduleConfig().views()
                    .filter((view: Microsoft.DataStudio.Model.Config.ViewConfigProxy) => {
                        return view.name() == Router.currentView();
                    })[0];

                // log the error only when router has valid view but view is not present in the module config
                if (!viewConfig && Router.currentView()) {
                    logger.logError("Unable to find context for module: " + Router.currentModule() + ", view:" + Router.currentView());
                }

                return viewConfig;
            }).extend({
                rateLimit: {
                    timeout: 10,
                    method: "notifyWhenChangesStop"
                }
            });
        }
    }
}
