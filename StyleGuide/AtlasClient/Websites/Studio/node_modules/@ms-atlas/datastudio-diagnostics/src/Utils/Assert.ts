/// <reference path="TypeInfo.ts" />

module Microsoft.DataStudio.Diagnostics.Assert {

    export function argumentIsObject(val: any, parameterName: string) {
        if (!TypeInfo.isObject(val)) {
            throw new TypeError("The argument '" + parameterName + "' should be an object.");
        }
    }

    export function argumentIsString(val: any, parameterName: string) {
        if (!TypeInfo.isString(val)) {
            throw new TypeError("The argument '" + parameterName + "' should be a string.");
        }
    }
}
