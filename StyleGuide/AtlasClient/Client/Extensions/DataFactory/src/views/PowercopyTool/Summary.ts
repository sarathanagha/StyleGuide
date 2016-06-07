/* tslint:disable:no-unused-variable */
import CopyTool = require("./PowercopyTool");
import DataNavModelModule = require("./DataNavModel");
import DataNavModel = DataNavModelModule.DataNavModel;
import Configuration = require("./Configuration");
import FormFields = require("../../bootstrapper/FormFields");
import Validation = require("../../bootstrapper/Validation");
import Common = require("./Common");
/* tslint:enable:no-unused-variable */
import CopySummaryWizardPage = require("../Shared/CopySummaryWizardPage");
import CommonWizardPage = require("../Shared/CommonWizardPage");
import DataTypeViewModel = require("./DataTypeViewModel");
import Logger = require("./Logger");

let logger = Logger.getPowercopyToolLogger("Summary");

enum EditableOptions {
    NotEditable, Text, Combo, Observalble
};

interface ISummarySectionViewModel {
    navModel: DataNavModel;
    locationSummary: KnockoutObservable<string>;
    datasetsDetailVisible: KnockoutObservable<boolean>;
    toggleDatasetsDetailVisible: () => void;
    tables: KnockoutObservableArray<Common.IADFTable>;
}

export class ExpanderViewModel {
    private expanded = ko.observable(false);
    public toggleExpamd() {
        this.expanded(!this.expanded());
    }
}

export interface ISummaryLine<T> {
    key: string;
    value: KnockoutObservableBase<T>;
    expandable: boolean;
    editable: EditableOptions;
    observable?: KnockoutObservable<string>;
    validateableBox?: FormFields.ValidatedBoxViewModel<T>;
    expander?: ExpanderViewModel;
    calloutHtml?: string;
    customData?: Object;
}

export interface ISummarySection {
    name: string;
    editMode: KnockoutObservable<boolean>;
    lines: ISummaryLine<Object>[];
}

interface ISummaryViewModel {
    sourceNavModel: DataNavModel;
    destinationNavModel: DataNavModel;
    inputTables: KnockoutObservableArray<Common.IADFInputTable>;
    outputTables: KnockoutObservableArray<Common.IADFOutputTable>;
    sourceSummaryHeaderTable: KnockoutObservable<ISummaryLine<Object>>;
    destinationSummaryHeaderTable: KnockoutObservable<ISummaryLine<Object>>;
    pipelineProperties: CommonWizardPage.PipelineProperties;
    copyActivityProperties: CommonWizardPage.CopyActivityProperties;
}

function createSummaryLineFromFormField(formField: FormFields.ValidatedBoxViewModel<Object>, isEditable: boolean): ISummaryLine<Object> {
    let editable = isEditable ?
        (formField instanceof FormFields.ValidatedSelectBoxViewModel ? EditableOptions.Combo : EditableOptions.Text) :
        EditableOptions.NotEditable;
    return {
        key: formField.options.label,
        editable: editable,
        value: formField.value,
        validateableBox: formField,
        expandable: false
    };
}

function createIOSummarySection(viewModel: ISummaryViewModel, datamodel: DataNavModel): ISummarySection {
    let section: ISummarySection = {
        name: datamodel.isSource ? "Source" : "Destination",
        editMode: ko.observable(false),
        lines: []
    };

    let isEditable = !datamodel.dataTypeViewModel.useExistingDataset();

    switch (datamodel.dataTypeViewModel.groupType()) {
        case DataTypeViewModel.GroupType.newDataStore:
            section.lines.push(
                {
                    key: "Connection",
                    value: ko.observable(datamodel.getConnectionSummary()),
                    editable: EditableOptions.NotEditable,
                    expandable: false
                }
            );
            section.lines.push(createSummaryLineFromFormField(datamodel.newLinkedServiceName, isEditable));
            break;
        case DataTypeViewModel.GroupType.existingLinkedService:
            section.lines.push({
                key: "Existing Linked Service",
                value: datamodel.dataTypeViewModel.selectedLinkedServiceName,
                editable: EditableOptions.NotEditable,
                expandable: false
            });
            break;
        case DataTypeViewModel.GroupType.existingDataset:
            // push nothing, as user only needs to be aware of the dataset that is about to be pushed.
            break;
        default:
            logger.logError("Unhandled group type {0} in PowercopyTool's Summary".format(datamodel.dataTypeViewModel.groupType()));
            break;
    }

    let locationValue: string;
    let prefix: KnockoutObservable<string>;
    let tablesList: string[];
    let calloutHtml = "";
    let blobPathDispalyMaxLen = 12;
    if (!datamodel.tableListSource()) {
        if (datamodel.resultingFolderPath().length <= blobPathDispalyMaxLen) {
            locationValue = datamodel.resultingFolderPath();
        } else {
            locationValue = datamodel.resultingFolderPath().substr(0, blobPathDispalyMaxLen) + "...";;
            calloutHtml = `<div>${datamodel.resultingFolderPath()}</div>`;
        }
    } else {
        if (datamodel.usePrefix()) {
            prefix = datamodel.datasetPrefix.value;
        }
        let tables: Common.IADFTable[] = datamodel.isSource ? viewModel.inputTables() : viewModel.outputTables();
        locationValue = tables.length + " table(s) ";
        tablesList = tables.map(t => t.sqlTableName);
        tablesList.forEach(tbl => {
            calloutHtml += `<div>${tbl}</div>`;
        });
        calloutHtml = `<div style="max-height:100px;overflow:auto">${calloutHtml}</div>`;
    }

    switch (datamodel.dataTypeViewModel.groupType()) {
        case DataTypeViewModel.GroupType.newDataStore:
        case DataTypeViewModel.GroupType.existingLinkedService:
            if (prefix) {
                section.lines.push(createSummaryLineFromFormField(datamodel.datasetPrefix, isEditable));
            } else {
                section.lines.push(createSummaryLineFromFormField(datamodel.datasetName, isEditable));
            }
            break;
        case DataTypeViewModel.GroupType.existingDataset:
            section.lines.push({
                key: ClientResources.existingDatasetNameLabel,
                value: datamodel.datasetName.value,
                editable: EditableOptions.NotEditable,
                expandable: false
            });
            break;
        default:
            break;
    }

    let location: ISummaryLine<Object> = {
        key: Configuration.copyConfig[datamodel.dataType()].locationName,
        value: ko.observable(locationValue),
        editable: EditableOptions.NotEditable,
        expandable: calloutHtml !== "",
        expander: new ExpanderViewModel(),
        calloutHtml: calloutHtml
    };

    section.lines.push(location);
    section.lines.push(
        {
            key: "Region",
            value: datamodel.runtimeRegionObservable,
            editable: EditableOptions.NotEditable,
            expandable: false
        }
    );

    if (datamodel.isSource) {
        viewModel.sourceSummaryHeaderTable(location);
    } else {
        viewModel.destinationSummaryHeaderTable(location);
    }

    if (datamodel.tableListSource()) {
        section.lines.push(createSummaryLineFromFormField(datamodel.minimumRows, isEditable));
    } else {
        section.lines.push(createSummaryLineFromFormField(datamodel.minimumSizeInMb, isEditable));
    }

    // TODO paverma After api version upgrade, check if the table is marked external and then hide the following properties if it is not.
    if (datamodel.isSource) {
        let incrementalUpdates: string;

        let count = viewModel.inputTables().filter(it => !!it.dateColumnName || !!datamodel.partitions().length).length;
        if (count === 0) {
            incrementalUpdates = "Not enabled";
        } else if (count < viewModel.inputTables().length) {
            incrementalUpdates = "Enabled for " + count + ", not enabled for: " + (viewModel.inputTables().length - count);
        } else {
            incrementalUpdates = "Enabled";
        }
        section.lines.push({
            key: "Incremental updates",
            value: ko.observable(incrementalUpdates),
            editable: EditableOptions.NotEditable,
            expandable: false
        });
        section.lines.push(createSummaryLineFromFormField(datamodel.dataDelay, isEditable));
        section.lines.push(createSummaryLineFromFormField(datamodel.maximumRetry, isEditable));
        section.lines.push(createSummaryLineFromFormField(datamodel.retryInterval, isEditable));
        section.lines.push(createSummaryLineFromFormField(datamodel.retryTimeout, isEditable));
    } else {
        // TODO: idempotency and mapping
    }

    return section;
}

function dateDisplay(date: Date): string {
    return date.toUTCString();
}
/* tslint:disable:no-unused-variable */
function toggleSummarySectionEdit(section: ISummarySection) {
    /* tslint:enable:no-unused-variable */
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

function getCopySettingsSummarySection(copytActivityProperties: CommonWizardPage.CopyActivityProperties): ISummarySection {
    let copySettings: ISummarySection = {
        name: "Copy settings",
        editMode: ko.observable(false),
        lines: []
    };
    // if (viewModel.copyBehaviourRelevant()) {
    //     copySettings.lines.push(createSummaryLineFromFormField(viewModel.copyBehavior));
    // }
    let isEditable = true;      // These corresponds to activity properties, hence should be configurable.
    copySettings.lines.push(createSummaryLineFromFormField(copytActivityProperties.retry, isEditable));
    copySettings.lines.push(createSummaryLineFromFormField(copytActivityProperties.concurrency, isEditable));
    copySettings.lines.push(createSummaryLineFromFormField(copytActivityProperties.timeout, isEditable));
    copySettings.lines.push(createSummaryLineFromFormField(copytActivityProperties.executionPriorityOrder, isEditable));
    copySettings.lines.push(createSummaryLineFromFormField(copytActivityProperties.delay, isEditable));
    copySettings.lines.push(createSummaryLineFromFormField(copytActivityProperties.longRetry, isEditable));
    return copySettings;
}

export function createSummary(viewModel: CopySummaryWizardPage.CopySummaryViewModel): ISummarySection[] {
    let summary: ISummarySection[] = [];
    let propertiesSection: ISummarySection = {
        name: "Properties",
        editMode: ko.observable(false),
        lines: []
    };
    let isEditable = true;      // This corresponds to a new created pipeline name, and hence should be configurable.
    propertiesSection.lines.push(createSummaryLineFromFormField(viewModel.pipelineProperties.pipelineName, isEditable));

    propertiesSection.lines.push(
        {
            key: "Task description",
            value: ko.computed(() => viewModel.pipelineProperties.description() ? viewModel.pipelineProperties.description() : ClientResources.noDescriptionPlaceholder),
            editable: EditableOptions.Observalble,
            observable: viewModel.pipelineProperties.description,
            expandable: false
        });

    /* tslint:disable:align */
    if (!viewModel.pipelineProperties.isOneTimePipeline()) {
        let recurrence = `${Common.recurenceOptions.filter(opt => opt.value === viewModel.copyActivityProperties.frequency.value())[0].displayText},` +
            ` every ${viewModel.copyActivityProperties.interval.value()} ${viewModel.copyActivityProperties.timeModifier()} between `;

        let pipelineStart = dateDisplay(viewModel.pipelineProperties.activePeriod().startDate);
        let pipelineEnd = dateDisplay(viewModel.pipelineProperties.activePeriod().endDate);
        propertiesSection.lines.push({
            key: "Task cadence",
            editable: EditableOptions.NotEditable,
            value: ko.computed(() => `${recurrence} ${pipelineStart} and ${pipelineEnd}`),
            expandable: false,
            customData: {
                recurrence: recurrence,
                startEnd: viewModel.pipelineProperties.startEnd
            }
        });
    };
    /* tslint:enable:align */

    summary.push(propertiesSection);
    summary.push(createIOSummarySection(viewModel, viewModel.sourceNavModel));
    summary.push(createIOSummarySection(viewModel, viewModel.destinationNavModel));
    summary.push(getCopySettingsSummarySection(viewModel.copyActivityProperties));
    return summary;
}

// TODO paverma Fix this to show as activity properties.
export function createCopyActivitySummary(viewModel: CopySummaryWizardPage.CopySummaryViewModel): ISummarySection[] {
    let summary: ISummarySection[] = [];

    let propertiesSection: ISummarySection = {
        name: "Properties",
        editMode: ko.observable(false),
        lines: []
    };
    let isEditable = true;
    propertiesSection.lines.push(createSummaryLineFromFormField(viewModel.copyActivityProperties.activityName, isEditable));
    propertiesSection.lines.push({
        key: viewModel.copyActivityProperties.activityDescriptionLabel,
        value: ko.pureComputed(() => viewModel.copyActivityProperties.activityDescription() ?
            viewModel.copyActivityProperties.activityDescription() : ClientResources.noDescriptionPlaceholder),
        editable: EditableOptions.Observalble,
        observable: viewModel.copyActivityProperties.activityDescription,
        expandable: false
    });

    if (!viewModel.pipelineProperties.isOneTimePipeline()) {
        propertiesSection.lines.push({
            key: ClientResources.recurringPatternText,
            editable: EditableOptions.NotEditable,
            value: viewModel.copyActivityProperties.recurrenceString,
            expandable: false
        });
    }

    summary.push(propertiesSection);
    summary.push(createIOSummarySection(viewModel, viewModel.sourceNavModel));
    summary.push(createIOSummarySection(viewModel, viewModel.destinationNavModel));
    summary.push(getCopySettingsSummarySection(viewModel.copyActivityProperties));
    return summary;
}
