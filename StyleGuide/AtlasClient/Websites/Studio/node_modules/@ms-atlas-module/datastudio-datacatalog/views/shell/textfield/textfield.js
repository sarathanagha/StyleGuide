/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./textfield.html", "css!./textfield.css"], function (require, exports, ko) {
    exports.template = require("text!./textfield.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            this.label = ko.observable("");
            this.value = ko.observable("");
            this.isValid = ko.observable(true);
            this.placeHolderText = ko.observable("");
            this.id = ko.observable("");
            var self = this;
            self.label(parameters.label);
            self.placeHolderText(parameters.placeholderText);
            self.id(parameters.bindingPath);
            self.pattern = parameters.validatePattern || /.*/;
            if (parameters.value) {
                self.value(parameters.value);
            }
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
//# sourceMappingURL=textfield.js.map