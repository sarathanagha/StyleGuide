import {Entity} from "./Entity";
import LinkedService = MdpExtension.DataModels.LinkedService;
import HDInsightBYOCLinkedServiceProperties = MdpExtension.DataModels.HDInsightBYOCLinkedServiceProperties;
import {ILinkedServiceMetadata} from "./EntityStore";
import {ILinkedServiceTemplate, IHDInsightBYOCTypePropertiesTemplate} from "../Contracts/LinkedService";

"use strict";

export interface IHDInsightBYOCTemplate extends ILinkedServiceTemplate<IHDInsightBYOCTypePropertiesTemplate> { }

export class HDInsightBYOCLinkedServiceEntity extends Entity<LinkedService<HDInsightBYOCLinkedServiceProperties>, ILinkedServiceMetadata> {
    public convertToDeployableObject(): IHDInsightBYOCTemplate {
        return {
            name: this.model.name(),
            properties: {
                description: this.model.properties().description(),
                type: this.model.properties().type(),
                typeProperties: {
                    clusterUri: this.model.properties().typeProperties().clusterUri(),
                    userName: this.model.properties().typeProperties().userName(),
                    password: this.model.properties().typeProperties().password(),
                    linkedServiceName: this.model.properties().typeProperties().linkedServiceName()
                }
            }
        };
    }
}

export class LinkedServiceEntity extends Entity<MdpExtension.DataModels.GenericLinkedService, ILinkedServiceMetadata> {
    public convertToDeployableObject(): ILinkedServiceTemplate<Object> {
        if (!this.metadata.deploymentObject) {
            throw new Error("Expected deployment template for linked service created using PCT's FormRender. Linked service {0}.".format(JSON.stringify(this)));
        }
        let {name, properties} = <ILinkedServiceTemplate<Object>>this.metadata.deploymentObject;
        return {
            name: name,
            properties: properties
        };
    }
}
