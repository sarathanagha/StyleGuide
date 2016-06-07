/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./templates/AlertExplorer.html" />
/// <amd-dependency path="css!./AlertExplorer.css" />

import Log = require("../../scripts/Framework/Util/Log");
import Framework = require("../../_generated/Framework");
import Alert = require("./Alert");
import AppContext = require("../../scripts/AppContext");
import InsightsService = require("../../scripts/Services/AzureInsightsService");
import AlertWizard = require("./AlertWizard");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import DataConstants = Framework.DataConstants;
import DiagramModuleDeclarations = require("../Edit/DataFactory/Diagram/DiagramModuleDeclarations");

let logger = Log.getLogger({ loggerName: "AlertExplorer" });

/* tslint:disable:no-var-requires */
export const template: string = require("text!./templates/AlertExplorer.html");
/* tslint:enable:no-var-requires */

const EVENT_ALERT_TYPE = "Microsoft.Azure.Management.Insights.Models.RuleManagementEventDataSource";

/* tslint:disable:class-name */
export class viewModel extends Framework.Disposable.RootDisposable {
    /* tslint:enable:class-name */
    public static className: string = DataConstants.alertExplorerViewModel;

    public alertHandler = (alert: Alert.IAlert, handler: (data: Alert.IAlert, makingRequest?: KnockoutObservable<boolean>) => void, makingRequest: KnockoutObservable<boolean> = null) => {
        return () => {
            // if we have a local request variable
            if (makingRequest) {
                handler(alert, makingRequest);
            } else {
                handler(alert);
            }
        };
    };

    public addRequest = (localMakingRequest: KnockoutObservable<boolean> = null) => {
        this.activeRequests(this.activeRequests() + 1);

        if (localMakingRequest) {
            localMakingRequest(true);
        }
    };

    public removeRequest = (localMakingRequest: KnockoutObservable<boolean> = null) => {
        this.activeRequests(this.activeRequests() - 1);

        if (localMakingRequest) {
            localMakingRequest(false);
        }
    };

    public toolbar: (alert: Alert.IAlert) => Framework.Toolbar.ToolbarViewModelBase = (alert) => {
        let toolbar = new Framework.Toolbar.ToolbarViewModelBase(this._lifetimeManager);

        let makingRequest: KnockoutObservable<boolean> = ko.observable(false);

        let disableCommand = new Framework.Command.ObservableCommand({
            buttonType: "toggle",
            onclick: this.alertHandler(alert, this.onToggleClicked, makingRequest)
        });

        disableCommand.disabled = makingRequest;

        disableCommand.tooltip = ko.pureComputed(() => {
            return alert.isEnabled() ? ClientResources.disableAlertTooltip : ClientResources.enableAlertTooltip;
        });

        disableCommand.icon = ko.pureComputed(() => {
            return alert.isEnabled() ? Framework.Svg.toggle_on : Framework.Svg.toggle_off;
        });

        disableCommand.selected = ko.pureComputed(() => {
            return alert.isEnabled();
        });

        let editCommand = new Framework.Command.ObservableCommand({
            icon: this.editIcon(),
            onclick: this.alertHandler(alert, this.onEditClicked),
            tooltip: ClientResources.editAlertTooltip
        });

        editCommand.disabled = makingRequest;

        let deleteCommand = new Framework.Command.ObservableCommand({
            icon: this.deleteIcon(),
            onclick: this.alertHandler(alert, this.onDeleteClicked, makingRequest),
            tooltip: ClientResources.deleteAlertTooltip
        });

        deleteCommand.disabled = makingRequest;

        toolbar.addButton(editCommand);
        toolbar.addButton(deleteCommand);
        toolbar.addButton(disableCommand);

        return toolbar;
    };

    public createAlertRule = (alert: Alert.IAlert): Q.Promise<InsightsService.IAlertResponse> => {
        let resourceParams: InsightsService.ICreateAlertUrlParams = {
            subscriptionId: this.subscriptionId,
            resourceGroupName: this.resourceGroupName,
            alertRuleName: alert.name(),
            factoryName: this.factoryName
        };
        let jsonParams: InsightsService.ICreateOrUpdateRuleJsonParams = {
            name: alert.name(),
            location: alert.location(),
            description: alert.description(),
            isEnabled: alert.isEnabled(),
            operationName: alert.operationName(),
            status: alert.status(),
            customEmails: alert.customEmails(),
            sendToServiceOwners: alert.shouldSendToServiceOwners()
        };
        if (alert.subStatus) {
            jsonParams.subStatus = alert.subStatus();
        }
        if (alert.shouldAggregate()) {
            jsonParams.operator = alert.aggregationOperator();
            jsonParams.threshold = alert.aggregationThreshold();
            jsonParams.windowSize = alert.aggregationWindowSize();
        }

        return this.appContext.insightsService.createOrUpdateRule(resourceParams, jsonParams);
    };

    public deleteAlertRule = (ruleName: string, makingRequest: KnockoutObservable<boolean> = null) => {
        this.addRequest(makingRequest);

        let params: InsightsService.IAlertUrlParams = {
            subscriptionId: this.subscriptionId,
            resourceGroupName: this.resourceGroupName,
            alertRuleName: ruleName
        };

        this.appContext.insightsService.deleteRule(params).then(() => {
            this.alertsList.remove((alert) => {
                return alert.name() === ruleName;
            });
        }, (reason) => {
            logger.logError("Failed to delete alert rule: {0} for alert {1}".format(ruleName, alert), reason);
        }).fin(() => {
            this.removeRequest(makingRequest);
        });
    };

    public getAlertRule = (ruleName: string): Q.Promise<InsightsService.IGetAlertResponse> => {
        let params: InsightsService.IAlertUrlParams = {
            subscriptionId: this.subscriptionId,
            resourceGroupName: this.resourceGroupName,
            alertRuleName: ruleName
        };

        return this.appContext.insightsService.getRule(params);
    };

    public listAlertRules = (): Q.Promise<void> => {
        this.addRequest();

        let params: InsightsService.IBaseUrlParams = {
            subscriptionId: this.subscriptionId,
            resourceGroupName: this.resourceGroupName
        };
        return this.appContext.insightsService.listRules(params)
            .then((response: InsightsService.IListAlertsResponse) => {
                this.listHandler(response);
            }, (reason) => {
                if (reason.status === 403) {
                    this.canCreateAlerts(false);
                    this.emptyAlertListText(ClientResources.alertPermissionMissing);
                }
            }).fin(() => {
                this.removeRequest();
            });
    };

    private activeRequests: KnockoutObservable<number> = ko.observable(0);
    private alertsList: KnockoutObservableArray<Alert.IAlert>;
    private canCreateAlerts: KnockoutObservable<boolean>;
    private isLoadingInitialList: KnockoutObservable<boolean>;
    private shouldShowAlertsList: KnockoutComputed<boolean>;
    private emptyAlertListText: KnockoutObservable<string>;
    private addButton: Framework.Command.ObservableCommand;

    private activeIcon: KnockoutObservable<string>;
    private editIcon: KnockoutObservable<string>;
    private deleteIcon: KnockoutObservable<string>;

    private appContext: AppContext.AppContext;
    private subscriptionId: string;
    private resourceGroupName: string;
    private factoryName: string;

    private alertSubscription: MessageHandler.IMessageSubscription<string>;

    private alertWizard: AlertWizard.AlertWizard;

    private showAlertExplorer = (): void => {
        // TODO should be done through Atlas
        // Since Atlas doesn't allow us to open to a left nav panel item, we do that ourselves here
        $(".module-tabs").find("[title='Alerts']").click();
    };

    /* tslint:disable:no-unused-variable for click handlers as tslint is not aware they're used in html */
    private onCreateClicked = () => {
        if (this.canCreateAlerts()) {
            this.alertWizard.showCreateAlertTool();
        }
    };

    private onCreateFromContextMenuClicked = (dataset: string) => {
        this.showAlertExplorer();
        if (this.canCreateAlerts()) {
            this.alertWizard.showCreateAlertTool(dataset);
        }
    };

    private onToggleClicked = (data: Alert.IAlert, makingRequest: KnockoutObservable<boolean>): void => {
        this.addRequest(makingRequest);

        data.isEnabled(!data.isEnabled());

        this.createAlertRule(data).then(
            () => {
                // Do nothing on success
            },
            (reason) => {
                logger.logError("Toggling alert rule failed from state {0} for alert rule {1}".format(data.isEnabled(), data.name()), reason);
                // Change alert enabled state back to original value
                data.isEnabled(!data.isEnabled());
            }).fin(() => {
                this.removeRequest(makingRequest);
            });
    };

    private onEditClicked = (data: Alert.IAlert): void => {
        this.alertWizard.showEditAlertTool(data);
    };

    private onDeleteClicked = (data: Alert.IAlert, makingRequest: KnockoutObservable<boolean>): void => {
        this.appContext.dialogHandler.okayCancelRequest(ClientResources.deleteAlertTitle, ClientResources.deleteAlertQuestion, () => {
            this.deleteAlertRule(data.name(), makingRequest);
        });
    };
    /* tslint:enable:no-unused-variable */

    constructor() {
        super();

        this.alertsList = ko.observableArray<Alert.IAlert>();
        this.canCreateAlerts = ko.observable<boolean>(false);
        this.isLoadingInitialList = ko.observable<boolean>(true);
        this.shouldShowAlertsList = ko.computed<boolean>(() => {
            return this.alertsList().length === 0 && !this.isLoadingInitialList();
        });
        this.emptyAlertListText = ko.observable<string>(ClientResources.alertEmptyAlertsListMessage);
        this.activeIcon = ko.observable<string>(Framework.Svg.active);
        this.editIcon = ko.observable<string>(Framework.Svg.edit);
        this.deleteIcon = ko.observable<string>(Framework.Svg.del);

        this.addButton = new Framework.Command.ObservableCommand({
            label: ClientResources.createAlertButtonText,
            onclick: this.onCreateClicked,
            tooltip: ClientResources.createAlertTooltip
        });

        this.addButton.disabled = ko.pureComputed(() => {
            return !this.canCreateAlerts();
        });

        this.appContext = AppContext.AppContext.getInstance();
        this.subscriptionId = this.appContext.splitFactoryId().subscriptionId;
        this.resourceGroupName = this.appContext.splitFactoryId().resourceGroupName;
        this.factoryName = this.appContext.splitFactoryId().dataFactoryName;

        this.alertSubscription = {
            name: viewModel.className,
            callback: this.onCreateFromContextMenuClicked
        };
        this.appContext.stringMessageHandler.register(this.alertSubscription);

        // Populate Alerts initially
        this.listAlertRules().then(() => {
            this.isLoadingInitialList(false);
        }, (reason) => {
            logger.logError("List alert rules failed", reason);
        });

        DiagramModuleDeclarations.Security.hasPermission("/subscriptions/{0}/resourcegroups/{1}".format(this.subscriptionId, this.resourceGroupName), ["Microsoft.Insights/alertRules/read"]).then(
            (canReadResourceGroup: boolean) => {
                if (canReadResourceGroup) {
                    DiagramModuleDeclarations.Security.hasPermission(this.appContext.factoryId(), ["Microsoft.Insights/alertRules/write"]).then(
                        (canWriteDataFactory: boolean) => {
                            this.canCreateAlerts(canWriteDataFactory);
                        });
                }
            });

        this.alertWizard = new AlertWizard.AlertWizard(this);
    }

    public dispose(): void {
        super.dispose();
        this.appContext.stringMessageHandler.unregister(this.alertSubscription);
    }

    private listHandler(response: InsightsService.IListAlertsResponse): Q.Promise<void> {
        let deferred = Q.defer<void>();
        // We only support alerts for events (not metrics).
        // Azure Insights does not yet support getting alerts for a particular datafactory so we get
        // alerts for the subscription and then filter out based on the datafactory we scrape from the resourceUri
        // TODO remove this filtering once Insights supports listAlerts over a Datafactory
        // https://msdn.microsoft.com/en-us/library/azure/dn931945.aspx
        let alertRules = response.value.filter((alertRule) => {
            let resourceName: string = this.getAlertResource(alertRule.properties.condition.dataSource.resourceUri);
            if (!resourceName) {
                return false;
            }

            return alertRule.properties.condition.dataSource["odata.type"] === EVENT_ALERT_TYPE &&
                resourceName.toLowerCase() === this.factoryName.toLowerCase();
        });

        let alerts: Alert.IAlert[] = [];
        alertRules.forEach((rule) => {
            // There might be multiple custom emails though M&M doesn't support adding multiple custom emails
            let customEmails: KnockoutObservableArray<string> = ko.observableArray<string>();
            rule.properties.action.customEmails.forEach((email) => {
                customEmails.push(email);
            });
            let aggregation = rule.properties.condition.aggregation;

            let alert: Alert.IAlert = {
                name: ko.observable<string>(rule.name),
                location: ko.observable<string>(rule.location),
                description: ko.observable<string>(rule.properties.description),
                isEnabled: ko.observable<boolean>(rule.properties.isEnabled || false), // isEnabled might be undefined in server response
                operationName: ko.observable<string>(rule.properties.condition.dataSource.operationName),
                status: ko.observable<string>(rule.properties.condition.dataSource.status),
                subStatus: ko.observable<string>(rule.properties.condition.dataSource.subStatus),
                customEmails: customEmails,
                shouldSendToServiceOwners: ko.observable(rule.properties.action.sendToServiceOwners || false), // sendToServiceOwners might be undefined in server response
                resource: ko.observable(this.getAlertResource(rule.properties.condition.dataSource.resourceUri)),
                shouldAggregate: ko.observable(aggregation !== undefined)
            };

            // Aggregation is optional for an event alert
            if (alert.shouldAggregate()) {
                alert.aggregationOperator = ko.observable(aggregation.operator);
                alert.aggregationThreshold = ko.observable(aggregation.threshold);
                alert.aggregationWindowSize = ko.observable(aggregation.windowSize);
            }

            alerts.push(alert);
        });

        this.alertsList(alerts);
        return deferred.promise;
    }

    // get resource <factoryName> as observable lowercase string from resourceUri of form:
    // "/SUBSCRIPTIONS/<subId>/RESOURCEGROUPS/<resourcegroupname>/PROVIDERS/MICROSOFT.DATAFACTORY/DATAFACTORIES/<factoryName>"
    private getAlertResource(resourceUri: string): string {
        if (!resourceUri) {
            return null;
        }
        let splitResourceUri = resourceUri.split("/");
        let resourceType = splitResourceUri[splitResourceUri.length - 2].toLowerCase();
        let resourceName = splitResourceUri[splitResourceUri.length - 1];

        let alertResourceType = null;
        switch (resourceType) {
            case "datafactories":
                alertResourceType = Alert.AlertResourceType.FACTORY;
                break;
            default:
                // Okay if the user's have alerts on other resources.
                break;
        }

        return resourceName;
    };
}
