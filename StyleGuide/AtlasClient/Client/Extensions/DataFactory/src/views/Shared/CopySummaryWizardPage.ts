/// <amd-dependency path="text!../PowercopyTool/templates/SummaryTemplate.html" name="summaryTemplate" />
/// <amd-dependency path="text!../PowercopyTool/templates/PictureTemplate.html" name="pictureTemplate" />

/* tslint:disable:align */
let summaryTemplate: string;
let pictureTemplate: string;

import Wizard = require("../../bootstrapper/WizardBinding");
import Constants = require("../PowercopyTool/Constants");
import Common = require("../PowercopyTool/Common");
import Validation = require("../../bootstrapper/Validation");
import Summary = require("../PowercopyTool/Summary");
import AuthorizationButton = require("../PowercopyTool/AuthorizationButton");
/* tslint:disable:no-unused-variable */
import DatasetNavModule = require("../PowercopyTool/DataNavModel");
/* tslint:enable:no-unused-variable */
import DataNavModel = DatasetNavModule.DataNavModel;
import DataTypeConstants = require("../PowercopyTool/DataTypeConstants");
import AppContext = require("../../scripts/AppContext");
import DestinationTableViewModelModule = require("../PowercopyTool/DestinationTableViewModel");
import CommonWizardPage = require("./CommonWizardPage");
import DataTypeViewModel = require("../PowercopyTool/DataTypeViewModel");

export class CopySummaryViewModel {
    public summaryValidateable: Validation.IValidatable;
    public summary = ko.observableArray<Summary.ISummarySection>();
    public oAuthButtons = ko.observableArray<AuthorizationButton.AuthorizationButtonViewModel>();
    public summaryStepSubheader = ko.observable<string>();
    public sourceSummaryHeaderDataType = ko.observable<DataTypeViewModel.IDataSourceItem>();
    public destinationSummaryHeaderDataType = ko.observable<DataTypeViewModel.IDataSourceItem>();
    public runTimeRegion = ko.observable<string>();
    public sourceSummaryHeaderTable = ko.observable<Summary.ISummaryLine<Object>>();
    public destinationSummaryHeaderTable = ko.observable<Summary.ISummaryLine<Object>>();

    public sourceNavModel: DataNavModel;
    public destinationNavModel: DataNavModel;
    public inputTables: KnockoutObservableArray<Common.IADFInputTable>;
    public outputTables: KnockoutObservableArray<Common.IADFOutputTable>;
    public pipelineProperties: CommonWizardPage.PipelineProperties;
    public copyActivityProperties: CommonWizardPage.CopyActivityProperties;

    constructor(sourceNavModel: DataNavModel, destinationNavModel: DataNavModel, inputTables: KnockoutObservableArray<Common.IADFInputTable>,
        outputTables: KnockoutObservableArray<Common.IADFOutputTable>, pipelineProperties: CommonWizardPage.PipelineProperties,
        copyActivityProperties: CommonWizardPage.CopyActivityProperties) {

        this.sourceNavModel = sourceNavModel;
        this.destinationNavModel = destinationNavModel;
        this.inputTables = inputTables;
        this.outputTables = outputTables;
        this.pipelineProperties = pipelineProperties;
        this.copyActivityProperties = copyActivityProperties;

        let summaryValid = ko.computed(() => this.summary().every(section => section.editMode() === false));
        let summarySectionsValidateable: Validation.IValidatable = Common.syncronousValidateable(summaryValid, "Some of the changes haven't been commited");

        let authorized = ko.computed(() => this.oAuthButtons().every(b => b.authorized()));
        let authorizationValidatable = Common.syncronousValidateable(authorized, "Click 'Authorize' button to authorize data factory access to Data Lake store");

        this.summaryValidateable = Common.ValidateableMerge([summarySectionsValidateable, authorizationValidatable]);
    }

    public addOAuthButtonIfNeeded(datamodel: DataNavModel) {
        if (datamodel.dataTypeViewModel.createNewDataStore() && datamodel.dataType() === DataTypeConstants.dataLakeStore) {
            let {subscriptionId, resourceGroupName, dataFactoryName} = AppContext.AppContext.getInstance().splitFactoryId();
            this.oAuthButtons.push(new AuthorizationButton.AuthorizationButtonViewModel(datamodel.linkedService, subscriptionId, resourceGroupName,
                dataFactoryName, datamodel.newLinkedServiceName.value()));
        }
    }

    public toggleSummarySectionEdit(section: Summary.ISummarySection) {
        if (!section.editMode()) {
            section.editMode(true);
        } else {
            let promises: Q.Promise<Validation.IValidationResult>[] = [];
            section.lines.forEach(line => {
                if (line.validateableBox && line.validateableBox.hasValidation()) {
                    promises.push(line.validateableBox.isValid());
                }
            });
            Q.all(promises).then(result => {
                if (result.every(promise => promise.valid)) {
                    section.editMode(false);
                }
            });
        }
    }
}

export function createCopySummaryWizardPage(copySummaryViewModel: CopySummaryViewModel, destinationTableViewModels: KnockoutObservableArray<DestinationTableViewModelModule.DestinationTableViewModel>,
    summaryCreation: typeof Summary.createSummary | typeof Summary.createCopyActivitySummary, areaName: string): Wizard.IWizardStep {
    let entityNameSubscriptions: KnockoutSubscription<string>[] = [];
    let sourceNavModel = copySummaryViewModel.sourceNavModel;
    let destinationNavModel = copySummaryViewModel.destinationNavModel;
    let inputTables = copySummaryViewModel.inputTables;
    let outputTables = copySummaryViewModel.outputTables;

    let wizardStep: Wizard.IWizardStep = {
        name: Constants.summary,
        displayText: "Summary",
        template: summaryTemplate.replace("%%PICTURE_TEMPLATE%%", pictureTemplate),
        viewModel: copySummaryViewModel,
        validateable: ko.observable(copySummaryViewModel.summaryValidateable),
        useCustomErrorMessage: true,
        onForwardLoad: () => {
            CommonWizardPage.logTelemetryEvent(areaName, Constants.summary);
            sourceNavModel.setDatasetDefaultProperties();
            destinationNavModel.setDatasetDefaultProperties();
            outputTables.removeAll();

            if (destinationNavModel.tableListSource()) {
                destinationTableViewModels().forEach(destVm => {
                    outputTables.push({
                        adfTableName: CommonWizardPage.createNewBox(""),
                        folderPath: undefined,
                        fileName: undefined,
                        dateColumnName: undefined,
                        sqlTableName: destVm.selectedTable(),
                        sizeValidation: destinationNavModel.sizeValidation(),
                        fileFormat: undefined,
                        columns: destVm.resultingSchema(),
                        partitions: undefined,
                        cleanupScript: destVm.resultingCleanupScript(),
                        sliceIdentifierColumn: destVm.resultingSliceIdentifier(),
                        storedProcedureName: destVm.resultingStoredProc(),
                        storedProcedureTableType: destVm.resultingStoredProcTableType(),
                        storedProcedureParameters: destVm.storedProcParameters(),
                        translator: destVm.translation(),
                        azureSink: destVm.getAzureTableSinkProperties()
                    });
                });
            } else {
                inputTables().forEach(inputTable => {
                    let filename = undefined;
                    // file name is copied from input table, in case when copying from SQL tables it will be table name,
                    // otherwise undefined
                    if (destinationNavModel.resultingFileName() === undefined) {
                        if (inputTable.fileName) {
                            filename = inputTable.fileName + destinationNavModel.resultingFilenameSuffix();
                        }
                    } else {
                        filename = destinationNavModel.resultingFileName();
                    }

                    outputTables.push({
                        adfTableName: CommonWizardPage.createNewBox(""),
                        folderPath: destinationNavModel.resultingFolderPath(),
                        fileName: filename,
                        dateColumnName: undefined,
                        sqlTableName: undefined,
                        sizeValidation: destinationNavModel.sizeValidation(),
                        fileFormat: destinationNavModel.fileFormatViewModel.getProperties(),
                        columns: inputTable.columns,
                        partitions: destinationNavModel.partitions(),
                        cleanupScript: undefined,
                        sliceIdentifierColumn: undefined,
                        storedProcedureName: undefined,
                        storedProcedureTableType: undefined,
                        storedProcedureParameters: undefined,
                        translator: undefined,
                        azureSink: undefined
                    });
                });
            }

            entityNameSubscriptions.forEach(s => s.dispose());
            // set names for adf tables
            let setInputTableNames = () => {
                if (sourceNavModel.usePrefix()) {
                    inputTables().forEach(table => {
                        if (!table.sqlTableName) {
                            throw "Unexpected";
                        }
                        table.adfTableName.value(composeTableName(sourceNavModel.datasetPrefix.value(), table.sqlTableName));
                    });
                } else {
                    inputTables()[0].adfTableName.value(sourceNavModel.datasetName.value());
                }
            };
            setInputTableNames();
            entityNameSubscriptions.push(sourceNavModel.datasetPrefix.value.subscribe(setInputTableNames));
            entityNameSubscriptions.push(sourceNavModel.datasetName.value.subscribe(setInputTableNames));

            let setOutputTableNames = () => {
                if (sourceNavModel.usePrefix()) {
                    outputTables().forEach((table, index) => {
                        if (table.sqlTableName) {
                            table.adfTableName.value(composeTableName(destinationNavModel.datasetPrefix.value(), table.sqlTableName));
                        } else {
                            table.adfTableName.value(composeTableName(destinationNavModel.datasetPrefix.value(), inputTables()[index].sqlTableName));
                        }
                    });
                } else {
                    outputTables()[0].adfTableName.value(destinationNavModel.datasetName.value());
                }
            };
            setOutputTableNames();
            entityNameSubscriptions.push(destinationNavModel.datasetPrefix.value.subscribe(setOutputTableNames));
            entityNameSubscriptions.push(destinationNavModel.datasetName.value.subscribe(setOutputTableNames));

            let subheader = `You are running ${sourceNavModel.isOneTimePipeline ? "one time pipeline" : "scheduled pipeline"} `;
            subheader += `to copy data from ${sourceNavModel.subheaderText()} to ${destinationNavModel.subheaderText()}. `;
            subheader += `${sourceNavModel.usePrefix() ? inputTables().length + " tables will be copied" : ""}`;
            copySummaryViewModel.summaryStepSubheader(subheader);

            copySummaryViewModel.oAuthButtons().forEach(authBtn => {
                authBtn.dispose();
            });
            copySummaryViewModel.oAuthButtons.removeAll();

            copySummaryViewModel.addOAuthButtonIfNeeded(sourceNavModel);
            copySummaryViewModel.addOAuthButtonIfNeeded(destinationNavModel);
            copySummaryViewModel.summary(summaryCreation.call(this, copySummaryViewModel));

            copySummaryViewModel.sourceSummaryHeaderDataType(DataTypeViewModel.getDataSourceItem(sourceNavModel.dataType()));
            copySummaryViewModel.destinationSummaryHeaderDataType(DataTypeViewModel.getDataSourceItem(destinationNavModel.dataType()));

            copySummaryViewModel.runTimeRegion(undefined);
            if (sourceNavModel.onPremises() || destinationNavModel.onPremises()) {
                copySummaryViewModel.runTimeRegion("On premise");
            }
            sourceNavModel.setRuntimeRegion();
            destinationNavModel.setRuntimeRegion().then(runtimeRegion => {
                if (!copySummaryViewModel.runTimeRegion()) {
                    copySummaryViewModel.runTimeRegion(runtimeRegion);
                }
            });
            return null;
        }
    };

    return wizardStep;
}

function composeTableName(prefix: string, tableName: string): string {
    return prefix + "-" + tableName.replace(".", "-");
}
