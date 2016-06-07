/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./trainedmodels.html" />
/// <amd-dependency path="css!./trainedmodels.css" />

export var template:string = require("text!./trainedmodels.html");

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
                text: 'Trained models',
                children: [
                    {text: 'Model One'},
                    {text: 'Model Two'},
                    {text: 'Model Three'}
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