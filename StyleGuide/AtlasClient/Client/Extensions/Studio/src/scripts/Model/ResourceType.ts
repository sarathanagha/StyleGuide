/// <reference path="../references.d.ts" />
import Resource = require("../Contracts/Resource");

export module WellKnownDataTypeIds {
        export var Any = "Any";
    }

export class ResourceType implements Resource.IResourceType {
        public Id: KnockoutObservable<string>;
    public Name: KnockoutObservable<string>;
    public Description: KnockoutObservable<string>;

        constructor(id: string, name : string , description : string) {
            if (!id) {
                throw new Error("resource id is required");
            }

            this.Id = ko.observable(id);
            this.Name = ko.observable(name);
            this.Description = ko.observable(description);
        }

    public areSame(other: Resource.IResourceType) {
             return other.Id() === this.Id();
        }

    public acceptsConnectionFrom(other: Resource.IResourceType): boolean {
            // The 'Any' type allows connections both to and from anything.
            return (this.areSame(other)) || (this.Id() === WellKnownDataTypeIds.Any) || (other.Id() === WellKnownDataTypeIds.Any);
        }
    }
