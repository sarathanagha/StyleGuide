/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./list.html" />
/// <amd-dependency path="css!./list.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import IListParameters = Microsoft.DataStudio.DataCatalog.Interfaces.IListParameters;

export var template: string = require("text!./list.html");

export class viewModel {

    private dispose: () => void;
    public resx = resx;

    public title: KnockoutObservable<string>;
    public list: KnockoutObservableArray<string>;
    public showCount: KnockoutObservable<number>;
    public callback: any = (groupType: string, data: string) => { };

    public expanded: KnockoutObservable<boolean>;
    public expandable: KnockoutObservable<boolean>;
    public clickable: KnockoutObservable<boolean>;
    public groupType: KnockoutObservable<string>;

    constructor(params: IListParameters) {
        var self = this;

        self.title = ko.observable(params.title);
        self.list = ko.observableArray(params.data);
        self.showCount = ko.observable(params.numberInitiallyVisible);
        self.callback = params.click || self.callback;

        self.expanded = ko.observable(false);
        self.expandable = ko.observable(false);
        self.clickable = ko.observable(!!self.callback);
        self.groupType = ko.observable(params.groupType || '');

        self.expandable(params.data.length > params.numberInitiallyVisible && self.showCount() > 0);
    }

    public onSeeMore() {
        this.expanded(!this.expanded());
    }

    public onItemSelected = (data: string) => {
        if (this.clickable()) {
            this.callback(this.groupType(), data);
        }
    }

    public computedList: KnockoutComputed<string[]> = ko.pureComputed<string[]>(() => {
        var list: string[] = this.list();
        if (this.expandable() && !this.expanded() && this.showCount() > 0) {
            list = list.slice(0, this.showCount());
        }
        return list;
    });

    public expandedText: KnockoutComputed<string> = ko.pureComputed<string>(() => {
        return this.expanded() ? resx.seeLess : resx.seeMore;
    });
}