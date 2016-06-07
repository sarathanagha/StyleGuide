
import FactoryEntities = require("../PowercopyTool/FactoryEntities");
import FormFields = require("../../bootstrapper/FormFields");
import EntityType = require("../PowercopyTool/EntityType");
import {Telemetry} from "../../_generated/Framework";
import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");
import Pipeline = require("../../scripts/Framework/Model/Contracts/Pipeline");
import Common = require("../PowercopyTool/Common");
import JQueryUIBindingHandlers = require("../../bootstrapper/JQueryUIBindings");
import ActivityContracts = require("../../scripts/Framework/Model/Contracts/Activity");
import {callIfKoHasValue} from "../../scripts/Framework/Util/Util";

let tableNameValidation = FactoryEntities.nameAvailableValidation(EntityType.table);
export function createNewBox(name: string): FormFields.ValidatedBoxViewModel<string> {
    let newBox = new FormFields.ValidatedBoxViewModel<string>({ label: "", validations: [tableNameValidation], defaultValue: name });
    return newBox;
}

export function logTelemetryEvent(areaName: string, step: string, substep?: string): void {
    Telemetry.instance.logEvent(
        new Telemetry.Event(AppContext.AppContext.getInstance().factoryId(),
            !substep ? "{0}-{1}".format(areaName, step) : "{0}-{1}-{2}".format(areaName, step, substep),
            Telemetry.Action.open
        )
    );
}

export class PipelineProperties {
    public activePeriod: KnockoutComputed<Framework.Datetime.IDateRange>;
    public pipelineMode: KnockoutObservable<string>;
    public pipelineName = new FormFields.ValidatedBoxViewModel<string>({
        label: "Task name",
        infoBalloon: "Name of the copy task (Data Factory pipeline) that will copy data from a source data store to a destination data store.",
        validations: [name => Common.requiredValidation(name),
            Common.regexValidation(FactoryEntities.entityNameRegex),
            FactoryEntities.nameAvailableValidation(EntityType.pipeline)
        ],
        required: true
    });
    public description = ko.observable<string>();
    public startEnd: JQueryUIBindingHandlers.IDatetimeRangeBindingValueAccessor = null;

    public isOneTimePipeline = ko.pureComputed(() => {
        return this.pipelineMode() === Pipeline.PipelineMode.OneTime;
    });

    constructor(activePeriod: Framework.Datetime.IDateRange, pipelineMode: string) {
        // TODO paverma Filling these with dummy values. These would be filled in by another form.
        this.activePeriod = Framework.Datetime.getDateRangeObservable(activePeriod);
        this.pipelineMode = ko.observable<string>(pipelineMode);

        this.startEnd = JQueryUIBindingHandlers.DatetimeRangeBindingHandler.getInitialValueAccessor();
        this.startEnd.currentValue = this.activePeriod;
    }
}

export class SchedulerProperties {
    public frequency = new FormFields.ValidatedSelectBoxViewModel(ko.observableArray(Common.recurenceOptions), {
        label: ClientResources.recurringPatternText,
        defaultValue: "Day"
    });
    public intervalOptions = ko.observableArray<FormFields.IOption>();
    public interval = new FormFields.ValidatedSelectBoxViewModel<number>(this.intervalOptions, {
        label: ""
    });
    public timeModifier: KnockoutComputed<string>;
    public recurrenceString: KnockoutComputed<string>;

    constructor() {
        ko.computed(() => {
            let options: FormFields.IOption[] = [];
            let intervalRange = Common.intervalRanges[this.frequency.value()];
            for (let i = intervalRange.min; i <= intervalRange.max; i++) {
                options.push({ value: i.toString(), displayText: i.toString() });
            }
            this.intervalOptions(options);
        });

        this.timeModifier = ko.computed(() => {
            let modifier = this.frequency.value().toLowerCase();
            if (this.interval.value() > 1) {
                modifier += "s";
            }
            return modifier;
        });

        this.recurrenceString = ko.pureComputed(() => {
            return ClientResources.everyXText.format(
                (this.interval.value() > 1 ? (this.interval.value() + " ") : "") +
                this.timeModifier()
            );
        });
    }
}

export class ActivityProperties extends SchedulerProperties {
    // Basic properties
    public activityName = new FormFields.ValidatedBoxViewModel<string>({
        label: "Activity name",
        validations: [name => Common.requiredValidation(name),
            Common.regexValidation(FactoryEntities.entityNameRegex)
        ],
        required: true
    });

    public activityDescription = ko.observable<string>();
    public activityDescriptionLabel = ClientResources.Description;

    // Advanced properties
    public retry = new FormFields.ValidatedBoxViewModel<number>({
        label: "Retry",
        infoBalloon: "Retry count",
        defaultValue: 3
    });
    public concurrency = new FormFields.ValidatedBoxViewModel<number>({
        label: "Concurrency",
        infoBalloon: "Number of concurrent activity run executions",
        defaultValue: 1
    });
    public timeout = new FormFields.ValidatedBoxViewModel<string>({
        label: "Timeout",
        infoBalloon: "Timeout value in hours",
        defaultValue: "01:00:00"
    });
    public executionPriorityOrder = new FormFields.ValidatedBoxViewModel<string>({
        label: "Execution priority order",
        infoBalloon: "Defines priority of executions for activity runs",
        defaultValue: "NewestFirst"
    });
    public delay = new FormFields.ValidatedBoxViewModel<string>({
        label: "Delay",
        infoBalloon: "Delay time",
        defaultValue: "00:00:00"
    });
    public longRetry = new FormFields.ValidatedBoxViewModel<number>({
        label: "Long retry",
        infoBalloon: "Long retry time",
        defaultValue: 0
    });
    public longRetryInterval = new FormFields.ValidatedBoxViewModel<string>({
        label: "Long retry interval",
        infoBalloon: "Long retry interval",
        defaultValue: "00:00:00"
    });

    constructor(activity?: MdpExtension.DataModels.Activity) {
        super();
        if (activity) {
            callIfKoHasValue(activity.name, this.activityName.value);
            callIfKoHasValue(activity.description, this.activityDescription);

            callIfKoHasValue(activity.scheduler().frequency, this.frequency.value);
            callIfKoHasValue(activity.scheduler().interval, this.interval.value);

            callIfKoHasValue(activity.policy().retry, this.retry.value);
            callIfKoHasValue(activity.policy().concurrency, this.concurrency.value);
            callIfKoHasValue(activity.policy().timeout, this.timeout.value);
            callIfKoHasValue(activity.policy().executionPriorityOrder, this.executionPriorityOrder.value);
            callIfKoHasValue(activity.policy().delay, this.delay.value);
            callIfKoHasValue(activity.policy().longRetry, this.longRetry.value);
            callIfKoHasValue(activity.policy().longRetryInterval, this.longRetryInterval.value);

            if (ko.isObservable(activity.type) && ActivityContracts.activityTypeToNameInfoResourceMap[activity.type()]) {
                this.activityName.infoBalloonText = ActivityContracts.activityTypeToNameInfoResourceMap[activity.type()];
            }
        }
    }
}

export class CopyActivityProperties extends ActivityProperties {
    constructor() {
        super();
        // Special case for Copy activity.
        this.activityName.infoBalloonText = ActivityContracts.activityTypeToNameInfoResourceMap[ActivityContracts.ActivityType.copyActivity];
    }
}
