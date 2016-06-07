/// <reference path="../../../references.d.ts" />
/// <amd-dependency path="text!./actionitemslist.html" />
/// <amd-dependency path="css!./actionitemslist.css" />

import Model = Microsoft.DataStudio.Model;
import Controls = Microsoft.DataStudio.UxShell.Controls;

export var template: string = require("text!./actionitemslist.html");

export class viewModel {

    public params: Controls.IActionItemListParams;

    constructor(params: Controls.IActionItemListParams) {
        this.params = params;
    }
}