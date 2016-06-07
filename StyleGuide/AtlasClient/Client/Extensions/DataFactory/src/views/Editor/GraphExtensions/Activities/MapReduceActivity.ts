import {IActivityEntity} from "../../../../scripts/Framework/Model/Authoring/EntityStore";
import {Svg, Command} from "../../../../_generated/Framework";
import PropertiesViewModel = require("../../../../scripts/Framework/Views/Properties/PropertiesViewModel");
import PropertyTypes = PropertiesViewModel.PropertyTypes;
import Activity = require("./Activity");
import MapReduceTool = require("../../../ActivityTool/MapReduce/MapReduceTool");
import Shared = require("../Shared");

"use strict";

export interface IDeployableMapReduceActivity extends Activity.IDeployableActivity {
    storageLinkedServiceName: KnockoutObservable<string>;
    mapReduceLinkedServiceName: KnockoutObservable<string>;
    valid: KnockoutObservable<boolean>;
}

export class MapReduceActivityViewModel extends Activity.ActivityViewModel implements PropertiesViewModel.IHasDisplayProperties {
    private static iconHTML = Command.Button.removeCSS($(Svg.activity).filter("svg"));

    // TODO ncalagar: complete this part..
    public storageLinkedServiceName: KnockoutObservable<string> = ko.observable(null);
    public mapReduceLinkedServiceName: KnockoutObservable<string> = ko.observable(null);
    public inputs: KnockoutObservableArray<string> = ko.observableArray([]);
    public outputs: KnockoutObservableArray<string> = ko.observableArray([]);

    public getPropertyGroup = (): PropertiesViewModel.PropertyGroupPromise => {
        return MapReduceProperties.createMapReduceActivityGroup(<IActivityEntity>this.authoringEntity);
    };

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);
        this.description = ko.observable<string>(authoringEntity.model.description());
        this.icon(MapReduceActivityViewModel.iconHTML);
    }
}

export class MapReduceActivityNode extends Activity.ActivityNode implements Shared.GraphContracts.IExtensionConfig {
    public viewModel: MapReduceActivityViewModel;
    public onEdit = (): Q.Promise<Shared.GraphContracts.IExtensionPiece[]> => {
        let tool = new MapReduceTool.MapReduceTool(<IActivityEntity>this.viewModel.authoringEntity);
        tool.showOverlay();
        return null;
    };

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);

        this.viewModel = new MapReduceActivityViewModel(authoringEntity);

        // TODO ncalagar: validation
        this.viewModel.valid = ko.pureComputed(() => {
            return true;
        });
    }
}

class MapReduceProperties {

    public static createMapReduceActivityGroup(authoringEntity: IActivityEntity): Q.Promise<PropertiesViewModel.IDisplayPropertyGroup> {
        let deferred = Q.defer<PropertiesViewModel.IDisplayPropertyGroup>();

        let properties: PropertyTypes.IProperty[] = [];

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Name",
            valueAccessor: () => { return authoringEntity.model.name; },
            showEmpty: true,
            editable: false,
            copy: false,
            required: true
        }));

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Description",
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

        deferred.resolve({
            name: authoringEntity.model.name,
            type: "MapReduceActivity",
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
