/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.DesignGuide {

    import Logging = Microsoft.DataStudio.Diagnostics.Logging;

    export class LoggerFactory {

        private static loggerFactory = new Logging.LoggerFactory({ moduleName: "DesignGuide" });

        static getLogger(data: Logging.LoggerData): Logging.Logger {
            return LoggerFactory.loggerFactory.getLogger(data);
        }
    }

    export var ComponentLogger = LoggerFactory.getLogger({ loggerName: "DesignGuide", category: "DesignGuide Components" });
    export var BindingLogger = LoggerFactory.getLogger({ loggerName: "DesignGuide", category: "DesignGuide Bindings" });
}
