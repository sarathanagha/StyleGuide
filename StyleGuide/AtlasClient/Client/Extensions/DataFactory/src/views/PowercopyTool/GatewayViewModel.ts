/// <reference path="../../References.d.ts" />

/// <amd-dependency path="text!./templates/GatewayTemplate.html" />
/// <amd-dependency path="css!./css/Gateway.css" />
/// <amd-dependency path="css!../../stylesheets/Base.Images.css" />

import AppContext = require("../../scripts/AppContext");
import ResourceIdUtil = require("../../scripts/Framework/Util/ResourceIdUtil");
import FormFields = require("../../bootstrapper/FormFields");
/* tslint:disable:no-unused-variable */
import Common = require("./Common");
import FactoryEntities = require("./FactoryEntities");
import Framework = require("../../_generated/Framework");
/* tslint:enable:no-unused-variable */
import requiredValidation = Common.requiredValidation;
import regexValidation = Common.regexValidation;
import dots = Common.dots;
import Util = Framework.Util;
import Svg = Framework.Svg;
import Gateway = require("../../scripts/Framework/Model/Contracts/Gateway");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");
import Validation = require("../../bootstrapper/Validation");

enum State {
    START,
    FETCHING_KEY,
    CREATED,
    REGISTERED,
    CANCELING,
    FINISHED
}

// ViewModel that handles gateway creation and registration
export class GatewayViewModel {
    private state: KnockoutObservable<State>;
    private appContext: AppContext.AppContext = AppContext.AppContext.getInstance();
    private splitFactoryId: ResourceIdUtil.IDataFactoryId;
    private registrationSuccess: Q.Deferred<string>;

    private isVisible: KnockoutObservable<boolean> = ko.observable(false);
    private showStepTwo: KnockoutObservable<boolean> = ko.observable(false);
    private description: KnockoutObservable<string> = ko.observable<string>();
    private name: FormFields.ValidatedBoxViewModel<string>;
    private key: KnockoutObservable<string> = ko.observable<string>();
    private message: KnockoutComputed<string>;
    private buttonText: KnockoutObservable<string> = ko.observable("");
    private successIcon: KnockoutObservable<string>;
    private successIconVisible: KnockoutObservable<boolean> = ko.observable(false);
    private finishTimout: number;

    /* tslint:disable:member-ordering */
    public show = (): Q.Promise<string> => {
        this.state(State.START);

        return this.registrationSuccess.promise;
    };

    public onHideClicked = (): void => {
        this.hide();
    };

    public onButtonClicked = () => {
        this.hide();
    };

    public onCreateClicked = (): void => {
        let createGateway = () => {
            let gatewayResourceParams: ArmService.IGatewayResourceBaseUrlParams = {
                factoryName: this.splitFactoryId.dataFactoryName,
                subscriptionId: this.splitFactoryId.subscriptionId,
                resourceGroupName: this.splitFactoryId.resourceGroupName,
                gatewayName: this.name.value()
            };

            let gatewayParams = {
                name: this.name.value(),
                properties: {
                    description: this.description()
                }
            };

            this.appContext.armService.createGateway(gatewayResourceParams, gatewayParams)
                .then((response) => {
                    this.key(response.properties.key);
                    this.state(State.CREATED);

                    let deferred = Q.defer<boolean>();

                    return this.pollingForGatewayRegistration(gatewayResourceParams, deferred);
                })
                .catch((error) => {
                    // TODO error handling
                });
        };

        // Check validations then create gateway
        this.name.isValid().then((validationResult) => {
            if (validationResult.valid) {
                createGateway();
                this.state(State.FETCHING_KEY);
            }
        });
    };

    public onCopyClicked = (data, event: MouseEvent) => {
        // Need to select the text to copy it
        let copyTextarea = $(event.target).siblings("input")[0];
        (<HTMLInputElement>copyTextarea).select();
        let copySucceeded = Util.copySelectedText(this.key());

        if (copySucceeded) {
            this.appContext.flyoutHandler.addRequest({ anchor: <HTMLElement>event.target, innerHTML: ClientResources.copySuccessful, timeout: 1000 });
        } else {
            window.prompt(ClientResources.clipboardFallbackMessage, this.key());
        }
    };

    /* tslint:enable:member-ordering */
    private hide = () => {
        if (this.state() === State.START ||
            this.state() === State.REGISTERED ||
            this.state() === State.CANCELING) {
            this.state(State.FINISHED);
        } else {
            this.state(State.CANCELING);
        }
    };

    private nameValidation = (): Q.Promise<Validation.IValidationResult> => {
        let gatewayResourceParams: ArmService.IGatewayResourceBaseUrlParams = {
            factoryName: this.splitFactoryId.dataFactoryName,
            subscriptionId: this.splitFactoryId.subscriptionId,
            resourceGroupName: this.splitFactoryId.resourceGroupName,
            gatewayName: this.name.value()
        };

        return this.appContext.armService.verifyGateway(gatewayResourceParams).then(
            () => {
                return Q({
                    valid: true,
                    message: ""
                });
            }, reason => {
                if (reason.status === 404) {
                    return {
                        valid: true,
                        message: ""
                    };
                }
                return {
                    valid: false,
                    message: "A gateway with this name already exists in the subscription"
                };
            });
    };

    private pollingForGatewayRegistration = (gatewayResourceParams: ArmService.IGatewayResourceBaseUrlParams, deferred: Q.Deferred<boolean>): void => {
        if (deferred.promise.isPending() && this.state() === State.CREATED) {
            // Poll repeatedly for the gateway
            this.appContext.armService.getGateway(gatewayResourceParams).then(
                (response) => {
                    switch (Gateway.GatewayDataHelper.parseStatus(response.properties.status)) {
                        case Gateway.GatewayStatus.Online:
                            deferred.resolve(true);
                            this.state(State.REGISTERED);
                            break;
                        default:
                            setTimeout(() => {
                                this.pollingForGatewayRegistration(gatewayResourceParams, deferred);
                            }, 3000);
                    }
                },
                () => {
                    // Get gateway failed so log
                }
            );
        }
    };

    private setup() {
        this.name = new FormFields.ValidatedBoxViewModel<string>({
            label: "Name",
            infoBalloon: "Name for the gateway. Must be unique in a subscription",
            required: true,
            validations: [requiredValidation,
                regexValidation(".{1,150}", "This field should be between 1 and 150 characters long."),
                regexValidation("^[ 0-9a-zA-Z_\-]*$", "This field can contain numbers, letters, dashes and underscores."),
                this.nameValidation]
        });
        this.description("");
        this.key("");
        this.registrationSuccess = Q.defer<string>();
    }

    constructor() {
        this.splitFactoryId = ResourceIdUtil.splitResourceString(this.appContext.factoryId());
        this.successIcon = ko.observable<string>(Svg.statusReady);

        this.setup();
        this.state = ko.observable<State>(State.FINISHED);
        this.message = ko.pureComputed(() => {
            switch (this.state()) {
                case State.FETCHING_KEY:
                    return "Fetching gateway key" + dots();
                case State.CREATED:
                    return "Waiting for registration" + dots();
                case State.REGISTERED:
                    return "Dismissing dialog" + dots();
                case State.CANCELING:
                    return "Canceling operation" + dots();
                case State.START:
                case State.FINISHED:
                default:
                    return "";
            }
        });

        this.state.subscribe((state) => {
            switch (state) {
                case State.START:
                    this.isVisible(true);
                    this.buttonText("Create");
                    break;
                case State.FETCHING_KEY:
                    this.showStepTwo(true);
                    this.buttonText("Cancel");
                    break;
                case State.CREATED:
                    break;
                case State.REGISTERED:
                    this.buttonText("Ok");
                    this.successIconVisible(true);
                    this.registrationSuccess.resolve(this.name.value());

                    // Automatically switch to FINISHED state
                    this.finishTimout = setTimeout(() => { this.state(State.FINISHED); }, 5000);
                    break;
                case State.CANCELING:
                    if (this.name.value()) {
                        let gatewayResourceParams: ArmService.IGatewayResourceBaseUrlParams = {
                            factoryName: this.splitFactoryId.dataFactoryName,
                            subscriptionId: this.splitFactoryId.subscriptionId,
                            resourceGroupName: this.splitFactoryId.resourceGroupName,
                            gatewayName: this.name.value()
                        };

                        this.appContext.armService.deleteGateway(gatewayResourceParams);
                    }

                    if (this.registrationSuccess.promise.isPending) {
                        this.registrationSuccess.reject("");
                    }

                    // Automatically switch to FINISHED state
                    this.finishTimout = setTimeout(() => { this.state(State.FINISHED); }, 3000);

                    break;
                case State.FINISHED:
                    this.isVisible(false);
                    this.showStepTwo(false);
                    this.successIconVisible(false);

                    // We might have a pending timeout
                    clearTimeout(this.finishTimout);
                    this.setup();
                    break;
                default:
                    break;
            }
        });
    }
}

// Factory for creating the gateway component
class GatewayFactory {
    public static template: string = require("text!./templates/GatewayTemplate.html");
    private viewModel: GatewayViewModel;

    constructor(params: { vm: GatewayViewModel }) {
        this.viewModel = params.vm;
    };
}

ko.components.register("datafactory-gateway", {
    viewModel: GatewayFactory,
    template: GatewayFactory.template
});
