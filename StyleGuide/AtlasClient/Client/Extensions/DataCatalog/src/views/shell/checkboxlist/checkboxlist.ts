/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./checkboxlist.html" />
/// <amd-dependency path="css!./checkboxlist.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import ICheckboxListParameters = Microsoft.DataStudio.DataCatalog.Interfaces.ICheckboxListParameters;
import IFilterItem = Microsoft.DataStudio.DataCatalog.Interfaces.IFilterItem;

export var template: string = require("text!./checkboxlist.html");

export class viewModel {
    public resx = resx;
    public data: IFilterItem[];
    public computedData: KnockoutComputed<IFilterItem[]>;
    public selected: KnockoutObservableArray<IFilterItem>;
    public expanded: KnockoutObservable<boolean>;
    public expandable: KnockoutObservable<boolean>;
    public expandText: KnockoutComputed<string>;
    public onChange: (data: any, event: Event) => void;
    public max: number;

    constructor(parameters: ICheckboxListParameters) {
        var self = this;

        self.max = parameters.max;
        self.data = parameters.data || [];
        self.selected = parameters.selected;
        self.expanded = ko.observable(false);

        var windowSize = Math.min(parameters.numberInitiallyVisible || 4, self.max);

        self.expandable = ko.pureComputed<boolean>(() => {
            if (self.data.length > 0) {
                var groupType = self.data[0].groupType;
                var selected = (self.selected() || []).filter(s => s.groupType === groupType);

                return Math.min(self.data.length, self.max) > Math.max(windowSize, selected.length);
            }
            return false;
        });

        self.computedData = ko.pureComputed(() => {
            var all = [];
            if (self.data.length > 0) {
                var groupType = self.data[0].groupType;

                var sorter = (a: IFilterItem, b: IFilterItem): number => {
                    var compareNumbers = (a: number, b: number) => {
                        return b - a;
                    };

                    var compareStrings = (a: string, b: string) => {
                        if (a > b) { return 1; }
                        if (a < b) { return -1; }
                        return 0;
                    }
                    // Sort highest counts first and then alphabetically
                    return compareNumbers(a.count, b.count) || compareStrings(a.term, b.term);
                };

                all = self.data.sort(sorter);

                all = all.slice(0, self.expanded()
                    ? self.max
                    : windowSize);
            }
            return all;
        });

        self.expandText = ko.pureComputed(() => {
            return self.expanded() ? resx.seeLess : resx.seeMore;
        });

        self.onChange = (data: any, event: Event) => {
            // Let knockout binding occur prior to calling change method
            setTimeout(() => {
                parameters.onChange(data, event);
            }, 0);
        };
    }

    onSeeMore() {
        this.expanded(!this.expanded());
    }

    formatLabel(item: IFilterItem) {
        var primaryResxKey = (item.groupType + "_verbose_" + item.term).replace(/\s/g, "").toLowerCase();
        var secondaryResxKey = (item.groupType + "_" + item.term).replace(/\s/g, "").toLowerCase();
        var label = item.term;
        if (resx[primaryResxKey] || resx[secondaryResxKey]) {
            label = util.stringCapitalize(resx[primaryResxKey] || resx[secondaryResxKey]);            
        }
        var countString = item.count !== undefined ? util.stringFormat(" ({0})", item.count) : "";
        return util.removeHtmlTags(label + countString);
    }
}