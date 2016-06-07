/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./textarea.html", "css!./textarea.css"], function (require, exports, ko) {
    exports.template = require("text!./textarea.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            this.label = ko.observable("");
            this.value = ko.observable("");
            this.isValid = ko.observable(true);
            this.id = ko.observable("");
            var self = this;
            self.label(parameters.label);
            self.id(parameters.bindingPath);
            self.pattern = parameters.validatePattern || /.*/;
        }
        viewModel.prototype.validate = function () {
            var self = this;
            var valid = self.pattern.test(self.value());
            self.isValid(valid);
            return valid;
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=textarea.js.map