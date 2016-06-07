/// <reference path="../src/References.d.ts" />
declare module Microsoft.DataStudio.DesignGuide {
    class DesignGuideModule implements Microsoft.DataStudio.Modules.DataStudioModule {
        name: string;
        moduleContext: Microsoft.DataStudio.UxShell.ModuleContext;
        initialize(moduleContext: Microsoft.DataStudio.UxShell.ModuleContext): void;
        getNotificationManager(): Microsoft.DataStudio.Managers.INotificationManager;
    }
}
declare module Microsoft.DataStudio.DesignGuide {
    import Logging = Microsoft.DataStudio.Diagnostics.Logging;
    class LoggerFactory {
        private static loggerFactory;
        static getLogger(data: Logging.LoggerData): Logging.Logger;
    }
    var ComponentLogger: Logging.Logger;
    var BindingLogger: Logging.Logger;
}
declare module Microsoft.DataStudio.DesignGuide {
    class ConfigData {
        private static leftPanel;
        private static rightPanel;
        static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig;
    }
}
declare module Microsoft.DataStudio.DesignGuide.Knockout {
    class BindingHandler {
        static initialize(): void;
    }
}
