/// <amd-dependency path="text!./Templates/FormFieldTemplate.html" />
/// <amd-dependency path="text!./Templates/PasswordboxTemplate.html" />
/// <amd-dependency path="text!./Templates/ComboboxTemplate.html" />
/// <amd-dependency path="text!./Templates/TextboxTemplate.html" />
/// <amd-dependency path="text!./images/Info.svg" />
/// <amd-dependency path="css!./CSS/FormFields.css" />
/// <amd-dependency path="css!./CSS/Common.css" />

import Validation = require("./Validation");

export interface IFormFieldOptions<T> {
    label: string;
    required?: boolean;
    infoBalloon?: string;
    validations?: ((string) => Q.Promise<Validation.IValidationResult>)[];
    defaultValue?: T;
    indicateSuccess?: boolean;
    placeholder?: string;
    enabled?: KnockoutObservable<boolean>;
    visible?: KnockoutObservable<boolean>;
}

export interface IOption {
    value: string;
    displayText: string;
    isDefault?: boolean;
}

export function getDefaultOption(options: IOption[]): IOption {
    let defaultOptions = options.filter(opt => opt.isDefault);
    if (defaultOptions.length > 0) {
        return defaultOptions[0];
    }
    return null;
}

export class ValidatedBoxViewModel<T> implements Validation.IValidatable {
    public value = ko.observable<T>();
    public validationEnabled = ko.observable(false);

    public valid = ko.observable<boolean>();
    public validating = ko.observable(false);

    public hasValidation = ko.observable(false);
    public indicateSuccess: boolean;
    public options: IFormFieldOptions<T>;
    public infoBalloonText: string;

    private errorMessage = ko.observable<string>();
    private labelText: string | KnockoutObservableBase<string>;
    private required: KnockoutComputed<boolean>;
    private id: string;
    private placeholder: string;

    private _validate: ((T) => Q.Promise<Validation.IValidationResult>)[];

    private _valPromise: Q.Promise<Validation.IValidationResult>;

    constructor(formFieldOptions: IFormFieldOptions<T>) {
        this.options = formFieldOptions;
        if (this.options.enabled === undefined) {
            this.options.enabled = ko.observable(true);
        }
        if (this.options.visible === undefined) {
            this.options.visible = ko.observable(true);
        }
        this.labelText = formFieldOptions.label;
        this.infoBalloonText = formFieldOptions.infoBalloon;
        this.value(formFieldOptions.defaultValue);
        this.required = ko.computed(() => {
            let labelText = this.labelText;
            if (typeof labelText === "string") {
                return formFieldOptions.required;
            } else {
                return formFieldOptions.required && !!labelText();
            }
        });
        this.placeholder = formFieldOptions.placeholder;
        this.indicateSuccess = !!formFieldOptions.indicateSuccess;

        this.id = "idFormField" + new Date().getTime();

        this.setValidation(formFieldOptions.validations);
        ko.computed(() => {
            if (this.validationEnabled()) {
                this.validating(true);
                let valPromise = undefined;

                let capturedValue = this.value();

                let getNextPromise = (promise: Q.Promise<Validation.IValidationResult>, index: number) => {
                    if (promise === undefined) {
                        return this._validate[index](capturedValue);
                    }
                    return promise.then(result => {
                        if (!result.valid) {
                            return Q<Validation.IValidationResult>(result);
                        } else {
                            return this._validate[index](capturedValue);
                        }
                    });
                };

                for (let i = 0; i < this._validate.length; i++) {
                    valPromise = getNextPromise(valPromise, i);
                }
                this._valPromise = valPromise;

                this._valPromise.then(result => {
                    if (valPromise === this._valPromise) {
                        this.valid(result.valid);
                        if (!this.valid()) {
                            this.errorMessage(result.message);
                        }
                        if (this.valid()) {
                            this.errorMessage("");
                        }
                    }
                }, reason => {
                    if (valPromise === this._valPromise) {
                        this.errorMessage("Unable to validate");
                        this.valid(false);
                    }
                }).finally(() => {
                    this.validating(false);
                });
            }
        });
    }

    public setValidation(valFunctions: ((string) => Q.Promise<Validation.IValidationResult>)[]) {
        this.hasValidation(valFunctions && valFunctions.length > 0);
        this._validate = valFunctions;
    }

    public isValid(): Q.Promise<Validation.IValidationResult> {
        this.validationEnabled(true);
        if (this.validating()) {
            return this._valPromise;
        } else {
            return Q({ valid: this.valid(), message: this.errorMessage() });
        }
    }
}

export class ValidatedSelectBoxViewModel<T> extends ValidatedBoxViewModel<T> {
    public optionList: KnockoutObservableArray<IOption>;
    constructor(optionList: KnockoutObservableArray<IOption>, formFieldOptions: IFormFieldOptions<T>) {
        super(formFieldOptions);
        this.optionList = optionList;
    }
}

export class BoxViewModel {
    public static formFieldTemplate: string = require("text!./Templates/FormFieldTemplate.html");
    public static textboxInput: string = require("text!./Templates/TextboxTemplate.html");
    public static comboboxInput: string = require("text!./Templates/ComboboxTemplate.html");
    public static passwordInput: string = require("text!./Templates/PasswordboxTemplate.html");
    private static baseValidationImageClass = "validationImage";

    public errorMessage: KnockoutObservable<string>;
    public value: KnockoutObservable<string>;

    private validationImageClass = ko.observable(BoxViewModel.baseValidationImageClass);
    /* tslint:disable:no-any */
    private viewModel: ValidatedBoxViewModel<any>;
    // private success = ko.observable(false);
    // private inProgress = ko.observable(false);
    // private fail = ko.observable(false);

    constructor(params: any) {
        /* tslint:enable:no-any */
        this.viewModel = params.vm;
        ko.computed(() => {
            if (!this.viewModel.validationEnabled()) {
                return;
            }

            if (this.viewModel.validating()) {
                this.validationImageClass(BoxViewModel.baseValidationImageClass + " progresso");
            } else if (this.viewModel.valid() && this.viewModel.indicateSuccess) {
                this.validationImageClass(BoxViewModel.baseValidationImageClass + " successo");
            } else if (!this.viewModel.valid()) {
                this.validationImageClass(BoxViewModel.baseValidationImageClass + " failo");
            } else {
                this.validationImageClass(BoxViewModel.baseValidationImageClass);
            }
        });
    }
}

export class SelectBoxViewModel extends BoxViewModel {
    private optionList: KnockoutObservableArray<IOption>;
    /* tslint:disable:no-any */
    constructor(params: any) {
        /* tslint:enable:no-any */
        super(params);
        this.optionList = params.vm.optionList;
    }
}

if (!ko.components.isRegistered("datafactory-validatedtextbox")) {
    ko.components.register("datafactory-validatedtextbox", {
        viewModel: BoxViewModel,
        template: BoxViewModel.formFieldTemplate.replace("%%INPUTFIELD%%", BoxViewModel.textboxInput)
    });
}

if (!ko.components.isRegistered("datafactory-validatedpasswordbox")) {
    ko.components.register("datafactory-validatedpasswordbox", {
        viewModel: BoxViewModel,
        template: BoxViewModel.formFieldTemplate.replace("%%INPUTFIELD%%", BoxViewModel.passwordInput)
    });
}

if (!ko.components.isRegistered("datafactory-validatedselectbox")) {
    ko.components.register("datafactory-validatedselectbox", {
        viewModel: SelectBoxViewModel,
        template: BoxViewModel.formFieldTemplate.replace("%%INPUTFIELD%%", BoxViewModel.comboboxInput)
    });
}
