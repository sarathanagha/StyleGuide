/// <reference path="../References.d.ts" />

module Microsoft.DataStudio.SolutionAccelerator {

    import Logging = Microsoft.DataStudio.Diagnostics.Logging;

    export class LoggerFactory {

        private static loggerFactory = new Logging.LoggerFactory({ moduleName: "SolutionAccelerator" });

        static getLogger(data: Logging.LoggerData): Logging.Logger {
            return LoggerFactory.loggerFactory.getLogger(data);
        }
    }
}
