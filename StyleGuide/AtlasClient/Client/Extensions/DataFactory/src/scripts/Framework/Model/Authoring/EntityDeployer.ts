/// <reference path="../../../../References.d.ts" />

import EntityStore = require("./EntityStore");
import LinkedService = require("../Contracts/LinkedService");
import BaseEncodable = require("../Contracts/BaseEncodable");
import {IEntity, IMetadata, AuthoringState} from "./EntityStore";
import {ActivityEntity} from "./ActivityEntity";
import {LinkedServiceEntity} from "./LinkedServiceEntity";
import {DatasetEntity} from "./DatasetEntity";
import {AppContext} from "../../../AppContext";
import ArmService = require("../../../Services/AzureResourceManagerService");

"use strict";

export class EntityDeployer {
    // TODO tilarden or iannight: come up with a non-superficial status
    public status: KnockoutObservable<string> = ko.observable(null);

    private _appContext: AppContext;
    private _entityStore: EntityStore.EntityStore;

    private _deployLinkedServices = (): Q.Promise<void[]> => {
        let linkedServices = this._filterOutDeployed(this._entityStore.getEntitiesOfType<EntityStore.ILinkedServiceEntity>(BaseEncodable.EncodableType.LINKED_SERVICE));

        let storagePayloads: ArmService.ILinkedServiceParams[] = [],
            otherPayloads: ArmService.ILinkedServiceParams[] = [];

        linkedServices.forEach((linkedService: LinkedServiceEntity) => {
            if (linkedService.model.properties().type() === LinkedService.Type.AzureStorage) {
                storagePayloads.push(linkedService.convertToDeployableObject());
            } else {
                otherPayloads.push(linkedService.convertToDeployableObject());
            }
        });

        // we make sure the storage payloads are first
        let payloads = storagePayloads.concat(otherPayloads);

        let promises = payloads.map((payload) => {
            // TODO iannight: ensure the storage LS deployments successfully complete,
            // before deploying the other linked services (e.g. HDInsight).
            return this._appContext.armService.createLinkedService({
                linkedServiceName: payload.name,
                subscriptionId: this._appContext.splitFactoryId().subscriptionId,
                factoryName: this._appContext.splitFactoryId().dataFactoryName,
                resourceGroupName: this._appContext.splitFactoryId().resourceGroupName
            }, payload);
        });

        return Q.all(promises);
    };

    private _deployDatasets = (): Q.Promise<void[]> => {
        let datasetEntities = this._filterOutDeployed(this._entityStore.getEntitiesOfType<EntityStore.IDatasetEntity>(BaseEncodable.EncodableType.TABLE));

        let datasetPromises = datasetEntities.map((dataset: DatasetEntity) => {
            let payload = dataset.convertToDeployableObject();

            return this._appContext.armService.createDataset({
                tableName: dataset.model.name(),
                subscriptionId: this._appContext.splitFactoryId().subscriptionId,
                factoryName: this._appContext.splitFactoryId().dataFactoryName,
                resourceGroupName: this._appContext.splitFactoryId().resourceGroupName
            }, payload);
        });

        return Q.all(datasetPromises);
    };

    private _deployPipeline = (): Q.Promise<void> => {
        // create activity payloads first
        let activityEntities = this._filterOutDeployed(this._entityStore.getEntitiesOfType<EntityStore.IActivityEntity>(BaseEncodable.EncodableType.ACTIVITY));

        // TODO iannight: Why do we need to dereference this twice?
        let dependencies = this._appContext.authoringEntityStore.getDependencies()();

        let activityPayloads = activityEntities.map((activity: ActivityEntity<MdpExtension.DataModels.Activity>) => {
            let payload = activity.convertToDeployableObject();

            if (payload.name in dependencies) {
                payload.inputs = dependencies[payload.name].inputs.map(this._returnName);
                payload.outputs = dependencies[payload.name].outputs.map(this._returnName);
            }

            return payload;
        });

        let pipelineProps = this._appContext.authoringPipelineProperties;

        let deployParams: ArmService.IPipelineDeployParams = {
            properties: {
                name: pipelineProps.name(),
                description: pipelineProps.description(),
                activities: activityPayloads,
                // TODO yikei: the pipeline's mode should be set based on the pipeline properties.
                start: pipelineProps.activePeriod().startDate.toISOString(),
                end: pipelineProps.activePeriod().endDate.toISOString()
            }
        };

        return this._appContext.armService.deployPipeline({
            pipelineName: pipelineProps.name(),
            subscriptionId: this._appContext.splitFactoryId().subscriptionId,
            factoryName: this._appContext.splitFactoryId().dataFactoryName,
            resourceGroupName: this._appContext.splitFactoryId().resourceGroupName
        }, deployParams);
    };

    constructor(appContext: AppContext) {
        this._appContext = appContext;
        this._entityStore = appContext.authoringEntityStore;
    }

    public deploy(): Q.Promise<void> {
        return this._deployLinkedServices()
            .then(this._deployDatasets)
            .then(this._deployPipeline);
    }

    private _filterOutDeployed(entities: IEntity<Object, IMetadata>[]): IEntity<Object, IMetadata>[] {
        return entities.filter((entity) => {
            if (!entity.metadata || !entity.model) {
                return false;
            }

            return entity.metadata.authoringState !== AuthoringState.DEPLOYED;
        });
    }

    // The expected structure in the JSON template.
    private _returnName(name: string): { name: string } {
        return { name: name };
    }
}
