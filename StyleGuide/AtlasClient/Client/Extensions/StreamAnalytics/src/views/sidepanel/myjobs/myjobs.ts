/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./myjobs.html" />
/// <amd-dependency path="css!./myjobs.css" />

export var template: string = require("text!./myjobs.html");

export class viewModel  {
    public treeData: KnockoutObservableArray<any>;

    public treeConfig: KnockoutObservable<any>;

    constructor(params: any) {
        this.treeConfig = ko.observable({});
        this.treeData = ko.observableArray([
            {
                id: 'jobs',
                text: 'My Jobs',
                children: [
                    { text: 'Twitter Feed', icon: null },
                    { text: 'Streaming Kittens', icon: null },
                    { text: 'Point of Purchase Skews', icon: null },
                    { text: 'Weather Data', icon: null },
                    { text: 'Turbo Sensor', icon: null },
                    { text: 'Sensors in Asia', icon: null },
                    { text: 'Gameplay Clicks', icon: null },
                    { text: 'Call logs from Europe', icon: null }
                ]
            }
        ]);
    }

    /**
     * Treeview selected node handler.
     * @param sender Event sender.
     * @param args Event args.
     */
    public onSelectNode(sender: any, args: { node: any; selected: any[]; event: Event }): void {
    }
}