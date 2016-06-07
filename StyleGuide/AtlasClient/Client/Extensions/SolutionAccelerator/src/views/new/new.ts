/// <reference path="../../References.d.ts" />
/// <reference path="../../Module.d.ts" />
/// <amd-dependency path="text!./new.html" />
/// <amd-dependency path="css!./new.css" />

import ko = require("knockout");
import Router = Microsoft.DataStudio.Application.Router;
import Managers = Microsoft.DataStudio.SolutionAccelerator.Managers;
import ShellContext = Microsoft.DataStudio.Application.ShellContext;
import LoggerFactory = Microsoft.DataStudio.SolutionAccelerator.LoggerFactory;
import Logging = Microsoft.DataStudio.Diagnostics.Logging;
import SolutionAcceleratorServiceMock = Microsoft.DataStudio.SolutionAccelerator.Services.Mocks.SolutionAcceleratorServiceMock;

export var template: string = require("text!./new.html");
var logger = LoggerFactory.getLogger({ loggerName: "NewSolutionWizard", category: "ViewModel" });

export class viewModel {
    
    /* Static view properties - START */
    // Validation Regular expressions
    private static marketPlaceApiKeyRegex = /^\S+$/;
    private static solutionNameRegex = /^[a-z0-9]{1,17}$/;
    private static userNameRegex = /^[a-zA-Z_][a-zA-Z0-9_@$#]{0,127}$/;
    private static passwordRegex = /^(?!.*')((?=.*[a-z])(?=.*[0-9])(?=.*\W)|(?=.*[A-Z])(?=.*[0-9])(?=.*\W)|(?=.*[A-Z])(?=.*[a-z])(?=.*\W)|(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])|(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W)).{8,128}$/;
    private static restrictedUserNames: string[] = [
        "admin",
        "administrator",
        "db_accessadmin",
        "db_backupoperator",
        "db_datareader",
        "db_datawriter",
        "db_debydatawriter",
        "db_denydatareader",
        "db_dlladmin",
        "db_owner",
        "db_securityadmin",
        "dbmanager",
        "dbo",
        "guest",
        "information_schema",
        "loginmanager",
        "public",
        "root",
        "sa",
        "sys"
    ];

    // Solution accelerator parameters
    public solutionType: KnockoutObservable<string>;

    // Wizard Section 1 Parameters
    public solutionName: KnockoutObservable<string>;
    public subscription: KnockoutObservable<any>;
    public subscriptionArray: KnockoutObservableArray<Microsoft.DataStudio.Model.Subscription>;
    public isTermsAndConditionsAccepted: KnockoutObservable<boolean>;

    // Wizard Section 2 Parameters
    public userName: KnockoutObservable<string>;
    public password: KnockoutObservable<string>;
    public confirmPassword: KnockoutObservable<string>;

    // Anomaly Detection Wizard Parameters
    public marketPlaceApiKey: KnockoutObservable<string>;

    // Wizard Controls
    public isVisible: KnockoutObservable<boolean>;
    public deployButtonClicked: KnockoutObservable<boolean>;
    public selectedSection: KnockoutObservable<number>;
    public enableDeployButton: KnockoutComputed<boolean>;
    public enableNextButton: KnockoutObservable<boolean>;
    private isDeploying: KnockoutObservable<boolean>;
    public failedToDeploy: KnockoutObservable<boolean>;
    public failureMessage: KnockoutObservable<string>;

    public solutionTypeDisplayName: KnockoutComputed<string>;

    constructor() {
        var self = this;

        ShellContext.LeftPanelIsExpanded(false);
        ShellContext.RightPanelIsExpanded(false);

        var urlParams: string[] = Router.currentArguments() ? decodeURIComponent(Router.currentArguments()).split('/') : [];
        if (urlParams.length != 1) 
        {
            Router.navigate("solutionaccelerator");
            return;
        }

        self.solutionType = ko.observable(urlParams[0]);

        self.solutionTypeDisplayName = ko.computed(() => {
            var solutionType: string = self.solutionType();
            var metadata: any = Managers.SolutionAcceleratorDataManager.solutionTypeMetadata[solutionType];
            return metadata && metadata.displayName ? '(' + metadata.displayName + ')' : '';
        });

        if (!(self.solutionType() in Managers.SolutionAcceleratorDataManager.solutionTypeMetadata))
        {
            self.solutionType(null);
        }

        logger.logUsage(Logging.UsageEventType.Custom, "SolTemplateWizard_Launch", { templateType: self.solutionType() });

        // Section 1 Parameters
        self.solutionName = ko.observable('');
        self.solutionName.extend({
            validator: (name: string) => viewModel.solutionNameRegex.test(name.trim())
        });
        self.subscription = ko.observable(null).extend({
            validator: (subscription: any) => subscription != null
        });
        self.subscriptionArray = ko.observableArray(Microsoft.DataStudio.Managers.AuthenticationManager.instance.getCurrentUser().subscriptions);
        self.isTermsAndConditionsAccepted = ko.observable(false);

        // Section 2 Parameters
        self.userName = ko.observable("").extend({
            validator: self.validateSQLUsername
        });
        self.userName.subscribe((newVal) => self.password.valueHasMutated());

        self.password = ko.observable("").extend({
            validator: (password) => {
                // Username cannot be a part of the password
                if (password.indexOf(self.userName()) > -1) return false;
                return viewModel.passwordRegex.test(password);
            }
        });
        self.password.subscribe((newVal) => self.confirmPassword.valueHasMutated());

        self.confirmPassword = ko.observable("").extend({
            validator: (password) => password === self.password()
        });

        // Anomaly Detection params
        self.marketPlaceApiKey = ko.observable("").extend({
            validator: (marketPlaceApiKey: string) => (marketPlaceApiKey != null && marketPlaceApiKey.length > 0 && viewModel.marketPlaceApiKeyRegex.test(marketPlaceApiKey))
        });

        // Wizard Controls
        self.isDeploying = ko.observable(false);
        self.isVisible = ko.observable(true);
        self.selectedSection = ko.observable(0);
        self.enableNextButton = ko.observable(false);
        self.deployButtonClicked = ko.observable(false);
        self.failedToDeploy = ko.observable(false);
        self.failureMessage = ko.observable('');

        self.enableNextButton = ko.computed(() => {
            switch (self.selectedSection()) {
                case 0:
                    return self.solutionName.isValid() && self.subscription.isValid() && self.isTermsAndConditionsAccepted();
                case 1:
                    if (self.solutionType() === SolutionAcceleratorServiceMock.ANOMALYDETECTION) {
                        return self.marketPlaceApiKey.isValid();
                    } else {
                    return self.userName.isValid() && self.password.isValid() && self.confirmPassword.isValid();
                    }
                default:
                    return false;
            }
        }, self);

        self.enableDeployButton = ko.computed(() => {
            return !self.isDeploying() && self.selectedSection() === 1 && self.enableNextButton();
        }, self);
    }

    private validateSQLUsername = (name: string) => {
        var trimmed: string = name.trim();
        // TODO: stpryor: Update error messaging to tell user why their restricted username didn't work
        //                This would be a good place to use tooltips.
        return viewModel.restrictedUserNames.indexOf(trimmed.toLowerCase()) < 0 && viewModel.userNameRegex.test(trimmed);
    };

    // Method: close
    // Close handle all functionality related to closing the wizard
    public close = () => {
        if (!this.deployButtonClicked()) {
            logger.logUsage(Logging.UsageEventType.ActionButton, "SolTemplateWizard_CloseButtonClick", { templateType: this.solutionType() });
            this.isVisible(false);
            Router.navigate("solutionaccelerator/solutionInfoView");
            // Reload the solutions left panel to select the first solution
        }
    };

    // Method: deploy
    // Take the validated parameters the deploy the solution to the server
    public deploy = () => {
        var self = this;

        logger.logUsage(Logging.UsageEventType.ActionButton, "SolTemplateWizard_DeployButtonClick", { templateType: self.solutionType() });
        self.isDeploying(true);
        var currentdate = new Date();
        var datetime = currentdate.getMinutes().toString() + currentdate.getSeconds().toString() + currentdate.getMilliseconds().toString();
        self.solutionName(self.solutionName().trim());
        var lcSolutionName: string = self.solutionName().toLowerCase();
        var solutionType: string = self.solutionType();
        var parameters: any;
        if (self.solutionType() === SolutionAcceleratorServiceMock.ANOMALYDETECTION) {
            parameters = {
                dataFactoryName: { value: lcSolutionName + datetime },
                storageAccountName: { value: lcSolutionName + datetime },
                mLEndpointKey: { value: self.marketPlaceApiKey() }
            };
        } else {
            parameters = {
            dataFactoryName: { value: lcSolutionName + datetime },
            storageAccountName: { value: lcSolutionName + datetime },
            sqlServerUserName: { value: self.userName() },
            sqlServerPassword: { value: self.password() },
            sqlServerName: { value: lcSolutionName + datetime },
            IngestEventHubName: { value: lcSolutionName + "ingesteventhub" + datetime },
            PublishEventHubName: { value: lcSolutionName + "publisheventhub" + datetime },
            streamingJobName: { value: lcSolutionName + "streamingjob" + datetime },
            namespaceName: { value: lcSolutionName + datetime },
        };
        }

        Managers.SolutionAcceleratorManager
            .getInstance()
            .deploySolution(self.solutionName(), solutionType, self.subscription().subscriptionid, JSON.stringify(parameters))
            .then((data) => {
                logger.logUsage(Logging.UsageEventType.Custom, "SolTemplate_SucceededDeployment", { templateType: self.solutionType() });
                self.failedToDeploy(false);
                self.deployButtonClicked(true);
                Router.navigate("solutionaccelerator/solutionInfoView/" + data.RowKey + "/" + data.PartitionKey);
            }).catch((reason) => {
                logger.logUsage(Logging.UsageEventType.Custom, "SolTemplate_FailedDeployment", { templateType: self.solutionType(), failureMessage: reason.toString() });
                self.isDeploying(true);
                self.failedToDeploy(true);
                self.failureMessage(reason);
                self.deployButtonClicked(false);
            });
    }

    // Method: nextBtn
    // Functionality for clicking the next button
    public nextBtn = () => {
        logger.logUsage(Logging.UsageEventType.ActionButton, "SolTemplateWizard_NextButtonClick", { templateType: this.solutionType() });
        this.selectedSection(1);
    }

    // Method: backBtn
    // Functionality for clicking the back button
    public backBtn = () => {
        logger.logUsage(Logging.UsageEventType.ActionButton, "SolTemplateWizard_BackButtonClick", { templateType: this.solutionType() });
        this.selectedSection(0);
    }
}