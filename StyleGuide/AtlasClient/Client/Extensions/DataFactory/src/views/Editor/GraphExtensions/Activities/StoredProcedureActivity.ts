import {IActivityEntity} from "../../../../scripts/Framework/Model/Authoring/EntityStore";
import {Svg, Command} from "../../../../_generated/Framework";
import PropertiesViewModel = require("../../../../scripts/Framework/Views/Properties/PropertiesViewModel");
import PropertyTypes = PropertiesViewModel.PropertyTypes;
import Activity = require("./Activity");
import StoredProcedureTool = require("../../../ActivityTool/StoredProcedure/StoredProcedureTool");
import Shared = require("../Shared");

export interface IDeployableStoredProcedureActivity extends Activity.IDeployableActivity {
    valid: KnockoutObservable<boolean>;
}

export class StoredProcedureActivityViewModel extends Activity.ActivityViewModel implements PropertiesViewModel.IHasDisplayProperties {
    private static iconHTML = Command.Button.removeCSS($(Svg.activity).filter("svg"));

    public inputs: KnockoutObservableArray<string> = ko.observableArray([]);
    public outputs: KnockoutObservableArray<string> = ko.observableArray([]);

    public getPropertyGroup = (): PropertiesViewModel.PropertyGroupPromise => {
        return StoredProcedureProperties.createStoredProcedureActivityGroup(<IActivityEntity>this.authoringEntity);
    };

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);
        this.description = ko.observable<string>(authoringEntity.model.description());
        this.icon(StoredProcedureActivityViewModel.iconHTML);
    }
}

export class StoredProcedureActivityNode extends Activity.ActivityNode implements Shared.GraphContracts.IExtensionConfig {
    public viewModel: StoredProcedureActivityViewModel;
    public onEdit = (): Q.Promise<Shared.GraphContracts.IExtensionPiece[]> => {
        let tool = new StoredProcedureTool.StoredProcedureTool(<IActivityEntity>this.viewModel.authoringEntity);
        tool.showOverlay();
        return null;
    };

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);

        this.viewModel = new StoredProcedureActivityViewModel(authoringEntity);

        // TODO yikei: Validation.
        this.viewModel.valid = ko.pureComputed(() => {
            return true;
        });
    }
}

class StoredProcedureProperties {
    public static createStoredProcedureActivityGroup(authoringEntity: IActivityEntity): Q.Promise<PropertiesViewModel.IDisplayPropertyGroup> {
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

        deferred.resolve({
            name: authoringEntity.model.name,
            type: "StoredProcedureActivity",
            properties: properties,
            expanded: ko.observable(true),
            hideHeader: false
        });
        return deferred.promise;
    }
}
