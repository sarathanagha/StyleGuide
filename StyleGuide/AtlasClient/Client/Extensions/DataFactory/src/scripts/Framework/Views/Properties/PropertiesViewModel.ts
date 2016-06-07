/// <reference path="../../../../References.d.ts" />

/// <amd-dependency path="css!./Properties.css" />
/// <amd-dependency path="text!./Properties.html" />

/* tslint:disable:no-var-requires */
export const template: string = require("text!./Properties.html");
/* tslint:enable:no-var-requires */

import AppContext = require("../../../AppContext");
import Framework = require("../../../../_generated/Framework");
import Log = Framework.Log;
import Util = Framework.Util;
import Datetime = Framework.Datetime;
import Command = Framework.Command;
export import PropertyTypes = require("./PropertyTypes");

let logger = Log.getLogger({
    loggerName: "PropertiesViewModel"
});

export interface IDisplayPropertyGroup extends PropertyTypes.IPropertyGroup {
    expanded: KnockoutObservable<boolean>;
    hideHeader: boolean;
}

export type PropertyGroupPromise = Q.Promise<IDisplayPropertyGroup>;

export interface IHasDisplayProperties {
    getPropertyGroup: () => PropertyGroupPromise;
}

export abstract class PropertiesViewModel extends Framework.Disposable.RootDisposable {
    public static viewName: string = "PropertiesViewModel";

    public collapseUpIcon: string;
    public collapseDownIcon: string;
    public loading: KnockoutObservable<boolean> = ko.observable(true);
    public emptyMessage: KnockoutObservable<string> = ko.observable(ClientResources.noPropertiesMessage);

    public panelTitle: string = ClientResources.propertiesTitle;

    public propertyGroups: KnockoutObservableArray<IDisplayPropertyGroup> = ko.observableArray<IDisplayPropertyGroup>([]);

    public refreshButton: Command.ObservableCommand;

    public toggleExpanded = (data: IDisplayPropertyGroup, event: MouseEvent) => {
        data.expanded(!data.expanded());
    };

    public _refreshId: number = 0;

    public _inputs: StringMap<void> = {};

    // names where the property tokens should be in reverse order
    public _reversalNames: StringMap<void> = {};

    // names where the token should be ignored
    public _ignoreNames: StringMap<void> = {};

    public _replacementNames: StringMap<string> = {};

    public _appContext: AppContext.AppContext;

    /* tslint:disable:no-unused-variable Used in Properties.html */
    private _copyText = (property: PropertyTypes.InputProperty, event: MouseEvent) => {
        let copyTextarea = $(event.target).siblings("input")[0];
        (<HTMLInputElement>copyTextarea).select();

        let succeeded = Util.copySelectedText(property.value());

        if (!succeeded) {
            // Fallback for when copying isn't supported
            window.prompt(ClientResources.clipboardFallbackMessage, property.value());
        } else {
            this._appContext.flyoutHandler.addRequest({ anchor: <HTMLElement>event.target, innerHTML: ClientResources.copySuccessful, timeout: 1000 });
        }
    };
    /* tslint:enable:no-unused-variable */

    constructor() {
        super();

        this._appContext = AppContext.AppContext.getInstance();

        this.refreshButton = new Command.ObservableCommand({
            icon: Framework.Svg.refresh,
            tooltip: ClientResources.activityRunDetailsRefreshTooltip,
            onclick: () => {
                this._refresh();
            }
        });

        this.collapseUpIcon = Framework.Svg.collapseUp;
        this.collapseDownIcon = Framework.Svg.collapseDown;
    }

    public static getPropertyGroups(objects: IHasDisplayProperties[]): PropertyGroupPromise[] {
        return objects.filter((object) => {
            return object.hasOwnProperty("getPropertyGroup");
        }).map((object) => {
            return object.getPropertyGroup();
        });
    }

    public static _returnObject(object) {
        return () => { return object; };
    }

    public static _returnBool(bool) {
        return () => { return bool ? ClientResources.Yes : ClientResources.No; };
    }

    public static _returnDate(dateStr: string) {
        let pair = Datetime.getTimePair(dateStr);

        return () => { return [pair.UTC, pair.UTC]; };
    }

    public static _returnTimePair(pair: Datetime.ITimePair) {
        return () => { return [pair.UTC, pair.UTC]; };
    }

    // removes camel case from strings (assuming that they start out as camel case)
    public static _removeCamelCase(str: string): string {
        // this can't be camelcase, so we return it unchanged immediately
        if (str[0] === str[0].toUpperCase()) {
            return str;
        }

        str = str.replace(/([A-Z])/g, " $1");
        str = str[0].toUpperCase() + str.substr(1);
        return str;
    }

    // we either return an explict opposite of the default or just the default
    public static argValue(argValue: boolean, defaultValue: boolean) {
        return argValue === !defaultValue ? argValue : defaultValue;
    }

    public static _addProperty(property: PropertyTypes.IPropertyArgs): PropertyTypes.IProperty
    public static _addProperty(name: string, valueAccessor: PropertyTypes.IPropertyValueAccessor): PropertyTypes.IProperty
    public static _addProperty(name: string, valueAccessor: PropertyTypes.IPropertyValueAccessor, required: boolean): PropertyTypes.IProperty
    public static _addProperty(name: string, valueAccessor: PropertyTypes.IPropertyValueAccessor, isInput: boolean, showEmpty: boolean): PropertyTypes.IProperty
    public static _addProperty(): PropertyTypes.IProperty {
        let name: string,
            value: string | KnockoutObservable<string> = ClientResources.emptyFieldPlaceholder,
            alt: string | KnockoutObservable<string> = null,
            valueAccessor: PropertyTypes.IPropertyValueAccessor,
            isInput: boolean = false,
            showEmpty: boolean = true,
            isTextArea: boolean = false,
            customClass: string = "",
            editable: boolean = false,
            copy: boolean = true,
            required: boolean = false,
            hidden: boolean = false;

        switch (arguments.length) {
            case 1:
                let args = <PropertyTypes.IPropertyArgs>arguments[0];
                name = args.name;
                valueAccessor = args.valueAccessor;

                // optional args
                isInput = this.argValue(args.input, isInput);
                showEmpty = this.argValue(args.showEmpty, showEmpty);
                editable = this.argValue(args.editable, editable);
                copy = this.argValue(args.copy, copy);
                required = this.argValue(args.required, required);
                isTextArea = this.argValue(args.textArea, isTextArea);
                hidden = this.argValue(args.hidden, hidden);
                customClass = args.customClass || customClass;
                break;

            case 2:
                name = arguments[0];
                valueAccessor = arguments[1];
                break;

            case 3:
                name = arguments[0];
                valueAccessor = arguments[1];
                required = arguments[2];
                break;

            // all of the args
            case 4:
                name = arguments[0];
                valueAccessor = arguments[1];
                isInput = arguments[2];
                showEmpty = arguments[3];
                break;

            default:
                logger.logError("Unexpected number of arguments: " + arguments.length);
                return;
        }

        try {
            let result = valueAccessor();
            let property: PropertyTypes.IProperty = null;

            let updateProperty = (newProperty: PropertyTypes.IProperty) => {
                newProperty.required = required;
                newProperty.editable = editable;
                newProperty.hidden(hidden);
                newProperty.customClass = customClass;

                return newProperty;
            };

            if (ko.isObservable(result) && typeof (<KnockoutObservable<boolean>>result)() === "boolean") {
                property = new PropertyTypes.CheckBoxProperty(name, <KnockoutObservable<boolean>>result);
                if (property) {
                    return updateProperty(property);
                }
            }

            property = PropertyTypes.SelectProperty.CreateProperty(name, <PropertyTypes.ISelectProperty<Object>>result);
            if (property) {
                return updateProperty(property);
            }

            property = PropertyTypes.DateRangeProperty.CreateProperty(name, <KnockoutObservable<Datetime.IDateRange>>result);
            if (property) {
                return updateProperty(property);
            }

            property = PropertyTypes.TableProperty.CreateProperty(name, <PropertyTypes.ITablePropertyValue>result);
            if (property) {
                return updateProperty(property);
            }

            property = PropertyTypes.RadioGroupProperty.CreateProperty(name, <PropertyTypes.IRadioGroupProperty<Object>>result);
            if (property) {
                return updateProperty(property);
            }

            if (result instanceof Array) {
                value = (<Array<string>>result)[0];
                alt = (<Array<string>>result)[1];
            } else if (typeof result !== "undefined" && result !== null) {
                if (result === "") {
                    if (!showEmpty) {
                        return null;
                    }
                } else {
                    // We received an actual value
                    value = <string>result;
                }
            }
        } catch (e) {
            // Just ignore the property completely
            if (!showEmpty) {
                return null;
            }

            // No input with the empty string
            isInput = false;
        }

        if (isInput || isTextArea) {
            let input = isInput ? new PropertyTypes.InputProperty(name) : new PropertyTypes.TextAreaProperty(name);
            input.value = <KnockoutObservable<string>>(ko.isObservable(value) ? value : ko.observable(value));
            input.alt = <KnockoutObservable<string>>(ko.isObservable(alt) ? alt : ko.observable(alt));
            input.editable = editable;
            input.copy = copy;
            input.required = required;
            input.hidden(hidden);
            input.customClass = customClass;

            return input;
        }

        // it must be a default property
        let property = new PropertyTypes.DefaultProperty(name);
        property.value = <KnockoutObservable<string>>(ko.isObservable(value) ? value : ko.observable(value));
        property.alt = ko.unwrap(alt);
        property.customClass = customClass;

        return property;
    }

    public abstract _refresh(): void;

    public _addAllProperties(object: Object, excludeArg: StringMap<void> | string[] = {}, propNames: string[] = []): PropertyTypes.IProperty[] {
        let properties: PropertyTypes.IProperty[] = [];

        object = ko.unwrap(object);

        let exclude: StringMap<void> = <StringMap<void>>excludeArg;

        // convert the arg into a stringmap if it is an array
        if (excludeArg instanceof Array) {
            exclude = {};

            excludeArg.forEach((key) => {
                exclude[key] = null;
            });
        }

        for (let propName in object) {
            if (propName in exclude) {
                continue;
            }

            // we garuantee that property is not an observable
            let prop = ko.unwrap(object[propName]);

            // nothing we can do with any of these properties
            if (prop === null || typeof prop === "undefined" || typeof prop === "function") {
                continue;
            }

            let isInput = propName in this._inputs;

            // property names should be in sentence case by default
            propName = PropertiesViewModel._removeCamelCase(propName);

            // deep copy propNames
            let newPropNames = propNames.slice(0);

            // the final name that will be associated with this property
            let displayName: string = this._createDisplayName(propName, newPropNames);

            // now we add the actual property based on its type,
            // or recursively add its subproperties if its an object
            switch (typeof prop) {
                case "number":
                case "string":
                    // if this looks like a date and parses as a date, convert it into a date and add it
                    let date: number | string = Date.parse(prop);
                    if (/Z$/.test(prop) && date !== "Invalid Date" && !isNaN(<number>date)) {
                        properties.push(PropertiesViewModel._addProperty(displayName, PropertiesViewModel._returnDate(prop)));
                    } else {
                        // otherwise, we just add the basic type directly
                        properties.push(PropertiesViewModel._addProperty(displayName, PropertiesViewModel._returnObject(prop), isInput, true));
                    }
                    break;
                case "boolean":
                    // we can directly add these
                    properties.push(PropertiesViewModel._addProperty(displayName, PropertiesViewModel._returnBool(prop)));
                    break;
                // the only other type this can now be is an object
                default:
                    // check to see if it's a time pair object (because we display that differently)
                    if ((<Datetime.ITimePair>prop).UTC && (<Datetime.ITimePair>prop).local) {
                        // We have a special case for ITimePairs because we can display them elegantly
                        properties.push(PropertiesViewModel._addProperty(displayName, PropertiesViewModel._returnTimePair(prop), isInput, true));
                        break;
                    }

                    // otherwise, we recursively add to the list of properties
                    properties = properties.concat(this._addAllProperties(prop, exclude, newPropNames));
            }
        }

        return properties;
    }

    // create the final name that will be associated with a new property
    private _createDisplayName(propName: string, newPropNames: string[]) {
        let displayName: string;

        // if the name is in this map, ignore all pervious names and just display the current propname
        if (propName in this._ignoreNames) {
            displayName = propName;
        } else {
            // if the name is in this map, do a one to one replacement
            if (propName in this._replacementNames) {
                propName = this._replacementNames[propName];
            }

            newPropNames.push(propName);

            // if we have exactly two names and they should be swap, swap them
            if (newPropNames.length === 2 && newPropNames[0] in this._reversalNames) {
                newPropNames = newPropNames.reverse();
            }

            // create the final display name
            displayName = newPropNames.join(" ");
        }

        return displayName;
    };
}
