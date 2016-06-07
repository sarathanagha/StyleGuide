/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./webservices.html" />
/// <amd-dependency path="css!./webservices.css" />

export var template:string = require("text!./webservices.html");

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
                text: 'Web services',
                children: [
                    {text: 'Web service One'},
                    {text: 'Web service Two'},
                    {text: 'Web service Three'}
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