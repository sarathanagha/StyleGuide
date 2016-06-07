/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./textarea.html" />
/// <amd-dependency path="css!./textarea.css" />

import ko = require("knockout");

export var template: string = require("text!./textarea.html");
import ITextareaParameters = Microsoft.DataStudio.DataCatalog.Interfaces.ITextareaParameters;
import IInput = Microsoft.DataStudio.DataCatalog.Interfaces.IInput;

export class viewModel implements IInput {
    public label: KnockoutObservable<string> = ko.observable<string>("");
    public value: KnockoutObservable<string> = ko.observable<string>("");
    public isValid: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    public id: KnockoutObservable<string> = ko.observable<string>("");

    private pattern: RegExp;

    constructor(parameters: ITextareaParameters) {
        var self = this;

        self.label(parameters.label);
        self.id(parameters.bindingPath);
        self.pattern = parameters.validatePattern || /.*/;
    }

    public validate(): boolean {
        var self = this;
        var valid: boolean = self.pattern.test(self.value());
        self.isValid(valid);
        return valid;
    }
}