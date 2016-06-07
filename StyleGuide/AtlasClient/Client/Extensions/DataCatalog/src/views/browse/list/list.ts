// <reference path="../../../References.d.ts" />
// <reference path="../../../../bin/Module.d.ts" />
// <reference path="../BaseBrowseResultsViewModel.ts" />

/// <amd-dependency path="text!./list.html" />
/// <amd-dependency path="css!./list.css" />

import $ = require("jquery");
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import BaseViewModels = require("../BaseBrowseResultsViewModel");

export var template: string = require("text!./list.html");

export class viewModel extends BaseViewModels.BaseBrowseResultsViewModel {
}