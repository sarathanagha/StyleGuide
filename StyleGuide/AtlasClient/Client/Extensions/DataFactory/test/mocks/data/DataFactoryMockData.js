// TODO paverma Update the mockdata to api version 2015-05-05
// TODO remove trailing commas
/* tslint:disable:no-trailing-comma */
/* tslint:disable:max-line-length */
define(["require", "exports"], function (require, exports) {
    // Mock data.
    // Subset of adf data lake.
    exports.ADFDataLakeFactory = {
        tables: [
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/Table_StagingBlob_ExecutionEventsV2",
                "name": "Table_StagingBlob_ExecutionEventsV2",
                "properties": {
                    "availability": {
                        "frequency": "Minute",
                        "interval": 15
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/ExecutionIssuesPreProcessedUsrEr",
                "name": "ExecutionIssuesPreProcessedUsrEr",
                "properties": {
                    "availability": {
                        "frequency": "Week",
                        "interval": 1
                    },
                    "createTime": "2015-05-08T19:37:01.3597353Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/Table_PreProcessed_ExecutionIssues_MLInputUsrEr",
                "name": "Table_PreProcessed_ExecutionIssues_MLInputUsrEr",
                "properties": {
                    "availability": {
                        "frequency": "Week",
                        "interval": 1
                    },
                    "createTime": "2015-05-08T19:37:19.2008788Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/Table_Classified_ExecutionIssuesUsrEr",
                "name": "Table_Classified_ExecutionIssuesUsrEr",
                "properties": {
                    "availability": {
                        "frequency": "Week",
                        "interval": 1
                    },
                    "createTime": "2015-05-08T19:39:01.8714137Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/Table_SQLAzure_PreCleanedClassifiedErrors",
                "name": "Table_SQLAzure_PreCleanedClassifiedErrors",
                "properties": {
                    "availability": {
                        "frequency": "Week",
                        "interval": 1
                    },
                    "createTime": "2015-05-08T19:39:14.1537945Z",
                    "location": {
                        "type": "AzureSqlTableLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/Table_MDSSource_ExecutionIssuesV2",
                "name": "Table_MDSSource_ExecutionIssuesV2",
                "properties": {
                    "availability": {
                        "frequency": "Hour",
                        "interval": 1,
                        "waitOnExternal": {}
                    },
                    "createTime": "2015-05-08T01:38:43.608274Z",
                    "location": {
                        "type": "MdsLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/ExecutionIssues",
                "name": "ExecutionIssues",
                "properties": {
                    "availability": {
                        "frequency": "Hour",
                        "interval": 1
                    },
                    "createTime": "2015-05-08T02:05:49.8123642Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/Table_SQLAzure_Classified_ExecutionIssuesUsrEr",
                "name": "Table_SQLAzure_Classified_ExecutionIssuesUsrEr",
                "properties": {
                    "availability": {
                        "frequency": "Week",
                        "interval": 1
                    },
                    "createTime": "2015-05-08T19:39:08.0702183Z",
                    "location": {
                        "type": "AzureSqlTableLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/Table_MDSSource_ExecutionEventsV2",
                "name": "Table_MDSSource_ExecutionEventsV2",
                "properties": {
                    "availability": {
                        "frequency": "Minute",
                        "interval": 15,
                        "waitOnExternal": {}
                    },
                    "createTime": "2015-04-16T01:12:44.1034415Z",
                    "location": {
                        "type": "MdsLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/tables/Table_CompliantStore_ExecutionEventsV2",
                "name": "Table_CompliantStore_ExecutionEventsV2",
                "properties": {
                    "availability": {
                        "frequency": "Hour",
                        "interval": 1
                    },
                    "createTime": "2015-04-16T01:16:18.0741724Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
        ],
        pipelines: [
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/datapipelines/Pipeline_ExecutionIssuesIngestionV2",
                "name": "Pipeline_ExecutionIssuesIngestionV2",
                "properties": {
                    "activities": [
                        {
                            "inputs": [
                                {
                                    "name": "Table_MDSSource_ExecutionIssuesV2"
                                }
                            ],
                            "name": "MdsToStagingBlob",
                            "outputs": [
                                {
                                    "name": "ExecutionIssues"
                                }
                            ],
                            "policy": {
                                "concurrency": 3,
                                "longRetry": 1,
                                "longRetryInterval": "01:00:00",
                                "retry": 2,
                                "timeout": "00:15:00"
                            },
                            "transformation": {
                                "sink": {
                                    "blobWriterOverwriteFiles": true,
                                    "type": "BlobSink",
                                    "writeBatchSize": 10000,
                                    "writeBatchTimeout": "02:00:00"
                                },
                                "source": {
                                    "mdsStartTime": "$$SliceStart",
                                    "mdsTimeSpan": "01:00:00",
                                    "queryString": "httpStatusCode >= 400 and httpStatusCode <= 599",
                                    "type": "MdsSource"
                                }
                            },
                            "type": "CopyActivity"
                        }
                    ],
                    "description": "Copy System errors from Execution Events Product MDS Telemetry tables to DataLake",
                    "end": "2015-05-25T00:00:00Z",
                    "isPaused": false,
                    "provisioningState": "Succeeded",
                    "runtimeInfo": {
                        "activePeriodSetTime": null,
                        "activityPeriods": {
                            "mdsToStagingBlob": {
                                "end": "2015-05-25T00:00:00Z",
                                "start": "2015-04-11T00:00:00Z"
                            }
                        },
                        "deploymentTime": "2015-05-12T22:38:30.1740263Z"
                    },
                    "start": "2015-04-11T00:00:00Z"
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/datapipelines/Pipeline_UserErrorClusteringV2",
                "name": "Pipeline_UserErrorClusteringV2",
                "properties": {
                    "activities": [
                        {
                            "inputs": [
                                {
                                    "name": "ExecutionIssues"
                                }
                            ],
                            "linkedServiceName": "LinkedService_DatalakeHdiBYOCV2",
                            "name": "PreProcessUserMessagesFromExecutionIssues",
                            "outputs": [
                                {
                                    "name": "ExecutionIssuesPreProcessedUsrEr"
                                }
                            ],
                            "policy": {
                                "concurrency": 1,
                                "longRetry": 1,
                                "longRetryInterval": "03:00:00",
                                "retry": 2,
                                "timeout": "01:00:00"
                            },
                            "transformation": {
                                "extendedProperties": {
                                    "EndOfWeek": "$$Text.Format(  '{0:yyyy-MM-dd}', Date.AddDays( SliceStart, 7)  )",
                                    "StartOfWeek": "$$Text.Format('{0:yyyy-MM-dd}', SliceStart)",
                                    "StartYear": "$$Text.Format('{0:yyyy}', SliceStart)"
                                },
                                "scriptLinkedService": "LinkedService_OnDemandMlPreStorage",
                                "scriptPath": "hivescripts/PreProcessExecutionIssuesUserErrors.hive",
                                "type": "Hive"
                            },
                            "type": "HDInsightActivity"
                        },
                        {
                            "inputs": [
                                {
                                    "name": "ExecutionIssuesPreProcessedUsrEr"
                                }
                            ],
                            "name": "CopyToChangeFileName",
                            "outputs": [
                                {
                                    "name": "Table_PreProcessed_ExecutionIssues_MLInputUsrEr"
                                }
                            ],
                            "policy": {
                                "concurrency": 1,
                                "longRetry": 1,
                                "longRetryInterval": "01:00:00",
                                "retry": 2,
                                "timeout": "01:00:00"
                            },
                            "transformation": {
                                "sink": {
                                    "type": "BlobSink",
                                    "writeBatchSize": 0,
                                    "writeBatchTimeout": "00:00:00"
                                },
                                "source": {
                                    "type": "BlobSource"
                                }
                            },
                            "type": "CopyActivity"
                        },
                        {
                            "description": "Get the class id and representing element from Azure ML using TF/IDF",
                            "inputs": [
                                {
                                    "name": "Table_PreProcessed_ExecutionIssues_MLInputUsrEr"
                                }
                            ],
                            "linkedServiceName": "LinkedService_AzureMLTfIdf",
                            "name": "TfIdfUserErrorClustering",
                            "outputs": [
                                {
                                    "name": "Table_Classified_ExecutionIssuesUsrEr"
                                }
                            ],
                            "policy": {
                                "concurrency": 3,
                                "executionPriorityOrder": "NewestFirst",
                                "retry": 1,
                                "timeout": "02:00:00"
                            },
                            "type": "AzureMLBatchScoringActivity"
                        },
                        {
                            "inputs": [
                                {
                                    "name": "Table_Classified_ExecutionIssuesUsrEr"
                                }
                            ],
                            "name": "CleanCalssifiedErrorsDataForTheWeek",
                            "outputs": [
                                {
                                    "name": "Table_SQLAzure_PreCleanedClassifiedErrors"
                                }
                            ],
                            "policy": {
                                "concurrency": 1,
                                "longRetry": 1,
                                "longRetryInterval": "01:00:00",
                                "retry": 2,
                                "timeout": "00:30:00"
                            },
                            "transformation": {
                                "storedProcedureName": "DeleteFromClassifiedErrorsForDate",
                                "storedProcedureParameters": {
                                    "startOfWeek": "$$Text.Format('{0:yyyy-MM-dd}', SliceStart)"
                                }
                            },
                            "type": "StoredProcedureActivity"
                        },
                        {
                            "inputs": [
                                {
                                    "name": "Table_Classified_ExecutionIssuesUsrEr"
                                },
                                {
                                    "name": "Table_SQLAzure_PreCleanedClassifiedErrors"
                                }
                            ],
                            "name": "CopyErrorClassificationToSqlAzure",
                            "outputs": [
                                {
                                    "name": "Table_SQLAzure_Classified_ExecutionIssuesUsrEr"
                                }
                            ],
                            "policy": {
                                "concurrency": 1,
                                "longRetry": 1,
                                "longRetryInterval": "01:00:00",
                                "retry": 2,
                                "timeout": "01:00:00"
                            },
                            "transformation": {
                                "sink": {
                                    "type": "SqlSink",
                                    "writeBatchSize": 10000,
                                    "writeBatchTimeout": "00:10:00"
                                },
                                "source": {
                                    "skipHeaderLineCount": 1,
                                    "type": "BlobSource"
                                }
                            },
                            "type": "CopyActivity"
                        }
                    ],
                    "description": "Classify user error messages",
                    "end": "2015-10-25T00:00:00Z",
                    "isPaused": false,
                    "provisioningState": "Succeeded",
                    "runtimeInfo": {
                        "activePeriodSetTime": null,
                        "activityPeriods": {
                            "cleanCalssifiedErrorsDataForTheWeek": {
                                "end": "2015-10-25T00:00:00Z",
                                "start": "2015-04-05T00:00:00Z"
                            },
                            "copyErrorClassificationToSqlAzure": {
                                "end": "2015-10-25T00:00:00Z",
                                "start": "2015-04-05T00:00:00Z"
                            },
                            "copyToChangeFileName": {
                                "end": "2015-10-25T00:00:00Z",
                                "start": "2015-04-05T00:00:00Z"
                            },
                            "preProcessUserMessagesFromExecutionIssues": {
                                "end": "2015-10-25T00:00:00Z",
                                "start": "2015-04-05T00:00:00Z"
                            },
                            "tfIdfUserErrorClustering": {
                                "end": "2015-10-25T00:00:00Z",
                                "start": "2015-04-05T00:00:00Z"
                            }
                        },
                        "deploymentTime": "2015-05-12T23:17:14.7518541Z"
                    },
                    "start": "2015-04-11T00:00:00Z"
                }
            },
            {
                "id": "/subscriptions/b4f56537-b35f-4395-8621-4279951032ac/resourcegroups/mdwlivesiteresourcegroup1/providers/Microsoft.DataFactory/datafactories/ADFDataLakeFactory/datapipelines/Pipeline_ExecutionEventsIngestionV2",
                "name": "Pipeline_ExecutionEventsIngestionV2",
                "properties": {
                    "activities": [
                        {
                            "inputs": [
                                {
                                    "name": "Table_MDSSource_ExecutionEventsV2"
                                }
                            ],
                            "name": "MdsToStagingBlob",
                            "outputs": [
                                {
                                    "name": "Table_StagingBlob_ExecutionEventsV2"
                                }
                            ],
                            "policy": {
                                "concurrency": 3,
                                "executionPriorityOrder": "NewestFirst",
                                "longRetry": 1,
                                "longRetryInterval": "01:00:00",
                                "retry": 2,
                                "timeout": "00:15:00"
                            },
                            "transformation": {
                                "sink": {
                                    "type": "BlobSink",
                                    "writeBatchSize": 10000,
                                    "writeBatchTimeout": "02:00:00"
                                },
                                "source": {
                                    "mdsStartTime": "$$SliceStart",
                                    "mdsTimeSpan": "00:15:00",
                                    "queryString": "Tenant = \"mdwprod\" and PreciseTimeStamp != \"0001-01-01 00:00:00.0000000\"",
                                    "type": "MdsSource"
                                }
                            },
                            "type": "CopyActivity"
                        },
                        {
                            "inputs": [
                                {
                                    "name": "Table_StagingBlob_ExecutionEventsV2"
                                }
                            ],
                            "name": "StagingBlobToCompliantStore",
                            "outputs": [
                                {
                                    "name": "Table_CompliantStore_ExecutionEventsV2"
                                }
                            ],
                            "policy": {
                                "concurrency": 3,
                                "executionPriorityOrder": "NewestFirst",
                                "longRetry": 1,
                                "longRetryInterval": "01:00:00",
                                "retry": 2,
                                "timeout": "00:15:00"
                            },
                            "transformation": {
                                "sink": {
                                    "type": "BlobSink",
                                    "writeBatchSize": 10000,
                                    "writeBatchTimeout": "02:00:00"
                                },
                                "source": {
                                    "type": "BlobSource"
                                }
                            },
                            "type": "CopyActivity"
                        }
                    ],
                    "description": "Copy Execution Events From Product MDS Telemetry tables to DataLake",
                    "end": "2015-04-13T00:00:00Z",
                    "isPaused": false,
                    "provisioningState": "Succeeded",
                    "runtimeInfo": {
                        "activePeriodSetTime": null,
                        "activityPeriods": {
                            "mdsToStagingBlob": {
                                "end": "2015-04-13T00:00:00Z",
                                "start": "2015-04-11T00:00:00Z"
                            },
                            "stagingBlobToCompliantStore": {
                                "end": "2015-04-13T00:00:00Z",
                                "start": "2015-04-11T00:00:00Z"
                            }
                        },
                        "deploymentTime": "2015-04-16T01:16:29.8221442Z"
                    },
                    "start": "2015-04-11T00:00:00Z"
                }
            },
        ],
        layout: {
            "Edges": [
                {
                    "EndNodeId": "PPIPELINE_EXECUTIONISSUESINGESTIONV2",
                    "StartNodeId": "TTABLE_MDSSOURCE_EXECUTIONISSUESV2",
                    "Waypoints": null
                },
                {
                    "EndNodeId": "PPIPELINE_USERERRORCLUSTERINGV2",
                    "StartNodeId": "TEXECUTIONISSUES",
                    "Waypoints": null
                },
                {
                    "EndNodeId": "PPIPELINE_EXECUTIONEVENTSINGESTIONV2",
                    "StartNodeId": "TTABLE_MDSSOURCE_EXECUTIONEVENTSV2",
                    "Waypoints": null
                },
                {
                    "EndNodeId": "TEXECUTIONISSUES",
                    "StartNodeId": "PPIPELINE_EXECUTIONISSUESINGESTIONV2",
                    "Waypoints": null
                },
                {
                    "EndNodeId": "TTABLE_SQLAZURE_CLASSIFIED_EXECUTIONISSUESUSRER",
                    "StartNodeId": "PPIPELINE_USERERRORCLUSTERINGV2",
                    "Waypoints": null
                },
                {
                    "EndNodeId": "TTABLE_COMPLIANTSTORE_EXECUTIONEVENTSV2",
                    "StartNodeId": "PPIPELINE_EXECUTIONEVENTSINGESTIONV2",
                    "Waypoints": null
                }
            ],
            "GridResolution": 0.0,
            "Nodes": {
                "PPIPELINE_EXECUTIONEVENTSINGESTIONV2": {
                    "Height": 130.0,
                    "Width": 200.0,
                    "X": 830.0,
                    "Y": 0.0
                },
                "PPIPELINE_EXECUTIONISSUESINGESTIONV2": {
                    "Height": 130.0,
                    "Width": 200.0,
                    "X": 280.0,
                    "Y": 150.0
                },
                "PPIPELINE_USERERRORCLUSTERINGV2": {
                    "Height": 130.0,
                    "Width": 200.0,
                    "X": 830.0,
                    "Y": 150.0
                },
                "TEXECUTIONISSUES": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 540.0,
                    "Y": 190.0
                },
                "TEXECUTIONISSUESPREPROCESSEDUSRER": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 1090.0,
                    "Y": 480.0
                },
                "TTABLE_CLASSIFIED_EXECUTIONISSUESUSRER": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 1090.0,
                    "Y": 330.0
                },
                "TTABLE_COMPLIANTSTORE_EXECUTIONEVENTSV2": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 1090.0,
                    "Y": 40.0
                },
                "TTABLE_MDSSOURCE_EXECUTIONEVENTSV2": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 540.0,
                    "Y": 40.0
                },
                "TTABLE_MDSSOURCE_EXECUTIONISSUESV2": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 0.0,
                    "Y": 190.0
                },
                "TTABLE_PREPROCESSED_EXECUTIONISSUES_MLINPUTUSRER": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 1090.0,
                    "Y": 400.0
                },
                "TTABLE_SQLAZURE_CLASSIFIED_EXECUTIONISSUESUSRER": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 1090.0,
                    "Y": 190.0
                },
                "TTABLE_SQLAZURE_PRECLEANEDCLASSIFIEDERRORS": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 1090.0,
                    "Y": 260.0
                },
                "TTABLE_STAGINGBLOB_EXECUTIONEVENTSV2": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 1090.0,
                    "Y": 550.0
                }
            },
            lastModifiedBy: "Cannibal s",
            lastModifiedDate: "11/05/1991 10:23 am"
        },
        listRunRecords: {
            "value": [
                {
                    "id": "d42693d5-7d65-41b7-8b6d-2d5a29638830_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": null,
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "21b12965-a9b9-4e5d-82e1-c14c7f9c1565",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "Succeeded",
                    "processingStartTime": "2014-10-26T17:04:45.0045189Z",
                    "processingEndTime": "2014-10-26T17:06:06.6634273Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 100,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2014-10-26T17:04:45.0045189Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "736b961d-697c-48f6-a777-febb0cff7359_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": null,
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "21b12965-a9b9-4e5d-82e1-c14c7f9c1565",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "Succeeded",
                    "processingStartTime": "2014-10-27T01:35:04.9459057Z",
                    "processingEndTime": "2014-10-27T01:36:42.025554Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 100,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2014-10-27T01:35:04.9459057Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "f6f0d6e9-d513-4ebd-9331-6798c68435ce_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": null,
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "21b12965-a9b9-4e5d-82e1-c14c7f9c1565",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "Succeeded",
                    "processingStartTime": "2014-10-27T05:30:49.5906934Z",
                    "processingEndTime": "2014-10-27T05:32:30.6943702Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 100,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2014-10-27T05:30:49.5906934Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "dc697ccc-ed22-498e-bebf-47c59e6bb24e_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": "Failed to submit Hive job: dc697ccc-ed22-498e-bebf-47c59e6bb24e. Error: An error occurred while sending the request..",
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "b1528782-109f-4a36-8bc1-ab485f573699",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "FailedExecution",
                    "processingStartTime": "2014-11-13T05:36:59.5665597Z",
                    "processingEndTime": "2014-11-13T05:37:21.5221102Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 0,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2014-11-13T05:36:59.5665597Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": false,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "8488b3ee-b90c-48c2-b29b-7855c5d8c07d_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": null,
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "b1528782-109f-4a36-8bc1-ab485f573699",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "Succeeded",
                    "processingStartTime": "2014-11-13T06:39:55.902193Z",
                    "processingEndTime": "2014-11-13T06:41:15.5214712Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 100,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2014-11-13T06:39:55.902193Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "846c128c-4efc-46e7-b30e-c30d72b420d2_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": "Hive script failed with exit code '40000' (permanent). See 'wasb://adfjobs@datalakecompliantstore.blob.core.windows.net/HiveQueryJobs/846c128c-4efc-46e7-b30e-c30d72b420d2/14_11_2014_07_58_33_649/Status/stderr' for more details.",
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "b1528782-109f-4a36-8bc1-ab485f573699",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "FailedExecution",
                    "processingStartTime": "2014-11-14T07:58:33.0241561Z",
                    "processingEndTime": "2014-11-14T08:00:09.5978693Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 0,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2014-11-14T07:58:33.0241561Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "0eb8b649-4a2e-4fc4-96e1-4281cafb0edd_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": null,
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "4e9129b7-8b28-44bf-9b00-560cded333f3",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "Succeeded",
                    "processingStartTime": "2014-11-14T08:06:33.9792804Z",
                    "processingEndTime": "2014-11-14T08:08:08.9380908Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 100,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2014-11-14T08:06:33.9792804Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "fc4cf3c8-de66-4162-bd05-80d842b58772_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": null,
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "2b82f354-8316-413e-a109-74003876b795",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "Succeeded",
                    "processingStartTime": "2014-11-26T09:21:46.6135341Z",
                    "processingEndTime": "2014-11-26T09:24:36.0814784Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 100,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2014-11-26T09:21:46.6135341Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "ad87ca2a-1b7d-41a0-b4b6-9caec93590ca_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": null,
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "2b82f354-8316-413e-a109-74003876b795",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "Succeeded",
                    "processingStartTime": "2014-11-26T17:25:56.2361286Z",
                    "processingEndTime": "2014-11-26T17:27:22.3849343Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 100,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2014-11-26T17:25:56.2361286Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "d6b6d1b0-89f1-42d4-9c43-4b2024189087_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": null,
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "2b82f354-8316-413e-a109-74003876b795",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "Succeeded",
                    "processingStartTime": "2015-02-26T02:35:59.8032657Z",
                    "processingEndTime": "2015-02-26T02:38:05.5690282Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 100,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2015-02-26T02:35:59.8032657Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": null,
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                },
                {
                    "id": "cd5b64fa-5127-45d7-9ac8-bdc5d5e8b20c_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
                    "errorMessage": null,
                    "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
                    "tableName": "Table_HiveTables_ApiCalls",
                    "pipelineId": "2b82f354-8316-413e-a109-74003876b795",
                    "pipelineName": "Pipeline_CreateHiveTables",
                    "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
                    "activityName": "CreateHiveTables",
                    "computeClusterName": "LinkedService_HDIBYOC",
                    "status": "Succeeded",
                    "processingStartTime": "2015-06-24T19:10:43.9411985Z",
                    "processingEndTime": "2015-06-24T19:12:42.2515581Z",
                    "batchTime": "2014-01-01T00:00:00Z",
                    "percentComplete": 100,
                    "dataSliceStart": "2014-01-01T00:00:00Z",
                    "dataSliceEnd": "2015-01-01T00:00:00Z",
                    "timestamp": "2015-06-24T19:10:43.9411985Z",
                    "retryAttempt": 0,
                    "type": "Script",
                    "hasLogs": true,
                    "activityRunId": "00000000-0000-0000-0000-000000000000",
                    "properties": {},
                    "inputRunRecordReferences": null,
                    "outputRunRecordReferences": null,
                    "activityInputProperties": {}
                }
            ]
        },
        getRunRecord: {
            "id": "d6b6d1b0-89f1-42d4-9c43-4b2024189087_635241312000000000_635556672000000000_Table_HiveTables_ApiCalls",
            "errorMessage": null,
            "dataArtifactId": "34ce68c0-d10b-4481-9745-5daa2ef63276",
            "tableName": "Table_HiveTables_ApiCalls",
            "pipelineId": "2b82f354-8316-413e-a109-74003876b795",
            "pipelineName": "Pipeline_CreateHiveTables",
            "activityId": "43a61e79-a45c-c13e-e182-3b82cb59bb77",
            "activityName": "CreateHiveTables",
            "computeClusterName": "LinkedService_HDIBYOC",
            "status": "Succeeded",
            "processingStartTime": "2015-02-26T02:35:59.8032657Z",
            "processingEndTime": "2015-02-26T02:38:05.5690282Z",
            "batchTime": "2014-01-01T00:00:00Z",
            "percentComplete": 100,
            "dataSliceStart": "2014-01-01T00:00:00Z",
            "dataSliceEnd": "2015-01-01T00:00:00Z",
            "timestamp": "2015-02-26T02:35:59.8032657Z",
            "retryAttempt": 0,
            "type": "Script",
            "hasLogs": true,
            "activityRunId": null,
            "properties": {},
            "inputRunRecordReferences": [],
            "outputRunRecordReferences": [],
            "activityInputProperties": {}
        },
        listRunLogs: [
            {
                "Name": "Query\/74f649b3-a903-19d5-ab74-db9b1a10f99b.hql",
                "Size": 1421,
                "Date": "2015-07-14T23:17:39Z",
                "SasUri": "https:\/\/mdpprodstorewest.blob.core.windows.net\/62c7e99f-e32b-4aa8-aef1-c5365634db59\/Query\/74f649b3-a903-19d5-ab74-db9b1a10f99b.hql?sv=2014-02-14&sr=c&sig=7qPUmtxXiLkGSKr8YSbqxpJRNu2Nfm9p%2FsCIo9JBC%2FM%3D&st=2015-07-15T23%3A11%3A05Z&se=2015-07-16T01%3A11%3A05Z&sp=rl"
            },
            {
                "Name": "Status",
                "Size": 0,
                "Date": "2015-07-14T23:17:39Z",
                "SasUri": "https:\/\/mdpprodstorewest.blob.core.windows.net\/62c7e99f-e32b-4aa8-aef1-c5365634db59\/Status?sv=2014-02-14&sr=c&sig=7qPUmtxXiLkGSKr8YSbqxpJRNu2Nfm9p%2FsCIo9JBC%2FM%3D&st=2015-07-15T23%3A11%3A05Z&se=2015-07-16T01%3A11%3A05Z&sp=rl"
            },
            {
                "Name": "Status\/exit",
                "Size": 3,
                "Date": "2015-07-14T23:17:39Z",
                "SasUri": "https:\/\/mdpprodstorewest.blob.core.windows.net\/62c7e99f-e32b-4aa8-aef1-c5365634db59\/Status\/exit?sv=2014-02-14&sr=c&sig=7qPUmtxXiLkGSKr8YSbqxpJRNu2Nfm9p%2FsCIo9JBC%2FM%3D&st=2015-07-15T23%3A11%3A05Z&se=2015-07-16T01%3A11%3A05Z&sp=rl"
            },
            {
                "Name": "Status\/stderr",
                "Size": 793,
                "Date": "2015-07-14T23:17:39Z",
                "SasUri": "https:\/\/mdpprodstorewest.blob.core.windows.net\/62c7e99f-e32b-4aa8-aef1-c5365634db59\/Status\/stderr?sv=2014-02-14&sr=c&sig=7qPUmtxXiLkGSKr8YSbqxpJRNu2Nfm9p%2FsCIo9JBC%2FM%3D&st=2015-07-15T23%3A11%3A05Z&se=2015-07-16T01%3A11%3A05Z&sp=rl"
            },
            {
                "Name": "Status\/stdout",
                "Size": 0,
                "Date": "2015-07-14T23:17:39Z",
                "SasUri": "https:\/\/mdpprodstorewest.blob.core.windows.net\/62c7e99f-e32b-4aa8-aef1-c5365634db59\/Status\/stdout?sv=2014-02-14&sr=c&sig=7qPUmtxXiLkGSKr8YSbqxpJRNu2Nfm9p%2FsCIo9JBC%2FM%3D&st=2015-07-15T23%3A11%3A05Z&se=2015-07-16T01%3A11%3A05Z&sp=rl"
            }
        ]
    };
    exports.MyLogProcessing = {
        tables: [
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Minute",
                "name": "Minute",
                "properties": {
                    "availability": {
                        "frequency": "Minute",
                        "interval": 15
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Minute20",
                "name": "Minute20",
                "properties": {
                    "availability": {
                        "frequency": "Minute",
                        "interval": 20
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Minute37",
                "name": "Minute37",
                "properties": {
                    "availability": {
                        "frequency": "Minute",
                        "interval": 37
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Minute70",
                "name": "Minute70",
                "properties": {
                    "availability": {
                        "frequency": "Minute",
                        "interval": 70
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Minute120",
                "name": "Minute120",
                "properties": {
                    "availability": {
                        "frequency": "Minute",
                        "interval": 120
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Hour",
                "name": "Hour",
                "properties": {
                    "availability": {
                        "frequency": "Hour",
                        "interval": 1
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Hour3",
                "name": "Hour3",
                "properties": {
                    "availability": {
                        "frequency": "Hour",
                        "interval": 3
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Hour12",
                "name": "Hour12",
                "properties": {
                    "availability": {
                        "frequency": "Hour",
                        "interval": 12
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Hour13",
                "name": "Hour13",
                "properties": {
                    "availability": {
                        "frequency": "Hour",
                        "interval": 13
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Hour25",
                "name": "Hour25",
                "properties": {
                    "availability": {
                        "frequency": "Hour",
                        "interval": 25
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Hour24",
                "name": "Hour24",
                "properties": {
                    "availability": {
                        "frequency": "Hour",
                        "interval": 24
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Day",
                "name": "Day",
                "properties": {
                    "availability": {
                        "frequency": "Day",
                        "interval": 1
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Day3",
                "name": "Day3",
                "properties": {
                    "availability": {
                        "frequency": "Day",
                        "interval": 3
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Day7",
                "name": "Day7",
                "properties": {
                    "availability": {
                        "frequency": "Day",
                        "interval": 7
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Week",
                "name": "Week",
                "properties": {
                    "availability": {
                        "frequency": "Week",
                        "interval": 1
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Week2",
                "name": "Week2",
                "properties": {
                    "availability": {
                        "frequency": "Week",
                        "interval": 2
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Week3",
                "name": "Week3",
                "properties": {
                    "availability": {
                        "frequency": "Week",
                        "interval": 3
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Week5",
                "name": "Week5",
                "properties": {
                    "availability": {
                        "frequency": "Week",
                        "interval": 5
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Month",
                "name": "Month",
                "properties": {
                    "availability": {
                        "frequency": "Month",
                        "interval": 1
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Month3",
                "name": "Month3",
                "properties": {
                    "availability": {
                        "frequency": "Month",
                        "interval": 3
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Month13",
                "name": "Month13",
                "properties": {
                    "availability": {
                        "frequency": "Month",
                        "interval": 13
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
            {
                "id": "/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.DataFactory/datafactories/MyLogProcessing/tables/Year",
                "name": "Year",
                "properties": {
                    "availability": {
                        "frequency": "Month",
                        "interval": 12
                    },
                    "createTime": "2015-04-16T01:16:07.3257526Z",
                    "location": {
                        "type": "AzureBlobLocation"
                    },
                    "provisioningState": "Succeeded",
                    "published": false
                }
            },
        ],
        pipelines: [],
        layout: {
            Edges: [],
            Nodes: {
                "TMINUTE": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 10,
                    "Y": 10,
                },
                "TMINUTE20": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 240,
                    "Y": 10,
                },
                "TMINUTE37": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 470,
                    "Y": 10,
                },
                "TMINUTE70": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 700,
                    "Y": 10,
                },
                "TMINUTE120": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 930,
                    "Y": 10,
                },
                "THOUR": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 10,
                    "Y": 70,
                },
                "THOUR3": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 240,
                    "Y": 70,
                },
                "THOUR12": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 470,
                    "Y": 70,
                },
                "THOUR13": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 700,
                    "Y": 70,
                },
                "THOUR25": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 930,
                    "Y": 70,
                },
                "THOUR24": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 1160,
                    "Y": 70,
                },
                "TDAY": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 10,
                    "Y": 130,
                },
                "TDAY3": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 240,
                    "Y": 130,
                },
                "TDAY7": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 470,
                    "Y": 130,
                },
                "TWEEK": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 10,
                    "Y": 190,
                },
                "TWEEK2": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 240,
                    "Y": 190,
                },
                "TWEEK3": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 470,
                    "Y": 190,
                },
                "TWEEK5": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 700,
                    "Y": 190,
                },
                "TMONTH": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 10,
                    "Y": 250,
                },
                "TMONTH3": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 240,
                    "Y": 250,
                },
                "TMONTH13": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 470,
                    "Y": 250,
                },
                "TYEAR": {
                    "Height": 50.0,
                    "Width": 225.0,
                    "X": 10,
                    "Y": 310,
                },
            },
            lastModifiedBy: "Cannibal s",
            lastModifiedDate: "11/05/1991 10:23 am"
        }
    };
});
//# sourceMappingURL=DataFactoryMockData.js.map