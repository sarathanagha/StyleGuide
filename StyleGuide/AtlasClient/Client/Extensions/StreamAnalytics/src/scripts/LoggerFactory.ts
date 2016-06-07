/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.StreamAnalytics {

    import Logging = Microsoft.DataStudio.Diagnostics.Logging;

    export class LoggerFactory {

        private static loggerFactory = new Logging.LoggerFactory({ moduleName: "StreamAnalytics" });

        static getLogger(data: Logging.LoggerData): Logging.Logger {
            return LoggerFactory.loggerFactory.getLogger(data);
        }
    }
}
