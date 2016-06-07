import {Entity} from "./Entity";
import {IDatasetMetadata} from "./EntityStore";
import {IGetDataset} from "../../../Services/AzureResourceManagerService";

"use strict";

export class DatasetEntity extends Entity<MdpExtension.DataModels.DatasetAuthoring, IDatasetMetadata> {
    public convertToDeployableObject(): IGetDataset {
        // Delete non-editable properties in case the model was created from a deployed entity.
        let model = <MdpExtension.DataModels.DataArtifact>this.model;
        delete model.id;
        let properties = model.properties();
        delete properties.createTime;
        delete properties.id;
        delete properties.provisioningState;
        delete properties.errorMessage;
        // The published property needs to be removed and has no meaning. Trying to avoid adding it in the interfaces.
        delete properties["published"];

        return ko.toJS(this.model);
    }
}
