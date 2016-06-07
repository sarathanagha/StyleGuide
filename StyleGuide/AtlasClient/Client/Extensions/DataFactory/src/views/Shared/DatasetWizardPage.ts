/// <amd-dependency path="text!../PowercopyTool/templates/LinkedServicesGridTemplate.html" name="linkedServicesGridTemplate" />
/// <amd-dependency path="text!../PowercopyTool/templates/DataSourcesTemplate.html" name="dataSourcesTemplate" />
/// <amd-dependency path="text!../PowercopyTool/templates/ConnectionTemplate.html" name="connectionTemplate" />
/// <amd-dependency path="text!../PowercopyTool/templates/ConnectionFormTemplate.html" name="connectionFormTemplate" />
/// <amd-dependency path="text!../PowercopyTool/templates/LinkedServicePropertiesTemplate.html" name="linkedServicePropertiesTemplate" />
/// <amd-dependency path="text!../PowercopyTool/templates/FileFormatTemplate.html" name="fileFormatTemplate" />
/// <amd-dependency path="text!../PowercopyTool/templates/DateTimeColumnsTemplate.html" name="dateTimeColumnsTemplate" />
/// <amd-dependency path="text!../PowercopyTool/templates/ColumnMappingTemplate.html" name="columnMappingTemplate" />
/// <amd-dependency path="text!../PowercopyTool/templates/PerformanceTemplate.html" name="performanceTemplate" />

/* tslint:disable:align */
let linkedServicesGridTemplate: string;
let dataSourcesTemplate: string;
let connectionTemplate: string;
let linkedServicePropertiesTemplate: string;
let connectionFormTemplate: string;
connectionTemplate = connectionTemplate.replace(/%%CONNECTIONFORM%%/, connectionFormTemplate);
let performanceTemplate;
performanceTemplate = performanceTemplate.replace("%%CONNECTIONFORM%%", connectionFormTemplate);
let fileFormatTemplate: string;
let dateTimeColumnsTemplate: string;
let columnMappingTemplate: string;

import Wizard = require("../../bootstrapper/WizardBinding");
import FactoryEntities = require("../PowercopyTool/FactoryEntities");
/* tslint:disable:no-unused-variable */
import DatasetNavModule = require("../PowercopyTool/DataNavModel");
/* tslint:enable:no-unused-variable */
import DataNavModel = DatasetNavModule.DataNavModel;
import Constants = require("../PowercopyTool/Constants");
import Validation = require("../../bootstrapper/Validation");
import Common = require("../PowercopyTool/Common");
import DestinationTableViewModelModule = require("../PowercopyTool/DestinationTableViewModel");
import DataTypeViewModel = require("../PowercopyTool/DataTypeViewModel");
import PerfSettings = require("../PowercopyTool/PerformanceSettings");
import CommonWizardPage = require("./CommonWizardPage");

function getSourceFolderPathValidateable(dataNavModel: DataNavModel): Validation.IValidatable {
    return {
        isValid: () => {
            dataNavModel.folderPathDirty(false);
            if (dataNavModel.folderPathEmpty()) {
                return Q({
                    valid: false,
                    message: "Click Choose to select file or folder."
                });
            } else if (!dataNavModel.pathMatched()) {
                return Q({
                    valid: false,
                    message: "Path mismatched. " +
                    "Source file or folder must be selected with 'Choose' button. Selected file / folder can only be modified by adding dynamic variables, e.g." +
                    "{year},{month},{day},{custom}"
                });
            } else {
                return Q({
                    valid: true,
                    message: ""
                });
            }
        },
        valid: dataNavModel.folderPathDirty
    };
}

function getDestinationPathValidateable(dataNavModel: DataNavModel): Validation.IValidatable {
    return {
        isValid: () => {
            dataNavModel.folderPathDirty(false);
            if (dataNavModel.folderPathEmpty()) {
                return Q({
                    valid: false,
                    message: "Folder path cannot be empty - copying to root folder is not supported."
                });
            } else {
                return Q(dataNavModel.containerValid());
            }
        },
        valid: dataNavModel.folderPathDirty
    };
}

function getSourceLocationValidateable(dataNavModel: DataNavModel): Validation.IValidatable {
    if (dataNavModel.tableListSource()) {
        if (dataNavModel.useTableList()) {
            return dataNavModel.tableListValidateable;
        } else {
            return dataNavModel.customQueryTable;
        }
    } else {
        return getSourceFolderPathValidateable(dataNavModel);
    }
}

export function createSourceDatasetWizardStep(sourceNavModel: DataNavModel, areaName: string): Wizard.IWizardStep {
    let wizardStep: Wizard.IWizardStep = {
        name: Constants.source,
        displayText: "Source",
        subheaderText: sourceNavModel.subheaderText,
        substeps: [
            {
                name: Constants.dataType,
                displayText: "Connection",
                groupId: "ConnectionGroup",
                template: dataSourcesTemplate.replace("%%LINKED_SERVICES_GRID%%", linkedServicesGridTemplate),
                viewModel: sourceNavModel.dataTypeViewModel,
                useCustomErrorMessage: true,
                validateable: sourceNavModel.dataTypeViewModel.validatable,
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.source, Constants.dataType);
                    return null;
                },
                onNext: () => {
                    if (sourceNavModel.dataTypeViewModel.useExistingDataset()) {
                        return sourceNavModel.dataTypeViewModel.existingDatasetViewModel.onNext();
                    }
                    sourceNavModel.partitions([]);
                    return null;
                }
            },
            {
                name: Constants.connection,
                displayText: "Connection",
                groupId: "ConnectionGroup",
                template: connectionTemplate,
                viewModel: sourceNavModel,
                cloacked: ko.pureComputed(() => {
                    return sourceNavModel.dataTypeViewModel.groupType() !== DataTypeViewModel.GroupType.newDataStore;
                }),
                validateable: sourceNavModel.connectionValidatable,
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.source, Constants.connection);
                    sourceNavModel.newLinkedServiceName.value(FactoryEntities.getUniqueName("InputLinkedService"));
                    return null;
                }
            },
            {
                name: "LinkedServiceProperties",
                displayText: "Linked Service Properties",
                groupId: "ConnectionGroup",
                template: linkedServicePropertiesTemplate,
                viewModel: sourceNavModel.dataTypeViewModel,
                cloacked: ko.pureComputed(() => {
                    return !sourceNavModel.dataTypeViewModel.useExistingLinkedService();
                })
            },
            {
                name: Constants.location,
                displayText: "Dataset",
                groupId: "DatasetGroup",
                template: sourceNavModel.locationTemplate,
                viewModel: sourceNavModel,
                cloacked: sourceNavModel.dataTypeViewModel.useExistingDataset,
                validateable: ko.computed(() => {
                    return getSourceLocationValidateable(sourceNavModel);
                }),
                useCustomErrorMessage: true,
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.source, Constants.location);
                    sourceNavModel.renderLocation();
                    return null;
                }
            },
            {
                name: Constants.fileFormat,
                displayText: "Dataset",
                groupId: "DatasetGroup",
                template: fileFormatTemplate.replace(/%%PREVIEWANDSCHEMA%%/, DataNavModel.previewAndSchemaTemplate),
                viewModel: sourceNavModel,
                cloacked: ko.pureComputed(() => {
                    return sourceNavModel.tableListSource() || sourceNavModel.binaryCopySource() || sourceNavModel.dataTypeViewModel.useExistingDataset();
                }),
                validateable: ko.observable(sourceNavModel.fileFormatDefinedValidateable),
                useCustomErrorMessage: true,
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.source, Constants.fileFormat);
                    /* tslint:disable:no-any */
                    return <any>sourceNavModel.loadAndParseBlob();
                    /* tslint:enable:no-any */
                }
            },
            {
                name: Constants.dateTimeColumns,
                displayText: "Dataset",
                groupId: "DatasetGroup",
                template: dateTimeColumnsTemplate.replace(/%%PREVIEWANDSCHEMA%%/, DataNavModel.previewAndSchemaTemplate)
                    .replace(/%%CUSTOMQUERY%%/, DataNavModel.customQueryTemplate),
                viewModel: sourceNavModel,
                cloacked: ko.computed(() => {
                    return !sourceNavModel.tableListSource() || !sourceNavModel.useTableList() || sourceNavModel.isOneTimePipeline ||
                        sourceNavModel.dataTypeViewModel.groupType() === DataTypeViewModel.GroupType.existingDataset;
                }),
                useCustomErrorMessage: true,
                validateable: sourceNavModel.timeBasedFilterValidateable,
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.source, Constants.dateTimeColumns);
                    return null;
                }
            },
            // {
            //    name: Constants.datasetProperties,
            //    displayText: "Properties",
            //    template: PowerCopyTool.datesetPropertiesTemplate,
            //    viewModel: datasetNavModel,
            //    validateable: datasetNavModel.datasetPropertiesValidateable,
            //    onLoad: () => {
            //        datasetNavModel.setDatasetDefaultProperties();
            //        return null;
            //    }
            // }
        ]
    };

    return wizardStep;
}

// TODO Add support for wizard step complete callback, so as to avoid putting stuff required for a step in next step's onForwardLoad.
export function createDestinationDatasetWizardStep(destinationNavModel: DataNavModel, sourceNavModel: DataNavModel, inputTables: KnockoutObservableArray<Common.IADFInputTable>,
    destinationTableViewModels: KnockoutObservableArray<DestinationTableViewModelModule.DestinationTableViewModel>,
    performanceSettingsViewModel: PerfSettings.PerformancesSettingsViewModel,
    areaName: string): Wizard.IWizardStep {

    let columnMappingViewModel = ko.observable<DestinationTableViewModelModule.DestinationTableViewModel>();
    let destinationColumnMappingViewModel = new DestinationColumnMappingViewModel(destinationTableViewModels, columnMappingViewModel);
    let tableMappingValidateable = ko.observable<Validation.IValidatable>();
    let columnMappingValidateable = ko.observable<Validation.IValidatable>();
    destinationTableViewModels.subscribe(destTableViewModels => {
        if (tableMappingValidateable()) {
            tableMappingValidateable().dispose();
        }
        tableMappingValidateable(Common.ValidateableMerge(destTableViewModels.map(vm => vm.tableMappingValidateable), null, "One or more table destinations have not been configured"));
        if (columnMappingValidateable()) {
            columnMappingValidateable().dispose();
        }
        columnMappingValidateable(Common.ValidateableMerge(destTableViewModels.map(vm => vm.columnMappingValidateable), null, "Schema has not been mapped for one or more tables"));
    });

    let wizardStep: Wizard.IWizardStep = {
        name: Constants.destination,
        displayText: "Destination",
        subheaderText: destinationNavModel.subheaderText,
        substeps: [
            {
                name: Constants.dataType,
                displayText: Constants.connection,
                groupId: "ConnectionGroup",
                template: dataSourcesTemplate.replace("%%LINKED_SERVICES_GRID%%", linkedServicesGridTemplate),
                viewModel: destinationNavModel.dataTypeViewModel,
                useCustomErrorMessage: true,
                validateable: destinationNavModel.dataTypeViewModel.validatable,
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.destination, Constants.dataType);
                    inputTables.removeAll();
                    let tableName = sourceNavModel.dataTypeViewModel.useExistingDataset() ?
                        sourceNavModel.dataTypeViewModel.existingDatasetViewModel.selectedDataset().model.name : "";

                    if (!sourceNavModel.tableListSource()) {
                        destinationNavModel.setSourceInfo({
                            isFileSource: true,
                            folder: sourceNavModel.resultingFolderPath(),
                            file: sourceNavModel.resultingFileName(),
                            partitions: sourceNavModel.partitions(),
                            isBinaryCopy: sourceNavModel.binaryCopySource(),
                            multiTable: false
                        });
                        inputTables.push({
                            adfTableName: CommonWizardPage.createNewBox(tableName),
                            columns: sourceNavModel.schema(),
                            partitions: sourceNavModel.partitions(),
                            dateColumnName: undefined,
                            fileName: sourceNavModel.resultingFileName(),
                            folderPath: sourceNavModel.resultingFolderPath(),
                            sqlTableName: "Blob path: " + sourceNavModel.resultingFolderPath(),
                            sizeValidation: sourceNavModel.sizeValidation(),
                            fileFormat: sourceNavModel.fileFormatViewModel.getProperties(),
                            copyRecursive: sourceNavModel.recursiveCopy(),
                            externalData: sourceNavModel.getExternalDataSettings(),
                            readerQuery: undefined,
                            dataType: sourceNavModel.dataType()
                        });
                    } else {
                        // TODO paverma Handle the resultingSourceTables value.
                        sourceNavModel.resultingSourceTables().forEach(table => {
                            inputTables.push({
                                adfTableName: CommonWizardPage.createNewBox(tableName),
                                columns: table.resultingSchema(),
                                partitions: undefined,
                                dateColumnName: table.selectedDateColumn(),
                                fileName: table.tableName,
                                folderPath: undefined,
                                sqlTableName: table.tableName,
                                sizeValidation: sourceNavModel.sizeValidation(),
                                fileFormat: sourceNavModel.fileFormatViewModel.getProperties(),
                                copyRecursive: undefined,
                                externalData: sourceNavModel.getExternalDataSettings(),
                                readerQuery: table.resultingQuery(),
                                dataType: sourceNavModel.dataType()
                            });
                        });
                        destinationNavModel.setSourceInfo({
                            isFileSource: false,
                            folder: "",
                            file: inputTables()[0].fileName,
                            partitions: [],
                            isBinaryCopy: false,
                            multiTable: inputTables().length > 1
                        });
                    }
                    return null;
                }
            },
            {
                name: Constants.connection,
                displayText: "Connection",
                groupId: "ConnectionGroup",
                template: connectionTemplate,
                viewModel: destinationNavModel,
                validateable: destinationNavModel.connectionValidatable,
                cloacked: ko.pureComputed(() => {
                    return destinationNavModel.dataTypeViewModel.useExistingLinkedService() || destinationNavModel.dataTypeViewModel.useExistingDataset();
                }),
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.destination, Constants.connection);
                    destinationNavModel.newLinkedServiceName.value(FactoryEntities.getUniqueName("OutputLinkedService"));
                    return null;
                }
            },
            {
                name: "LinkedServiceProperties",
                displayText: "Linked Service Properties",
                groupId: "ConnectionGroup",
                template: linkedServicePropertiesTemplate,
                viewModel: destinationNavModel.dataTypeViewModel,
                cloacked: ko.pureComputed(() => {
                    return !destinationNavModel.dataTypeViewModel.useExistingLinkedService();
                })
            },
            {
                name: Constants.tableLocation,
                displayText: "Dataset",
                groupId: "DatasetGroup",
                template: destinationNavModel.locationTemplate,
                validateable: tableMappingValidateable,
                useCustomErrorMessage: true,
                viewModel: destinationColumnMappingViewModel,
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.destination, Constants.tableLocation);

                    destinationTableViewModels.removeAll();
                    let maxWidth = 0;
                    inputTables().forEach(inputTable => {
                        destinationTableViewModels.push(new DestinationTableViewModelModule.DestinationTableViewModel(inputTable, destinationNavModel));
                        if (inputTable.sqlTableName.length > maxWidth) {
                            maxWidth = inputTable.sqlTableName.length;
                        }
                    });
                    destinationColumnMappingViewModel.sourceTableTextWidth(Common.textLenToPx(maxWidth));

                    columnMappingViewModel(destinationTableViewModels()[0]);
                    destinationTableViewModels()[0].selectedForColumnMapping(true);

                    destinationNavModel.renderLocation();
                    return null;
                },
                cloacked: ko.pureComputed(() => {
                    return !destinationNavModel.tableListSource() || destinationNavModel.dataTypeViewModel.useExistingDataset();
                })
            },
            {
                name: Constants.hierarchicalLocation,
                displayText: "Dataset",
                groupId: "DatasetGroup",
                template: destinationNavModel.locationTemplate,
                viewModel: destinationNavModel,
                validateable: ko.observable(getDestinationPathValidateable(destinationNavModel)),
                useCustomErrorMessage: true,
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.destination, Constants.hierarchicalLocation);
                    destinationNavModel.renderLocation();
                    return null;
                },
                cloacked: ko.pureComputed(() => {
                    return destinationNavModel.tableListSource() || destinationNavModel.dataTypeViewModel.useExistingDataset();
                })
            },
            {
                name: Constants.columnMapping,
                displayText: "Column mapping",
                groupId: "DatasetGroup",
                template: columnMappingTemplate,
                viewModel: destinationColumnMappingViewModel,
                validateable: columnMappingValidateable,
                useCustomErrorMessage: true,
                cloacked: ko.computed(() => !destinationNavModel.tableListSource()),
                onForwardLoad: () => {
                    destinationTableViewModels().forEach(vm => {
                        vm.onColumnMappingLoaded();
                    });
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.destination, Constants.columnMapping);
                    return null;
                }
            },
            {
                name: Constants.fileFormat,
                displayText: "Dataset",
                groupId: "DatasetGroup",
                template: fileFormatTemplate.replace(/%%PREVIEWANDSCHEMA%%/, DataNavModel.previewAndSchemaTemplate),
                viewModel: destinationNavModel,
                cloacked: ko.pureComputed(() => {
                    return destinationNavModel.tableListSource() || sourceNavModel.binaryCopySource()
                        || destinationNavModel.dataTypeViewModel.useExistingDataset();
                }),
                onForwardLoad: () => {
                    CommonWizardPage.logTelemetryEvent(areaName, Constants.destination, Constants.fileFormat);
                    return null;
                }
            }
            // {
            //    name: Constants.datasetProperties,
            //    displayText: "Properties",
            //    template: PowerCopyTool.datesetPropertiesTemplate,
            //    viewModel: destinationNavModel,
            //    onLoad: () => {
            //        destinationNavModel.setDatasetDefaultProperties();
            //        return null;
            //    }
            // }
        ]
    };

    let performanceStep: Wizard.IWizardStep = {
        name: Constants.performance,
        displayText: "Performance",
        template: performanceTemplate,
        viewModel: performanceSettingsViewModel,
        cloacked: ko.computed(() => !performanceSettingsViewModel.perfSettingsEnabled()),
        validateable: performanceSettingsViewModel.validateable
    };
    if (localStorage["performanceSettingsEnabled"]) {
        wizardStep.substeps.push(performanceStep);
    }
    return wizardStep;
}

class DestinationColumnMappingViewModel {
    public sourceTableTextWidth = ko.observable<string>();

    private destinationTableViewModels: KnockoutObservableArray<DestinationTableViewModelModule.DestinationTableViewModel>;
    private columnMappingViewModel: KnockoutObservable<DestinationTableViewModelModule.DestinationTableViewModel>;

    constructor(destinationTableViewModels: KnockoutObservableArray<DestinationTableViewModelModule.DestinationTableViewModel>,
        columnMappingViewModel: KnockoutObservable<DestinationTableViewModelModule.DestinationTableViewModel>) {
        this.destinationTableViewModels = destinationTableViewModels;
        this.columnMappingViewModel = columnMappingViewModel;
    }

    public selectForColumnMapping(destTableViewModel: DestinationTableViewModelModule.DestinationTableViewModel) {
        this.destinationTableViewModels().forEach(destVm => {
            destVm.selectedForColumnMapping(destVm === destTableViewModel);
        });
        this.columnMappingViewModel(destTableViewModel);
    }

    public expandDestinationTable(destTableViewModel: DestinationTableViewModelModule.DestinationTableViewModel) {
        if (destTableViewModel.expandedInTableMappingList()) {
            destTableViewModel.expandedInTableMappingList(false);
        } else {
            this.destinationTableViewModels().forEach(destVm => {
                destVm.expandedInTableMappingList(destVm === destTableViewModel);
            });
        }
    }
}
/* tslint:enable:align */
