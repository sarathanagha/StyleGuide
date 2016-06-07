/// <reference path="../../references.d.ts" />

import {AuthoringOverlay, OverlayType} from "../Editor/Wizards/AuthoringOverlay";
import {AppContext} from "../../scripts/AppContext";
import FormFields = require("../../bootstrapper/FormFields");
import EntityStore = require("../../scripts/Framework/Model/Authoring/EntityStore");
import Common = require("../PowercopyTool/Common");
import FactoryEntities = require("../PowercopyTool/FactoryEntities");
import ResourceIdUtil = require("../../scripts/Framework/Util/ResourceIdUtil");
import {ActivityProperties} from "../Shared/CommonWizardPage";

export abstract class ActivityTool extends AuthoringOverlay {
    public appContext: AppContext;

    public splitFactoryId: KnockoutComputed<ResourceIdUtil.IDataFactoryId>;

    public activityProperties: ActivityProperties;
    public advancedPropertiesExpanded = ko.observable(false);

    public timeModifier: KnockoutComputed<string>;

    public showScheduler = ko.pureComputed(() => {
        return !AppContext.getInstance().authoringPipelineProperties.isOneTimePipeline();
    });

    protected authoringEntity: EntityStore.IActivityEntity;

    /* tslint:disable:no-unused-variable used in HTML template */
    private _applyClicked = () => {
    /* tslint:enable:no-unused-variable */
        this.hideOverlay();

        // TODO Validation checks, for now we assume all fields are valid.
        this.authoringEntity.model.name(this.activityProperties.activityName.value());
        this.authoringEntity.model.description(this.activityProperties.activityDescription());

        this.authoringEntity.model.scheduler().frequency(this.activityProperties.frequency.value());
        this.authoringEntity.model.scheduler().interval(this.activityProperties.interval.value());

        this.authoringEntity.model.policy().concurrency(this.activityProperties.concurrency.value());
        this.authoringEntity.model.policy().timeout(this.activityProperties.timeout.value());
        this.authoringEntity.model.policy().retry(this.activityProperties.retry.value());
        this.authoringEntity.model.policy().longRetry(this.activityProperties.longRetry.value());
        this.authoringEntity.model.policy().longRetryInterval(this.activityProperties.longRetryInterval.value());
        this.authoringEntity.model.policy().delay(this.activityProperties.delay.value());
        this.authoringEntity.model.policy().executionPriorityOrder(this.activityProperties.executionPriorityOrder.value());

        this.applyClicked();
    };

    constructor(entity: EntityStore.IActivityEntity, overlayType: OverlayType, overlayTitle: string) {
        super(overlayType, overlayTitle);

        this.authoringEntity = entity;
        this.appContext = AppContext.getInstance();

        this.splitFactoryId = AppContext.getInstance().splitFactoryId;

        FactoryEntities.factoryName = this.splitFactoryId().dataFactoryName;
        FactoryEntities.resourceGroup = this.splitFactoryId().resourceGroupName;
        FactoryEntities.subscriptionId = this.splitFactoryId().subscriptionId;

        this.activityProperties = new ActivityProperties(entity.model);

        ko.computed(() => {
            let options: FormFields.IOption[] = [];
            let intervalRange = Common.intervalRanges[this.activityProperties.frequency.value()];
            for (let i = intervalRange.min; i <= intervalRange.max; i++) {
                options.push({ value: i.toString(), displayText: i.toString() });
            }
            this.activityProperties.intervalOptions(options);
        });

        this.timeModifier = ko.computed(() => {
            let modifier = this.activityProperties.frequency.value().toLowerCase();
            if (this.activityProperties.interval.value() > 1) {
                modifier += "s";
            }
            return modifier;
        });
    }

    public abstract applyClicked(): void;
}
