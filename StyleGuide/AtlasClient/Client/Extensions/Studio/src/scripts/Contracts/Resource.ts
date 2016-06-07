/// <reference path="../../references.d.ts" />
import Constants = require("./Constants");

export interface IResource {
    Id: KnockoutObservable<string>;
    Name: KnockoutObservable<string>;
    Description: KnockoutObservable<string>;
    FamilyId: KnockoutObservable<string>;
    Category: KnockoutObservable<string>;
    Items: KnockoutObservableArray<IResource>;
    InputPorts: KnockoutObservableArray<IResourcePort>;
    OutputPorts: KnockoutObservableArray<IResourcePort>;
    Properties: KnockoutObservableArray<IResourceProperty>;
}

export interface IResourcePort {
    Name: KnockoutObservable<string>;
    Description: KnockoutObservable<string>;
    FriendlyName: KnockoutObservable<string>
    AllowedTypes: KnockoutObservableArray<IResourceType>;
    IsOptional: KnockoutObservable<boolean>;
}

export interface IResourceType {
    Description: KnockoutObservable<string>;
    Id: KnockoutObservable<string>;
    Name: KnockoutObservable<string>;
    acceptsConnectionFrom(other: IResourceType): boolean;
}

export interface IResourcePropertyRule {
    Min?: KnockoutObservable<number>;
    Max?: KnockoutObservable<number>;
    Maxlength?: KnockoutObservable<number>;
    Pattern?: KnockoutObservable<string>;
}

export interface IResourceProperty {
    PropertyName: KnockoutObservable<string>;
    PropertyValue?: KnockoutObservable<string>;
    PropertyType: KnockoutObservable<Constants.ResourcePropertyType>;
    Description?: KnockoutObservable<string>;
    FriendlyName?: KnockoutObservable<string>;
    DefaultValue?: KnockoutObservable<any>;
    Properties?: KnockoutObservableArray<IResourceProperty>;
    TableProperties?: KnockoutObservableArray<KnockoutObservableArray<IResourceProperty>>;
    ScriptName?: KnockoutObservable<string>;
    PropertyRules: IResourcePropertyRule;
    HasRules: KnockoutObservable<boolean>;
    IsOptional: KnockoutObservable<boolean>;
    HasDefaultValue: KnockoutObservable<boolean>;
    IsToBeEncrypted: KnockoutObservable<boolean>;    
}
