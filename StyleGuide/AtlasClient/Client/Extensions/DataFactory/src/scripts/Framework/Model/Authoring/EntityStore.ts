/// <reference path="../../../../References.d.ts" />

import {EncodableType} from "../Contracts/BaseEncodable";
import FormRender = require("../../../../views/PowercopyTool/FormRender");
import NodeUuid = require("node-uuid");
import {DataFactoryCache} from "../ArmDataFactoryCache";
import ResourceIdUtil = require("../../Util/ResourceIdUtil");
import Log = require("../../Util/Log");
import DatasetHelper = require("../Helpers/DatasetHelper");
import {DatasetEntity} from "./DatasetEntity";

"use strict";

let logger = Log.getLogger({
    loggerName: "EntityStore"
});

export enum AuthoringState {
    DRAFT, // entity yet to be deployed.
    DEPLOYED, // entity deployed, and there have been no local changes.
    LOCALLY_MODIFIED // entity deployed, however the user has made local changes to this entity.
}

export enum ModelState {
    COMPLETE,       // Obtained via Get call.
    PARTIAL         // Obtained via List call.
}

export interface IMetadata {
    authoringState: AuthoringState;
}

export interface IDatasetMetadata extends IMetadata {
    linkedServiceKey: string;
    icon: KnockoutComputed<string>;
    modelState: ModelState;
}

export interface ILinkedServiceMetadata extends IMetadata {
    renderedForm?: FormRender.IFormRenderingResult;
    deploymentObject?: Object;
}

export interface IEntity<T, U> {
    entityType: EncodableType;
    convertToDeployableObject: () => Object;
    model: T;
    metadata?: U;
}

export interface IActivityEntity extends IEntity<MdpExtension.DataModels.Activity, IMetadata> { }

export interface IDatasetEntity extends IEntity<MdpExtension.DataModels.DatasetAuthoring, IDatasetMetadata> {
    metadata: IDatasetMetadata;
}

export interface ILinkedServiceEntity extends IEntity<MdpExtension.DataModels.GenericLinkedService, ILinkedServiceMetadata> {
    metadata: ILinkedServiceMetadata;
}

interface ISearchableEntity extends IEntity<Object, Object> {
    model: {
        name: KnockoutObservable<string>;
    };
}

export type ModelTypes =
    MdpExtension.DataModels.Activity |
    MdpExtension.DataModels.DatasetAuthoring |
    MdpExtension.DataModels.LinkedService<Object>;

export interface IDependencies<T> {
    inputs: T[];
    outputs: T[];
}

export type IDependenciesMap = StringMap<IDependencies<string>>;

export class EntityStore {
    public keys: KnockoutObservableArray<string>;

    public getDependencies: KnockoutObservable<() => IDependenciesMap> = ko.observable($.noop);

    private store: { [key: string]: IEntity<ModelTypes, IMetadata> };

    constructor(splitFactoryId: ResourceIdUtil.IDataFactoryId, armDataFactoryCache: DataFactoryCache) {
        this.keys = ko.observableArray<string>([]);
        this.store = {};

        let datasetListView = armDataFactoryCache.tableListCacheObject.createView();
        datasetListView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        }).then((datasets) => {
            datasets.forEach((dataset) => {
                this.addEntity(createDatasetEntity(dataset));
            });
        }, (reason) => {
            logger.logError("Could not load datasets for the factory {0}. Reason: {1}.".format(JSON.stringify(splitFactoryId), JSON.stringify(reason)));
        });

        let linkedServiceListView = armDataFactoryCache.linkedServiceListCacheObject.createView();
        linkedServiceListView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        }).then((linkedServices) => {
            linkedServices.forEach((linkedService) => {
                this.addEntity(createLinkedServiceEntity(linkedService));
            });
        }, (reason) => {
            logger.logError("Could not load linkedservices for the factory {0}. Reason: {1}.".format(JSON.stringify(splitFactoryId), JSON.stringify(reason)));
        });
    }

    public addEntity(entity: IEntity<ModelTypes, IMetadata>): string {
        let key = NodeUuid.v4();
        this.store[key] = entity;
        this.keys.push(key);
        return key;
    }

    public addEntityWithState(entity: IEntity<ModelTypes, IMetadata>, state: AuthoringState): string {
        let metadata = entity.metadata;
        if (metadata) {
            metadata.authoringState = state;
        } else {
            metadata = {
                authoringState: state
            };
        }

        return this.addEntity(entity);
    }

    public getEntity(key: string): IEntity<ModelTypes, IMetadata> {
        return this.store[key];
    }

    public getEntityByNameAndType<T extends ISearchableEntity>(name: string, entityType: EncodableType): { key: string, value: T } {
        for (let key in this.store) {
            let value = <ISearchableEntity>this.store[key];
            if (value.entityType === entityType && (<T>value).model.name() === name) {
                return {
                    key: key,
                    value: <T>value
                };
            }
        }
        return null;
    }

    public getEntitiesOfType<T>(entityType: EncodableType): T[] {
        let entities: T[] = [];
        for (let key in this.store) {
            let value = this.store[key];
            if (value.entityType === entityType) {
                /* tslint:disable:no-any Having return type as a generic will let us avoid using of any for conversion everywhere else. */
                entities.push(<T><any>value);
                /* tslint:enable:no-any */
            }
        }
        return entities;
    }
}

function createDatasetEntity(model: MdpExtension.DataModels.DataArtifact): DatasetEntity {
    return new DatasetEntity(EncodableType.TABLE, model, {
        authoringState: AuthoringState.DEPLOYED,
        linkedServiceKey: null,      // TODO paverma Find the right key from the entity store entries.
        icon: ko.pureComputed(() => {
            return DatasetHelper.getDatasetIcon(model.properties().type());
        }),
        modelState: ModelState.PARTIAL      // Since its being used in the list call.
    });
}

function createLinkedServiceEntity(model: MdpExtension.DataModels.GenericLinkedService): ILinkedServiceEntity {
    return {
        convertToDeployableObject: null,
        entityType: EncodableType.LINKED_SERVICE,
        metadata: {
            authoringState: AuthoringState.DEPLOYED
        },
        model: model
    };
}
