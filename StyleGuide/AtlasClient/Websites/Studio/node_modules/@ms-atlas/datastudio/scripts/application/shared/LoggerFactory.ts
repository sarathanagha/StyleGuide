/// <reference path="../../../references.d.ts" />

module Microsoft.DataStudio.Application {

    import Logging = Microsoft.DataStudio.Diagnostics.Logging;

    export class LoggerFactory {

        private static loggerFactory = new Logging.LoggerFactory({ moduleName: "Application" });

        static getLogger(data: Logging.LoggerData): Logging.Logger {
            return LoggerFactory.loggerFactory.getLogger(data);
        }
    }
}
