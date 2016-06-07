/// <amd-dependency path="text!./templates/DatasetToolTemplate.html" name="datasetToolTemplate" />
/// <amd-dependency path="text!../../PowercopyTool/templates/FrequencyIntervalTemplate.html" name="frequencyIntervalTemplate" />
/// <amd-dependency path="text!../../PowercopyTool/templates/HierarchicalPartitionTemplate.html" name="hierarchicalPartitionTemplate" />

import {AuthoringOverlay, OverlayType} from "./AuthoringOverlay";
import EntityStore = require("../../../scripts/Framework/Model/Authoring/EntityStore");
import Framework = require("../../../_generated/Framework");
import BaseEncodable = require("../../../scripts/Framework/Model/Contracts/BaseEncodable");
import FormFields = require("../../../bootstrapper/FormFields");
import DatasetModel = require("../../../scripts/Framework/Model/Contracts/DataArtifact");
import DatasetHelper = require("../../../scripts/Framework/Model/Helpers/DatasetHelper");
import LinkedServiceModel = require("../../../scripts/Framework/Model/Contracts/LinkedService");
import {AppContext} from "../../../scripts/AppContext";
import DataTypeViewModel = require("../../PowercopyTool/DataTypeViewModel");
import DataTypeConstants = require("../../PowercopyTool/DataTypeConstants");
import Collapsible = require("../../../bootstrapper/CollapsibleKnockoutBinding");
import BlobBrowser = require("../../PowercopyTool/BlobBrowser");
import FormRender = require("../../PowercopyTool/FormRender");
import CommonWizardPage = require("../../Shared/CommonWizardPage");
import Shared = require("../GraphExtensions/Shared");
import CanvasDataset = require("../GraphExtensions/Tables");
import {FileFormatViewModel} from "../../PowercopyTool/FileFormatViewModel";
import LinkedServicesViewModel = require("../../PowercopyTool/LinkedServicesViewModel");
import FactoryEntities = require("../../PowercopyTool/FactoryEntities");
import PctCommon = require("../../PowercopyTool/Common");
import {DatasetEntity} from "../../../scripts/Framework/Model/Authoring/DatasetEntity";
import PctConfiguration = require("../../PowercopyTool/Configuration");
import {LinkedServiceEntity} from "../../../scripts/Framework/Model/Authoring/LinkedServiceEntity";

let datasetToolTemplate: string;
let frequencyIntervalTemplate: string;
let hierarchicalPartitionTemplate: string;

let logger = Framework.Log.getLogger({
    loggerName: "DatasetTool"
});

interface ILeftPane {
    entity: KnockoutObservable<EntityStore.IDatasetEntity>;
    linkedServiceType: KnockoutObservable<string>;
}

interface IRightPane {
    loading: KnockoutObservable<Framework.Loader.LoadingState>;
    saveChanges(): void;
}

const defaultTitle: string = "Dataset settings";

// TODO paverma Add a way to restrict the options being displayed to the user.
export class DatasetTool extends AuthoringOverlay {
    public static className = "DatasetTool";
    public groupType = ko.observable<string>();

    public leftPane: ILeftPane;
    public rightPane: IRightPane;

    // We might end up using an entirely different entity while using the tool, hence direct references to the entity should be avoided.
    private baseEntity: EntityStore.IDatasetEntity;
    private finalEntity: EntityStore.IDatasetEntity;
    private editDeferred: Q.Deferred<Shared.GraphContracts.IExtensionPiece[]>;

    // TODO paverma Take in a authoringEntity, and then base our data off of that.
    constructor(entity: EntityStore.IDatasetEntity, editDeferred: Q.Deferred<Shared.GraphContracts.IExtensionPiece[]>) {
        super(OverlayType.HTML, defaultTitle);
        this.overlayContent = {
            template: datasetToolTemplate,
            viewModel: this     // TODO paverma Reduce the scope
        };
        this.baseEntity = entity;
        this.editDeferred = editDeferred;

        // Set the correct group type.
        let entityStore = AppContext.getInstance().authoringEntityStore;
        if (!entity.metadata.linkedServiceKey) {
            this.groupType(DataTypeViewModel.GroupType.newDataStore);
        } else {
            if (entity.metadata.authoringState !== EntityStore.AuthoringState.DRAFT) {
                this.groupType(DataTypeViewModel.GroupType.existingDataset);
            } else {
                let linkedService = entityStore.getEntity(entity.metadata.linkedServiceKey);
                if (linkedService.metadata.authoringState !== EntityStore.AuthoringState.DRAFT) {
                    this.groupType(DataTypeViewModel.GroupType.existingLinkedService);
                } else {
                    this.groupType(DataTypeViewModel.GroupType.newDataStore);
                }
            }
        }

        let splitFactoryId = AppContext.getInstance().splitFactoryId();
        FactoryEntities.factoryName = splitFactoryId.dataFactoryName;
        FactoryEntities.resourceGroup = splitFactoryId.resourceGroupName;
        FactoryEntities.subscriptionId = splitFactoryId.subscriptionId;
        FactoryEntities.loadEntities();
        FactoryEntities.loadFactory();
        this.leftPane = new LeftPaneViewModel(this.groupType, this.baseEntity);
        this.rightPane = new RightPaneViewModel(this.groupType, this.leftPane);
    }

    public applyClicked(): void {
        this.rightPane.saveChanges();
        let metadata = this.leftPane.entity().metadata;
        if (metadata.authoringState === EntityStore.AuthoringState.DEPLOYED) {
            metadata.authoringState = EntityStore.AuthoringState.LOCALLY_MODIFIED;
        }
        this.finalEntity = this.leftPane.entity();
    }

    public hideOverlay(): void {
        // TODO paverma: Update existing entity, rather than pushing a new one to the store.
        AppContext.getInstance().authoringEntityStore.addEntity(this.finalEntity || this.baseEntity);
        if (this.finalEntity && this.baseEntity !== this.finalEntity) {
            let datasetNode = new CanvasDataset.TableNode(this.finalEntity);
            this.editDeferred.resolve([{
                inputConfigs: [datasetNode],
                outputConfigs: null,
                mainConfig: null
            }]);
        } else {
            this.editDeferred.reject(null);
        }
        super.hideOverlay();
    }
}

interface ILeftPaneListItem {
    model: {
        name: KnockoutObservable<string>;
    };
    metadata: {
        icon: KnockoutObservableBase<string>;
    };
}

let azureBlobListItem: ILeftPaneListItem = {
    model: {
        name: ko.observable(ClientResources.azureBlobStorageText)
    }, metadata: {
        icon: ko.observable(Framework.Svg.azureBlob)
    }
};

class LeftPaneViewModel implements ILeftPane {
    // Exposed to parent class
    public entity = ko.observable<EntityStore.IDatasetEntity>();
    public linkedServiceType = ko.observable<string>();

    // Used in template
    public existingDatasetTabTitle = ClientResources.existingDatasetTabTitle;
    public newDatasetTabTitle = ClientResources.newDatasetTabTitle;
    public listItems: KnockoutComputed<ILeftPaneListItem[]>;
    public nameFilter = ko.observable<string>().extend({ throttle: 200 });
    public nameFilterPlaceholder = ClientResources.nameFilterPlaceholder;
    public selectedItem = ko.observable<ILeftPaneListItem>();

    public selectGroup = (value: string): void => {
        this.groupType(value);
    };

    public selectedExistingDataset = ko.pureComputed(() => {
        return this.groupType() === DataTypeViewModel.GroupType.existingDataset;
    });

    public selectedNewDataset = ko.pureComputed(() => {
        return (this.groupType() === DataTypeViewModel.GroupType.existingLinkedService || this.groupType() === DataTypeViewModel.GroupType.newDataStore);
    });

    public toggleSelectionForItem = (item: ILeftPaneListItem) => {
        if (item !== this.selectedItem()) {
            this.selectedItem(item);
            if ((<EntityStore.IDatasetEntity>item).entityType) {
                this.entity(<EntityStore.IDatasetEntity>item);
            } else {
                if (!this.newEntity) {
                    this.newEntity = createNewDatasetEntity();
                }
                this.entity(this.newEntity);
            }
        }
    };

    private groupType: KnockoutObservable<string>;
    private items = ko.observableArray<ILeftPaneListItem>();
    private newEntity: EntityStore.IDatasetEntity;

    constructor(groupType: KnockoutObservable<string>, initialEntity: EntityStore.IDatasetEntity) {
        this.groupType = groupType;
        this.entity(initialEntity);
        if (initialEntity.metadata.authoringState === EntityStore.AuthoringState.DRAFT) {
            this.newEntity = initialEntity;
        }

        this.listItems = ko.pureComputed(() => {
            if (this.nameFilter()) {
                let nameFilter = this.nameFilter().toLowerCase();
                return this.items().filter((item) => {
                    return item.model.name().toLowerCase().indexOf(nameFilter) !== -1;
                });
            } else {
                return this.items();
            }
        });

        let entityStore = AppContext.getInstance().authoringEntityStore;
        Framework.Util.subscribeAndCall(this.groupType, ((currentGroupType) => {
            if (currentGroupType === DataTypeViewModel.GroupType.existingDataset) {
                // We display a list of dataset entities from the store.
                let defaultSelect: EntityStore.IDatasetEntity;
                let datasetEntites = entityStore.getEntitiesOfType<EntityStore.IDatasetEntity>(BaseEncodable.EncodableType.TABLE).filter((datasetEntity) => {
                    if (this.entity() === datasetEntity) {
                        defaultSelect = datasetEntity;
                    }
                    return datasetEntity.model.properties().type() === DatasetModel.TableType.AzureBlobLocation;
                });
                if (datasetEntites.length === 0) {
                    this.selectGroup(DataTypeViewModel.GroupType.newDataStore);
                    return;
                }
                this.items(datasetEntites);
                defaultSelect = defaultSelect || datasetEntites[0];
                this.toggleSelectionForItem(defaultSelect);
                this.linkedServiceType(null);
            } else {
                // We display a custom list of supported dataset types
                this.items([azureBlobListItem]);
                this.linkedServiceType(DataTypeConstants.blobStorage);
                this.toggleSelectionForItem(azureBlobListItem);
            }
        }));
    }
}

class RightPaneViewModel implements IRightPane {
    public commonDatasetSettings = ko.observable<CommonDatasetSettings>();
    public settings = ko.observable<HierarchicalSettings | RelationalSettings>();
    public loading = ko.observable(Framework.Loader.LoadingState.Ready);

    private hierarchicalSettings: HierarchicalSettings;
    private groupType: KnockoutObservable<string>;

    // We create the right panel from scratch whenever a different entity is selected.
    private updateViewModelFromEntity = (entity: EntityStore.IDatasetEntity, linkedServiceType: string): void => {
        this.commonDatasetSettings(new CommonDatasetSettings(this.groupType, entity));
        // TODO paverma Based on model type update the correct settings. For now always create hierarchical.
        if (this.hierarchicalSettings) {
            this.hierarchicalSettings.dispose();
        }
        this.hierarchicalSettings = new HierarchicalSettings(this.groupType, entity, linkedServiceType);
        this.settings(this.hierarchicalSettings);
    };

    constructor(groupType: KnockoutObservable<string>, leftPane: ILeftPane) {
        this.groupType = groupType;
        let appContext = AppContext.getInstance();
        let datasetView = appContext.armDataFactoryCache.tableCacheObject.createView(false);
        let splitFactoryId = appContext.splitFactoryId();
        let entityStore = appContext.authoringEntityStore;
        let entity = leftPane.entity;

        Framework.Util.subscribeAndCall(entity, (currentEntity) => {
            if (currentEntity.metadata.modelState === EntityStore.ModelState.COMPLETE) {
                this.updateViewModelFromEntity(currentEntity, leftPane.linkedServiceType());
            } else {
                this.loading(Framework.Loader.LoadingState.BlockingUiLoading);
                datasetView.fetch({
                    subscriptionId: splitFactoryId.subscriptionId,
                    resourceGroupName: splitFactoryId.resourceGroupName,
                    factoryName: splitFactoryId.dataFactoryName,
                    tableName: currentEntity.model.name()
                }).then((completeEntity) => {
                    // We should merge properly, but its okay to just substitute properties entirely as we recreate the nodes on the canvas.
                    currentEntity.model.properties(completeEntity.properties());
                    currentEntity.metadata.modelState = EntityStore.ModelState.COMPLETE;
                    let linkedService = entityStore.getEntityByNameAndType(completeEntity.properties().linkedServiceName(), BaseEncodable.EncodableType.LINKED_SERVICE);
                    currentEntity.metadata.linkedServiceKey = linkedService.key;
                    this.updateViewModelFromEntity(currentEntity, leftPane.linkedServiceType());
                }, (reason) => {
                    logger.logError("Could not load dataset {0} for the factory {1}. Reason: {2}.".format(currentEntity.model.name(), JSON.stringify(splitFactoryId), JSON.stringify(reason)));
                }).finally(() => {
                    this.loading(Framework.Loader.LoadingState.Ready);
                });
            }
        });
    }

    public saveChanges(): void {
        this.commonDatasetSettings().saveChanges();
        this.hierarchicalSettings.saveChanges();
    }
}

interface ICollapsible extends Collapsible.ICollapsibleValueAccessor {
    header: string;
}

interface ISaveChanges {
    saveChanges(): void;
}

// TODO paverma Handle external dataset settings.
class CommonDatasetSettings implements ICollapsible {
    // Used in template
    public header = ClientResources.datasetPropertiesCollapsibleTitle;
    public isExpanded = ko.observable(true);
    public iconFirst = true;
    public datasetName: FormFields.ValidatedBoxViewModel<string>;
    public descriptionLabel = ClientResources.Description;
    public description = ko.observable<string>();
    public properties: CommonWizardPage.SchedulerProperties;
    public frequencyIntervalTemplate = frequencyIntervalTemplate;
    public displayCadence = ko.observable(true);

    private entity: EntityStore.IDatasetEntity;

    constructor(groupType: KnockoutObservable<string>, entity: EntityStore.IDatasetEntity) {
        this.entity = entity;

        this.datasetName = new FormFields.ValidatedBoxViewModel({
            label: ClientResources.nameText,
            required: true,
            defaultValue: entity.model.name()
        });

        let properties = entity.model.properties();
        if (properties.description) {
            this.description(properties.description());
        }
        this.properties = new CommonWizardPage.SchedulerProperties();
        this.properties.frequency.value(properties.availability().frequency());
        this.properties.interval.value(properties.availability().interval());
        this.displayCadence(!AppContext.getInstance().authoringPipelineProperties.isOneTimePipeline());

        // In case of existing datasets only the description is editable.
        let isEditable = groupType() !== DataTypeViewModel.GroupType.existingDataset;
        this.datasetName.options.enabled(isEditable);
        this.properties.frequency.options.enabled(isEditable);
        this.properties.interval.options.enabled(isEditable);
    }

    public saveChanges(): void {
        let model = this.entity.model;
        model.name(this.datasetName.value());
        let properties = model.properties();
        if (this.description()) {
            if (!properties.description) {
                properties.description = ko.observable<string>();
            }
            properties.description(this.description());
        }
        properties.availability().frequency(this.properties.frequency.value());
        properties.availability().interval(this.properties.interval.value());
    }
}

class HierarchicalSettings extends Framework.Disposable.RootDisposable {
    public linkedService = ko.observable<ILinkedServiceSettings>();
    public blobStorage = ko.observable<IBlobStorageSettings>();
    public advancedSettings = ko.observable<IAdvancedHierarchicalSettings>();
    public schemaSettings = ko.observable<ISchemaSettings>();
    public previewSettings = ko.observable<IPreviewSettings>();

    constructor(groupType: KnockoutObservable<string>, entity: EntityStore.IDatasetEntity, linkedServiceType: string) {
        super();
        if (groupType() !== DataTypeViewModel.GroupType.existingDataset) {
            this.linkedService(new LinkedServiceSettings(groupType, entity, linkedServiceType));
        }

        this.advancedSettings(new AdvancedHierarchicalSettings(groupType, entity));

        // In case of existing datasets, create connectible here, else get it from linkedServiceSettings.
        let connectible: KnockoutComputed<FormRender.IConnectible> = ko.pureComputed(() => {
            if (groupType() === DataTypeViewModel.GroupType.existingDataset) {
                let entityStore = AppContext.getInstance().authoringEntityStore;
                let linkedService = <EntityStore.ILinkedServiceEntity>entityStore.getEntity(entity.metadata.linkedServiceKey);
                if (!linkedService) {
                    return null;
                }
                let enhancedLinkedService = LinkedServicesViewModel.getEnhancedLinkedService(ko.toJS(linkedService.model));

                return <FormRender.IConnectible>{
                    linkedServiceName: enhancedLinkedService.linkedService.name,
                    dataType: enhancedLinkedService.dataType,
                    formFields: <FormRender.IFormField[]>[]
                };
            } else {
                return this.linkedService().connectible();
            }
        });
        this._lifetimeManager.registerForDispose(connectible);

        this.blobStorage(new BlobStorageSettings(groupType, entity, connectible));
        this._lifetimeManager.registerForDispose(this.blobStorage());

        this.schemaSettings(new SchemaSettings(groupType, entity));
        this.previewSettings(new PreviewSettings(groupType, entity, this.blobStorage().blobBrowserDsr, this.advancedSettings().fileFormat));
    }

    public saveChanges(): void {
        if (this.linkedService()) {
            this.linkedService().saveChanges();
        }
        this.blobStorage().saveChanges();
        this.advancedSettings().saveChanges();
        this.schemaSettings().saveChanges();
    }
}

interface ILinkedServiceSettings extends ISaveChanges {
    connectible: KnockoutObservable<FormRender.IConnectible>;
}

class LinkedServiceSettings implements ICollapsible, ILinkedServiceSettings {
    private static newLinkedServiceOption: FormFields.IOption = {
        displayText: ClientResources.newLinkedServiceText,
        value: "New linked service"     // Value with spaces, so as to avoid collisions with real names.
    };

    public connectible = ko.observable<FormRender.IConnectible>();
    public linkedServiceName = ko.observable<string>();

    // Used in template
    public header = ClientResources.selectLinkedServiceText;
    public isExpanded = ko.observable(false);
    public iconFirst = true;
    public displayList: FormFields.ValidatedSelectBoxViewModel<string>;
    public isNewLinkedService = ko.observable(false);
    // TODO paverma Have a sharing mechanism with powercopytool.
    public newLinkedServiceName: FormFields.ValidatedBoxViewModel<string>;
    public renderedForm = ko.observable<FormRender.IFormRenderingResult>();
    public newLinkedServiceEntity: EntityStore.ILinkedServiceEntity;
    public selectButtonText = ClientResources.chooseText;

    // Select the linked service for the dataset.
    public selectLinkedService = (): void => {
        if (this.displayList.value() === LinkedServiceSettings.newLinkedServiceOption.value) {
            this.newLinkedServiceEntity.metadata.renderedForm = this.renderedForm();
            this.isNewLinkedService(true);
            this.groupType(DataTypeViewModel.GroupType.newDataStore);
        } else {
            this.isNewLinkedService(false);
            this.linkedServiceName(this.displayList.value());
            this.groupType(DataTypeViewModel.GroupType.existingLinkedService);
        }
        this.connectible(this.getConnectible());
    };

    private groupType: KnockoutObservable<string>;
    private linkedServiceType: string;
    private datasetEntity: EntityStore.IDatasetEntity;

    constructor(groupType: KnockoutObservable<string>, entity: EntityStore.IDatasetEntity, linkedServiceType: string) {
        this.groupType = groupType;
        this.linkedServiceType = linkedServiceType;
        this.datasetEntity = entity;

        let optionList = ko.observableArray<FormFields.IOption>();
        // We don't need any validation here, but the validated select box has better type checking.
        this.displayList = new FormFields.ValidatedSelectBoxViewModel<string>(optionList, {
            label: ""
        });

        // Load options in the linked service list.
        let entityStore = AppContext.getInstance().authoringEntityStore;
        let tempOptionList = entityStore.getEntitiesOfType<EntityStore.ILinkedServiceEntity>(BaseEncodable.EncodableType.LINKED_SERVICE).filter((linkedServiceEntity) => {
            return linkedServiceEntity.model.properties().type() === LinkedServiceModel.Type.AzureStorage;
        }).map((linkedServiceEntity) => {
            return {
                displayText: linkedServiceEntity.model.name(),
                value: linkedServiceEntity.model.name()
            };
        });
        optionList([LinkedServiceSettings.newLinkedServiceOption].concat(tempOptionList));

        // Initialize the new linked service object. Use the old form if it exists.
        if (entity.metadata.linkedServiceKey) {
            let linkedServiceEntity = entityStore.getEntity(entity.metadata.linkedServiceKey);
            if (linkedServiceEntity.metadata.authoringState === EntityStore.AuthoringState.DRAFT) {
                this.newLinkedServiceEntity = <EntityStore.ILinkedServiceEntity>linkedServiceEntity;
            }
        }
        if (!this.newLinkedServiceEntity) {
            this.newLinkedServiceEntity = createNewAzureBlobLinkedService();
        }

        // Update the default list option.
        if (this.groupType() === DataTypeViewModel.GroupType.newDataStore) {
            optionList()[0].isDefault = true;
            this.isNewLinkedService(true);
        } else {
            let linkedServiceEntity = entityStore.getEntity(entity.metadata.linkedServiceKey);
            optionList().forEach((linkedServiceOption) => {
                if (linkedServiceOption.value === linkedServiceEntity.model.name()) {
                    linkedServiceOption.isDefault = true;
                }
            });
        }

        this.newLinkedServiceName = new FormFields.ValidatedBoxViewModel({
            defaultValue: this.newLinkedServiceEntity.model.name(),
            label: "Linked service name"
        });

        Framework.Util.subscribeAndCall(this.isNewLinkedService, (() => {
            // TODO paverma Currently hardcoded for blob, but need to pump this value from left pane selection.
            let savedRenderedForm = this.newLinkedServiceEntity.metadata.renderedForm;
            if (savedRenderedForm) {
                this.renderedForm(savedRenderedForm);
                this.connectible(this.getConnectible());
            } else {
                this.renderedForm(FormRender.renderForm(this.linkedServiceType));
            }
        }));
    }

    // We save the form as it is and will leverage PCT's JSON generator for deploying it. We don't need a known interface, since we have no story of
    // editing linked services.
    public saveChanges(): void {
        let entityStore = AppContext.getInstance().authoringEntityStore;
        if (this.isNewLinkedService()) {
            // TODO paverma We wll leak linked service entities here, if in the subsequent update user selects an existing linked service.
            let key = entityStore.addEntity(this.newLinkedServiceEntity);
            this.datasetEntity.metadata.linkedServiceKey = key;

            let linkedServiceMetadata = this.newLinkedServiceEntity.metadata;
            // TODO paverma This will also save unwanted changes (the ones for which the save button was pressed).
            linkedServiceMetadata.renderedForm = this.renderedForm();
            linkedServiceMetadata.deploymentObject = FormRender.fillObjectTemplate(
                PctConfiguration.copyConfig[this.linkedServiceType].linkedServiceTemplate, this.renderedForm().formFields);
            (<LinkedServiceModel.ILinkedServiceTemplate<Object>>linkedServiceMetadata.deploymentObject).name = this.newLinkedServiceName.value();
        } else {
            let linkedServiceEntityStoreObject = entityStore.getEntityByNameAndType(this.linkedServiceName(), BaseEncodable.EncodableType.LINKED_SERVICE);
            this.datasetEntity.metadata.linkedServiceKey = linkedServiceEntityStoreObject.key;
        }
        this.datasetEntity.model.properties().linkedServiceName(entityStore.getEntity(this.datasetEntity.metadata.linkedServiceKey).model.name());
    }

    private getConnectible(): FormRender.IConnectible {
        if (this.groupType() === DataTypeViewModel.GroupType.existingLinkedService) {
            let entityStore = AppContext.getInstance().authoringEntityStore;
            let linkedService = <EntityStore.ILinkedServiceEntity>entityStore.getEntityByNameAndType(this.linkedServiceName(), BaseEncodable.EncodableType.LINKED_SERVICE).value;
            let enhancedLinkedService = LinkedServicesViewModel.getEnhancedLinkedService(ko.toJS(linkedService.model));

            return <FormRender.IConnectible>{
                linkedServiceName: enhancedLinkedService.linkedService.name,
                dataType: enhancedLinkedService.dataType,
                formFields: <FormRender.IFormField[]>[]
            };
        } else if (this.groupType() === DataTypeViewModel.GroupType.newDataStore) {
            return <FormRender.IConnectible>{
                linkedServiceName: null,
                dataType: this.linkedServiceType,
                region: this.renderedForm().region(),
                formFields: this.renderedForm().formFields
            };
        }
        return null;
    }
}

export interface IBlobStorageSettings extends Framework.Disposable.IDisposable, ISaveChanges {
    blobBrowser: KnockoutObservable<BlobBrowser.BlobBrowser>;
    blobBrowserDsr: KnockoutObservable<string>;
}

class BlobStorageSettings extends Framework.Disposable.RootDisposable implements ICollapsible, IBlobStorageSettings {
    public blobBrowserDsr = ko.observable<string>();

    // used in template
    public header: string;
    public isExpanded = ko.observable(false);
    public blobBrowser = ko.observable<BlobBrowser.BlobBrowser>();
    public iconFirst = true;
    public hideMessage = ko.observable<string>();
    public folderPathLabel = ClientResources.folderPathText;
    public filenameLabel = ClientResources.filenameText;
    public folderPath = ko.observable<string>().extend({ rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });
    public filename = ko.observable<string>().extend({ rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });
    public browseButtonLabel = ClientResources.browseBlobText;
    public hierarchicalPartitionTemplate = hierarchicalPartitionTemplate;
    public partitions = ko.observableArray<PctCommon.IPartition>([]);
    public isOneTime: KnockoutComputed<boolean>;

    public toggleBlobBrowser = () => {
        this.showBlobBrowser(!this.showBlobBrowser());
    };

    private blobBrowserPath = ko.observable<string>();
    private showBlobBrowser = ko.observable(false);
    private datasetEntity: EntityStore.IDatasetEntity;

    constructor(groupType: KnockoutObservable<string>, datasetEntity: EntityStore.IDatasetEntity, datasetConnectible: KnockoutComputed<FormRender.IConnectible>) {
        super();
        this.datasetEntity = datasetEntity;

        let datasetTypeProperties = datasetEntity.model.properties().typeProperties();
        if (datasetTypeProperties.folderPath) {
            this.folderPath(datasetTypeProperties.folderPath());
        }
        if (datasetTypeProperties.fileName) {
            this.filename(datasetTypeProperties.fileName());
        }
        if (datasetTypeProperties.partitionedBy) {
            let partitions: PctCommon.IPartition[] = datasetTypeProperties.partitionedBy().map((datasetPartition) => {
                return <PctCommon.IPartition>{
                    name: datasetPartition.name(),
                    type: datasetPartition.value().type(),
                    format: ko.observable(datasetPartition.value().format()),
                    date: datasetPartition.value().date()
                };
            });
            this.partitions(partitions);
        }

        if (groupType() === DataTypeViewModel.GroupType.existingDataset) {
            this.header = ClientResources.updateInputFileFolderText;
        } else {
            this.header = ClientResources.chooseInputFileFolderText;
        }

        this.isOneTime = AppContext.getInstance().authoringPipelineProperties.isOneTimePipeline;

        let currentConnectibleLifetime: Framework.Disposable.IDisposableLifetimeManager;
        this._lifetimeManager.registerForDispose(Framework.Util.subscribeAndCall(datasetConnectible, (connectible) => {
            if (currentConnectibleLifetime) {
                currentConnectibleLifetime.dispose();
            }
            if (!connectible) {
                this.hideMessage(ClientResources.selectLinkedServiceForStorageMessage);
                this.blobBrowser(null);
                return;
            }

            currentConnectibleLifetime = this._lifetimeManager.createChildLifetime();
            this.blobBrowser(new BlobBrowser.BlobBrowser(this.showBlobBrowser, this.blobBrowserPath, this.blobBrowserDsr));
            this.blobBrowser().initialize(connectible);
            this.hideMessage(null);

            currentConnectibleLifetime.registerForDispose(this.blobBrowserPath.subscribe((chosenBlobPath) => {
                if (this.blobBrowser().directorySelected()) {
                    this.folderPath(chosenBlobPath);
                    this.filename(null);
                } else {
                    let splitPath = PctCommon.splitFilePath(chosenBlobPath);
                    this.folderPath(splitPath.folder);
                    this.filename(splitPath.file);
                }
            }));

            currentConnectibleLifetime.registerForDispose(ko.computed(() => {
                this.folderPath();
                this.filename();
                ko.utils.ignoreDependencies(() => {
                    this.partitions(PctCommon.createPartitionsForPath(this.folderPath() + "/" + this.filename(), this.partitions()));
                });
            }));
        }));
    }

    public saveChanges(): void {
        let typeProperties = this.datasetEntity.model.properties().typeProperties();
        let stringPropertyNames = ["folderPath", "fileName"];
        stringPropertyNames.forEach((propertyName) => {
            if (Framework.Util.koPropertyHasValue(this[propertyName])) {
                if (!typeProperties[propertyName]) {
                    typeProperties[propertyName] = ko.observable<string>();
                }
                typeProperties[propertyName](this[propertyName]());
            }
        });

        if (this.partitions().length > 0) {
            if (!typeProperties.partitionedBy) {
                typeProperties.partitionedBy = ko.observableArray([]);
            }
            let partitionedBy: MdpExtension.DataModels.DataArtifactPartitionType[] = this.partitions().map((partition) => {
                return <MdpExtension.DataModels.DataArtifactPartitionType>{
                    name: ko.observable(partition.name),
                    value: ko.observable({
                        date: ko.observable(partition.date),
                        format: ko.observable(partition.format()),
                        type: ko.observable(partition.type)
                    })
                };
            });
            typeProperties.partitionedBy(partitionedBy);
        }
    }
}

interface IAdvancedHierarchicalSettings extends ISaveChanges {
    fileFormat: FileFormatViewModel;
}

class AdvancedHierarchicalSettings implements ICollapsible, IAdvancedHierarchicalSettings {
    // Used in template.
    public header = ClientResources.advancedSettingsText;
    public isExpanded = ko.observable(false);
    public iconFirst = true;
    public fileFormat: FileFormatViewModel;

    constructor(groupType: KnockoutObservable<string>, entity: EntityStore.IDatasetEntity) {
        this.fileFormat = new FileFormatViewModel(true);
        let typeProperties = entity.model.properties().typeProperties();
        if (typeProperties.format) {
            this.fileFormat.setProperties(ko.toJS(entity.model.properties().typeProperties().format()));
        }
    }

    public saveChanges(): void {
        // TODO paverma Save to the model.
    }
}

let columnTypes: string[] = [
    "String",
    "Int16",
    "Int32",
    "Int64",
    "Single",
    "Double",
    "Decimal",
    "Guid",
    "Boolean",
    "Enum",
    "Datetime",
    "DateTimeOffset",
    "Timespan",
    "Byte[]"
];

let columnTypeOptions: KnockoutObservableArray<FormFields.IOption> = ko.observableArray(columnTypes.map((columnType) => {
    return <FormFields.IOption>{
        value: columnType,
        displayText: columnType
    };
}));

interface IColumnRow {
    name: FormFields.ValidatedBoxViewModel<string>;
    type: FormFields.ValidatedSelectBoxViewModel<string>;
    description: FormFields.ValidatedBoxViewModel<string>;
}

interface ISchemaSettings extends ISaveChanges {
}

class SchemaSettings implements ICollapsible, ISchemaSettings {
    // Used in template
    public header = ClientResources.schemaTitle;
    public isExpanded = ko.observable(false);
    public iconFirst = true;
    public columnRows = ko.observableArray<IColumnRow>();
    public addNewColumnText = ClientResources.addNewColumnText;
    public closeIcon = Framework.Svg.close;

    public addNewColumn = () => {
        this.columnRows.push(this.createNewColumnRow());
    };
    public removeRow = (row: IColumnRow) => {
        this.columnRows.remove(row);
    };

    private entity: EntityStore.IDatasetEntity;

    constructor(groupType: KnockoutObservable<string>, entity: EntityStore.IDatasetEntity) {
        this.entity = entity;

        let datasetColumns = entity.model.properties().structure;
        if (datasetColumns) {
            let columnRows = datasetColumns().map((datasetColumnRow) => {
                return this.createNewColumnRow(datasetColumnRow.name, datasetColumnRow.type, datasetColumnRow.description);
            });
            this.columnRows(columnRows);
        }
    }

    public getStructure(): MdpExtension.DataModels.DataElement[] {
        return this.columnRows().map((columnRow) => {
            return <MdpExtension.DataModels.DataElement>{
                name: ko.observable(columnRow.name.value()),
                type: ko.observable(columnRow.type.value()),
                description: ko.observable(columnRow.name.value())
            };
        });
    }

    public saveChanges(): void {
        this.entity.model.properties().structure(this.getStructure());
    }

    private createNewColumnRow(name?: KnockoutObservable<string>, type?: KnockoutObservable<string>, description?: KnockoutObservable<string>): IColumnRow {
        return <IColumnRow>{
            name: new FormFields.ValidatedBoxViewModel<string>({
                defaultValue: name && name(),
                label: "",
                placeholder: ClientResources.columnNameText
            }),
            type: new FormFields.ValidatedSelectBoxViewModel<string>(columnTypeOptions, {
                label: "",
                defaultValue: type && type()
            }),
            description: new FormFields.ValidatedBoxViewModel<string>({
                defaultValue: description && description(),
                label: "",
                placeholder: ClientResources.columnDescriptionOptionalText
            })
        };
    }
}

interface IPreviewSettings {
}

class PreviewSettings implements ICollapsible, IPreviewSettings {
    // Used in template
    public header = ClientResources.previewTitle;
    public isExpanded = ko.observable(false);
    public iconFirst = true;
    public previewTabTitle = ClientResources.previewTitle;

    constructor(groupType: KnockoutObservable<string>, entity: EntityStore.IDatasetEntity, dsr: KnockoutObservable<string>, fileFormat: FileFormatViewModel) {
        // TODO paverma Load schema using the blob browser.
    }
}

class RelationalSettings {
    // TOOD paverma Add setup for tables here.
}

export function createNewDatasetEntity(): DatasetEntity {
    let defaultType = DatasetModel.Default.properties.type;
    let defaultDatasetName = defaultType + AppContext.getInstance().authoringHandler.addNodeType(defaultType);

    let model: MdpExtension.DataModels.DatasetAuthoring = {
        name: ko.observable(defaultDatasetName),
        properties: ko.observable({
            description: ko.observable<string>(),
            type: ko.observable<string>(DatasetModel.Default.properties.type),
            availability: ko.observable({
                frequency: ko.observable(DatasetModel.Availability.Frequency.Minute),
                interval: ko.observable(15)
            }),
            linkedServiceName: ko.observable<string>(),
            structure: ko.observableArray([]),
            /* tslint:disable:no-any Will get rid of this as part of next checkin to get dataset entity for deploying */
            typeProperties: <any>ko.observable({})
            /* tslint:enable:no-any */
        })
    };

    return new DatasetEntity(BaseEncodable.EncodableType.TABLE, model, {
        authoringState: EntityStore.AuthoringState.DRAFT,
        linkedServiceKey: null,
        icon: ko.pureComputed(() => {
            return DatasetHelper.getDatasetIcon(model.properties().type());
        }),
        modelState: EntityStore.ModelState.COMPLETE         // Since we should be able to fill in most of the details.
    });
}

export function createNewAzureBlobLinkedService(): LinkedServiceEntity {
    let type = LinkedServiceModel.Type.AzureStorage;
    let defaultName = type + AppContext.getInstance().authoringHandler.addNodeType(type);

    /* tslint:disable:no-any Will get rid of this in subsquent checkin when the objet would be complete */
    let model: MdpExtension.DataModels.GenericLinkedService = <any>{
        /* tslint:enable:no-any */
        name: ko.observable(defaultName),
        properties: ko.observable({
            type: ko.observable(type)
        })
    };

    return new LinkedServiceEntity(BaseEncodable.EncodableType.LINKED_SERVICE, model, {
        authoringState: EntityStore.AuthoringState.DRAFT
    });
}
