import DataCache = require("./DataCache");
import ArmService = require("../../Services/AzureResourceManagerService");

// TODO paverma Complete the object using the typemetadata info, because the code assumes that.
// Moreover if the objects are constructed with "use strict", which they will be, it would still
// be required.

export class DataFactoryCache {
    public pipelineListCacheObject: DataCache.DataCache<MdpExtension.DataModels.BatchPipeline[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;
    public tableListCacheObject: DataCache.DataCache<MdpExtension.DataModels.DataArtifact[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;
    public runRecordListCacheObject: DataCache.DataCache<MdpExtension.DataModels.RunRecord[], ArmService.IDatasetResourceBaseUrlParams, ArmService.ISliceResourceQueryParams> = null;
    public linkedServiceListCacheObject: DataCache.DataCache<MdpExtension.DataModels.GenericLinkedService[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;
    public dataFactoryCacheObject: DataCache.DataCache<MdpExtension.DataModels.DataFactory, ArmService.IDataFactoryResourceBaseUrlParams, void> = null;
    public pipelineCacheObject: DataCache.DataCache<MdpExtension.DataModels.BatchPipeline, ArmService.IPipelineResourceBaseUrlParams, void> = null;
    public tableCacheObject: DataCache.DataCache<MdpExtension.DataModels.DataArtifact, ArmService.IDatasetResourceBaseUrlParams, void> = null;
    public runRecordCacheObject: DataCache.DataCache<MdpExtension.DataModels.RunRecord, ArmService.IRunRecordBaseUrlParams, void> = null;
    public linkedServiceCacheObject: DataCache.DataCache<MdpExtension.DataModels.GenericLinkedService, ArmService.ILinkedServiceResourceBaseUrlParams, void> = null;
    public gatewayCacheObject: DataCache.DataCache<MdpExtension.DataModels.Gateway, ArmService.IGatewayResourceBaseUrlParams, void> = null;
    public dataSliceCacheObject: DataCache.DataCache<MdpExtension.DataModels.DataSlice[], ArmService.IDatasetResourceBaseUrlParams, void> = null;

    constructor(service: ArmService.AzureResourceManagerService) {

        this.pipelineListCacheObject = new DataCache.DataCache<MdpExtension.DataModels.BatchPipeline[], ArmService.IDataFactoryResourceBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.listPipelines
        });

        this.pipelineCacheObject = new DataCache.DataCache<MdpExtension.DataModels.BatchPipeline, ArmService.IPipelineResourceBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.getPipeline
        });

        this.dataFactoryCacheObject = new DataCache.DataCache<MdpExtension.DataModels.DataFactory, ArmService.IDataFactoryResourceBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.getDataFactory
        });

        this.linkedServiceCacheObject = new DataCache.DataCache<MdpExtension.DataModels.GenericLinkedService, ArmService.ILinkedServiceResourceBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.getLinkedService
        });

        this.linkedServiceListCacheObject = new DataCache.DataCache<MdpExtension.DataModels.GenericLinkedService[], ArmService.IDataFactoryResourceBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.listLinkedServices
        });

        this.tableListCacheObject = new DataCache.DataCache<MdpExtension.DataModels.DataArtifact[], ArmService.IDataFactoryResourceBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.listDatasets
        });

        this.tableCacheObject = new DataCache.DataCache<MdpExtension.DataModels.DataArtifact, ArmService.IDatasetResourceBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.getDataset
        });

        this.dataSliceCacheObject = new DataCache.DataCache<MdpExtension.DataModels.DataSlice[], ArmService.IDatasetResourceBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.listSlices
        });

        this.runRecordListCacheObject = new DataCache.DataCache<MdpExtension.DataModels.RunRecord[], ArmService.IDatasetResourceBaseUrlParams, ArmService.ISliceResourceQueryParams>({
            serviceObject: service,
            serviceMethod: service.listRunRecords
        });

        this.runRecordCacheObject = new DataCache.DataCache<MdpExtension.DataModels.RunRecord, ArmService.IRunRecordBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.getRunRecord
        });

        this.gatewayCacheObject = new DataCache.DataCache<MdpExtension.DataModels.Gateway, ArmService.IGatewayResourceBaseUrlParams, void>({
            serviceObject: service,
            serviceMethod: service.getGateway
        });
    }

    public stripValue(data: { value: Object }): Object {
        return data.value;
    }
}
