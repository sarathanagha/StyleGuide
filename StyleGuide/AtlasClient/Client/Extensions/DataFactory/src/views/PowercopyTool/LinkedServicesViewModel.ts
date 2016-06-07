import {LinkedServiceType} from "../../scripts/Framework/Model/Contracts/LinkedService";
import FormFields = require("../../bootstrapper/FormFields");
import DataTypeConstants = require("./DataTypeConstants");
import FactoryEntities = require("./FactoryEntities");
import Common = require("./Common");
import EntityType = require("./EntityType");
import Validation = require("../../bootstrapper/Validation");
import FormRender = require("./FormRender");
import LinkedServiceTypeProperties = require("./LinkedServiceTypeProperties");

export interface IEnhancedLinkedService {
    dataType: string;
    icon: string;
    linkedService: Common.IEntity;
    summary: KnockoutObservable<string>;
    enabled: boolean;
    propertyBag: FormFields.IOption[];
}

export class ExistingLinkedServicesGridViewModel {
    public existingLinkedServices = ko.observableArray<IEnhancedLinkedService>();
    public filteredLinkedServices = ko.observableArray<IEnhancedLinkedService>();
    public onExistingLinkedServiceSelectionChanged: (enhancedLinkedService: IEnhancedLinkedService) => void;
    public selectedLinkedServiceNameFilter: KnockoutObservable<string> = ko.observable(undefined);
    public selectedLinkedServiceName: KnockoutObservable<string> = ko.observable(undefined);
    public selectedEnhancedLinkedService: KnockoutObservable<IEnhancedLinkedService> = ko.observable(undefined);

    public shouldTestConnection: KnockoutObservable<boolean> = ko.observable(false);
    public testConnectionValidatable: Validation.IValidatable;

    public showTypeFilterOptions: KnockoutObservable<boolean>;
    public dataType: string;
    private selectedLinkedServiceTypeFilter: FormFields.ValidatedSelectBoxViewModel<string>;
    private linkedServiceTypeFilterOptions: KnockoutObservableArray<FormFields.IOption>;

    constructor(selectedLinkedServiceName: KnockoutObservable<string>,
                linkedServiceTypeFilterOptions: KnockoutObservableArray<FormFields.IOption>,
                selectedDataSource: KnockoutObservable<string>,
                showTypeFilterOptions: boolean = true) {

        this.selectedLinkedServiceName = selectedLinkedServiceName;
        this.linkedServiceTypeFilterOptions = linkedServiceTypeFilterOptions;
        this.selectedLinkedServiceTypeFilter = new FormFields.ValidatedSelectBoxViewModel<string>(
            linkedServiceTypeFilterOptions, { label: "", infoBalloon: "Filter by type" });
        this.selectedLinkedServiceTypeFilter.value(this.linkedServiceTypeFilterOptions()[0].value);
        this.showTypeFilterOptions = ko.observable(showTypeFilterOptions);

        this.filteredLinkedServices = ko.observableArray<IEnhancedLinkedService>([]);
        this.populateExisingLinkedServices(selectedDataSource);

        this.testConnectionValidatable = {
            isValid: () => {
                if (this.selectedLinkedServiceName()) {
                    return this.testConnection();
                }
            },
            valid: this.shouldTestConnection
        };
    }

    private populateExisingLinkedServices(selectedDataSource: KnockoutObservable<string>) {
        let typeFilter = (type: string) => {
            return type === this.selectedLinkedServiceTypeFilter.value() ||
                (this.selectedLinkedServiceTypeFilter.value() === DataTypeConstants.allLinkedServicesFilter && this.linkedServiceTypeFilterOptions().filter(opt => opt.value === type).length > 0);
        };

        let valueFilter = (value: string) => {
            return !this.selectedLinkedServiceNameFilter()
                || value.indexOf(this.selectedLinkedServiceNameFilter().toLowerCase()) !== -1;
        };
        ko.computed(() => {
            this.selectedLinkedServiceName(undefined);

            this.filteredLinkedServices(this.existingLinkedServices().filter(ls =>
                typeFilter(ls.linkedService.properties.type.toLowerCase()) && valueFilter(ls.linkedService.name.toLowerCase())
            ));
        });

        this.onExistingLinkedServiceSelectionChanged = (enhancedLinkedService) => {
            this.selectedEnhancedLinkedService(enhancedLinkedService);
            this.selectedLinkedServiceName(enhancedLinkedService.linkedService.name);
            selectedDataSource(enhancedLinkedService.dataType);
            this.dataType = enhancedLinkedService.dataType;
            this.shouldTestConnection(true);
        };

        FactoryEntities.entityFetchPromiseMap[EntityType.linkedService].then(() => {
            FactoryEntities.entitiesMap[EntityType.linkedService].forEach(linkedService => {
                    let enhancedLinkedService: IEnhancedLinkedService = getEnhancedLinkedService(linkedService);
                    if (enhancedLinkedService.enabled && linkedService.properties.provisioningState.toLowerCase() === "succeeded") {
                        this.existingLinkedServices.push(enhancedLinkedService);
                    }
                });
            });
    }

    private testConnection(): Q.Promise<Validation.IValidationResult> {
        let connectible: FormRender.IConnectible = {
            formFields: undefined,
            dataType: undefined,
            region: undefined,
            variant: undefined,
            linkedServiceName: this.selectedLinkedServiceName()
        };

        return FormRender.testConnection(connectible).then((result: Validation.IValidationResult) => {
            this.shouldTestConnection(result.valid);
            return result;
        });
    }
}

export function getEnhancedLinkedService(linkedService: Common.IEntity): IEnhancedLinkedService {
    if (!linkedService) {
        return null;
    }

    let linkedServiceType = linkedService.properties.type.toLowerCase();
    let enhancedLinkedService: IEnhancedLinkedService = {
        dataType: null,
        icon: null,
        linkedService: linkedService,
        summary: null,
        enabled: false,
        propertyBag: []
    };
    switch (linkedServiceType) {
        case DataTypeConstants.azurestoragelinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.blobStorage, DataTypeConstants.azureBlobIcon);
            let azureStorageTypeProperties = <LinkedServiceTypeProperties.IAzureStorageLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addAzureStorageTypeProperties(enhancedLinkedService.propertyBag, azureStorageTypeProperties);
            break;
        case DataTypeConstants.azuresqllinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.sqlAzure, DataTypeConstants.azureSqlIcon);
            let azureSqlTypeProperties = <LinkedServiceTypeProperties.IAzureSqlLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addAzureSqlTypeProperties(enhancedLinkedService.propertyBag, azureSqlTypeProperties);
            break;
        case DataTypeConstants.azuresqldwlinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.sqlDW, DataTypeConstants.azureSqlDWIcon);
            let azureSqlDwTypeProperties = <LinkedServiceTypeProperties.IAzureSqlLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addAzureSqlTypeProperties(enhancedLinkedService.propertyBag, azureSqlDwTypeProperties);
            break;
        case DataTypeConstants.onpremisessqllinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.sqlOnPrem, DataTypeConstants.sqlOnPremIcon);
            let sqlServerTypeProperties = <LinkedServiceTypeProperties.ISqlServerLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addSqlServerTypeProperties(enhancedLinkedService.propertyBag, sqlServerTypeProperties);
            break;
        case DataTypeConstants.onpremisesoraclelinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.oracle, DataTypeConstants.databaseIcon);
            let oracleTypeProperties = <LinkedServiceTypeProperties.IOracleLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addOracleTypeProperties(enhancedLinkedService.propertyBag, oracleTypeProperties);
            break;
        case DataTypeConstants.onpremisesmysqllinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.mySql, DataTypeConstants.databaseIcon);
            let mySqlTypeProperties = <LinkedServiceTypeProperties.IRelationDbLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addRelationalDbTypeProperties(enhancedLinkedService.propertyBag, mySqlTypeProperties);
            break;
        case DataTypeConstants.onpremisesdb2linkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.db2, DataTypeConstants.databaseIcon);
            let db2TypeProperties = <LinkedServiceTypeProperties.IRelationDbLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addRelationalDbTypeProperties(enhancedLinkedService.propertyBag, db2TypeProperties);
            break;
        case DataTypeConstants.onpremisessybaselinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.sybase, DataTypeConstants.databaseIcon);
            let sybaseTypeProperties = <LinkedServiceTypeProperties.IRelationDbLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addRelationalDbTypeProperties(enhancedLinkedService.propertyBag, sybaseTypeProperties);
            break;
        case DataTypeConstants.onpremisespostgresqllinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.postgresql, DataTypeConstants.databaseIcon);
            let postgreSqlTypeProperties = <LinkedServiceTypeProperties.IRelationDbLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addRelationalDbTypeProperties(enhancedLinkedService.propertyBag, postgreSqlTypeProperties);
            break;
        case DataTypeConstants.onpremisesteradatalinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.teradata, DataTypeConstants.databaseIcon);
            let teradataTypeProperties = <LinkedServiceTypeProperties.IRelationDbLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addRelationalDbTypeProperties(enhancedLinkedService.propertyBag, teradataTypeProperties);
            break;
        case DataTypeConstants.onpremisesfilelinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.fileShare, DataTypeConstants.fileIcon);
            let fileTypeProperties = <LinkedServiceTypeProperties.IFileServerLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addFileTypeProperties(enhancedLinkedService.propertyBag, fileTypeProperties);
            break;
        case DataTypeConstants.onpremiseshdfslinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.hdfs, DataTypeConstants.hadoopIcon);
            let hdfsTypeProperties = <LinkedServiceTypeProperties.IHdfsLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addHdfsTypeProperties(enhancedLinkedService.propertyBag, hdfsTypeProperties);
            break;
        case DataTypeConstants.dataLakeStorelinkedservice:
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.dataLakeStore, DataTypeConstants.azureDataLakeIcon);
            let azureDataLakeTypeProperties = <LinkedServiceTypeProperties.IAzureDataLakeLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addAzureDataLakeTypeProperties(enhancedLinkedService.propertyBag, azureDataLakeTypeProperties);
            break;
        case LinkedServiceType.hdInsight:
            // TODO: Tim to add type specific properties later and refine icons
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.hdinsight, DataTypeConstants.hadoopIcon);
            break;
        case LinkedServiceType.hdInsightOnDemand:
            // TODO: Tim to add type specific properties later and refine icons
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.hdinsightondemand, DataTypeConstants.hadoopIcon);
            break;
        case LinkedServiceType.azureML:
            // TODO: refine icons
            buildEnhancedLinkedService(enhancedLinkedService, DataTypeConstants.azureml, DataTypeConstants.databaseIcon);
            let azureMLTypeProperties = <LinkedServiceTypeProperties.IAzureMLLinkedServiceTypeProperties>enhancedLinkedService.linkedService.properties.typeProperties;
            LinkedServiceTypeProperties.addAzureMLTypeProperties(enhancedLinkedService.propertyBag, azureMLTypeProperties);
            break;
        default:
    }

    if (enhancedLinkedService.enabled) {
        enhancedLinkedService.summary = ko.computed(() => getSummary(enhancedLinkedService));
    }
    return enhancedLinkedService;
}

function buildEnhancedLinkedService(enhancedLinkedService: IEnhancedLinkedService, dataType: string, icon: string, enabled: boolean = true) {
    enhancedLinkedService.enabled = enabled;
    enhancedLinkedService.dataType = dataType;
    enhancedLinkedService.icon = icon;

    enhancedLinkedService.propertyBag.push({ displayText: LinkedServiceTypeProperties.name, value: enhancedLinkedService.linkedService.name });
    enhancedLinkedService.propertyBag.push({ displayText: LinkedServiceTypeProperties.linkedServiceType, value: enhancedLinkedService.linkedService.properties.type });
    enhancedLinkedService.propertyBag.push({ displayText: LinkedServiceTypeProperties.status, value: enhancedLinkedService.linkedService.properties.provisioningState });
}

function getSummary(enhancedLinkedService: IEnhancedLinkedService): string {
    let summary: string = "";
    enhancedLinkedService.propertyBag.forEach((property: FormFields.IOption) => {
        if (summary !== "") {
            summary += "\n";
        }
        summary += addToSummary(property.displayText, property.value);
    });
    return summary;
}

function addToSummary(propertyName: string, propertyValue: string): string {
    return propertyName + ": " + propertyValue;
}
