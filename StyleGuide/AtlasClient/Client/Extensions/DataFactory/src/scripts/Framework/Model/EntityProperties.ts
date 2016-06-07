import Datetime = require("../Util/Datetime");
import Pipeline = require("./Contracts/Pipeline");

export class PipelineProperties {
    public name: KnockoutObservable<string>;
    public nameEditable: boolean;
    public description: KnockoutObservable<string>;
    public isPaused: KnockoutObservable<boolean>;
    public mode: KnockoutObservable<string>;
    public activePeriod: KnockoutComputed<Datetime.IDateRange>;

    public isOneTimePipeline = ko.pureComputed(() => {
        return this.mode() === Pipeline.PipelineMode.OneTime;
    });

    // TODO yikei: Reconcile with IEntity model.
    constructor() {
        let now = new Date();
        this.name = ko.observable("Pipeline-" + now.getTime() % 1000);
        this.nameEditable = true;
        this.description = ko.observable(ClientResources.pipelineDescriptionPlaceholderText);
        this.isPaused = ko.observable(false);
        // yikei: Temporarily setting to scheduled by default.
        this.mode = ko.observable(Pipeline.PipelineMode.Scheduled);
        this.activePeriod = Datetime.getDateRangeObservable({
            startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()),
            endDate: new Date(2099, now.getMonth(), now.getDate(), now.getHours())
        });
    }

    public deployedPipelineName(pipelineName: string): void {
        this.name(pipelineName);
        this.nameEditable = false;
    }
}
