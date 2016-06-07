/// <reference path="../../../References.d.ts" />

import Filter = require("./Filter");

export enum MonitoringViewType {
    System,
    User
};

export class Sort {
    public column: string;
    public order: string;

    constructor(column: string, order: string) {
        this.column = column;
        this.order = order;
    }

    public stringify(): string {
        return "{0} {1}".format(this.column, this.order);
    }
}

export class MonitoringView {
    public type: MonitoringViewType;
    public id: string;
    public text: string;
    public filter: Filter.State;
    public sort: Sort;
    public modified: boolean;

    constructor(type: MonitoringViewType, id: string, text: string, filter: Filter.State, sort: Sort, modified: boolean = false) {
        this.type = type;
        this.id = id;
        this.text = text;
        this.filter = filter;
        this.sort = sort;
        this.modified = modified;
    }
}

export let equalityFilterTemplate =  "{0} eq '{1}'";
export let dualEqualityFilterTemplate = "({0} eq '{1}' and {2} eq '{3}')";
export let extractFilterFromTemplateRegex = /eq(?:\s*)'(.*)'/;
export let extractDualFilterFromTemplateRegex = /eq(?:\s*)'(.*)'(?:\s*)and(?:\s*)(?:.*)(?:\s*)eq(?:\s*)'(.*)'/;
