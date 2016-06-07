import FormFields = require("../../bootstrapper/FormFields");
import Configuration = require("./Configuration");
import DataTypeConstants = require("./DataTypeConstants");
import FactoryEntities = require("./FactoryEntities");
import FormRender = require("./FormRender");
import EntityType = require("./EntityType");
import Common = require("./Common");
import Validation = require("../../bootstrapper/Validation");
/* tslint:disable:no-unused-variable */
import DataNavModule = require("./DataNavModel");
import DataNavModel = DataNavModule.DataNavModel;
/* tslint:enable:no-unused-variable */
import Constants = require("./Constants");

let cloudUnitOptions: FormFields.IOption[] = [
    {
        value: undefined,
        displayText: "Auto"
    },
    {
        value: "1",
        displayText: "1"
    },
    {
        value: "2",
        displayText: "2"
    },
    {
        value: "4",
        displayText: "4"
    },
    {
        value: "8",
        displayText: "8"
    }
];

let rejectTypeOptions: FormFields.IOption[] = [
    {
        value: "percentage",
        displayText: "Percentage"
    },
    {
        value: "value",
        displayText: "Value"
    }
];

let parallelCopyOptions: FormFields.IOption[] = [{
    value: undefined,
    displayText: "Auto"
}];
for (let i = 1; i <= 32; i++) {
    let val = i.toString();
    parallelCopyOptions.push({
        value: val,
        displayText: val
    });
}

interface IParellelCopySettings {
    cloudUnits: number;
    parallelCopies: number;
}

interface IPolybaseSettings {
    rejectType: string;
    rejectValue: number;
    rejectSampleValue: number;
    useTypeDefault: boolean;
}

export class PerformancesSettingsViewModel {
    /* tslint:disable:member-ordering */
    // parallel copy
    /* tslint:disable:no-unused-variable */
    private parallelCopyInfo = "Parallel copy settings. Enabled when source and destionation are cloud based file system stores (blob or data lake) and " +
    "when multiple files are copied in single run i.e. folder copy";

    /* tslint:enable:no-unused-variable */
    public getParallelCopyOptions(): IParellelCopySettings {
        if (this.parallelCopyEnabled()) {
            return {
                cloudUnits: parseInt(this.cloudUnits.value(), 10),
                parallelCopies: parseInt(this.parallelCopies.value(), 10)
            };
        } else {
            return {
                cloudUnits: 0,
                parallelCopies: 0
            };
        }
    }

    private parallelCopyEnabled: KnockoutComputed<boolean>;

    private cloudUnits: FormFields.ValidatedSelectBoxViewModel<number>;
    private parallelCopies: FormFields.ValidatedSelectBoxViewModel<number>;

    // staging account
    /* tslint:disable:no-unused-variable */
    private stagingInfo = "Staging account to be used during copy. There are two cases when this is needed:<ul>" +
    "<li>When copying from on-premise data source to SQL Azure" +
    " staging makes copy possible without opening firewall ports on server</li>" +
    "<li>When using polybase to copy data to Azure Sql DW in cases when data is not in the right format</li>" + "</ul><br/>" +
    "Enabled when source is on-premise and destnation is SQL Azure or SQL Azure data warehouse";

    /* tslint:enable:no-unused-variable */
    public stagingLinkedServiceName(): string {
        if (this.stagingAccountEnabled && this.stagingOption.value()) {
            if (this.stagingOption.value() === this.exisingLinkedService) {
                return this.stagingAccountExistingLinkedService.value();
            } else {
                return this.newStorageLinkedServiceName.value();
            }
        }
        return undefined;
    }
    private stagingAccountEnabled: KnockoutComputed<boolean>;

    private exisingLinkedService = "existing";
    private newLinkedService = "newLinkedService";
    private useStaging: FormFields.IOption[] = [
        {
            value: null,
            displayText: "None"
        }, {
            value: this.exisingLinkedService,
            displayText: "Existing linked service"
        }, {
            value: this.newLinkedService,
            displayText: "New linked service"
        }
    ];
    private existingStorageLinkedServiceOptions = ko.observableArray<FormFields.IOption>();
    private stagingOption: FormFields.ValidatedSelectBoxViewModel<string>;
    private stagingAccountExistingLinkedService: FormFields.ValidatedSelectBoxViewModel<string>;
    private connectionFormFields = ko.observableArray<FormRender.IFormField>();
    private newStorageLinkedServiceName = new FormFields.ValidatedBoxViewModel<string>({
        label: "Storage linked service name",
        infoBalloon: "Name of the Azure Data Factory storage linked service that will be created.",
        required: true,
        defaultValue: FactoryEntities.getUniqueName("StagingStorage"),
        validations: [Common.requiredValidation, Common.regexValidation(FactoryEntities.entityNameRegex), FactoryEntities.nameAvailableValidation(EntityType.linkedService)]
    });

    // polybase
    private polybaseEnabled: KnockoutComputed<boolean>;
    /* tslint:disable:no-unused-variable */
    private polybaseInfo = "Polybase enables performant load of data into into SQL data warehouse. " +
    " when destination is SQL data warehouse";
    /* tslint:enable:no-unused-variable */

    private allowPolybase = ko.observable(true);
    private rejectValue: FormFields.ValidatedBoxViewModel<number>;
    private rejectType: FormFields.ValidatedSelectBoxViewModel<string>;
    private rejectSampleValue: FormFields.ValidatedBoxViewModel<number>;
    private useTypeDefault = ko.observable(true);
    private source: DataNavModel;
    private destination: DataNavModel;

    private polybaseStagingRequired(stagingOption: string): Q.Promise<Validation.IValidationResult> {
        let message = "";
        if (!stagingOption && this.polybaseEnabled() && this.allowPolybase()) {
            if (this.source.dataType() !== DataTypeConstants.blobStorage) {
                message = "Source is not blob storage, staging account is required in order to be able to load SQL data warehouse using polybase";
            } else {
                let fileProperties = this.source.fileFormatViewModel.getProperties();
                if (fileProperties.format === Constants.textFormat) {
                    if (fileProperties.rowDelimiter && fileProperties.rowDelimiter !== "\n") {
                        message = "Row delimiter is not \\n";
                    }
                    if (fileProperties.nullValue) {
                        message += ", null value has to be empty string";
                    }
                    if (fileProperties.encodingName && fileProperties.encodingName !== "utf8") {
                        message += ", encoding has to be UTF-8";
                    }
                    if (fileProperties.escapeChar || fileProperties.quoteChar) {
                        message += ", escape character or quote character has been set";
                    }
                    if (fileProperties.compressionType === "BZip2") {
                        message += ", compression is BZip2";
                    }
                    if (message) {
                        message += ". Conditions are not met to run polybase copy directly from blob in text format, please specify staging account";
                    }
                } else {
                    message = "Polybase copy can be run directly from blob only in case when blob is in text format, please specify storage account";
                }
            }
        }
        return Q({ valid: !message, message: message });
    }

    public getPolybaseSettings(): IPolybaseSettings {
        if (this.polybaseEnabled() && this.allowPolybase()) {
            return {
                rejectSampleValue: this.rejectSampleValue.value(),
                rejectType: this.rejectType.value(),
                rejectValue: this.rejectValue.value(),
                useTypeDefault: this.useTypeDefault()
            };
        } else {
            return null;
        }
    }
    public perfSettingsEnabled: KnockoutComputed<boolean>;
    public validateable = ko.observable<Validation.IValidatable>();

    constructor(source: DataNavModel, destination: DataNavModel) {
        this.source = source;
        this.destination = destination;
        let perfSettingsEnabled = localStorage["performanceSettingsEnabled"];
        this.parallelCopyEnabled = ko.computed(() => {
            if (perfSettingsEnabled && source.dataType() && destination.dataType()) {
                let sourceConfig = Configuration.copyConfig[source.dataType()];
                let destConfig = Configuration.copyConfig[destination.dataType()];
                return sourceConfig.dataSourceType === Configuration.DataSourceType.Hierarchical &&
                    destConfig.dataSourceType === Configuration.DataSourceType.Hierarchical &&
                    !sourceConfig.onPremises && !destConfig.onPremises &&
                    source.blobBrowser.directorySelected();
            } else {
                return false;
            }
        });

        this.cloudUnits = new FormFields.ValidatedSelectBoxViewModel<number>(ko.observableArray(cloudUnitOptions), {
            label: "Cloud units",
            enabled: this.parallelCopyEnabled
        });

        this.parallelCopies = new FormFields.ValidatedSelectBoxViewModel<number>(ko.observableArray(parallelCopyOptions), {
            label: "Parallel copies",
            enabled: this.parallelCopyEnabled,
            validations: [val => {
                if (!this.cloudUnits.value() || this.cloudUnits.value() <= val) {
                    return Q({
                        message: "",
                        valid: true
                    });
                } else {
                    return Q({
                        message: "Parallel copies setting has to be greater or equal to cloud unit setting",
                        valid: false
                    });
                }
            }]
        });

        this.cloudUnits.value.subscribe(cloudUnits => {
            if (cloudUnits && this.parallelCopies.value() < cloudUnits) {
                this.parallelCopies.value(cloudUnits);
            }
        });

        this.stagingAccountEnabled = ko.computed(() => {
            if (perfSettingsEnabled && source.dataType() && destination.dataType()) {
                let stagingCondition = Configuration.copyConfig[source.dataType()].onPremises &&
                    (destination.dataType() === DataTypeConstants.sqlAzure || destination.dataType() === DataTypeConstants.sqlDW);
                let polybaseDataConversionCondition = destination.dataType() === DataTypeConstants.sqlDW;
                return stagingCondition || polybaseDataConversionCondition;
            } else {
                return false;
            }
        });

        this.stagingOption = new FormFields.ValidatedSelectBoxViewModel<string>(ko.observableArray(this.useStaging), {
            label: "Use staging account",
            enabled: this.stagingAccountEnabled,
            validations: [this.polybaseStagingRequired.bind(this)]
        });
        this.stagingAccountExistingLinkedService = new FormFields.ValidatedSelectBoxViewModel<string>(this.existingStorageLinkedServiceOptions, {
            label: "Staging account / linked service name",
            enabled: this.stagingAccountEnabled
        });

        this.polybaseEnabled = ko.computed(() => perfSettingsEnabled && destination.dataType() === DataTypeConstants.sqlDW);

        this.rejectValue = new FormFields.ValidatedBoxViewModel<number>({
            label: "Reject value",
            enabled: this.polybaseEnabled,
            validations: [Validation.isNumber]
        });
        this.rejectType = new FormFields.ValidatedSelectBoxViewModel<string>(ko.observableArray(rejectTypeOptions), {
            label: "Reject type",
            enabled: this.polybaseEnabled
        });
        this.rejectSampleValue = new FormFields.ValidatedBoxViewModel<number>({
            label: "Reject Sample value",
            enabled: this.polybaseEnabled,
            validations: [Validation.isNumber]
        });
        FactoryEntities.entityFetchPromiseMap[EntityType.linkedService].then(linkedServices => {
            FactoryEntities.entitiesMap[EntityType.linkedService].filter(entity => entity.properties.type.toLowerCase() === DataTypeConstants.azurestoragelinkedservice)
                .forEach(storageLinkedService => {
                    let connectionString: string = storageLinkedService.properties.typeProperties["connectionString"];
                    let accountName: string = connectionString.match(/;AccountName=(.+);/)[1];
                    this.existingStorageLinkedServiceOptions.push({
                        value: storageLinkedService.name,
                        displayText: `${accountName} / ${storageLinkedService.name}`
                    });
                });
        });
        let renderingResult = FormRender.renderForm(DataTypeConstants.blobStorage);
        this.connectionFormFields(renderingResult.formFields);

        ko.computed(() => {
            let basicValidations: Validation.IValidatable[] = [];
            let isNewLinkedService = this.stagingOption.value() === this.newLinkedService;
            if (this.parallelCopyEnabled()) {
                basicValidations.push(this.parallelCopies);
            }
            if (this.stagingAccountEnabled()) {
                basicValidations.push(this.stagingOption);
                if (isNewLinkedService) {
                    basicValidations.push(this.newStorageLinkedServiceName);
                }
            }
            if (this.polybaseEnabled()) {
                basicValidations.push(this.rejectSampleValue, this.rejectValue);
            }
            this.validateable(Common.ValidateableMerge(basicValidations,
                this.stagingAccountEnabled() && isNewLinkedService ? renderingResult.validateable() : null));
        });

        this.perfSettingsEnabled = ko.computed(() => this.parallelCopyEnabled() || this.stagingAccountEnabled() || this.polybaseEnabled());
    }

    public getStagingLinkedServiceJSON(): Common.IEntity {
        if (this.stagingOption.value() === this.newLinkedService && this.stagingAccountEnabled()) {
            let linkedService: Common.IEntity = FormRender.fillObjectTemplate(
                Configuration.copyConfig[DataTypeConstants.blobStorage].linkedServiceTemplate, this.connectionFormFields());
            linkedService.name = this.newStorageLinkedServiceName.value();
            return linkedService;
        } else {
            return undefined;
        }
    }
    /* tslint:enable:member-ordering */
}
