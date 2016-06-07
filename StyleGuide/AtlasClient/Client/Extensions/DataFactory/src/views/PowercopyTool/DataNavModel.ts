/// <amd-dependency path="text!./images/ProgressRing.svg" />
/// <amd-dependency path="text!./templates/HierarchicalLocationTemplate.html" />
/// <amd-dependency path="text!./templates/HierarchicalPartitionTemplate.html" name="hierarchicalPartitionTemplate" />
/// <amd-dependency path="text!./templates/TableListSourceLocationTemplate.html" />
/// <amd-dependency path="text!./templates/PreviewAndSchemaTemplate.html" />
/// <amd-dependency path="text!./templates/CustomQueryTemplate.html" />
/// <amd-dependency path="text!./templates/TableMappingTemplate.html" />

let hierarchicalPartitionTemplate: string;

/* tslint:disable:no-unused-variable */
import Common = require("./Common");
import Constants = require("./Constants");
import DataTypeConstants = require("./DataTypeConstants");
import Configuration = require("./Configuration");
import FormRender = require("./FormRender");
import FormField = FormRender.IFormField;
import IFactoryEntitiesQuery = Common.IFactoryEntitiesQuery;
import getLastSegment = FormRender.getLastSegment;
import requiredValidation = Common.requiredValidation;
import IColumn = Common.IColumn;
import IPartition = Common.IPartition;
import ISelectable = Common.ISelectable;
import INamed = Common.IEntity;
import dots = Common.dots;
import Validation = require("../../bootstrapper/Validation");
import FormFields = require("../../bootstrapper/FormFields");
import ValidatedSelectBoxViewModel = FormFields.ValidatedSelectBoxViewModel;
import JQueryUIBindingHandlers = require("../../bootstrapper/JQueryUIBindings");
import Net = require("./Net");
import FactoryEntities = require("./FactoryEntities");
import EntityType = require("./EntityType");
import BlobBrowserModule = require("./BlobBrowser");
import BlobBrowser = BlobBrowserModule.BlobBrowser;
import DataTypeViewModelModule = require("./DataTypeViewModel");
import DataTypeViewModel = DataTypeViewModelModule.DataTypeViewModel;
import FileFormat = require("./FileFormatViewModel");
import FileFormatViewModel = FileFormat.FileFormatViewModel;
import NetTypes = require("./NetTypes");
import SourceTableViewModelModule = require("./SourceTableViewModel");
import SourceTableViewModel = SourceTableViewModelModule.SourceTableViewModel;
import Gateway = require("./GatewayViewModel");
import ValidationFields = require("../../bootstrapper/FormFields");
import TableViewModel = require("./TableViewModel");
import CredentialEncryption = require("./CredentialEncryption");
/* tslint:enable:no-unused-variable */
import Framework = require("../../_generated/Framework");
import DateTime = Framework.Datetime;
/* tslint:disable:no-var-requires */
export const progressRing: string = require("text!./images/ProgressRing.svg");
export const tableListItem: string = require("text!./templates/TableListItemTemplate.html");
/* tslint:enable:no-var-requires */

let logger = Framework.Log.getLogger({
    loggerName: "DataNavModel",
    category: "PowercopyTool"
});

interface ISourceDestinationFilePath {
    isFileSource: boolean;
    multiTable: boolean;
    folder: string;
    file: string;
    partitions: IPartition[];
    isBinaryCopy: boolean;
}

interface IPathAndDsr {
    path: string;
    dsr: string;
}

export class DataNavModel {
    public static hierarchicalLocationTemplate: string = require("text!./templates/HierarchicalLocationTemplate.html");
    public static tableListSourceLocationTemplate: string = require("text!./templates/TableListSourceLocationTemplate.html");
    public static previewAndSchemaTemplate: string = require("text!./templates/PreviewAndSchemaTemplate.html");
    public static customQueryTemplate: string = require("text!./templates/CustomQueryTemplate.html");

    public static tableMappingTemplate: string = require("text!./templates/TableMappingTemplate.html");
    public hierarchicalPartitionTemplate = hierarchicalPartitionTemplate;

    public dataType: KnockoutObservable<string> = ko.observable<string>();

    public tableListSource = ko.computed(() => {
        if (!this.dataType()) {
            return false;
        } else {
            return Configuration.copyConfig[this.dataType()].dataSourceType === Configuration.DataSourceType.TableList;
        }
    });
    public locationTemplate: KnockoutComputed<string>;
    public subheaderText = ko.computed(() => {
        if (!this.dataType()) {
            return undefined;
        }
        return Configuration.copyConfig[this.dataType()].displayText;
    });
    public newConnectionTitle = ko.computed(() => {
        if (!this.dataType()) {
            return undefined;
        }
        return Configuration.copyConfig[this.dataType()].newConnectionText;
    });
    public onPremises = ko.computed(() => {
        if (!this.dataType()) {
            return undefined;
        } else {
            return Configuration.copyConfig[this.dataType()].onPremises;
        }
    });
    public resultingFolderPath: KnockoutComputed<string>;
    public resultingFilenameSuffix: KnockoutComputed<string>;
    public resultingFileName = ko.observable<string>();
    public createVariable: () => void;
    public blobBrowser: BlobBrowser;
    public showBlobBrowser: KnockoutObservable<boolean>;
    public toggleBlobBrowser: () => void;
    public chooseFileInBlobBrowser: () => void;
    public partitions: KnockoutObservableArray<IPartition> = ko.observableArray<IPartition>();
    public loadAndParseBlob: () => void;
    public isDirectory = ko.observable(false);
    public blobTable = ko.observableArray<KnockoutObservableArray<string>>();
    public blobPathBase = "";
    public blobName = "";
    public selectBlob: () => void;
    public navigateBack: () => void;
    public tableList = ko.observableArray<ISelectable<SourceTableViewModel>>();
    /* tslint:disable:member-ordering */
    private selectedTables = ko.computed(() => this.tableList().filter(tbl => tbl.selected()));

    public preview = ko.observable<FormRender.IPreview>();
    /* tslint:enable:member-ordering */
    public schema = ko.observable<IColumn[]>();
    public winJsTableList = new TableViewModel.TableListViewModel(this.tableList);
    public getPreviewAndSchema: (table: SourceTableViewModel) => Q.Promise<void>;
    public getSchema: (table: SourceTableViewModel) => Q.Promise<IColumn[]>;

    public gateway = new Gateway.GatewayViewModel;
    public showGatewayPopup = () => {
        this.gateway.show().then(
            (gatewayName) => {
                // Refresh the gateway list
                let gatewayForm = FormRender.getFieldByName(this.formFields(), "gateway");
                let box = <ValidatedSelectBoxViewModel<string>>gatewayForm.box;

                Net.armService.listGateways({
                    factoryName: FactoryEntities.factoryName,
                    subscriptionId: FactoryEntities.subscriptionId,
                    resourceGroupName: FactoryEntities.resourceGroup
                }).then((result: FormRender.IGatewayResponseWrapper) => {
                    let onlineGateways = result.value.filter(r => r.properties.status === "Online");
                    let gatewayOptions: ValidationFields.IOption[] = onlineGateways.map(g => { return { value: g.name, displayText: g.name }; });
                    box.optionList(gatewayOptions);
                });

                // Set the dropdown value
                box.value(gatewayName);
            },
            (failureMessage) => {
                // TODO logging for when we do powercopytool logging
            });
    };
    public tableListOptions: KnockoutObservableArray<FormFields.IOption> = ko.observableArray([{
        value: "",
        displayText: "Loading..."
    }]);
    public tableSelect = new FormFields.ValidatedSelectBoxViewModel<string>(this.tableListOptions, {
        label: "Select destination table",
        required: true,
        validations: [requiredValidation]
    });
    public formFields = ko.observableArray<FormField>();
    public isSource: boolean;
    public dataTypeViewModel: DataTypeViewModel;
    public progressRing: string = progressRing;

    public connectionValidatable = ko.observable<Validation.IValidatable>();

    public renderLocation: () => void;
    public tablesLoadedDefered = Q.defer<void>();
    public linkedService: INamed;
    public loadTablesSchemas: () => Q.Promise<void[]>;

    public loading = ko.observable(false);
    /* tslint:disable:no-any */
    public sqlInfo: any;
    /* tslint:enable:no-any */
    public previewSelected = ko.observable(true);

    public loadingTablesMessage = ko.computed(() => {
        return "Loading tables. Please wait" + dots();
    });
    public previewLoading = ko.observable(false);
    public schemaLoading = ko.observable(false);
    public incrementalUpdate = ko.observable(true);
    public timeBasedFilterValidateable = ko.observable<Validation.IValidatable>();

    public newLinkedServiceName = new FormFields.ValidatedBoxViewModel<string>({
        label: "Linked service name",
        infoBalloon: "Name of the Azure Data Factory linked service that will be created.",
        required: true,
        validations: [requiredValidation, Common.regexValidation(FactoryEntities.entityNameRegex), FactoryEntities.nameAvailableValidation(EntityType.linkedService)]
    });
    public selectedLinkedServiceName: KnockoutObservable<string>;

    public datasetName = new FormFields.ValidatedBoxViewModel<string>({
        label: "Dataset name",
        infoBalloon: "Name of the Azure Data Factory dataset that will be created",
        required: true,
        validations: [requiredValidation, Common.regexValidation(FactoryEntities.entityNameRegex), FactoryEntities.nameAvailableValidation(EntityType.table)]
    });

    public datasetPrefix = new FormFields.ValidatedBoxViewModel<string>({
        label: "Dataset name prefix",
        infoBalloon: "In case when multiple datasets are created they will be named with the same prefix",
        required: true,
        validations: [requiredValidation, Common.regexValidation(FactoryEntities.entityNameRegex), (prefix) => FactoryEntities.prefixAvailabilityValidation(EntityType.table, prefix)]
    });

    public usePrefix: KnockoutObservableBase<boolean>;

    public minimumSizeInMb = new FormFields.ValidatedBoxViewModel<number>({
        label: "Minimum size in MB",
        infoBalloon: "Validation will fail if amount of data is lower than the specified value",
        required: false,
        validations: [(value) => Validation.isNumber(value)]
    });

    public minimumRows = new FormFields.ValidatedBoxViewModel<number>({
        label: "Minimum rows",
        infoBalloon: "Validation will fail if number of rows is lower than specified",
        required: false,
        validations: [(value) => Validation.isNumber(value)]
    });

    public dataDelay = new FormFields.ValidatedBoxViewModel<string>({
        label: "Data delay",
        infoBalloon: "Data delay",
        defaultValue: "00:00:00",
        required: false
    });

    public maximumRetry = new FormFields.ValidatedBoxViewModel<number>({
        label: "Maximum retry",
        infoBalloon: "Maximum retry",
        required: false
    });

    public retryInterval = new FormFields.ValidatedBoxViewModel<string>({
        label: "Retry interval",
        infoBalloon: "Retry interval",
        defaultValue: "00:00:00",
        required: false
    });

    public retryTimeout = new FormFields.ValidatedBoxViewModel<string>({
        label: "Retry timeout",
        infoBalloon: "Retry timeout",
        defaultValue: "00:00:00",
        required: false
    });

    public advancedDatasetSettingsVisible = ko.observable(false);

    public sizeValidation = ko.computed(() => {
        return this.tableListSource() ? this.minimumRows.value() : this.minimumSizeInMb.value();
    });

    public recursiveCopy = ko.observable(false);
    /* tslint:disable:no-unused-variable */
    private binaryCopy = ko.observable(false);

    /* tslint:enable:no-unused-variable */
    /* tslint:disable:member-ordering */

    public binaryCopySource: KnockoutComputed<boolean> = null;

    /* tslint:enable:member-ordering */
    public copyBehaviorEnabled = ko.observable(false);
    public copyBehaviorVisible = ko.observable(false);

    public copyBehavior = new ValidatedSelectBoxViewModel<string>(ko.observableArray(Common.copyBehaviorOptions), {
        label: "Copy behavior",
        infoBalloon: "Defines behaviour when copying files from one file system like storage to the other (e.g. from one blob storage to the other)",
        enabled: this.copyBehaviorEnabled,
        visible: this.copyBehaviorVisible
    });

    public fileFormatViewModel: FileFormatViewModel;
    public loadingSchemasMessage = ko.computed(() => {
        return "Loading schemas for selected tables. Please wait" + dots();
    });

    public previewMessage: KnockoutComputed<string>;
    public schemaMessage: KnockoutComputed<string>;

    public useTableList = ko.observable(true);
    public customQueryTable: SourceTableViewModel;

    public datasetPropertiesValidateable = ko.observable<Validation.IValidatable>();
    public previewLoadingFailure = ko.observable("");
    public regionObservable: KnockoutObservable<string>;
    public runtimeRegionObservable: KnockoutObservable<string> = ko.observable<string>("");
    public sourceTableTextWidth = ko.observable<string>();
    public folderPathEmpty: KnockoutComputed<boolean>;
    public pathMatched: KnockoutComputed<boolean>;
    public containerValid: KnockoutComputed<Validation.IValidationResult>;
    public folderPathDirty = ko.observable(false);
    public fileFormatDefinedValidateable: Validation.IValidatable;
    public tableListValidateable: Validation.IValidatable;
    public get isOneTimePipeline(): boolean {
        return this.isOneTime();
    }
    public isFileShareDataType = ko.computed(() => this.dataType() === DataTypeConstants.fileShare);

    private folderPath = ko.observable("");

    private originalFolderPath = ko.observable<string>();
    private originalPathDsr = ko.observable<string>();

    private _cachedFormFields: { [dataType: string]: FormRender.IFormRenderingResult } = {};

    private previewFile = ko.observable<string>();
    private loadBlob: (path: IPathAndDsr) => void;
    private previewRequestId = 0;

    private labelIdCounter = 0;
    private pipelineDateRange: DateTime.IDateRange;

    private connectible: KnockoutComputed<FormRender.IConnectible>;

    private isOneTime: KnockoutObservableBase<boolean>;
    private filename = ko.observable<string>();
    private filenameSubscription: KnockoutSubscription<string>;
    private filenameEnabled = ko.observable(false);
    private fileSuffixEnabled = ko.observable(true);
    private fileSuffix = ko.observable(".txt");
    private folderText: string;
    private sourceFileInfo: ISourceDestinationFilePath;
    // private credentialEncryptor = ko.observable<CredentialEncryption.CredentialEncryptionViewModel>(null);
    private tableLoadRequestId = 0;

    public selectSchema() {
        this.previewSelected(false);
    }

    public selectPreview() {
        this.previewSelected(true);
    }

    public setDatasetDefaultProperties() {
        let name: string = null;
        if (this.dataTypeViewModel.useExistingDataset()) {
            name = this.dataTypeViewModel.existingDatasetViewModel.selectedDataset().model.name;
        } else {
            name = FactoryEntities.getUniqueName(this.isSource ? "InputDataset" : "OutputDataset");
        }
        this.datasetName.value(name);
        this.datasetPrefix.value(FactoryEntities.getUniqueName(this.isSource ? "InputDatasets" : "OutputDatasets"));
    }

    public getConnectionSummary(): string {
        return FormRender.fillStringTemplate(Configuration.copyConfig[this.dataType()].connectionSummaryTemplate, this.formFields());
    }

    public toggleAdvancedDatasetSettingsVisible() {
        this.advancedDatasetSettingsVisible(!this.advancedDatasetSettingsVisible());
    }

    public getExternalDataSettings(): Common.IExternalData {
        return {
            dataDelay: Common.formFieldValue(this.dataDelay),
            maximumRetry: Common.formFieldValue(this.maximumRetry),
            retryInterval: Common.formFieldValue(this.retryInterval),
            retryTimeout: Common.formFieldValue(this.retryTimeout)
        };
    }

    public selectUseTableList() {
        this.useTableList(true);
        this.preview(null);
        this.schema(null);
    }

    public selectUseQuery() {
        this.useTableList(false);
        this.preview(null);
        this.schema(null);
        this.winJsTableList.clearHighlights();
    }

    public doRunQuery(userQuery: Configuration.IUserQuery, queryErrorMessage: KnockoutObservable<string>): Q.Promise<IColumn[]> {
        let templateParameters = userQuery.query.match(/<<[^\s]+>>/gi);
        if (templateParameters) {
            queryErrorMessage("Some parameters in query template have not been replaced: " + templateParameters.join(", "));
            let defer = Q.defer<IColumn[]>();
            defer.reject(undefined);
            return defer.promise;
        }

        this.schema(undefined);
        this.preview(undefined);
        this.previewLoading(true);
        this.schemaLoading(true);
        this.previewRequestId++;

        let requestId = this.previewRequestId;

        let schemaPromise: Q.Promise<IColumn[]> = FormRender.getTableSchema(this.connectible(), undefined, userQuery).then(schema => {
            if (this.previewRequestId === requestId) {
                this.schema(schema);
                this.schemaLoading(false);
                queryErrorMessage("");
            }
            return schema;
        });

        schemaPromise.fail(reason => {
            if (this.previewRequestId === requestId) {
                queryErrorMessage(reason.responseText);
                this.schemaLoading(false);
            }
            throw reason;
        });

        let previewPromise = FormRender.getPreview(this.connectible(), undefined, userQuery).then(preview => {
            if (this.previewRequestId === requestId) {
                this.previewLoading(false);
                this.preview(preview);
            }
        });

        previewPromise.fail(reason => {
            if (this.previewRequestId === requestId) {
                this.previewLoading(false);
            }
            throw reason;
        });
        return schemaPromise;
    }

    public expandSourceTable(sourceTable: SourceTableViewModel) {
        if (sourceTable.expanded()) {
            sourceTable.expanded(false);
        } else {
            this.selectedTables().forEach(tbl => {
                tbl.data.expanded(tbl.data === sourceTable);
            });
        }
    }

    public setDateRange(range: DateTime.IDateRange) {
        this.pipelineDateRange = range;
        this.customQueryTable.setDateRange(range);
    }

    public resultingSourceTables(): SourceTableViewModel[] {
        if (this.useTableList()) {
            return this.selectedTables().map(t => t.data);
        } else {
            return [this.customQueryTable];
        }
    }

    public setSourceInfo(sourceFileInfo: ISourceDestinationFilePath) {
        this.dataTypeViewModel.setFilter(sourceFileInfo.isBinaryCopy);
        this.sourceFileInfo = sourceFileInfo;
        if (this.filenameSubscription) {
            this.filenameSubscription.dispose();
        }

        if ((!sourceFileInfo.isFileSource && sourceFileInfo.multiTable) || sourceFileInfo.isBinaryCopy) {
            this.filenameEnabled(false);
            if (sourceFileInfo.isBinaryCopy) {
                this.filename("Filenames are defined by source");
                this.fileSuffixEnabled(false);
                this.copyBehavior.value(Constants.preserveHierarchy);
                this.copyBehaviorVisible(true);
            } else {
                this.filename("Filename is defined by source table name");
                this.fileSuffixEnabled(true);
                this.copyBehavior.value(undefined);
                this.copyBehaviorVisible(false);
            }
        } else {
            this.copyBehaviorVisible(sourceFileInfo.isFileSource);
            this.filename(sourceFileInfo.file);
            this.folderPath(sourceFileInfo.folder);
            this.filenameEnabled(true);
            this.fileSuffixEnabled(false);
            this.partitions.removeAll();
            sourceFileInfo.partitions.forEach(partition => {
                this.partitions.push({
                    date: partition.date,
                    format: ko.observable(partition.format()),
                    name: partition.name,
                    type: partition.type,
                    formatOptions: partition.formatOptions
                });
            });
            let onFilenameChanged = (fn: string) => {
                if (fn) {
                    this.copyBehaviorEnabled(false);
                    this.copyBehavior.value(undefined);
                } else {
                    this.copyBehaviorEnabled(true);
                }
            };
            onFilenameChanged(this.filename());
            this.filenameSubscription = this.filename.subscribe(onFilenameChanged);
        }
    }

    public setRuntimeRegion(): Q.Promise<string> {
        if (this.onPremises()) {
            this.runtimeRegionObservable("On premise");
        } else if (!this.dataTypeViewModel.useExistingLinkedService()) {
            // TODO alsu can get region from server side
            this.runtimeRegionObservable(this.regionObservable() || "Unknown");
        } else {
            return FormRender.getLinkedServiceRegion(this.connectible()).then(reg => {
                this.runtimeRegionObservable(reg.name);
                return this.runtimeRegionObservable();
            });
        }
        return Q(this.runtimeRegionObservable());
    }

    constructor(isSource: boolean, isOneTime: KnockoutObservableBase<boolean>) {
        this.isSource = isSource;
        this.isOneTime = isOneTime;
        this.customQueryTable = new SourceTableViewModel(this, undefined, undefined, true, false);
        this.fileFormatViewModel = new FileFormatViewModel(this.isSource);
        this.dataTypeViewModel = new DataTypeViewModel(this.dataType, isSource);

        this.binaryCopySource = ko.pureComputed(() => {
            let result: boolean = null;
            if (this.dataTypeViewModel.useExistingDataset()) {
                result = this.dataTypeViewModel.existingDatasetViewModel.isBinaryCopy();
            } else {
                result = this.binaryCopy();
            }
            return !this.tableListSource() && result;
        });

        this.selectedLinkedServiceName = ko.computed(() => {
            switch (this.dataTypeViewModel.groupType()) {
                case DataTypeViewModelModule.GroupType.existingDataset:
                    return this.dataTypeViewModel.existingDatasetViewModel.selectedLinkedServiceName();
                case DataTypeViewModelModule.GroupType.existingLinkedService:
                    return this.dataTypeViewModel.selectedLinkedServiceName();
                case DataTypeViewModelModule.GroupType.newDataStore:
                    return this.newLinkedServiceName.value();
                default:
                    logger.logError("Unexpected group type: " + this.dataTypeViewModel.groupType());
                    return null;
            }
        });
        // TODO rigoutam: we should clean up this code to use a state machine
        this.previewMessage = ko.computed(() => {
            if (this.previewLoading()) {
                return "Loading preview" + dots();
            } else if (this.preview() || !this.useTableList()) {
                if (this.preview() && this.preview().columns.length === 0 && this.preview().rows.length === 0) {
                    return "There is no data to preview";
                } else {
                    return "";
                }
            } else if (this.winJsTableList.getHighlightedCount() === 0) {
                return this.tableListSource() ? "Select a table to see its preview." : "No file has been selected for preview";
            } else {
                return this.tableListSource() ?
                    "Preview failed. Please try again" :
                    "Preview failed.  Please configure the correct file format settings (ex – format, row & column delimeter, header row etc) to view the preview";
            }
        });
        this.schemaMessage = ko.computed(() => {
            if (this.schemaLoading()) {
                return "Loading schema" + dots();
            } else if (this.schema() || !this.useTableList()) {
                if (this.schema() && this.schema().length === 0) {
                    return "File is empty so no schema to show";
                } else {
                    return "";
                }
            } else if (this.winJsTableList.getHighlightedCount() === 0) {
                return this.tableListSource() ? "Select a table to see its schema." : "No file has been selected";
            } else {
                return "Error fetching schema";
            }
        });

        if (this.isSource) {
            this.usePrefix = ko.computed<boolean>(() => this.tableListSource() && this.selectedTables().length > 1);
            this.folderText = "File or folder";
            this.showBlobBrowser = ko.observable(true);
        } else {
            this.folderText = "Folder path";
            this.usePrefix = ko.observable(false);
            this.showBlobBrowser = ko.observable(false);
        }

        let tableListLocationTemplate = DataNavModel.tableListSourceLocationTemplate
            .replace(/%%PREVIEWANDSCHEMA%%/, DataNavModel.previewAndSchemaTemplate).replace(/%%CUSTOMQUERY%%/, DataNavModel.customQueryTemplate);
        let tableMappingTemplate = DataNavModel.tableMappingTemplate.replace(/%%PREVIEWANDSCHEMA%%/, DataNavModel.previewAndSchemaTemplate);

        this.locationTemplate = ko.computed<string>(() => {
            let tableListTemplate = isSource ? tableListLocationTemplate : tableMappingTemplate;
            return this.tableListSource() ? tableListTemplate : DataNavModel.hierarchicalLocationTemplate;
        });

        this.toggleBlobBrowser = () => {
            this.showBlobBrowser(!this.showBlobBrowser());
            this.blobBrowser.render();
        };

        this.blobBrowser = new BlobBrowser(this.showBlobBrowser, this.originalFolderPath, this.originalPathDsr);
        this.originalFolderPath.subscribe(value => {
            if (this.isSource || this.blobBrowser.directorySelected() || !this.filenameEnabled()) {
                this.folderPath(value);
                if (this.filenameEnabled()) {
                    this.filename(undefined);
                }
            } else {
                let pathSplit = Common.splitFilePath(this.originalFolderPath());
                this.folderPath(pathSplit.folder);
                this.filename(pathSplit.file);
            }
        });

        this.resultingFolderPath = ko.computed(() => {
            if (this.dataTypeViewModel.useExistingDataset()) {
                let existingDataset = this.dataTypeViewModel.existingDatasetViewModel;
                this.resultingFileName(existingDataset.resultingFileName());
                return existingDataset.resultingFolderPath();
            }

            if (this.isSource) {
                this.resultingFileName(undefined);
                if (this.folderPath()[this.folderPath().length - 1] === "/") {
                    return this.folderPath();
                }
                if (this.blobBrowser.directorySelected()) {
                    return this.folderPath() + "/";
                } else {
                    let splitPath = Common.splitFilePath(this.folderPath());

                    this.resultingFileName(splitPath.file);
                    return splitPath.folder;
                }
            } else {
                if (this.filenameEnabled()) {
                    this.resultingFileName(this.filename());
                } else {
                    // null means it should not be set, undefined notifies caller to set it to input table name
                    this.resultingFileName(this.sourceFileInfo && this.sourceFileInfo.isBinaryCopy ? null : undefined);
                }
                return this.folderPath();
            }
        });

        this.resultingFilenameSuffix = ko.computed(() => {
            if (!this.isSource && !this.filenameEnabled()) {
                return this.fileSuffix();
            } else {
                return "";
            }
        });

        this.folderPathEmpty = ko.computed(() => this.folderPath().length === 0);

        let processPartitions = () => {
            let path = this.folderPath();
            if (!this.isSource && this.filename()) {
                path += "/" + this.filename();
            }
            if (!this.isSource && !this.filenameEnabled()) {
                path += "/" + this.fileSuffix();
            }
            let newPartitions = Common.createPartitionsForPath(path, this.partitions());
            this.partitions(newPartitions);
            this.folderPathDirty(true);
        };

        this.folderPath.subscribe(value => {
            processPartitions();
        });

        if (!this.isSource) {
            this.filename.subscribe(() => {
                processPartitions();
            });
            this.fileSuffix.subscribe(() => {
                processPartitions();
            });
        }

        let getPathRegex = (path: string, partitions: Common.IPartition[]) => {
            let regexPattern = path.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

            partitions.forEach(p => {
                regexPattern = regexPattern.replace("\\{" + p.name + "\\}", ".+");
            });
            return new RegExp("^" + regexPattern + "$");
        };

        this.pathMatched = ko.computed(() => {
            let folderPathRegex = getPathRegex(this.folderPath(), this.partitions());
            return folderPathRegex.test(this.originalFolderPath());
        });

        this.containerValid = ko.computed(() => {
            let valid = {
                valid: true,
                message: ""
            };
            if (this.dataType() !== DataTypeConstants.blobStorage) {
                return valid;
            } else {
                let containerMatch = this.folderPath().match(/^[^/]+/);
                if (containerMatch) {
                    return {
                        valid: /^[a-z0-9](?:[a-z0-9]|(\-(?!\-))){1,61}[a-z0-9]$/.test(containerMatch[0]),
                        message: `Container name ${containerMatch[0]} is not valid. Can only container lowercase letters, numbers and hyphens,`
                        + " and cannot start or end with hyphen"
                    };
                } else {
                    return valid;
                }
            }
        });

        let filePropertyChangeSubscription: KnockoutDisposable;
        let fileLoadingDefferred = Q.defer<void>();
        this.loadBlob = filePathDsr => {
            if (filePropertyChangeSubscription) {
                filePropertyChangeSubscription.dispose();
            }
            filePropertyChangeSubscription = ko.computed(() => {
                this.previewLoading(true);
                this.schemaLoading(true);

                this.previewRequestId++;
                let filePreviewRequestId = this.previewRequestId;
                this.preview(undefined);
                this.schema(undefined);
                this.previewLoadingFailure("");
                if (fileLoadingDefferred.promise.isFulfilled) {
                    fileLoadingDefferred = Q.defer<void>();
                }
                let previewDsr = filePathDsr.dsr;
                FormRender.getFilePreviewAndSchema(this.connectible(), previewDsr, this.fileFormatViewModel.getProperties()).then((result: FormRender.IPreviewAndSchema) => {
                    if (this.previewRequestId === filePreviewRequestId) {
                        this.preview(result.preview);
                        this.schema(result.schema);
                        this.previewLoading(false);
                        this.schemaLoading(false);
                    }
                }).fail(reason => {
                    if (this.previewRequestId === filePreviewRequestId) {
                        this.preview(undefined);
                        this.schema(undefined);
                        this.previewLoading(false);
                        this.schemaLoading(false);
                        this.previewLoadingFailure("Unable to load preview and schema, please check your settings");
                    }
                }).finally(() => {
                    fileLoadingDefferred.resolve(null);
                });
            });
        };

        this.fileFormatDefinedValidateable = {
            isValid: () => {
                return fileLoadingDefferred.promise.then(() => {
                    let result: Validation.IValidationResult = {
                        valid: !!(this.schema && this.schema() && this.schema().length > 0),
                        message: "File schema is not defined"
                    };
                    return result;
                });
            },
            valid: ko.computed(() => this.schema() && this.schema().length > 0)
        };

        this.loadAndParseBlob = () => {
            let filePathPromise: Q.Promise<IPathAndDsr>;
            this.isDirectory(this.blobBrowser.directorySelected());
            if (this.blobBrowser.directorySelected()) {
                filePathPromise = this.blobBrowser.findFirstFile(this.originalFolderPath(), this.recursiveCopy()).then(firstFileItem => {
                    if (firstFileItem) {
                        return {
                            path: this.originalFolderPath() + "/" + firstFileItem.name,
                            dsr: firstFileItem.datasourceReference
                        };
                    } else {
                        return null;
                    }
                });
            } else {
                filePathPromise = Q<IPathAndDsr>({ path: this.originalFolderPath(), dsr: this.originalPathDsr() });
            }

            return filePathPromise.then(filePathDsr => {
                if (filePathDsr) {
                    this.previewFile(filePathDsr.path);
                    this.loadBlob(filePathDsr);
                } else {
                    fileLoadingDefferred = Q.defer<void>();
                    fileLoadingDefferred.resolve(null);
                    this.preview(null);
                    this.schema(null);
                }
            });
        };

        let connectionValidateableSubscription: KnockoutSubscription<Validation.IValidatable>;
        this.dataType.subscribe(dataType => {
            if (!this._cachedFormFields[this.dataType()]) {
                this._cachedFormFields[this.dataType()] = FormRender.renderForm(this.dataType());
            }
            let renderingResult = this._cachedFormFields[this.dataType()];
            this.formFields(renderingResult.formFields);
            this.regionObservable = renderingResult.region;
            // this.credentialEncryptor(renderingResult.encryptor);
            if (this.onPremises()) {
                this.regionObservable(FactoryEntities.factoryLocation);
            }
            if (this.connectible) {
                this.connectible.dispose();
            }
            this.connectible = ko.computed(() => {
                return {
                    formFields: this.formFields(),
                    dataType: this.dataType(),
                    region: this.regionObservable(),
                    linkedServiceName: this.dataTypeViewModel.useExistingLinkedService() ? this.dataTypeViewModel.selectedLinkedServiceName() : null
                };
            });
            if (connectionValidateableSubscription) {
                connectionValidateableSubscription.dispose();
            }
            connectionValidateableSubscription = renderingResult.validateable.subscribe(validateable => {
                this.connectionValidatable(validateable);
            });
            this.connectionValidatable(renderingResult.validateable());
        });

        this.renderLocation = () => {
            if (this.dataTypeViewModel.createNewDataStore()) {
                this.linkedService = FormRender.fillObjectTemplate(
                    Configuration.copyConfig[this.dataType()].linkedServiceTemplate, this.formFields());
            }

            if (!this.tableListSource()) {
                this.blobBrowser.initialize(this.connectible());
            } else {
                this.preview(null);
                this.schema(null);

                this.tableList.removeAll();
                this.tableListOptions.push({ displayText: "Loading...", value: "" });
                this.loading(true);
                this.tableLoadRequestId++;
                let tableLoadRequestId = this.tableLoadRequestId;
                FormRender.getNavTable(this.connectible()).then(listTablesResponse => {
                    if (tableLoadRequestId === this.tableLoadRequestId) {
                        listTablesResponse.forEach(table => {
                            this.tableList().push(
                                {
                                    data: new SourceTableViewModel(this, table.name, table.datasourceReference, false, this.isOneTime(), this.pipelineDateRange),
                                    selected: ko.observable(false),
                                    id: "tableListItemlabel-" + this.labelIdCounter++
                                });
                        });
                        this.tableList.valueHasMutated();
                        this.tablesLoadedDefered.resolve(undefined);
                    }
                }).fail(reason => {
                    throw "Failed to browse tables: ";
                }).finally(() => {
                    if (tableLoadRequestId === this.tableLoadRequestId) {
                        this.loading(false);
                    }
                });
            }
        };

        // TODO paverma Confirm why are we modifying the datetime columns.
        let populateSchema = (tableAndColumns: SourceTableViewModel, columns: IColumn[]) => {
            tableAndColumns.columns(columns);
            tableAndColumns.dateColumns.removeAll();
            tableAndColumns.dateColumns.push({ value: null, displayText: "None" });
            tableAndColumns.dateColumns.push({ value: "", displayText: "Custom query" });
            let otherOptionCount = tableAndColumns.dateColumns().length;
            columns.forEach(column => {
                if (column.type === NetTypes.dateTime || column.type === NetTypes.dateTimeOffset) {
                    tableAndColumns.dateColumns.push({
                        value: column.name,
                        displayText: column.name
                    });
                }
            });
            if (tableAndColumns.dateColumns().length > otherOptionCount) {
                tableAndColumns.selectedDateColumn(tableAndColumns.dateColumns()[otherOptionCount].value);
            }
        };

        this.loadTablesSchemas = () => {
            let promises: Q.Promise<void>[] = [];
            this.selectedTables().filter(table => table.data.columns().length === 0).forEach(table => {
                if (table.data.columns().length === 0) {
                    promises.push(FormRender.getTableSchema(this.connectible(), table.data.datasourceReference).then(result => {
                        populateSchema(table.data, result);
                    }));
                }
            });
            return Q.all(promises);
        };

        this.getSchema = table => {
            return FormRender.getTableSchema(this.connectible(), table.datasourceReference).then(columns => {
                populateSchema(table, columns);
                return columns;
            });
        };

        if (this.isSource) {
            this.tableListValidateable = {
                isValid: () => {
                    if (this.selectedTables().length === 0) {
                        return Q({
                            valid: false,
                            message: "At least one table should be selected"
                        });
                    }
                    return this.loadTablesSchemas().then(() => {
                        return {
                            valid: true,
                            message: ""
                        };
                    }, reason => {
                        return {
                            valid: false,
                            message: "Could not load schema for one or more tables"
                        };
                    });
                },
                valid: ko.computed(() => {
                    return this.selectedTables().length > 0;
                })
            };
        }

        this.getPreviewAndSchema = previewTable => {
            if (previewTable) {
                this.previewRequestId++;
                let requestId = this.previewRequestId;

                this.preview(null);
                this.schema(null);
                this.previewLoading(true);
                this.schemaLoading(true);
                FormRender.getPreview(this.connectible(), previewTable.datasourceReference).then(preview => {
                    if (requestId === this.previewRequestId) {
                        this.preview(preview);
                    }
                }, (error) => {
                    if (requestId === this.previewRequestId) {
                        this.preview(null);
                    }
                }).finally(() => {
                    if (requestId === this.previewRequestId) {
                        this.previewLoading(false);
                    }
                });

                return this.getSchema(previewTable).then(schema => {
                    if (requestId === this.previewRequestId) {
                        this.schema(schema);
                    }
                }, (error) => {
                    if (requestId === this.previewRequestId) {
                        this.schema(null);
                    }
                }).finally(() => {
                    if (requestId === this.previewRequestId) {
                        this.schemaLoading(false);
                    }
                });
            }
        };

        this.winJsTableList.previewTableObservable.subscribe(this.getPreviewAndSchema);

        this.tableList.subscribe(tables => {
            this.tableListOptions.removeAll();
            this.tableListOptions().push({ value: "", displayText: "-Select table-" });
            tables.forEach(table => {
                this.tableListOptions.push({
                    value: table.data.tableName,
                    displayText: table.data.tableName
                });
            });
        });

        ko.computed(() => {
            let maxLen = 0;
            let selectedTables = this.selectedTables().map(tbl => tbl.data);
            maxLen = selectedTables.reduce((ml, tbl) => Math.max(tbl.tableName.length, ml), maxLen);
            this.sourceTableTextWidth(Common.textLenToPx(maxLen));
            if (this.timeBasedFilterValidateable && this.timeBasedFilterValidateable()) {
                this.timeBasedFilterValidateable().dispose();
            }
            this.timeBasedFilterValidateable(Common.ValidateableMerge(selectedTables, null, "One or more of configured custom queries is invalid"));
        });

        // ko.computed(() => {
        //    let validateableArray = [];
        //    if (this.usePrefix()) {
        //        validateableArray.push(this.datasetPrefix);
        //    } else {
        //        validateableArray.push(this.datasetName);
        //    }
        //    if (this.tableListSource()) {
        //        validateableArray.push(this.minimumRows);
        //    } else {
        //        validateableArray.push(this.minimumSizeInMb);
        //    }
        //    if (this.datasetPropertiesValidateable.peek()) {
        //        this.datasetPropertiesValidateable().dispose();
        //    }
        //    this.datasetPropertiesValidateable(Common.ValidateableMerge(validateableArray));
        // });

        // Setup subscriptions for the existing dataset.
        // TODO paverma Split DataNavModel, so that we can avoid setting up this subscriptions.
        let existingDatasetViewModel = this.dataTypeViewModel.existingDatasetViewModel;
        existingDatasetViewModel.partitions.subscribe((partitions) => {
            this.partitions(partitions);
        });
        existingDatasetViewModel.schema.subscribe((schema) => {
            this.schema(schema);
        });
        existingDatasetViewModel.fileFormat.subscribe((fileFormat) => {
            this.fileFormatViewModel.setProperties(fileFormat);
        });
        existingDatasetViewModel.recursiveCopy.subscribe((recursiveCopy) => {
            this.recursiveCopy(recursiveCopy);
        });
    }
}
