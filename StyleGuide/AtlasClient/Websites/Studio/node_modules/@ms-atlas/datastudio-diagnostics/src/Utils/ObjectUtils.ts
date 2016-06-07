/// <reference path="TypeInfo.ts" />
/// <reference path="Assert.ts" />

module Microsoft.DataStudio.Diagnostics.ObjectUtils {

    export function objectOrUndefined(val: any): Object {
        return TypeInfo.isObject(val) ? val : undefined;
    }

    export function stringOrDefault(val: any, defaultVal: string = null): string {
        return TypeInfo.isString(val) && val != "" ? val : defaultVal;
    }

    export function numberOrDefault(val: any, defaultVal: number = 0): number {
        return TypeInfo.isNumber(val) ? val : defaultVal;
    }

    export function forEachDefined(obj: Object, callback: (name: string, value: any) => void): void {
        Assert.argumentIsObject(obj, "obj");

        Object.getOwnPropertyNames(obj).forEach(propertyName => {
            if (TypeInfo.isDefined(obj[propertyName])) {
                callback(propertyName, obj[propertyName]);
            }
        });
    }

    export function update(targetObject: Object, updateObject: Object, updateDefined: boolean = true): void {
        Assert.argumentIsObject(targetObject, "targetObject");
        _update(targetObject, updateObject, updateDefined);
    }

    function _update(targetObject: Object, updateObject: Object, updateDefined: boolean): void {
        if (TypeInfo.isObject(updateObject)) {
            forEachDefined(updateObject, (name, value) => {
                if (updateDefined || TypeInfo.isUndefined(targetObject[name]))
                    targetObject[name] = value;
            });
        }
    }

    export function merge(...mergeObjects: Object[]): Object {
        return mergeFromArray(mergeObjects);
    }

    export function mergeFromArray(mergeObjects: Object[]): Object {
        var targetObject = {};

        for (var i = 0; i < mergeObjects.length; i++) {
            _update(targetObject, mergeObjects[i], true);
        }

        return targetObject;
    }

    export function serialize(object: any, space?: any): string {
        var stack: any[] = [];
        var keys: string[] = [];

        function circularReplacer(key: string, value: any): any {
            if (stack.length > 0) {
                var thisPos = stack.indexOf(this);

                ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
                ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);

                if (~stack.indexOf(value)) {
                    value = null;
                }
            } else {
                stack.push(value);
            }

            return value;
        }

        function errorReplacer(key: string, value: any): any {
            if (value instanceof Error) {
                var errorObj: Error = {
                    name: (<Error>value).name,
                    message: (<Error>value).message
                };

                update(errorObj, value);
                return errorObj;
            }

            return value;
        }

        function composeReplacer(key: string, value: any): any {
            return errorReplacer(key, circularReplacer(key, value));
        }

        return JSON.stringify(object, composeReplacer, space);
    }
}
