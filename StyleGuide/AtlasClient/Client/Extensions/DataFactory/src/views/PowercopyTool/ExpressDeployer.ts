/* tslint:disable:align */
/* tslint:disable:no-unused-variable */
import Net = require("./Net");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");
import IEntityResponse = ArmService.IEntityResponse;
import ProvisioningState = require("./ProvisioningState");
import Common = require("./Common");
import Util = require("../../scripts/Framework/Util/Util");
import ActivityWindowModel = require("../../scripts/Framework/Model/Contracts/ActivityWindow");
import AppContext = require("../../scripts/AppContext");
import LoggerModule = require("./Logger");
import CopyToolLogger = LoggerModule.logger;
/* tslint:enable:no-unused-variable */

interface IDeployableResource {
    typeAndName: string;
    dependsOn: string[];
    /* tslint:disable:no-any */
    properties: any;
    /* tslint:enable:no-any */
}

interface IEntityDeploymentStatus {
    name: string;
    statusClass: KnockoutObservable<string>;
    statusMessage: KnockoutObservable<string>;
    provisioningState: KnockoutObservable<string>;
}

interface IEntityGroupDeploymentStatus {
    statusClass: KnockoutObservable<string>;
    expanded: KnockoutObservable<boolean>;
    entities: KnockoutObservableArray<IEntityDeploymentStatus>;
    displayName: KnockoutObservable<string>;
}

function nameTrim(name: string, partsToTrim: number) {
    let nameSplit = name.split("/");
    for (let i = 0; i < partsToTrim; i++) {
        nameSplit.shift();
    }
    return nameSplit.join("/");
}

function splitTypeAndName(typeAndName: string) {
    let split = typeAndName.split("/");
    return {
        type: split[0].toLowerCase(),
        name: split[1]
    };
}

function provisioningInProgress(provisioningState: string) {
    return provisioningState === ProvisioningState.running || provisioningState === ProvisioningState.pendingCreation;
}

let linkedServicesConst = "linkedservices";
let datasetsConst = "datasets";
let pipelinesConst = "datapipelines";

let successStatusClass = "success";
let failStatusClass = "fail";
let progressStatusClass = "progress";

let unableToDeploy = "Unable to deploy entity";
let deploymentComplete = "Deployment complete";
let pollingPeriod = 5000;

export class ExpressDeployer {
    private entityGroups: KnockoutObservableArray<IEntityGroupDeploymentStatus> = ko.observableArray<IEntityGroupDeploymentStatus>();
    private deploymentPromiseMap: { [name: string]: Q.Promise<void> } = {};
    private deploymentStatusMessage = ko.observable<string>();
    private deploymentError = ko.observable("");
    private deploymentDone = ko.observable(false);
    private deploymentFailed = ko.observable(false);
    private pipelineName: string;
    private dotsSubscription: KnockoutSubscription<string>;

    public toggleExpanded(group: IEntityGroupDeploymentStatus) {
        group.expanded(!group.expanded());
    }

    public deploy(dataFactoryParams: ArmService.IDataFactoryResourceBaseUrlParams, deploymentString: string, isArmDeployment: boolean, isOneTimePipeline: boolean, pipelineName: string) {
        /* tslint:disable:no-any */
        let resources: any[] = JSON.parse(deploymentString).resources;
        /* tslint:enable:no-any */

        this.pipelineName = pipelineName;
        if (isArmDeployment) {
            resources.forEach(resource => {
                resource.typeAndName = `${nameTrim(resource.type, 2)}/${nameTrim(resource.name, 1)}`;
                delete resource.apiVersion;
                delete resource.type;
                delete resource.name;

                let dependencies: string[] = resource.dependsOn;
                if (dependencies) {
                    for (let i = 0; i < dependencies.length; i++) {
                        dependencies[i] = nameTrim(dependencies[i], 3);
                    }
                }
            });
        }

        let linkedServicesGroup: IEntityGroupDeploymentStatus = {
            entities: ko.observableArray<IEntityDeploymentStatus>(),
            expanded: ko.observable(false),
            statusClass: ko.observable(""),
            displayName: ko.observable("Registering Connections")
        };
        let datasetsGroup: IEntityGroupDeploymentStatus = {
            entities: ko.observableArray<IEntityDeploymentStatus>(),
            expanded: ko.observable(false),
            statusClass: ko.observable(""),
            displayName: ko.observable("Creating Datasets")
        };
        let pipelinesGroup: IEntityGroupDeploymentStatus = {
            entities: ko.observableArray<IEntityDeploymentStatus>(),
            expanded: ko.observable(false),
            statusClass: ko.observable(""),
            displayName: ko.observable("Creating Pipelines")
        };

        let entityGroupMap: { [groupName: string]: IEntityGroupDeploymentStatus } = {};
        let lastEntityDeploymentStatus: IEntityDeploymentStatus;
        let lastEntityDeploymentPromise: Q.Promise<void>;
        let listener = e => {
            let message = "Deployment is not done, are you sure you want to leave?";
            (e || window.event).returnValue = message;
            return message;
        };
        window.addEventListener("beforeunload", listener);
        this.dotsSubscription = Common.dots.subscribe(dt => {
            this.deploymentStatusMessage("Deploying" + dt);
        });
        for (let i = 0; i < resources.length; i++) {
            let resource: IDeployableResource = resources[i];
            let resourceTypeAndName = splitTypeAndName(resource.typeAndName);
            let resourceType = resourceTypeAndName.type;
            let resourceName = resourceTypeAndName.name;

            if (resourceType === linkedServicesConst && !entityGroupMap[linkedServicesConst]) {
                entityGroupMap[linkedServicesConst] = linkedServicesGroup;
                this.entityGroups.push(linkedServicesGroup);
            }

            if (resourceType === datasetsConst && !entityGroupMap[datasetsConst]) {
                entityGroupMap[datasetsConst] = datasetsGroup;
                this.entityGroups.push(datasetsGroup);
            }

            if (resourceType === pipelinesConst && !entityGroupMap[pipelinesConst]) {
                entityGroupMap[pipelinesConst] = pipelinesGroup;
                this.entityGroups.push(pipelinesGroup);
            }

            let deploymentGroup = entityGroupMap[resourceType];
            let deploymentStatus: IEntityDeploymentStatus = {
                name: resourceName,
                provisioningState: ko.observable(""),
                statusMessage: ko.observable(""),
                statusClass: ko.observable("")
            };
            deploymentGroup.entities.push(deploymentStatus);
            let deploymentPromise = this.deploySingleEntity(dataFactoryParams, resourceType, resourceName, resource, deploymentStatus);
            if (i === resources.length - 1) {
                lastEntityDeploymentStatus = deploymentStatus;
                lastEntityDeploymentPromise = deploymentPromise;
            }
        }

        lastEntityDeploymentStatus.provisioningState.subscribe(provisioningState => {
            // Once the last entity has been submitted and it's deployment has started we don't need to block navigation anymore
            window.removeEventListener("beforeunload", listener);
        });

        lastEntityDeploymentPromise.then(() => {
            if (!isOneTimePipeline) {
                this.dotsSubscription.dispose();
                this.deploymentStatusMessage(deploymentComplete);
                this.deploymentDone(true);
            } else {
                this.pollingForOneTimePipeline();
            }
        }).fail(reason => {
            this.deploymentStatusMessage("Deployment failed");
            this.deploymentFailed(true);
            this.deploymentError(reason);
            CopyToolLogger.logError("Copy pipeline deployment failed: " + reason);
            window.removeEventListener("beforeunload", listener);
            this.dotsSubscription.dispose();
        });

        this.entityGroups().forEach(group => {
            ko.computed(() => {
                if (group.entities().some(e => provisioningInProgress(e.provisioningState()))) {
                    group.statusClass(this.provisioningStateToStatusClass(ProvisioningState.running));
                } else if (group.entities().every(e => e.provisioningState() === ProvisioningState.succedeed)) {
                    group.statusClass(this.provisioningStateToStatusClass(ProvisioningState.succedeed));
                } else if (group.entities().some(e=> e.provisioningState() === ProvisioningState.failed)) {
                    group.statusClass(this.provisioningStateToStatusClass(ProvisioningState.failed));
                }
            });
        });
    }

    private pollingForOneTimePipeline() {
        // We need to skip the cache to avoid using the global start end time filter.
        let appContext = AppContext.AppContext.getInstance();
        let splitFactoryId = appContext.splitFactoryId();
        appContext.armService.listActivityWindows({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        }, {
                filter: "{0} eq '{1}'".format(ActivityWindowModel.ServiceColumnNames.ExtendedProperties.PipelineName, this.pipelineName),
                top: 1
            }).then((activityWindows) => {
                if (activityWindows.value.length > 0) {
                    this.dotsSubscription.dispose();
                    this.deploymentStatusMessage(deploymentComplete);
                    this.deploymentDone(true);
                } else {
                    setTimeout(() => {
                        this.pollingForOneTimePipeline();
                    }, pollingPeriod);
                }
            }, (reason) => {
                this.deploymentError("Unexpected error occured when polling for activity window result: " + JSON.stringify(reason));
                // Though we failed to retrieve activity windows, the deployment still succeeded. Hence show the link to the user.
                this.dotsSubscription.dispose();
                this.deploymentDone(true);
            });
    };

    private provisioningStateToStatusClass(provisioningState): string {
        switch (provisioningState) {
            case ProvisioningState.succedeed:
                return successStatusClass;
            case ProvisioningState.failed:
                return failStatusClass;
            case ProvisioningState.pendingCreation:
            case ProvisioningState.running:
                return progressStatusClass;
            default:
                return "";
        }
    }

    private processResponse(response: IEntityResponse, status: IEntityDeploymentStatus, defered: Q.Deferred<void>): boolean {
        let provisioningState = response.properties.provisioningState;
        status.provisioningState(provisioningState);
        status.statusClass(this.provisioningStateToStatusClass(provisioningState));
        if (provisioningState === undefined || provisioningState === ProvisioningState.succedeed) {
            defered.resolve(null);
            return true;
        } else if (provisioningState === ProvisioningState.failed) {
            let errorMessage = `${unableToDeploy} '${response.name}': ${response.properties.errorMessage}`;
            status.statusMessage(errorMessage);
            defered.reject(errorMessage);
            return true;
        } else {
            return false;
        }
    }

    private pollEntityStatus(entityParameters: ArmService.IEntityBaseUrlParams, status: IEntityDeploymentStatus, defered: Q.Deferred<void>) {
        Net.armService.getEntity(entityParameters).then(entityResponse => {
            if (!this.processResponse(entityResponse, status, defered)) {
                setTimeout(() => {
                    this.pollEntityStatus(entityParameters, status, defered);
                }, pollingPeriod);
            }
        }).fail(reason => {
            defered.reject(reason);
        });
    }

    private deploySingleEntity(factoryParams: ArmService.IDataFactoryResourceBaseUrlParams, type: string, name: string,
        deployableResource: IDeployableResource, status: IEntityDeploymentStatus): Q.Promise<void> {
        let defered = Q.defer<void>();
        this.deploymentPromiseMap[deployableResource.typeAndName.toLowerCase()] = defered.promise;
        let dependencies: Q.Promise<void>[] = [];
        if (deployableResource.dependsOn) {
            deployableResource.dependsOn.forEach(dependency => {
                dependencies.push(this.deploymentPromiseMap[dependency.toLowerCase()]);
            });
        };

        let entityParameters: ArmService.IEntityBaseUrlParams = {
            subscriptionId: factoryParams.subscriptionId,
            resourceGroupName: factoryParams.resourceGroupName,
            factoryName: factoryParams.factoryName,
            entityType: type,
            entityName: name
        };

        Q.all(dependencies).then(() => {
            let payload = {
                name: name,
                properties: deployableResource.properties
            };
            status.statusClass(progressStatusClass);

            Net.armService.createEntity(entityParameters, payload).then((entityResponse) => {
                if (!this.processResponse(entityResponse, status, defered)) {
                    setTimeout(() => {
                        this.pollEntityStatus(entityParameters, status, defered);
                    }, pollingPeriod);
                }
            }).fail(reason => {
                let errorMessage = `${unableToDeploy} '${entityParameters.entityName}': ${Util.getAzureError(reason).message}`;
                defered.reject(errorMessage);
                status.statusClass(failStatusClass);
                status.statusMessage(errorMessage);
            });
        }).fail(reason => {
            defered.reject(reason);
        });

        return defered.promise;
    }
}
/* tslint:enable:align */
