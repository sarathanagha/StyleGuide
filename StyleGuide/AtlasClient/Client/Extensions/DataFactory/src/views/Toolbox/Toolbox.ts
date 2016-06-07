/// <reference path="../../references.d.ts" />
/// <amd-dependency path="text!./toolbox.html" />
/// <amd-dependency path="css!./toolbox.css" />

import ToolboxItems = require("./ToolboxItems");
import Framework = require("../../_generated/Framework");

/* tslint:disable no-let-requires */
export const template: string = require("text!./toolbox.html");
/* tslint:enable no-let-requires */

export class Toolbox {
    private static _instance: Toolbox;

    public categories: KnockoutObservableArray<Category>;
    private categoryMap: { [categoryName: string]: Category };
    private tools: ToolboxItems.IToolboxItem[];

    public static getInstance(): Toolbox {
        if (!Toolbox._instance) {
            Toolbox._instance = new Toolbox();
        }
        return Toolbox._instance;
    }

    constructor() {
        this.categories = ko.observableArray<Category>([]);
        this.categoryMap = {};
        this.tools = [];
    }

    public addToolboxItem(tool: ToolboxItems.IToolboxItem) {
        tool.id = this.tools.length.toString();
        this.tools.push(tool);
        let categoryName: string = tool.category;
        let category = this.categoryMap[categoryName];
        if (!category) {
            category = new Category(categoryName);
            this.categories.push(category);
            this.categoryMap[categoryName] = category;
        }
        category.addTool(tool);
    }

    public getToolboxItem(id: string): ToolboxItems.IToolboxItem {
        return this.tools[id];
    }
}

export class Category {
    public name: string;
    public tools: KnockoutObservableArray<ToolboxItems.IToolboxItem>;
    public caretIcon = ko.observable<string>();
    private categoryContentsVisible = ko.observable(true);

    constructor(name: string) {
        this.tools = ko.observableArray<ToolboxItems.IToolboxItem>([]);
        this.name = name;
        this.caretIcon(Framework.Svg.caret_downright);
    }

    public addTool(tool: ToolboxItems.IToolboxItem) {
        this.tools.push(tool);
    }

    /* tslint:disable:no-unused-variable */
    private toggleCategoryContents() {
    /* tslint:enable:no-unused-variable */
        this.categoryContentsVisible(!this.categoryContentsVisible());
        if (this.categoryContentsVisible()) {
            this.caretIcon(Framework.Svg.caret_downright);
        } else {
            this.caretIcon(Framework.Svg.caret_right);
        }
    }
}

export class ToolboxViewModel {
    public gripperIcon: string;
    public toolbox: Toolbox;

    public entityDropped = (tool: ToolboxItems.IToolboxItem, event: Event, info: { position: Object }) => {
        // noop
    };

    constructor(params: Object) {
        this.toolbox = Toolbox.getInstance();
        this.populateCategories();
        this.gripperIcon = Framework.Svg.gripper;
    }

    private populateCategories = (): void => {
        this.toolbox.addToolboxItem(new ToolboxItems.CopyToolboxItem());
        this.toolbox.addToolboxItem(new ToolboxItems.PigToolboxItem());
        this.toolbox.addToolboxItem(new ToolboxItems.HiveToolboxItem());
        this.toolbox.addToolboxItem(new ToolboxItems.AzureMLToolboxItem());
        this.toolbox.addToolboxItem(new ToolboxItems.StoredProcedureToolboxItem());
        this.toolbox.addToolboxItem(new ToolboxItems.MapReduceToolboxItem());
    };
}

export let viewModel = ToolboxViewModel;
