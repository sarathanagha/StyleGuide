import {AppContext} from "../../../../scripts/AppContext";
import {Svg, Command} from "../../../../_generated/Framework";
import PropertiesViewModel = require("../../../../scripts/Framework/Views/Properties/PropertiesViewModel");
import PropertyTypes = PropertiesViewModel.PropertyTypes;
import Activity = require("./Activity");
import {AzureMLTool} from "../../../ActivityTool/AzureML/AzureMLTool";
import {GraphContracts} from "../Shared";
import {IActivityEntity} from "../../../../scripts/Framework/Model/Authoring/EntityStore";

export interface IDeployableAzureMLActivity extends Activity.IDeployableActivity {
    mlLinkedServiceName: KnockoutObservable<string>;
    valid: KnockoutObservable<boolean>;
    webServiceInput: KnockoutObservable<string>;
    webServiceOutputs: StringMap<KnockoutObservable<string>>;
    globalParameters: StringMap<KnockoutObservable<string>>;
}

export class AzureMLActivityViewModel extends Activity.ActivityViewModel implements PropertiesViewModel.IHasDisplayProperties {
    private static iconHTML = Command.Button.removeCSS($(Svg.azureMLActivity).filter("svg"));

    public mlLinkedServiceName: KnockoutObservable<string> = ko.observable("");
    public webServiceInput: KnockoutObservable<string> = ko.observable("");
    public webServiceOutputs: StringMap<KnockoutObservable<string>> = {};
    public globalParameters: StringMap<KnockoutObservable<string>> = {};
    public inputs: KnockoutObservableArray<string> = ko.observableArray<string>([]);
    public outputs: KnockoutObservableArray<string> = ko.observableArray<string>([]);

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);
        this.icon(AzureMLActivityViewModel.iconHTML);
    }

    public getPropertyGroup = (): PropertiesViewModel.PropertyGroupPromise => {
        return AzureMLProperties.createAzureMLActivityGroup(this);
    };
}

export class AzureMLActivityNode extends Activity.ActivityNode {
    public viewModel: AzureMLActivityViewModel;
    public onEdit = (): Q.Promise<GraphContracts.IExtensionPiece[]> => {
        let tool = new AzureMLTool(<IActivityEntity>this.viewModel.authoringEntity);
        tool.showOverlay();
        return null;
    };

    constructor(authoringEntity: IActivityEntity) {
        super(authoringEntity);

        this.viewModel = new AzureMLActivityViewModel(authoringEntity);

        // TODO crclaeys validation
        this.viewModel.valid = ko.pureComputed(() => {
            return true;
        });
    }
}

// TODO crclaeys add all properties
class AzureMLProperties {
    private static appContext: AppContext = AppContext.getInstance();
    private static frequencyOptions: KnockoutObservableArray<Activity.IFrequency> = ko.observableArray<Activity.IFrequency>(AzureMLProperties.getFrequencies());

    public static createAzureMLActivityGroup(azureMLActivity: IDeployableAzureMLActivity): Q.Promise<PropertiesViewModel.IDisplayPropertyGroup> {
        let deferred = Q.defer<PropertiesViewModel.IDisplayPropertyGroup>();

        let properties: PropertyTypes.IProperty[] = [];

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: ClientResources.Name,
            valueAccessor: () => { return azureMLActivity.displayName; },
            showEmpty: true,
            editable: false,
            copy: false,
            required: true
        }));

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: ClientResources.Description,
            valueAccessor: () => { return azureMLActivity.description; },
            showEmpty: true,
            editable: false,
            copy: false,
            required: true
        }));

        // set default frequency if need be
        if (azureMLActivity.frequency() === null) {
            azureMLActivity.frequency(AzureMLProperties.frequencyOptions()[3]);
        }

        let linkedServiceView = AzureMLProperties.appContext.armDataFactoryCache.linkedServiceListCacheObject.createView();

        let linkedServices = linkedServiceView.fetch({
            subscriptionId: AzureMLProperties.appContext.splitFactoryId().subscriptionId,
            resourceGroupName: AzureMLProperties.appContext.splitFactoryId().resourceGroupName,
            factoryName: AzureMLProperties.appContext.splitFactoryId().dataFactoryName
        });

        linkedServices.then((results) => {
            properties = properties.concat(
                AzureMLProperties.getLinkedServiceProperties(results, azureMLActivity.mlLinkedServiceName));

            deferred.resolve({
                name: azureMLActivity.displayName,
                type: "AzureMLActivity",
                properties: properties,
                expanded: ko.observable(true),
                hideHeader: false
            });

        }, (err) => {
            Activity.logger.logError("Something bad happened to our linked services!", err);
        });
        return deferred.promise;
    }

    public static getLinkedServiceProperties(linkedServices: MdpExtension.DataModels.GenericLinkedService[],
                                             mlLinkedServiceName: KnockoutObservable<string>): PropertyTypes.IProperty {
        let mlNames: KnockoutObservableArray<string> = ko.observableArray<string>([]);

        linkedServices.forEach((linkedService) => {
            switch (linkedService.properties().type()) {
                case "AzureMLLinkedService":
                    mlNames.push(linkedService.name());
                    break;

                default:
                    // noop
                    break;
            }
            Activity.logger.logDebug(linkedService.properties().type());
        });

        return PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "ML Endpoint Name",
            required: true,
            valueAccessor: () => {
                return {
                    options: mlNames,
                    value: mlLinkedServiceName,
                    setDefault: true
                };
            }
        });
    }

    private static getFrequencies(): Activity.IFrequency[] {
        return [Activity.Frequencies.yearly,
            Activity.Frequencies.monthly,
            Activity.Frequencies.weekly,
            Activity.Frequencies.daily,
            Activity.Frequencies.hourly,
            Activity.Frequencies.everyMinute];
    }
}
