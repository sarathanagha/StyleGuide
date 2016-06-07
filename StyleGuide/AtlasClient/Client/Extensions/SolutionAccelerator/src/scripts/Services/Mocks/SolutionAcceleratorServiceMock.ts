/// <reference path="../SolutionAcceleratorService.ts" />
/// <reference path="SolutionAcceleratorEditorialContent.ts" />

module Microsoft.DataStudio.SolutionAccelerator.Services.Mocks
{
    var logger = Microsoft.DataStudio.SolutionAccelerator.LoggerFactory.getLogger({ loggerName: "SolutionAcceleratorServiceMock", category: "Mock" });

    export class SolutionAcceleratorServiceMock implements SolutionAcceleratorService
    {
        public static CONNECTEDCAR_ARMTEMPLATE: string = "connectedcar";
        public static PM_ARMTEMPLATE: string = "predictivemaintenance";
        public static DF_ARMTEMPLATE: string = "demandforecasting";
        public static ANOMALYDETECTION: string = "anomalydetection";

        // TODO Move instance variable to factory.
        private static _instance: SolutionAcceleratorServiceMock;

        public static getInstance(): SolutionAcceleratorServiceMock
        {

            if (!SolutionAcceleratorServiceMock._instance)
            {
                SolutionAcceleratorServiceMock._instance = new SolutionAcceleratorServiceMock();
            }

            return SolutionAcceleratorServiceMock._instance;
        }

        private SolutionAcceleratorTemplates: Model.SolutionAcceleratorTemplate[] =
        [
            {
                description: "",
                graphType: "customerchurn",
                graphTemplate:
                {
                    "edges": [
                        {
                            "startNodeId": "ClassicStorage",
                            "endNodeId": "Sql"
                        },
                        {
                            "startNodeId": "SampleData",
                            "endNodeId": "ClassicStorage"
                        },
                        {
                            "startNodeId": "Sql",
                            "endNodeId": "PowerBI"
                        },
                        {
                            "startNodeId": "DataFactory",
                            "endNodeId": "DOTTED"
                        }
                    ],
                    "nodes": {
                        "HdInsight": {
                            "x": 234,
                            "y": 92,
                            "height": 100,
                            "image": "ADF-01.svg",
                            "nodeDisplayName": "HdInsight",
                            "name": "YourCustomerChurn",
                            "width": 370,
                            "typeKey": "HD"
                        },
                        "MachineLearning": {
                            "x": 621,
                            "y": 92,
                            "height": 100,
                            "image": "ML-01.svg",
                            "nodeDisplayName": "Machine Learning",
                            "name": "YourCustomerChurn_WS",
                            "width": 180,
                            "typeKey": "ML"
                        },
                        "Sql": {
                            "x": 860,
                            "y": 240,
                            "height": 100,
                            "image": "Data-01.svg",
                            "nodeDisplayName": "Azure SQL Database",
                            "name": "YourCustomerChurnDW",
                            "typeKey": "ADW",
                            "width": 180
                        },
                        "ClassicStorage": {
                            "x": 230,
                            "y": 240,
                            "height": 100,
                            "image": "ADF-01.svg",
                            "nodeDisplayName": "Azure Blob Storage",
                            "name": "YourCustomerChurn_DL",
                            "typeKey": "DL",
                            "width": 600,
                        },
                        "DataFactory": {
                            "x": 433,
                            "y": 453,
                            "height": 100,
                            "image": "ADF-01.svg",
                            "nodeDisplayName": "DataFactory",
                            "name": "YourCustomerChurn-ADF",
                            "typeKey": "ADF",
                            "width": 180,
                        },
                        "PowerBI": {
                            "x": 1082,
                            "y": 239,
                            "displayClasses": "power-bi",
                            "height": 100,
                            "image": "ADF-01.svg",
                            "nodeDisplayName": "Power BI",
                            "name": "YourCustomerChurnDW-BI",
                            "typeKey": "BI",
                            "width": 180,
                        },
                        "SampleData": {
                            "x": 16,
                            "y": 240,
                            "displayClasses": "sample-data",
                            "height": 100,
                            "image": "ADF-01.svg",
                            "nodeDisplayName": "Sample Data",
                            "name": "YourCustomerChurn-SampleData",
                            "typeKey": "SD",
                            "width": 180
                        }
                    },
                    "cycles": {
                        "cycle1": {
                            "top": {
                                "x": 320,
                                "y": 240,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 320,
                                "y": 190,
                                "height": 0,
                                "width": 0
                            }
                        },
                        "cycle2": {
                            "top": {
                                "x": 650,
                                "y": 240,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 650,
                                "y": 190,
                                "height": 0,
                                "width": 0
                            }
                        }
                    }
                }
            },
            {
                description: "",
                graphType: SolutionAcceleratorServiceMock.CONNECTEDCAR_ARMTEMPLATE,
                graphTemplate:
                {
                    "edges": [
                        {
                            "startNodeId": "StreamAnalytics",
                            "endNodeId": "PowerBI"
                        },
                        {
                            "startNodeId": "InputData",
                            "endNodeId": "EventHub"
                        },
                        {
                            "startNodeId": "ClassicStorage",
                            "endNodeId": "Sql"
                        },
                        {
                            "startNodeId": "SampleData",
                            "endNodeId": "ClassicStorage"
                        },
                        {
                            "startNodeId": "Sql",
                            "endNodeId": "PowerBI"
                        },
                        {
                            "startNodeId": "DataFactory",
                            "endNodeId": "DOTTED"
                        }
                    ],
                    "nodes": {
                        "InputData": {
                            "x": 16,
                            "y": 4,
                            "displayClasses": "sample-data",
                            "description": EditorialContent.ConnectedCarVehicleDataDescription,
                            "details": EditorialContent.ConnectedCarVehicleDataDetails,
                            "height": 100,
                            "image": "",
                            "isStaticNode": true,
                            "nodeDisplayName": EditorialContent.ConnectedCarVehicleDataNodeName,
                            "name": "Vehicle Telematics Simulator",
                            "typeKey": "DE",
                            "width": 180,
                            "linkMappings": EditorialContent.linkMappings.connectedcar.InputData
                        },
                        "EventHub": {
                            "x": 234,
                            "y": 5,
                            "description": EditorialContent.EventHubDescription,
                            "details": EditorialContent.EventHubDetails,
                            "height": 100,
                            "image": EditorialContent.EventHubIcon,
                            "nodeDisplayName": EditorialContent.EventHubNodeName,
                            "name": "",
                            "typeKey": "EH",
                            "width": 180
                        },
                        "StreamAnalytics": {
                            "x": 234,
                            "y": 150,
                            "description": EditorialContent.StreamAnalyticsDescription,
                            "details": EditorialContent.StreamAnalyticsDetails,
                            "height": 100,
                            "image": EditorialContent.StreamAnalyticsIcon,
                            "nodeDisplayName": EditorialContent.StreamAnalyticsNodeName,
                            "name": "",
                            "typeKey": "SA",
                            "width": 600
                        },
                        "HDInsight": {
                            "x": 380,
                            "y": 300,
                            "description": EditorialContent.HDInsightDescription,
                            "details": EditorialContent.HDInsightDetails,
                            "height": 100,
                            "image": EditorialContent.HDInsightIcon,
                            "nodeDisplayName": EditorialContent.HDInsightNodeName,
                            "name": "",
                            "typeKey": "HD",
                            "width": 180,
                        },
                        "MachineLearning": {
                            "x": 621,
                            "y": 300,
                            "description": EditorialContent.MachineLearningDescription,
                            "details": EditorialContent.MachineLearningDetails,
                            "height": 100,
                            "image": EditorialContent.MachineLearningIcon,
                            "nodeDisplayName": EditorialContent.MachineLearningNodeName,
                            "name": "",
                            "typeKey": "ML",
                            "width": 180,
                        },
                        "Sql": {
                            "x": 860,
                            "y": 460,
                            "description": EditorialContent.AzureSQLDescription,
                            "details": EditorialContent.AzureSQLDetails,
                            "height": 100,
                            "image": EditorialContent.AzureSQLIcon,
                            "nodeDisplayName": EditorialContent.AzureSQLNodeName,
                            "name": "",
                            "typeKey": "ADW",
                            "width": 180
                        },
                        "ClassicStorage": {
                            "x": 230,
                            "y": 460,
                            "description": "",
                            "details": EditorialContent.BlobStorageDetails,
                            "height": 100,
                            "image": "",
                            "nodeDisplayName": EditorialContent.BlobStorageNodeName,
                            "name": "",
                            "typeKey": "DL",
                            "width": 600
                        },
                        "DataFactory": {
                            "x": 433,
                            "y": 665,
                            "description": EditorialContent.DataFactoryDescription,
                            "details": EditorialContent.DataFactoryDetails,
                            "height": 100,
                            "image": EditorialContent.DataFactoryIcon,
                            "nodeDisplayName": EditorialContent.DataFactoryNodeName,
                            "name": "",
                            "typeKey": "ADF",
                            "width": 180
                        },
                        "PowerBI": {
                            "x": 860,
                            "y": 150,
                            "displayClasses": "power-bi",
                            "description": EditorialContent.PowerBIDescription,
                            "details": EditorialContent.ConnectedCarPowerBIDetails,
                            "height": 100,
                            "image": EditorialContent.PowerBIIcon,
                            "isStaticNode": true,
                            "nodeDisplayName": EditorialContent.PowerBINodeName,
                            "name": "Power BI Dashboard",
                            "typeKey": "BI",
                            "width": 180,
                            "linkMappings": EditorialContent.linkMappings.connectedcar.PowerBI
                        },
                        "SampleData": {
                            "x": 16,
                            "y": 460,
                            "displayClasses": "sample-data",
                            "description": EditorialContent.ConnectedCarCatalogDataDescription,
                            "details": EditorialContent.ConnectedCarCatalogDataDetails,
                            "height": 100,
                            "image": "",
                            "isStaticNode": true,
                            "nodeDisplayName": EditorialContent.ConnectedCarCatalogDataNodeName,
                            "name": "Vehicle Catalog Data",
                            "typeKey": "SD",
                            "width": 180
                        }
                    },
                    "cycles": {
                        "cycle1": {
                            "top": {
                                "x": 310,
                                "y": 155,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 310,
                                "y": 105,
                                "height": 0,
                                "width": 0
                            }
                        },
                        "cycle2": {
                            "top": {
                                "x": 310,
                                "y": 455,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 310,
                                "y": 250,
                                "height": 0,
                                "width": 0
                            }
                        },
                         "cycle3": {
                            "top": {
                                "x": 700,
                                "y": 305,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 700,
                                "y": 245,
                                "height": 0,
                                "width": 0
                            }
                        },
                        "cycle4": {
                            "top": {
                                "x": 450,
                                "y": 465,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 450,
                                "y": 395,
                                "height": 0,
                                "width": 0
                            }
                        },
                        "cycle5": {
                            "top": {
                                "x": 700,
                                "y": 465,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 700,
                                "y": 395,
                                "height": 0,
                                "width": 0
                            }
                        }
                    }
                }
            },
            {
                description: "",
                graphType: SolutionAcceleratorServiceMock.PM_ARMTEMPLATE,
                graphTemplate:
                {
                    "edges": [
                        {
                            "startNodeId": "StreamAnalytics",
                            "endNodeId": "PowerBI"
                        },
                        {
                            "startNodeId": "InputData",
                            "endNodeId": "EventHub"
                        },
                        {
                            "startNodeId": "EventHub",
                            "endNodeId": "StreamAnalytics"
                        },
                        {
                            "startNodeId": "StreamAnalytics",
                            "endNodeId": "ClassicStorage"
                        },
                        {
                            "startNodeId": "ClassicStorage",
                            "endNodeId": "Sql"
                        },
                        {
                            "startNodeId": "Sql",
                            "endNodeId": "PowerBI"
                        },
                        {
                            "startNodeId": "DataFactory",
                            "endNodeId": "DOTTED"
                        }
                    ],
                    "nodes": {
                        "InputData": {
                            "x": 16,
                            "y": 4,
                            "displayClasses": "sample-data",
                            "description": EditorialContent.PredictiveMaintenanceDataNodeDescription,
                            "details": EditorialContent.PredictiveMaintenanceDataNodeDetails,
                            "height": 100,
                            "image": "",
                            "isStaticNode": true,
                            "nodeDisplayName": "Predictive Maintenance Input Data",
                            "name": EditorialContent.PredictiveMaintenanceDataNodeName,
                            "typeKey": "DE",
                            "width": 180,
                            "linkMappings": EditorialContent.linkMappings.predictivemaintenance.InputData
                        },
                        "EventHub": {
                            "x": 440,
                            "y": 5,
                            "description": EditorialContent.PredictiveMaintenanceEventHubDescription,
                            "details": EditorialContent.PredictiveMaintenanceEventHubDetails,
                            "height": 100,
                            "image": EditorialContent.EventHubIcon,
                            "nodeDisplayName": EditorialContent.EventHubNodeName,
                            "name": "",
                            "typeKey": "EH",
                            "width": 180
                        },
                        "StreamAnalytics": {
                            "x": 440,
                            "y": 150,
                            "description": EditorialContent.PredictiveMaintenanceStreamAnalyticsDescription,
                            "details": EditorialContent.PredcitiveMaintenanceStreamAnalyticsDetails,
                            "height": 100,
                            "image": EditorialContent.StreamAnalyticsIcon,
                            "nodeDisplayName": EditorialContent.StreamAnalyticsNodeName,
                            "name": "",
                            "typeKey": "SA",
                            "width": 180
                        },
                        "HDInsight": {
                            "x": 260,
                            "y": 300,
                            "description": EditorialContent.PredictiveMaintenanceHDInsightDescription,
                            "details": EditorialContent.PredictiveMaintenanceHDInsightDetails,
                            "height": 100,
                            "image": EditorialContent.HDInsightIcon,
                            "nodeDisplayName": EditorialContent.HDInsightNodeName,
                            "name": "",
                            "typeKey": "HD",
                            "width": 180,
                        },
                        "MachineLearning": {
                            "x": 621,
                            "y": 300,
                            "description": EditorialContent.PredictiveMaintenanceMLDescription,
                            "details": EditorialContent.PredictiveMaintenanceMLDetails,
                            "height": 100,
                            "image": EditorialContent.MachineLearningIcon,
                            "nodeDisplayName": EditorialContent.MachineLearningNodeName,
                            "name": "",
                            "typeKey": "ML",
                            "width": 180,
                        },
                        "Sql": {
                            "x": 860,
                            "y": 460,
                            "description": EditorialContent.PredictiveMaintenanceSQLDescription,
                            "details": EditorialContent.PredictiveMaintenanceSQLDetails,
                            "height": 100,
                            "image": EditorialContent.AzureSQLIcon,
                            "nodeDisplayName": EditorialContent.AzureSQLNodeName,
                            "name": "",
                            "typeKey": "ADW",
                            "width": 180
                        },
                        "ClassicStorage": {
                            "x": 230,
                            "y": 460,
                            "description": EditorialContent.PredicitveMaintenanceStorageDescription,
                            "details": EditorialContent.PredictiveMaintenanceStorageDetails,
                            "height": 100,
                            "image": "",
                            "nodeDisplayName": EditorialContent.BlobStorageNodeName,
                            "name": "",
                            "typeKey": "DL",
                            "width": 600
                        },
                        "DataFactory": {
                            "x": 433,
                            "y": 665,
                            "description": EditorialContent.PredictiveMaintenanceDataFactoryDescription,
                            "details": EditorialContent.PredictiveMaintenanceDataFactoryDetails,
                            "height": 100,
                            "image": EditorialContent.DataFactoryIcon,
                            "nodeDisplayName": EditorialContent.DataFactoryNodeName,
                            "name": "",
                            "typeKey": "ADF",
                            "width": 180
                        },
                        "PowerBI": {
                            "x": 860,
                            "y": 150,
                            "displayClasses": "power-bi",
                            "description": EditorialContent.PredictiveMaintenancePowerBIDescription,
                            "details": EditorialContent.PredictiveMaintenancePowerBIDetails,
                            "height": 100,
                            "image": EditorialContent.PowerBIIcon,
                            "isStaticNode": true,
                            "nodeDisplayName": EditorialContent.PowerBINodeName,
                            "name": "Power BI Dashboard",
                            "typeKey": "BI",
                            "width": 180,
                            "linkMappings": EditorialContent.linkMappings.predictivemaintenance.PowerBI
                        }
                    },
                    "cycles": {
                        "cycle1": {
                            "top": {
                                "x": 710,
                                "y": 465,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 710,
                                "y": 395,
                                "height": 0,
                                "width": 0
                            }
                        },
                        "cycle2": {
                            "top": {
                                "x": 350,
                                "y": 465,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 350,
                                "y": 395,
                                "height": 0,
                                "width": 0
                            }
                        }
                    }
                }
            },
            {
                description: "",
                graphType: SolutionAcceleratorServiceMock.DF_ARMTEMPLATE,
                graphTemplate:
                {
                    "edges": [
                        {
                            "startNodeId": "StreamAnalytics",
                            "endNodeId": "PowerBI"
                        },
                        {
                            "startNodeId": "InputData",
                            "endNodeId": "EventHub"
                        },
                        {
                            "startNodeId": "EventHub",
                            "endNodeId": "StreamAnalytics"
                        },
                        {
                            "startNodeId": "StreamAnalytics",
                            "endNodeId": "ClassicStorage"
                        },
                        {
                            "startNodeId": "ClassicStorage",
                            "endNodeId": "Sql"
                        },
                        {
                            "startNodeId": "ReferenceData",
                            "endNodeId": "ClassicStorage"
                        },
                        {
                            "startNodeId": "Sql",
                            "endNodeId": "PowerBI"
                        },
                        {
                            "startNodeId": "DataFactory",
                            "endNodeId": "DOTTED"
                        }
                    ],
                    "nodes": {
                        "InputData": {
                            "x": 16,
                            "y": 4,
                            "displayClasses": "sample-data",
                            "description": EditorialContent.DemandForecastingDataNodeDescription,
                            "details": EditorialContent.DemandForecastingDataNodeDetails,
                            "height": 100,
                            "image": "",
                            "isStaticNode": true,
                            "nodeDisplayName": "Input Data",
                            "name": EditorialContent.DemandForecastingDataNodeName,
                            "typeKey": "DE",
                            "width": 280,
                            "linkMappings": EditorialContent.linkMappings.demandforecasting.InputData
                        },
                        "EventHub": {
                            "x": 470,
                            "y": 5,
                            "description": EditorialContent.DemandForecastingEventHubDescription,
                            "details": EditorialContent.DemandForecastingEventHubDetails,
                            "height": 100,
                            "image": EditorialContent.EventHubIcon,
                            "nodeDisplayName": EditorialContent.EventHubNodeName,
                            "name": "",
                            "typeKey": "EH",
                            "width": 180
                        },
                        "StreamAnalytics": {
                            "x": 470,
                            "y": 150,
                            "description": EditorialContent.DemandForecastingStreamAnalyticsDescription,
                            "details": EditorialContent.DemandForecastingStreamAnalyticsDetails,
                            "height": 100,
                            "image": EditorialContent.StreamAnalyticsIcon,
                            "nodeDisplayName": EditorialContent.StreamAnalyticsNodeName,
                            "name": "",
                            "typeKey": "SA",
                            "width": 180
                        },
                        "HDInsight": {
                            "x": 310,
                            "y": 300,
                            "description": EditorialContent.DemandForecastingHDInsightDescription,
                            "details": EditorialContent.DemandForecastingHDInsightDetails,
                            "height": 100,
                            "image": EditorialContent.HDInsightIcon,
                            "nodeDisplayName": EditorialContent.HDInsightNodeName,
                            "name": "",
                            "typeKey": "HD",
                            "width": 180,
                        },
                        "MachineLearning": {
                            "x": 630,
                            "y": 300,
                            "description": EditorialContent.DemandForecastingMLDescription,
                            "details": EditorialContent.DemandForecastingMLDetails,
                            "height": 100,
                            "image": EditorialContent.MachineLearningIcon,
                            "nodeDisplayName": EditorialContent.MachineLearningNodeName,
                            "name": "",
                            "typeKey": "ML",
                            "width": 180,
                        },
                        "Sql": {
                            "x": 860,
                            "y": 460,
                            "description": EditorialContent.DemandForecastingSQLDescription,
                            "details": EditorialContent.DemandForecastingSQLDetails,
                            "height": 100,
                            "image": EditorialContent.AzureSQLIcon,
                            "nodeDisplayName": EditorialContent.AzureSQLNodeName,
                            "name": "",
                            "typeKey": "ADW",
                            "width": 180
                        },
                        "ClassicStorage": {
                            "x": 310,
                            "y": 460,
                            "description": EditorialContent.DemandForecastingStorageDescription,
                            "details": EditorialContent.DemandForecastingStorageDetails,
                            "height": 100,
                            "image": "",
                            "nodeDisplayName": EditorialContent.BlobStorageNodeName,
                            "name": "",
                            "typeKey": "DL",
                            "width": 500
                        },
                        "DataFactory": {
                            "x": 433,
                            "y": 665,
                            "description": EditorialContent.DemandForecastingDataFactoryDescription,
                            "details": EditorialContent.DemandForecastingDataFactoryDetails,
                            "height": 100,
                            "image": EditorialContent.DataFactoryIcon,
                            "nodeDisplayName": EditorialContent.DataFactoryNodeName,
                            "name": "",
                            "typeKey": "ADF",
                            "width": 180
                        },
                        "PowerBI": {
                            "x": 860,
                            "y": 150,
                            "displayClasses": "power-bi",
                            "description": EditorialContent.DemandForecastingPowerBIDescription,
                            "details": EditorialContent.DemandForecastingPowerBIDetails,
                            "height": 100,
                            "image": EditorialContent.PowerBIIcon,
                            "isStaticNode": true,
                            "nodeDisplayName": EditorialContent.PowerBINodeName,
                            "name": "Power BI Dashboard",
                            "typeKey": "BI",
                            "width": 180,
                            "linkMappings": EditorialContent.linkMappings.demandforecasting.PowerBI
                        },
                        "ReferenceData": {
                            "x": 16,
                            "y": 460,
                            "displayClasses": "sample-data",
                            "description": EditorialContent.DemandForecastingReferenceDataDescription,
                            "details": EditorialContent.DemandForecastingReferenceDataDetails,
                            "height": 100,
                            "image": "",
                            "isStaticNode": true,
                            "nodeDisplayName": "Reference Data",
                            "name": EditorialContent.DemandForecastingReferenceDataNodeName,
                            "typeKey": "SD",
                            "width": 260
            }
                    },
                    "cycles": {
                        "cycle1": {
                            "top": {
                                "x": 710,
                                "y": 465,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 710,
                                "y": 395,
                                "height": 0,
                                "width": 0
                            }
                        },
                        "cycle2": {
                            "top": {
                                "x": 400,
                                "y": 465,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 400,
                                "y": 395,
                                "height": 0,
                                "width": 0
                            }
                        }
                    }
                }
            },
            {
                description: "Anomaly Detection",
                graphType: SolutionAcceleratorServiceMock.ANOMALYDETECTION,
                graphTemplate:
                {
                    "edges": [
                        {
                            "startNodeId": "InputData",
                            "endNodeId": "EventHub"
                        },
                        {
                            "startNodeId": "EventHub",
                            "endNodeId": "StreamAnalytics"
                        },
                        {
                            "startNodeId": "StreamAnalytics",
                            "endNodeId": "Storage"
                        },
                        {
                            "startNodeId": "Storage",
                            "endNodeId": "PowerBI"
                        },
                        {
                            "startNodeId": "DataFactory",
                            "endNodeId": "DOTTED"
                        }
                    ],
                    "nodes": {
                        "InputData": {
                            "x": 16,
                            "y": 4,
                            "displayClasses": "sample-data",
                            "description": EditorialContent.AnomalyDetectionDataNodeDescription,
                            "details": EditorialContent.AnomalyDetectionDataNodeDetails,
                            "height": 100,
                            "image": "",
                            "isStaticNode": true,
                            "nodeDisplayName": "Anomaly Detection Input Data",
                            "name": EditorialContent.AnomalyDetectionDataNodeName,
                            "typeKey": "DE",
                            "width": 180,
                            "linkMappings": EditorialContent.linkMappings.anomalydetection.InputData
                        },
                        "EventHub": {
                            "x": 440,
                            "y": 5,
                            "description": EditorialContent.AnomalyDetectionEventHubDescription,
                            "details": EditorialContent.AnomalyDetectionEventHubDetails,
                            "height": 100,
                            "image": EditorialContent.EventHubIcon,
                            "nodeDisplayName": EditorialContent.EventHubNodeName,
                            "name": "",
                            "typeKey": "EH",
                            "width": 180
                        },
                        "StreamAnalytics": {
                            "x": 440,
                            "y": 150,
                            "description": EditorialContent.AnomalyDetectionStreamAnalyticsDescription,
                            "details": EditorialContent.AnomalyDetectionStreamAnalyticsDetails,
                            "height": 100,
                            "image": EditorialContent.StreamAnalyticsIcon,
                            "nodeDisplayName": EditorialContent.StreamAnalyticsNodeName,
                            "name": "",
                            "typeKey": "SA",
                            "width": 180
                        },
                        "HDInsight": {
                            "x": 260,
                            "y": 300,
                            "description": EditorialContent.AnomalyDetectionHDInsightDescription,
                            "details": EditorialContent.AnomalyDetectionHDInsightDetails,
                            "height": 100,
                            "image": EditorialContent.HDInsightIcon,
                            "nodeDisplayName": EditorialContent.HDInsightNodeName,
                            "name": "",
                            "typeKey": "HD",
                            "width": 180,
                        },
                        "Storage": {
                            "x": 230,
                            "y": 460,
                            "description": EditorialContent.AnomalyDetectionStorageDescription,
                            "details": EditorialContent.AnomalyDetectionStorageDetails,
                            "height": 100,
                            "image": "",
                            "nodeDisplayName": EditorialContent.BlobStorageNodeName,
                            "name": "",
                            "typeKey": "DL",
                            "width": 600
                        },
                        "DataFactory": {
                            "x": 433,
                            "y": 665,
                            "description": EditorialContent.AnomalyDetectionDataFactoryDescription,
                            "details": EditorialContent.AnomalyDetectionDataFactoryDetails,
                            "height": 100,
                            "image": EditorialContent.DataFactoryIcon,
                            "nodeDisplayName": EditorialContent.DataFactoryNodeName,
                            "name": "",
                            "typeKey": "ADF",
                            "width": 180
                        },
                        "ADMarketplaceAPI": {
                            "x": 621,
                            "y": 300,
                            "description": EditorialContent.AnomalyDetectionMLDescription,
                            "details": EditorialContent.AnomalyDetectionMLDetails,
                            "height": 100,
                            "isStaticNode": true,
                            "image": EditorialContent.MachineLearningIcon,
                            "nodeDisplayName": EditorialContent.AnomalyDetectionMachineLearningNodeName,
                            "name": "Anomaly Detection",
                            "displayClasses": "existing-resource",
                            "typeKey": "ML",
                            "width": 180,
                        },
                        "PowerBI": {
                            "x": 1160,
                            "y": 460,
                            "displayClasses": "power-bi",
                            "description": EditorialContent.AnomalyDetectionPowerBIDescription,
                            "details": EditorialContent.AnomalyDetectionPowerBIDetails,
                            "height": 100,
                            "image": EditorialContent.PowerBIIcon,
                            "isStaticNode": true,
                            "nodeDisplayName": EditorialContent.PowerBINodeName,
                            "name": "Power BI Dashboard",
                            "typeKey": "BI",
                            "width": 180,
                            "linkMappings": EditorialContent.linkMappings.anomalydetection.PowerBI
                        }
                    },
                    "cycles": {
                        "cycle1": {
                            "top": {
                                "x": 710,
                                "y": 465,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 710,
                                "y": 395,
                                "height": 0,
                                "width": 0
                            }
                        },
                        "cycle2": {
                            "top": {
                                "x": 350,
                                "y": 465,
                                "height": 0,
                                "width": 0
                            },
                            "bottom": {
                                "x": 350,
                                "y": 395,
                                "height": 0,
                                "width": 0
                            }
                        }
                    }
                }
            }
        ];

        getSolutionAcceleratorTemplate(templateType: string): Promise<Model.SolutionAcceleratorTemplate>
        {
            var deferredResult: Q.Deferred<Model.SolutionAcceleratorTemplate> = Q.defer<Model.SolutionAcceleratorTemplate>();
            var solutionAcceleratorTemplates: Model.SolutionAcceleratorTemplate[] = this.SolutionAcceleratorTemplates.filter((template: Model.SolutionAcceleratorTemplate): boolean =>
            {
                return template.graphType.toLowerCase() === templateType.replace(" ", "").toLowerCase();
            });
            deferredResult.resolve(solutionAcceleratorTemplates[0]);
            return deferredResult.promise;
        }

        // TODO (sbian) - This is technical debt. we would want to remove this once we can consolidate the solution accelerator graph/status models
        //                The mock objects are kept for extracting title/description of a particular solution accelerator only 
        private SolutionAccelerators: Model.SolutionAccelerator[] =
        [
            {
                title: "Connected Car",
                description: EditorialContent.ConnectedCarOverallDescription,
                templateId: SolutionAcceleratorServiceMock.CONNECTEDCAR_ARMTEMPLATE,
                // None of the following matters as they would be replaced by server data
                graphTemplate: null,
                imageUrl: null,
                moduleUrl: null,
                resources: null,
                exeLinks: null,
                resourceGroupName: "",
                provisionState: null,
                partitionKey: "",
                rowKey: "",
                timestamp: "",
                eTag: "",
            },
            {
                title: "Predictive Maintenance",
                description: EditorialContent.PMOverallDescription,
                templateId: SolutionAcceleratorServiceMock.PM_ARMTEMPLATE,
                // None of the following matters as they would be replaced by server data
                graphTemplate: null,
                imageUrl: null,
                moduleUrl: null,
                resources: null,
                exeLinks: null,
                resourceGroupName: "",
                provisionState: null,
                partitionKey: "",
                rowKey: "",
                timestamp: "",
                eTag: "",
            },
            {
                title: "Demand Forecasting",
                description: EditorialContent.DFOverallDescription,
                templateId: SolutionAcceleratorServiceMock.DF_ARMTEMPLATE,
                // None of the following matters as they would be replaced by server data
                graphTemplate: null,
                imageUrl: null,
                moduleUrl: null,
                resources: null,
                exeLinks: null,
                resourceGroupName: "",
                provisionState: null,
                partitionKey: "",
                rowKey: "",
                timestamp: "",
                eTag: "",
            },
            {
                title: "Anomaly Detection",
                description: EditorialContent.ADOverallDescription,
                templateId: SolutionAcceleratorServiceMock.ANOMALYDETECTION,
                // None of the following matters as they would be replaced by server data
                graphTemplate: null,
                imageUrl: null,
                moduleUrl: null,
                resources: null,
                exeLinks: null,
                resourceGroupName: "",
                provisionState: null,
                partitionKey: "",
                rowKey: "",
                timestamp: "",
                eTag: ""
            }

            // ** Add more template title/description here
        ];

        // Note: only the static title/description returned by this call is used
        getDeployedSolutionStatus(solutionTemplate: string): Promise<any>
        {
            var saInstance: Model.SolutionAccelerator = this.SolutionAccelerators[0];
            this.SolutionAccelerators.some(sa => {
                if (sa.templateId == solutionTemplate) {
                    saInstance = sa;
                    console.log("Rendering a template with type: " + sa.templateId);
                    return true;
                }
            });

            return Promise.resolve(saInstance);
        }

        getSolutionAccelerators(): Promise<Model.SolutionAccelerator[]>
        {
            logger.logDebug("Method call", { methodName: "getSolutionAccelerators" });
            return Promise.resolve(this.SolutionAccelerators);
            }

        // Only the static content returned by this API are used
        getAllDeployedSolutions(): Promise<any[]>
        {
            return Promise.resolve(this.SolutionAccelerators);
        }

        getSolutionAcceleratorById(SolutionAcceleratorId: string): Promise<Model.SolutionAccelerator>
        {
            logger.logDebug("Method call", { methodName: "getSolutionAcceleratorById" });

            var matchedSolutionAcceleratorTemplates: Model.SolutionAccelerator[] =
                this.SolutionAccelerators.filter((template: Model.SolutionAccelerator): boolean =>
                {
                    return template.rowKey === SolutionAcceleratorId;
                });

            if (matchedSolutionAcceleratorTemplates.length === 0)
            {
                return Promise.reject(new Error("SolutionAccelerator template ${id} not found"));
            }

            return Promise.resolve(matchedSolutionAcceleratorTemplates[0]);
        }

        // NOT IN USE: this is implementation placeholder til we fully remove mock
        deploySolution(solutionId: string, templateId: string, templateParams: string, resourceGroupName?: string): Promise<any[]> {
            return null;
        }

        createSolutionAccelerator(templateId: string, name?: string): Promise<Model.SolutionAccelerator>
        {
            var templatePromise: Promise<Model.SolutionAccelerator> = this.getSolutionAcceleratorById(templateId);
            var promise = new Promise<Model.SolutionAccelerator>((resolve, reject) =>
            {

                templatePromise.then((template: Model.SolutionAccelerator) =>
                {
                    var SolutionAccelerator: Model.SolutionAccelerator = {
                        title: null,
                        description: null,
                        graphTemplate: null,
                        imageUrl: "",
                        moduleUrl: "",
                        templateId: SolutionAcceleratorServiceMock.CONNECTEDCAR_ARMTEMPLATE,
                        resources: null,
                        provisionState: null,
                        resourceGroupName: "connectedcar_ResourceGroup",
                        exeLinks: null,
                        partitionKey: "eb9abb49-69c9-490e-a11b-ca21b8cef619",
                        rowKey: "trial_createblob",
                        timestamp: "2015-09-22T01:23:36.0544595+00:00",
                        eTag: "W/\"datetime'2015-09-22T01%3A23%3A36.0544595Z'\"",
                    };

                    resolve(SolutionAccelerator);
                }).catch((error: Error) => reject(error));
            });
            return promise;
        }

        deleteSolution(solutionId: string): Promise<any[]> {
            logger.logDebug("Service API call", { methodName: "deploySolution" });
            return null;
        };
    }
}