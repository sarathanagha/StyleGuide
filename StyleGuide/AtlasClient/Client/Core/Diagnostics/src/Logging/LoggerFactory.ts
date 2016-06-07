/// <reference path="../references.ts" />
/// <reference path="LoggerImpl.ts" />

module Microsoft.DataStudio.Diagnostics.Logging {

    export class LoggerFactory {

        private factoryData: LoggerData;

        constructor(data: LoggerData) {
            Assert.argumentIsObject(data, "data");

            this.factoryData = data;
        }

        getLogger(data: LoggerData): Logger {
            return new LoggerImpl(ObjectUtils.merge(this.factoryData, data));
        }
    }
}
