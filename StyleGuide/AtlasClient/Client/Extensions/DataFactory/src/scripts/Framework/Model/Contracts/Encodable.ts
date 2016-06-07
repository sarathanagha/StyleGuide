import Activity = require("./Activity");
/* tslint:disable:no-unused-variable */
import ActivityWindowCache = require("../ActivityWindowCache");
import LinkedService = require("./LinkedService");
import Gateway = require("./Gateway");
/* tslint:enable:no-unused-variable */
import DataArtifact = require("./DataArtifact");
import Pipeline = require("./Pipeline");
import BaseEncodable = require("./BaseEncodable");

"use strict";

export import EncodableType = BaseEncodable.EncodableType;
export import Encodable = BaseEncodable.BaseEncodable;
export import EncodableSet = BaseEncodable.EncodableSet;

export import ActivityEncodable = Activity.Encodable;
export import TableEncodable = DataArtifact.Encodable;
export import PipelineEncodable = Pipeline.Encodable;
export import StringEncodable = BaseEncodable.StringEncodable;
export import ActivityRunEncodable = ActivityWindowCache.Encodable;
export import LinkedServiceEncodable = LinkedService.Encodable;
export import GatewayEncodable = Gateway.Encodable;

export function createLegacyKeyFromEncodable(encodable: BaseEncodable.BaseEncodable): string {
    // find out which type
    switch (encodable.type) {
        case EncodableType.PIPELINE:
            return (<Pipeline.Encodable>encodable).getLegacyKey();

        case EncodableType.TABLE:
            return (<DataArtifact.Encodable>encodable).getLegacyKey();

        case EncodableType.ACTIVITY:
            return (<Activity.Encodable>encodable).getLegacyKey();

        // for everything else we can just use their unique id
        default:
            return encodable.id;
    }
}

export function createEncodableFromLegacyKey(key: string): BaseEncodable.BaseEncodable {
    let name = key.substring(1);

    switch (key[0]) {
        case "P":
            return new PipelineEncodable(name);

        case "T":
            return new TableEncodable(name);

        case "A":
            let lastSpace = name.lastIndexOf(" ");

            let pipelineName = name.substring(lastSpace + 1);
            let activityName = name.substring(0, lastSpace);

            return new ActivityEncodable(pipelineName, activityName);

        default:
            // default to just the string encodable
            return new StringEncodable(name);
    }
}

export class DataFactoryEncodable extends BaseEncodable.BaseEncodable {
    public name: string;

    constructor(name: string) {
        // Ideally the toUpperCase here would match CLR's String.ToUpperInvariant()
        // which is in line with string.Equals(other, StringComparison.OrdinalIgnoreCase)
        // used for data factory identifiers. However, it is up to browser implementation,
        // but this is the best we have.
        super(BaseEncodable.EncodableType.DATAFACTORY, name.toUpperCase());
        this.name = name;
    }
}
