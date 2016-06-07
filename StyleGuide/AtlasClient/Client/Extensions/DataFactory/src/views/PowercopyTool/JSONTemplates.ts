import Configuration = require("./Configuration");

export const blobTableTemplate = {
    "dependsOn": ["Microsoft.DataFactory/dataFactories/<factoryname>/linkedServices/<linkedservicename>"],
    "type": "Microsoft.DataFactory/datafactories/datasets",
    "name": "",
    "apiVersion": Configuration.apiVersion,
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "",
        "structure": [],
        "typeProperties": {
            "folderPath": "",
            "fileName": "",
            "partitionedBy": [{
                "name": "year",
                "value": {
                    "type": "DateTime",
                    "date": "SliceStart",
                    "format": "yyyy"
                }
            }],
            "format": {
                "type": "",
                "columnDelimiter": "",
                "rowDelimiter": "",
                "escapeChar": "",
                "quoteChar": "",
                "nullValue": "N",
                "encodingName": ""
            },
            "compression": {
                "type": "",
                "level": ""
            }
        },
        "availability": {
            "frequency": "Day",
            "interval": 1
        },
        "policy": {
            "validation": {
                "minimumSizeMB": 0
            },
            "externalData": {
                "dataDelay": "00:00:00",
                "maximumRetry": 0,
                "retryInterval": "00:00:00",
                "retryTimeout": "00:00:00"
            }
        }
    }
};

export const baseTableTemplate = {
    "dependsOn": ["Microsoft.DataFactory/dataFactories/<factoryname>/linkedServices/<linkedservicename>"],
    "type": "Microsoft.DataFactory/datafactories/datasets",
    "name": "",
    "apiVersion": Configuration.apiVersion,
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "",
        "structure": [],
        "availability": {
            "frequency": "Day",
            "interval": 1
        },
        "external": false,
        "policy": {
            "externalData": {
                "dataDelay": "00:00:00",
                "maximumRetry": 0,
                "retryInterval": "00:00:00",
                "retryTimeout": "00:00:00"
            }
        }
    }
};

export const sqlTableTemplate = {
    "dependsOn": ["Microsoft.DataFactory/dataFactories/<factoryname>/linkedServices/<linkedservicename>"],
    "type": "Microsoft.DataFactory/datafactories/datasets",
    "name": "",
    "apiVersion": Configuration.apiVersion,
    "properties": {
        "type": "tableListSource",
        "linkedServiceName": "",
        "structure": [],
        "typeProperties": {
            "tableName": ""
        },
        "availability": {
            "frequency": "Day",
            "interval": 1
        },
        "policy": {
            "validation": {
                "minimumRows": 0
            },
            "externalData": {
                "dataDelay": "00:00:00",
                "maximumRetry": 0,
                "retryInterval": "00:00:00",
                "retryTimeout": "00:00:00"
            }
        }
    }
};

export const blobSource = {
    "type": "BlobSource",
    "recursive": false,
    "skipHeaderLineCount": 0
};

export const blobSink = {
    "type": "BlobSink",
    "copyBehavior": "PreserveHierarchy",
    "blobWriterAddHeader": false
};

export const sqlSource = {
    "type": "SqlSource",
    "sqlReaderQuery": ""
};

export const sqlSink = {
    "type": "SqlSink",
    "sliceIdentifierColumnName": "",
    "sqlWriterCleanupScript": "",
    "sqlWriterStoredProcedureName": "",
    "sqlWriterTableType": "",
    "storedProcedureParameters": {
        "sampleParameter": {
            "type": "String",
            "value": ""
        }
    },
    "allowPolyBase": true,
    "polyBaseSettings":
    {
        "rejectType": "percentage",
        "rejectValue": 10,
        "rejectSampleValue": 100,
        "useTypeDefault": true
    }
};

export const azureTableSink = {
    "type": "AzureTableSink",
    "azureTableInsertType": "merge",
    "azureTableDefaultPartitionKeyValue": "",
    "azureTablePartitionKeyName": "",
    "azureTableRowKeyName": ""
};

export const copyPipelineTemplate = {
    "dependsOn": [
        "Microsoft.DataFactory/dataFactories/<factoryname>/datasets/<tablename>",
        "Microsoft.DataFactory/dataFactories/<factoryname>/datasets/<tablename>",
    ],
    "type": "Microsoft.DataFactory/datafactories/datapipelines",
    "name": "",
    "apiVersion": Configuration.apiVersion,
    "properties": {
        "activities": [
            {
                "name": "powercopyactivity",
                "type": "Copy",
                "inputs": [{ "name": "" }],
                "outputs": [{ "name": "" }],
                "typeProperties": {
                    "source": {
                    },
                    "sink": {
                    },
                    "translator": {
                        "type": "TabularTranslator",
                        "columnMappings": ""
                    },
                    "cloudUnits": 0,
                    "parallelCopies": 0,
                    "enableStaging": false,
                    "stagingSettings": {
                        "linkedServiceName": "",
                        "path": "adfstagingcopydata"
                    }
                },
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "style": "StartOfInterval",
                    "delay": "00:00:00",
                    "longRetry": 0,
                    "longRetryInterval": "00:00:00",
                    "retry": 3
                }
            }
        ],
        "datasets": [],
        "start": "2014-05-01T00:00:00Z",
        "end": "2014-05-05T00:00:00Z",
        "pipelineMode": "Scheduled",
        "expirationTime": "03.00:00:00"
    }
};

export let armTemplate = {
    "contentVersion": "1.0.0.0",
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "resources": []
};
