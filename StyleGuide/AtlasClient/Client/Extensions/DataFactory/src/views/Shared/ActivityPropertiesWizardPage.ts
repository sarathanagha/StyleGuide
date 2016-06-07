/// <amd-dependency path="text!./Templates/ActivityPropertiesWizardPage.html" name="activityPropertiesWizardPage" />
/// <amd-dependency path="text!../PowercopyTool/templates/FrequencyIntervalTemplate.html" name="frequencyIntervalTemplate" />

import CommonWizardPage = require("./CommonWizardPage");
import PipelineModel = require("../../scripts/Framework/Model/Contracts/Pipeline");

let activityPropertiesWizardPage: string;
let frequencyIntervalTemplate: string;

export let template: string = activityPropertiesWizardPage;

export interface IActivityPropertiesWizardPageOverrides<T> {
    wizardStepSubtitle?: string;
    template?: string;
    additionalProperties?: T;
}

export class ActivityPropertiesWizardPageViewModel<T> {
    public activityProperties: CommonWizardPage.ActivityProperties;
    public displayCadence = ko.observable<boolean>();
    public frequencyIntervalTemplate = frequencyIntervalTemplate;

    /* tslint:disable:no-unused-variable */
    private wizardStepTitle = ClientResources.Properties;
    /* tslint:enable:no-unused-variable */
    private wizardStepSubtitle = ClientResources.genericActivityWizardSubtitle;

    constructor(overrides: IActivityPropertiesWizardPageOverrides<T>, activityProperties: CommonWizardPage.ActivityProperties,
                pipelineProperties: CommonWizardPage.PipelineProperties) {
        if (overrides && overrides.wizardStepSubtitle) {
            this.wizardStepSubtitle = overrides.wizardStepSubtitle;
        }
        this.activityProperties = activityProperties;

        if (pipelineProperties.pipelineMode() === PipelineModel.PipelineMode.Scheduled) {
            this.displayCadence(true);

        } else {
            this.displayCadence(false);
        }
    }
}
