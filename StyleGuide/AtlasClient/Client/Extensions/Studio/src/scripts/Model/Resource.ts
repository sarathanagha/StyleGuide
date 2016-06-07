/// <reference path="../references.d.ts" />

import ResourcePort = require("ResourcePort");
import ResourceParameter = require("ResourceProperty");
import IResource = require("../Contracts/Resource");

//todo: vija make sure double aliasing is removed ex: IResource.IResource[]
export class Resource implements IResource.IResource {
    public Id: KnockoutObservable<string>;
    public Name: KnockoutObservable<string>;
    public Description: KnockoutObservable<string>;
    public FamilyId: KnockoutObservable<string>;
    public Category: KnockoutObservable<string>;
    public Items: KnockoutObservableArray<IResource.IResource>;
    public InputPorts: KnockoutObservableArray<IResource.IResourcePort>;
    public OutputPorts: KnockoutObservableArray<IResource.IResourcePort>;
    public Properties: KnockoutObservableArray<IResource.IResourceProperty>;

    constructor(id: string, name: string, description: string, familyid: string, category: string,items: KnockoutObservableArray<IResource.IResource>= null, inputPorts: KnockoutObservableArray<IResource.IResourcePort>= null, outputPorts: KnockoutObservableArray<IResource.IResourcePort>= null, parameters: KnockoutObservableArray<IResource.IResourceProperty>= null) {
        this.Id = ko.observable(id);
        this.Name = ko.observable(name);
        this.Description = ko.observable(description);
        this.FamilyId = ko.observable(familyid);
        this.Category = ko.observable(category);
        this.Items = items;
        this.InputPorts = inputPorts;
        this.OutputPorts = outputPorts;
        this.Properties = parameters;
    }
}

