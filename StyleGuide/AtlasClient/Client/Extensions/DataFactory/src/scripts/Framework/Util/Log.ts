import Logging = Microsoft.DataStudio.Diagnostics.Logging;
let loggerFactory = new Logging.LoggerFactory({ moduleName: "DataFactory" });

export function getLogger(data: Logging.LoggerData): Logging.Logger {
    return loggerFactory.getLogger(data);
}
