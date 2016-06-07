/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./datasets.html" />
/// <amd-dependency path="css!./datasets.css" />

export var template:string = require("text!./datasets.html");

export class viewModel {

    public treeData:KnockoutObservableArray<any>;

    public treeConfig:KnockoutObservable<any>;

    constructor(params:any) {

        this.treeConfig = ko.observable({
            'datastudio': {
                'open_all': true
            }
        });
        
        var treeDataJson = [
            {
                id: 'machineLearning',
                text: 'Data sets',
                children: [
                    {text: 'Data set One'},
                    {text: 'Data set Two'},
                    {text: 'Data set Three'}
                ]
            },
        ];

        this.expandNode(treeDataJson[0]);

        this.treeData = ko.observableArray(treeDataJson);
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