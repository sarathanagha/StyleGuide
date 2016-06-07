import JSONTemplates = require("./JSONTemplates");
import CopyTool = require("./PowercopyTool");
import Constants = require("./Constants");
import DataTypeConstants = require("./DataTypeConstants");
import Common = require("./Common");
import Configuration = require("./Configuration");
import PipelineModel = require("../../scripts/Framework/Model/Contracts/Pipeline");

export function getLinkedServiceDependencyString(factoryName: string, linkedserviceName: string): string {
    return `Microsoft.DataFactory/dataFactories/${factoryName}/linkedServices/${linkedserviceName}`;
}

function getDatasetDependencyString(factoryName: string, datsetName: string): string {
    return `Microsoft.DataFactory/dataFactories/${factoryName}/datasets/${datsetName}`;
}

export function typedExtend<T>(input: T): T {
    return $.extend(true, {}, input);
}

function _cleanObject(objectToClean: Object, defaultObject: Object, skipProperties?: string[]) {
    for (var key in objectToClean) {
        if (defaultObject[key] === undefined) {
            throw "Unknown property: " + key;
        }
        if (!skipProperties || skipProperties.filter(p => p === key).length === 0) {
            if ((!objectToClean[key] && !defaultObject[key]) || objectToClean[key] === defaultObject[key]) {
            delete objectToClean[key];
        }
    }
}
}

export function writeCopyPipeline(name: string, viewModel: CopyTool.PowerCopyTool) {
    let retObj = typedExtend(JSONTemplates.copyPipelineTemplate);
    retObj.dependsOn = [];
    if (!viewModel.sourceNavModel.dataTypeViewModel.useExistingDataset()) {
    viewModel.inputTables().forEach(tbl => {
        retObj.dependsOn.push(getDatasetDependencyString(viewModel.factoryName, tbl.adfTableName.value()));
    });
    }
    viewModel.outputTables().forEach(tbl => {
        retObj.dependsOn.push(getDatasetDependencyString(viewModel.factoryName, tbl.adfTableName.value()));
    });

    retObj.name = name;
    retObj.properties.start = viewModel.pipelineProperties.activePeriod().startDate.toISOString();
    retObj.properties.end = viewModel.pipelineProperties.activePeriod().endDate.toISOString();
    if (viewModel.isOneTimePipeline()) {
        retObj.properties.pipelineMode = PipelineModel.PipelineMode.OneTime;
    } else {
        retObj.properties.pipelineMode = PipelineModel.PipelineMode.Scheduled;
        delete retObj.properties.expirationTime;
    }

    let activities = [];

    let parallelCopyOptions = viewModel.performanceSettingsViewModel.getParallelCopyOptions();
    let polybaseSettings = viewModel.performanceSettingsViewModel.getPolybaseSettings();

    for (let i = 0; i < viewModel.inputTables().length; i++) {
        // needed to infer type
        let activity = typedExtend(retObj.properties.activities[0]);
        activity.name = "CopyActivity-" + i;
        let inputTable = viewModel.inputTables()[i];
        let outputTable = viewModel.outputTables()[i];

        activity.inputs[0].name = inputTable.adfTableName.value();
        activity.outputs[0].name = outputTable.adfTableName.value();
        let sourceType = Configuration.copyConfig[viewModel.sourceNavModel.dataType()].sourceType;
        if (!viewModel.sourceNavModel.tableListSource()) {
            let blobSource = typedExtend(JSONTemplates.blobSource);
            blobSource.recursive = viewModel.sourceNavModel.recursiveCopy();
            blobSource.skipHeaderLineCount = viewModel.sourceNavModel.fileFormatViewModel.skipHeaderLineCount.value();
            blobSource.type = sourceType;
            if (viewModel.sourceNavModel.dataType() === DataTypeConstants.dataLakeStore) {
                delete blobSource.skipHeaderLineCount;
            }
            activity.typeProperties.source = blobSource;

        } else {
            let sqlSource = typedExtend(JSONTemplates.sqlSource);
            sqlSource.sqlReaderQuery = inputTable.readerQuery;
            if (viewModel.sourceNavModel.dataType() === DataTypeConstants.mySql ||
                viewModel.sourceNavModel.dataType() === DataTypeConstants.db2 ||
                viewModel.sourceNavModel.dataType() === DataTypeConstants.sybase ||
                viewModel.sourceNavModel.dataType() === DataTypeConstants.postgresql ||
                viewModel.sourceNavModel.dataType() === DataTypeConstants.teradata) {
                delete sqlSource.sqlReaderQuery;
                sqlSource["query"] = inputTable.readerQuery;
            } else if (viewModel.sourceNavModel.dataType() === DataTypeConstants.oracle) {
                delete sqlSource.sqlReaderQuery;
                sqlSource["oracleReaderQuery"] = inputTable.readerQuery;
            } else if (viewModel.sourceNavModel.dataType() === DataTypeConstants.azureTable) {
                delete sqlSource.sqlReaderQuery;
                sqlSource["azureTableSourceQuery"] = inputTable.readerQuery;
            }
            sqlSource.type = sourceType;
            activity.typeProperties.source = sqlSource;
        }

        let sinkType = Configuration.copyConfig[viewModel.destinationNavModel.dataType()].sinkType;
        if (!viewModel.destinationNavModel.tableListSource()) {
            let blobSink = typedExtend(JSONTemplates.blobSink);
            blobSink.type = sinkType;
            if (viewModel.destinationNavModel.copyBehavior.value()) {
                blobSink.copyBehavior = viewModel.destinationNavModel.copyBehavior.value();
            } else {
                delete blobSink.copyBehavior;
            }
            if (!viewModel.sourceNavModel.binaryCopySource() && viewModel.destinationNavModel.dataType() === DataTypeConstants.blobStorage) {
                blobSink.blobWriterAddHeader = viewModel.destinationNavModel.fileFormatViewModel.blobWriterAddHeader();
            } else {
                delete blobSink.blobWriterAddHeader;
            }
            activity.typeProperties.sink = blobSink;
        } else {
            if (viewModel.destinationNavModel.dataType() !== DataTypeConstants.azureTable) {
            let sqlSink = typedExtend(JSONTemplates.sqlSink);
            sqlSink.type = sinkType;
            if (outputTable.storedProcedureName) {
                sqlSink.sqlWriterStoredProcedureName = outputTable.storedProcedureName;
                sqlSink.sqlWriterTableType = outputTable.storedProcedureTableType;
                /* tslint:disable:no-var-keyword */
                var parameters = typedExtend(sqlSink.storedProcedureParameters);
                /* tslint:disable:no-var-keyword */
                outputTable.storedProcedureParameters.forEach(p => {
                    let newParameter = typedExtend(parameters.sampleParameter);
                    newParameter.type = p.type();
                    newParameter.value = p.value();
                    parameters[p.name()] = newParameter;
                });
                delete parameters.sampleParameter;
                sqlSink.storedProcedureParameters = parameters;
            } else {
                delete sqlSink.sqlWriterStoredProcedureName;
                delete sqlSink.sqlWriterTableType;
                delete sqlSink.storedProcedureParameters;
            }

            if (outputTable.cleanupScript) {
                sqlSink.sqlWriterCleanupScript = outputTable.cleanupScript;
            } else {
                delete sqlSink.sqlWriterCleanupScript;
            }

            if (outputTable.sliceIdentifierColumn) {
                sqlSink.sliceIdentifierColumnName = outputTable.sliceIdentifierColumn;
            } else {
                delete sqlSink.sliceIdentifierColumnName;
            }

            if (!sqlSink.sliceIdentifierColumnName) {
                delete sqlSink.sliceIdentifierColumnName;
            }
            if (!sqlSink.sqlWriterCleanupScript) {
                delete sqlSink.sqlWriterCleanupScript;
            }
            if (polybaseSettings) {
                sqlSink.allowPolyBase = true;
                sqlSink.polyBaseSettings.rejectSampleValue = polybaseSettings.rejectSampleValue;
                sqlSink.polyBaseSettings.rejectType = polybaseSettings.rejectType;
                sqlSink.polyBaseSettings.rejectValue = polybaseSettings.rejectValue;
                sqlSink.polyBaseSettings.useTypeDefault = polybaseSettings.useTypeDefault;
                _cleanObject(sqlSink.polyBaseSettings, JSONTemplates.sqlSink.polyBaseSettings);
            } else {
                delete sqlSink.allowPolyBase;
                delete sqlSink.polyBaseSettings;
            }
            activity.typeProperties.sink = sqlSink;
            } else {
                let azureTableSink = typedExtend(JSONTemplates.azureTableSink);
                azureTableSink.azureTableInsertType = outputTable.azureSink.insertType;
                azureTableSink.azureTableDefaultPartitionKeyValue = outputTable.azureSink.partitionValue;
                azureTableSink.azureTablePartitionKeyName = outputTable.azureSink.partitionColumn;
                azureTableSink.azureTableRowKeyName = outputTable.azureSink.rowKeyColumn;
                _cleanObject(azureTableSink, JSONTemplates.azureTableSink, ["type"]);
                activity.typeProperties.sink = azureTableSink;
            }
        }

        if (outputTable.translator && !viewModel.performanceSettingsViewModel.stagingLinkedServiceName() && !polybaseSettings) {
            activity.typeProperties.translator.columnMappings = outputTable.translator.map(mapping => mapping.source + ":" + mapping.destination).join(",");
        } else {
            delete activity.typeProperties.translator;
        }

        activity.typeProperties.cloudUnits = parallelCopyOptions.cloudUnits;
        if (!activity.typeProperties.cloudUnits) {
            delete activity.typeProperties.cloudUnits;
        }
        activity.typeProperties.parallelCopies = parallelCopyOptions.parallelCopies;
        if (!activity.typeProperties.parallelCopies) {
            delete activity.typeProperties.parallelCopies;
        }
        let stagingLinkedService = viewModel.performanceSettingsViewModel.stagingLinkedServiceName();
        if (stagingLinkedService) {
            activity.typeProperties.enableStaging = true;
            activity.typeProperties.stagingSettings.linkedServiceName = stagingLinkedService;
        } else {
            delete activity.typeProperties.enableStaging;
            delete activity.typeProperties.stagingSettings;
        }
        activity.policy.concurrency = viewModel.copyActivityProperties.concurrency.value();
        activity.policy.delay = viewModel.copyActivityProperties.delay.value();
        activity.policy.executionPriorityOrder = viewModel.copyActivityProperties.executionPriorityOrder.value();
        activity.policy.longRetry = viewModel.copyActivityProperties.longRetry.value();
        activity.policy.longRetryInterval = viewModel.copyActivityProperties.longRetryInterval.value();
        activity.policy.retry = viewModel.copyActivityProperties.retry.value();
        activity.policy.timeout = viewModel.copyActivityProperties.timeout.value();

        activities.push(activity);
    }
    retObj.properties.activities = activities;
    return retObj;
}

/* tslint:disable:align */
function _writeTable(name: string, viewModel: CopyTool.PowerCopyTool, linkedServiceName: string, external: boolean,
    table: Common.IADFTable, dataType: string, originalObject, useExistingLinkedService: boolean, binaryCopy: boolean) {
    /* tslint:enable:align */
    // infer type
    let retObj = JSONTemplates.baseTableTemplate;
    retObj = originalObject;
    retObj.name = name;
    let tableType = Configuration.copyConfig[dataType].tableType;
    retObj.properties.type = tableType;
    if (useExistingLinkedService) {
        retObj.dependsOn.pop();
    } else {
        retObj.dependsOn[0] = getLinkedServiceDependencyString(viewModel.factoryName, linkedServiceName);
    }
    retObj.properties.linkedServiceName = linkedServiceName;
    if (!binaryCopy) {
        table.columns.forEach(c => {
            retObj.properties.structure.push(
                {
                    name: c.name,
                    type: c.type
                });
        });
    } else {
        delete retObj.properties.structure;
    }
    retObj.properties.availability.frequency = viewModel.copyActivityProperties.frequency.value();
    retObj.properties.availability.interval = parseInt(viewModel.copyActivityProperties.interval.value(), 10);
    if (external) {
        retObj.properties.external = true;
    } else {
        delete retObj.properties.external;
    }
    let inputTable = <Common.IADFInputTable>table;
    if (inputTable.externalData) {
        retObj.properties.policy.externalData.dataDelay = inputTable.externalData.dataDelay;
        retObj.properties.policy.externalData.maximumRetry = inputTable.externalData.maximumRetry;
        retObj.properties.policy.externalData.retryInterval = inputTable.externalData.retryInterval;
        retObj.properties.policy.externalData.retryTimeout = inputTable.externalData.retryTimeout;
    } else {
        delete retObj.properties.policy.externalData;
    }
    _cleanObject(retObj.properties.policy.externalData, JSONTemplates.baseTableTemplate.properties.policy.externalData);
}

/* tslint:disable:align */
export function _writeStorageTable(name: string, linkedServiceName: string, viewModel: CopyTool.PowerCopyTool, table: Common.IADFTable, dataType: string, external: boolean,
    useExistingLinkedService: boolean, binaryCopy: boolean) {
    /* tslint:enable:align */

    let retObj = typedExtend(JSONTemplates.blobTableTemplate);
    _writeTable(name, viewModel, linkedServiceName, external, table, dataType, retObj, useExistingLinkedService, binaryCopy);

    retObj.properties.typeProperties.partitionedBy = [];
    table.partitions.forEach(p => {
        retObj.properties.typeProperties.partitionedBy.push({
            name: p.name,
            value: {
                date: p.date,
                format: p.format(),
                type: p.type
            }
        });
    });
    retObj.properties.typeProperties.folderPath = table.folderPath;
    if (table.fileName) {
        retObj.properties.typeProperties.fileName = table.fileName;
    } else {
        delete retObj.properties.typeProperties.fileName;
    }

    if (table.sizeValidation) {
        retObj.properties.policy.validation.minimumSizeMB = table.sizeValidation;
    } else {
        delete retObj.properties.policy.validation;
    }

    if (!binaryCopy) {
        retObj.properties.typeProperties.format.type = table.fileFormat.format;
        if (table.fileFormat.format === Constants.textFormat) {
        retObj.properties.typeProperties.format.columnDelimiter = table.fileFormat.columnDelimiter;
        retObj.properties.typeProperties.format.rowDelimiter = table.fileFormat.rowDelimiter;
        retObj.properties.typeProperties.format.escapeChar = table.fileFormat.escapeChar;
        retObj.properties.typeProperties.format.quoteChar = table.fileFormat.quoteChar;
        retObj.properties.typeProperties.format.nullValue = table.fileFormat.nullValue;
        retObj.properties.typeProperties.format.encodingName = table.fileFormat.encodingName;
        retObj.properties.typeProperties.compression.type = table.fileFormat.compressionType;
        retObj.properties.typeProperties.compression.level = table.fileFormat.compressionLevel;
        }
        _cleanObject(retObj.properties.typeProperties.format, JSONTemplates.blobTableTemplate.properties.typeProperties.format);
        _cleanObject(retObj.properties.typeProperties.compression, JSONTemplates.blobTableTemplate.properties.typeProperties.compression);
    } else {
        delete retObj.properties.typeProperties.format;
        delete retObj.properties.typeProperties.compression;
    }

    return retObj;
}
/* tslint:disable:align */
export function _writeSqlTable(name: string, linkedServiceName: string, viewModel: CopyTool.PowerCopyTool, table: Common.IADFTable, dataType: string, external: boolean,
    useExistingLinkedService: boolean) {
    /* tslint:enable:align */
    let retObj = typedExtend(JSONTemplates.sqlTableTemplate);
    _writeTable(name, viewModel, linkedServiceName, external, table, dataType, retObj, useExistingLinkedService, false);
    if (table.sqlTableName !== Constants.customQuery) {
        retObj.properties.typeProperties.tableName = table.sqlTableName;
    } else {
        delete retObj.properties.typeProperties.tableName;
    }

    if (table.sizeValidation) {
        retObj.properties.policy.validation.minimumRows = table.sizeValidation;
    } else {
        delete retObj.properties.policy.validation;
    }

    return retObj;
}
