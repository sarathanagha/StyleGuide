/// <reference path="../../references.d.ts" />

/// <amd-dependency path="text!./documents.html" />
/// <amd-dependency path="css!./documents.css" />

import Router = Microsoft.DataStudio.Application.Router;

export var template:string = require("text!./documents.html");

export class viewModel {

    public treeData:KnockoutObservableArray<any>;

    public treeConfig:KnockoutObservable<any>;

    constructor(params:any) {

        this.treeConfig = ko.observable({
            'datastudio': {
                'open_all': false
            }
        });

        // TODO: change ids (for demo these point to sample views)
        var dataFactoryTree:any = [
            {
                id: 'datalakeFactory',
                text: 'DataLake Factory',
                children: [
                    { id: 'datafactory/datasets', text: 'Datasets', children: [
                        { id: 'datafactory/ds_1a', text: 'MDSSource_ExecutionIssuesV2' },
                        { id: 'datafactory/ds_1b', text: 'MDSSource_ExecutionEvents' },
                        { id: 'datafactory/ds_1c', text: 'Table_SQLAzure_ExecIssues' }
                    ] },
                    { text: 'Pipelines', children: [
                        { id: 'datafactory/pl_1a', text: 'PipelineExecutionIngestion' },
                        { id: 'datafactory/pl_1b', text: 'EventsIngestionPipeline' },
                        { id: 'datafactory/pl_1c', text: 'PipelineUserErrorClustering' },
                        { id: 'datafactory/pl_1d', text: 'PipelineErrorClusteringV2' }
                    ] },
                    { text: 'Linked Services', children: [
                        { id: 'datafactory/ls_1a', text: 'LS_HDIStorage' },
                        { id: 'datafactory/ls_1b', text: 'LS_OnDemandStorage' }
                    ] }
                ]
            }
 
        ];

        var machineLearningTree:any = [
            {
                id: 'MyWorkspace',
                text: 'My Workspace',
                children: [
                    {text: 'FraudDetection'},
                    {text: 'PredictionExperiment'}
                ]
            },
            {
                id: 'AtlasTeamWorkspace',
                text: 'Atlas Team Workspace',
                children: [{}]
            }
        ];

        var streamAnalyticsTree:any = [
            {
                id: 'sensorStreamJob',
                text: 'Sensor Stream Job'
            },
            {
                id: 'twitterStream',
                text: 'TwitterStream'
            }
        ];


        var dataConnectTree : any = [
            {
                id: 'connections',
                text: 'Default',
                children: [
                    {
                        id: 'dataconnect/connectors/DataLakeSales',
                        text: 'DataLakeSales'
                    },
                    {
                        id: 'dataconnect/connectors/DataLakeProducts',
                        text: 'DataLakeProducts'
                    }
                ]
            },
            {
                id: 'gateways',
                text: 'Datalake Data',
                children: [
                    {
                        id: 'dataconnect/gateways/DataLakeCentralGateway',
                        text: 'DataLakeCentralGateway'
                    }
                ]
            }
        ];
        
        var treeDataJson = [
            {
                // TODO: remove underscore from id (for demo these point to sample views)
                id: 'dataFactory',
                text: 'Data Factory',
                state: {
                    opened: true
                },
                children: dataFactoryTree
            },
            {
                id: 'machineLearning',
                text: 'Machine Learning Studio',
                children: machineLearningTree
            },
            {
                id: 'streamanalytics',
                text: 'Stream Analytics',
                children: streamAnalyticsTree
            },
            {
                id: 'dataconnect',
                text: 'Data Connect',
                children: dataConnectTree
            },
        ];

        this.expandNode(treeDataJson[0]);

        this.treeData = ko.observableArray(treeDataJson);
    }

    /**
     * Treeview selected node handler.
     * @param sender Event sender.
     * @param args Event args.
     */
    public onSelectNode(sender: any, args: { node: any; selected: any[]; event: Event }): void {

        // If this wasn't triggered by a click/tap, then ignore
        if (args.event == undefined || args.event.type != "click")
            return;

        // If non-leaf node then return
        if (args.node.children && args.node.children.length > 0)
            return;

        if (!args.node.id)
            return;

        var urlTokens = args.node.id.split("/");

        if (urlTokens.length < 2)
            return;

        var moduleName = urlTokens[0];
        var viewName = urlTokens[1];

        switch (moduleName) {
            case "dataconnect":
                switch (viewName) {
                    case "connectors":
                        Router.navigate("dataconnect/connectors/" + args.node.text);
                        break;
                    case "gateways":
                        Router.navigate("dataconnect/gateways/" + args.node.text);
                        break;
                    default:
                        break;
                }
                break;
            case "datafactory":
                Router.navigate("datafactory/edit/" + args.node.text);
                break;
        }
    }

    private expandNode(treeElement: any): void {
        if (!treeElement.state) {
            treeElement.state = { opened: true }
        } else {
            treeElement.state.opened = true;
        }

        if (treeElement.children) {
            treeElement.children.forEach((el =>{ this.expandNode(el)}));
        }
    }
}
