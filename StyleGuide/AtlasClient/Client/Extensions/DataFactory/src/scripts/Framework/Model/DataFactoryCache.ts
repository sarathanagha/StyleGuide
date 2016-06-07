import DataCache = require("./DataCache");
import DataConstants = require("../Shared/DataConstants");

// TODO paverma Complete the object using the typemetadata info, because the code assumes that.
// Moreover if the objects are constructed with "use strict", which they will be, it would still
// be required.

export class DataFactoryCache {
    public runLogsCacheObject: DataCache.DataCache<MdpExtension.DataModels.BlobMetaData[], void, void> = null;

    constructor(service: DataFactory.IService) {
        this.runLogsCacheObject = new DataCache.DataCache<MdpExtension.DataModels.BlobMetaData[], void, void>({
            serviceObject: service,
            requestParams: {
                url: DataConstants.RunLogUri + "/ListRunLogs",
                type: "GET",
                contentType: "application/json"
            }
        });
    }
}
