/// <amd-dependency path="css!../ActivityTool.css" />
/// <amd-dependency path="css!./AzureMLTool.css" />
/// <amd-dependency path="text!../Templates/PropertiesTemplate.html" />
/// <amd-dependency path="text!./Templates/AzureMLEndpointTemplate.html" />
/// <amd-dependency path="text!./Templates/AzureMLEndpointPropertiesTemplate.html" />
/// <amd-dependency path="text!../../PowercopyTool/templates/LinkedServicesGridTemplate.html" />
/// <amd-dependency path="text!./Templates/NewMLEndpointSelectionTemplate.html" />

import {OverlayType} from "../../Editor/Wizards/AuthoringOverlay";
import {ActivityTool} from "../ActivityTool";
import {taskProperties} from "../../PowercopyTool/Constants";
import {ExistingLinkedServicesGridViewModel} from "../../PowercopyTool/LinkedServicesViewModel";
import {IAzureMLLinkedServiceTypeProperties} from "../../PowercopyTool/LinkedServiceTypeProperties";
import {ValidatedBoxViewModel, ValidatedSelectBoxViewModel, IOption} from "../../../bootstrapper/FormFields";
import FactoryEntities = require("../../PowercopyTool/FactoryEntities");
import {LinkedServiceType, linkedServiceTypeToResourceMap} from "../../../scripts/Framework/Model/Contracts/LinkedService";
import {getMLSwaggerUri} from "../../../scripts/Framework/Shared/DataConstants";
import {AppContext} from "../../../scripts/AppContext";
import {getLogger} from "../../../scripts/Framework/Util/Log";
import {LoadingState} from "../../../scripts/Framework/UI/Loader";
import {IGroup, IParamPair, IParameterGroupsValueAccessor} from "../../../bootstrapper/ParameterGroupsBinding";
import {IPivotValueAccessor} from "../../../bootstrapper/PivotKnockoutBinding";
import {IActivityEntity} from "../../../scripts/Framework/Model/Authoring/EntityStore";

let logger = getLogger({ loggerName: "AzureMLTool" });

interface IEndpointProperties {
    webInput: KnockoutObservable<ValidatedSelectBoxViewModel<string>>; // TODO replace w/ a message if input dataset count disagrees w/ swagger info
    needsWebInput: KnockoutObservable<boolean>;
    webOutputs: KnockoutObservableArray<ValidatedSelectBoxViewModel<string>>;
    outputsVisible: KnockoutObservable<boolean>;
    globalParameterBinding: IParameterGroupsValueAccessor;
    globalParamsVisible: KnockoutObservable<boolean>;
    haveGlobalParams: KnockoutObservable<boolean>;
    inputVisible: KnockoutObservable<boolean>;
}

interface IManualMLSettings {
    uri: ValidatedBoxViewModel<string>;
    key: ValidatedBoxViewModel<string>;
}

interface ISwaggerDoc {
    definitions: {
        GlobalParameters: {
            properties: StringMap<{type: string}>;
        },
        BatchInputs: {
            properties: Object;
        },
        BatchOutputs: {
            properties: Object;
        }
    };
}

enum EndpointPresence {
    Existing,
    New
}

enum ParameterStates {
    Loading,
    ShowParams,
    HelpMessage
}

const defaultTitle: string = "Azure ML activity settings";

export class AzureMLTool extends ActivityTool { // TODO crclaeys refactor this into several classes around pivots/templates
    public static mlEndpointTemplate: string = require("text!./Templates/AzureMLEndpointTemplate.html");
    public static mlEndpointPropertiesTemplate: string = require("text!./Templates/AzureMLEndpointPropertiesTemplate.html");
    public static propertiesTemplate: string = require("text!../Templates/PropertiesTemplate.html");
    public newMLEndpointSelectionTemplate: string = require("text!./Templates/NewMLEndpointSelectionTemplate.html");
    public linkedServicesGridTemplate: string = require("text!../../PowercopyTool/templates/LinkedServicesGridTemplate.html");

    public linkedServiceTypeFilterOptions: KnockoutObservableArray<IOption> = ko.observableArray([
        { displayText: linkedServiceTypeToResourceMap[LinkedServiceType.azureML], value: LinkedServiceType.azureML }
    ]);

    public propertiesStepSubtitle = ko.observable<string>(ClientResources.propertiesStepSubtitle.format("AzureML activity"));
    public endpointSelectionType: KnockoutObservable<EndpointPresence> = ko.observable(EndpointPresence.Existing);
    public existingLinkedServicesGrid: ExistingLinkedServicesGridViewModel;
    public manualMLSettings: IManualMLSettings;
    public selectedLinkedServiceNameFilter: KnockoutObservable<string> = ko.observable("");
    public selectedLinkedServiceName: KnockoutObservable<string> = ko.observable("");
    public errorMessage: KnockoutObservable<string> = ko.observable("");
    public endpointPresence = EndpointPresence;
    public parameterStates = ParameterStates;
    public endpointPropertiesVM: EndpointPropertiesViewModel;

    constructor(entity: IActivityEntity) {
        super(entity, OverlayType.PIVOT, defaultTitle);

        FactoryEntities.loadEntities();

        let endpointUri = ko.observable<string>("");
        this.endpointPropertiesVM = new EndpointPropertiesViewModel(endpointUri, this.authoringEntity.model.name());

        this.overlayContent = <IPivotValueAccessor>{
            pivotItems: [
                {
                    header: taskProperties,
                    viewModel: this,
                    template: AzureMLTool.propertiesTemplate
                },
                {
                    header: "Select AzureML Endpoint",
                    viewModel: this,
                    template: AzureMLTool.mlEndpointTemplate
                },
                {
                    header: "AzureML Endpoint Properties",
                    viewModel: this.endpointPropertiesVM,
                    template: AzureMLTool.mlEndpointPropertiesTemplate
                }
            ]
        };

        this.existingLinkedServicesGrid = new ExistingLinkedServicesGridViewModel(
            this.selectedLinkedServiceName, this.linkedServiceTypeFilterOptions, ko.observable<string>(), false);

        this.manualMLSettings = {
            uri: new ValidatedBoxViewModel<string>({
                label: "Batch Execution URI",
                required: true
            }),
            key: new ValidatedBoxViewModel<string>({
                label: "API Key",
                required: true
            })
        };

        ko.computed(() => {
            let selectionType = this.endpointSelectionType();
            if (selectionType === EndpointPresence.Existing) {
                if (this.selectedLinkedServiceName()) {
                    endpointUri((<IAzureMLLinkedServiceTypeProperties>this.existingLinkedServicesGrid.selectedEnhancedLinkedService().linkedService.properties.typeProperties).mlEndpoint);
                } else {
                    endpointUri("");
                }
            } else if (selectionType === EndpointPresence.New) {
                if (validateBatchEndpointUri(this.manualMLSettings.uri.value())) {
                    endpointUri(this.manualMLSettings.uri.value());
                } else {
                    endpointUri("");
                }
            } else {
                logger.logError("unsupported endpoint presence type: " + selectionType);
            }
        });
    }

    public applyClicked() {
        // TODO crclaeys update the authoring model.
    }
}

class EndpointPropertiesViewModel {
    public webParameterViewState: KnockoutObservable<ParameterStates> = ko.observable(ParameterStates.HelpMessage);
    public endpointProperties: IEndpointProperties;
    public tabLoading: KnockoutObservable<LoadingState> = ko.observable(LoadingState.Loading);
    public parameterStates = ParameterStates;
    private _endpointUri: KnockoutObservable<string> = ko.observable("");
    private _appContext = AppContext.getInstance();
    private _activityName: string;

    constructor(endpointUri: KnockoutObservable<string>, activityName: string) {
        this._endpointUri = endpointUri;
        this._activityName = activityName;

        this._endpointUri.subscribe((uri) => {
            if (uri) {
                this.fetchSwaggerDoc(uri);
            } else {
                this.webParameterViewState(ParameterStates.HelpMessage);
            }
        });

        let globalConfigGroup = {
            title: "Global configuration",
            params: ko.observableArray<IParamPair>([])
        };

        this.endpointProperties = {
            globalParameterBinding: { readOnly: true, paramGroups: ko.observableArray<IGroup>([globalConfigGroup]) },
            globalParamsVisible: ko.observable(true),
            haveGlobalParams: ko.observable(false),
            inputVisible: ko.observable(true),
            needsWebInput: ko.observable(true),
            outputsVisible: ko.observable(true),
            webInput: ko.observable(new ValidatedSelectBoxViewModel<string>(ko.observableArray([{ value: "", displayText: "" }]), { label: "" })),
            webOutputs: ko.observableArray<ValidatedSelectBoxViewModel<string>>([])
        };
    }

    private fetchSwaggerDoc(uri: string): Q.Promise<string> {
        let defer = Q.defer<string>();
        if (validateBatchEndpointUri(uri)) {
            if (uri.slice(-1) !== "/") {
                uri += "/";
            }
            uri += "apidocument";

            this.webParameterViewState(ParameterStates.Loading);
            this._appContext.dataFactoryService.ajaxQ<ISwaggerDoc>({
                url: getMLSwaggerUri,
                data: { endpointUri: uri }, // TODO crclaeys update controller to take 3 parameters and use static HttpClient
                type: "GET",
                contentType: "application/json"
            }).then((swag: ISwaggerDoc) => {
                this.setParameterDescriptions(swag);
            }, (error) => {
                logger.logError("swagger doc retrieval failed", error);
            });
        } else {
            logger.logError("fetchSwaggerDoc was called with an invalid batch endpoint uri");
        }
        return defer.promise;
    }

    private setParameterDescriptions(swag: ISwaggerDoc): void {
        let webInputOption = ko.observableArray<IOption>([]),
            webOutputOptions = ko.observableArray<IOption>([]),
            dependencies = this._appContext.authoringEntityStore.getDependencies()();

        for (let key in dependencies) {
            if (key === this._activityName) {
                if (dependencies[key].inputs.length === 1) {
                    let input = dependencies[key].inputs[0];
                    webInputOption.push({ value: input, displayText: input });
                } else {
                    // TODO tell the user to connect info if needed
                }
                dependencies[key].outputs.forEach((output: string) => {
                    webOutputOptions.push({ value: output, displayText: output });
                });
                return;
            }
        }

        let inputKeys = Object.keys(swag.definitions.BatchInputs.properties);
        if (inputKeys.length > 1) {
            this.webParameterViewState(ParameterStates.HelpMessage);
            // TODO tell the user we only support one input. suggest replacing n-1 inputs w/ reader modules
            return;
        } else if (inputKeys.length === 1) {
            this.endpointProperties.webInput(new ValidatedSelectBoxViewModel<string>(webInputOption, { label: inputKeys[0] }));
            this.endpointProperties.needsWebInput(true);
        } else {
            this.endpointProperties.needsWebInput(false);
        }

        this.endpointProperties.webOutputs.removeAll();
        for (let key in swag.definitions.BatchOutputs.properties) {
            this.endpointProperties.webOutputs.push(new ValidatedSelectBoxViewModel<string>(webOutputOptions, { label: key }));
        }

        this.endpointProperties.globalParameterBinding.paramGroups()[0].params.removeAll();
        for (let swagParam in swag.definitions.GlobalParameters.properties) {
            let newParam = { key: ko.observable<string>(swagParam), value: ko.observable<string>() };
            this.endpointProperties.globalParameterBinding.paramGroups()[0].params.push(newParam);
        }
        this.endpointProperties.haveGlobalParams(!!swag.definitions.GlobalParameters.properties);

        this.webParameterViewState(ParameterStates.ShowParams);
    }
}

function validateBatchEndpointUri(uri: string): boolean {
    return /^https:\/\/management\.azureml\.net\/workspaces\/([a-f]|[0-9])+\/webservices\/([a-f]|[0-9])+\/endpoints\/([a-f]|[0-9])+\/?$/i.test(uri);
}
