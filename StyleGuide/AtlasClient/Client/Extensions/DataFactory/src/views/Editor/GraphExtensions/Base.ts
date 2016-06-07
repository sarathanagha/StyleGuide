/* Child Types */
/// <amd-dependency path="text!./Templates/Base.html" />
/// <amd-dependency path="css!./Templates/Base.css" />

import {ModelTypes, IEntity, IMetadata} from "../../../scripts/Framework/Model/Authoring/EntityStore";
import {GraphContracts} from "./Shared";
import {Svg} from "../../../_generated/Framework";

/* tslint:disable:no-var-requires */
export const baseTemplate: string = require("text!./Templates/Base.html");
/* tslint:enable:no-var-requires */

export class BaseViewModel {
    public authoringEntity: IEntity<ModelTypes, IMetadata>;
    public displayName: KnockoutObservable<string>;
    public displayType: KnockoutObservable<string>;
    public placeholderName: KnockoutObservable<string>;
    // TODO iannight: reconcile these with the authoring entity's state machine and use that instead
    public valid: KnockoutObservable<boolean>;
    public finished: KnockoutObservable<boolean>;
    public icon: KnockoutObservableBase<Object>;

    // Should be overwritten in the children
    public displayClasses = ko.pureComputed(() => { return ""; });

    public keyPress = (ignore: Object, event: Event) => {
        event.stopPropagation();
    };

    /* tslint:disable:no-unused-variable used in template */
    public statusIcon = ko.pureComputed(() => {
    /* tslint:enable:no-unused-variable */

        if (this.finished()) {
            return this.valid() ? Svg.statusReady : Svg.statusFailed;
        }

        return Svg.status_warning;
    });

    /* TODO tilarden: authoringEntity is optional for the initial check-in to reduce the size of the change.
     * In a future change, we will remove the 'name' and 'type' params from this contructor, and instead
     * get these values directly from the authoringEntity object.
     */
    constructor(name: KnockoutObservable<string>, type: KnockoutObservable<string>, authoringEntity?: IEntity<ModelTypes, IMetadata>) {
        this.authoringEntity = authoringEntity;
        this.displayName = name;
        this.displayType = type;
        this.placeholderName = name;
        this.valid = ko.observable(null);
        this.finished = ko.observable(null);
        this.icon = ko.observable(null);
    }
}

export class BaseExtensionConfig implements GraphContracts.IExtensionConfig {
    public template = baseTemplate;
    public viewModel: BaseViewModel;
    public acceptedTypes: string[] = [];
    public types: string[] = [];
    public initialRect: GraphContracts.IRect;

    constructor(name: string, width: number, height: number) {
        this.initialRect = { x: 0, y: 0, width: width, height: height };
    }
}
