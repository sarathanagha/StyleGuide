/// <reference path="../../References.d.ts" />
/// <reference path="../../../bin/Module.d.ts" />
/// <amd-dependency path="text!./default.html" />
/// <amd-dependency path="css!./default.css" />
define(["require", "exports", "text!./default.html", "css!./default.css"], function (require, exports) {
    exports.template = require("text!./default.html");
    var viewModel = (function () {
        function viewModel() {
            var self = this;
        }
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=default.js.map