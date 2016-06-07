import ADF = require("../Framework/ADF");

export interface IAdfModelEntity {
    displayName: string;
    key: string;
    properties: IEntityProperties;
    template?: Object;
    bind?: () => string;
}

export interface IEntityProperties {
    
}

export interface ILinkedServiceModelEntity extends IAdfModelEntity {
    properties: ILinkedServiceProperties;
}

export interface ILinkedServiceProperties extends IEntityProperties {
    
}

export interface IDatasetModelEntity extends IAdfModelEntity {
    properties: IDatasetProperties;
}

export interface IDatasetProperties extends IEntityProperties {

}

export interface IActivityModelEntity extends IAdfModelEntity {
    properties: IActivityProperties;
}

export interface IActivityProperties extends IEntityProperties {

}
