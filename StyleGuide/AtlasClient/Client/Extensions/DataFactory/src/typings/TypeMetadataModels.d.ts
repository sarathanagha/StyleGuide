/* tslint:disable:interface-name */

declare module MdpExtension.DataModels {
    var DataFactoryPropertiesType: string;
    interface DataFactoryProperties {
        provisioningState: KnockoutObservable<string>;
        errorMessage: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var DataFactoryType: string;
    interface DataFactory {
        name: KnockoutObservable<string>;
        location: KnockoutObservable<string>;
        SubscriptionId: KnockoutObservable<string>;
        ResourceGroup: KnockoutObservable<string>;
        properties: KnockoutObservable<MdpExtension.DataModels.DataFactoryProperties>;
    }
}
declare module MdpExtension.DataModels {
    var DataElementType: string;
    interface DataElement {
        name: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        type: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var DataArtifactAvailabilityType: string;
    interface DataArtifactAvailability {
        frequency: KnockoutObservable<string>;
        interval: KnockoutObservable<number>;
    }
}
declare module MdpExtension.DataModels {
    var TableLocationExtendedPropertiesType: string;
    interface TableLocationExtendedProperties {
        type: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    interface DataArtifactPartitionType {
        name: KnockoutObservable<string>;
        value: KnockoutObservable<{
            date: KnockoutObservable<string>;
            format: KnockoutObservable<string>;
            type: KnockoutObservable<string>;
        }>;
    }

    interface HierarchicalTextFormatProperties {
        columnDelimiter?: KnockoutObservable<string>;
        rowDelimiter?: KnockoutObservable<string>;
        escapeChar?: KnockoutObservable<string>;
        quoteChar?: KnockoutObservable<string>;
        nullValue?: KnockoutObservable<string>;
        encodingName?: KnockoutObservable<string>;
    }

    var DataArtifactLocationType: string;
    interface DataArtifactLocation {
        tableName: KnockoutObservable<string>;
        folderPath: KnockoutObservable<string>;
        fileName: KnockoutObservable<string>;
        extendedProperties: KnockoutObservable<MdpExtension.DataModels.TableLocationExtendedProperties>;
        partitionedBy?: KnockoutObservableArray<DataArtifactPartitionType>;
        format?: KnockoutObservable<HierarchicalTextFormatProperties>;
    }
}
declare module MdpExtension.DataModels {
    var DataArtifactPropertiesType: string;

    interface DatasetAuthoringProperties {
        description: KnockoutObservable<string>;
        type: KnockoutObservable<string>;
        linkedServiceName: KnockoutObservable<string>;
        availability?: KnockoutObservable<MdpExtension.DataModels.DataArtifactAvailability>;
        structure: KnockoutObservableArray<MdpExtension.DataModels.DataElement>;
        typeProperties: KnockoutObservable<MdpExtension.DataModels.DataArtifactLocation>;
    }

    interface DataArtifactProperties extends DatasetAuthoringProperties {
        id: KnockoutObservable<string>;
        createTime: KnockoutObservable<string>;
        provisioningState: KnockoutObservable<string>;
        errorMessage: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var DataArtifactType: string;

    interface DatasetAuthoring {
        name: KnockoutObservable<string>;
        properties: KnockoutObservable<MdpExtension.DataModels.DatasetAuthoringProperties>;
    }

    interface DataArtifact extends DatasetAuthoring {
        id: KnockoutObservable<string>;
        properties: KnockoutObservable<MdpExtension.DataModels.DataArtifactProperties>;
    }
}
declare module MdpExtension.DataModels {
    var BlobMetaDataType: string;
    interface BlobMetaData {
        Name: KnockoutObservable<string>;
        Size: KnockoutObservable<number>;
        Date: KnockoutObservable<string>;
        SasUri: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var RunRecordPropertiesType: string;
    interface RunRecordProperties {
        details?: KnockoutObservable<string>;
        dataVolume?: KnockoutObservable<string>;
        throughput?: KnockoutObservable<string>;
        totalDuration?: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var RunRecordType: string;
    interface RunRecord {
        activityName: KnockoutObservable<string>;
        batchTime: KnockoutObservable<string>;
        computeClusterName: KnockoutObservable<string>;
        dataSliceEnd: KnockoutObservable<string>;
        dataSliceStart: KnockoutObservable<string>;
        errorMessage: KnockoutObservable<string>;
        hasLogs: KnockoutObservable<boolean>;
        id: KnockoutObservable<string>;
        percentComplete: KnockoutObservable<number>;
        pipelineName: KnockoutObservable<string>;
        processingEndTime: KnockoutObservable<string>;
        processingStartTime: KnockoutObservable<string>;
        retryAttempt: KnockoutObservable<number>;
        status: KnockoutObservable<string>;
        tableName: KnockoutObservable<string>;
        timestamp: KnockoutObservable<string>;
        type: KnockoutObservable<string>;
        properties?: KnockoutObservable<MdpExtension.DataModels.RunRecordProperties>;
        activityInputProperties?: KnockoutObservable<StringMap<KnockoutObservable<string>>>;
    }
}
declare module MdpExtension.DataModels {
    var DataSliceType: string;
    interface DataSlice {
        start: KnockoutObservable<string>;
        end: KnockoutObservable<string>;
        status: KnockoutObservable<string>;
        state: KnockoutObservable<string>;
        retryCount: KnockoutObservable<number>;
        statusUpdateTimestamp: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var UpstreamSliceType: string;
    interface UpstreamSlice {
        key: KnockoutObservable<string>;
        tableName: KnockoutObservable<string>;
        slice: KnockoutObservable<MdpExtension.DataModels.DataSlice>;
    }
}
declare module MdpExtension.DataModels {
    var RuntimeInfoType: string;
    interface RuntimeInfo {
        deploymentTime: KnockoutObservable<Date>;
    }
}
declare module MdpExtension.DataModels {
    var BatchPipelinePropertiesType: string;
    interface BatchPipelineProperties {
        activities: KnockoutObservableArray<MdpExtension.DataModels.Activity>;
        start: KnockoutObservable<string>;
        end: KnockoutObservable<string>;
        isPaused: KnockoutObservable<boolean>;
        runtimeInfo: KnockoutObservable<MdpExtension.DataModels.RuntimeInfo>;
        provisioningState: KnockoutObservable<string>;
        errorMessage: KnockoutObservable<string>;
        id: KnockoutObservable<string>;
        pipelineMode: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var ActivityInputType: string;
    interface ActivityInput {
        name: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var ActivityOutputType: string;
    interface ActivityOutput {
        name: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var ActivityPolicyType: string;
    interface ActivityPolicy {
        concurrency: KnockoutObservable<number>;
        timeout: KnockoutObservable<string>;
        retry: KnockoutObservable<number>;
        delay: KnockoutObservable<string>;
        executionPriorityOrder: KnockoutObservable<string>;
        executesOnFailure: KnockoutObservable<boolean>;
        longRetry: KnockoutObservable<number>;
        longRetryInterval: KnockoutObservable<string>;
        requiresHotStandby: KnockoutObservable<boolean>;
        style: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var ActivityType: string;
    interface Activity {
        name: KnockoutObservable<string>;
        linkedServiceName: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        inputs: KnockoutObservableArray<MdpExtension.DataModels.ActivityInput>;
        outputs: KnockoutObservableArray<MdpExtension.DataModels.ActivityOutput>;
        policy: KnockoutObservable<MdpExtension.DataModels.ActivityPolicy>;
        scheduler: KnockoutObservable<MdpExtension.DataModels.ActivityScheduler>;
        // paverma Consider it a bag of unknown optional properties. If the type is known, the activity can be casted to one of the known types.
        typeProperties: KnockoutObservable<Object>;
        type: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var ActivitySchedulerType: string;
    interface ActivityScheduler {
        frequency: KnockoutObservable<string>;
        interval: KnockoutObservable<number>;
        anchorDateTime?: KnockoutObservable<string>;
        offset?: KnockoutObservable<string>;
        style?: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var BatchPipelineType: string;
    interface BatchPipeline {
        name: KnockoutObservable<string>;
        properties: KnockoutObservable<MdpExtension.DataModels.BatchPipelineProperties>;
    }
}
declare module MdpExtension.DataModels {
    var LinkedServicePropertiesType: string;
    interface LinkedServiceProperties {
        connectionString: KnockoutObservable<string>;
        connection?: KnockoutObservable<MdpExtension.DataModels.ConnectionProperties>;
        type: KnockoutObservable<string>;
        gatewayName: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        host: KnockoutObservable<string>;
        encryptedCredential: KnockoutObservable<string>;
        schema: KnockoutObservable<string>;
        server: KnockoutObservable<string>;
        database: KnockoutObservable<string>;
        // paverma Consider it a bag of unknown optional properties. If the type is known, the linked service can be casted to one of the known types.
        typeProperties: KnockoutObservable<Object>;
    }
}
declare module MdpExtension.DataModels {
    var AzureStorageLinkedServicePropertiesType: string;
    interface AzureStorageLinkedServiceProperties {
        typeProperties: KnockoutObservable<MdpExtension.DataModels.AzureStorageLinkedServiceTypeProperties>;
        connectionString: KnockoutObservable<string>;
        connection: KnockoutObservable<MdpExtension.DataModels.ConnectionProperties>;
        type: KnockoutObservable<string>;
        gatewayName: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        host: KnockoutObservable<string>;
        encryptedCredential: KnockoutObservable<string>;
        schema: KnockoutObservable<string>;
        server: KnockoutObservable<string>;
        database: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var AzureStorageLinkedServiceTypePropertiesType: string;
    interface AzureStorageLinkedServiceTypeProperties {
        connectionString: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var AzureSqlLinkedServicePropertiesType: string;
    interface AzureSqlLinkedServiceProperties {
        typeProperties: KnockoutObservable<MdpExtension.DataModels.AzureSqlLinkedServiceTypeProperties>;
        connectionString: KnockoutObservable<string>;
        connection: KnockoutObservable<MdpExtension.DataModels.ConnectionProperties>;
        type: KnockoutObservable<string>;
        gatewayName: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        host: KnockoutObservable<string>;
        encryptedCredential: KnockoutObservable<string>;
        schema: KnockoutObservable<string>;
        server: KnockoutObservable<string>;
        database: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var AzureSqlLinkedServiceTypePropertiesType: string;
    interface AzureSqlLinkedServiceTypeProperties {
        connectionString: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var HDInsightBYOCLinkedServicePropertiesType: string;
    interface HDInsightBYOCLinkedServiceProperties {
        typeProperties: KnockoutObservable<MdpExtension.DataModels.HDInsightBYOCLinkedServiceTypeProperties>;
        type: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var HDInsightBYOCLinkedServiceTypePropertiesType: string;
    interface HDInsightBYOCLinkedServiceTypeProperties {
        clusterUri: KnockoutObservable<string>;
        userName: KnockoutObservable<string>;
        password: KnockoutObservable<string>;
        linkedServiceName: KnockoutObservable<string>; // cluster's storage account.
    }
}
declare module MdpExtension.DataModels {
    var HDInsightOnDemandLinkedServicePropertiesType: string;
    interface HDInsightOnDemandLinkedServiceProperties {
        typeProperties: KnockoutObservable<MdpExtension.DataModels.HDInsightOnDemandLinkedServiceTypeProperties>;
        connectionString: KnockoutObservable<string>;
        connection: KnockoutObservable<MdpExtension.DataModels.ConnectionProperties>;
        type: KnockoutObservable<string>;
        gatewayName: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        host: KnockoutObservable<string>;
        encryptedCredential: KnockoutObservable<string>;
        schema: KnockoutObservable<string>;
        server: KnockoutObservable<string>;
        database: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var HDInsightOnDemandLinkedServiceTypePropertiesType: string;
    interface HDInsightOnDemandLinkedServiceTypeProperties {
        clusterSize: KnockoutObservable<number>;
        jobsContainer: KnockoutObservable<string>;
        linkedServiceName: KnockoutObservable<string>;
        timeToLive: KnockoutObservable<string>;
        version: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var OnPremisesSqlLinkedServicePropertiesType: string;
    interface OnPremisesSqlLinkedServiceProperties {
        typeProperties: KnockoutObservable<MdpExtension.DataModels.OnPremisesSqlLinkedServiceTypeProperties>;
        connectionString: KnockoutObservable<string>;
        connection: KnockoutObservable<MdpExtension.DataModels.ConnectionProperties>;
        type: KnockoutObservable<string>;
        gatewayName: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        host: KnockoutObservable<string>;
        encryptedCredential: KnockoutObservable<string>;
        schema: KnockoutObservable<string>;
        server: KnockoutObservable<string>;
        database: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var OnPremisesSqlLinkedServiceTypePropertiesType: string;
    interface OnPremisesSqlLinkedServiceTypeProperties {
        gatewayLocation: KnockoutObservable<string>;
        connectionString: KnockoutObservable<string>;
        gatewayName: KnockoutObservable<string>;
        username: KnockoutObservable<string>;
        password: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var BlobInfoType: string;
    interface BlobInfo {
        IsTruncated: KnockoutObservable<boolean>;
        BlobData: KnockoutObservable<string>;
        BlobSasUri: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var ClickOnceInfoType: string;
    interface ClickOnceInfo {
        Params: KnockoutObservable<string>;
        Signature: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var ConnectionPropertiesType: string;
    interface ConnectionProperties {
        server: KnockoutObservable<string>;
        database: KnockoutObservable<string>;
        user: KnockoutObservable<string>;
        account: KnockoutObservable<string>;
        protocol: KnockoutObservable<string>;
        key: KnockoutObservable<string>;
        port: KnockoutObservable<number>;
        raw: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var CredentialsManagerRequestType: string;
    interface CredentialsManagerRequest {
        Id: KnockoutObservable<string>;
        DataStoreName: KnockoutObservable<string>;
        Server: KnockoutObservable<string>;
        Database: KnockoutObservable<string>;
        DataStoreType: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var HostServicePropertiesType: string;
    interface HostServiceProperties {
        protocol: KnockoutObservable<string>;
        host: KnockoutObservable<string>;
        port: KnockoutObservable<number>;
        path: KnockoutObservableArray<string>;
        raw: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var GatewayType: string;
    interface Gateway {
        name: KnockoutObservable<string>;
        properties: KnockoutObservable<MdpExtension.DataModels.GatewayProperties>;
        subscriptionId: KnockoutObservable<string>;
        resourceGroup: KnockoutObservable<string>;
        dataFactory: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var GatewayPropertiesType: string;
    interface GatewayProperties {
        createTime: KnockoutObservable<Date>;
        dataFactoryName: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        expiryTime: KnockoutObservable<Date>;
        gatewayName: KnockoutObservable<string>;
        key: KnockoutObservable<string>;
        lastConnectTime: KnockoutObservable<Date>;
        location: KnockoutObservable<string>;
        registerTime: KnockoutObservable<Date>;
        status: KnockoutObservable<string>;
        version: KnockoutObservable<string>;
        versionStatus: KnockoutObservable<string>;
        hostServiceUri: KnockoutObservable<string>;
        provisioningState: KnockoutObservable<string>;
        lastUpgradeResult: KnockoutObservable<string>;
        lastStartUpgradeTime: KnockoutObservable<Date>;
        lastEndUpgradeTime: KnockoutObservable<Date>;
        scheduledUpgradeStartTime: KnockoutObservable<Date>;
        isAutoUpdateOff: KnockoutObservable<boolean>;
        hostService: KnockoutObservable<MdpExtension.DataModels.HostServiceProperties>;
    }
}
declare module MdpExtension.DataModels {
    var SingleKeyType: string;
    interface SingleKey {
        Key: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    var LinkedServiceType: string;
    interface LinkedService<T> {
        name: KnockoutObservable<string>;
        properties: KnockoutObservable<T>;
        subscriptionId: KnockoutObservable<string>;
        resourceGroup: KnockoutObservable<string>;
        dataFactory: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    interface GenericLinkedService extends MdpExtension.DataModels.LinkedService<MdpExtension.DataModels.LinkedServiceProperties> { }
}
declare module MdpExtension.DataModels {
    interface HiveActivityTypeProperties {
        script: KnockoutObservable<string>;
        scriptPath: KnockoutObservable<string>;
    }
}
declare module MdpExtension.DataModels {
    interface HiveActivity extends MdpExtension.DataModels.Activity {
        typeProperties: KnockoutObservable<MdpExtension.DataModels.HiveActivityTypeProperties>;
    }
}
