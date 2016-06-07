import EntityStore = require("../../../../scripts/Framework/Model/Authoring/EntityStore");
import Shared = require("../Shared");
import Framework = require("../../../../_generated/Framework");

export let logger = Framework.Log.getLogger({
    loggerName: "Activity"
});

export interface IFrequency {
    displayName: string;
    unit: string;
    interval?: number;
}

export interface IDeployableActivity {
    displayName: KnockoutObservable<string>;
    description: KnockoutObservable<string>;
    frequency: KnockoutObservable<IFrequency>;
}

export class Frequencies {
    public static yearly: IFrequency = {
        displayName: "Yearly",
        unit: "month",
        interval: 12
    };

    public static monthly: IFrequency = {
        displayName: "Monthly",
        unit: "month"
    };

    public static weekly: IFrequency = {
        displayName: "Weekly",
        unit: "week"
    };

    public static daily: IFrequency = {
        displayName: "Daily",
        unit: "day"
    };

    public static hourly: IFrequency = {
        displayName: "Hourly",
        unit: "hour"
    };

    public static everyMinute: IFrequency = {
        displayName: "Every minute",
        unit: "minute"
    };
}

export abstract class ActivityViewModel extends Shared.Base.BaseViewModel {
    public description: KnockoutObservable<string>;
    public frequency: KnockoutObservable<IFrequency> = ko.observable(null);

    constructor(authoringEntity: EntityStore.IActivityEntity) {
        super(authoringEntity.model.name, authoringEntity.model.type, authoringEntity);
        this.icon(Framework.Svg.activity);
    }
}

export class ActivityNode extends Shared.Base.BaseExtensionConfig {
    public static width = 232;
    public static height = 160;
    public viewModel: ActivityViewModel;

    constructor(authoringEntity: EntityStore.IActivityEntity) {
        super(authoringEntity.model.name(), ActivityNode.width, ActivityNode.height);
    }
}
