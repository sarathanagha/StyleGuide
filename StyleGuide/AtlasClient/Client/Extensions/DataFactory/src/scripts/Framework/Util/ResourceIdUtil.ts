import DataConstants = require("../Shared/DataConstants");
import Log = require("./Log");

// Resource id string utils
let logger = Log.getLogger({
    loggerName: "ResourceIdUtil"
});

export interface IDataFactoryId {
    subscriptionId: string;
    resourceGroupName: string;
    dataFactoryName: string;
}

// Resource Id format:
// /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/<DataFactoryResourceId>/<dataFactoryName>

export function splitResourceString(resourceId: string): IDataFactoryId {
    let splitString = resourceId.split("/");
    let id: IDataFactoryId;

    if (splitString.length !== 9) {
        logger.logError("Split resource string utility: expected 9 segments, found: {0}, input string: {1}".format(splitString.length, resourceId));
    }
    id = {
        subscriptionId: splitString[2],
        resourceGroupName: splitString[4],
        dataFactoryName: splitString[8]
    };
    return id;
}

export function createDataFactoryIdString(subscriptionId: string, resourceGroupName: string, dataFactoryName: string) {
    return "/subscriptions/{0}/resourcegroups/{1}/providers/{2}/{3}".format(
        subscriptionId,
        resourceGroupName,
        DataConstants.DataFactoryResourceId,
        dataFactoryName);
}

export function createDataFactoryIdString2(id: IDataFactoryId) {
    return createDataFactoryIdString(id.subscriptionId, id.resourceGroupName, id.dataFactoryName);
}

export function getResourceGroupId(resourceId: string): string {
    return resourceId.split("/").slice(0, 5).join("/");
}
