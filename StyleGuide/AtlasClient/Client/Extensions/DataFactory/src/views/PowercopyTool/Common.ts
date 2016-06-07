import FormFields = require("../../bootstrapper/FormFields");
import Validation = require("../../bootstrapper/Validation");
import Constants = require("./Constants");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");

export interface IFactoryEntitiesQuery {
    subscriptionId?: string;
    resourceGroupName?: string;
    factoryName: string;
    apiVersion?: string;
};

export interface IFactoryEntityQuery extends IFactoryEntitiesQuery {
    name: string;
};

export interface ITargetResource {
    Id: string; // e.g. "/subscriptions/d6d3819f-ebf8-4b38-85e9-813ee7bc58b4/resourceGroups/milan/providers/Microsoft.DataFactory/datafactories/milansxyz/linkedservices/OutputLinkedServiced"
    ResourceName: string;// e.g. "milansxyz/OutputLinkedServiced"
    ResourceType: string;// e.g. "Microsoft.DataFactory/datafactories/linkedservices"
}

export interface IARMDeploymentOperationProperties {
    ProvisioningState: string;
    StatusCode: string;
    StatusMessage?: string;
    TargetResource: ITargetResource;
}

export interface IARMDeploymentOperation {
    Id: string;
    OperationId: string;
    Properties: IARMDeploymentOperationProperties;
}

export interface IResourceDeploymentResult {
    Operation: IARMDeploymentOperation;
    RequestId: string;
    StatusCode: number;
}

export interface IEntity extends ArmService.IGenericADFEntity { }

export interface IEntityProperties extends ArmService.IGenericADFEntityProperties { }

export interface IAzureValueResponse<T> {
    value: T[];
}

export let dots = ko.observable("");

setInterval(() => {
    if (dots().length === 6) {
        dots("");
    } else {
        dots(dots() + " .");
    }
}, 450);

export interface IPartition {
    name: string;
    type: string;
    date: string;
    format: KnockoutObservable<string>;
    formatOptions?: FormFields.IOption[];
};

export interface IColumn {
    name: string;
    type: string;
    allowNull: boolean;
    size: number;
    isIdentity: boolean;
    isAutoIncrementing: boolean;
};

export interface ISelectable<T> {
    data: T;
    selected: KnockoutObservable<boolean>;
    id: string;
};

export function requiredValidation(val: Object): Q.Promise<Validation.IValidationResult> {
    if (val) {
        return Q<Validation.IValidationResult>({
            valid: true,
            message: ""
        });
    } else {
        return Q<Validation.IValidationResult>({
            valid: false,
            message: "Value input is required"
        });
    }
};

export function regexValidation(pattern: string, customMessage = "") {
    return (input: string) => {
        let regExp = new RegExp(pattern);
        if (regExp.test(input)) {
            return Q({
                valid: true,
                message: ""
            });
        } else {
            return Q({
                valid: false,
                message: customMessage ? customMessage : "Input string doesn't match the pattern"
            });
        }
    };
}
/* tslint:disable:no-any */
export function formFieldValue(field: FormFields.ValidatedBoxViewModel<any>) {
    /* tslint:enable:no-any */
    return field.options.defaultValue === field.value() ? undefined : field.value();
}

export interface IExternalData {
    dataDelay: string;
    maximumRetry: number;
    retryInterval: string;
    retryTimeout: string;
}

export interface IADFTable {
    adfTableName: FormFields.ValidatedBoxViewModel<string>;
    folderPath: string;
    fileName: string;
    columns: IColumn[];
    partitions: IPartition[];
    dateColumnName: string;
    sqlTableName: string;
    sizeValidation: number;
    fileFormat: IFileFormat;
}

export interface IADFInputTable extends IADFTable {
    copyRecursive: boolean;
    externalData: IExternalData;
    readerQuery: string;
    dataType: string;
};

export interface IADFOutputTable extends IADFTable {
    sliceIdentifierColumn: string;
    cleanupScript: string;
    storedProcedureName: string;
    storedProcedureTableType: string;
    storedProcedureParameters: IStoredProcParameter[];
    translator: ITranslation[];
    azureSink: IAzureTableSinkProperties;
}

export interface IRuntimeVariables {
    sliceStart?: string;
    sliceEnd?: string;
    windowStart: string;
    windowEnd: string;
}

export let copyBehaviorOptions: FormFields.IOption[] = [
    {
        value: undefined,
        displayText: "Merge files"
    },
    {
        value: Constants.preserveHierarchy,
        displayText: "Preserve hierarchy"
    },
    {
        value: Constants.flattenHierarchy,
        displayText: "Flatten hierarchy"
    }
];

export let formatOptions: FormFields.IOption[] = [
    {
        value: Constants.textFormat,
        displayText: "Text format"
    },
    {
        value: Constants.avroFormat,
        displayText: "Avro format"
    }
];

export let columnDelimiterOptions: FormFields.IOption[] = [
    {
        value: ",",
        displayText: "Comma (,)"
    },
    {
        value: ";",
        displayText: "Semicolon (;)"
    },
    {
        value: "|",
        displayText: "Pipe (|)"
    },
    {
        value: "\t",
        displayText: "Tab (\\t)"
    }
];

export let rowDelimiterOptions: FormFields.IOption[] = [
    {
        value: "\n",
        displayText: "Line feed (\\n)"
    },
    {
        value: "\r",
        displayText: "Carriage Return (\\r)"
    },
    {
        value: null,
        displayText: "Carriage Return + Line feed (\\r\\n)"
    }
];

export let compressionOptions: FormFields.IOption[] = [
    {
        value: "",
        displayText: "None"
    },
    {
        value: "BZip2",
        displayText: "BZip2"
    },
    {
        value: "Deflate",
        displayText: "Deflate"
    },
    {
        value: "GZip",
        displayText: "GZip"
    }
];

export let compressionLevelOptions: FormFields.IOption[] = [
    {
        value: "Fastest",
        displayText: "Fastest"
    },
    {
        value: "Optimal",
        displayText: "Optimal"
    }
];

export let recurenceOptions: FormFields.IOption[] = [
    {
        value: Constants.month,
        displayText: "Monthly"
    },
    {
        value: Constants.week,
        displayText: "Weekly"
    },
    {
        value: Constants.day,
        displayText: "Daily"
    },
    {
        value: Constants.hour,
        displayText: "Hourly"
    },
    {
        value: Constants.minute,
        displayText: "Minute"
    }
];

export let minuteDurationMap: { [s: string]: number } = {};
minuteDurationMap[Constants.minute] = 1;
minuteDurationMap[Constants.hour] = 60;
minuteDurationMap[Constants.day] = minuteDurationMap[Constants.hour] * 24;
minuteDurationMap[Constants.week] = minuteDurationMap[Constants.day] * 7;
minuteDurationMap[Constants.month] = minuteDurationMap[Constants.day] * 31;

export interface INumberRange {
    min: number;
    max: number;
}

export let intervalRanges: { [s: string]: INumberRange } = {};
intervalRanges[Constants.month] = { min: 1, max: 12 };
intervalRanges[Constants.week] = { min: 1, max: 8 };
intervalRanges[Constants.day] = { min: 1, max: 30 };
intervalRanges[Constants.hour] = { min: 1, max: 48 };
intervalRanges[Constants.minute] = { min: 15, max: 60 };

export let yearOptions: FormFields.IOption[] = [
    {
        value: "yy",
        displayText: "yy",
        isDefault: true
    },
    {
        value: "yyy",
        displayText: "yyy"
    },
    {
        value: "yyyy",
        displayText: "yyyy"
    }
];

export let monthOptions = [
    {
        value: "M",
        displayText: "M"
    },
    {
        value: "MM",
        displayText: "MM",
        isDefault: true
    },
    {
        value: "MMM",
        displayText: "MMM"
    },
    {
        value: "MMMM",
        displayText: "MMMM"
    }
];

export let dayOptions = [
    {
        value: "d",
        displayText: "d"
    },
    {
        value: "dd",
        displayText: "dd",
        isDefault: true
    },
    {
        value: "ddd",
        displayText: "ddd"
    },
    {
        value: "dddd",
        displayText: "dddd"
    }
];

export let hourOptions = [
    {
        value: "h",
        displayText: "h"
    },
    {
        value: "hh",
        displayText: "hh"
    },
    {
        value: "H",
        displayText: "H"
    },
    {
        value: "HH",
        displayText: "HH",
        isDefault: true
    }
];

export let minuteOptions = [
    {
        value: "m",
        displayText: "m"
    },
    {
        value: "mm",
        displayText: "mm",
        isDefault: true
    },
];

export interface IFileFormatOptions {
    format?: string;
    columnDelimiter?: string;
    rowDelimiter?: string;
    escapeChar?: string;
    quoteChar?: string;
    nullValue?: string;
    encodingName?: string;
    compressionType?: string;
    compressionLevel?: string;
    skipHeaderLineCount?: number;
    blobWriterAddHeader?: boolean;
}

export interface IFileFormat extends IFileFormatOptions {
    format: string;
    columnDelimiter: string;
    rowDelimiter: string;
    escapeChar: string;
    quoteChar: string;
    nullValue: string;
    encodingName: string;
    compressionType: string;
    compressionLevel: string;
    skipHeaderLineCount: number;
    blobWriterAddHeader: boolean;
}

export interface IStoredProcParameter {
    name: KnockoutObservable<string>;
    type: KnockoutObservable<string>;
    value: KnockoutObservable<string>;
}

export interface ITranslation {
    source: string;
    destination: string;
}

export function ValidateableMerge(basicValidations: Validation.IValidatable[], delayedValidation: Validation.IValidatable = null, basicValidationsErrorMessage: string = ""): Validation.IValidatable {
    let subscriptions: KnockoutSubscription<boolean>[] = [];
    let valid = ko.observable(true);
    return {
        isValid: () => {
            subscriptions.forEach(s => {
                s.dispose();
            });
            let basicValidationPromises: Q.Promise<Validation.IValidationResult>[] = [];

            basicValidations.forEach(bv => {
                basicValidationPromises.push(bv.isValid());
            });

            return Q.all(basicValidationPromises).then(result => {
                if (result.every(p => p.valid)) {
                    if (delayedValidation) {
                        subscriptions.push(delayedValidation.valid.subscribe(v => {
                            valid(v);
                        }));
                        return delayedValidation.isValid();
                    } else {
                        return {
                            valid: true,
                            message: ""
                        };
                    }
                }

                let errorMessage = result.filter(v => v.valid === false)[0].message;
                valid(false);
                let allBasicValidComputed = (ko.computed(() => {
                    return basicValidations.every(bv => bv.valid());
                }));
                subscriptions.push(allBasicValidComputed);
                subscriptions.push(allBasicValidComputed.subscribe(allValid => {
                    valid(allValid);
                }));
                return {
                    valid: false,
                    message: basicValidationsErrorMessage || errorMessage
                };
            });
        },
        valid: valid,
        dispose: () => {
            subscriptions.forEach(s => { s.dispose(); });
        }
    };
}

export function syncronousValidateable(observableBase: KnockoutObservableBase<boolean>, errorMessage: string): Validation.IValidatable {
    return {
        isValid: () => Q({ valid: observableBase(), message: errorMessage }),
        valid: observableBase
    };
}

export function textLenToPx(textLen: number): string {
    return ((100 / 16) * textLen + 20) + "px";
}

export function splitFilePath(filePath: string) {
    let splitPath = filePath.split("/");
    let file = splitPath.pop();
    let folder = splitPath.join("/");
    return {
        folder: folder,
        file: file
    };
}

export interface IPreview {
    columns: string[];
    rows: string[][];
}

export interface IPreviewAndSchema {
    preview: IPreview;
    schema: IColumn[];
}

export interface IAzureTableSinkProperties {
    insertType: string;
    partitionValue: string;
    partitionColumn: string;
    rowKeyColumn: string;
}

let formatOptionsMap: { [s: string]: FormFields.IOption[] } = {
    "year": yearOptions,
    "month": monthOptions,
    "day": dayOptions,
    "hour": hourOptions,
    "minute": minuteOptions,
    "custom": []
};

export function createPartitionsForPath(path: string, oldPartitions?: IPartition[]): IPartition[] {
    let partitions: IPartition[] = [];
    let regex = /{[^}]+}/gi;
    let matches = path.match(regex) || [];

    let oldPartitionsMap: StringMap<IPartition> = {};
    if (oldPartitions) {
        oldPartitions.forEach((oldPartition) => {
            oldPartitionsMap[oldPartition.name] = oldPartition;
        });
    }

    let newPartitionMap: StringMap<number> = {};
    matches.forEach(m => {
        let partitionName = m.replace("{", "").replace("}", "");
        if (newPartitionMap[partitionName]) {
            return;
        }
        newPartitionMap[partitionName] = 1;

        let patternOptions = formatOptionsMap[partitionName.toLowerCase()];
        if (patternOptions !== undefined) {
            let partition: IPartition;
            let oldPartition = oldPartitionsMap[partitionName];
            if (oldPartition) {
                partition = oldPartition;
                if (!oldPartition.formatOptions) {
                    oldPartition.formatOptions = patternOptions;
                }
            } else {
                partition = {
                    name: partitionName, type: "DateTime", date: "SliceStart", format: ko.observable(""), formatOptions: patternOptions
                };
                let defaultOption = FormFields.getDefaultOption(patternOptions);
                if (defaultOption) {
                    partition.format(defaultOption.value);
                }
            }

            partitions.push(partition);
        }
    });
    return partitions;
}
