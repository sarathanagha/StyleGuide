// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "jquery", "text!./attributes.html", "css!./attributes.css"], function (require, exports, ko, $) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    exports.template = require("text!./attributes.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            this.resx = resx;
            this.plainText = util.plainText;
            this.escapeHtml = util.escapeHtml;
            this.removeHtmlTags = util.removeHtmlTags;
            this.showInput = ko.observable(false);
            this.inputHasFocus = ko.observable(false);
            this.attributesToAdd = ko.observable("");
            this.showValidationError = ko.observable(false);
            this.errorMessage = ko.observable("");
            this.attributesOnAll = parameters.attributesOnAll;
            this.attributesOnSome = parameters.attributesOnSome;
            this.placeholderText = parameters.placeholderText;
            this.groupTypeName = parameters.groupTypeName;
            this.mode = ko.isObservable(this.attributesOnSome) ? "multi" : "single";
            this.onAdd = parameters.onAdd || (function (a) { });
            this.onRemove = parameters.onRemove || (function (a) { });
            this.onRemoved = parameters.onRemoved || (function (a) { });
            this.onValidate = parameters.onValidate || (function (a) { return jQuery.Deferred().resolve(a).promise(); });
            this.hideAddButton = !!parameters.hideAddButton;
            this.showTooltip = parameters.showTooltip || false;
        }
        viewModel.prototype.onInputKeyUp = function (data, event) {
            if (event.keyCode === constants.KeyCodes.ENTER) {
                $(event.target).blur();
            }
            return true;
        };
        viewModel.prototype.addAttributes = function () {
            var _this = this;
            var attributes = this.attributesToAdd().split(/[,;]/).map($.trim).reverse().filter(function (s) { return s !== ""; });
            this.onValidate(attributes)
                .done(function (validAttributes) {
                _this.showValidationError(false);
                validAttributes = validAttributes || [];
                validAttributes.forEach(function (attribute) {
                    var tooltips = [{ email: $tokyo.user.email }];
                    attribute && _this.addAttributeToAll({ name: attribute, tooltips: tooltips, readOnly: false });
                });
                if (validAttributes.length) {
                    _this.onAdd(validAttributes);
                }
                if (attributes.length === validAttributes.length) {
                    _this.showValidationError(false);
                    _this.attributesToAdd("");
                    _this.showInput(false);
                }
                else {
                    var invalidAttributes = attributes.filter(function (item) { return validAttributes.indexOf(item) < 0; });
                    _this.attributesToAdd(invalidAttributes.join());
                    _this.errorMessage(resx.validEmailErrorMessage);
                    _this.showValidationError(true);
                    _this.showInput(true);
                    _this.inputHasFocus(true);
                }
            });
        };
        viewModel.prototype.addAttributeToAll = function (attribute) {
            if (this.hideAddButton) {
                return;
            }
            if (!attribute.readOnly && this.attributesOnSome) {
                this.attributesOnSome.remove(attribute);
            }
            if (attribute.tooltips && !attribute.tooltips.some(function (tp) { return tp.email === $tokyo.user.email; })) {
                attribute.tooltips.push({ email: $tokyo.user.email });
            }
            if (!this.attributesOnAll().some(function (a) { return a.name.toUpperCase() === attribute.name.toUpperCase(); })) {
                this.attributesOnAll.unshift({ name: $.trim(attribute.name), readOnly: false, tooltips: attribute.tooltips });
            }
            this.showInput(false);
        };
        viewModel.prototype.removeAttributeFrom = function (attribute, collection) {
            var _this = this;
            this.dismissPopovers();
            this.showInput(false);
            var result = this.onRemove(attribute.name);
            if (result && typeof result === "object" && typeof result.done === "function") {
                result.done(function () {
                    collection.remove(attribute);
                    _this.onRemoved(attribute.name);
                });
            }
            else {
                collection.remove(attribute);
                this.onRemoved(attribute.name);
            }
        };
        viewModel.prototype.clickAdd = function (d, e) {
            var _this = this;
            var element = $(e.target);
            var oWidth = element.width();
            element.animate({ width: "100%" }, 150).promise().done(function () {
                _this.showInput(true);
                _this.inputHasFocus(true);
                element.width(oWidth);
            });
        };
        viewModel.prototype.onAttributeClick = function (attribute, event) {
            if (!this.groupTypeName) {
                return;
            }
            this.dismissPopovers();
            var item = browseManager.filterTypes().findItem(this.groupTypeName, this.plainText(attribute.name));
            if (!item) {
                item = browseManager.filterTypes().createItem(this.groupTypeName, this.plainText(attribute.name));
            }
            if (browseManager.selectedFilters().every(function (f) { return f.groupType !== item.groupType || f.term !== item.term; })) {
                // Add tag filter
                browseManager.selectedFilters.push(item);
                browseManager.doSearch();
            }
            else {
                // Remove tag filter
                var selectedFilters = browseManager.selectedFilters();
                selectedFilters = selectedFilters.filter(function (f) { return f.groupType !== item.groupType || f.term !== item.term; });
                browseManager.selectedFilters(selectedFilters);
                browseManager.doSearch();
            }
        };
        viewModel.prototype.isFilteredByTag = function (attribute) {
            var _this = this;
            if (!this.groupTypeName) {
                return false;
            }
            return browseManager.selectedFilters().some(function (f) { return f.groupType === _this.groupTypeName && f.term === _this.plainText(attribute.name); });
        };
        viewModel.prototype.isHighlighted = function (value) {
            return (value || "").indexOf("tokyo-highlight") > 0;
        };
        viewModel.prototype.getTooltipText = function (tooltips) {
            if (tooltips.length === 1) {
                return util.stringFormat(resx.tagAndExpertTooltip, tooltips[0].email);
            }
            else if (tooltips.length > 1) {
                var emails = tooltips.map(function (tooltip) { return tooltip.email; }).join("<br/>");
                return util.stringFormat(resx.tagAndExpertTooltipMultiple, tooltips.length) + "<br/><br/>" + emails;
            }
        };
        viewModel.prototype.dismissPopovers = function () {
            $(".dismiss-popover-on-scroll").popover("hide");
            $("body > .popover").remove(); // 'hide' is not completing before the element is removed, so the popover is not being removed.
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=attributes.js.map