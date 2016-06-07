import {AppContext} from "../../scripts/AppContext";
import {IActivityEntity, AuthoringState} from "../../scripts/Framework/Model/Authoring/EntityStore";
import {IExtensionPiece} from "../Editor/GraphContracts";
import {ActivityNode} from "../Editor/GraphExtensions/Activities/Activity";
import {HiveActivityNode} from "../Editor/GraphExtensions/Activities/HiveActivity";
import {CopyActivityNode} from "../Editor/GraphExtensions/Activities/CopyActivity";
import {AzureMLActivityNode} from "../Editor/GraphExtensions/Activities/AzureMLActivity";
import {StoredProcedureActivityNode} from "../Editor/GraphExtensions/Activities/StoredProcedureActivity";
import {MapReduceActivityNode} from "../Editor/GraphExtensions/Activities/MapReduceActivity";
import {activityTypeToResourceMap, ActivityType} from "../../scripts/Framework/Model/Contracts/Activity";
import {HiveActivityEntity, StoredProcedureActivityEntity, AzureMLActivityEntity,
        MapReduceActivityEntity, CopyActivityEntity} from "../../scripts/Framework/Model/Authoring/ActivityEntity";

export interface IToolboxItem {
    name: string;
    category: string;
    onDropAction: () => IExtensionPiece[];
    id: string;
}

// Base class for toolbox items.
export class ToolboxItem implements IToolboxItem {
    private static nameCounts: StringMap<number> = {};

    public name: string;
    public category: string;
    public onDropAction: () => IExtensionPiece[];
    public id: string;

    constructor(name: string, category: string) {
        this.name = name;
        this.category = category;
    }

    // returns a default name based on the amount of items that have already been dragged out
    protected _getDefaultName(): string {
        if (!(this.name in ToolboxItem.nameCounts)) {
            ToolboxItem.nameCounts[this.name] = 0;
        }

        // Forcing each word to be capitalized, so the name is camelcased.
        let splitName = this.name.split(" ");
        splitName.forEach((subString: string, index: number) => {
            splitName[index] = subString.charAt(0).toLocaleUpperCase() + subString.substring(1);
        });

        return "{0}{1}".format(splitName.join(""), ++ToolboxItem.nameCounts[this.name]);
    }
}

export class GenericActivityToolboxItem extends ToolboxItem {
    constructor(activityName: string, getActivityEntity: () => IActivityEntity, node: typeof ActivityNode) {
        super(activityName, ClientResources.pluralActivityAssetText);
        this.onDropAction = () => {
            // create new entity and add it to the store.
            let activityEntity = getActivityEntity();

            // use generic name
            activityEntity.model.name(this._getDefaultName());

            AppContext.getInstance().authoringEntityStore.addEntityWithState(
                activityEntity, AuthoringState.DRAFT);

            // add activity node to canvas.
            let activityNodeConfig = new node(activityEntity);
            let canvasPiece: IExtensionPiece = {
                inputConfigs: [],
                outputConfigs: [],
                mainConfig: activityNodeConfig
            };

            return [canvasPiece];
        };
    }
}

export class CopyToolboxItem extends GenericActivityToolboxItem {
    constructor() {
        let copyEntity = () => {
            return new CopyActivityEntity();
        };
        super(activityTypeToResourceMap[ActivityType.copyActivity], copyEntity, CopyActivityNode);
    }
}

export class HiveToolboxItem extends GenericActivityToolboxItem {
    constructor() {
        let hiveEntity = () => {
            return new HiveActivityEntity();
        };
        super(activityTypeToResourceMap[ActivityType.hdInsightHiveActivity], hiveEntity, HiveActivityNode);
    }
}

export class PigToolboxItem extends ToolboxItem {
    constructor() {
        super(activityTypeToResourceMap[ActivityType.hdInsightPigActivity], ClientResources.pluralActivityAssetText);
        this.onDropAction = null; // yet to be implemented.
    }
}

export class AzureMLToolboxItem extends GenericActivityToolboxItem {
    constructor() {
        let azureMLEntity = () => {
            return new AzureMLActivityEntity();
        };
        super(activityTypeToResourceMap[ActivityType.azureMLBatchScoringActivity], azureMLEntity, AzureMLActivityNode);
    }
}

export class StoredProcedureToolboxItem extends GenericActivityToolboxItem {
    constructor() {
        let storedProcedureEntity = () => {
            return new StoredProcedureActivityEntity();
        };
        super(activityTypeToResourceMap[ActivityType.storedProcedureActivity], storedProcedureEntity, StoredProcedureActivityNode);
    }
}

export class MapReduceToolboxItem extends GenericActivityToolboxItem {
    constructor() {
        let mapReduceEntity = () => {
            return new MapReduceActivityEntity();
        };
        super(activityTypeToResourceMap[ActivityType.mapReduceActivity], mapReduceEntity, MapReduceActivityNode);
    }
}
