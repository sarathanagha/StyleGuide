import {Entity} from "./Entity";
import {IMetadata} from "./EntityStore";
import {IHiveActivityProperties, IActivityProperties} from "../../../Services/AzureResourceManagerService";
import {DefaultValues, ActivityType} from "../../Model/Contracts/Activity";
import {EncodableType} from "../../Model/Contracts/BaseEncodable";

"use strict";

export abstract class ActivityEntity<T extends MdpExtension.DataModels.Activity> extends Entity<T, IMetadata> {
    public static generateBaseActivity(activityType: string): MdpExtension.DataModels.Activity {
        return {
            name: ko.observable<string>(),
            linkedServiceName: ko.observable<string>(),
            description: ko.observable<string>(),
            inputs: ko.observableArray([]),
            outputs: ko.observableArray([]),
            type: ko.observable(activityType),
            policy: ko.observable({
                concurrency: ko.observable<number>(DefaultValues.concurrency),
                timeout: ko.observable<string>(DefaultValues.timeout),
                retry: ko.observable<number>(DefaultValues.retry),
                delay: ko.observable<string>(DefaultValues.delay),
                executionPriorityOrder: ko.observable<string>(DefaultValues.executionPriorityOrder),
                executesOnFailure: ko.observable<boolean>(),
                longRetry: ko.observable(DefaultValues.longRetry),
                longRetryInterval: ko.observable(DefaultValues.longRetryInterval),
                requiresHotStandby: ko.observable<boolean>(),
                style: ko.observable<string>()
            }),
            scheduler: ko.observable({
                frequency: ko.observable<string>(),
                interval: ko.observable(1)
            }),
            typeProperties: ko.observable()
        };
    }

    public abstract convertToDeployableObject(): IActivityProperties;

    constructor(model: T) {
        super(EncodableType.ACTIVITY, model);
    }
}

export class HiveActivityEntity extends ActivityEntity<MdpExtension.DataModels.HiveActivity> {
    constructor() {
        let model = <MdpExtension.DataModels.HiveActivity>ActivityEntity.generateBaseActivity(ActivityType.hdInsightHiveActivity);
        model.typeProperties({ script: ko.observable(""), scriptPath: ko.observable("") });
        super(model);
    }

    public convertToDeployableObject(): IHiveActivityProperties {
        return {
            description: this.model.description(),
            name: this.model.name(),
            type: this.model.type(),
            inputs: this.model.inputs().map((activityInput) => { return { name: activityInput.name() }; }),
            outputs: this.model.outputs().map((activityOutput) => { return { name: activityOutput.name() }; }),
            linkedServiceName: this.model.linkedServiceName(),
            policy: {
                concurrency: this.model.policy().concurrency(),
                executionPriorityOrder: this.model.policy().executionPriorityOrder(),
                retry: this.model.policy().retry(),
                timeout: this.model.policy().timeout()
            },
            scheduler: {
                frequency: this.model.scheduler().frequency(),
                interval: this.model.scheduler().interval()
            },
            typeProperties: {
                /* tilarden: commenting out for demo.
                scriptpath: this.model.typeProperties().scriptPath(),
                scriptLinkedService: this.model.typeProperties().scriptLinkedService(),
                defines: {} // TODO tilarden: place script parameters here.
                */
                script: this.model.typeProperties().script()
            }
        };
    }
}

export class StoredProcedureActivityEntity extends ActivityEntity<MdpExtension.DataModels.Activity> {
    constructor() {
        super(ActivityEntity.generateBaseActivity(ActivityType.storedProcedureActivity));
    }

    public convertToDeployableObject(): IActivityProperties {
        return {
            description: this.model.description(),
            name: this.model.name(),
            type: this.model.type(),
            inputs: this.model.inputs().map((activityInput) => { return { name: activityInput.name() }; }),
            outputs: this.model.outputs().map((activityOutput) => { return { name: activityOutput.name() }; }),
            linkedServiceName: this.model.linkedServiceName(),
            policy: {
                concurrency: this.model.policy().concurrency(),
                executionPriorityOrder: this.model.policy().executionPriorityOrder(),
                retry: this.model.policy().retry(),
                timeout: this.model.policy().timeout()
            },
            scheduler: {
                frequency: this.model.scheduler().frequency(),
                interval: this.model.scheduler().interval()
            },
            typeProperties: {
            }
        };
    }
}

export class AzureMLActivityEntity extends ActivityEntity<MdpExtension.DataModels.Activity> {
    constructor() {
        super(ActivityEntity.generateBaseActivity(ActivityType.azureMLBatchScoringActivity));
    }

    public convertToDeployableObject(): IActivityProperties {
        return null; // TODO crclaeys implement
    }
}

export class MapReduceActivityEntity extends ActivityEntity<MdpExtension.DataModels.Activity> {
    constructor() {
        super(ActivityEntity.generateBaseActivity(ActivityType.mapReduceActivity));
    }
    public convertToDeployableObject(): IActivityProperties {
        return null; // TODO ncalagar implement
    }
}

export class CopyActivityEntity extends ActivityEntity<MdpExtension.DataModels.Activity> {
    constructor() {
        super(ActivityEntity.generateBaseActivity(ActivityType.copyActivity));
    }
    public convertToDeployableObject(): IActivityProperties {
        return null; // TODO iannight implement
    }
}
