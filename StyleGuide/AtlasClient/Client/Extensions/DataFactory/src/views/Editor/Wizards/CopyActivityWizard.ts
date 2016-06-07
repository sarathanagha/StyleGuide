/// <reference path="../../../references.d.ts" />

/// <amd-dependency path="css!../../PowercopyTool/css/PowercopyTool.css" />

import AuthoringOverlay = require("./AuthoringOverlay");
import AppContext = require("../../../scripts/AppContext");
import Wizard = require("../../../bootstrapper/WizardBinding");
import DataNavModel = require("../../PowercopyTool/DataNavModel");
import PerformanceSettings = require("../../PowercopyTool/PerformanceSettings");
import DatasetWizardPage = require("../../Shared/DatasetWizardPage");
import FactoryEntities = require("../../PowercopyTool/FactoryEntities");
import Constants = require("../../PowercopyTool/Constants");
import ActivityPropertiesWizardPage = require("../../Shared/ActivityPropertiesWizardPage");
import Common = require("../../PowercopyTool/Common");
import DestinationTableViewModelModule = require("../../PowercopyTool/DestinationTableViewModel");
import {EntityStore, IActivityEntity} from "../../../scripts/Framework/Model/Authoring/EntityStore";
import {CopyActivityEntity} from "../../../scripts/Framework/Model/Authoring/ActivityEntity";
import {EncodableType} from "../../../scripts/Framework/Model/Contracts/BaseEncodable";
import CommonWizardPage = require("../../Shared/CommonWizardPage");
import CopySummaryWizardPage = require("../../Shared/CopySummaryWizardPage");
import Summary = require("../../PowercopyTool/Summary");
import GraphContracts = require("../../Editor/GraphContracts");
import CanvasCopyActivity = require("../../Editor/GraphExtensions/Activities/CopyActivity");
import CanvasTable = require("../../Editor/GraphExtensions/Tables");
import DatasetTool = require("./DatasetTool");

const defaultTitle: string = "Copy activity settings";

// TODO paverma Enable rehydration for copy wizard.
export class CopyWizard extends AuthoringOverlay.AuthoringOverlay {
    public static className = "CopyWizard";
    private copySummaryViewModel: CopySummaryWizardPage.CopySummaryViewModel;
    private editDeferred: Q.Deferred<GraphContracts.IExtensionPiece[]>;

    // TODO paverma Figure out a better way to keep these initializations in sync with powercopy tool.
    constructor(pipelineProperties: CommonWizardPage.PipelineProperties, deferred: Q.Deferred<GraphContracts.IExtensionPiece[]>, context?: Object) {
        super(AuthoringOverlay.OverlayType.WIZARD, defaultTitle);
        this.editDeferred = deferred;

        let splitFactoryId = AppContext.AppContext.getInstance().splitFactoryId();
        // Load factory entities.
        FactoryEntities.factoryName = splitFactoryId.dataFactoryName;
        FactoryEntities.resourceGroup = splitFactoryId.resourceGroupName;
        FactoryEntities.subscriptionId = splitFactoryId.subscriptionId;
        FactoryEntities.loadEntities();
        FactoryEntities.loadFactory();

        let copyActivityProperties = new CommonWizardPage.CopyActivityProperties();
        let activityPropertiesWizardPage = new ActivityPropertiesWizardPage.ActivityPropertiesWizardPageViewModel(null, copyActivityProperties, pipelineProperties);

        let taskPropertiesSubheader = ko.pureComputed(() => {
            return pipelineProperties.isOneTimePipeline() ? ClientResources.oneTimeCopySubheaderText : ClientResources.recurringCopySubheaderText;
        });

        let sourceNavModel = new DataNavModel.DataNavModel(true, pipelineProperties.isOneTimePipeline);
        let destinationNavModel = new DataNavModel.DataNavModel(false, pipelineProperties.isOneTimePipeline);
        let perfViewModel = new PerformanceSettings.PerformancesSettingsViewModel(sourceNavModel, destinationNavModel);

        let inputTables = ko.observableArray<Common.IADFInputTable>();
        let outputTables = ko.observableArray<Common.IADFOutputTable>();
        let destinationTableViewModels = ko.observableArray<DestinationTableViewModelModule.DestinationTableViewModel>();

        pipelineProperties.activePeriod.subscribe((currentValue) => {
            sourceNavModel.setDateRange(currentValue);
        });
        sourceNavModel.setDateRange(pipelineProperties.activePeriod());
        ko.computed(() => {
            destinationNavModel.usePrefix(sourceNavModel.usePrefix());
        });

        this.copySummaryViewModel = new CopySummaryWizardPage.CopySummaryViewModel(sourceNavModel, destinationNavModel, inputTables,
            outputTables, pipelineProperties, copyActivityProperties);

        // TODO paverma The validation has to consider the fact that there might be other activities with same name in the pipeline.
        this.overlayContent = new Wizard.Wizard({
            steps: [
                {
                    name: Constants.taskProperties,
                    displayText: "Properties",
                    subheaderText: taskPropertiesSubheader,
                    template: ActivityPropertiesWizardPage.template,
                    validateable: ko.observable(copyActivityProperties.activityName),
                    viewModel: activityPropertiesWizardPage,
                    onForwardLoad: () => {
                        // TODO paverma Add logic to create a new name.
                        // TODO paverma Log telemetry.
                        return null;
                    }
                },
                DatasetWizardPage.createSourceDatasetWizardStep(sourceNavModel, CopyWizard.className),
                DatasetWizardPage.createDestinationDatasetWizardStep(destinationNavModel, sourceNavModel, inputTables, destinationTableViewModels, perfViewModel, CopyWizard.className),
                CopySummaryWizardPage.createCopySummaryWizardPage(this.copySummaryViewModel, destinationTableViewModels,
                    Summary.createCopyActivitySummary, CopyWizard.className)
            ]
        }, () => {
            this.updateNodesOnCanvas();
            this.hideOverlay();
            return;
        });
        // TODO paverma reject the promise if the modal is closed without completing the wizard.
    }

    public updateNodesOnCanvas(): void {
        let canvasPieces: GraphContracts.IExtensionPiece[] = [];
        let numberOfActivities = this.copySummaryViewModel.inputTables().length;
        for (let i = 0; i < numberOfActivities; i++) {
            let input = this.copySummaryViewModel.inputTables()[i], output = this.copySummaryViewModel.outputTables()[i];
            let copyProperties = this.copySummaryViewModel.copyActivityProperties;
            // TODO paverma Fix name collisions.
            let name = copyProperties.activityName.value() + (i === 0 ? "" : i.toString());

            let activityNodeConfig: CanvasCopyActivity.CopyActivityNode;
            let entityStore: EntityStore = AppContext.AppContext.getInstance().authoringEntityStore;
            let entitySearchResult = entityStore.getEntityByNameAndType<IActivityEntity>(name, EncodableType.ACTIVITY);
            let activityEntity: IActivityEntity = entitySearchResult ? entitySearchResult.value : null;
            if (!activityEntity) {
                activityEntity = new CopyActivityEntity();
                activityEntity.model.name(name);
            }

            activityNodeConfig = new CanvasCopyActivity.CopyActivityNode(activityEntity);

            let inputEntity = DatasetTool.createNewDatasetEntity();
            inputEntity.model.name(input.adfTableName.value());
            let inputNodeConfig = new CanvasTable.TableNode(inputEntity);

            let outputEntity = DatasetTool.createNewDatasetEntity();
            outputEntity.model.name(output.adfTableName.value());
            let outputNodeConfig = new CanvasTable.TableNode(outputEntity);

            let canvasPiece: GraphContracts.IExtensionPiece = {
                inputConfigs: [inputNodeConfig],
                outputConfigs: [outputNodeConfig],
                mainConfig: activityNodeConfig
            };
            canvasPieces.push(canvasPiece);
        }
        this.editDeferred.resolve(canvasPieces);
    }
}
