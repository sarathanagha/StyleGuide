/// <amd-dependency path="text!./templates/ToolTemplate.html" />
/// <amd-dependency path="text!./templates/ToolHeaderTemplate.html" />
/// <amd-dependency path="text!./templates/ActivityPropertiesTemplate.html" />
/// <amd-dependency path="text!./templates/ScheduleTemplate.html" />
/// <amd-dependency path="text!./templates/PictureTemplate.html" />
/// <amd-dependency path="text!./templates/SummaryTemplate.html" />
/// <amd-dependency path="text!./templates/DeploymentTemplate.html" />
/// <amd-dependency path="text!./templates/TaskPropertiesTemplate.html" />
/// <amd-dependency path="text!./templates/DatasetProperties.html" />
/// <amd-dependency path="css!./css/PowercopyTool.css" />
/// <amd-dependency path="text!./templates/FrequencyIntervalTemplate.html" name="frequencyIntervalTemplate" />

let frequencyIntervalTemplate: string;

/* tslint:disable:no-unused-variable */
import DataNavModule = require("./DataNavModel");
import DataNavModel = DataNavModule.DataNavModel;
import DestinationTableViewModelModule = require("./DestinationTableViewModel");
import DataTypeViewModel = require("./DataTypeViewModel");
import Framework = require("../../_generated/Framework");
import AuthorizationButtonModule = require("./AuthorizationButton");
import LoggerModule = require("./Logger");
/* tslint:enable:no-unused-variable */

import Constants = require("./Constants");
import Pipeline = require("../../scripts/Framework/Model/Contracts/Pipeline");
import Common = require("./Common");
import IADFInputTable = Common.IADFInputTable;
import IADFOutputTable = Common.IADFOutputTable;
import IColumn = Common.IColumn;
import JSONTemplates = require("./JSONTemplates");
import JSONWriter = require("./JSONWriter");
import IFactoryEntityQuery = Common.IFactoryEntityQuery;
import Wizard = require("../../bootstrapper/WizardBinding");
import Validation = require("../../bootstrapper/Validation");
import FormFields = require("../../bootstrapper/FormFields");
import ExpressDeployerModule = require("./ExpressDeployer");

import DestinationTableViewModel = DestinationTableViewModelModule.DestinationTableViewModel;
import FactoryEntities = require("./FactoryEntities");
import Summary = require("./Summary");
import Settings = require("./Settings");
import AppContext = require("../../scripts/AppContext");
import RoutingHandler = require("../../scripts/Handlers/RoutingHandler");
import Telemetry = Framework.Telemetry;
import CopyToolLogger = LoggerModule.logger;
import DatasetWizardPage = require("../Shared/DatasetWizardPage");
import CommonWizardPage = require("../Shared/CommonWizardPage");
import Performance = require("./PerformanceSettings");
import CopySummaryWizardPage = require("../Shared/CopySummaryWizardPage");

/* tslint:disable:no-var-requires */
export const template: string = require("text!./templates/ToolTemplate.html");
/* tslint:enable:no-var-requires */

export let copyTool: PowerCopyTool = null;

export interface IDeploymentTelemetryInfo {
    onetime: boolean;
    sourceType: string;
    destinationType: string;
    activityCount: number;
    existingLinkedServicesCount: number;
    sourcePartitions: number;
    destinationPartitions: number;
    sourceTimeFilter: number;
    binaryCopy: boolean;
}

// TODO paverma A lot of these variables were not being used anywhere. Get rid of those. Also a lot of these can be updated to have a stricter scope.
export class PowerCopyTool {
    public static className = "PowercopyTool";
    protected static pictureTemplate: string = require("text!./templates/PictureTemplate.html");
    private static toolHeaderTemplate: string = require("text!./templates/ToolHeaderTemplate.html");

    // private static activityPropertiesTemplate: string = require("text!./templates/ActivityPropertiesTemplate.html");
    private static taskPropertiesTemplate: string = require("text!./templates/TaskPropertiesTemplate.html");
    // private static datesetPropertiesTemplate: string = require("text!./templates/DatasetProperties.html");
    private static deploymentTemplate: string = require("text!./templates/DeploymentTemplate.html").replace("%%PICTURE_TEMPLATE%%", PowerCopyTool.pictureTemplate);

    public textBox = ko.observable<string>();
    public columns: KnockoutObservableArray<IColumn> = ko.observableArray<IColumn>();

    public sourceNavModel: DataNavModel;
    public destinationNavModel: DataNavModel;

    public dummyTime = "2016-02-28T00:00:00Z";

    public pipelineProperties: CommonWizardPage.PipelineProperties = new CommonWizardPage.PipelineProperties({
        startDate: new Date(Settings.defaultPipelineStart),
        endDate: new Date(Settings.defaultPipelineEnd)
    }, Pipeline.PipelineMode.Scheduled);
    public copyActivityProperties: CommonWizardPage.CopyActivityProperties = new CommonWizardPage.CopyActivityProperties();

    public destinationTableViewModels = ko.observableArray<DestinationTableViewModel>();

    public errorMessage = ko.observable<string>();

    public valid: Validation.IValidatable;
    public nextEnabled = ko.observable(true);

    public destinationDateColumnList = ko.observableArray<FormFields.IOption>([{ displayText: "Loading...", value: "" }]);

    public destinationColumns = ko.observableArray<IColumn>();
    public wizard: Wizard.Wizard;

    public inputTables = ko.observableArray<IADFInputTable>();
    public outputTables = ko.observableArray<IADFOutputTable>();

    public factoryName: string;

    public subscriptionId: string;
    public resourceGroup: string;

    public isOneTimePipeline = ko.computed(() => this.pipelineProperties.pipelineMode() === Pipeline.PipelineMode.OneTime);

    public taskPropertiesSubheader = ko.computed(() => {
        return this.isOneTimePipeline() ? ClientResources.oneTimeCopySubheaderText : ClientResources.recurringCopySubheaderText;
    });

    public showAdvancedCopyProperties = ko.observable(false);
    public deployer: ExpressDeployerModule.ExpressDeployer = new ExpressDeployerModule.ExpressDeployer();

    public summaryStepSubheader = ko.observable<string>();
    public summary = ko.observableArray<Summary.ISummarySection>();

    public inputDatasetsDetailVisible = ko.observable(false);
    public outputDatasetsDetailVisible = ko.observable(false);

    public entityNameSubscriptions: KnockoutSubscription<string>[] = [];
    public copySummaryViewModel: CopySummaryWizardPage.CopySummaryViewModel;
    public performanceSettingsViewModel: Performance.PerformancesSettingsViewModel;

    private oldErrorHandler = window.onerror;
    private pipelineFullName: KnockoutComputed<string>;
    private binaryCopy: KnockoutObservable<boolean>;

    public createParameters(name: string): IFactoryEntityQuery {
        return {
            factoryName: this.factoryName,
            resourceGroupName: this.resourceGroup,
            subscriptionId: this.subscriptionId,
            name: name
        };
    }

    public toggleShowAdvanced() {
        this.showAdvancedCopyProperties(!this.showAdvancedCopyProperties());
    }

    public toggleInputDatasetsDetailVisible() {
        this.inputDatasetsDetailVisible(!this.inputDatasetsDetailVisible());
    }

    public toggleOutputDatasetsDetailVisible() {
        this.outputDatasetsDetailVisible(!this.outputDatasetsDetailVisible());
    }

    public dispose() {
        window.onerror = this.oldErrorHandler;
        copyTool = null;
    }

    public createDeployment() {
        for (let i = 0; i < this.sourceNavModel.tableList().length;) {
            if (!this.sourceNavModel.tableList()[i].selected()) {
                this.sourceNavModel.tableList.remove(this.sourceNavModel.tableList()[i]);
            } else {
                i++;
            }
        }

        let adfInputTableEntities = [];
        let adfOutputTablesEntities = [];
        let useExistingLinkedServiceForSource = this.sourceNavModel.dataTypeViewModel.useExistingLinkedService();
        let useExistingLinkedServiceForDestination = this.destinationNavModel.dataTypeViewModel.useExistingLinkedService();

        if (!this.sourceNavModel.dataTypeViewModel.useExistingDataset()) {
            if (!this.sourceNavModel.tableListSource()) {
                this.inputTables().forEach(inputTable => {
                    adfInputTableEntities.push(JSONWriter._writeStorageTable(this._fullName(inputTable.adfTableName.value()), this.sourceNavModel.selectedLinkedServiceName(),
                        this, inputTable, this.sourceNavModel.dataType(), true, useExistingLinkedServiceForSource, this.binaryCopy()));
                });
            } else {
                this.inputTables().forEach(inputTable => {
                    adfInputTableEntities.push(JSONWriter._writeSqlTable(this._fullName(inputTable.adfTableName.value()), this.sourceNavModel.selectedLinkedServiceName(),
                        this, inputTable, this.sourceNavModel.dataType(), true, useExistingLinkedServiceForSource));
                });
            }
        }

        if (!this.destinationNavModel.tableListSource()) {
            this.outputTables().forEach(outputTable => {
                adfOutputTablesEntities.push(JSONWriter._writeStorageTable(this._fullName(outputTable.adfTableName.value()), this.destinationNavModel.selectedLinkedServiceName(),
                    this, outputTable, this.destinationNavModel.dataType(), false, useExistingLinkedServiceForDestination, this.binaryCopy()));
            });
        } else {
            this.outputTables().forEach(outputTable => {
                adfOutputTablesEntities.push(JSONWriter._writeSqlTable(this._fullName(outputTable.adfTableName.value()), this.destinationNavModel.selectedLinkedServiceName(),
                    this, outputTable, this.destinationNavModel.dataType(), false, useExistingLinkedServiceForDestination));
            });
        }

        let pipeline = JSONWriter.writeCopyPipeline(this.pipelineFullName(), this);

        let armTemplate = JSONWriter.typedExtend(JSONTemplates.armTemplate);
        let linkedServicesCount = 0;
        let linkedServiceDependencies: string[] = [];
        let stagingDependency: string[] = [];
        let stagingLinkedService: Common.IEntity = this.performanceSettingsViewModel.getStagingLinkedServiceJSON();
        if (stagingLinkedService) {
            linkedServicesCount++;
            stagingDependency.push(JSONWriter.getLinkedServiceDependencyString(this.factoryName, stagingLinkedService.name));
            stagingLinkedService.name = this._fullName(stagingLinkedService.name);
            armTemplate.resources.push(stagingLinkedService);
        }
        if (this.sourceNavModel.dataTypeViewModel.createNewDataStore()) {
            let linkedService = this.sourceNavModel.linkedService;
            let linkedServiceName = this.sourceNavModel.selectedLinkedServiceName();
            linkedService.name = this._fullName(linkedServiceName);
            armTemplate.resources.push(linkedService);
            linkedServiceDependencies.push(JSONWriter.getLinkedServiceDependencyString(this.factoryName, linkedServiceName));
            linkedServicesCount++;
        }
        if (this.destinationNavModel.dataTypeViewModel.createNewDataStore()) {
            let linkedService = this.destinationNavModel.linkedService;
            let linkedServiceName = this.destinationNavModel.selectedLinkedServiceName();
            linkedService.name = this._fullName(linkedServiceName);
            armTemplate.resources.push(linkedService);
            linkedServiceDependencies.push(JSONWriter.getLinkedServiceDependencyString(this.factoryName, linkedServiceName));
            linkedServicesCount++;
        }

        let datasetEntities = adfInputTableEntities.concat(adfOutputTablesEntities);
        let expectedDatasetCount = datasetEntities.length;
        if (!this.isOneTimePipeline()) {
            armTemplate.resources = armTemplate.resources.concat(datasetEntities);
            delete pipeline.properties.datasets;
        } else {
            pipeline.properties.start = this.dummyTime;
            pipeline.properties.end = this.dummyTime;
            pipeline.dependsOn = linkedServiceDependencies;
            datasetEntities.forEach(entity => {
                delete entity["dependsOn"];
                delete entity["type"];
                delete entity["apiVersion"];
                entity.name = entity.name.split("/")[1];
                pipeline.properties.datasets.push(entity);
            });
            expectedDatasetCount = 0;
        }
        armTemplate.resources.push(pipeline);
        let expectedCounts = [linkedServicesCount, expectedDatasetCount, 1];

        let deploymentString = JSON.stringify(armTemplate, null, 6);
        /* tslint:disable:align */
        try {
            localStorage["copyPipelineDeployment"] = deploymentString;
        } catch (e) {
            // g
        };
        /* tslint:enable:align */

        let telemetryLog: IDeploymentTelemetryInfo = {
            activityCount: this.inputTables().length,
            binaryCopy: this.binaryCopy(),
            destinationPartitions: this.destinationNavModel.partitions().length,
            destinationType: this.destinationNavModel.dataType(),
            existingLinkedServicesCount: 2 - expectedCounts[0],
            onetime: this.isOneTimePipeline(),
            sourcePartitions: this.sourceNavModel.partitions().length,
            sourceTimeFilter: this.inputTables().filter(inputTbl => inputTbl.readerQuery && inputTbl.readerQuery.indexOf("$$Text") === 0).length,
            sourceType: this.sourceNavModel.dataType()
        };

        return {
            deploymentString: deploymentString,
            expectedCounts: expectedCounts,
            telemetryLog: telemetryLog
        };
    }

    private deploy(deploymentString: string, expectedCounts: number[], telemetryLog: IDeploymentTelemetryInfo) {
        let factoryParameters = {
            subscriptionId: this.subscriptionId,
            resourceGroupName: this.resourceGroup,
            factoryName: this.factoryName
        };
        this.deployer.deploy(factoryParameters, deploymentString, true, this.isOneTimePipeline(), this.pipelineProperties.pipelineName.value());
    }

    private logTelemetryEvent(step: string, substep?: string) {
        Telemetry.instance.logEvent(
            new Telemetry.Event(
                "/subscription/{0}/resourceGroup/{1}/providers/Microsoft.DataFactory/dataFactories/{2}".format(this.subscriptionId, this.resourceGroup, this.factoryName),
                !substep ? "PowerCopyTool-{0}".format(step) : "PowerCopyTool-{0}-{1}".format(step, substep),
                Telemetry.Action.open
            )
        );
    }

    private logDeploymentEvent(telementryLog: IDeploymentTelemetryInfo) {
        let otherInfo: StringMap<string> = {};

        for (var key in telementryLog) {
            otherInfo[key] = telementryLog[key];
        }

        let appContext = AppContext.AppContext.getInstance();
        let splitFactoryId = appContext.splitFactoryId();
        Telemetry.instance.logEvent(
            new Telemetry.Event(
                "/subscription/{0}/resourceGroup/{1}/providers/Microsoft.DataFactory/dataFactories/{2}".format(
                    splitFactoryId.subscriptionId, splitFactoryId.resourceGroupName, splitFactoryId.dataFactoryName),
                "PowerCopyTool-deployment",
                Telemetry.Action.invoke,
                otherInfo
            )
        );
    }

    private _fullName(entityName: string) {
        return this.factoryName + "/" + entityName;
    }

    /* tslint:disable:no-unused-variable */
    private gotoMonitoring() {
        /* tslint:enable:no-unused-variable */
        let newUrlParams: StringMap<string> = {};
        newUrlParams[RoutingHandler.urlKeywords.moduleView.value] = RoutingHandler.viewName.edit;
        newUrlParams[RoutingHandler.urlKeywords.pipeline.value] = this.pipelineProperties.pipelineName.value();
        AppContext.AppContext.getInstance().routingHandler.pushState("powercopytool", newUrlParams);
    }

    constructor() {
        let appContext = AppContext.AppContext.getInstance();
        let splitFactoryId = appContext.splitFactoryId();
        this.subscriptionId = splitFactoryId.subscriptionId;
        this.resourceGroup = splitFactoryId.resourceGroupName;
        /* tslint:disable:no-any */
        window.onerror = <any>(function (message: string, source: string, lineNumber: number, columnNumber: number, error: Error) {
            /* tslint:enable:no-any */
            CopyToolLogger.logError(`Exception occurred, source: ${source}, line number: ${lineNumber}, column number: ` +
                `${columnNumber}, message: ${message}`);

            if (this.oldErrorHandler) {
                this.oldErrorHandler.apply(this, arguments);
            }
        });

        this.factoryName = splitFactoryId.dataFactoryName;

        let factoryIdSplit = Microsoft.DataStudio.Application.ShellContext.CurrentRoute().arguments.split("/");
        if (factoryIdSplit.length === 7 && factoryIdSplit[6].toLowerCase() === "admsapitip") {
            require(["./test/AdmsApiTip"], m => m.runTest(this.pipelineProperties.description));
        }

        this.pipelineProperties.activePeriod.subscribe((currentValue) => {
            this.sourceNavModel.setDateRange(currentValue);
        });

        /* tslint:disable:align */
        let updateStartEnd = () => {
            if (this.copyActivityProperties.frequency.value() && this.copyActivityProperties.interval.value()) {
                let minutesInPast = Common.minuteDurationMap[this.copyActivityProperties.frequency.value()] * parseInt(this.copyActivityProperties.interval.value(), 10);
                let startDate = new Date(new Date().getTime() - minutesInPast * 60000);

                let endDate = new Date(2099, 11, 31);
                this.pipelineProperties.startEnd.currentValue(
                    {
                        startDate: startDate,
                        endDate: endDate
                    }
                );
            };
        };
        /* tslint:enable:align */
        this.copyActivityProperties.frequency.value.subscribe(updateStartEnd);
        this.copyActivityProperties.interval.value.subscribe(updateStartEnd);
        updateStartEnd();

        FactoryEntities.factoryName = this.factoryName;
        FactoryEntities.resourceGroup = this.resourceGroup;
        FactoryEntities.subscriptionId = this.subscriptionId;
        FactoryEntities.loadEntities();
        FactoryEntities.loadFactory();

        this.sourceNavModel = new DataNavModel(true, this.isOneTimePipeline);
        this.sourceNavModel.setDateRange(this.pipelineProperties.startEnd.currentValue());
        this.destinationNavModel = new DataNavModel(false, this.isOneTimePipeline);

        this.binaryCopy = this.sourceNavModel.binaryCopySource;
        this.performanceSettingsViewModel = new Performance.PerformancesSettingsViewModel(this.sourceNavModel, this.destinationNavModel);

        // Source will define whether there are multiple tables to be copied thus whether prefix is required
        ko.computed(() => {
            this.destinationNavModel.usePrefix(this.sourceNavModel.usePrefix());
        });

        this.pipelineProperties.pipelineName.value("");
        this.pipelineFullName = ko.computed(() => this.factoryName + "/" + this.pipelineProperties.pipelineName.value());

        let propertiesViewModel = {
            pipelineProperties: this.pipelineProperties,
            copyActivityProperties: this.copyActivityProperties,
            frequencyIntervalTemplate: frequencyIntervalTemplate
        };

        this.copySummaryViewModel = new CopySummaryWizardPage.CopySummaryViewModel(this.sourceNavModel, this.destinationNavModel, this.inputTables,
            this.outputTables, this.pipelineProperties, this.copyActivityProperties);

        let finalAction = () => {
            let deployment = this.createDeployment();
            this.logDeploymentEvent(deployment.telemetryLog);

            this.deploy(deployment.deploymentString, deployment.expectedCounts, deployment.telemetryLog);
        };

        let finalStep = {
            displayText: "Deployment",
            name: Constants.deployment,
            template: PowerCopyTool.deploymentTemplate,
            viewModel: this,
            onLoad: () => {
                this.logTelemetryEvent(Constants.deployment);
                return null;
            }
        };

        this.wizard = new Wizard.Wizard({
            steps: [
                {
                    name: Constants.taskProperties,
                    displayText: "Properties",
                    subheaderText: this.taskPropertiesSubheader,
                    template: PowerCopyTool.taskPropertiesTemplate,
                    validateable: ko.observable(this.pipelineProperties.pipelineName),
                    viewModel: propertiesViewModel,
                    onForwardLoad: () => {
                        this.logTelemetryEvent(Constants.taskProperties);
                        this.pipelineProperties.pipelineName.value(FactoryEntities.getUniqueName("CopyPipeline"));
                        return null;
                    }
                },
                DatasetWizardPage.createSourceDatasetWizardStep(this.sourceNavModel, PowerCopyTool.className),
                DatasetWizardPage.createDestinationDatasetWizardStep(this.destinationNavModel, this.sourceNavModel, this.inputTables,
                    this.destinationTableViewModels, this.performanceSettingsViewModel, PowerCopyTool.className),
                // {
                //    name: Constants.activityProperties,
                //    displayText: "Copy settings",
                //    template: PowerCopyTool.activityPropertiesTemplate,
                //    viewModel: this
                // },
                CopySummaryWizardPage.createCopySummaryWizardPage(this.copySummaryViewModel, this.destinationTableViewModels,
                    Summary.createSummary, PowerCopyTool.className)
            ],
            headerTemplate: PowerCopyTool.toolHeaderTemplate,
            headerViewModel: this
        }, finalAction.bind(this), finalStep);

        copyTool = this;
    }
}

export let viewModel = PowerCopyTool;
