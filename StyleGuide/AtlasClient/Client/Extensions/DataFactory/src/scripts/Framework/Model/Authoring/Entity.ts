import {EncodableType} from "../Contracts/BaseEncodable";
import {IEntity} from "./EntityStore";

"use strict";

export abstract class Entity<T, U> implements IEntity<T, U> {
    public entityType: EncodableType;
    public model: T;
    public metadata: U;

    constructor(entityType: EncodableType, model: T, metadata: U = null) {
        this.entityType = entityType;
        this.model = model;
        this.metadata = metadata;
    }

    public abstract convertToDeployableObject(): Object;
}
