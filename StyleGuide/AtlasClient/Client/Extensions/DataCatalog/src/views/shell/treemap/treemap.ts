/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./treemap.html" />
/// <amd-dependency path="css!./treemap.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import Logging = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import ITreeMapParameters = Microsoft.DataStudio.DataCatalog.Interfaces.ITreeMapParameters;
import ITreeMapItem = Microsoft.DataStudio.DataCatalog.Interfaces.ITreeMapItem;

export var template: string = require("text!./treemap.html");

export class viewModel {
    private dispose: () => void;
    public resx = resx;

    private minValue: number = 0;
    private maxValue: number = 0;
    private normalizeValue: number = 2;
    private sizes: string[] = ["small", "medium", "large"];

    callback = (groupType: string, data: string) => { };
    clickable = ko.observable<boolean>(false);

    tileItems = ko.observable<ITreeMapItem[]>([]);
    listItems = ko.observable<string[]>([]);

    expanded = ko.observable<boolean>(false);
    expandable = ko.observable<boolean>(false);

    private logger = Logging.getLogger({ category: "Shell Components" });

    constructor(params: ITreeMapParameters) {
        this.getMinMax(params.items);
        this.normalizeValues(params.items);
        this.buildLists(params.items);
        this.expandable(this.listItems().length > 0);

        if (params.click) {
            this.callback = params.click;
            this.clickable(true);
        }
    }

    private getMinMax(items: ITreeMapItem[]) {
        if (items.length) {
            this.minValue = items[0].value;
            this.maxValue = items[0].value;
            items.forEach((item: ITreeMapItem) => {
                if (item.value > this.maxValue) {
                    this.maxValue = item.value;
                }
                if (item.value < this.minValue) {
                    this.minValue = item.value;
                }
            });
        }
    }

    private normalizeValues(items: ITreeMapItem[]) {
        var range: number = (this.maxValue - this.minValue) || 1;
        items.forEach((item: ITreeMapItem) => {
            item.normalizedValue = Math.ceil(((item.value - this.minValue) / range) * this.normalizeValue);
            item.css = this.sizes[item.normalizedValue];
        });
    }

    private buildLists(items: ITreeMapItem[]) {
        var count: number = 0;
        items.forEach((item: ITreeMapItem) => {
            if (count + item.normalizedValue + 1 <= 16) {
                this.tileItems().push(item);
                if (item.normalizedValue === 2) {
                    count += 4;
                }
                else {
                    count += item.normalizedValue + 1;
                }
            }
            else {
                this.listItems().push(item.name);
            }
        });
        // Make sure the remaining items fit evenly into four columns.
        var over = this.listItems().length % 4;
        var listItems = this.listItems();
        listItems = listItems.slice(0, listItems.length - over);
        this.listItems(listItems);
    }

    expandedText = ko.pureComputed<string>(() => {
        return this.expanded() ? resx.seeLess : resx.seeMore;
    });

    onSeeMore() {
        this.expanded(!this.expanded());
    }

    onItemSelected = (data: string) => {
        if (this.clickable()) {
            this.logger.logInfo("Discovery start page: selected tag: "  + data);
            this.callback("tags", data);
        }
    }

    onTileSelected = (data: ITreeMapItem) => {
        if (this.clickable()) {
            this.logger.logInfo("Discovery start page: selected tag tile: " + data.name );
            this.callback("tags", data.name);
        }
    }

}