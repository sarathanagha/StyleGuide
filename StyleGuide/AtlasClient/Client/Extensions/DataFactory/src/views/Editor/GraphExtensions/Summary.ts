/// <amd-dependency path="text!./Templates/Summary.html" />
/// <amd-dependency path="css!./Templates/Base.css" />

import Shared = require("./Shared");
import PropertiesViewModel = require("../../../scripts/Framework/Views/Properties/PropertiesViewModel");

export interface ICount {
    icon: string;
    count: KnockoutObservable<number>;
}

export class SummaryViewModel<T> implements PropertiesViewModel.IHasDisplayProperties {
    public expanded: KnockoutObservable<boolean>;

    public displayClasses: KnockoutObservable<string> = ko.observable("");

    public subCollections: ICount[] = [];

    protected _summaryText: KnockoutObservable<string> = ko.observable("");
    protected _summaryIcon: KnockoutObservable<string> = ko.observable("");

    public updateSummary(viewModels: T[]): void {
        // noop
    }

    public getPropertyGroup() {
        return null;
    };
}

export class SummaryExtensionConfig<T> implements Shared.GraphContracts.ISummaryExtensionConfig {
    public template: string = require("text!./Templates/Summary.html");
    public viewModel: SummaryViewModel<T>;
    public initialRect: Shared.GraphContracts.IRect;
}
