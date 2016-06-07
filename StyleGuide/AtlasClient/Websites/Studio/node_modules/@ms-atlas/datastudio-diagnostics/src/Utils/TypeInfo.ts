module Microsoft.DataStudio.Diagnostics.TypeInfo {

    export function isUndefined(val: any): boolean {
        return val === undefined;
    }

    export function isDefined(val: any): boolean {
        return val !== undefined;
    }

    export function isNull(val: any): boolean {
        return val === null;
    }

    export function isObject(val: any): boolean {
        return typeof val == "object" && val !== null;
    }

    export function isString(val: any): boolean {
        return typeof val == "string";
    }

    export function isNumber(val: any): boolean {
        return typeof val == "number";
    }

    export function isGuid(val: any): boolean {
        if (!isString(val))
            return false;

        var guidRegex = /^\{?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}?$/;
        return guidRegex.test(String(val));
    }
}
