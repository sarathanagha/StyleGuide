// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "text!./about.html"], function (require, exports) {
    /// <amd-dependency path="text!./about.html" />
    exports.template = require("text!./about.html");
    var viewModel = (function () {
        function viewModel(parameters) {
        }
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=about.js.map