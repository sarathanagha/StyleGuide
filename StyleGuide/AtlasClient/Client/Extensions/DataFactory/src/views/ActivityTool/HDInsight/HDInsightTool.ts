/// <amd-dependency path="css!../ActivityTool.css" />
/// <amd-dependency path="text!../Templates/PropertiesTemplate.html" />
/// <amd-dependency path="text!./Templates/HDInsightClusterSelectionTemplate.html" />
/// <amd-dependency path="text!./Templates/NewClusterSelectionTemplate.html" />
/// <amd-dependency path="text!./Templates/SelectScriptTemplate.html" />
/// <amd-dependency path="text!./Templates/StorageLinkedServiceTemplate.html" />
/// <amd-dependency path="text!../../PowercopyTool/templates/LinkedServicesGridTemplate.html" />

import AppContext = require("../../../scripts/AppContext");
import AuthoringOverlay = require("../../Editor/Wizards/AuthoringOverlay");
import {ActivityTool} from "../ActivityTool";
import {EncodableType} from "../../../scripts/Framework/Model/Contracts/BaseEncodable";
import Constants = require("../../PowercopyTool/Constants");
import DataTypeConstants = require("../../PowercopyTool/DataTypeConstants");
import {IActivityEntity, AuthoringState, IEntity, IMetadata} from "../../../scripts/Framework/Model/Authoring/EntityStore";
import {HDInsightBYOCLinkedServiceEntity} from "../../../scripts/Framework/Model/Authoring/LinkedServiceEntity";
import LinkedServicesViewModel = require("../../PowercopyTool/LinkedServicesViewModel");
import {LinkedServiceType, linkedServiceTypeToResourceMap} from "../../../scripts/Framework/Model/Contracts/LinkedService";
import Validation = require("../../../bootstrapper/Validation");
import FormFields = require("../../../bootstrapper/FormFields");
import FactoryEntities = require("../../PowercopyTool/FactoryEntities");
import {IHDInsightCluster} from "../../../scripts/Services/HDInsightArmService";
import LinkedService = MdpExtension.DataModels.LinkedService;
import HDInsightBYOCLinkedServiceProperties = MdpExtension.DataModels.HDInsightBYOCLinkedServiceProperties;
import {IPivotValueAccessor} from "../../../bootstrapper/PivotKnockoutBinding";

"use strict";

interface IByocProperties {
    clusterUris: FormFields.ValidatedSelectBoxViewModel<string>;
    manuallyEnteredUri: FormFields.ValidatedBoxViewModel<string>;
    username: FormFields.ValidatedBoxViewModel<string>;
    password: FormFields.ValidatedBoxViewModel<string>;
}

interface IStorageLinkedServiceProperties {
    existingStorageLinkedServices: FormFields.ValidatedSelectBoxViewModel<string>;
    creatingNew: KnockoutComputed<boolean>;
    newLinkedServiceProperties: {
        linkedServiceName: FormFields.ValidatedBoxViewModel<string>;
        selectionMethod: FormFields.ValidatedSelectBoxViewModel<string>;
        existingStorageAccounts: FormFields.ValidatedSelectBoxViewModel<string>;
        manualEntry: {
            accountUri: FormFields.ValidatedBoxViewModel<string>;
            accountPassword: FormFields.ValidatedBoxViewModel<string>;
        };
    };
    visible: KnockoutObservable<boolean>;
    headerText: string;
}

interface ICreateOnDemandProperties {
    properties: {
        version: FormFields.ValidatedSelectBoxViewModel<string>;
        clusterSize: FormFields.ValidatedSelectBoxViewModel<number>;
        timeToLive: FormFields.ValidatedBoxViewModel<string>;
        osType: FormFields.ValidatedSelectBoxViewModel<string>;
        visible: KnockoutObservable<boolean>;
    };
    storageLinkedService: IStorageLinkedServiceProperties;
    advancedSettings: {
        visible: KnockoutObservable<boolean>;
    };
}

interface IScriptProperties {
    scriptInput: {
        content: KnockoutObservable<string>;
        visible: KnockoutObservable<boolean>;
    };
    storageLinkedService: IStorageLinkedServiceProperties;
    scriptParameters: {
        visible: KnockoutObservable<boolean>;
    };
}

enum ClusterType {
    BYOC,
    OnDemand
}

enum StorageSelectionMethod {
    azure,
    manual
}

/* tslint:disable:variable-name */
const ByocManuallyEntered: string = "Manually entered";
/* tslint:enable:variable-name */

const defaultTitle: string = "Hive activity settings";

export interface IHiveEntity extends IEntity<MdpExtension.DataModels.HiveActivity, IMetadata> { }

export class HDInsightTool extends ActivityTool {
    private static taskPropertiesTemplate: string = require("text!../Templates/PropertiesTemplate.html");
    private static clusterSelectionTemplate: string = require("text!./Templates/HDInsightClusterSelectionTemplate.html");
    private static scriptSelectionTemplate: string = require("text!./Templates/SelectScriptTemplate.html");

    /* tslint:disable:no-unused-variable Used in HTML */
    public newClusterSelectionTemplate: string = require("text!./Templates/NewClusterSelectionTemplate.html");
    public storageLinkedServiceTemplate: string = require("text!./Templates/StorageLinkedServiceTemplate.html");
    public linkedServicesGridTemplate: string = require("text!../../PowercopyTool/templates/LinkedServicesGridTemplate.html");
    /* tslint:enable:no-unused-variable */

    public appContext: AppContext.AppContext;

    public newClusterType: KnockoutObservable<ClusterType>;
    public clusterSelectionType: KnockoutObservable<string>;

    public pivotVisible: KnockoutObservable<boolean>;

    public linkedServiceTypeFilterOptions: KnockoutObservableArray<FormFields.IOption> = ko.observableArray([
        { displayText: ClientResources.all, value: DataTypeConstants.allLinkedServicesFilter },
        { displayText: linkedServiceTypeToResourceMap[LinkedServiceType.hdInsight], value: LinkedServiceType.hdInsight },
        { displayText: linkedServiceTypeToResourceMap[LinkedServiceType.hdInsightOnDemand], value: LinkedServiceType.hdInsightOnDemand }
    ]);

    public selectedLinkedServiceNameFilter: KnockoutObservable<string>;
    public selectedLinkedServiceName: KnockoutObservable<string>;
    public filteredLinkedServices: KnockoutObservableArray<Object>;

    public errorMessage = ko.observable<string>();

    public valid: Validation.IValidatable;
    public nextEnabled = ko.observable(true);

    public destinationDateColumnList = ko.observableArray<FormFields.IOption>([{ displayText: "Loading...", value: "" }]);

    public byocProperties: IByocProperties;
    public createOnDemandProperties: ICreateOnDemandProperties;
    public scriptProperties: IScriptProperties;

    public byocManuallyEntered: string = ByocManuallyEntered;

    public existingLinkedServicesGrid: LinkedServicesViewModel.ExistingLinkedServicesGridViewModel;

    public propertiesStepSubtitle = ko.observable<string>(ClientResources.propertiesStepSubtitle.format(ClientResources.hiveActivity));

    protected authoringEntity: IHiveEntity;

    constructor(entity: IActivityEntity) {
        super(entity, AuthoringOverlay.OverlayType.PIVOT, defaultTitle);

        FactoryEntities.loadEntities();

        this.clusterSelectionType = ko.observable<string>("existingCluster");
        this.newClusterType = ko.observable<ClusterType>(ClusterType.BYOC);

        this.selectedLinkedServiceNameFilter = ko.observable<string>("");
        this.selectedLinkedServiceName = ko.observable<string>("");
        this.existingLinkedServicesGrid = new LinkedServicesViewModel.ExistingLinkedServicesGridViewModel(
            this.selectedLinkedServiceName, this.linkedServiceTypeFilterOptions, ko.observable<string>(), false);

        // load all HDInsight clusters in the subscription for BYOC configuration.
        let displayClusterUris = ko.observableArray<FormFields.IOption>([]);
        this.appContext.hdInsightArmService.listClusters({
            subscriptionId: this.appContext.splitFactoryId().subscriptionId
        }).then((clusters: IHDInsightCluster[]) => {
            displayClusterUris.push({ displayText: "Enter manually", value: this.byocManuallyEntered });
            displayClusterUris.push(...clusters.map((cluster: IHDInsightCluster) => {
                return <FormFields.IOption>{
                    displayText: cluster.properties.connectivityEndpoints[0].location,
                    value: cluster.properties.connectivityEndpoints[0].location
                };
            }));
        });

        this.byocProperties = {
            clusterUris: new FormFields.ValidatedSelectBoxViewModel<string>(
                displayClusterUris, { label: "Cluster URI", infoBalloon: "" }),

            manuallyEnteredUri: new FormFields.ValidatedBoxViewModel<string>({
                label: "URI",
                infoBalloon: ""
            }),

            username: new FormFields.ValidatedBoxViewModel<string>({
                label: "Username",
                infoBalloon: ""
            }),

            password: new FormFields.ValidatedBoxViewModel<string>({
                label: "Password",
                infoBalloon: ""
            })
        };

        this.createOnDemandProperties = {
            properties: {
                version: new FormFields.ValidatedSelectBoxViewModel<string>(
                    ko.observableArray([
                        { displayText: "3.3", value: "3.3" },
                        { displayText: "3.2", value: "3.2" },
                    ]), { label: "Version", infoBalloon: "" }),

                clusterSize: new FormFields.ValidatedSelectBoxViewModel<number>(
                    ko.observableArray([
                        { displayText: "1", value: "1" },
                        { displayText: "2", value: "2" },
                        { displayText: "4", value: "4" },
                        { displayText: "8", value: "8" },
                    ]), { label: "Cluster Size", infoBalloon: "" }),

                timeToLive: new FormFields.ValidatedBoxViewModel<string>({
                    label: "Time To Live",
                    infoBalloon: ""
                }),

                osType: new FormFields.ValidatedSelectBoxViewModel<string>(
                    ko.observableArray([
                        { displayText: "Windows", value: "Windows" },
                        { displayText: "Linux", value: "Linux" },
                    ]), { label: "OS Type", infoBalloon: "" }),

                visible: ko.observable<boolean>(true)
            },

            storageLinkedService: {
                existingStorageLinkedServices: new FormFields.ValidatedSelectBoxViewModel<string>(
                    ko.observableArray([
                        { displayText: "New Linked Service...", value: "New Linked Service" },
                        { displayText: "Storage 1", value: "Storage 1" },
                        { displayText: "Storage 2", value: "Storage 2" },
                        { displayText: "Storage 3", value: "Storage 3" },
                    ]), { label: "", infoBalloon: "" }),

                creatingNew: ko.pureComputed<boolean>(() => {
                    return this.createOnDemandProperties.storageLinkedService.existingStorageLinkedServices.value() === "New Linked Service";
                }),

                newLinkedServiceProperties: {
                    linkedServiceName: new FormFields.ValidatedBoxViewModel<string>({
                        label: "Linked Service Name",
                        infoBalloon: ""
                    }),

                    selectionMethod: new FormFields.ValidatedSelectBoxViewModel<string>(
                        ko.observableArray([
                            { displayText: "Azure subscription", value: StorageSelectionMethod.azure.toString() },
                            { displayText: "Manual entry", value: StorageSelectionMethod.manual.toString() },
                        ]), { label: "Account Selection Method", infoBalloon: "" }),

                    existingStorageAccounts: new FormFields.ValidatedSelectBoxViewModel<string>(
                        ko.observableArray([
                            { displayText: "Azure Storage 1", value: "Azure Storage 1" },
                            { displayText: "Azure Storage 2", value: "Azure Storage 2" },
                            { displayText: "Azure Storage 3", value: "Azure Storage 3" },
                        ]), { label: "Storage Account Name", infoBalloon: "" }),

                    manualEntry: {
                        accountUri: new FormFields.ValidatedBoxViewModel<string>({
                            label: "Storage Account URI",
                            infoBalloon: ""
                        }),

                        accountPassword: new FormFields.ValidatedBoxViewModel<string>({
                            label: "Storage Account Password",
                            infoBalloon: ""
                        })
                    }
                },

                visible: ko.observable<boolean>(false),
                headerText: "Storage Linked Service"
            },

            advancedSettings: {
                visible: ko.observable<boolean>(false)
            }
        };

        this.scriptProperties = {
            scriptInput: {
                content: ko.observable<string>(this.authoringEntity.model.typeProperties().script()),
                visible: ko.observable<boolean>(true)
            },

            storageLinkedService: {
                existingStorageLinkedServices: new FormFields.ValidatedSelectBoxViewModel<string>(
                    ko.observableArray([
                        { displayText: "New Linked Service...", value: "New Linked Service" },
                        { displayText: "Storage 1", value: "Storage 1" },
                        { displayText: "Storage 2", value: "Storage 2" },
                        { displayText: "Storage 3", value: "Storage 3" },
                    ]), { label: "", infoBalloon: "" }),

                creatingNew: ko.pureComputed<boolean>(() => {
                    return this.scriptProperties.storageLinkedService.existingStorageLinkedServices.value() === "New Linked Service";
                }),

                newLinkedServiceProperties: {
                    linkedServiceName: new FormFields.ValidatedBoxViewModel<string>({
                        label: "Linked Service Name",
                        infoBalloon: ""
                    }),

                    selectionMethod: new FormFields.ValidatedSelectBoxViewModel<string>(
                        ko.observableArray([
                            { displayText: "Azure subscription", value: StorageSelectionMethod.azure.toString() },
                            { displayText: "Manual entry", value: StorageSelectionMethod.manual.toString() },
                        ]), { label: "Account Selection Method", infoBalloon: "" }),

                    existingStorageAccounts: new FormFields.ValidatedSelectBoxViewModel<string>(
                        ko.observableArray([
                            { displayText: "Azure Storage 1", value: "Azure Storage 1" },
                            { displayText: "Azure Storage 2", value: "Azure Storage 2" },
                            { displayText: "Azure Storage 3", value: "Azure Storage 3" },
                        ]), { label: "Storage Account Name", infoBalloon: "" }),

                    manualEntry: {
                        accountUri: new FormFields.ValidatedBoxViewModel<string>({
                            label: "Storage Account URI",
                            infoBalloon: ""
                        }),

                        accountPassword: new FormFields.ValidatedBoxViewModel<string>({
                            label: "Storage Account Password",
                            infoBalloon: ""
                        })
                    }
                },

                visible: ko.observable<boolean>(false),
                headerText: "Upload Location"
            },

            scriptParameters: {
                visible: ko.observable<boolean>(false)
            }
        };

        this.overlayContent = <IPivotValueAccessor>{
            pivotItems: [
                {
                    header: Constants.taskProperties,
                    viewModel: this,
                    template: HDInsightTool.taskPropertiesTemplate
                },
                {
                    header: "Select HDInsight Cluster",
                    viewModel: this,
                    template: HDInsightTool.clusterSelectionTemplate
                },
                {

                    header: "Select Script",
                    viewModel: this,
                    template: HDInsightTool.scriptSelectionTemplate
                }
            ]
        };

        this.pivotVisible = ko.observable<boolean>(false);
    }

    public applyClicked() {
        // TODO tilarden: Validation checks, for now we assume all fields are valid.
        // TODO tilarden: for demo purposes the script content is stored in the authoringEntity,
        // however in future we will store it in a blob.
        if (this.scriptProperties.scriptInput.content() !== "") {
            this.authoringEntity.model.typeProperties().script(this.scriptProperties.scriptInput.content());
            this.authoringEntity.model.typeProperties().scriptPath("store/scripts/sample.hive");
        }

        if (this.clusterSelectionType() === "existingCluster") {
            this.authoringEntity.model.linkedServiceName(this.selectedLinkedServiceName());
        } else if (this.clusterSelectionType() === "newCluster") {
            if (this.newClusterType() === ClusterType.BYOC) {
                this.createByocLinkedService();
            } else if (this.newClusterType() === ClusterType.OnDemand) {
                throw new Error("On-demand linked service creation yet to be implemented.");
            }
        }

        // TODO tilarden: See why metadata state is lost / and update it correctly here.
        this.authoringEntity.metadata = {
            authoringState: AuthoringState.DRAFT
        };
    }

    public handleScriptSelection(file: File) {
        let fileReader = new FileReader();

        // TODO tilarden: handle load errors.
        fileReader.onload = (event: Event) => {
            /* tslint:disable:no-any lib.d.ts does not include the result property on EventTarget yet */
            this.scriptProperties.scriptInput.content((<any>event.target).result);
            /* tslint:enable:no-any */
        };

        // TODO tilarden: check the file's size is reasonable before loading it,
        // consider loading large files in multiple parts.
        fileReader.readAsText(file);
    }

    public setNewClusterType(newType: number) {
        this.newClusterType(newType);
    }

    private createByocLinkedService(): void {
        let uri: string = this.byocProperties.clusterUris.value() === this.byocManuallyEntered ?
            this.byocProperties.manuallyEnteredUri.value() : this.byocProperties.clusterUris.value();

        let newLinkedServiceName = "{0}Cluster".format(uri.slice(0, uri.indexOf(".")));
        this.authoringEntity.model.linkedServiceName(newLinkedServiceName);

        let entityType = EncodableType.LINKED_SERVICE;
        let metadata = {
            authoringState: AuthoringState.DRAFT
        };
        let model = <LinkedService<HDInsightBYOCLinkedServiceProperties>>{
            name: ko.observable(newLinkedServiceName),
            properties: ko.observable({
                typeProperties: ko.observable({
                    clusterUri: ko.observable("https://{0}/".format(uri)),
                    userName: ko.observable(this.byocProperties.username.value()),
                    password: ko.observable(this.byocProperties.password.value()),
                    // TODO tilarden: storage linked service hard-coded for the demo.
                    linkedServiceName: ko.observable("UxAuthoringStorageDemo")
                }),
                type: ko.observable("HDInsight"),
                description: ko.observable("Primary storage for {0}.".format(newLinkedServiceName))
            }),
            subscriptionId: ko.observable(this.splitFactoryId().subscriptionId),
            resourceGroup: ko.observable(this.splitFactoryId().resourceGroupName),
            dataFactory: ko.observable(this.splitFactoryId().dataFactoryName)
        };

        this.appContext.authoringEntityStore.addEntityWithState(
            new HDInsightBYOCLinkedServiceEntity(entityType, model, metadata), AuthoringState.DRAFT);
    }
}
