/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.DataCatalog {

    import Logging = Microsoft.DataStudio.Diagnostics.Logging;

    export class LoggerFactory {

        private static loggerFactory = new Logging.LoggerFactory({ moduleName: "DataCatalog" });

        static getLogger(data: Logging.LoggerData): Logging.Logger {
            return LoggerFactory.loggerFactory.getLogger(data);
        }
    }

    export var ComponentLogger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
    export var BindingLogger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Bindings" });
}
