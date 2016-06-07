/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.MachineLearning {

    import Logging = Microsoft.DataStudio.Diagnostics.Logging;

    export class LoggerFactory {

        private static loggerFactory = new Logging.LoggerFactory({ moduleName: "MachineLearning" });

        static getLogger(data: Logging.LoggerData): Logging.Logger {
            return LoggerFactory.loggerFactory.getLogger(data);
        }
    }
}
