/// <amd-dependency path="text!./templates/DataSourceItemTemplate.html" />

import FormFields = require("../../bootstrapper/FormFields");
import DataTypeConstants = require("./DataTypeConstants");
import Common = require("./Common");
import KnockoutBindings = require("../../bootstrapper/KnockoutBindings");
import Validation = require("../../bootstrapper/Validation");
import ExistingDatasetViewModel = require("./ExistingDatasetGroupTypeViewModel");
import LinkedServicesViewModel = require("./LinkedServicesViewModel");
import LinkedServiceProperties = require("./LinkedServicePropertiesViewModel");
import EnhancedLinkedService = LinkedServicesViewModel.IEnhancedLinkedService;
import FactoryEntities = require("./FactoryEntities");

interface IFilterOption extends FormFields.IOption {
    allowBinary: boolean;
    allowSink: boolean;
    disallowedRegions?: string[];
}

export interface IDataSourceItem extends IFilterOption {
    icon: string;
}

/* tslint:disable:no-internal-module */
export module GroupType {
    /* tslint:enable:no-internal-module */
    export const existingDataset = "existingDataset";
    export const existingLinkedService = "existingLinkedService";
    export const newDataStore = "newDataStore";
}

let datasourceOptions: IDataSourceItem[] = [
    { value: DataTypeConstants.blobStorage, icon: DataTypeConstants.azureBlobIcon, displayText: "Azure Blob Storage", allowBinary: true, allowSink: true },
    { value: DataTypeConstants.azureTable, icon: DataTypeConstants.tableIcon, displayText: "Azure Table Storage", allowBinary: false, allowSink: true },
    { value: DataTypeConstants.sqlAzure, icon: DataTypeConstants.azureSqlIcon, displayText: "Azure SQL Database", allowBinary: false, allowSink: true },
    { value: DataTypeConstants.sqlDW, icon: DataTypeConstants.azureSqlDWIcon, displayText: "Azure SQL Data Warehouse", allowBinary: false, allowSink: true },
    { value: DataTypeConstants.sqlOnPrem, icon: DataTypeConstants.sqlOnPremIcon, displayText: "On-premises SQL Server", allowBinary: false, allowSink: true },
    { value: DataTypeConstants.dataLakeStore, icon: DataTypeConstants.azureDataLakeIcon, displayText: "Azure Data Lake", allowBinary: true, allowSink: true },
    { value: DataTypeConstants.oracle, icon: DataTypeConstants.databaseIcon, displayText: "Oracle", allowBinary: false, allowSink: false },
    { value: DataTypeConstants.mySql, icon: DataTypeConstants.databaseIcon, displayText: "MySQL", allowBinary: false, allowSink: false },
    { value: DataTypeConstants.db2, icon: DataTypeConstants.databaseIcon, displayText: "DB2", allowBinary: false, allowSink: false },
    { value: DataTypeConstants.sybase, icon: DataTypeConstants.databaseIcon, displayText: "Sybase", allowBinary: false, allowSink: false },
    { value: DataTypeConstants.postgresql, icon: DataTypeConstants.databaseIcon, displayText: "PostgreSQL", allowBinary: false, allowSink: false },
    { value: DataTypeConstants.teradata, icon: DataTypeConstants.databaseIcon, displayText: "Teradata", allowBinary: false, allowSink: false },
    { value: DataTypeConstants.hdfs, icon: DataTypeConstants.hadoopIcon, displayText: "HDFS", allowBinary: false, allowSink: false, disallowedRegions: ["westus"] },
    { value: DataTypeConstants.fileShare, icon: DataTypeConstants.fileIcon, displayText: "File", allowBinary: true, allowSink: true, disallowedRegions: ["westus"] }
];

export function getDataSourceItem(dataType: string): IDataSourceItem {
    return datasourceOptions.filter(opt => opt.value === dataType)[0];
}

let linkedServiceOptions: IFilterOption[] = [
    { displayText: "All", value: DataTypeConstants.allLinkedServicesFilter, allowBinary: true, allowSink: true },
    { displayText: "Azure Storage", value: DataTypeConstants.azurestoragelinkedservice, allowBinary: true, allowSink: true },
    { displayText: "Azure SQL Database", value: DataTypeConstants.azuresqllinkedservice, allowBinary: false, allowSink: true },
    { displayText: "Azure SQL Data Warehouse", value: DataTypeConstants.azuresqldwlinkedservice, allowBinary: false, allowSink: true },
    { displayText: "Azure Data Lake Store", value: DataTypeConstants.dataLakeStorelinkedservice, allowBinary: true, allowSink: true },
    { displayText: "SQL Server", value: DataTypeConstants.onpremisessqllinkedservice, allowBinary: false, allowSink: true },
    { displayText: "Oracle", value: DataTypeConstants.onpremisesoraclelinkedservice, allowBinary: false, allowSink: false },
    { displayText: "MySQL", value: DataTypeConstants.onpremisesmysqllinkedservice, allowBinary: false, allowSink: false },
    { displayText: "DB2", value: DataTypeConstants.onpremisesdb2linkedservice, allowBinary: false, allowSink: false },
    { displayText: "Sybase", value: DataTypeConstants.onpremisessybaselinkedservice, allowBinary: false, allowSink: false },
    { displayText: "PostgreSQL", value: DataTypeConstants.onpremisespostgresqllinkedservice, allowBinary: false, allowSink: false },
    { displayText: "Teradata", value: DataTypeConstants.onpremisesteradatalinkedservice, allowBinary: false, allowSink: false },
    { displayText: "HDFS", value: DataTypeConstants.onpremiseshdfslinkedservice, allowBinary: false, allowSink: false, disallowedRegions: ["westus"] },
    { displayText: "File", value: DataTypeConstants.onpremisesfilelinkedservice, allowBinary: true, allowSink: true, disallowedRegions: ["westus"] }
];

export class DataTypeViewModel {
    private static dataSourceItemTemplate = require("text!./templates/DataSourceItemTemplate.html");

    public isSource: boolean;
    public groupType = ko.observable(GroupType.newDataStore);
    public validatable = ko.observable<Validation.IValidatable>();

    // New linked services
    public winJSListView: WinJS.UI.ListView<IDataSourceItem>;
    public newLinkedServiceTemplate = DataTypeViewModel.dataSourceItemTemplate;
    public onNewLinkedServiceSelectionChanged: () => void;
    public onNewLinkedServiceLoad: () => void;
    public winJSListViewBindingOptions: KnockoutBindings.IWinJSListViewValueAccessor<IDataSourceItem> = null;

    // Exisiting linked services
    public selectedLinkedServiceName: KnockoutObservable<string> = ko.observable(undefined);

    // Existing datasets
    public existingDatasetViewModel: ExistingDatasetViewModel.ExistingDatasetGroupTypeViewModel = null;

    // Selected group types
    public useExistingLinkedService = ko.pureComputed(() => {
        return this.groupType() === GroupType.existingLinkedService;
    });

    public createNewDataStore = ko.pureComputed(() => {
        return this.groupType() === GroupType.newDataStore;
    });

    public useExistingDataset = ko.pureComputed(() => {
        return this.groupType() === GroupType.existingDataset;
    });

    public useNewDataset: KnockoutComputed<boolean> = ko.pureComputed(() => {
        return this.useExistingLinkedService() || this.createNewDataStore();
    });

    private newLinkedServiceDataSources = ko.observableArray<IDataSourceItem>();
    private linkedServiceTypeFilterOptions: KnockoutObservableArray<FormFields.IOption> = ko.observableArray<FormFields.IOption>();

    private newLinkedServiceValidatable: Validation.IValidatable;
    private existingLinkedServiceValidatable: Validation.IValidatable;
    private existingLinkedServicesGrid: LinkedServicesViewModel.ExistingLinkedServicesGridViewModel;
    private selectedDataSource: KnockoutObservable<string>;

    private existingLinkedServiceProperties: LinkedServiceProperties.LinkedServicePropertiesViewModel;
    private selectedEnhancedLinkedService: KnockoutObservable<EnhancedLinkedService> = ko.observable(undefined);
    public selectExistingLinkedService() {
        this.groupType(GroupType.existingLinkedService);
    }

    public selectNewLinkedService() {
        this.groupType(GroupType.newDataStore);
    }

    public selectExistingDataset() {
        this.groupType(GroupType.existingDataset);
    }

    public selectDataSource(dataSource: IDataSourceItem) {
        this.selectedDataSource(dataSource.value);
    }

    public setFilter(isBinaryCopy: boolean) {
        let filterFunc: (o: IDataSourceItem) => boolean = (opt: IDataSourceItem) => (opt.allowBinary || !isBinaryCopy)
            && (this.isSource || opt.allowSink)
            && (!opt.disallowedRegions || opt.disallowedRegions.filter(region => FactoryEntities.factoryLocation && region === FactoryEntities.factoryLocation.toLocaleLowerCase()).length === 0);
        let newDataTypes = datasourceOptions.filter(filterFunc);
        this.newLinkedServiceDataSources(newDataTypes);
        let allowedLinkedServices = linkedServiceOptions.filter(filterFunc);
        this.linkedServiceTypeFilterOptions(allowedLinkedServices);
    }

    constructor(selectedDataSource: KnockoutObservable<string>, isSource: boolean) {
        this.isSource = isSource;
        this.selectedDataSource = selectedDataSource;

        this.newLinkedServiceValidatable = Common.syncronousValidateable(ko.computed(() => !!this.selectedDataSource()), "At least one new data store should be selected");
        this.populateNewDataStoreTypes(selectedDataSource);

        // Temporary: setFilter is called again later when factory location is obtained
        // We need to call it here initially as well because grid view model assumes list is populated already
        this.setFilter(false);
        this.existingLinkedServicesGrid = new LinkedServicesViewModel.ExistingLinkedServicesGridViewModel(
            this.selectedLinkedServiceName, this.linkedServiceTypeFilterOptions, selectedDataSource);
        let linkedServiceSelectedValidatable = Common.syncronousValidateable(ko.computed(() => !!this.selectedLinkedServiceName()),
            "At least one existing linked service should be selected");
        this.existingLinkedServiceValidatable = Common.ValidateableMerge([linkedServiceSelectedValidatable], this.existingLinkedServicesGrid.testConnectionValidatable);

        this.selectedEnhancedLinkedService = this.existingLinkedServicesGrid.selectedEnhancedLinkedService;
        this.existingLinkedServiceProperties = new LinkedServiceProperties.LinkedServicePropertiesViewModel(this.selectedDataSource, this.selectedEnhancedLinkedService);
        this.validatable(this.newLinkedServiceValidatable);

        this.existingDatasetViewModel = new ExistingDatasetViewModel.ExistingDatasetGroupTypeViewModel(selectedDataSource);

        this.groupType.subscribe((groupType) => {
            switch (groupType) {
                case GroupType.newDataStore:
                    this.validatable(this.newLinkedServiceValidatable);
                    break;
                case GroupType.existingLinkedService:
                    this.validatable(this.existingLinkedServiceValidatable);
                    break;
                case GroupType.existingDataset:
                    this.validatable(this.existingDatasetViewModel.validation);
                    break;
                default:
                // No validations.
            }
        });

        this.useExistingLinkedService.subscribe(useExisting => {
            if (useExisting && this.selectedLinkedServiceName()) {
                selectedDataSource(this.existingLinkedServicesGrid.dataType);
            }
        });

        FactoryEntities.factoryLoadedDefered.promise.then(() => {
            this.setFilter(false);
        });
    }

    private populateNewDataStoreTypes(selectedDataSource: KnockoutObservable<string>) {
        this.onNewLinkedServiceSelectionChanged = () => {
            this.winJSListView.selection.getItems().then(selected => {
                if (selected.length > 0 && selected[0]) {
                    selectedDataSource(selected[0].data.value);
                } else {
                    selectedDataSource(undefined);
                }
            });
        };
        this.onNewLinkedServiceLoad = () => {
            if (selectedDataSource()) {
                let dataTypeIndex = 0;
                this.newLinkedServiceDataSources().forEach((ds, index) => {
                    if (ds.value === selectedDataSource()) {
                        dataTypeIndex = index;
                    }
                });
                this.winJSListView.selection.set(dataTypeIndex);
            }
        };
    }
}
