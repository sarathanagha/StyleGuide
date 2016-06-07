/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./templates/AlertWizardTemplate.html" />
/// <amd-dependency path="text!./templates/CreateAlertStepOneTemplate.html" />
/// <amd-dependency path="text!./templates/CreateAlertStepTwoTemplate.html" />
/// <amd-dependency path="text!./templates/CreateAlertStepThreeTemplate.html" />

import Alert = require("./Alert");
import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");
import Log = require("../../scripts/Framework/Util/Log");
import Wizard = require("../../bootstrapper/WizardBinding");
import Validation = require("../../bootstrapper/Validation");
import AlertExplorer = require("./AlertExplorer");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");

let logger = Log.getLogger({ loggerName: "AlertWizard" });

const OPERATORS: DisplayItem[] = [
    { value: "GreaterThan", displayValue: "Greater than" },
    { value: "GreaterThanOrEqual", displayValue: "Greater than or equal to" },
    { value: "LessThan", displayValue: "Less than" },
    { value: "LessThanOrEqual", displayValue: "Less than or equal to" },
];

// Supports values from 5 minutes to one day.
const AGGREGATION_WINDOW_SIZES: DisplayItem[] = [
    { value: "PT5M", displayValue: "5 minutes" },
    { value: "PT30M", displayValue: "30 minutes" },
    { value: "PT1H", displayValue: "1 hour" },
    { value: "PT2H", displayValue: "2 hours" },
    { value: "PT3H", displayValue: "3 hours" },
    { value: "PT6H", displayValue: "6 hours" },
    { value: "PT12H", displayValue: "12 hours" },
    { value: "P1D", displayValue: "one day" }
];

// A wizard for creating/editing alert rules
export class AlertWizard extends Framework.Disposable.RootDisposable {

    private static flyoutTemplate: string = require("text!./templates/AlertWizardTemplate.html");
    private static stepOneTemplate: string = require("text!./templates/CreateAlertStepOneTemplate.html");
    private static stepTwoTemplate: string = require("text!./templates/CreateAlertStepTwoTemplate.html");
    private static stepThreeTemplate: string = require("text!./templates/CreateAlertStepThreeTemplate.html");

    public operationNameMap = Alert.OperationNameMap;
    public statusMap = Alert.StatusMap;
    public substatusMap = Alert.SubstatusMap;

    public showCreateAlertTool = (resourceName?: string) => {
        this.editingRule = false;
        this.editingRuleName = "";

        // Clear old data as we're creating a new rule
        this.alertName("");
        this.alertDescription("");
        this.selectedOperationName(this.operationNames()[0].name);
        this.shouldSendToServiceOwners(false);
        this.customEmail("");
        this.shouldAggregateEvents(false);
        this.selectedAggregationOperator(this.aggregationOperators()[1].value);
        this.selectedAggregationWindowSize(this.aggregationWindowSizes()[0].value);
        this.aggregationThreshold(1);

        this.wizard.initialize();
        this.alertFlyoutVisible(true);
    };

    public showEditAlertTool = (data: Alert.IAlert) => {
        this.editingRule = true;
        this.editingRuleName = data.name();

        // Populate the wizard with existing alert data
        let emailsList = data.customEmails().join(", ");
        this.alertName(data.name());
        this.alertDescription(data.description());
        this.selectedOperationName(data.operationName());
        this.selectedStatus(data.status());
        this.shouldSendToServiceOwners(data.shouldSendToServiceOwners());
        this.customEmail(emailsList);
        this.shouldAggregateEvents(data.shouldAggregate());
        if (data.shouldAggregate()) {
            this.selectedAggregationOperator(data.aggregationOperator());
            this.selectedAggregationWindowSize(data.aggregationWindowSize());
            this.aggregationThreshold(data.aggregationThreshold());
        }
        this.wizard.initialize();
        this.alertFlyoutVisible(true);
    };

    private wizard: Wizard.Wizard;
    private makingRequest: KnockoutObservable<boolean> = ko.observable(false);
    private alertExplorer: AlertExplorer.viewModel;
    private appContext: AppContext.AppContext = AppContext.AppContext.getInstance();
    private subscriptionId: string = this.appContext.splitFactoryId().subscriptionId;
    private resourceGroupName: string = this.appContext.splitFactoryId().resourceGroupName;
    private factoryName: string = this.appContext.splitFactoryId().dataFactoryName;
    /* tslint:disable:no-unused-variable as it's used in html */
    private closeIcon: KnockoutObservable<string> = ko.observable<string>(Framework.Svg.close);
    private infoIcon: KnockoutObservable<string> = ko.observable<string>(Framework.Svg.info);
    /* tslint:enable:no-unused-variable */

    // Wizard form fields
    private alertName: KnockoutObservable<string> = ko.observable<string>();
    private alertDescription: KnockoutObservable<string> = ko.observable<string>();
    private operationNames: KnockoutObservableArray<Alert.OperationName> = ko.observableArray<Alert.OperationName>(Alert.operationNames);
    private selectedOperationName: KnockoutObservable<string> = ko.observable<string>(this.operationNames()[0].name);
    private statuses: KnockoutComputed<Alert.Status[]> = ko.computed<Alert.Status[]>(() => {
        return this.operationNames().filter((operationName) => {
            return operationName.name === this.selectedOperationName();
        })[0].statuses;
    });
    private selectedStatus: KnockoutObservable<string> = ko.observable<string>(this.statuses()[0].name);
    /* tslint:disable:no-unused-variable Used in CreateAlertStepTwoTemplate */
    private substatuses: KnockoutComputed<string[]> = ko.computed<string[]>(() => {
        let filteredStatuses = this.statuses().filter((status) => {
            return status.name === this.selectedStatus();
        });

        if (filteredStatuses.length === 1) {
            return filteredStatuses[0].substatuses;
        } else {
            return [];
        }
    });
    private selectedSubstatus: KnockoutObservable<string> = ko.observable<string>();
    /* tslint:enable:no-unused-variable */
    private shouldAggregateEvents: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    private shouldSendToServiceOwners: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    private aggregationOperators: KnockoutObservableArray<DisplayItem> = ko.observableArray<DisplayItem>(OPERATORS);
    private selectedAggregationOperator: KnockoutObservable<string> = ko.observable<string>();
    private aggregationWindowSizes: KnockoutObservableArray<DisplayItem> = ko.observableArray<DisplayItem>(AGGREGATION_WINDOW_SIZES);
    private selectedAggregationWindowSize: KnockoutObservable<string> = ko.observable<string>();
    private aggregationThreshold: KnockoutObservable<number> = ko.observable<number>(1);
    private alertFlyoutVisible: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    private customEmail: KnockoutObservable<string> = ko.observable<string>();
    private resource: KnockoutObservable<string> = ko.observable<string>(this.factoryName);

    private editingRule: boolean;
    private editingRuleName: string;

    constructor(alertExplorer: AlertExplorer.viewModel) {
        super();
        logger.logInfo("Begin create Alert Wizard...");

        this.alertExplorer = alertExplorer;
        this.createWizard();
        logger.logInfo("End create Alert Wizard.");
    }

    private createAlertRule = (): Q.Promise<void> => {
        this.makingRequest(true);

        let resourceParams: ArmService.IDataFactoryResourceBaseUrlParams = {
            subscriptionId: this.subscriptionId,
            resourceGroupName: this.resourceGroupName,
            factoryName: this.factoryName
        };

        // Get the data factory location then create the alert rule
        return this.appContext.armService.getDataFactory(resourceParams)
            .then((response: ArmService.IGetDataFactoryResponse) => {
                // Support space-, comma-, and semicolon-separated emails
                let emails: string[] = this.customEmail().trim() ? this.customEmail().split(/[\s,;]+/) : null;
                emails = emails.filter((email) => {
                    return email !== "";
                });
                let alert: Alert.IAlert = {
                    name: this.alertName,
                    location: ko.observable<string>(response.location),
                    description: this.alertDescription,
                    isEnabled: ko.observable<boolean>(true),
                    operationName: this.selectedOperationName,
                    status: this.selectedStatus,
                    customEmails: ko.observableArray<string>(emails),
                    shouldSendToServiceOwners: this.shouldSendToServiceOwners,
                    resource: this.resource,
                    shouldAggregate: this.shouldAggregateEvents
                };

                // Aggregation is an optional condition for an event alert
                if (this.shouldAggregateEvents()) {
                    alert.aggregationOperator = this.selectedAggregationOperator;
                    alert.aggregationWindowSize = this.selectedAggregationWindowSize;
                    alert.aggregationThreshold = this.aggregationThreshold;
                }

                this.alertExplorer.createAlertRule(alert)
                    .then(() => {
                        // Delete the old rule if name has changed
                        if (this.editingRule && this.editingRuleName !== "" && this.editingRuleName !== alert.name()) {
                            this.alertExplorer.deleteAlertRule(this.editingRuleName);
                        }
                        this.alertFlyoutVisible(false);
                    }).fin(() => {
                        this.alertExplorer.listAlertRules();
                        this.makingRequest(false);
                    });
            });
    };

    private createWizard = (): void => {
        let isStepOneValid: KnockoutComputed<boolean> = ko.computed<boolean>(() => {
            return this.alertName() !== "";
        });
        let isStepTwoValid: KnockoutComputed<boolean> = ko.computed<boolean>(() => {
            return true;
        });
        let emailRegex = /\S+@\S+\.\S+/;
        let isStepThreeValid: Validation.IValidatable = {
            isValid: () => {
                if (this.shouldSendToServiceOwners() || emailRegex.test(this.customEmail())) {
                    return Q({
                        valid: true,
                        message: ""
                    });
                } else {
                    return Q({
                        valid: false,
                        message: ClientResources.createAlertStepThreeErrorMessage
                    });
                }
            },
            valid: ko.computed(() => this.shouldSendToServiceOwners() || emailRegex.test(this.customEmail()))
        };
        let stepOne: Wizard.IWizardStep = {
            name: "details",
            displayText: ClientResources.alertWizardStepOne,
            viewModel: this,
            template: AlertWizard.stepOneTemplate,
            validationObservable: isStepOneValid
        };
        let stepTwo: Wizard.IWizardStep = {
            name: "filters",
            displayText: ClientResources.alertWizardStepTwo,
            viewModel: this,
            template: AlertWizard.stepTwoTemplate,
            validationObservable: isStepTwoValid
        };
        let stepThree: Wizard.IWizardStep = {
            name: "recipients",
            displayText: ClientResources.alertWizardStepThree,
            viewModel: this,
            template: AlertWizard.stepThreeTemplate,
            useCustomErrorMessage: true,
            validateable: ko.observable(isStepThreeValid)
        };

        this.wizard = new Wizard.Wizard({ steps: [stepOne, stepTwo, stepThree] }, this.createAlertRule);

        // Make container flyout div for wizard
        $(".mainArea").prepend(AlertWizard.flyoutTemplate);
        ko.applyBindings(this, $("#adf-alerts-flyout")[0]);
    };

    /* tslint:disable:no-unused-variable for click handlers as tslint is not aware they're used in html */
    private onCloseClicked = () => {
        this.alertFlyoutVisible(false);
    };
    /* tslint:enable:no-unused-variable */
}

type DisplayItem = {
    value: string;
    displayValue: string;
}

type Condition = [DisplayItem, DisplayItem[]];
