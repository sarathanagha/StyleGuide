// <reference path="../../../References.d.ts" />
// <reference path="../../../../bin/Module.d.ts" />
// <reference path="../BaseBrowseResultsViewModel.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../BaseBrowseResultsViewModel", "text!./list.html", "css!./list.css"], function (require, exports, BaseViewModels) {
    exports.template = require("text!./list.html");
    var viewModel = (function (_super) {
        __extends(viewModel, _super);
        function viewModel() {
            _super.apply(this, arguments);
        }
        return viewModel;
    })(BaseViewModels.BaseBrowseResultsViewModel);
    exports.viewModel = viewModel;
});
//# sourceMappingURL=list.js.map