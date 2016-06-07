/// <reference path="../references.d.ts" />
import Constants = require("../Contracts/Constants");
import Resource = require("../Contracts/Resource");
import PropertyValidators = require("../Common/PropertyValidators");

export class ResourceProperty implements Resource.IResourceProperty {
    public PropertyName: KnockoutObservable<string>;
    public PropertyValue: KnockoutObservable<string>;
    public PropertyType: KnockoutObservable<Constants.ResourcePropertyType>;
    public Description: KnockoutObservable<string>;
    public FriendlyName: KnockoutObservable<string>;
    public DefaultValue: KnockoutObservable<any>;
    public Properties: KnockoutObservableArray<ResourceProperty>;
    public TableProperties: KnockoutObservableArray<KnockoutObservableArray<ResourceProperty>>;
    public ScriptName: KnockoutObservable<string>;
    public PropertyRules: KnockoutObservable<Resource.IResourcePropertyRule>;
    public HasRules: KnockoutObservable<boolean> = ko.observable(false);
    public IsOptional: KnockoutObservable<boolean>;
    public HasDefaultValue: KnockoutObservable<boolean> = ko.observable(false);
    public IsToBeEncrypted: KnockoutObservable<boolean> = ko.observable(false);
    public validators: PropertyValidators.IValidator[];

    constructor(parameterName: string, parameterValue: any, parameterType?: KnockoutObservable<Constants.ResourcePropertyType>, description: string = "", friendlyName: string = "", defaultValue: string = "", parameters: KnockoutObservableArray<ResourceProperty> = null,
        tableParameters: KnockoutObservableArray<KnockoutObservableArray<ResourceProperty>> = null, scriptName: string = null, rules: Resource.IResourcePropertyRule= null,
        isOptional: boolean = false
        ) {
        this.PropertyName = ko.observable(parameterName);
        this.PropertyType = parameterType;
        this.Description = ko.observable(description);
        this.FriendlyName = ko.observable(friendlyName);
        this.DefaultValue = ko.observable(defaultValue);
        this.Properties = parameters;
        this.TableProperties = tableParameters;
        this.ScriptName = ko.observable(scriptName);
        this.PropertyRules = ko.observable(rules);

        if (this.PropertyRules) {
            this.HasRules = ko.observable(true);
        }

        this.IsOptional = ko.observable(isOptional);

        if (this.DefaultValue) {
            this.HasDefaultValue = ko.observable(true);
        }

        if (parameterType() === Constants.ResourcePropertyType.Credential) {
            this.IsToBeEncrypted = ko.observable(true);
        }

        this.validators = [];

        if (!this.IsOptional) {
            this.validators.push(new PropertyValidators.RequiredValueValidator());
        }

        if (parameterType() === Constants.ResourcePropertyType.Int) {
            this.validators.push(new PropertyValidators.IntegerValidator());
        } else if (parameterType() === Constants.ResourcePropertyType.Float || parameterType() === Constants.ResourcePropertyType.Double) {
            this.validators.push(new PropertyValidators.FloatValidator());
        }

        if (rules.Max) {
            this.validators.push(new PropertyValidators.PropertyMaxValidator(rules.Max()));
        }

        if (rules.Min) {
            this.validators.push(new PropertyValidators.PropertyMinValidator(rules.Min()));
        }

        if (rules.Maxlength) {
            //todo: vija Add Max Length Validator 
        }
        if (rules.Pattern) {
            //todo: vija Add Max Length Validator 
        }
    }

    public validate(value: string): string {
        var error: string = null;

        this.validators.forEach((validator: PropertyValidators.IValidator) => {
            if (!error) {
                error = validator.validate(value);
            }
        });

        return error;
    }
}