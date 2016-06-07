import {IActivityEntity} from "../../../../scripts/Framework/Model/Authoring/EntityStore";
import {HiveActivityEntity} from "../../../../scripts/Framework/Model/Authoring/ActivityEntity";
import {Svg, Command} from "../../../../_generated/Framework";
import PropertiesViewModel = require("../../../../scripts/Framework/Views/Properties/PropertiesViewModel");
import PropertyTypes = PropertiesViewModel.PropertyTypes;
import Activity = require("./Activity");
import {HDInsightTool, IHiveEntity} from "../../../ActivityTool/HDInsight/HDInsightTool";
import Shared = require("../Shared");

"use strict";

export interface IDeployableHiveActivity extends Activity.IDeployableActivity {
    scriptPath: KnockoutObservable<string>;
    storageLinkedServiceName: KnockoutObservable<string>;
    hiveLinkedServiceName: KnockoutObservable<string>;
    valid: KnockoutObservable<boolean>;
    scriptVariables: KnockoutObservableArray<KnockoutObservable<string>[]>;
}

export class HiveActivityViewModel extends Activity.ActivityViewModel implements PropertiesViewModel.IHasDisplayProperties {
    private static iconHTML = Command.Button.removeCSS($(Svg.activity).filter("svg"));

    public scriptPath: KnockoutObservable<string> = ko.observable("");
    public storageLinkedServiceName: KnockoutObservable<string> = ko.observable(null);
    public hiveLinkedServiceName: KnockoutObservable<string> = ko.observable(null);
    public scriptVariables: KnockoutObservableArray<KnockoutObservable<string>[]> = ko.observableArray([]);
    public inputs: KnockoutObservableArray<string> = ko.observableArray([]);
    public outputs: KnockoutObservableArray<string> = ko.observableArray([]);

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);
        this.description = ko.observable<string>(authoringEntity.model.description());
        this.icon(HiveActivityViewModel.iconHTML);
    }

    public getPropertyGroup = (): PropertiesViewModel.PropertyGroupPromise => {
        return HiveProperties.createHiveActivityGroup(<IHiveEntity>this.authoringEntity);
    };
}

export class HiveActivityNode extends Activity.ActivityNode implements Shared.GraphContracts.IExtensionConfig {
    public viewModel: HiveActivityViewModel;
    public onEdit = (): Q.Promise<Shared.GraphContracts.IExtensionPiece[]> => {
        let tool = new HDInsightTool(<HiveActivityEntity>this.viewModel.authoringEntity);
        tool.showOverlay();
        return null;
    };

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);

        this.viewModel = new HiveActivityViewModel(authoringEntity);

        this.viewModel.valid = ko.pureComputed(() => {
            let requiredFields = ["displayName", "description", "scriptPath",
                "hiveLinkedServiceName", "storageLinkedServiceName", "frequency"];

            let invalid = requiredFields.some((field) => {
                if (!ko.unwrap(this.viewModel[field])) {
                    return true;
                }

                return false;
            });

            return !invalid;
        });
    }
}

class HiveProperties {

    public static createHiveActivityGroup(authoringEntity: IHiveEntity): Q.Promise<PropertiesViewModel.IDisplayPropertyGroup> {
        let deferred = Q.defer<PropertiesViewModel.IDisplayPropertyGroup>();

        let properties: PropertyTypes.IProperty[] = [];

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: ClientResources.Name,
            valueAccessor: () => { return authoringEntity.model.name; },
            showEmpty: true,
            editable: false,
            copy: false,
            required: true
        }));

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: ClientResources.Description,
            valueAccessor: () => { return authoringEntity.model.description; },
            showEmpty: true,
            editable: false,
            copy: false,
            required: false
        }));

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Cluster Linked Service",
            valueAccessor: () => { return authoringEntity.model.linkedServiceName; },
            showEmpty: true,
            editable: false,
            copy: false,
            required: true
        }));

        // TODO tilarden: consider adding the cluster uri

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Script",
            valueAccessor: () => { return authoringEntity.model.typeProperties().script; },
            customClass: "largeTextArea",
            textArea: true,
            showEmpty: true,
            editable: false,
            copy: false,
            required: true
        }));

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Script Path",
            valueAccessor: () => { return authoringEntity.model.typeProperties().scriptPath; },
            showEmpty: true,
            editable: false,
            copy: false,
            required: true
        }));

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Script Parameters",
            valueAccessor: () => { return ko.observable<string>("Coming soon..."); },
            editable: false
        }));

        deferred.resolve({
            name: authoringEntity.model.name,
            type: "HiveActivity",
            properties: properties,
            expanded: ko.observable(true),
            hideHeader: false
        });
        return deferred.promise;
    }

    public static getLinkedServiceProperties(linkedServices: MdpExtension.DataModels.GenericLinkedService[],
                                             hiveClusterName: KnockoutObservable<string>, storageName: KnockoutObservable<string>): PropertyTypes.IProperty[] {
        let hiveClusterNames: KnockoutObservableArray<string> = ko.observableArray<string>([]);
        let storageNames: KnockoutObservableArray<string> = ko.observableArray<string>([]);

        linkedServices.forEach((linkedService) => {
            switch (linkedService.properties().type()) {
                case "StorageLinkedService":
                case "AzureStorageLinkedService":
                    storageNames.push(linkedService.name());
                    break;
                case "HDInsightBYOCLinkedService":
                case "HDInsightOnDemandLinkedService":
                    hiveClusterNames.push(linkedService.name());
                    break;

                default:
                    // noop
                    break;
            }
            Activity.logger.logDebug(linkedService.properties().type());
        });

        let hiveProperty = PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Hive Cluster Name",
            required: true,
            valueAccessor: () => {
                return {
                    options: hiveClusterNames,
                    value: hiveClusterName,
                    setDefault: true
                };
            }
        });

        let storageProperty = PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Storage Account Name",
            required: true,
            valueAccessor: () => {
                return {
                    options: storageNames,
                    value: storageName,
                    setDefault: true
                };
            }
        });

        return [hiveProperty, storageProperty];
    }
}
