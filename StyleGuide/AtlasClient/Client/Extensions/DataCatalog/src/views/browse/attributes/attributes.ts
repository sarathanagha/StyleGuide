// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./attributes.html" />
/// <amd-dependency path="css!./attributes.css" />

import ko = require("knockout");
import $ = require("jquery");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./attributes.html");

export class viewModel {
    resx = resx;
    plainText = util.plainText;
    escapeHtml = util.escapeHtml;
    removeHtmlTags = util.removeHtmlTags;

    showInput = ko.observable(false);

    inputHasFocus = ko.observable(false);
    attributesToAdd = ko.observable("");
    attributesOnAll: KnockoutObservableArray<Interfaces.IAttributeInfo>;
    attributesOnSome: KnockoutObservableArray<Interfaces.IAttributeInfo>;
    showValidationError = ko.observable<boolean>(false);
    errorMessage = ko.observable<string>("");
    placeholderText: string;
    groupTypeName: string;
    mode: string;
    onAdd: (attributes: string[]) => void;
    onRemove: (attribute: string) => void;
    onRemoved: (attribute: string) => void;
    onValidate: (attributes: string[]) => JQueryPromise<string[]>;
    hideAddButton: boolean;
    showTooltip: boolean;

    constructor(parameters: Interfaces.IAttributeParameters) {
        this.attributesOnAll = parameters.attributesOnAll;
        this.attributesOnSome = parameters.attributesOnSome;
        this.placeholderText = parameters.placeholderText;
        this.groupTypeName = parameters.groupTypeName;
        this.mode = ko.isObservable(this.attributesOnSome) ? "multi" : "single";
        this.onAdd = parameters.onAdd || ((a: string[]) => { });
        this.onRemove = parameters.onRemove || ((a: string) => { });
        this.onRemoved = parameters.onRemoved || ((a: string) => { });
        this.onValidate = parameters.onValidate || ((a: string[]) => { return jQuery.Deferred().resolve(a).promise(); });
        this.hideAddButton = !!parameters.hideAddButton;
        this.showTooltip = parameters.showTooltip || false;
    }

    onInputKeyUp(data, event) {
        if (event.keyCode === constants.KeyCodes.ENTER) {
            $(event.target).blur();
        }
        return true;
    }

    addAttributes() {
        var attributes = this.attributesToAdd().split(/[,;]/).map($.trim).reverse().filter((s) => { return s !== "" });
        this.onValidate(attributes)
            .done(validAttributes => {
                this.showValidationError(false);
                validAttributes = validAttributes || [];
                validAttributes.forEach((attribute) => {
                    var tooltips: Interfaces.ITooltipInfo[] = [{ email: $tokyo.user.email }];
                    attribute && this.addAttributeToAll({ name: attribute, tooltips: tooltips, readOnly: false });
                });
                if (validAttributes.length) {
                    this.onAdd(validAttributes);
                }
                if (attributes.length === validAttributes.length) {
                    this.showValidationError(false);
                    this.attributesToAdd("");
                    this.showInput(false);
                }
                else {
                    var invalidAttributes = attributes.filter(item => { return validAttributes.indexOf(item) < 0 });
                    this.attributesToAdd(invalidAttributes.join());
                    this.errorMessage(resx.validEmailErrorMessage);
                    this.showValidationError(true);
                    this.showInput(true);
                    this.inputHasFocus(true);
                }
            });
    }

    addAttributeToAll(attribute: Interfaces.IAttributeInfo) {
        if (this.hideAddButton) { return; }
        if (!attribute.readOnly && this.attributesOnSome) {
            this.attributesOnSome.remove(attribute);
        }
        if (attribute.tooltips && !attribute.tooltips.some((tp: Interfaces.ITooltipInfo) => { return tp.email === $tokyo.user.email; })) {
            attribute.tooltips.push({ email: $tokyo.user.email });
        }
        if (!this.attributesOnAll().some(a => a.name.toUpperCase() === attribute.name.toUpperCase())) {
            this.attributesOnAll.unshift({ name: $.trim(attribute.name), readOnly: false, tooltips: attribute.tooltips });
        }
        this.showInput(false);
    }

    removeAttributeFrom(attribute: Interfaces.IAttributeInfo, collection: KnockoutObservableArray<Interfaces.IAttributeInfo>) {
        this.dismissPopovers();
        this.showInput(false);
        var result = <any>this.onRemove(attribute.name);
        if (result && typeof result === "object" && typeof result.done === "function") {
            result.done(() => {
                collection.remove(attribute);
                this.onRemoved(attribute.name);
            });
        } else {
            collection.remove(attribute);
            this.onRemoved(attribute.name);
        }
    }

    clickAdd(d, e) {
        var element: JQuery = $(e.target);
        var oWidth: number = element.width();
        element.animate({ width: "100%" }, 150).promise().done(() => {
            this.showInput(true);
            this.inputHasFocus(true);
            element.width(<number>oWidth);
        });
    }

    onAttributeClick(attribute: Interfaces.IAttributeInfo, event: JQueryEventObject) {
        if (!this.groupTypeName) {
            return;
        }
        this.dismissPopovers();
        var item = browseManager.filterTypes().findItem(this.groupTypeName, this.plainText(attribute.name));
        if (!item) {
            item = browseManager.filterTypes().createItem(this.groupTypeName, this.plainText(attribute.name));
        }

        if (browseManager.selectedFilters().every(f => f.groupType !== item.groupType || f.term !== item.term)) {
            // Add tag filter
            browseManager.selectedFilters.push(item);
            browseManager.doSearch();
        } else {
            // Remove tag filter
            var selectedFilters = browseManager.selectedFilters();
            selectedFilters = selectedFilters.filter(f => f.groupType !== item.groupType || f.term !== item.term);
            browseManager.selectedFilters(selectedFilters);
            browseManager.doSearch();
        }
    }

    isFilteredByTag(attribute: Interfaces.IAttributeInfo) {
        if (!this.groupTypeName) {
            return false;
        }
        return browseManager.selectedFilters().some(f => f.groupType === this.groupTypeName && f.term === this.plainText(attribute.name));
    }

    isHighlighted(value: string) {
        return (value || "").indexOf("tokyo-highlight") > 0;
    }

    getTooltipText(tooltips: Interfaces.ITooltipInfo[]): string {
        if (tooltips.length === 1) {
            return util.stringFormat(resx.tagAndExpertTooltip, tooltips[0].email);
        }
        else if (tooltips.length > 1) {
            var emails: string = tooltips.map(tooltip => tooltip.email).join("<br/>");
            return util.stringFormat(resx.tagAndExpertTooltipMultiple, tooltips.length) + "<br/><br/>" + emails;
        }
    }

    dismissPopovers() {
        (<any>$(".dismiss-popover-on-scroll")).popover("hide");
        $("body > .popover").remove(); // 'hide' is not completing before the element is removed, so the popover is not being removed.
    }
}