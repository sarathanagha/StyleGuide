import Activity = require("./Activity");
import {IActivityEntity} from "../../../../scripts/Framework/Model/Authoring/EntityStore";
import PropertiesViewModel = require("../../../../scripts/Framework/Views/Properties/PropertiesViewModel");
import PropertyTypes = PropertiesViewModel.PropertyTypes;
import Shared = require("../Shared");
import Framework = require("../../../../_generated/Framework");

let logger = Framework.Log.getLogger({
    loggerName: "CanvasCopyActivity"
});

export interface IDeployableCopyActivity extends Activity.IDeployableActivity {
    copyStuff?: string;
}

export class CopyProperties {
    public static createCopyActivityGroup = (copyActivity: IDeployableCopyActivity): Q.Promise<PropertiesViewModel.IDisplayPropertyGroup> => {
        let deferred = Q.defer<PropertiesViewModel.IDisplayPropertyGroup>();

        let properties: PropertyTypes.IProperty[] = [];

        deferred.resolve({
            name: copyActivity.displayName,
            type: "CopyActivity",
            properties: properties,
            expanded: ko.observable(true),
            hideHeader: false
        });

        return deferred.promise;
    };
}

export class CopyActivityViewModel extends Activity.ActivityViewModel implements PropertiesViewModel.IHasDisplayProperties {
    public description = ko.observable<string>("bears eat beets");
    public valid = ko.observable<boolean>(true);
    public getPropertyGroup = (): PropertiesViewModel.PropertyGroupPromise => {
        return CopyProperties.createCopyActivityGroup(this);
    };

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);
        this.icon(Framework.Svg.copyActivity);
    }
}

export class CopyActivityNode extends Activity.ActivityNode implements Shared.GraphContracts.IExtensionConfig {
    public viewModel: CopyActivityViewModel;

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);
        let thisExtensionConfig = <Shared.GraphContracts.IExtensionConfig>this;
        if (!thisExtensionConfig.onEdit) {
            logger.logError("Running unpatched CopyActivityNode. Please make sure that patchActivityNode from CopyActivityPatcher is being called.");
        } else {
            // Binding because the type of onEdit is a lambda, thus "this" should refer to the object, irrespective of call style.
            thisExtensionConfig.onEdit = thisExtensionConfig.onEdit.bind(this);
        }

        let viewModel = new CopyActivityViewModel(authoringEntity);

        viewModel.valid = ko.pureComputed(() => {
            let requiredFields = ["displayName", "description", "scriptPath",
                "hiveLinkedServiceName", "storageLinkedServiceName", "frequency"];

            let inValid = requiredFields.some((field) => {
                if (!ko.unwrap(viewModel[field])) {
                    return true;
                }

                return false;
            });

            return !inValid;
        });

        this.viewModel = viewModel;
    }
}

