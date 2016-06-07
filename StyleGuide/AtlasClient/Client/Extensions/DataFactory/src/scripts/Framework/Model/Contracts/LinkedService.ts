import BaseEncodable = require("./BaseEncodable");

export interface ILinkedServiceTemplate<T> {
    name: string;
    properties: {
        description: string;
        type: string;
        typeProperties: T;
    };
}

export interface IHDInsightBYOCTypePropertiesTemplate {
    clusterUri: string;
    userName: string;
    password: string;
    linkedServiceName: string;
}

export class LinkedServiceType {
    public static hdInsight: string = "hdinsight";
    public static hdInsightOnDemand: string = "hdinsightondemand";
    public static azureML: string = "azureml";
    public static azureSqlDatabase = "azuresqldatabase";
    public static azureSqlDW = "azuresqldw";
    public static onPremisesSqlServer = "onpremisessqlserver";
}

export const linkedServiceTypeToResourceMap: { [s: string]: string } = {};

linkedServiceTypeToResourceMap[LinkedServiceType.hdInsight] = ClientResources.hDInsightLabel;
linkedServiceTypeToResourceMap[LinkedServiceType.hdInsightOnDemand] = ClientResources.onDemandHDInsightLabel;
linkedServiceTypeToResourceMap[LinkedServiceType.azureML] = ClientResources.DataStoreTypeAzureML;
linkedServiceTypeToResourceMap[LinkedServiceType.azureSqlDatabase] = ClientResources.DataStoreTypeSqlAzure;
linkedServiceTypeToResourceMap[LinkedServiceType.azureSqlDW] = ClientResources.azureSqlDataWarehouseLabel;
linkedServiceTypeToResourceMap[LinkedServiceType.onPremisesSqlServer] = ClientResources.onPremisesSqlServerLabel;

export class Encodable extends BaseEncodable.BaseEncodable {
    public name: string;
    public entities: BaseEncodable.EncodableSet = new BaseEncodable.EncodableSet();;

    constructor(name: string) {
        // Ideally the toUpperCase here would match CLR's String.ToUpperInvariant()
        // which is in line with string.Equals(other, StringComparison.OrdinalIgnoreCase)
        // used for data factory identifiers. However, it is up to browser implementation,
        // but this is the best we have.
        super(BaseEncodable.EncodableType.LINKED_SERVICE, name.toUpperCase());
        this.name = name;
    }
}

/* tslint:disable:no-internal-module */
export module Type {
    /* tslint:enable:no-internal-module */
    /* tslint:disable:variable-name */
    export let AzureStorage = "AzureStorage";
    /* tslint:enable:variable-name */
}

export class DataStoreType {
    public static storageAccountAsset: DataStoreType = {
        name: "AzureStorageLinkedService",
        localizedName: ClientResources.DataStoreTypeStorageAccount
    };

    public static sqlAzureAsset: DataStoreType = {
        name: "AzureSqlLinkedService",
        localizedName: ClientResources.DataStoreTypeSqlAzure
    };

    public static sqlServerAsset: DataStoreType = {
        name: "OnPremisesSqlLinkedService",
        localizedName: ClientResources.DataStoreTypeSqlServer
    };

    public static fileAsset: DataStoreType = {
        name: "OnPremisesFileSystemLinkedService",
        localizedName: ClientResources.DataStoreTypeFileSystem
    };

    public static hdInsightAsset: DataStoreType = {
        name: "HDInsightBYOCLinkedService",
        localizedName: ClientResources.DataStoreTypeHDInsight
    };

    public static onDemandHDInsightAsset: DataStoreType = {
        name: "HDInsightOnDemandLinkedService",
        localizedName: ClientResources.DataStoreTypeHDInsight
    };

    public static azureMlAsset: DataStoreType = {
        name: "AzureMLLinkedService",
        localizedName: ClientResources.DataStoreTypeAzureML
    };

    public static oracleAsset: DataStoreType = {
        name: "OnPremisesOracleLinkedService",
        localizedName: ClientResources.DataStoreTypeOracle
    };

    public static postgreSqlAsset: DataStoreType = {
        name: "OnPremisesPostgreSqlLinkedService",
        localizedName: ClientResources.onPremisesPostgreSqlLinkedService
    };

    public static mySqlAsset: DataStoreType = {
        name: "OnPremisesMySqlLinkedService",
        localizedName: ClientResources.onPremisesMySqlLinkedService
    };

    public static teradataAsset: DataStoreType = {
        name: "OnPremisesTeradataLinkedService",
        localizedName: ClientResources.onPremisesTeradataLinkedService
    };

    public static db2Asset: DataStoreType = {
        name: "OnPremisesDb2LinkedService",
        localizedName: ClientResources.onPremisesDb2LinkedService
    };

    public static sybaseAsset: DataStoreType = {
        name: "OnPremisesSybaseLinkedService",
        localizedName: ClientResources.onPremisesSybaseLinkedService
    };

    public static dynamicsAXAsset: DataStoreType = {
        name: "DynamicsAXService",
        localizedName: ClientResources.DataStoreTypeDynamicsAX
    };

    public static salesforceAsset: DataStoreType = {
        name: "SalesforceService",
        localizedName: ClientResources.DataStoreTypeSalesforce
    };

    public static mdsAsset: DataStoreType = {
        name: "MdsLinkedService",
        localizedName: ClientResources.DataStoreTypeMds
    };

    public static azureSearchIndexAsset: DataStoreType = {
        name: "AzureSearchIndexLinkedService",
        localizedName: ClientResources.DataStoreTypeAzureSearchIndex
    };

    public static azureServiceBusAsset: DataStoreType = {
        name: "AzureServiceBusLinkedService",
        localizedName: ClientResources.DataStoreTypeServiceBus
    };

    public static customAsset: DataStoreType = {
        name: "CustomLinkedService",
        localizedName: ClientResources.DataStoreTypeCustom
    };

    public static allAvailableDataStoreTypes: DataStoreType[] =
    [
        DataStoreType.storageAccountAsset,
        DataStoreType.sqlAzureAsset,
        DataStoreType.sqlServerAsset,
        DataStoreType.fileAsset,
        DataStoreType.oracleAsset,
        DataStoreType.postgreSqlAsset,
        DataStoreType.mySqlAsset,
        DataStoreType.teradataAsset,
        DataStoreType.db2Asset,
        DataStoreType.sybaseAsset,
        // DataStoreType.dynamicsAXAsset,
        // DataStoreType.salesforceAsset
    ];

    public static allComputeTypes: DataStoreType[] =
    [
        DataStoreType.hdInsightAsset,
        DataStoreType.onDemandHDInsightAsset,
        DataStoreType.azureMlAsset,
        DataStoreType.azureServiceBusAsset,
        DataStoreType.customAsset
    ];

    public static allDataStoreTypes: DataStoreType[] =
    [
        DataStoreType.storageAccountAsset,
        DataStoreType.sqlAzureAsset,
        DataStoreType.sqlServerAsset,
        DataStoreType.fileAsset,
        DataStoreType.hdInsightAsset,
        DataStoreType.onDemandHDInsightAsset,
        DataStoreType.azureMlAsset,
        DataStoreType.oracleAsset,
        DataStoreType.postgreSqlAsset,
        DataStoreType.mySqlAsset,
        DataStoreType.teradataAsset,
        DataStoreType.db2Asset,
        DataStoreType.sybaseAsset,
        DataStoreType.dynamicsAXAsset,
        DataStoreType.salesforceAsset,
        DataStoreType.mdsAsset,
        DataStoreType.azureSearchIndexAsset,
        DataStoreType.azureServiceBusAsset,
        DataStoreType.customAsset
    ];

    public name: string;
    public localizedName: string;

    public static getDataStoreTypeByName(name: string): DataStoreType {
        let found = undefined;
        $.each(DataStoreType.allDataStoreTypes, (index, value: DataStoreType) => {
            if (value.name === name) {
                found = value;
                return false; // break
            }
        });

        return found;
    }
}
