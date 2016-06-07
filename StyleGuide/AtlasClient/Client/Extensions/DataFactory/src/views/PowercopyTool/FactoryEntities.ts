import Net = require("./Net");
/* tslint:disable:no-unused-variable */
import Common = require("./Common");
/* tslint:enable:no-unused-variable */
import IEntityResponse = Common.IEntity;
import EntityType = require("./EntityType");
import Validation = require("../../bootstrapper/Validation");
import Constants = require("./Constants");
import Util = require("../../scripts/Framework/Util/Util");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");

export let entityNameRegex = "^[A-Za-z0-9_][^<>*#.%&:\\\\+?/]*$";

export var factoryName: string;
export var subscriptionId: string;
export var resourceGroup: string;
export var factoryLocation: string;

export let entitiesMap: { [entityType: string]: IEntityResponse[] } = {};
export let entityFetchPromiseMap: { [entityType: string]: Q.Promise<void> } = {};
export let factoryLoadPromise: Q.Promise<void>;
export let factoryLoadedDefered = Q.defer();

export function loadEntities() {
    let parameters: ArmService.IDataFactoryResourceBaseUrlParams = {
        subscriptionId: subscriptionId,
        resourceGroupName: resourceGroup,
        factoryName: factoryName
    };

    let populate = (entityType: string, entitiesResponse: IEntityResponse[]) => {
        entitiesMap[entityType] = [];
        entitiesResponse.forEach(e => {
            entitiesMap[entityType].push(e);
        });
    };

    entityFetchPromiseMap[EntityType.linkedService] =
    Net.armService.listLinkedServices(parameters).then((entitiesResponse: IEntityResponse[]) => {
        populate(EntityType.linkedService, entitiesResponse);
    });

    entityFetchPromiseMap[EntityType.table] =
    Net.armService.listDatasets(parameters).then((entitiesResponse: IEntityResponse[]) => {
        populate(EntityType.table, entitiesResponse);
    });

    entityFetchPromiseMap[EntityType.pipeline] =
    Net.armService.listPipelines(parameters).then((entitiesResponse: IEntityResponse[]) => {
        populate(EntityType.pipeline, entitiesResponse);
    });
}

export interface IFactory {
    name: string;
    location: string;
}

export function loadFactory() {
    let parameters: ArmService.IDataFactoryResourceBaseUrlParams = {
        subscriptionId: subscriptionId,
        resourceGroupName: resourceGroup,
        factoryName: factoryName
    };
    factoryLoadPromise = Net.armService.getDataFactory(parameters).then((factoryResponse: IFactory) => {
        factoryLocation = factoryResponse.location;
        factoryLoadedDefered.resolve(null);
    });
}

export function nameAvailableValidation(entityType: string): (name: string) => Q.Promise<Validation.IValidationResult> {
    return (name: string) => {
        return factoryLoadPromise.then(() => {
            return entityFetchPromiseMap[entityType];
        }).then(() => {
            let valid = entitiesMap[entityType].filter(e => e.name.toLowerCase() === name.toLowerCase()).length === 0;
            return {
                valid: valid,
                message: valid ? "" : Constants.nameNotUnique
            };
        }).fail(reason => {
            return {
                valid: false,
                message: "Unable to validate name, error: " + Util.getAzureError(reason).message
            };
        });
    };
};

export function prefixAvailabilityValidation(entityType: string, prefix: string): Q.Promise<Validation.IValidationResult> {
    return entityFetchPromiseMap[entityType].then(() => {
        let valid = entitiesMap[entityType].filter(e => e.name.indexOf(prefix) === 0).length === 0;
        return {
            valid: valid,
            message: valid ? "" : Constants.nameNotUnique
        };
    }).fail(reason => {
        return {
            valid: false,
            message: "Unable to validate name, error: " + Util.getAzureError(reason).message
        };
    });
}

let hash = "";
for (let i = 0; i < 3; i++) {
    let charCode = Math.floor(Math.random() * 36);
    if (charCode < 10) {
        hash += charCode;
    } else {
        hash += String.fromCharCode(charCode + 87);
    }
}

export function getUniqueName(defaultPrefix: string): string {
    return defaultPrefix + "-" + hash;
}
