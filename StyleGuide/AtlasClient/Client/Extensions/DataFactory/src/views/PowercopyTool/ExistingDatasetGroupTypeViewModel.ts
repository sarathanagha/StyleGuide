// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./templates/ExistingDatasetGroupTypeTemplate.html" name="existingDatasetGroupTypeTemplate" />

let existingDatasetGroupTypeTemplate: string;

import FormFields = require("../../bootstrapper/FormFields");
import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");
import {getEnhancedLinkedService, IEnhancedLinkedService} from "./LinkedServicesViewModel";
import FactoryEntities = require("./FactoryEntities");
import EntityType = require("./EntityType");
import Util = Framework.Util;
import Common = require("./Common");
import Validation = require("../../bootstrapper/Validation");
import {PreviewAndSchemaViewModel} from "./PreviewAndSchemaViewModel";
import FormRender = require("./FormRender");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");
import DatasetModel = require("../../scripts/Framework/Model/Contracts/DataArtifact");
import DatasetHelper = require("../../scripts/Framework/Model/Helpers/DatasetHelper");

let logger = Framework.Log.getLogger({
    loggerName: "ExistingDatasetGroupTypeViewModel"
});

// For each selection update we update the preview/schema thingy.
// And then do some final checks when the user presses next.

interface IDisplayDataset {
    icon: string;
    selected: KnockoutObservable<boolean>;
    model: ArmService.IListDataset;
}

export class ExistingDatasetGroupTypeViewModel {
    public tabTitle: string = ClientResources.pctFromExistingDatasetTabTitle;
    public validation: Validation.IValidatable;
    public template: string = existingDatasetGroupTypeTemplate;
    public previewAndSchemaViewModel: PreviewAndSchemaViewModel;

    // Used in html template.
    public datasetTypeFilter = new FormFields.ValidatedSelectBoxViewModel<string>(ko.observableArray([]), {
        label: ""
    });
    public datasetNameFilter = ko.observable<string>().extend({ throttle: 200 });
    public datasetNameFilterPlaceholder = ClientResources.filterByNameLabel;
    public datasets = ko.observableArray<IDisplayDataset>();
    public displayDatasets: KnockoutComputed<IDisplayDataset[]>;
    public selectedDataset: KnockoutObservable<IDisplayDataset> = ko.observable<IDisplayDataset>();

    // START Accessed from a parent object
    public selectedLinkedServiceName = ko.observable<string>();
    // Properties for a blob.
    public resultingFolderPath: KnockoutObservable<string> = ko.observable<string>();
    public resultingFileName: KnockoutObservable<string> = ko.observable<string>();
    public partitions = ko.observableArray<Common.IPartition>();
    public preview = ko.observable<FormRender.IPreview>();
    public schema = ko.observable<Common.IColumn[]>();
    public isBinaryCopy = ko.observable(false);
    public minimumSizeInMb = ko.observable<number>();
    public fileFormat = ko.observable<ArmService.ITextFormat>({});
    public recursiveCopy = ko.observable<boolean>();

    // Properties for a table.
    public minimumRows = ko.observable<number>();

    // END

    // TODO paverma We probably don't have to save these, just the name is sufficient.
    private existingDatasets: Common.IEntity[] = null;
    private appContext: AppContext.AppContext = null;
    private selectedDataSource: KnockoutObservable<string> = null;

    constructor(selectedDataSource: KnockoutObservable<string>) {
        this.selectedDataSource = selectedDataSource;

        this.datasetTypeFilter.optionList([
            { value: null, displayText: ClientResources.all },
            { value: DatasetModel.TableType.AzureBlobLocation, displayText: DatasetModel.tableTypeToResourceMap[DatasetModel.TableType.AzureBlobLocation] },
            { value: DatasetModel.TableType.AzureDataLakeStore, displayText: DatasetModel.tableTypeToResourceMap[DatasetModel.TableType.AzureDataLakeStore] }
        ]);

        let globalTypeFilter = (model: ArmService.IListDataset) => {
            return model.properties.type === DatasetModel.TableType.AzureBlobLocation || model.properties.type === DatasetModel.TableType.AzureDataLakeStore;
        };

        this.displayDatasets = ko.pureComputed(() => {
            let typeFilterValue = this.datasetTypeFilter.value();
            let nameFilterValue = this.datasetNameFilter();
            return this.datasets().filter((dataset) => {
                let typeFilterBoolean = (!Util.propertyHasValue(typeFilterValue) && globalTypeFilter(dataset.model))
                    || typeFilterValue === dataset.model.properties.type;
                let nameFilterBoolean = !Util.propertyHasValue(nameFilterValue) || dataset.model.name.toLowerCase().indexOf(nameFilterValue) !== -1;
                return typeFilterBoolean && nameFilterBoolean;
            });
        });

        this.validation = Common.syncronousValidateable(ko.pureComputed(() => {
            return !!this.selectedDataset();
        }), ClientResources.pctExistingDatasetNotSelectedErrorMessage);

        this.appContext = AppContext.AppContext.getInstance();

        // Load the list of datasets.
        FactoryEntities.entityFetchPromiseMap[EntityType.table].then(() => {
            let datasets = FactoryEntities.entitiesMap[EntityType.table];
            this.datasets(datasets.filter(globalTypeFilter).map((dataset) => {
                return {
                    icon: DatasetHelper.getDatasetIcon(dataset.properties.type),
                    model: dataset,
                    selected: ko.observable(false)
                };
            }));
            this.existingDatasets = datasets;
            let selectBoxOptions: FormFields.IOption[] = datasets.map((dataset) => {
                return {
                    value: dataset.name,
                    displayText: dataset.name
                };
            });
            if (selectBoxOptions.length > 0) {
                selectBoxOptions[0].isDefault = true;
            }
        }, (reason) => {
            logger.logError("Failed to get a list of existing datasets in factory {0}".format(this.appContext.factoryId()), reason);
        });

        // Subscribe to changes in the value and load the corresponding schema.
        this.selectedDataset.subscribe((displayDataset) => {
            if (displayDataset) {
                this.updatePreviewAndSchema(displayDataset.model.name);
            } else {
                // TODO paverma Clear the preview and schema. But we are not displaying the schema for now.
            }
        });

        // Setup the previewAndSchema viewmodel.
        // TODO paverma Fix the preview message.
        let previewMessage = ko.pureComputed(() => {
            return "";
        });

        // TODO paverma Fix the schema message.
        let schemaMessage = ko.pureComputed(() => {
            return "";
        });

        this.previewAndSchemaViewModel = new PreviewAndSchemaViewModel({
            preview: this.preview,
            previewMessage: previewMessage,
            schema: this.schema,
            schemaMessage: schemaMessage
        });
    }

    public toggleSelectionForItem(dataset: IDisplayDataset) {
        let oldDataset = this.selectedDataset();
        if (oldDataset) {
            oldDataset.selected(false);
            this.selectedDataset(null);
        }

        if (oldDataset !== dataset) {
            dataset.selected(true);
            this.selectedDataset(dataset);
        }
    }

    public onNext(): Q.Promise<void> {
        let displayDataset = this.selectedDataset();
        let promise: Q.Promise<void> = null;
        if (displayDataset) {
            promise = this.updatePreviewAndSchema(displayDataset.model.name);
        }
        return promise;
    }

    // TODO paverma Add notion of refresh id.
    private updatePreviewAndSchema(datasetName: string): Q.Promise<void> {
        // To support the multi dataset scenario, the backend will have to send the linkedservice name in the
        let splitFactoryId = this.appContext.splitFactoryId();
        return Q.all<ArmService.IGetDataset, void>([this.appContext.armService.getDataset({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName,
            tableName: datasetName
        }), FactoryEntities.entityFetchPromiseMap[EntityType.linkedService]]).then(([dataset]) => {
            this.selectedDataset().model = dataset;
            // TODO paverma Confirm if the linked service type is really needed, and if it can be just derived from dataset type.
            let enhancedLinkedService: IEnhancedLinkedService = null;
            for (let linkedService of FactoryEntities.entitiesMap[EntityType.linkedService]) {
                if (linkedService.name === dataset.properties.linkedServiceName) {
                    enhancedLinkedService = getEnhancedLinkedService(linkedService);
                    this.selectedDataSource(enhancedLinkedService.dataType);
                    this.selectedLinkedServiceName(linkedService.name);
                    break;
                }
            }
            this.setupGlobalProperties(dataset);

            // let connectible: KnockoutComputed<FormRender.IConnectible> = ko.pureComputed(() => {
            //    return <FormRender.IConnectible>{
            //        linkedServiceName: enhancedLinkedService.linkedService.name,
            //        dataType: enhancedLinkedService.dataType,
            //        region: null,
            //        variant: null,
            //        formFields: null
            //    };
            // });

            //// TODO paverma For blob we need to invoke getFilePreviewAndSchema, while for table we need to invoke
            // let dsrString: string = null;

            // FormRender.getNavTable(connectible(), null).then((result) => {
            //    console.log(result);
            // }, (reason) => {

            // });

            // FormRender.getFilePreviewAndSchema(connectible(), this.resultingFolderPath() + this.resultingFileName(), null).then((result: FormRender.IPreviewAndSchema) => {
            //    this.preview(result.preview);
            // }, (reason) => {
            //    // TODO paverma Handle this.
            // });

            // FormRender.getPreview(connectible(), dsrString).then((preivew) => {

            // }, (reason) => {
            //    // TODO paverma Handle the failure.
            // });

        }, (reason) => {
            logger.logError("Failed to retrieve dataset {0} for factory {1}.".format(datasetName, this.appContext.factoryId()), reason);
            // The error will be shown to the user by the wizard.
            return null;
        });
    }

    // There are some other variables that are used by the copy tool, but are finally consumed in the deployment. Hence, ignoring those here.
    private setupGlobalProperties(dataset: ArmService.IGetDataset): void {
        let typeProperties = dataset.properties.typeProperties;

        // setup hierarchial/blob related properties.
        if (Util.propertyHasValue(typeProperties.fileName)) {
            this.resultingFileName(typeProperties.fileName);
        }
        if (Util.propertyHasValue(typeProperties.folderPath)) {
            this.resultingFolderPath(typeProperties.folderPath);
        }
        if (Util.propertyHasValue(typeProperties.partitionedBy)) {
            let partitions: Common.IPartition[] = typeProperties.partitionedBy.map((partition) => {
                return <Common.IPartition>{
                    name: partition.name,
                    type: partition.value.type,
                    date: partition.value.date,
                    format: ko.observable(partition.value.format),
                    formatOptions: []
                    // TODO paverma Format options have to be created for blob's preview.
                };
            });
            this.partitions(partitions);
        }

        let structure = dataset.properties.structure;
        if (Util.propertyHasValue(structure)) {
            let columns = structure.map((column) => {
                // TODO paverma we use only name, type for the source data source. Hence worry about the rest of the values later when adding support for existing datasets
                // as destination.
                return <Common.IColumn>{
                    name: column.name,
                    type: column.type,
                    allowNull: null,
                    isIdentity: null,
                    size: null,
                    isAutoIncrementing: null
                };
            });
            this.schema(columns);
            this.isBinaryCopy(false);
        } else {
            this.schema(null);
            this.isBinaryCopy(true);
        }

        if (Util.propertyHasValue(typeProperties.format)) {
            this.fileFormat(typeProperties.format);
        }
        this.recursiveCopy(true);

        // Generic properties
        let policy = dataset.properties.policy;
        // TODO paverma Still need to pump these through to the summary page.
        if (Util.propertyHasValue(policy)) {
            let validation = policy.validation;
            if (Util.propertyHasValue(validation)) {
                if (Util.propertyHasValue(validation.minimumRows)) {
                    this.minimumRows(validation.minimumRows);
                }
                if (Util.propertyHasValue(validation.minimumSizeMB)) {
                    this.minimumSizeInMb(validation.minimumSizeMB);
                }
            }
        }

        // TODO paverma yet to set getExternalDataSettings, which are the extra settings for dataset marked as external. Api version differences are causing,
        // these properties to not show up.
    }
}
