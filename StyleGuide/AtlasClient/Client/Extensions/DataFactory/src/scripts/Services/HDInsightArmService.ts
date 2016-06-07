/// <reference path="../../References.d.ts" />

import Log = require("../Framework/Util/Log");
import AppContext = require("../AppContext");
import BaseService = require("./BaseService");

let logger = Log.getLogger({ loggerName: "HDInsightArmService" });

const JSON_CONTENT_TYPE: string = "application/json";

export interface IHDInsightResourceBaseUrlParams {
    subscriptionId: string;
    resourceGroupName?: string;
}

export interface IHDInsightComputeProfileRoles {
    name: string;
    hardwareProfile: {
        vmSize: string;
    };
    targetInstanceCount: number;
}

export interface IHDInsightConnectivityEndpoints {
    location: string;
    name: string;
    port: number;
    protocol: string;
}

export interface IHDInsightCluster {
    etag: string;
    id: string;
    location: string;
    name: string;
    properties: {
        clusterDefinition: {
            kind: string;
        };
        clusterState: string;
        clusterVersion: string;
        computeProfile: {
            roles: IHDInsightComputeProfileRoles[];
        };
        connectivityEndpoints: IHDInsightConnectivityEndpoints[];
        createdDate: string;
        osType: string;
        provisioningState: string;
        quotaInfo: {
            coresUsed: number;
        };
        tier: string;
    };
    tags: {};
    type: string;
}

export interface IListClustersResponse {
    value: IHDInsightCluster[];
}

export class HDInsightArmService extends BaseService.BaseService {
    protected _apiVersion: string = "2015-03-01-preview";
    private _resourceProviderNamespace: string = "Microsoft.HDInsight";
    private _baseUrl: string = "/subscriptions/{subscriptionId}/providers/" + this._resourceProviderNamespace + "/";

    private _clustersUrl = this._baseUrl + "clusters";

    constructor(appcontext: AppContext.AppContext) {
        super(appcontext, logger);
    }

    public listClusters(baseUrlParams: IHDInsightResourceBaseUrlParams): Q.Promise<IHDInsightCluster[]> {
        let url: string = this.getBaseUrl(this._clustersUrl, baseUrlParams);
        let deferred = Q.defer<IHDInsightCluster[]>();

        this.ajaxQ<IListClustersResponse>({
            url: url,
            type: "GET",
            contentType: JSON_CONTENT_TYPE
        }).then((data: IListClustersResponse) => {
            deferred.resolve(data.value);
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to retrieve HDInsight clusters for params {0}. Reason: {1}.".format(
                JSON.stringify(baseUrlParams),
                JSON.stringify(reason)));
            deferred.reject(reason);
        });

        return deferred.promise;
    }
}
