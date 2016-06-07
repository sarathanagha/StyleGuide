/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./textfield.html" />
/// <amd-dependency path="css!./textfield.css" />

import ko = require("knockout");
import ITextfieldParameters = Microsoft.DataStudio.DataCatalog.Interfaces.ITextfieldParameters;
import IInput = Microsoft.DataStudio.DataCatalog.Interfaces.IInput;

export var template: string = require("text!./textfield.html");

export class viewModel implements IInput {
    public label: KnockoutObservable<string> = ko.observable<string>("");
    public value: KnockoutObservable<string> = ko.observable<string>("");
    public isValid: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    public placeHolderText: KnockoutObservable<string> = ko.observable<string>("");
    public id: KnockoutObservable<string> = ko.observable<string>("");

    private pattern: RegExp;

    constructor(parameters: ITextfieldParameters) {
        var self = this;

        self.label(parameters.label);
        self.placeHolderText(parameters.placeholderText);
        self.id(parameters.bindingPath);

        self.pattern = parameters.validatePattern || /.*/;
        if (parameters.value) {
            self.value(parameters.value);
        }
    }

    public validate(): boolean {
        var self = this;
        var valid: boolean = self.pattern.test(self.value());
        self.isValid(valid);
        return valid;
    }
}