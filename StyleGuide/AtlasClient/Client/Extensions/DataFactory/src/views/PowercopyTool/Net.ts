import DataFactoryService = require("../../scripts/Services/DataFactoryService");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");
import AppContext = require("../../scripts/AppContext");
import Settings = require("./Settings");
import DataConstants = require("../../scripts/Framework/Shared/DataConstants");
import Configuration = require("./Configuration");

export let armService = new ArmService.AzureResourceManagerService(AppContext.AppContext.getInstance(), DataConstants.PowerCopyToolModuleName, Configuration.apiVersion);
let svc = new DataFactoryService.DataFactoryService(AppContext.AppContext.getInstance(), DataConstants.PowerCopyToolModuleName);
let recordMap: { [key: string]: string } = {};
let recordedDataKey = "recordedData";

if (Settings.recordReplay) {
    if (localStorage[recordedDataKey]) {
        recordMap = JSON.parse(localStorage[recordedDataKey]);
    }
    setInterval(() => {
        localStorage[recordedDataKey] = JSON.stringify(recordMap);
    }, 2000);
}

export function sendMessage<T>(relativeUri: string, type: string, queryStringParams: Object = null, postData: Object = null): Q.Promise<T> {
    if (Settings.recordReplay) {
        let key = JSON.stringify({
            url: relativeUri,
            type: type,
            queryString: queryStringParams,
            data: postData
        });
        if (recordMap[key]) {
            return Q<T>(JSON.parse(recordMap[key]));
        } else {
            return svc.sendMessage<T>(relativeUri, type, queryStringParams, postData).then(result => {
                recordMap[key] = JSON.stringify(result);
                return result;
            });
        }
    }
    return svc.sendMessage<T>(relativeUri, type, queryStringParams, postData);
}
