/// <reference path="../../../../References.d.ts" />

import Datetime = require("../../Util/DateTime");
import Command = require("../../UI/Command");
import Svg = require("../../../../_generated/Svg");

export interface IProperty {
    propertyName: string;
    templateName: string;
    editable?: boolean;
    showEmpty?: boolean;
    invalid?: KnockoutObservable<boolean>;
    required?: boolean;
    hidden?: KnockoutObservable<boolean>;
    customClass?: string;
}

export interface ISelectProperty<T> {
    options: KnockoutObservableArray<T>;
    optionsText?: string;
    setDefault?: boolean;
    value: KnockoutObservable<T>;
}

export interface IRadioGroupProperty<T> {
    radioOptions: KnockoutObservableArray<IRadioProperty<T>>;
    value: KnockoutObservable<T>;
}

export interface IRadioProperty<T> {
    label: KnockoutObservable<string>;
    value: KnockoutObservable<T>;
    checked: KnockoutObservable<boolean>;
}

export interface ITablePropertyValue {
    columns: KnockoutObservable<string[]>;
    rows: KnockoutObservableArray<KnockoutObservable<string>[]>;
}

export interface IPropertyArgs {
    name: string;
    valueAccessor: IPropertyValueAccessor;
    input?: boolean;
    textArea?: boolean;
    showEmpty?: boolean;
    editable?: boolean;
    copy?: boolean;
    required?: boolean;
    hidden?: boolean;
    customClass?: string;
}

export interface IPropertyGroup {
    name: string | KnockoutObservable<string>;
    type: string;
    properties: IProperty[];
    altName?: string;
}

export class Property implements IProperty {
    public propertyName: string;
    public templateName: string;
    public editable: boolean = false;
    public required: boolean = false;
    public hidden: KnockoutObservable<boolean> = ko.observable(false);
    public customClass: string = "";

    constructor(name: string, templateName: string) {
        this.propertyName = name;
        this.templateName = templateName;
    }
}

// note: the actual templates live inside of Properties.html
const propertyTemplateNames = {
    default: "default",
    input: "input",
    textArea: "textArea",
    select: "select",
    table: "table",
    dateRange: "dateRange",
    radioGroup: "radioGroup",
    checkBox: "checkBox"
};

export class DefaultProperty extends Property {
    public value: KnockoutObservable<string>;
    public alt: string = null;
    public displayedValue: KnockoutComputed<string> = ko.pureComputed(() => {
        return this.value() ? this.value() : ClientResources.emptyFieldPlaceholder;
    });

    constructor(name: string) {
        super(name, propertyTemplateNames.default);
    }
}

export class InputProperty extends Property {
    public value: KnockoutObservable<string>;
    public alt: KnockoutObservable<string> = ko.observable(null);
    public copy: boolean = true;
    public invalid: KnockoutObservable<boolean>;

    public uiConfig = {
        droppable: {
            drop: (event, ui) => {
                this.value(ui.draggable.text());
            }
        }
    };

    constructor(name: string, template: string = propertyTemplateNames.input) {
        super(name, template);

        this.invalid = ko.pureComputed(() => {
            return this.required && !this.value();
        });
    }
}

export class TextAreaProperty extends InputProperty {
    constructor(name: string) {
        super(name, propertyTemplateNames.textArea);
    }
}

export class CheckBoxProperty extends Property {
    public checked: KnockoutObservable<boolean>;

    constructor(name: string, checked: KnockoutObservable<boolean>) {
        super(name, propertyTemplateNames.checkBox);
        this.checked = checked;
    }
}

export class SelectProperty<T> extends Property implements ISelectProperty<T> {
    public options: KnockoutObservableArray<T>;
    public optionsText: string;
    public value: KnockoutObservable<T>;
    public invalid: KnockoutObservable<boolean>;
    public setDefault: boolean;

    public static CreateProperty<U>(name: string, select: ISelectProperty<U>): SelectProperty<U> {
        if (typeof select.options === "undefined") {
            return null;
        }

        return new SelectProperty<U>(name, select);
    }

    constructor(name: string, select: ISelectProperty<T>) {
        super(name, propertyTemplateNames.select);

        this.options = select.options;
        this.value = select.value;
        this.optionsText = select.optionsText || null;
        this.setDefault = select.setDefault || false;

        if (this.setDefault && this.value() === null && this.options().length > 0) {
            this.value(this.options()[0]);
        }

        this.invalid = ko.pureComputed(() => {
            return this.required && !this.value();
        });
    }
}

export class RadioGroupProperty<T> extends Property implements IRadioGroupProperty<T> {
    public radioOptions: KnockoutObservableArray<IRadioProperty<T>>;
    public value: KnockoutObservable<T>;

    public static CreateProperty<U>(name: string, radioGroup: IRadioGroupProperty<U>): RadioGroupProperty<U> {
        if (typeof radioGroup.radioOptions === "undefined") {
            return null;
        }

        return new RadioGroupProperty<U>(name, radioGroup);
    }

    constructor(name: string, select: IRadioGroupProperty<T>) {
        super(name, propertyTemplateNames.radioGroup);

        this.radioOptions = select.radioOptions;

        let checkedValues = this.radioOptions().filter((option) => {
            return option.checked();
        });

        if (checkedValues.length !== 1) {
            throw new Error("RadioGroupProperty: There should be exactly 1 radio option checked initially, but instead there are {0}.".format(checkedValues.length));
}

        this.value = ko.observable(checkedValues[0].value());
    }
}

export class TableProperty extends Property {
    public table: ITablePropertyValue;

    public deleteRow = (index: number) => {
        this.table.rows.splice(index, 1);

    };
    public addRow = () => {
        let newRow = [];

        for (let i = 0; i < this.table.columns().length; i++) {
            newRow.push(ko.observable(null));
        }

        this.table.rows.push(newRow);
    };

    private addButton: Command.ObservableCommand;

    // used in html
    /* tslint:disable:no-unused-variable */
    private deleteButton = (row: number): Command.ObservableCommand => {
        return new Command.ObservableCommand({
            tooltip: ClientResources.deleteRowPropertyTooltip,
            icon: Svg.close,
            onclick: () => {
                this.deleteRow(row);
            }
        });
    };
    /* tslint:enable:no-unused-variable */

    public static CreateProperty(name: string, table: ITablePropertyValue): TableProperty {
        if (typeof table.rows === "undefined") {
            return null;
        }

        return new TableProperty(name, table);
    }

    constructor(name: string, table: ITablePropertyValue) {
        super(name, propertyTemplateNames.table);

        this.table = table;

        this.addButton = new Command.ObservableCommand({
            tooltip: ClientResources.addRowPropertyTooltip,
            onclick: this.addRow,
            label: ClientResources.addRowPropertyLabel
        });
    }
}

export class DateRangeProperty extends Property {
    public dateRange: KnockoutObservable<Datetime.IDateRange>;
    public isReady: KnockoutObservable<boolean> = ko.observable(false);

    public static CreateProperty(name: string, dateRange: KnockoutObservable<Datetime.IDateRange>): DateRangeProperty {
        if (!ko.isObservable(dateRange) || typeof ko.unwrap(dateRange).endDate === "undefined") {
            return null;
        }

        return new DateRangeProperty(name, dateRange);
    }

    constructor(name: string, dateRange: KnockoutObservable<Datetime.IDateRange>) {
        super(name, propertyTemplateNames.dateRange);

        this.dateRange = dateRange;
    }
}

// all the possible value accessors
export type IPropertyValueAccessor = () => KnockoutObservable<Datetime.IDateRange> | ITablePropertyValue | ISelectProperty<Object>
    | IRadioGroupProperty<Object> | string | string[] | KnockoutObservable<string> | KnockoutObservable<string>[] | KnockoutObservable<boolean>;
