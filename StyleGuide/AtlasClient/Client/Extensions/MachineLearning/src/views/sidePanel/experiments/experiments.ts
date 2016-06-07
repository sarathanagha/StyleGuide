/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./experiments.html" />
/// <amd-dependency path="css!./experiments.css" />
/// <reference path="../../../libs/mlstudio/typings/datalabclient.d.ts" />

/// <amd-dependency path="../../../libs/mlstudio/LocalizedResources" />
/// <amd-dependency path="../../../libs/mlstudio/DataLabClient" />
/// <amd-dependency path="../../../libs/mlstudio/MockShell" />
/// <amd-dependency path="../../../libs/mlstudio/Shell" />
/// <amd-dependency path="../../../libs/mlstudio/ExperimentEditor" />
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/experimenteditor-overrides.css"/>
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/DataLab.css" />
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/experimentEditor.css" />
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/common.css" />
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/xeScreenLayout.css" />
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/datalab.contextmenu.css" />
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/datalab.dialogs.css" />
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/datalab.validation.css" />
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/datalab.propertyeditor.css" />
/// <amd-dependency path="css!../../../libs/mlstudio/CSS/ee-sprite.css" />

export var template:string = require("text!./experiments.html");

export class viewModel {

    public treeData:KnockoutObservableArray<any>;

    public treeConfig:KnockoutObservable<any>;

    public selectedExperimentId:KnockoutObservable<any>;
    private treeOpen:boolean = true;
    constructor(params:any) {

        var experiments = DataLab.DataContract.TestData.Experiments;
        this.selectedExperimentId = ko.observable("");

        this.treeConfig = ko.observable({
            'datastudio': {
                'open_all': true
            }
        });

        var treeDataJson = [
            {
                id: 'machineLearning',
                text: 'Experiments',
                data: function() {
                    return this.selectedExperimentId;
                },
                children: [
                    {text: 'Experiment One', id: experiments.SimpleExperiment.ExperimentId},
                    {text: 'Experiment Two', id: experiments.RelevantParametersExperiment.ExperimentId},
                    {text: 'Experiment Three', id: experiments.BreastCancer.ExperimentId}
                ]
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
    public onSelectNode = (sender:any, args:{ node: any; selected: any[]; event: Event }):void => {
        if (!args.node.children || args.node.children.length === 0) {
            this.selectedExperimentId(args.node.id);
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