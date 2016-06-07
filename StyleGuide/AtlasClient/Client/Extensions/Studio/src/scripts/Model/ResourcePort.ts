/// <reference path="../references.d.ts" />
import Resource = require("../Contracts/Resource");

export class ResourcePort implements Resource.IResourcePort {
    public IsOptional: KnockoutObservable<boolean>;
    public Name: KnockoutObservable<string>;
    public FriendlyName: KnockoutObservable<string>;
    public Description: KnockoutObservable<string>;
    public AllowedTypes: KnockoutObservableArray<Resource.IResourceType>;

    constructor(isOptional: boolean, name: string, friendlyName: string , description: string, allowedTypes: KnockoutObservableArray<Resource.IResourceType> = null) {
        if (!allowedTypes || allowedTypes.length == 0) {
            throw new Error("At least one allowed DataType must be specified");
        }
        this.IsOptional = ko.observable(isOptional);
        this.Name = ko.observable(name);
        this.FriendlyName = ko.observable(friendlyName);
        this.Description = ko.observable(description);
        this.AllowedTypes = allowedTypes;
    }

    // Indicates if this port is compatible with another port
    public isCompatible(other: Resource.IResourcePort): boolean {
        return other instanceof ResourcePort && allowedTypesAreCompatible(this, other);
    }
}

function allowedTypesAreCompatible(input: Resource.IResourcePort, output: Resource.IResourcePort): boolean {
    //todo: vija loop through all and check for all output ports.    
    var outputType = output.AllowedTypes[0];
    return input.AllowedTypes().some((d: Resource.IResourceType) => d.acceptsConnectionFrom(outputType));
}

