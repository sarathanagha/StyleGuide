/// <amd-dependency path="css!./CSS/ParameterGroups.css" />
/// <amd-dependency path="text!./Templates/ParameterGroupsTemplate.html" />

import {ValidatedBoxViewModel} from "./FormFields";
import {getLogger} from "../scripts/Framework/Util/Log";
import {IObservableArrayChange, ObsArrayChangeStatus} from "../scripts/Framework/Shared/DataConstants";

let logger = getLogger({
    loggerName: "ParameterGroupsBinding"
});

export interface IParamPair {
    key: KnockoutObservable<string>;
    value: KnockoutObservable<string>;
}

export interface IGroup {
    title: string;
    params: KnockoutObservableArray<IParamPair>;
}

export interface IValidatedParam extends IParamPair {
    form: ValidatedBoxViewModel<string>;
}

export interface IGroupWithForm extends IGroup {
    params: KnockoutObservableArray<IValidatedParam>;
}

export interface IParameterGroupsValueAccessor {
    readOnly: boolean;
    paramGroups: KnockoutObservableArray<IGroup>;
}

export class ParameterGroupsBinding implements KnockoutBindingHandler {
    public static className = "parameterGroups";
    public static template = require("text!./Templates/ParameterGroupsTemplate.html");

    public init(
        element: HTMLElement,
        valueAccessor: () => IParameterGroupsValueAccessor,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        let parameterViewModel = new ParameterGroupsViewModel(valueAccessor().readOnly, valueAccessor().paramGroups);
        element.innerHTML = ParameterGroupsBinding.template;
        ko.applyBindingsToDescendants(parameterViewModel, element);
        return { controlsDescendantBindings: true };
    }
}

class ParameterGroupsViewModel {

    public paramNameHeading = ClientResources.paramNameHeading;
    public paramValueHeading = ClientResources.paramValueHeading;
    public groups: KnockoutObservableArray<IGroupWithForm> = ko.observableArray<IGroupWithForm>();
    public readOnly: KnockoutObservable<boolean> = ko.observable<boolean>(); // TODO support internal deletion and key form field if false

    constructor(readOnly: boolean, paramGroups: KnockoutObservableArray<IGroup> ) {

        this.readOnly(readOnly);

        paramGroups.subscribe(this.initializeNewGroups, this);
        this.initializeNewGroups(paramGroups());
    }

    private initializeNewGroups(updatedList: IGroup[]) {
        updatedList.forEach((group: IGroup) => {
            if (!this.groups().some((groupWithForm: IGroupWithForm) => {
                return groupWithForm.title === group.title;
            })) {
                this.addGroup(group);
            }
        });
    }

    private addGroup(group: IGroup): void {
        let validatedParams = ko.observableArray<IValidatedParam>();

        group.params().forEach((param) => {
            this.addParam(param, validatedParams);
        });
        this.groups.push({ title: group.title, params: validatedParams });

        group.params.subscribe((arrayUpdates: IObservableArrayChange<IParamPair>[]) => {
            let existingGroup: IGroupWithForm;
            this.groups().forEach((groupWithForm: IGroupWithForm) => {
                if (group.title === groupWithForm.title) {
                    existingGroup = groupWithForm;
                    return;
                }
            });

            if (existingGroup) {
                arrayUpdates.forEach((arrayChange: IObservableArrayChange<IParamPair>) => {
                    if (arrayChange.moved || arrayChange.moved === 0) {
                        logger.logError("Group parameters should not be moved");
                    } else if (arrayChange.status === ObsArrayChangeStatus.added) {
                        this.addParam(arrayChange.value, existingGroup.params);
                    } else if (arrayChange.status === ObsArrayChangeStatus.deleted) {
                        existingGroup.params().forEach((validatedParam: IValidatedParam) => {
                            if (validatedParam.key === arrayChange.value.key) {
                                existingGroup.params.remove(validatedParam);
                                return;
                            }
                        });
                    } else {
                        logger.logError("Unrecognized ko arrayChange status: " + arrayChange.status);
                    }
                });
            } else {
                logger.logError("Group with title " + group.title + " was expected in paramter binding groups but was not found.");
            }
        }, null, "arrayChange");
    }

    private addParam(param: IParamPair, destination: KnockoutObservableArray<IValidatedParam>): void {
        let newParam: IValidatedParam = {
            key: param.key,
            value: param.value,
            form: new ValidatedBoxViewModel<string>({
                label: "",
                defaultValue: param.value()
            })
        };

        newParam.form.value.subscribe(param.value);
        destination.push(newParam);
    }
}
